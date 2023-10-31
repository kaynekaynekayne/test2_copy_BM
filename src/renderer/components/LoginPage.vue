<template>
  <b-container id="loginPage" class="w-100" fluid @keyup.enter="login">
    <img id="imgLogo" src="~@/assets/login/logo.png" alt="logo">
    <div id="divInputForm">
      <b-row>
        <b-col class="pl-1 pr-1" cols="4">
          USER ID
        </b-col>
        <b-col class="pl-1 pr-1" cols="5">
          <input type="text" class="custom-white-input border" placeholder="User ID" v-model="modelData.userId">
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col class="pl-1 pr-1" cols="4">
          PASSWORD
        </b-col>
        <b-col class="pl-1 pr-1" cols="5">
          <input type="password" class="custom-white-input border" placeholder="Password" v-model="modelData.password">
        </b-col>
      </b-row>
      <b-row class="p-0">
        <b-col class="p-0">
          <div v-if="modelData.isLoginError" id="divError" class="mt-2" style="color: red;">Your login attempt was not successful due to Bad credentiais</div>
          <div v-else id="divError" class="mt-2" style="color: red;"></div>
        </b-col>
      </b-row>
      <b-row class="mt-1">
        <b-col class="pl-1 pr-1">
          <b-form-checkbox
            id="remenberMe"
            v-model="modelData.isRememberMe"
            name="remenberMe"
          >
            Save login profile
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="pl-1 pr-1">
          <b-form-checkbox
            id="autoLogin"
            v-model="modelData.isAutoLogin"
            name="autoLogin"
          >
            Automatic login at startup
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col class="pl-1 pr-1" cols="9">
          <b-button v-if="!modelData.isLoginError" id="btnLogin" class="custom-blue-btn" block @click="login">Login</b-button>
          <b-button v-else id="btnLogin" class="custom-red-btn" block @click="login">Login</b-button>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col class="pl-1 pr-1" cols="9">
          <b-button id="btnSignUp" class="custom-white-btn" block @click="signup">User Registration</b-button>
        </b-col>
      </b-row>
    </div>
    <div class="position-absolute pointer" style="bottom: 20px;" @click="onPowerOff">
      <img src="~@/assets/login/ic_power_settings_new_white_48dp.png" style="width: 30px;" />
    </div>
    <div class="position-absolute" style="bottom: 20px; font-size: 13px; right: 20px;">
      {{ appVersionName }}
    </div>
  </b-container>
</template>

