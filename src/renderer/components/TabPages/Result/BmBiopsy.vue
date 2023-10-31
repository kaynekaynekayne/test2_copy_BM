<template>
  <div id="divBmBiopsy" class="viewHeightBmBiopsy">
    <div>
      <!-- <viewer id="wholeSlideViewer"
        :images="lowImages"
        :options="biopsySlideOptions"
        class="wholeSlideStyleBmBiopsy">
        <img class="p-1" v-for="(image, index) in lowImages" :src="image" :key="index" style="width: 100%;" />
      </viewer> -->
      <div style="width: 100%; height: 860px" id="wholeSlideViewer" ref="image" />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'
  import ModalInfo from '../../Common/ModalInfo'
  import '../../../components/Plugins/OPenSeadragonCanvasOverlay-0.0.2/openseadragon-canvas-overlay.js'
  import OpenSeadragon from 'OpenSeadragon'

  const env = {...process.env,ELECTRON_VERSION:process.versions.electron}
  const fs = require('fs')
  const path = require('path')
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'bm-biopsy',
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS
        // workList: Constant.GET_WORK_LIST
      })
    },
    data () {
      return {
        lowImages: [],
        particleIdealImages: [],
        biopsySlideOptions: {
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
        // selectedItem: null,
        // orderId: null,
        paramItem: null,
        tilingViewer: null,
        filterExpDzi: /^.dzi$/
      }
    },
    beforeDestroy () {
      this.EventBus.$off('SIDE_MENU_STATE_CHANGE')
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
    },
    mounted () {
      var self = this

      // this.initElement(this.$route.params.orderId)
      // this.orderId = this.$route.params.orderId

      // this.paramItem = JSON.parse(this.$route.params.selectedItem)

      this.EventBus.$on('SIDE_MENU_STATE_CHANGE', function(state) {
        window.dispatchEvent(new Event('resize'))
      })

      var slide = JSON.parse(this.$route.params.selectedItem)
      ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({orderId: slide.ORDER_ID}))

      ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
        console.log(result)
        self.paramItem = result
        self.initElement()
      })
    },
    methods: {
      initElement () {
        try {
          var self = this

          // this.selectedItem = this.workList.find(function (item) {
          //   return item.ORDER_ID === orderId
          // })

          console.log(this.paramItem)
          if (this.paramItem !== null) {
            var rootPath = this.settings.pbiaRootPath + '/' + this.paramItem.SLOT_ID
            var slotDirList = fs.readdirSync(rootPath)
            var stitchingPath = null

            this.lowImages = []
            for (var i = 0; i < slotDirList.length; i++) {
              if (slotDirList[i].includes(this.settings.stitchingDirNm)) {
                stitchingPath = rootPath + '/' + slotDirList[i]
              }
            }
            console.log(stitchingPath)
            // stitching images
            // if (stitchingPath !== null) {
            //   var files = fs.readdirSync(stitchingPath).filter(function (file) {
            //     return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
            //   })
            //
            //   for (var i = 0; i < files.length; i++) {
            //     self.lowImages.push('file://' + stitchingPath + '/' + files[i])
            //   }
            // }

            var tileSources = []

            var files = fs.readdirSync(stitchingPath).filter(function (file) {
              return self.filterExpDzi.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
            })

            files.forEach(function(dziFile) {
              tileSources.push(self.$tileSourceFromData(stitchingPath + '/' + dziFile))
            })

            var prefixUrl = 'node_modules/openseadragon/build/openseadragon/images/'
            if (env.NODE_ENV !== 'development') {
              var prefixUrl = env.LOCALAPPDATA + '/Programs/UIMD_PB_IA/resources/app.asar/node_modules/openseadragon/build/openseadragon/images/'
            }

            if (self.tilingViewer !== null) {
              self.tilingViewer.destroy()
              self.tilingViewer = null
            }

            self.tilingViewer = OpenSeadragon({
              id: 'wholeSlideViewer',
              animationTime: 0.4,
              // prefixUrl: 'node_modules/openseadragon/build/openseadragon/images/',
              prefixUrl: prefixUrl,
              navigatorSizeRatio: 0.25,
              showNavigator: true,
              sequenceMode: true,
              showReferenceStrip: false,
              tileSources: tileSources,
              // defaultZoomLevel: 0.1,
              gestureSettingsMouse: {clickToZoom: false}
            })
          }
        } catch (err) {
          this.$modal.show(ModalInfo, {item: err.message, path: 4}, {
            height: 'auto',
            width: '550px'
          })
        }
      }
    }
  }
</script>

<style>
  #divBmBiopsy {
    background-color: #282828 !important;
  }
  .wholeSlideStyleBmBiopsy {
    text-align: center;
    height: 912px;
    overflow: hidden;
  }
  .viewHeightBmBiopsy {
    height: 912px;
  }
</style>
