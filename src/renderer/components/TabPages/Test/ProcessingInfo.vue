<template>
  <div class="mt-2" id="processingInfo">
    <b-card id="processingInfoCard" class="blackCard h-100" text-variant="white" no-body>
      <div id="title" class="panelTitle">Current Order</div>
      <b-row class="mt-3">
        <b-col class="panelSubTitle pl-4 text-left" cols="6">
          <span>BM No.</span><span style="float: right;">:</span>
        </b-col>
        <b-col>
          <div class="panelContent">{{ modelData.bmNo }}</div>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4 text-left" cols="6">
          <span>Patient ID</span><span style="float: right;">:</span>
        </b-col>
        <b-col>
          <div class="panelContent">{{ modelData.patientId }}</div>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4 text-left" cols="6">
          <span>Name</span><span style="float: right;">:</span>
        </b-col>
        <b-col>
          <div class="panelContent">{{ modelData.patientName }}</div>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4 text-left" cols="6">
          <span>Age / Gender</span><span style="float: right;">:</span>
        </b-col>
        <b-col>
          <div class="panelContent">{{ modelData.age }} / {{ modelData.gender }}</div>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4 text-left" cols="6">
          <span>Department</span><span style="float: right;">:</span>
        </b-col>
        <b-col>
          <div class="panelContent">{{ modelData.department }}</div>
        </b-col>
      </b-row>
      <!-- <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4 text-left" cols="6">
          <span>Scan Type</span><span style="float: right;">:</span>
        </b-col>
        <b-col>
          <div class="panelContent">{{ modelData.pbBm }}</div>
        </b-col>
      </b-row> -->
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4 text-left" cols="6">
          <span>Scan Type</span><span style="float: right;">:</span>
        </b-col>
        <b-col>
          <div class="panelContent">{{ modelData.analysisType }}</div>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4 text-left" cols="6">
          <span>Cell Count</span><span style="float: right;">:</span>
        </b-col>
        <b-col>
          <div class="panelContent">{{ modelData.cellCount }}</div>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4 text-left" cols="6">
          <span>BM Sampling Site</span><span style="float: right;">:</span>
        </b-col>
        <b-col>
          <div class="panelContent">{{ modelData.bmSide }}</div>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4 text-left" cols="6">
          <span>Stain Type</span><span style="float: right;">:</span>
        </b-col>
        <b-col>
          <div class="panelContent">{{ modelData.stainType }}</div>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="panelSubTitle pl-4 text-left" cols="6">
          <span>{{ modelData.currentCardName }}</span><span style="float: right;">:</span>
        </b-col>
        <b-col>
          <div v-if="modelData.currentCardCount <= 500" class="panelContent" style="color: red;">{{ modelData.currentCardCount }}</div>
          <div v-else class="panelContent">{{ modelData.currentCardCount }}</div>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'

  export default {
    name: 'processing-info',
    computed: {
      ...mapGetters({
        commonCodeList: Constant.GET_COMMON_CODE_LIST,
        commonCode: Constant.GET_COMMON_CODE
      })
    },
    data () {
      return {
        modelData: {
          cassetNo: '',
          slotNo: '',
          orderId: '',
          department: '',
          barcodeId: '',
          patientId: '',
          patientName: '',
          cellCount: '',
          bmSide: '',
          stainType: '',
          bmNo: '',
          age: '',
          gender: '',
          analysisType: '',
          currentCardName: '',
          currentCardCount: 0
        },
        stainTypeList: []
      }
    },
    beforeDestroy () {
      this.EventBus.$off('RECEIVE_DATA_SYSINFO')
      this.EventBus.$off('RECEIVE_DATA')
      this.EventBus.$off('CHANGE_USER')
    },
    mounted () {
      var self = this

      this.stainTypeList = this.stainTypeList.concat(this.commonCodeList(Constant.GET_CODE_LIST_GENERAL_STAIN))
      this.stainTypeList = this.stainTypeList.concat(this.commonCodeList(Constant.GET_CODE_LIST_SPECIAL_STAIN))
      this.stainTypeList = this.stainTypeList.concat(this.commonCodeList(Constant.GET_CODE_LIST_IMMUNO_STAIN))

      this.EventBus.$on('CHANGE_USER', function(params) {
        Object.keys(self.modelData).forEach(function(item) {
          self.modelData[item] = ''
        })
      })

      this.EventBus.$on('RECEIVE_DATA_SYSINFO', function(params) {
        self.modelData.currentCardName = params.currentCardName
        self.modelData.currentCardCount = Number(params.currentCardCount)

      })

      this.EventBus.$on('RECEIVE_DATA', function(params) {
        var jobCmd = params.jobCmd

        if (jobCmd === 'RUNNING_INFO') {
          var currentSlot = params.slotInfo.find(function (item) {
            return item.stateCd === '03'
          })

          if (typeof(currentSlot) !== 'undefined') {
            var stainType = currentSlot.userInputStainType

            for (var i = 0; i < self.stainTypeList.length; i++) {
              if (self.stainTypeList[i].cd === currentSlot.stainType) {
                stainType = self.stainTypeList[i].cdNm
              }
            }
            self.modelData.cassetNo = params.cassetNo
            self.modelData.slotNo = currentSlot.slotNo
            self.modelData.department = currentSlot.department
            self.modelData.orderId = currentSlot.orderId
            self.modelData.barcodeId = currentSlot.barcodeNo
            self.modelData.patientId = currentSlot.patientId
            self.modelData.patientName = currentSlot.patientNm
            self.modelData.analysisType = self.commonCode(Constant.GET_CODE_LIST_ANALYSIS_TYPE, currentSlot.analysisType).cdNm
            self.modelData.cellCount = currentSlot.cellCount
            self.modelData.bmSide = self.commonCode(Constant.GET_CODE_LIST_SAMPLING_STAIN, currentSlot.bmSamplingSide).cdNm
            self.modelData.stainType = stainType,
            self.modelData.bmNo = currentSlot.bmNo
            self.modelData.age = currentSlot.age
            self.modelData.gender = self.commonCode(Constant.GET_CODE_LIST_GENDER, currentSlot.gender).cdNm
          }
        }
      })
    },
    methods: {
    }
  }
</script>
<style>
  #processingInfo {
    height: 345px;
  }
</style>
