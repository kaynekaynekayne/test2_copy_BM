<template>
  <b-container id="wbcReport" class="p-0" fluid>
    <b-row>
      <transition name="fade" v-on:after-enter="afterEnter" v-on:after-leave="afterLeave">
        <b-col v-show="isSideShow" class="p-0 pr-1" cols="3">
          <wbc-classification :param-item="paramItem"></wbc-classification>
        </b-col>
      </transition>
      <b-col class="p-0">
        <wbc-result-image-list :param-item="paramItem"></wbc-result-image-list>
      </b-col>
    </b-row>
    <!-- <img v-if="isSideShow" class="pointer sideClose" src="~@/assets/result/side-close.png" @click="onSideClose" />
    <img v-else class="pointer sideOpen" src="~@/assets/result/side-open.png" @click="onSideOpen" /> -->
  </b-container>
</template>

<script>
  import WbcClassification from './WbcComponents/WbcClassification'
  import WbcResultImageList from './WbcComponents/WbcResultImageList'
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'wbc-report-page',
    components: { WbcClassification, WbcResultImageList },
    computed: {
      ...mapGetters({
        // workList: Constant.GET_WORK_LIST
      })
    },
    data () {
      return {
        isSideShow: true,
        // orderId: null,
        paramItem: null
      }
    },
    beforeDestroy () {
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
    },
    mounted () {
      var self = this
      // this.orderId = this.$route.params.orderId
      // this.paramItem = JSON.parse(this.$route.params.selectedItem)
      // this.signedState = this.selectedItem.SIGNED_STATE

      var slide = JSON.parse(this.$route.params.selectedItem)
      ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({orderId: slide.ORDER_ID}))

      ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
        console.log(result)
        self.paramItem = result
      })
    },
    methods: {
      // initElement (orderId) {
        // for (var i = 0; i < this.workList.length; i++) {
        //   if (this.workList[i].ORDER_ID === orderId) {
        //     this.signedState = this.workList[i].SIGNED_STATE
        //   }
        // }
      // },
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
  #functionTitle {
    font-size: 11px;
    color: green;
  }
  #classWbcTab {
    color: black;
  }
</style>
