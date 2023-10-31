<template>
  <div id="execController">
    <b-card class="blackCard h-100" text-variant="white" no-body>
      <!-- <b-row>
        <b-col cols="7" class="pl-4">
          <b-form-group>
            <b-row>
              <b-col cols="7">
                <b-form-radio size="sm" v-model="rSelected" name="Peripheral" value="01">
                  <span style="font-size: 12px;">Peripheral blood</span>
                </b-form-radio>
              </b-col>
              <b-col>
                <b-form-radio size="sm" v-model="rSelected" name="Body" value="02">
                  <span style="font-size: 12px;">Body fluid</span>
                </b-form-radio>
              </b-col>
            </b-row>
          </b-form-group>
        </b-col>
        <b-col class="pr-4">
          <b-form-select class="custonSelectWhite" v-model="sSelected" :options="wbcCountList" size="sm"></b-form-select>
        </b-col>
      </b-row> -->
      <b-row class="text-center mt-3">
        <b-col cols="7" class="p-2">
          <div id="startWrapper">
            <img v-if="isRunningState" class="w-100 pointer" src="~@/assets/test/btn_stop_on.png" @click="stop" />
            <img v-else-if="!isRunningState && !userStop" class="w-100 pointer" src="~@/assets/test/btn_start_on.png" @click="start" />
            <img v-else-if="isInit === 'N'" class="w-100 pointer" src="~@/assets/test/btn_start_off_large.png" />
            <img v-else class="w-100 pointer" src="~@/assets/test/btn_start_on_recover.png" @click="start" />
          </div>
        </b-col>
        <b-col class="p-2">
          <div id="stopWrapper" class="pt-1 pr-1">
            <img v-if="isInit === 'N'" class="float-right w-100 pr-1 pointer" src="~@/assets/test/btn_init_on.png" @click="sendIntialize" />
            <img v-else class="float-right w-100 pr-1 pointer" src="~@/assets/test/btn_init_off.png" />
            <img v-if="isRunningState" class="w-100 mt-2 pr-1 pointer" src="~@/assets/test/btn_start_off.png" />
            <img v-else class="w-100 mt-2 pr-1 pointer" src="~@/assets/test/btn_stop_off.png" />
          </div>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'
  import fs from 'fs'
  import worker from '../../../workers/promise'
  import ModalInfo from '../../Common/ModalInfo'
  import ModalConfirm from '../../Common/ModalConfirm'
  // const ipcRenderer = require('electron').ipcRenderer

  export default {
    socket: null,
    name: 'exec-controller',
    computed: {
      ...mapGetters({
        wbcCountList: Constant.GET_WBC_COUNT,
        currentUser: Constant.GET_CURRENT_USER,
        runningIntervalId: Constant.GET_RUNNING_INTERVAL_ID,
        isRunningState: Constant.GET_RUNNING_STATE,
        orderList: Constant.GET_ORDER_LIST_BM,
        settings: Constant.GET_SETTINGS,
        userStop: Constant.GET_USER_STOP
      })
    },
    data () {
      return {
        // rSelected: '01',
        // sSelected: '100',
        // 초기화 여부 체크
        isInit: 'N',
        intervalId: null
        // eqStatCd: '01'
      }
    },
    beforeDestroy () {
      // remove EventBus
      this.EventBus.$off('RECEIVE_DATA_SYSINFO')
      this.EventBus.$off('RECEIVE_DATA')
      this.EventBus.$off('STOP_EXCUTE_TIMER')
      // this.EventBus.$off('RECOVER_GRIPPER')
      // this.EventBus.$off('CHANGE_USER')
    },
    mounted () {
      var self = this
      this.intervalId = JSON.parse(JSON.stringify(this.runningIntervalId))

      if (this.isRunningState) {
        this.isInit = 'Y'
      }

      // this.EventBus.$on('CHANGE_USER', function(params) {
      //   self.rSelected = '01',
      //   self.sSelected = self.settings.pbAnalysisType
      // })

      // this.EventBus.$on('RECOVER_GRIPPER', function(params) {
      //   self.sendRecover()
      // })

      this.EventBus.$on('RECEIVE_DATA_SYSINFO', function(params) {
        self.isInit = params.isInit
        // self.eqStatCd = params.eqStatCd

        // isRecovery 추가
        // if (params.isRecovery === 'Y') {
        //   self.$store.dispatch(Constant.SET_USER_STOP, true)
        // } else {
        //   self.$store.dispatch(Constant.SET_USER_STOP, false)
        // }
      })

      this.EventBus.$on('RECEIVE_DATA', function(params) {
        var jobCmd = params.jobCmd
        console.log(params)
        if (jobCmd === 'INIT') {
          self.isInit = 'Y'
          // this.EventBus.$emit('OVERLAY', {state: false})
        }
        // else if (jobCmd === 'START') {
        //   self.$store.dispatch(Constant.UPDATE_RUNNING_STATE, true)
        //   self.sendRunningInfo()
        //
        // } else if (jobCmd === 'RECOVERY') {
        //   self.$store.dispatch(Constant.SET_USER_STOP, false)
        //   self.EventBus.$emit('OVERLAY', {state: false})
        //
        // } else if (jobCmd === 'RUNNING_INFO') {
        //   // iCasStat (0 - 없음, 1 - 있음, 2 - 진행중, 3 - 완료, 4 - 에러, 9 - 스캔)
        //   // oCasStat (0 - 없음, 1 - 있음)
        //   const regex = /[1,2,9]/g
        //   if ((params.iCasStat.search(regex) < 0) || params.oCasStat === '111111111111') {
        //       clearInterval(self.intervalId)
        //       self.$store.dispatch(Constant.SET_RUNNING_INTERVAL_ID, null)
        //       self.sendRunningComp()
        //   } else {
        //     if (self.intervalId !== null) {
        //       clearInterval(self.intervalId)
        //       self.$store.dispatch(Constant.SET_RUNNING_INTERVAL_ID, null)
        //     }
        //
        //     self.intervalId = setInterval(function() {
        //       self.$store.dispatch(Constant.SET_RUNNING_INTERVAL_ID, self.intervalId)
        //       self.sendRunningInfo()
        //     }, 500)
        //   }
        // } else if (jobCmd === 'STOP') {
        //   self.$store.dispatch(Constant.UPDATE_RUNNING_STATE, false)
        //   self.$store.dispatch(Constant.SET_RUNNING_INTERVAL_ID, null)
        //   clearInterval(self.intervalId)
        // }
      })

      this.EventBus.$on('STOP_EXCUTE_TIMER', function(params) {
        clearInterval(self.intervalId)
        self.$store.dispatch(Constant.SET_RUNNING_INTERVAL_ID, null)
      })
    },
    methods: {
      // 초기화
      sendIntialize () {
        var params = {
          jobCmd: 'INIT',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))
        // this.EventBus.$emit('OVERLAY', {state: true})
      },
      // 실행
      sendStart () {
        var userOrderList = []
        for (var i = 0; i < this.orderList.length; i++) {
          for (var j = 0; j < this.orderList[i].slotInfo.length; j++) {
            // 완료된거 실행 안함
            if (typeof(this.orderList[i].slotInfo[j].orderId) !== 'undefined' && this.orderList[i].slotInfo[j].analysisState !== 'Complete') {
              if (this.orderList[i].slotInfo[j].bmNo === null || this.orderList[i].slotInfo[j].bmNo === '') {
                this.$toasted.show(Constant.IDS_ERROR_INPUT_BM_NO, {
                  position: 'bottom-center',
                  duration: '2000'
                })

                return
              }

              var obj = {}
              var userInputStainType = ''
              if (this.orderList[i].slotInfo[j].stainType === '15') {
                userInputStainType = this.orderList[i].slotInfo[j].stainType
              }

              obj.orderId = this.orderList[i].slotInfo[j].orderId
              obj.cassetNo = this.orderList[i].cassetNo
              obj.slotNo = this.orderList[i].slotInfo[j].slotNo
              obj.bmNo = this.orderList[i].slotInfo[j].bmNo
              obj.patientId = this.orderList[i].slotInfo[j].patientId
              obj.patientNm = this.orderList[i].slotInfo[j].name
              obj.age = this.orderList[i].slotInfo[j].age
              obj.gender = this.orderList[i].slotInfo[j].gender
              obj.testType = '02'
              obj.stainType = this.orderList[i].slotInfo[j].stainTypeCd
              obj.userInputStainType = userInputStainType
              obj.analysisType = this.orderList[i].slotInfo[j].analysisTypeCd
              obj.bmSamplingSide = this.orderList[i].slotInfo[j].bmSamplingSideCd
              obj.cellCount = this.orderList[i].slotInfo[j].cellCount
              obj.department = this.orderList[i].slotInfo[j].departMent
              obj.stitchCount = this.orderList[i].slotInfo[j].stitchCount

              userOrderList.push(obj)
            }
          }
        }
        if (userOrderList.length <= 0) {
          this.$modal.show(ModalInfo, {item: Constant.IDS_ERROR_ENTER_YOUR_ORDER_DETAILS, path: 2}, {
            height: 'auto',
            width: '550px'
          })

          return
        }

        var params = {
          jobCmd: 'START',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          orderInfo: userOrderList,
          runningMode: this.settings.runningMode,
          positionMargin: this.settings.positionMargin
        }

        worker.sendDataToServer(this, JSON.stringify(params))

        // var logObj = {}
        // logObj.userId = this.currentUser.userId
        // logObj.eventTypeCd = Constant.EVENT_TYPE_SYSTEM
        // logObj.logDttm = this.$getDateTimeStr()
        // logObj.logMessage = '[' + Constant.EVENT_TYPE_SYSTEM + ']' +
        //                     '[Send : START]' +
        //                     '[' + this.currentUser.userId + ']'
        // this.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
      },
      // 검사 실행 정보 수신
      sendRunningInfo () {
        var params = {
          jobCmd: 'RUNNING_INFO',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }
        // ipcRenderer.send('SEND_DATA', JSON.stringify(params))
        worker.sendDataToServer(this, JSON.stringify(params))
      },
      // 실행 완료
      sendRunningComp () {
        var params = {
          jobCmd: 'RUNNING_COMP',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        // ipcRenderer.send('SEND_DATA', JSON.stringify(params))
        worker.sendDataToServer(this, JSON.stringify(params))
      },
      start (evt) {
        var self = this

        // 실행 여부 체크
        if (self.isRunningState) {
          self.$toasted.show(Constant.IDS_ERROR_ALREADY_RUNNING, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        // recovery필요 여부 체크
        if (self.userStop) {
          self.$modal.show(ModalConfirm, {openType: 'userStop', message: Constant.IDS_RECOVER_GRIPPER_CONDITION}, {
            height: 'auto',
            width: '350px'
          })

          return
        }

        // 초기화 여부 체크
        setTimeout(function() {
          if (self.isInit === 'Y') {
            self.sendStart()
          } else {
            // self.sendIntialize()
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

        // 종료
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
      }
      // sendRecover () {
      //   var self = this
      //
      //   // 종료
      //   var params = {
      //     jobCmd: 'RECOVERY',
      //     reqUserId: self.currentUser.userId,
      //     reqDttm: self.$getDateTimeStr()
      //   }
      //
      //   worker.sendDataToServer(this, JSON.stringify(params))
      //   self.EventBus.$emit('OVERLAY', {state: true})
      // }
    }
  }
</script>
<style>
  #execController {
    height: 200px;
  }
</style>
