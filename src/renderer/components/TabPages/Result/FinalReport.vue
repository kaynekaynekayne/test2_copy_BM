<template>
  <b-container id="finalReport" class="pl-0" fluid>
    <b-row>
      <b-col v-show="analysisTypeCd === '01'" class="p-0 pr-1" cols="3">
        <rbc-classification :param-item="paramItem"></rbc-classification>
      </b-col>
      <b-col v-show="analysisTypeCd === '01'" class="p-0 pr-1" cols="3">
        <wbc-classification :param-item="paramItem"></wbc-classification>
      </b-col>
      <b-col v-show="analysisTypeCd === '02'" class="p-0 pr-1" cols="3">
        <bm-cell-classification :param-item="paramItem"></bm-cell-classification>
      </b-col>
      <b-col class="p-0">
        <report :param-item="paramItem"></report>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
  import RbcClassification from './RbcComponents/RbcClassification'
  import WbcClassification from './WbcComponents/WbcClassification'
  import BmCellClassification from './BmCellComponents/BmCellClassification'
  import Report from './FinalReportComponents/Report'
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'final-report-page',
    components: { RbcClassification, WbcClassification, BmCellClassification, Report },
    computed: {
      ...mapGetters({
        // workList: Constant.GET_WORK_LIST
      })
    },
    data () {
      return {
        // orderId: '',
        paramItem: null,
        analysisTypeCd: '00'
      }
    },
    beforeDestroy () {
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
    },
    mounted () {
      var self = this
      // this.initElement(this.$route.params.orderId)
      // this.orderId = this.$route.params.orderId

      // this.paramItem = JSON.parse(this.$route.params.selectedItem)
      // console.log(this.paramItem)
      // this.analysisTypeCd = this.paramItem.ANALYSIS_TYPE

      var slide = JSON.parse(self.$route.params.selectedItem)
      ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({orderId: slide.ORDER_ID}))

      ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
        console.log(result)
        self.paramItem = result
        self.analysisTypeCd = self.paramItem.ANALYSIS_TYPE
      })
    },
    methods: {
      // initElement (orderId) {
      //   for (var i = 0; i < this.workList.length; i++) {
      //     if (this.workList[i].ORDER_ID === orderId) {
      //       this.analysisTypeCd = this.workList[i].ANALYSIS_TYPE
      //     }
      //   }
      // }
    }
  }
</script>
<style>
</style>
