<template>
  <b-container id="rbcReport" class="pl-0" fluid>
    <b-row>
      <transition name="fade" v-on:after-enter="afterEnter" v-on:after-leave="afterLeave">
        <b-col v-show="isSideShow" class="p-0 pr-1" cols="3">
          <rbc-classification :param-item="paramItem"></rbc-classification>
        </b-col>
      </transition>
      <b-col class="p-0">
        <!-- <rbc-image-viewer :param-item="paramItem"></rbc-image-viewer> -->
        <rbc-tiling-viewer :param-item="paramItem"></rbc-tiling-viewer>
      </b-col>
    </b-row>
    <!-- <img v-if="isSideShow" class="pointer sideClose" src="~@/assets/result/side-close.png" @click="onSideClose" />
    <img v-else class="pointer sideOpen" src="~@/assets/result/side-open.png" @click="onSideOpen" /> -->
  </b-container>
</template>

<script>
  import RbcClassification from './RbcComponents/RbcClassification'
  // import RbcImageViewer from './RbcComponents/RbcImageViewer'
  import RbcTilingViewer from './RbcComponents/RbcTilingViewer'
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'rbc-report-page',
    components: { RbcClassification, RbcTilingViewer },
    data () {
      return {
        // orderId: null,
        paramItem: null,
        isSideShow: true
      }
    },
    beforeDestroy () {
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
    },
    mounted () {
      var self = this
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
  .sideClose {
    width: 30px;
    position: absolute;
    top: 45px;
    left: 360px;
  }
  .sideOpen {
    width: 30px;
    position: absolute;
    top: 45px;
    left: 0px;
  }
</style>
