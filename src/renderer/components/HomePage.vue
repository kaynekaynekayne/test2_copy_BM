<template>
  <b-overlay :show="overlayShow" variant="dark" opacity="0.5" rounded="sm" style="color:white;">
    <template v-slot:overlay>
    <div class="text-center">
      <b-icon icon="arrow-clockwise" font-scale="3" animation="spin"></b-icon>
      <p id="cancel-label">Please wait...</p>
    </div>
  </template>
  <div class="navHome">
    <b-row id="tabNav" class="colorWhite" style="-webkit-app-region: drag;">
      <!-- <b-col cols="1" class="pt-2 pl-4 pr-0 text-right">
        <img src="~@/assets/test/tab_logo.png" alt="tabLogo" style="width: 90%; margin-top: 4px;">
      </b-col> -->
      <b-col cols="6" class="pt-3 pb-1">
        <b-row style="-webkit-app-region: no-drag;">
          <b-col cols="2" id="mainTab" v-for="page in pages" :key="page.id" class="pointer text-center" @click="onClickTab(page)">
            <img v-if="page.isSelect" class="imgSelect" :src="page.imgPath"/>
            <img v-else class="imgNonSelect" :src="page.imgPath"/>
            <!-- <div :class="{labelSelect : page.isSelect}">{{ page.text }}</div> -->
          </b-col>
          <!-- <b-button @click="onSocketInit" size="sm">init</b-button>
          <b-button @click="onSocketConnect" size="sm">conn</b-button>
          <b-button @click="onSocketSend" size="sm">send</b-button> -->
        </b-row>
      </b-col>
      <b-col class="pt-4 text-left" cols="3">
        <b-row class="p-0 pt-1" style="-webkit-app-region: no-drag;">
          <b-col class="p-0 pr-4 text-right" cols="8">
            <img v-if="isConnect === true" src="~@/assets/icon/connect.png" class="pointer" style="width: 30px;" />
            <img v-else src="~@/assets/icon/connect_off.png" class="pointer" style="width: 30px;" />
            <img src="~@/assets/icon/alert.png" class="pointer ml-2 mr-1" style="width: 30px;" />
            <img v-if="oilCount > 0" src="~@/assets/icon/oil.png" class="pointer ml-2 mr-1" @click="onImmersionOil" style="width: 30px;" />
            <img v-else src="~@/assets/icon/oil_off.png" class="pointer ml-2 mr-1" @click="onImmersionOil" style="width: 30px;" />
          </b-col>
          <b-col class="p-0">
            <progress-bar></progress-bar>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="pt-3 pr-5 text-right">
        <div style="letter-spacing: 1px;">{{ modelData.loginTime }}</div>
        <b-row>
          <b-col class="text-right pt-1" cols="8">
            <p class="h3"><b-icon icon="person-circle"></b-icon></p>
          </b-col>
          <b-col class="pt-1 text-right" style="-webkit-app-region: no-drag;">
            <b-dropdown block right :text="modelData.userId" @show="onDropdownShow" ref="dropdown">
              <b-dropdown-form style="width: 400px;">
                <div style="color: #999999;">
                  Current account
                </div>
                <b-card>
                  <b-row>
                    <b-col cols="2" class="pt-3">
                      <img src="~@/assets/test/checkOn.png" />
                    </b-col>
                    <b-col>
                      <div>
                        <strong>{{ modelData.userId }}</strong>
                      </div>
                      <div style="font-size: 13px; color: #999999;">
                        {{ modelData.empNo }}
                      </div>
                      <div>
                        {{ modelData.userNm }}&nbsp&nbsp&nbsp {{ modelData.loginTime }}
                      </div>
                    </b-col>
                  </b-row>
                </b-card>
                <br/>
                <b-dropdown-divider></b-dropdown-divider>
                <br/>
                <b-card
                  id="accountCard"
                  class="mt-1 pointer"
                  v-for="(item, index) in changeUserList"
                  :key="index"
                  @click="onClickAccount($event, item)">
                  <b-row>
                    <b-col cols="2" class="pt-3">
                      <img v-if="item.isSelected" src="~@/assets/test/checkOn.png" />
                      <img v-else src="~@/assets/test/checkOff.png" />
                    </b-col>
                    <b-col>
                      <div>
                        <strong>{{ item.userId }}</strong>
                      </div>
                      <div style="font-size: 13px; color: #999999;">
                        {{ item.empNo }}
                      </div>
                      <div>
                        {{ item.userName }}&nbsp&nbsp&nbsp {{ $stringToLoginTime(item.loginTime) }}
                      </div>
                    </b-col>
                  </b-row>
                  <b-row v-if="item.isSelected" class="mt-2">
                    <b-col cols="2"></b-col>
                    <b-col cols="7">
                      <b-form-input
                        id="input-live"
                        type="password"
                        placeholder="paswsword"
                        v-model="item.password"
                      ></b-form-input>
                    </b-col>
                    <b-col class="pt-1">
                      <b-button variant="primary" @click="onLogin(item)" size="sm">Login</b-button>
                    </b-col>
                  </b-row>
                </b-card>
                <div class="text-right">
                  <b-button class="mt-2" variant="outline-dark" @click="onModalLogout" size="sm">Logout</b-button>
                </div>
              </b-dropdown-form>
            </b-dropdown>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
  </b-overlay>
