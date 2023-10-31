<template>
  <b-container id="wholeSlideReport" class="p-0" fluid>
    <b-row>
      <!-- <transition name="fade" v-on:after-enter="afterEnter" v-on:after-leave="afterLeave">
        <b-col v-show="isSideShow" class="p-0 pr-1" cols="3">
          <bm-cell-classification :order-id="orderId"></bm-cell-classification>
        </b-col>
      </transition> -->
      <b-col class="p-0">
        <whole-slide-image-list :param-item="paramItem"></whole-slide-image-list>
      </b-col>
    </b-row>
    <!-- <img v-show="isSideShow" class="pointer sideClose" src="~@/assets/result/side-close.png" @click="onSideClose" />
    <img v-show="!isSideShow" class="pointer sideOpen" src="~@/assets/result/side-open.png" @click="onSideOpen" /> -->
  </b-container>
</template>

<script>
  import BmCellClassification from './BmCellComponents/BmCellClassification'
  import WholeSlideImageList from './WholeSlideComponents/WholeSlideImageList'
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'whole-slide-report-page',
    components: { BmCellClassification, WholeSlideImageList },
    computed: {
      ...mapGetters({
        // workList: Constant.GET_WORK_LIST
      })
    },
    data () {
      return {
        isSideShow: true,
        paramItem: null
        // orderId: ''
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
    },
    methods: {
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
