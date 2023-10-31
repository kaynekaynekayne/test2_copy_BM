<template>
  <b-container id="bmCellReport" class="p-0" fluid>
    <b-row>
      <transition name="fade" v-on:after-enter="afterEnter" v-on:after-leave="afterLeave">
        <b-col v-show="isSideShow" class="p-0 pr-1" cols="3">
          <bm-cell-classification :param-item="paramItem"></bm-cell-classification>
        </b-col>
      </transition>
      <b-col class="p-0">
        <bm-cell-result-image-list :param-item="paramItem"></bm-cell-result-image-list>
      </b-col>
    </b-row>
    <!-- <img v-show="isSideShow && analysisTypeCd !== '04'" class="pointer sideClose" src="~@/assets/result/side-close.png" @click="onSideClose" />
    <img v-show="!isSideShow && analysisTypeCd !== '04'" class="pointer sideOpen" src="~@/assets/result/side-open.png" @click="onSideOpen" /> -->
  </b-container>
</template>

<script>
  import BmCellClassification from './BmCellComponents/BmCellClassification'
  import BmCellResultImageList from './BmCellComponents/BmCellResultImageList'
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'bm-cell-report-page',
    components: { BmCellClassification, BmCellResultImageList },
    computed: {
      ...mapGetters({
        // workList: Constant.GET_WORK_LIST
      })
    },
    beforeDestroy () {
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
    },
    data () {
      return {
        // orderId: '',
        paramItem: null,
        isSideShow: true,
        selectedItem: null,
        analysisTypeCd: '01'
      }
    },
    mounted () {
      var self = this
      // this.initElement(this.$route.params.orderId)
      // this.orderId = this.$route.params.orderId

      // this.paramItem = JSON.parse(this.$route.params.selectedItem)


      var slide = JSON.parse(this.$route.params.selectedItem)
      ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({orderId: slide.ORDER_ID}))

      ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
        console.log(result)
        self.paramItem = result

        // BM biopsy
        self.analysisTypeCd = self.paramItem.ANALYSIS_TYPE
        if (self.paramItem.ANALYSIS_TYPE === '04') {
          self.isSideShow = false
        } else {
          self.isSideShow = true
        }
      })
    },
    methods: {
      initElement (orderId) {
        this.selectedItem = this.workList.find(function (item) {
          return item.ORDER_ID === orderId
        })

        // BM biopsy
        this.analysisTypeCd = this.selectedItem.ANALYSIS_TYPE
        if (this.selectedItem.ANALYSIS_TYPE === '04') {
          this.isSideShow = false
        } else {
          this.isSideShow = true
        }
      },
      onSideClose (evt) {
        this.isSideShow = false
      },
      onSideOpen (evt) {
        this.isSideShow = true
      },
      afterEnter (el, done) {
        this.EventBus.$emit('SIDE_MENU_STATE_CHANGE', this.isSideShow)
      },
      afterLeave (el, done) {
        this.EventBus.$emit('SIDE_MENU_STATE_CHANGE', this.isSideShow)
      }
    }
  }
</script>

<style>
</style>
