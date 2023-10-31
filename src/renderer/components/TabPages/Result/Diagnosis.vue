<template>
  <b-container id="Diagnosis" class="p-0" fluid>
    <!-- <b-row class="pt-2 pb-2" style="background-color: #282828;">
      <b-col class="pt-2" cols="10">
        Suggest Diagnosis : {{ diagnosisResult }}
      </b-col>
    </b-row> -->
    <b-row>
      <!-- <b-col class="p-0">
        <cbc-result :param-item="paramItem"></cbc-result>
      </b-col> -->
      <b-col cols="5" class="p-0">
        <pb-result :param-item="paramItem"></pb-result>
      </b-col>
      <b-col class="p-0">
        <bm-result :param-item="paramItem"></bm-result>
      </b-col>
      <b-col class="p-0">
        <diagnosis-result :param-item="paramItem"></diagnosis-result>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'
  import CbcResult from './DiagnosisComponents/CbcResult'
  import PbResult from './DiagnosisComponents/PbResult'
  import BmResult from './DiagnosisComponents/BmResult'
  import DiagnosisResult from './DiagnosisComponents/DiagnosisResult'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'diagnosis-page',
    components: { CbcResult, PbResult, BmResult, DiagnosisResult },
    computed: {
      ...mapGetters({
        workList: Constant.GET_WORK_LIST
      })
    },
    data () {
      return {
        // orderId: '',
        paramItem: null,
        diagnosisResult: ''
      }
    },
    beforeDestroy () {
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
    },
    mounted () {
      var self = this
      // this.orderId = this.$route.params.orderId
      // this.paramItem = JSON.parse(this.$route.params.selectedItem)

      var slide = JSON.parse(this.$route.params.selectedItem)
      ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({orderId: slide.ORDER_ID}))

      ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
        console.log(result)
        self.paramItem = result
      })

      // diag result
      this.EventBus.$on('SEND_DIAG_RESULT', function(params) {
        self.diagnosisResult = params
      })
    },
    methods: {
    }
  }
</script>

<style>
</style>
