<template>
  <div id="tilingViewer">
    <div style="width: 100%; height: 800px" id="tiling-viewer" ref="image" />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import ModalInfo from '../../../Common/ModalInfo'
  // import '../../../../components/Plugins/OPenSeadragonCanvasOverlay-0.0.2/openseadragon/openseadragon.js'
  import '../../../../components/Plugins/OPenSeadragonCanvasOverlay-0.0.2/openseadragon-canvas-overlay.js'
  // import '../../../../components/Plugins/OpenSeadragonCanvasOverlayHd-master/dist/openseadragon-canvas-overlay-hd.min.js'
  // import '../../../../components/Plugins/openseadragon-filtering.js'
  import OpenSeadragon from 'OpenSeadragon'

  const fs = require('fs')
  const path = require('path')
  const convert = require('xml-js')
  const ipcRenderer = require('electron').ipcRenderer
  const env = {...process.env,ELECTRON_VERSION:process.versions.electron}

  export default {
    name: 'tiling-viewer-page',
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS
      })
    },
    data () {
      return {
        viewer: null,
        canvasOverlay: null,
        filterExp: /^.dzi$/,
        malaImgfilterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        brightnessValue: 0,
        redValue: 0,
        greenValue: 0,
        blueValue: 0,
        selectionMode: false,
        selectedItem: {}
      }
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
        this.viewerRedraw()
      }
    },
    beforeDestroy () {
      this.EventBus.$off('SET_RED_VALUE')
      this.EventBus.$off('SET_GREEN_VALUE')
      this.EventBus.$off('SET_BLUE_VALUE')
      this.EventBus.$off('SET_RBC_BRIGHTNESS')
      this.EventBus.$off('UPDATE_LOWMAGNIFICATION')
      this.EventBus.$off('SET_CROP_MODE')
      this.EventBus.$off('UPDATE_RBC_MARKER')

      // this.viewer.removeAllHandlers('tile-loaded')
    },
    mounted () {
      var self = this

      console.log('mounted')
      this.$nextTick(function () {
        self.brightnessValue = self.settings.rbcBrightnessSlideValue
        self.redValue = self.settings.rbcRedValue
        self.greenValue = self.settings.rbcGreenValue
        self.blueValue = self.settings.rbcBlueValue

        // self.viewerRedraw()

        self.EventBus.$on('SET_RED_VALUE', function (value) {
          self.redValue = value
          if (self.viewer) {
            self.viewer.goToPage(self.viewer.currentPage())
          }
        })

        self.EventBus.$on('SET_GREEN_VALUE', function (value) {
          self.greenValue = value
          if (self.viewer) {
            self.viewer.goToPage(self.viewer.currentPage())
          }
        })

        self.EventBus.$on('SET_BLUE_VALUE', function (value) {
          self.blueValue = value
          if (self.viewer) {
            self.viewer.goToPage(self.viewer.currentPage())
          }
        })

        self.EventBus.$on('SET_RBC_BRIGHTNESS', function(value) {
          self.brightnessValue = value
          if (self.viewer) {
            self.viewer.goToPage(self.viewer.currentPage())
          }
        })

        self.EventBus.$on('UPDATE_LOWMAGNIFICATION', function(value) {
          self.selectedItem = value
          self.viewerRedraw()
        })

        self.EventBus.$on('UPDATE_RBC_MARKER', function(value) {
          if (value) {
            self.viewer.forceRedraw()
          }
        })

        self.EventBus.$on('SET_CROP_MODE', function(value) {
          self.selectionMode = value
          self.viewer.setMouseNavEnabled(!value)

          if (!self.selectionMode) {
            self.viewer.clearOverlays()
          }
        })
      })

    },
    methods: {
      viewerRedraw () {
        console.log('viewerRedraw')
        console.log(fs)
        var self = this

        console.log(this.viewer)
        if (this.viewer !== null) {
          this.viewer.destroy()
          this.viewer = null
        }

        this.$nextTick(function () {
          self.EventBus.$emit('OVERLAY', {state: true})
          self.initViewer()
          self.selectionMode = false
        })
      },
      drawRbcMarker () {
        var self = this

        // rbc position
        var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.ORDER_ID
        var rbcPositionPath = rootPath + '/' + this.settings.rbcClassificationDirNm + '/' + this.selectedItem.ORDER_ID + '.json'
        var positionInfo = []

        var pathArray = this.viewer.tileSources[this.viewer.currentPage()].Image.Url.split('/')
        var fileUrl = pathArray[pathArray.length - 2]

        try {
          this.rbcPosition = JSON.parse(fs.readFileSync(rbcPositionPath, 'utf-8'))
          this.rbcPosition.forEach(function (jsonObj, index) {
            var imgFileName = jsonObj.filename.substring(0, jsonObj.filename.indexOf('.')) + '_files'

            if (fileUrl === imgFileName) {
              jsonObj.rbcClassList.forEach(function (category, categoryIndex) {
                category.classInfo.sort(function(a, b) {
                  return a.classId - b.classId
                })
              })

              jsonObj.rbcClassList.forEach(function (category, categoryIndex) {
                if (category.categoryId === '01') {
                  category.classInfo.forEach(function (cls, index) {
                    self.settings.rbcSize.forEach(function(item, index) {
                      if (cls.classId === item) {
                        positionInfo.push(cls)
                      }
                    })
                  })
                } else if (category.categoryId === '02') {
                  category.classInfo.forEach(function (cls, index) {
                    self.settings.rbcChromia.forEach(function(item, index) {
                      if (cls.classId === item) {
                        positionInfo.push(cls)
                      }
                    })
                  })
                } else if (category.categoryId === '03') {
                  category.classInfo.forEach(function (cls, index) {
                    self.settings.rbcShape.forEach(function(item, index) {
                      if (cls.classId === item) {
                        positionInfo.push(cls)
                      }
                    })
                  })
                } else if (category.categoryId === '04') {
                  category.classInfo.forEach(function (cls, index) {
                    self.settings.rbcPlatelet.forEach(function(item, index) {
                      if (cls.classId === item) {
                        positionInfo.push(cls)
                      }
                    })
                  })
                } else if (category.categoryId === '05') {
                  category.classInfo.forEach(function (cls, index) {
                    self.settings.rbcInclusion.forEach(function(item, index) {
                      if (cls.classId === item) {
                        positionInfo.push(cls)
                      }
                    })
                  })
                }
              })

              // draw canvas overlay
              // self.canvasOverlay.context2d().fillStyle = 'red'
              // positionInfo.forEach(function (item, classIndex) {
              //   self.canvasOverlay.context2d().fillRect(item.posX, item.posY, 5, 5)
              // })

              self.canvasOverlay.context2d().lineWidth = '2'
              self.canvasOverlay.context2d().strokeStyle = 'red'

              positionInfo.forEach(function (item, classIndex) {
                self.canvasOverlay.context2d().strokeRect(item.posX - 20, item.posY - 20, 40, 40)
              })
              // var ctx = canvas.getContext('2d')
              // ctx.fillStyle = 'red'
              // console.log(positionInfo)
              // positionInfo.forEach(function (item, classIndex) {
              //   var px = self.viewer.viewport.pixelFromPoint(
              //     new OpenSeadragon.Point(0, 0),
              //     true
              //   )
              //   console.log(px)
              //   ctx.fillRect(px.x, px.y, 5, 5)
              // })
            }
          })
        } catch (err) {
          console.log(err.message)
          // this.$modal.show(ModalInfo, {code: err.code, message: err.message}, {
          //   height: 'auto',
          //   width: '550px'
          // })
        }
      },
      initViewer () {
        console.log('tiling initViewer')
        var self = this

        try {
          var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.ORDER_ID
          var slotDirList = fs.readdirSync(rootPath)
          var magnificationPath = null

          console.log(rootPath)
          // low magnification
          for (var i = 0; i < slotDirList.length; i++) {
            if (slotDirList[i].includes(this.settings.rbcImageDirName)) {
              magnificationPath = rootPath + '/' + slotDirList[i]
            }
          }

          console.log(magnificationPath)
          var files = fs.readdirSync(magnificationPath).filter(function (file) {
            return self.filterExp.test(path.extname(file).toLowerCase())
          })

          var tileSources = []

          files.forEach(function(dziFile) {
            tileSources.push(self.$tileSourceFromData(magnificationPath + '/' + dziFile))
          })

          console.log(tileSources)
          // var exec = require('child_process').exec, child
          // child = exec('java -jar D:\\UIMD_Data\\UI_DB\\pyramidio-cli-1.1.0.jar -i D:/IA_Proc/20200526164300_2_AAAABBBBCCE/02_RBC_Image/RBC_Image.jpg -o file:///D:/IA_Proc/20200526164300_2_AAAABBBBCCE/02_RBC_Image',
          // function(error, stdout, stderr) {
          //   console.log('stdout: ' + stdout)
          //   console.log('stderr: ' + stderr)
          //   console.log(error)
          // })

          var prefixUrl = 'node_modules/openseadragon/build/openseadragon/images/'
          if (env.NODE_ENV !== 'development') {
            var prefixUrl = env.LOCALAPPDATA + '/Programs/UIMD_PB_IA/resources/app.asar/node_modules/openseadragon/build/openseadragon/images/'
          }

          self.viewer = OpenSeadragon({
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

          var drag = null

          new OpenSeadragon.MouseTracker({
              element: self.viewer.element,
              pressHandler: function(event) {
                if (!self.selectionMode) {
                  return
                }

                var overlayElement = document.createElement('div')
                overlayElement.id = 'rectOverlay'
                overlayElement.style.background = 'rgba(0, 255, 0, 0.3)'
                var viewportPos = self.viewer.viewport.pointFromPixel(event.position)
                self.viewer.addOverlay(overlayElement, new OpenSeadragon.Rect(viewportPos.x, viewportPos.y, 0, 0))

                drag = {
                  overlayElement: overlayElement,
                  startPos: viewportPos
                }
              },
              dragHandler: function(event) {
                if (!drag) {
                  return;
                }

                var viewportPos = self.viewer.viewport.pointFromPixel(event.position);
                var diffX = viewportPos.x - drag.startPos.x;
                var diffY = viewportPos.y - drag.startPos.y;

                var location = new OpenSeadragon.Rect(
                  Math.min(drag.startPos.x, drag.startPos.x + diffX),
                  Math.min(drag.startPos.y, drag.startPos.y + diffY),
                  Math.abs(diffX),
                  Math.abs(diffY)
                )

                console.log(drag)
                console.log(location)
                console.log(self.canvasOverlay)
                console.log(self.viewer)

                self.viewer.updateOverlay(drag.overlayElement, location)
                // var canvas = document.createElement('canvas')

              },
              releaseHandler: function(event) {
                const { canvas } = self.viewer.drawer
                var source = canvas.toDataURL()

                console.log(drag)
                if (drag !== null) {
                  const img = new Image()
                  img.onload = function() {
                    var cropedCanvas = document.createElement('canvas')
                    var ctx = cropedCanvas.getContext('2d')
                    cropedCanvas.width = drag.overlayElement.clientWidth
                    cropedCanvas.height = drag.overlayElement.clientHeight

                    const pixelDens = OpenSeadragon.pixelDensityRatio
                    ctx.drawImage(img, drag.overlayElement.offsetLeft * pixelDens, drag.overlayElement.offsetTop * pixelDens, drag.overlayElement.offsetWidth * pixelDens, drag.overlayElement.offsetHeight * pixelDens, 0, 0, drag.overlayElement.offsetWidth, drag.overlayElement.offsetHeight)
                    var croppedSrc = cropedCanvas.toDataURL()
                    var croppedData = croppedSrc.replace(/^data:image\/\w+;base64,/, '')
                    var buf = Buffer.from(croppedData, 'base64')
                    var malariaPath = self.settings.pbiaRootPath + '/' + self.selectedItem.ORDER_ID + '/' +
                                   self.settings.rbcClassificationDirNm + '/' + self.settings.malariaDirNm
                    var fileName = self.$getUuid() + '.bmp'

                    if (cropedCanvas.width > 0 && cropedCanvas.height > 0) {
                      self.EventBus.$emit('OVERLAY', {state: true})
                      fs.writeFile(malariaPath + '/' + fileName, buf, function(err) {
                        if (err !== null) {
                          self.$toasted.show(err.message, {
                            position: 'bottom-center',
                            duration: '2000'
                          })
                        } else {
                          drag = null
                          var malariaFiles = fs.readdirSync(malariaPath).filter(function (file) {
                            return self.malaImgfilterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                          })
                          self.EventBus.$emit('MALARIA_MOVE_COMPLETE', malariaFiles.length)
                        }

                        self.EventBus.$emit('OVERLAY', {state: false})
                      })
                    }
                  }

                  img.src = source
                }
              }
          })

          self.viewer.addHandler('tile-loaded', function(event) {
            self.EventBus.$emit('OVERLAY', {state: false})
            var canvas = document.createElement('canvas')
            canvas.width = event.image.width
            canvas.height = event.image.height

            // console.log(self.redValue)
            // console.log(self.greenValue)
            // console.log(self.blueValue)
            // console.log(self.brightnessValue)

            var renderedContext = canvas.getContext('2d')
            renderedContext.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + self.redValue + ',' + self.greenValue + ',' + self.blueValue + ')) brightness(' + self.brightnessValue + '%)'
            // renderedContext.globalAlpha = 0.2
            renderedContext.fillRect(0, 0, canvas.width, canvas.height)
            renderedContext.drawImage(event.image, 0, 0)

            event.tile.context2D = renderedContext

          })

          // self.viewer.addHandler('viewport-change', function(event) {
          //   console.log(event)
          //   self.drawRbcMarker(event.eventSource.canvas.firstChild)
          // })
          // var thumbCanvas = document.getElementById('thumbnailCanvas')
          // var ctx = thumbCanvas.getContext('2d')
          //
          // console.log(thumbCanvas)
          // const image = new Image()
          // image.src = self.viewer.canvas.firstChild.toDataURL()
          // image.onload = function() {
          //   console.log('onload------')
          //   ctx.drawImage(image, 0, 0)
          // }

          // ctx.drawImage(self.viewer.canvas.firstChild.toDataURL('image/png'), 0, 0)

          self.canvasOverlay = self.viewer.canvasOverlay({
            onRedraw:function() {
              self.drawRbcMarker()
            },
            clearBeforeRedraw: true
          })

        } catch (err) {
          console.log(err.message)
          // this.$modal.show(ModalInfo, {code: err.code, message: err.message, path: '/homePage/result'}, {
          //   height: 'auto',
          //   width: '550px'
          // })
        }
      }
    }
  }
</script>

<style>
  #tiling-viewer {
    position: relative;
  }
  #thumbnailCanvas {
    position: absolute;
    background-color: red;
    bottom: 0;
  }
</style>
