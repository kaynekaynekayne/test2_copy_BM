<template>
  <div id="stitchingImage" class="viewHeightBm">
    <b-row>
      <b-col cols="7">
        <b-card id="cardWholeSlideViewer" class="pb-3" text-variant="white" no-body>
          <!-- <viewer id="wholeSlideViewer"
            :images="lowImages"
            :options="wholeSlideOptions"
            class="wholeSlideStyleBm">
            <img class="p-1" v-for="(image, index) in lowImages" :src="image" :key="index" style="width: 100%;" />
          </viewer> -->
          <div style="width: 100%; height: 860px" id="tiling-viewer" ref="image" />
        </b-card>
      </b-col>
      <b-col class="pl-0 pr-4 pt-2">
        <b-card id="cardWholeSlide" class="p-3" text-variant="white" no-body>
          <div style="border-bottom: 1px solid gray; height: 280px; overflow-y: scroll; overflow-x: hidden;">
            <b-row class="mb-2 mt-2">
              <b-col cols="3">
                <div class="panelSubTitleBlue">Particle Image</div>
              </b-col>
              <b-col class="text-left">
                <!-- <div style="color: red;">../{{ settings.particleDirNm }}</div> -->
              </b-col>
            </b-row>
            <div>
              <img class="p-2"
                v-for="(image, index) in particleThumb"
                :src="image"
                :key="index"
                @click="onClickParticle(image)"
                style="width: 90px;" />
            </div>
            <!-- <viewer id="particleViewer"
              :images="particleIdealImages"
              :options="particleOption">
              <img class="p-2" v-for="(image, index) in particleIdealImages" :src="image" :key="index" style="width: 90px;" />
            </viewer> -->
          </div>
          <div style="border-bottom: 1px solid gray; height: 280px; overflow-y: scroll; overflow-x: hidden;">
            <b-row class="mb-2 mt-2">
              <b-col cols="3">
                <div class="panelSubTitleBlue">Ideal Zone</div>
              </b-col>
              <b-col class="text-left">
              </b-col>
            </b-row>
            <div>
              <img class="p-2"
                v-for="(image, index) in idealZoneThumb"
                :src="image"
                :key="index"
                @click="onClickIdealZone(image)"
                style="width: 90px;" />
            </div>
            <!-- <viewer id="idealZone"
              :images="idealZoneImages"
              :options="particleOption">
              <img class="p-2" v-for="(image, index) in idealZoneImages" :src="image" :key="index" style="width: 90px;" />
            </viewer> -->
          </div>
          <div style="height: 280px; overflow-y: scroll; overflow-x: hidden;">
            <b-row>
              <b-col>
                <b-row class="mb-2 mt-2">
                  <b-col>
                    <div class="panelSubTitleBlue">Ideal Stitch</div>
                  </b-col>
                  <b-col class="text-left">
                    <!-- <div style="color: red;">../{{ settings.cellIdealStitchDirNm }}</div> -->
                  </b-col>
                </b-row>
                <div>
                  <img class="p-2"
                    v-for="(image, index) in idealStitchThumb"
                    :src="image"
                    :key="index"
                    @click="onClickIdealStitch(image)"
                    style="width: 90px;" />
                </div>
                <!-- <viewer id="idealStitch"
                  :images="idealStitchImages"
                  :options="particleOption">
                  <img class="p-2" v-for="(image, index) in idealStitchImages" :src="image" :key="index" style="width: 90px;" />
                </viewer> -->
              </b-col>
              <b-col>
                <b-row class="mb-2 mt-2">
                  <b-col>
                    <div class="panelSubTitleBlue">Megakaryocyte</div>
                  </b-col>
                  <b-col class="text-left">
                    <!-- <div style="color: red;">../{{ settings.cellIdealStitchDirNm }}</div> -->
                  </b-col>
                </b-row>
                <div>
                  <img class="p-2"
                    v-for="(image, index) in megaThumb"
                    :src="image"
                    :key="index"
                    @click="onClickMega(image)"
                    style="width: 90px;" />
                </div>
                <!-- <viewer id="megaImage"
                  :images="megaImages"
                  :options="particleOption">
                  <img class="p-2" v-for="(image, index) in megaImages" :src="image" :key="index" style="width: 90px;" />
                </viewer> -->
              </b-col>
            </b-row>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- <div v-show="analysisTypeCd !== '04'" class="p-3">
      <b-card id="cardWholeSlide" text-variant="white" no-body>
        <viewer id="particleViewer"
          :images="particleIdealImages"
          :options="particleOption">
          <img class="pl-3" v-for="(image, index) in particleIdealImages" :src="image" :key="index" style="width: 130px;" />
        </viewer>
      </b-card>
    </div> -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import ModalInfo from '../../../Common/ModalInfo'
  import '../../../../components/Plugins/OPenSeadragonCanvasOverlay-0.0.2/openseadragon-canvas-overlay.js'
  import OpenSeadragon from 'OpenSeadragon'
  import Viewer from 'viewerjs'

  const fs = require('fs')
  const path = require('path')
  const env = {...process.env,ELECTRON_VERSION:process.versions.electron}

  export default {
    name: 'row-magnification-image',
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS
        // workList: Constant.GET_WORK_LIST
      })
    },
    props: ['orderId', 'paramItem'],
    watch: {
      // orderId: function(newVal, oldVal) { // watch it
      //   console.log(newVal)
      // },
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
        this.initElement()
      }
    },
    data () {
      return {
        lowImages: [],
        // particleIdealImages: [],
        particleThumb: [],
        // idealZoneImages: [],
        idealZoneThumb: [],
        // idealStitchImages: [],
        idealStitchThumb: [],
        // megaImages: [],
        megaThumb: [],
        wholeSlideOptions: {
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
        particleOption: {
          maxZoomRatio: 2,
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
        filterExpDzi: /^.dzi$/,
        selectedItem: null,
        analysisTypeCd: '01',
        tilingViewer: null
      }
    },
    beforeDestroy () {
      this.EventBus.$off('SIDE_MENU_STATE_CHANGE')
    },
    mounted () {
      var self = this

      this.EventBus.$on('SIDE_MENU_STATE_CHANGE', function(state) {
        window.dispatchEvent(new Event('resize'))
      })
    },
    methods: {
      onClickParticle (image) {
        // console.log(this.particleThumb)
        // console.log(this.particleIdealImages)
        // console.log(this.particleOption)
        // var self = this
        // var divNode = document.createElement('div')
        //
        // this.particleIdealImages.forEach(function(item) {
        //   var image = new Image()
        //   image.src = item
        //
        //   divNode.appendChild(image)
        // })

        var viewerImage = new Image()
        viewerImage.src = image.replace('thumb/', '')

        new Viewer(viewerImage, this.particleOption).show()
      },
      onClickIdealZone (image) {
        var viewerImage = new Image()
        viewerImage.src = image.replace('thumb/', '')

        new Viewer(viewerImage, this.particleOption).show()
      },
      onClickIdealStitch (image) {
        var viewerImage = new Image()
        viewerImage.src = image.replace('thumb/', '')

        new Viewer(viewerImage, this.particleOption).show()
      },
      onClickMega (image) {
        var viewerImage = new Image()
        viewerImage.src = image.replace('thumb/', '')

        new Viewer(viewerImage, this.particleOption).show()
      },
      initElement () {
        try {
          var self = this

          // this.selectedItem = this.workList.find(function (item) {
          //   return item.ORDER_ID === orderId
          // })

          if (this.selectedItem !== null) {
            var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
            var slotDirList = fs.readdirSync(rootPath)
            var stitchingPath = null
            var particlePath = null
            var idealPath = null
            var idealStitchPath = null
            var megaImagePath = null

            this.analysisTypeCd = this.selectedItem.ANALYSIS_TYPE
            this.lowImages = []
            // this.particleIdealImages = []
            this.particleThumb = []
            // this.idealZoneImages = []
            this.idealZoneThumb = []
            // this.idealStitchImages = []
            this.idealStitchThumb = []
            // this.megaImages = []
            this.megaThumb = []

            for (var i = 0; i < slotDirList.length; i++) {
              if (slotDirList[i].includes(this.settings.stitchingDirNm)) {
                stitchingPath = rootPath + '/' + slotDirList[i]
              } else if (slotDirList[i].includes(this.settings.particleDirNm)) {
                particlePath = rootPath + '/' + slotDirList[i]
              } else if (slotDirList[i].includes(this.settings.cellIdealDirNm)) {
                idealPath = rootPath + '/' + slotDirList[i]
              } else if (slotDirList[i].includes(this.settings.cellIdealStitchDirNm)) {
                idealStitchPath = rootPath + '/' + slotDirList[i]
              } else if (slotDirList[i].includes(this.settings.megaImageDirNm)) {
                megaImagePath = rootPath + '/' + slotDirList[i]
              }
            }

            // stitching images
            if (stitchingPath !== null) {
              // var files = fs.readdirSync(stitchingPath).filter(function (file) {
              //   return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
              // })
              //
              // for (var i = 0; i < files.length; i++) {
              //   self.lowImages.push('file://' + stitchingPath + '/' + files[i])
              // }

              console.log(stitchingPath)

              var tileSources = []

              var files = fs.readdirSync(stitchingPath).filter(function (file) {
                return self.filterExpDzi.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
              })

              console.log(files)
              files.forEach(function(dziFile) {
                tileSources.push(self.$tileSourceFromData(stitchingPath + '/' + dziFile))
              })

              console.log(files)
              console.log(tileSources)

              var prefixUrl = 'node_modules/openseadragon/build/openseadragon/images/'
              if (env.NODE_ENV !== 'development') {
                var prefixUrl = env.LOCALAPPDATA + '/Programs/UIMD_PB_IA/resources/app.asar/node_modules/openseadragon/build/openseadragon/images/'
              }

              console.log(self.tilingViewer)
              if (self.tilingViewer !== null) {
                self.tilingViewer.destroy()
                self.tilingViewer = null
              }

              self.tilingViewer = OpenSeadragon({
                id: 'tiling-viewer',
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

            if (self.analysisTypeCd !== '04') {
              // particle images
              if (particlePath !== null) {
                // var particleFiles = fs.readdirSync(particlePath).filter(function (file) {
                //   return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                // })
                //
                // for (var i = 0; i < particleFiles.length; i++) {
                //   self.particleIdealImages.push('file://' + particlePath + '/' + particleFiles[i])
                // }

                // thumb
                var particleThumbFiles = fs.readdirSync(particlePath + '/thumb').filter(function (file) {
                  return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                })

                for (var i = 0; i < particleThumbFiles.length; i++) {
                  self.particleThumb.push('file://' + particlePath + '/thumb' + '/' + particleThumbFiles[i])
                }

              }
              // ideal images
              if (idealPath !== null) {
                // ideal images
                // var idealFiles = fs.readdirSync(idealPath).filter(function (file) {
                //   return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                // })
                //
                // for (var i = 0; i < idealFiles.length; i++) {
                //   self.idealZoneImages.push('file://' + idealPath + '/' + idealFiles[i])
                // }

                // thumb
                var idealZoneFiles = fs.readdirSync(idealPath + '/thumb').filter(function (file) {
                  return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                })

                for (var i = 0; i < idealZoneFiles.length; i++) {
                  self.idealZoneThumb.push('file://' + idealPath + '/thumb' + '/' + idealZoneFiles[i])
                }

              }

              // ideal stitch images
              if (idealStitchPath !== null) {
                // var idealFiles = fs.readdirSync(idealStitchPath).filter(function (file) {
                //   return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                // })
                //
                // for (var i = 0; i < idealFiles.length; i++) {
                //   self.idealStitchImages.push('file://' + idealStitchPath + '/' + idealFiles[i])
                // }

                // thumb
                var idealStitchFiles = fs.readdirSync(idealStitchPath + '/thumb').filter(function (file) {
                  return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                })

                for (var i = 0; i < idealStitchFiles.length; i++) {
                  self.idealStitchThumb.push('file://' + idealStitchPath + '/thumb' + '/' + idealStitchFiles[i])
                }

              }

              // megakaryocyte
              if (megaImagePath !== null) {
                // var idealFiles = fs.readdirSync(megaImagePath).filter(function (file) {
                //   return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                // })
                // console.log(idealFiles)
                // for (var i = 0; i < idealFiles.length; i++) {
                //   self.megaImages.push('file://' + megaImagePath + '/' + idealFiles[i])
                // }

                // thumb
                var megaFiles = fs.readdirSync(megaImagePath + '/thumb').filter(function (file) {
                  return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                })

                for (var i = 0; i < megaFiles.length; i++) {
                  self.megaThumb.push('file://' + megaImagePath + '/thumb' + '/' + megaFiles[i])
                }

              }
            }
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
  #cardWholeSlideViewer {
    background-color: #313131 !important;
  }
  #cardWholeSlide {
    background-color: #313131 !important;
    /* padding: 10px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px black;
    border: 1px solid #303744;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 140px; */
  }
  #stitchingImage {
    background-color: #282828 !important;
  }
  .viewHeightBm {
    height: 910px;
  }
  .wholeSlideStyleBm {
    text-align: center;
    height: 870px;
    overflow: hidden;
  }
</style>