<script>
  import ModalSignUp from './Common/ModalSignUp'
  import ModalProgress from './Common/ModalProgress'
  import ModalInfo from './Common/ModalInfo'
  import ModalConfirm from './Common/ModalConfirm'
  import { mapGetters } from 'vuex'
  import Constant from '../../Constant'
  import Configs from '../../Configs'
  import Package from '../../../package.json'
  import worker from '../workers/promise'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const aws = require('aws-sdk')
  const yaml = require('js-yaml')
  const cp = require('child_process')
  const dns = require('dns')

  const ep = new aws.Endpoint(Configs.N_CLOUD_BASE_URL)
  const s3 = new aws.S3({
    endpoint: ep,
    region: Configs.REGION,
    accessKeyId: Configs.NACCESS_KEY,
    secretAccessKey: Configs.NSECRET_KEY
  })

  export default {
    name: 'login-page',
    computed: {
      ...mapGetters([Constant.GET_USER, Constant.GET_SETTINGS])
    },
    beforeDestroy () {
      ipcRenderer.removeAllListeners(Constant.GET_USER_LIST)
      ipcRenderer.removeAllListeners('INIT_DATABASE')
    },
    mounted () {
      var self = this

      console.log('mount login')
      document.getElementById('loginPage').style.height = window.innerHeight + 'px'

      ipcRenderer.send('INIT_DATABASE', {dbPath: this.getSettings.pbiaRootPath})

      ipcRenderer.send(Constant.GET_USER_LIST)
      ipcRenderer.on(Constant.GET_USER_LIST, function (event, result) {
        console.log(result)
        self.$store.dispatch('addUserList', result)
      })

      this.$nextTick(function() {
        this.modelData.isRememberMe = this.getSettings.isRememberMe
        this.modelData.isAutoLogin = this.getSettings.isAutoLogin

        if (this.modelData.isRememberMe) {
          this.modelData.userId = this.getSettings.saveId
          this.modelData.password = this.$CryptoJS.AES.decrypt(this.getSettings.savePassword, Constant.REMEMBER_PWD_KEY).toString(this.$CryptoJS.enc.Utf8)
        }
        // 실행중 -> PC 꺼짐 -> 재실행
        this.$store.dispatch(Constant.UPDATE_RUNNING_STATE, false)
        // 사용자 정지
        this.$store.dispatch(Constant.SET_USER_STOP, false)

        // 업데이트 파일 다운로드 디렉토리 생성
        this.createDownloadDir()

        this.appVersionName = Configs.BUCKET_NAME + '_v' + Package.version

        // 네트워크 연결 체크
        dns.resolve('www.google.com', function(err, addr) {
          console.log(err)
          if (!err) {
            // 버전 체크
            self.checkVersion()
          }
        })
      })
    },
    data () {
      return {
        modelData: {
          userId: '',
          password: '',
          isRememberMe: false,
          isAutoLogin: false,
          isLoginError: false
        },
        installerName: '',
        appVersionName: ''
      }
    },
    methods: {
      sendSettingInfo () {
        var isNsNbIntegration = 'N'
        if (this.getSettings.isNsNbIntegration) {
          isNsNbIntegration = 'Y'
        }

        // 설정 정보 등록
        var params = {
          jobCmd: 'SETTINGS',
          reqUserId: 'system',
          reqDttm: this.$getDateTimeStr(),
          pbiaRootDir: this.getSettings.pbiaRootPath,
          oilCount: this.getSettings.currentOilCount.toString(),
          isOilReset: 'N',
          deviceType: '02',
          uiVersion: this.appVersionName,
          isNsNbIntegration: isNsNbIntegration
        }

        console.log(params)
        worker.sendDataToServer(this, JSON.stringify(params))
      },
      createDownloadDir () {
        // ui exe dir
        if (!fs.existsSync(Configs.DOWNLOAD_PATH)) {
          fs.mkdirSync(Configs.DOWNLOAD_PATH)
        }

        // backend dir
        if (!fs.existsSync(Configs.DOWNLOAD_BACKEND_PATH)) {
          fs.mkdirSync(Configs.DOWNLOAD_BACKEND_PATH)
        }

        // db file dir
        if (!fs.existsSync(this.getSettings.pbiaRootPath.replace('IA_Proc', '') + Configs.DB_FILE_PATH)) {
          fs.mkdirSync(this.getSettings.pbiaRootPath.replace('IA_Proc', '') + Configs.DB_FILE_PATH)
        }
      },
      checkVersion () {
        var self = this

        console.log(Package.version)

        // 다운로드 progress
        self.$modal.show(ModalProgress, {}, {
          height: 'auto',
          clickToClose: false
        })

        var versionParams = {Bucket: Configs.BUCKET_NAME, Key: Configs.LATEST_OBJECT_NAME}
        s3.getObject(versionParams, function(err, latest) {
          if (err) {
            console.log(err.message)
            self.$modal.hideAll()
          } else {
            var doc = yaml.load(latest.Body.toString('utf-8'), 'utf8')

            var latestVersion = Number(self.$replaceAll(doc.version, '.', ''))
            var currentVersion = Number(self.$replaceAll(Package.version, '.', ''))

            console.log(latestVersion)
            console.log(currentVersion)

            if (latestVersion > currentVersion) {
              var folderName = 'BM_' + doc.version
              var filePath = folderName + '/' + doc.path
              var backendPath = folderName + '/' + 'backend/'

              // backend kill
              cp.exec('taskkill /im ' + Configs.INTERFACE_FILE_NM + ' /f', {}, function() {
                console.log('back end killed')
                // backend 목록 조회
                self.getBackendList(backendPath, filePath)
              })

              // self.getObjectMeta(filePath)

              self.EventBus.$emit('VERSION_UPDATE_CHECK', {value: 0, text: 'Checking for updates...'})
            } else {
              self.EventBus.$emit('VERSION_UPDATE_CHECK', {value: 100, text: 'Checking for updates...'})
              self.$modal.hideAll()
            }
          }
        })
      },
      getBackendList (backendPath, filePath) {
        console.log('getBackendList')
        var self = this
        var params = {Bucket: Configs.BUCKET_NAME, Prefix: backendPath}

        s3.listObjectsV2(params, function(err, data) {
          console.log(data)
          if (err) {
            self.$modal.hideAll()
          } else {
            self.downloadObject(data, 0, 'backend', function () {
              console.log('back end download complete')
              // UI 인스톨러 다운로드
              self.getInstaller(filePath)
            })
          }
        })
      },
      getInstaller (prefix) {
        var self = this
        var params = {Bucket: Configs.BUCKET_NAME, Prefix: prefix}
        self.installerName = prefix.split('/')[1]

        s3.listObjectsV2(params, function(err, data) {
          console.log(data)
          if (err) {
            self.$modal.hideAll()
          } else {
            self.downloadObject(data, 0, 'ui', function() {
              console.log('ui download complete')

              self.$modal.hideAll()

              self.$modal.show(ModalInfo, {item: Constant.IDS_RESTART_SYSTEM}, {
                height: 'auto',
                width: '550px',
                clickToClose: false
              }, {
                'before-close': self.updateBeforeClose
              })
            })
          }
        })
      },
      downloadObject (data, keyIndex, type, callback) {
        var self = this

        // 다운로드 완료
        if (keyIndex >= data.KeyCount) {
          callback()

          return
        }

        if (data.Contents[keyIndex].Size <= 0) {
          self.downloadObject(data, ++keyIndex, type, callback)
        } else {
          var savedFilePathArray = data.Contents[keyIndex].Key.split('/')
          var fileName = savedFilePathArray[savedFilePathArray.length - 1]
          if (type === 'ui') {
            var savedFilePath = Configs.DOWNLOAD_PATH + '/' + fileName
          } else {
            var savedFilePath = Configs.DOWNLOAD_BACKEND_PATH + '/' + fileName
          }

          var contentLength = data.Contents[keyIndex].Size
          var outStream = fs.createWriteStream(savedFilePath)
          var params = {Bucket: Configs.BUCKET_NAME, Key: data.Contents[keyIndex].Key}
          var inStream = s3.getObject(params).createReadStream()

          console.log(inStream)

          var downloadSize = 0

          inStream.pipe(outStream)
          inStream.on('data', function(fileData) {
            downloadSize += fileData.length

            var percent = ((downloadSize / contentLength) * 100).toFixed(0)
            self.EventBus.$emit('VERSION_UPDATE_CHECK', {value: Number(percent), text: fileName + ' download data' + '(' + percent + '%)'})
          })
          inStream.on('end', function() {
            self.downloadObject(data, ++keyIndex, type, callback)
          })
          inStream.on('error', function(err) {
            return
          })
        }
      },
      updateBeforeClose () {
        console.log('updateBeforeClose')
        try {
          var self = this

          // 업데이트 파일 실행
          var cmd = cp.spawn('cmd', ['/c', 'start', '""', self.installerName], {cwd: Configs.DOWNLOAD_TASK_PATH})
          cmd.stdout.on('data', function(data) {
            console.log('stdout: ' + data)
          })
          cmd.stderr.on('data', function(data) {
            console.log('stderr: ' + data)
          })
          cmd.on('exit', function(data) {
            console.log('exit: ' + data)
            // 앱종료
            // store.clear()
            worker.norWorker.terminate()
            worker.sysWorker.terminate()
            ipcRenderer.send('SHUTDOWN', {})
          })
        } catch(err) {
          console.log(err)
        }
      },
      login (evt) {
        // 가입 여부 체크
        var user = this.getUser(this.modelData.userId)

        console.log(user)

        if (user !== null && (user.isAvailable === 'Y')) {
          try {
            var decPassword = this.$CryptoJS.AES.decrypt(user.encPassword, this.modelData.password).toString(this.$CryptoJS.enc.Utf8)

            // 패스워드 체크
            if (decPassword !== '' && decPassword !== null && decPassword === this.modelData.password) {
              var endPassword = this.$CryptoJS.AES.encrypt(this.modelData.password, Constant.REMEMBER_PWD_KEY).toString()
              // Remember 아이디, 패스워드 저장
              var obj = {}
              if (this.modelData.isRememberMe || this.modelData.isAutoLogin) {
                obj.isRememberMe = this.modelData.isRememberMe
                obj.isAutoLogin = this.modelData.isAutoLogin
                obj.saveId = this.modelData.userId
                obj.savePassword = endPassword
                obj.loginTime = this.$getDateTime()

                this.$store.dispatch(Constant.UPDATE_REMEMBER_STATE, obj)
              } else {
                var obj = {}
                obj.isRememberMe = this.modelData.isRememberMe
                obj.isAutoLogin = this.modelData.isAutoLogin
                obj.saveId = ''
                obj.savePassword = ''
                obj.loginTime = this.$getDateTime()

                this.$store.dispatch(Constant.UPDATE_REMEMBER_STATE, obj)
              }

              // 로그인 유저 정보 저장
              var loginObj = {
                userId: this.modelData.userId,
                loginTime: this.$getDateTime(),
                loginTimeStr: this.$getDateTimeStr()
              }

              // 로그인 시간 업데이트
              ipcRenderer.send(Constant.UPDATE_LOGIN_DTTM, JSON.stringify(loginObj))

              // 현재 유저 정보 및 히스토리 저장
              this.$store.dispatch(Constant.SET_CURRENT_USER, loginObj)

              // 주문 내역 초기화
              this.$store.dispatch(Constant.INIT_ORDER_LIST, null)

              // Working timer 초기화
              this.$store.dispatch(Constant.SET_TIMER, 0)

              // classification 초기화
              this.$store.dispatch(Constant.INIT_WBC_COUNT, null)
              this.$store.dispatch(Constant.INIT_RBC_DEGREE, null)
              this.$store.dispatch(Constant.UPDATE_MALARIA_COUNT, 0)

              // log
              var logObj = {}
              logObj.userId = this.modelData.userId
              logObj.eventTypeCd = Constant.EVENT_TYPE_USER
              logObj.logDttm = this.$getDateTimeStr()
              logObj.logMessage = '[' + Constant.EVENT_TYPE_USER + ']' + 'Login'

              this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)

              // 설정 정보 등록
              this.sendSettingInfo()

              this.$router.push('/homePage/orderEntry')

            } else {
              this.modelData.isLoginError = true
              // this.$toasted.show(Constant.IDS_ERROR_LOGIN_ERROR, {
              //   position: 'bottom-center',
              //   duration: '2000'
              // })
            }
          } catch (err) {
            this.modelData.isLoginError = true
            // this.$toasted.show(Constant.IDS_ERROR_LOGIN_ERROR, {
            //   position: 'bottom-center',
            //   duration: '2000'
            // })
          }
        } else {
          this.modelData.isLoginError = true
          // this.$toasted.show(Constant.IDS_ERROR_LOGIN_ERROR, {
          //   position: 'bottom-center',
          //   duration: '2000'
          // })
        }
      },
      signup (evt) {
        this.$modal.show(ModalSignUp, {}, {
          height: 'auto'
        })
      },
      onPowerOff () {
        this.$modal.show(ModalConfirm, {openType: 'powerOff', message: Constant.IDS_MSG_POWEROFF}, {
          height: 'auto',
          width: '350px'
        })
      }
    }
  }
</script>

<style>
  #loginPage {
    background-color: #1E1E1E;
    text-align: center;
    color: white;
  }
  #imgLogo {
    width: 30%;
    margin-top: 200px;
  }
  #divInputForm {
    width: 530px;
    margin: 0 auto;
    margin-top: 100px;
    padding: 15px;
    background-color: rgba(255, 255, 255, 0);
    text-align: left;
    padding-left: 120px;
  }
  #divError {
    height: 60px;
  }
</style>
