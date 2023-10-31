<template>
  <div class="progressBar">
    <div id="bar" style="-webkit-app-region: no-drag;">
        <div id="barContent"></div>
        <img v-if="isInit == 'N'" id="progressIcon" @click="sendIntialize" src="~@/assets/icon/init.png" class="border pointer"/>
        <img v-else-if="userStop" id="progressIcon" @click="start" src="~@/assets/icon/recovery.png" class="border pointer"/>
        <img v-else-if="isRunningState" id="progressIcon" @click="stop" src="~@/assets/icon/stop.png" class="border pointer"/>
        <img v-else id="progressIcon" @click="start" src="~@/assets/icon/start.png" class="border pointer"/>

        <!-- <img v-if="eqStatCd == '02'" id="progressIcon" @click="" src="~@/assets/icon/start.png" class="border pointer"/>
        <img v-if="eqStatCd == '03'" id="progressIcon" @click="" src="~@/assets/icon/start.png" class="border pointer"/>
        <img v-if="eqStatCd == '04'" id="progressIcon" @click="" src="~@/assets/icon/stop.png" class="border pointer"/> -->
    </div>
    <div v-if="eqStatCd == '01'" id="barText">
      <label>IDLE</label>
    </div>
    <div v-if="eqStatCd == '02'" id="barText">
      <label>READY</label>
    </div>
    <div v-if="eqStatCd == '03'" id="barText">
      <label>ERROR</label>
    </div>
    <div v-if="eqStatCd == '04'" id="barText">
      <label>{{ percent }} %</label>
    </div>
  </div>
</template>