</template>

<script>
  import ResultPage from './TabPages/ResultPage.vue'
  import SettingsPage from './TabPages/SettingsPage.vue'
  import CenteredModal from './Common/CenteredModal.vue'
  import { mapGetters } from 'vuex'
  import Constant from '../../Constant'
  import ModalInfo from './Common/ModalInfo'
  import ModalConfirm from './Common/ModalConfirm'
  import ModalImmersionOil from './Common/ModalImmersionOil'
  import worker from '../workers/promise'
  import ProgressBar from './ProgressBar.vue'
  import Configs from '../../Configs'
  import Package from '../../../package.json'
  // import normalTcp from './Plugins/TcpClient/normal_tcp.js'

  // 로그인 / 로그아웃 제대로 안 되던 문제
  // import Store from 'electron-store';
  // const store = new Store({ name: 'vuex' });
  // store.clear();

  // console.log(store.store)

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'home-page',
    components: { ResultPage, SettingsPage, CenteredModal, ProgressBar },
    computed: {
      ...mapGetters([Constant.GET_CURRENT_USER,
        Constant.GET_SETTINGS,
        Constant.GET_SYSTEM_TIME_ID,
        Constant.GET_COMMON_CODE_LIST,
        Constant.GET_RUNNING_INTERVAL_ID,
        Constant.GET_LOGIN_HISTORY,
        Constant.GET_COMMON_CODE,
        Constant.GET_WORK_LIST,
        Constant.GET_WORKING_INTERVAL_ID,
        Constant.GET_USER])
    },
    mounted () {
      var self = this

      this.initElement()
      this.sendSystemInfo()

      ipcRenderer.send(Constant.SELECT_RBC_DEGREE)

      // normal range
      ipcRenderer.send(Constant.GET_NORMAL_RANGE)

      ipcRenderer.on(Constant.SELECT_RBC_DEGREE, function (event, results) {
        self.rbcDegreeStandard = results
      })

      ipcRenderer.on(Constant.GET_NORMAL_RANGE, function (event, results) {
        self.normalRange = results

        var wbcNormalRange = []
        var bmNormalRange = []

        self.normalRange.forEach(function(item) {
          var obj = {
            analysisType: item.ANALYSIS_TYPE,
            classId: item.CLASS_ID,
            classTitle: item.CLASS_TITLE,
            classNm: item.CLASS_NM,
            min: item.MIN,
            max: item.MAX,
            unit: item.UNIT
          }

          if (item.ANALYSIS_TYPE === '01') {
            wbcNormalRange.push(obj)
          } else {
            bmNormalRange.push(obj)
          }

        })

        self.$store.dispatch(Constant.SET_WBC_NORMAL_RANGE, wbcNormalRange)
        self.$store.dispatch(Constant.SET_BM_NORMAL_RANGE, bmNormalRange)

      })

      worker.norWorker.onmessage = function (event) {
        console.log('<<< onmessage normal >>>')
        console.log(event.data.params)

        self.EventBus.$emit('RECEIVE_DATA_BARCODE', event.data.params)
        if (event.data.params.resultCd === '00000') {
          // 시스템 정보 요청 재실행
          var timeId = self.systemTimeId
          if (timeId === null) {
            self.sendSystemInfo()
          }

          self.isConnect = true

          self.commonReceive(event.data.params)
          self.EventBus.$emit('RECEIVE_DATA', event.data.params)
          self.EventBus.$emit('RECEIVE_DATA_PROGRESS', event.data.params)
        } else {
          if (!self.isModalShow) {
            self.$modal.show(ModalInfo, {item: '[CMD ' + event.data.params.jobCmd + ']' + '[' + event.data.params.resultCd + ']' + event.data.params.resultMsg}, {
              height: 'auto',
              width: '350px'
            }, {
              'before-open': self.beforeOpen,
              'before-close': self.beforeClose
            })
          }

          // running info 종료
          if (self.runningIntervalId !== null) {
            clearInterval(self.runningIntervalId)
            self.runningIntervalId = null
          }

          // 슬라이드 타이머 종료
          if (typeof(self.getWorkingIntervalId) !== 'undefined' && self.getWorkingIntervalId !== null) {
            clearInterval(JSON.parse(JSON.stringify(self.getWorkingIntervalId)))
          }
          self.$store.dispatch(Constant.SET_WORKING_INTERVAL_ID, null)

          self.isConnect = false

          // self.EventBus.$emit('STOP_EXCUTE_TIMER')
          self.EventBus.$emit('OVERLAY', {state: false})
        }
      }

      // worker.sysWorker.onmessage = function (event) {
      //   console.log('<<< onmessage sysinfo >>>')
      //   console.log(event.data.params)
      //
      //   if (event.data.params.resultCd === '00000') {
      //     if (event.data.params.isDoorOpen === 'Y') {
      //       self.isDoorOpen = true
      //     } else {
      //       self.isDoorOpen = false
      //     }
      //
      //     self.eqStatCd = event.data.params.eqStatCd
      //     self.oilCount = event.data.params.oilCount
      //     self.isConnect = true
      //
      //     self.$store.dispatch(Constant.SET_SITE_CD, event.data.params.siteCd)
      //     self.$store.dispatch(Constant.SET_DEVICE_BARCODE, event.data.params.deviceBarcode)
      //
      //     // isRecovery 추가
      //     if (event.data.params.isRecovery === 'Y') {
      //       self.$store.dispatch(Constant.SET_USER_STOP, true)
      //     } else {
      //       self.$store.dispatch(Constant.SET_USER_STOP, false)
      //     }
      //
      //     self.EventBus.$emit('RECEIVE_DATA_SYSINFO', event.data.params)
      //     self.EventBus.$emit('RECEIVE_DATA_PROGRESS_SYSINFO', event.data.params)
      //     self.EventBus.$emit('RECEIVE_DATA_BARCODE_SYSINFO', event.data.params)
      //   } else {
      //     if (!self.isModalShow) {
      //       self.$modal.show(ModalInfo, {item: '[CMD ' + event.data.params.jobCmd + ']' + '[' + event.data.params.resultCd + ']' + event.data.params.resultMsg}, {
      //         height: 'auto',
      //         width: '350px'
      //       }, {
      //         'before-open': self.beforeOpen,
      //         'before-close': self.beforeClose
      //       })
      //     }
      //
      //     self.isConnect = false
      //
      //     self.clearTimer()
      //     self.EventBus.$emit('OVERLAY', {state: false})
      //   }
      // }

      // overlay on, off
      this.EventBus.$on('OVERLAY', function(params) {
        self.overlayShow = params.state

        if (self.overlayShow) {
          // setTimeout(function() {
          //   console.log('Loading timeout : ' + self.overlayShow)
          //   if (self.overlayShow) {
          //     self.$toasted.show('Loading timeout', {
          //       position: 'bottom-center',
          //       duration: '2000'
          //     })
          //
          //     self.EventBus.$emit('OVERLAY', {state: false})
          //   }
          // }, 20000)
        }
      })

      this.EventBus.$on('CHANGE_TAB', function(params) {
        // self.overlayShow = params.id
        var page = null
        for (var i = 0; i < self.pages.length; i++) {
          if (self.pages[i].id === params.id) {
            page = self.pages[i]
          }
        }
        self.onClickTab(page)
      })

      this.EventBus.$on('CHANGE_USER', function(params) {
        // 로그인 유저 정보 저장
        self.$store.dispatch(Constant.SET_CURRENT_USER, params)
        self.initElement()
      })

      // oil count 초기화
      this.EventBus.$on('INIT_OIL_COUNT', function(params) {
        self.sendSettingInfo()
      })
    },
    data () {
      return {
        modelData: {
          userId: '',
          loginTime: ''
        },
        pages: [{
          id: 1, text: 'Settings', imgPath: require('@/assets/icon/SETTING.png'), childrenPage: '/homePage/settings', isSelect: false
        }, {
          id: 2, text: 'Order List', imgPath: require('@/assets/icon/ORDER_LIST.png'), childrenPage: '/homePage/orderEntry', isSelect: true
        }, {
          id: 3, text: 'Analysis View', imgPath: require('@/assets/icon/SCAN.png'), childrenPage: '/homePage/test', isSelect: false
        }, {
          id: 4, text: 'Database', imgPath: require('@/assets/icon/DATABASE.png'), childrenPage: '/homePage/result', isSelect: false
        }],
        // {
        //   id: 5, text: 'Classification', imgPath: require('@/assets/icon/CLASSIFICATION.png'), childrenPage: '/homePage/resultClassification', isSelect: false
        // }],
        oilCount: 0,
        eqStatCd: '01',
        bcSysInfo: null,
        overlayShow: false,
        orderId: null,
        changeUserList: [],
        isModalShow: false,
        isDoorOpen: false,
        isConnect: false,
        systemTimeId: null,
        runningIntervalId: null,
        rbcDegreeStandard: null,
        normalRange: null
      }
    },
    beforeDestroy () {
      // remove EventBus
      this.EventBus.$off()
      this.$off()

      // stop interval
      this.clearTimer()

      ipcRenderer.removeAllListeners(Constant.SELECT_RBC_DEGREE)
      ipcRenderer.removeAllListeners(Constant.GET_NORMAL_RANGE)
    },
    methods: {
      // onSocketInit: function() {
      //   console.log('onSocketTest')
      //   normalTcp.initSocket()
      // },
      // onSocketConnect: function() {
      //   normalTcp.connect()
      // },
      // onSocketSend: function() {
      //   var isNsNbIntegration = 'N'
      //   if (this.getSettings.isNsNbIntegration) {
      //     isNsNbIntegration = 'Y'
      //   }
      //
      //   // 설정 정보 등록
      //   var params = {
      //     jobCmd: 'SETTINGS',
      //     reqUserId: this.getCurrentUser.userId,
      //     reqDttm: this.$getDateTimeStr(),
      //     pbiaRootDir: this.getSettings.pbiaRootPath,
      //     oilCount: this.oilCount,
      //     isOilReset: 'Y',
      //     deviceType: '02',
      //     uiVersion: Configs.BUCKET_NAME + '_v' + Package.version,
      //     isNsNbIntegration: isNsNbIntegration
      //   }
      //
      //
      //   // normalTcp.sendMessage(JSON.stringify(params))
      //   worker.sendDataToServer(this, JSON.stringify(params))
      // },
      calcRbcDegree: function (rbcInfo) {
        var self = this
        var totalCount = 0
        var sizeTotal = 0
        var chromiaTotal = 0

        console.log('calcRbcDegree')
        console.log(rbcInfo)

        // degree
        rbcInfo.forEach(function (rbcCategory, catIndex) {
          rbcCategory.classInfo.forEach(function (rbcClass, clsIndex) {

            // size total
            if (rbcCategory.categoryId === '01') {
              if (rbcClass.classId !== '04') {
                sizeTotal += Number(rbcClass.degree)
              }
            }
            // chromia total
            else if (rbcCategory.categoryId === '02') {
              if (rbcClass.classId !== '04') {
                chromiaTotal += Number(rbcClass.degree)
              }
            }
            // shape, inclusion body total
            else {
              totalCount += Number(rbcClass.degree)
            }
          })
        })

        rbcInfo.forEach(function (rbcCategory, catIndex) {
          rbcCategory.classInfo.forEach(function (rbcClass, clsIndex) {
            self.rbcDegreeStandard.forEach(function(degreeStandard) {
              if ((degreeStandard.CATEGORY_ID === rbcCategory.categoryId) &&
                  (degreeStandard.CLASS_ID === rbcClass.classId)) {
                var degreeCount = Number(rbcClass.degree)
                var percent = 0

                if (degreeStandard.CATEGORY_ID === '01') {
                  percent = ((degreeCount / sizeTotal) * 100).toFixed(2)
                } else if (degreeStandard.CATEGORY_ID === '02') {
                  percent = ((degreeCount / chromiaTotal) * 100).toFixed(2)
                } else {
                  percent = ((degreeCount / totalCount) * 100).toFixed(2)
                }

                // 0
                if (percent < degreeStandard.DEGREE_1) {
                  rbcClass.degree = '0'
                }
                // 1
                else if (percent >= degreeStandard.DEGREE_1 && percent < degreeStandard.DEGREE_2) {
                  rbcClass.degree = '1'
                }
                // 2
                else if (percent >= degreeStandard.DEGREE_2 && percent < degreeStandard.DEGREE_3) {
                  rbcClass.degree = '2'
                }
                // 3
                else if (percent >= degreeStandard.DEGREE_3) {
                  rbcClass.degree = '3'
                }

              }
            })
          })
        })

        rbcInfo.forEach(function (rbcCategory, catIndex) {
          rbcCategory.classInfo.forEach(function (rbcClass, clsIndex) {
            // size
            if (rbcCategory.categoryId === '01') {
              if (rbcClass.classId === '01') {
                rbcCategory.classInfo[0].degree = '1'
              }
              if (rbcClass.classId === '02' || rbcClass.classId === '03') {
                if (Number(rbcClass.degree) > 0) {
                  rbcCategory.classInfo[0].degree = '0'
                }
              }
            }

            // chromia
            if (rbcCategory.categoryId === '02') {
              if (rbcClass.classId === '01') {
                rbcCategory.classInfo[0].degree = '1'
              }

              if (rbcClass.classId === '02' || rbcClass.classId === '03') {
                if (Number(rbcClass.degree) > 0) {
                  rbcCategory.classInfo[0].degree = '0'
                }
              }
            }

            // Poikilocytosis
            if (rbcCategory.categoryId === '03') {
              if (rbcClass.classId === '01') {
                // normal
                rbcCategory.classInfo[0].degree = '1'
                // poikilo
                rbcCategory.classInfo[1].degree = '0'
              }

              if (rbcClass.classId !== '01' && rbcClass.classId !== '02') {
                var poikiloDegree = Number(rbcCategory.classInfo[1].degree)
                if (Number(rbcClass.degree) > poikiloDegree) {
                  rbcCategory.classInfo[0].degree = '0'
                  rbcCategory.classInfo[1].degree = rbcClass.degree
                }
              }
            }
          })
        })
      },
      initElement () {
        var userInfo = this.getUser(this.getCurrentUser.userId)
        this.modelData.userId = userInfo.userId
        this.modelData.userNm = userInfo.userName
        this.modelData.empNo = userInfo.empNo
        this.modelData.loginTime = this.$stringToLoginTime(this.getCurrentUser.loginTime)
        this.oilCount = this.getSettings.currentOilCount.toString()

        var tmpArray = []
        var loginHistList = []

        // 활성화된 계정만
        for (var i = 0; i < this.getLoginHistory.length; i++) {
          var userInfo = this.getUser(this.getLoginHistory[i].userId)
          if (userInfo !== null && (userInfo.isAvailable === 'Y')) {
            loginHistList.push(this.getLoginHistory[i])
          }
        }

        if (loginHistList.length > 4) {
          tmpArray = loginHistList.slice(1, 4)

        } else {
          tmpArray = loginHistList.slice(1, loginHistList.length + 1)
        }

        this.changeUserList = []
        for (var i = 0; i < tmpArray.length; i++) {
          var obj = JSON.parse(JSON.stringify(this.getUser(tmpArray[i].userId)))
          obj.loginTime = tmpArray[i].loginTime
          obj.isSelected = false
          obj.password = ''
          this.changeUserList.push(obj)
        }
      },
      sendSettingInfo () {
        var isNsNbIntegration = 'N'
        if (this.getSettings.isNsNbIntegration) {
          isNsNbIntegration = 'Y'
        }

        // 설정 정보 등록
        var params = {
          jobCmd: 'SETTINGS',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          pbiaRootDir: this.getSettings.pbiaRootPath,
          oilCount: this.oilCount,
          isOilReset: 'Y',
          deviceType: '02',
          uiVersion: Configs.BUCKET_NAME + '_v' + Package.version,
          isNsNbIntegration: isNsNbIntegration
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      },
      sendSystemInfo() {
        // 시스템 정보 요청
        this.systemTimeId = setInterval(function() {
          var params = {
            jobCmd: 'SYSINFO',
            reqUserId: this.modelData.userId,
            reqDttm: this.$getDateTimeStr()
          }

          worker.sendDataToServer(this, JSON.stringify(params))
        }.bind(this), 500)

        // this.$store.dispatch(Constant.SET_SYSTEM_TIME_ID, timerId)
      },
      onClickTab (page) {
        console.log(page.id)
        console.log(this.$store.getters.getRunningState)

        if (this.$store.getters.getRunningState &&
          (page.id !== 3 && page.id !== 4 && page.id !== 5)
        ) {
          this.$toasted.show(Constant.IDS_ERROR_ALREADY_RUNNING, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        if (this.$route.path.includes('resultClassification')) {
          if (!page.childrenPage.includes('resultClassification')) {
            this.changePage(page)
          }
        } else {
          if (this.$route.path !== page.childrenPage) {
            if (page.childrenPage.includes('resultClassification') && this.getWorkList.length <= 0) {
              this.$toasted.show(Constant.IDS_ERROR_ADD_A_WORKLIST, {
                position: 'bottom-center',
                duration: '2000'
              })
            } else {
              this.changePage(page)
            }
          }
        }
      },
      changePage (page) {
        for (var i = 0; i < this.pages.length; i++) {
          if (this.pages[i].id === page.id) {
            this.pages[i].isSelect = true
          } else {
            this.pages[i].isSelect = false
          }
        }
        this.$router.push(page.childrenPage)
      },
      onModalLogout (evt) {
        if (this.$store.getters.getRunningState) {
          this.$toasted.show(Constant.IDS_ERROR_ALREADY_RUNNING, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        this.$refs.dropdown.hide(true)
        this.$modal.show(ModalConfirm, {openType: 'logout', message: Constant.IDS_MSG_LOGOUT}, {
          height: 'auto',
          width: '350px'
        })
      },
      onDropdownShow (evt) {
        this.initElement()
      },
      onImmersionOil (evt) {
        this.$modal.show(ModalImmersionOil, {oilCount: this.oilCount}, {
          height: 'auto',
        })
      },
      clearTimer () {
        // var timeId = this.getSystemTimeId
        //
        // if (timeId !== null) {
        //   clearInterval(timeId)
        //   this.$store.dispatch(Constant.SET_SYSTEM_TIME_ID, null)
        // }
        if (this.systemTimeId !== null) {
          clearInterval(this.systemTimeId)
          this.systemTimeId = null
          // this.$store.dispatch(Constant.SET_SYSTEM_TIME_ID, null)
        }
      },
      // 실행 완료
      sendRunningComp () {
        var params = {
          jobCmd: 'RUNNING_COMP',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      },
      stop () {
        // 종료
        var params = {
          jobCmd: 'STOP',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          isEmergency: 'N',
          isUserStop: 'N'
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      },
      errorClear () {
        var params = {
          jobCmd: 'ERROR_CLEAR',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          pbiaRootDir: this.getSettings.pbiaRootPath,
          oilCount: this.getSettings.currentOilCount.toString(),
          isOilReset: 'N',
          deviceType: '02',
          uiVersion: Configs.BUCKET_NAME + '_v' + Package.version
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      },
      beforeOpen () {
        this.isModalShow = true
      },
      beforeClose () {
        this.isModalShow = false
        this.errorClear()

        console.log('systemTimeId')
        console.log(this.systemTimeId)
        if (this.systemTimeId === null) {
          this.sendSystemInfo()
        }
      },
      onClickAccount (evt, item) {
        for (var i = 0; i < this.changeUserList.length; i++) {
          if (this.changeUserList[i].userId === item.userId && this.changeUserList[i].loginTime === item.loginTime) {
            this.changeUserList[i].isSelected = true
          } else {
            this.changeUserList[i].isSelected = false
            this.changeUserList[i].password = ''
          }
        }
      },
      onLogin (item) {
        var self = this
        if (this.$store.getters.getRunningState) {
          this.$toasted.show(Constant.IDS_ERROR_ALREADY_RUNNING, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        for (var i = 0; i < this.changeUserList.length; i++) {
          if (this.changeUserList[i].userId === item.userId && this.changeUserList[i].loginTime === item.loginTime) {
            if (this.changeUserList[i].password !== null && this.changeUserList[i].password !== '') {
              var decPassword = this.$CryptoJS.AES.decrypt(this.changeUserList[i].encPassword, this.changeUserList[i].password).toString(this.$CryptoJS.enc.Utf8)

              if (decPassword !== this.changeUserList[i].password) {
                this.$toasted.show(Constant.IDS_ERROR_NOT_MATCHED_PASSWORD, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              } else {
                self.EventBus.$emit('OVERLAY', {state: true})

                setTimeout(function() {
                  self.EventBus.$emit('OVERLAY', {state: false})

                  var loginObj = {
                    userId: item.userId,
                    loginTime: self.$getDateTime()
                  }
                  self.EventBus.$emit('CHANGE_USER', loginObj)
                  self.$refs.dropdown.hide(true)

                  self.$toasted.show(Constant.IDS_MSG_ACCOUNT_CHANGED, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                }, 2000)
              }
            } else {
              this.$toasted.show(Constant.IDS_ERROR_NOT_MATCHED_PASSWORD, {
                position: 'bottom-center',
                duration: '2000'
              })
            }
          }
        }
      },
      saveTestHistory (params) {
        var self = this

        var completeSlot = params.slotInfo.find(function (item) {
          return item.orderId === self.orderId && item.stateCd === '04'
        })

        var isNsNbIntegration = 'N'
        if (self.getSettings.isNsNbIntegration) {
          isNsNbIntegration = 'Y'
        }

        if (typeof(completeSlot) !== 'undefined') {
          completeSlot.userId = self.modelData.userId
          completeSlot.cassetId = params.cassetId
          completeSlot.cassetNo = params.cassetNo

          completeSlot.isNsNbIntegration = isNsNbIntegration

          // orderId = slotId로 변경
          completeSlot.orderId = completeSlot.slotId

          // site code
          if (typeof(completeSlot.siteCd) === 'undefined') {
            completeSlot.siteCd = ''
          }

          // plt count
          if (typeof(completeSlot.pltCount) === 'undefined') {
            completeSlot.pltCount = ''
          }

          // PB 비정상 클래스 체크
          completeSlot.isNormal = 'Y'

          if (completeSlot.analysisType === '01') {
            var obj = self.$checkPbNormalCell(completeSlot.wbcInfo)
            completeSlot.isNormal = obj.isNormal
          }

          // database 내역 저장
          ipcRenderer.send(Constant.SET_TEST_HISTORY, JSON.stringify(completeSlot))

          // RBC count -> degree
          self.calcRbcDegree(completeSlot.rbcInfo)

          console.log('completeSlot =-=')
          console.log(completeSlot)

          // WBC, RBC, BM cell 처리 정보 저장
          ipcRenderer.send(Constant.SET_CLASSIFICATION, JSON.stringify(completeSlot))

          // running info 종료
          // clearInterval(self.runningIntervalId)
          // self.runningIntervalId = null
        }
      },
      // 검사 실행 정보 수신
      sendRunningInfo () {
        var params = {
          jobCmd: 'RUNNING_INFO',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }
        // ipcRenderer.send('SEND_DATA', JSON.stringify(params))
        worker.sendDataToServer(this, JSON.stringify(params))
      },
      // 공통 처리
      commonReceive (params) {
        var self = this
        var jobCmd = params.jobCmd
        // var codeList = this.getCommonCodeList(Constant.GET_CODE_LIST_USER_CASSETE_STATE)

        // var logObj = {}
        // logObj.userId = this.modelData.userId
        // logObj.eventTypeCd = Constant.EVENT_TYPE_SYSTEM
        // logObj.logDttm = this.$getDateTimeStr()

        console.log(params)
        if (jobCmd === 'INIT') {
          self.EventBus.$emit('OVERLAY', {state: false})
        } else if (jobCmd === 'START') {
          self.$store.dispatch(Constant.UPDATE_RUNNING_STATE, true)
          self.runningIntervalId = setInterval(function() {
            self.sendRunningInfo()
          }, 500)
          // var runningIntervalId = setInterval(function() {
          //   self.$store.dispatch(Constant.SET_RUNNING_INTERVAL_ID, runningIntervalId)
          //   self.sendRunningInfo()
          // }, 500)

        } else if (jobCmd === 'RECOVERY') {
          console.log('recovery---')
          self.$store.dispatch(Constant.SET_USER_STOP, false)
          self.EventBus.$emit('OVERLAY', {state: false})

        } else if (jobCmd === 'RUNNING_INFO') {
          // if (params.resultCd === '00000') {
            // 스캔중일때는 pass
            if (params.iCasStat !== '999999999999') {
              var currentSlot = params.slotInfo.find(function (item) {
                return item.stateCd === '03'
              })

              // 데이터 저장
              if (typeof(currentSlot) !== 'undefined') {
                if (self.orderId !== currentSlot.orderId) {
                  self.saveTestHistory(params)

                  // 슬롯 변경 이벤트
                  self.orderId = currentSlot.orderId
                  self.EventBus.$emit('CHANGE_SLOT')
                }
              }

              // iCasStat (0 - 없음, 1 - 있음, 2 - 진행중, 3 - 완료, 4 - 에러, 9 - 스캔)
              const regex = /[1,2,9]/g
              if ((params.iCasStat.search(regex) < 0) || params.oCasStat === '111111111111') {
                self.saveTestHistory(params)
                self.orderId = null

                self.sendRunningComp()
              }
            }
          // }
        } else if (jobCmd === 'RUNNING_COMP') {
          var obj = {
            cassetId: params.cassetId,
            slotInfo: params.slotInfo,
            userId: this.getCurrentUser.userId
          }
          console.log(obj)
          // ipcRenderer.send(Constant.SET_WBC_CELL_POSITION, JSON.stringify(obj))
          this.stop()


          // logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
          //           '[Receive : ' + jobCmd + ']'
          // this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)

        } else if (jobCmd === 'STOP') {
          // 실행 상태 변경
          this.$store.dispatch(Constant.UPDATE_RUNNING_STATE, false)

          // running info 종료
          clearInterval(self.runningIntervalId)
          this.runningIntervalId = null

          // 슬라이드 타이머 종료
          if (typeof(this.getWorkingIntervalId) !== 'undefined' && this.getWorkingIntervalId !== null) {
            clearInterval(JSON.parse(JSON.stringify(this.getWorkingIntervalId)))
          }
          this.$store.dispatch(Constant.SET_WORKING_INTERVAL_ID, null)
          this.orderId = null

          // clearInterval(JSON.parse(JSON.stringify(this.getRunningIntervalId)))
          // this.$store.dispatch(Constant.SET_RUNNING_INTERVAL_ID, null)

          // logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
          //                     '[Receive : ' + jobCmd + ']'
          // this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
        } else if (jobCmd === 'ERROR_CLEAR') {
          if (params.resultCd === '00000') {
            // this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
            //   position: 'bottom-center',
            //   duration: '2000'
            // })
          } else {
            this.$toasted.show(Constant.IDS_MSG_FAILED, {
              position: 'bottom-center',
              duration: '2000'
            })
          }

          // logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
          //                     '[Receive : ' + jobCmd + ']' + '[' + params.resultCd + '-' + params.resultMsg + ']'
          // this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)

          this.errMessage = params.resultMsg
        } else if (jobCmd === 'SYSINFO') {
          if (params.resultCd === '00000') {
            // if (params.isDoorOpen === 'Y') {
            //   self.isDoorOpen = true
            // } else {
            //   self.isDoorOpen = false
            // }
            //
            // self.eqStatCd = params.eqStatCd
            // self.oilCount = params.oilCount
            // self.isConnect = true

            // self.$store.dispatch(Constant.SET_SITE_CD, params.siteCd)
            // self.$store.dispatch(Constant.SET_DEVICE_BARCODE, params.deviceBarcode)

            // isRecovery 추가
            if (params.isRecovery === 'Y') {
              self.$store.dispatch(Constant.SET_USER_STOP, true)
            } else {
              self.$store.dispatch(Constant.SET_USER_STOP, false)
            }

            self.EventBus.$emit('RECEIVE_DATA_SYSINFO', params)
            self.EventBus.$emit('RECEIVE_DATA_PROGRESS_SYSINFO', params)
            self.EventBus.$emit('RECEIVE_DATA_BARCODE_SYSINFO', params)
          } else {
            if (!self.isModalShow) {
              self.$modal.show(ModalInfo, {item: '[CMD ' + params.jobCmd + ']' + '[' + params.resultCd + ']' + params.resultMsg}, {
                height: 'auto',
                width: '350px'
              }, {
                'before-open': self.beforeOpen,
                'before-close': self.beforeClose
              })
            }

            self.isConnect = false

            self.clearTimer()
            self.EventBus.$emit('OVERLAY', {state: false})
          }
        }
      }
    }
  }
</script>

<style>
  #mainTab div {
    color: gray;
  }
  #mainTab:hover div {
    color: white;
  }
  #mainTab:hover img {
    -webkit-filter: opacity(.9) drop-shadow(0 0 0 white) !important;
    filter: opacity(.9) drop-shadow(0 0 0 white) !important;
  }
  .imgSelect {
    -webkit-filter: opacity(.9) drop-shadow(0 0 0 white) !important;
    filter: opacity(.9) drop-shadow(0 0 0 white) !important;
  }
  .imgNonSelect {
    -webkit-filter: opacity(.5) drop-shadow(0 0 0 gray) !important;
    filter: opacity(.5) drop-shadow(0 0 0 gray) !important;
  }
  .labelSelect {
    color: white !important;
  }
  #wrapper {
    border: 1px solid #303744;
    border-radius: 5px;
  }
  #accountCard:hover {
    background-color: #EEEEEE;
  }
  .imgSelect {
    -webkit-filter: opacity(.8) drop-shadow(0 0 0 white) !important;
    filter: opacity(.8) drop-shadow(0 0 0 white) !important;
  }
  .imgNonSelect {
    -webkit-filter: opacity(.5) drop-shadow(0 0 0 gray) !important;
    filter: opacity(.5) drop-shadow(0 0 0 gray) !important;
  }
  .labelSelect {
    color: white !important;
  }
  .dropdown-toggle {
    background-color: #1C1C1C !important;
    border: none !important;
  }
  #tabNav {
    background-color: #141414;
  }
</style>
