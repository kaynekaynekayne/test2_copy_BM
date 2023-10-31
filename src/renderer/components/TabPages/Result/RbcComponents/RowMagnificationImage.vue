<template>
  <div id="rowMagnificationImage" style="height: 750px;">
    <viewer id="rowMagViewer"
      :images="lowImages"
      :options="lowMagnificationOptions"
      style="text-align: center; height: 100%; overflow: hidden;">
      <img class="wbcImage p-1" v-for="(image, index) in lowImages" :src="image" :key="index" style="width: 100%;" />
    </viewer>
  </div>
</template>

<script>
  const fs = require('fs')
  const path = require('path')
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import ModalInfo from '../../../Common/ModalInfo'

  export default {
    name: 'row-magnification-image',
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS
        // workList: Constant.GET_WORK_LIST
      })
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newObj, oldObj) {
        this.selectedItem = newObj

        this.initElement()
      }
    },
    data () {
      return {
        lowImages: [],
        lowMagnificationOptions: {
          inline: true,
          maxZoomRatio: 40,
          toolbar: {
            zoomIn: 4,
            zoomOut: 4,
            oneToOne: 4,
            reset: 4,
            prev: 4,
            play: 0,
            next: 4,
            rotateLeft: 4,
            rotateRight: 4,
            flipHorizontal: 4,
            flipVertical: 4
          }
        },
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        selectedItem: null
      }
    },
    beforeDestroy () {
      this.EventBus.$off('SIDE_MENU_STATE_CHANGE')
    },
    mounted () {
      var self = this

      this.selectedItem = JSON.parse(this.$route.params.selectedItem)

      this.initElement()
      this.EventBus.$on('SIDE_MENU_STATE_CHANGE', function(state) {
        window.dispatchEvent(new Event('resize'))
      })
    },
    methods: {
      initElement () {
    	  try {
          var self = this
          this.lowImages = []
          // for (var i = 0; i < this.workList.length; i++) {
          //   if (this.workList[i].ORDER_ID === orderId) {
          //     this.selectedItem = this.workList[i]
          //   }
          // }

        	var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
          var slotDirList = fs.readdirSync(rootPath)
          var magnificationPath = null

  	      for (var i = 0; i < slotDirList.length; i++) {
            if (slotDirList[i].includes(this.settings.rbcDirNm)) {
              magnificationPath = rootPath + '/' + slotDirList[i]
            }
          }

          console.log(magnificationPath)
          var files = fs.readdirSync(magnificationPath).filter(function (file) {
            return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
          })
          console.log(files)

          for (var i = 0; i < files.length; i++) {
            this.lowImages.push('file://' + magnificationPath + '/' + files[i])
          }
        } catch (err) {
          this.$modal.show(ModalInfo, {item: err.message}, {
            height: 'auto',
            width: '550px'
          })
        }
      }
    }
  }
</script>

<style>
</style>