<script>
  import Constant from '../../Constant'
  import { mapGetters } from 'vuex'
  import worker from '../workers/promise'
  import ModalConfirm from './Common/ModalConfirm'

  export default {
    name: 'progress-bar',
    computed: {
      ...mapGetters({
        orderList: Constant.GET_ORDER_LIST_BM,
        currentUser: Constant.GET_CURRENT_USER,
        isRunningState: Constant.GET_RUNNING_STATE,
        settings: Constant.GET_SETTINGS,
        userStop: Constant.GET_USER_STOP
      })
    },
    beforeDestroy () {
      console.log('progress destory------')
      this.EventBus.$off('RECEIVE_DATA_PROGRESS')
      this.EventBus.$off('RECEIVE_DATA_PROGRESS_SYSINFO')
      this.EventBus.$off('RECOVER_GRIPPER')
    },
    data () {
      return {
        progressMax: 0,
        progressValue: 0,
        percent: 0,
        bmNo: '',
        eqStatCd: '01',
        isInit: 'N'
      }
    },
    mounted () {
      console.log('progress mounted------')
      var self = this

      this.EventBus.$on('RECEIVE_DATA_PROGRESS_SYSINFO', function(params) {
        self.eqStatCd = params.eqStatCd
        self.isInit = params.isInit

        // isRecovery �߰�
        if (params.isRecovery === 'Y') {
          self.$store.dispatch(Constant.SET_USER_STOP, true)
        } else {
          self.$store.dispatch(Constant.SET_USER_STOP, false)
        }
      })

      this.EventBus.$on('RECEIVE_DATA_PROGRESS', function(params) {
        var jobCmd = params.jobCmd

        if (jobCmd === 'INIT') {
          self.isInit = 'Y'

        } else if (jobCmd === 'RUNNING_INFO') {
          self.progressMax = 0
          self.progressValue = 0

          params.slotInfo.forEach(function(item) {
            if (item.stateCd !== '00') {
              self.progressMax++
            }

            if (item.stateCd === '04') {
              self.progressValue++
            }
          })

          console.log(self.progressMax)
          console.log(self.progressValue)

          if (self.progressValue >= self.progressMax) {
            self.progressValue = self.progressMax
          }

          self.percent = ((self.progressValue / self.progressMax) * 100).toFixed(0)

          var width = Number((180 * (Number(self.percent) / 100)).toFixed(0))
          if (width < 28) { width += 28 }

          document.getElementById('barContent').style.width = width + 'px'
          document.getElementById('barContent').style.backgroundColor = '#0080C1'
        }
      })

      this.EventBus.$on('RECOVER_GRIPPER', function(params) {
        console.log(params)
        self.sendRecover()
      })
    },
    methods: {
      // �ʱ�ȭ
      sendIntialize () {
        console.log('sendIntialize')
        var params = {
          jobCmd: 'INIT',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))
        this.EventBus.$emit('OVERLAY', {state: true})
      },
      // ������
      sendReStart() {
        var params = {
          jobCmd: 'RESTART',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          bfSelectFiles: this.bfSelectFiles
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      },
      // ����
      sendStart () {
        var params = {
          jobCmd: 'START',
          reqUserId: this.currentUser.userId,
          testType: this.settings.testTypeCd,
          wbcCount: this.settings.pbAnalysisType,
          runningMode: this.settings.runningMode,
          reqDttm: this.$getDateTimeStr()
        }

        console.log(params)
        worker.sendDataToServer(this, JSON.stringify(params))

        var logObj = {}
        logObj.userId = this.currentUser.userId
        logObj.eventTypeCd = Constant.EVENT_TYPE_SYSTEM
        logObj.logDttm = this.$getDateTimeStr()
        logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
                            '[Send : START]' +
                            '[' + this.currentUser.userId + ']'
        this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
      },
      reStart (evt) {
        this.sendReStart()
        this.$store.dispatch(Constant.SET_PAUSE_STATE, false)
      },
      start (evt) {
        var self = this

        // ���� ���� üũ
        if (self.isRunningState) {
          self.$toasted.show(Constant.IDS_ERROR_ALREADY_RUNNING, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        // recovery�ʿ� ���� üũ
        if (self.userStop) {
          self.$modal.show(ModalConfirm, {openType: 'userStop', message: Constant.IDS_RECOVER_GRIPPER_CONDITION}, {
            height: 'auto',
            width: '350px'
          })

          return
        }

        // �ʱ�ȭ ���� üũ
        setTimeout(function() {
          if (self.isInit === 'Y') {
            self.$store.dispatch(Constant.INIT_ORDER_LIST, null)
            self.sendStart()
          } else {
            self.$toasted.show(Constant.IDS_MSG_INITALIZE, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
        }, 0)
      },
      stop (evt) {
        var self = this

        if (!self.isRunningState) {
          self.$toasted.show(Constant.IDS_ERROR_STOP_PROCESS, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        // ����
        var params = {
          jobCmd: 'STOP',
          reqUserId: self.currentUser.userId,
          reqDttm: self.$getDateTimeStr(),
          isEmergency: 'N',
          isUserStop: 'Y'
        }

        worker.sendDataToServer(this, JSON.stringify(params))
        self.$store.dispatch(Constant.SET_USER_STOP, true)

        // seve logs
        var logObj = {}
        logObj.userId = this.currentUser.userId
        logObj.eventTypeCd = Constant.EVENT_TYPE_SYSTEM
        logObj.logDttm = this.$getDateTimeStr()
        logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
                            '[Send : STOP]' +
                            '[' + this.currentUser.userId + ']'
        this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
      },
      sendRecover () {
        var self = this

        // ����
        var params = {
          jobCmd: 'RECOVERY',
          reqUserId: self.currentUser.userId,
          reqDttm: self.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))
        self.EventBus.$emit('OVERLAY', {state: true})
      }
    }
  }
</script>

<style>
  #progressIcon {
    width: 28px;
    height: 28px;
    border-radius: 50px;
    position: absolute;
    background-color: #010101;
    left: 0;
  }
  #bar {
    width: 181px;
    height: 30px;
    border: 1px solid;
    padding-left: 10px;
    border-left: none;
    border-radius: 50px;
    float: right;
    position: relative;
  }
  #barText {
    right: 90px;
    top: 6px;
    font-size: 12px;
    position: absolute;
  }
  #barContent {
    height: 28px;
    border-radius: 50px;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
