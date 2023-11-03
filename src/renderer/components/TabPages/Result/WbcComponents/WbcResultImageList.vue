<template>
  <b-container id="wbcResultImageList" fluid @keyup="onKeyUp">
    <b-row>
      <b-col cols="3" class="ml-4">
        <b-form-checkbox v-model="isMarker" switch size="lg" @change="onChangeMarker">
          Cell marking
        </b-form-checkbox>
      </b-col>
      <b-col>
        <b-row>
          <!-- size -->
          <b-col cols="1">
            <img id="popoverSize" class="pointer mt-1 ml-3" src="~@/assets/result/size.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverSize"
              placement="bottom"
              title="Size"
              triggers="hover focus"
            >
              <vue-slider
                class="mt-2 mr-3"
                v-model="sliderValue"
                @drag-start="onSliderDragStart"
                @drag-end="onSliderDragEnd"
                :min="30"
                :width="150"
                :process-style="{ backgroundColor: '#20968E' }" />
            </b-popover>
          </b-col>
          <!-- brightness -->
          <b-col cols="1">
            <img id="popoverBrightness" class="pointer mt-1 ml-3" src="~@/assets/result/brightness.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverBrightness"
              placement="bottom"
              title="Brightness"
              triggers="hover focus"
            >
              <vue-slider
                class="mt-2 mr-3"
                v-model="brightnessValue"
                :min="80"
                :max="150"
                :width="150"
                :process-style="{ backgroundColor: '#20968E' }" />
            </b-popover>
          </b-col>

          <!-- RGB -->
          <b-col cols="1">
            <img id="popoverRGB" class="pointer mt-1 ml-3" src="~@/assets/result/rgb.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverRGB"
              placement="bottom"
              title="RGB"
              triggers="hover focus"
            >
              <vue-slider
                v-if="this.rgbClassSelected !== null"
                class="mt-2 mr-3"
                v-model="redValue"
                :min="0"
                :max="255"
                :width="180"
                :process-style="{ backgroundColor: 'red' }" />
              <vue-slider
                v-else
                disabled
                class="mt-2 mr-3"
                v-model="redValue"
                :min="0"
                :max="255"
                :width="180"
                :process-style="{ backgroundColor: 'red' }" />
              <vue-slider
                v-if="this.rgbClassSelected !== null"
                class="mt-2 mr-3"
                v-model="greenValue"
                :min="0"
                :max="256"
                :width="180"
                :process-style="{ backgroundColor: 'green' }" />
              <vue-slider
                v-else
                disabled
                class="mt-2 mr-3"
                v-model="greenValue"
                :min="0"
                :max="256"
                :width="180"
                :process-style="{ backgroundColor: 'green' }" />
              <vue-slider
                v-if="this.rgbClassSelected !== null"
                class="mt-2 mr-3"
                v-model="blueValue"
                :min="0"
                :max="256"
                :width="180"
                :process-style="{ backgroundColor: 'blue' }" />
              <vue-slider
                v-else
                disabled
                class="mt-2 mr-3"
                v-model="blueValue"
                :min="0"
                :max="256"
                :width="180"
                :process-style="{ backgroundColor: 'blue' }" />

              <b-form-select class="mt-2" v-model="rgbClassSelected">
                <b-form-select-option :value="null">Select a class</b-form-select-option>
                <b-form-select-option v-if="item.count > 0" v-for="item, index in drawClassList" :value="item" :key="index">
                  {{ item.title }}
                </b-form-select-option>
              </b-form-select>
              <b-button class="w-100 mt-2" variant="outline-primary" size="sm" @click="onRgbReset">Reset</b-button>
            </b-popover>
          </b-col>
          <b-col>
            <img class="pointer" src="~@/assets/result/excel.png"
              @click="onExport"
              style="width: 30px;"/>
          </b-col>
        </b-row>
      </b-col>
      <!-- <b-col cols="1">
        <span>
          <img class="pointer mt-1 ml-3" src="~@/assets/result/ic_circle_arrow.png" @click="onClickRollback" style="width: 25px; height: 25px;"/>
        </span>
      </b-col> -->
    </b-row>
    <b-row class="text-center mt-2" style="user-select: none; background-color: #282828; padding-top: 5px;">
      <b-col class="pl-1 pb-2" v-for="item in drawClassList" :key="item.title">
        <div v-if="item.count > 0" v-drag-target
          class="data-draggable-target position-relative pointer"
          :id="item.id + '_' + item.title"
          @click="onClickTab(item)"
          style="width: 50px; heigt: 50px;">
          <img src="~@/assets/result/class-tab-on.png" style="width: 50px; height: 50px;"/>
          <div class="classTab">
            <div style="font-size: 13px; line-height: 12px;">{{ item.title }}</div>
            <div style="font-size: 10px; line-height: 12px; color: #39F6CA;">{{ item.count }}</div>
          </div>
        </div>
        <div v-else v-drag-target
          class="data-draggable-target position-relative"
          :id="item.id + '_' + item.title"
          style="width: 50px; height: 50px;">
          <img src="~@/assets/result/class-tab-off.png" style="width: 50px; height: 50px;"/>
          <div class="classTab">
            <div id="title" style="font-size: 13px; line-height: 12px;">{{ item.title }}</div>
            <div style="font-size: 10px; line-height: 12px;"> - </div>
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="pl-0">
        <b-card id="wbcImageCard" class="blackCard" text-variant="white" no-body>
          <div id="wbcImageCardWrapper">
            <b-row v-if="item.count > 0" :id="item.name" v-for="item in drawClassList" :key="item.name">
              <b-col>
                <div id="imgTitle" class="userSelectNone pl-3" style="width: 250px;">
                  <span id="imgClassName">{{ item.name }} ( {{ item.count }} )</span>
                </div>
                <div v-if="selectedItem.SIGNED_STATE !== 'Signed'" v-drag-target :id="'area_' + item.id + '_' + item.title" class="data-draggable-target text-left mt-2" @wheel.ctrl="zoom">
                  <img @contextmenu.prevent="$refs.ctxMenu.open" class="data-draggable-item" data-draggable="item"
                    :id="'img' + item.title + index"
                    v-for="image, index in item.images"
                    :src="image"
                    :key="index"
                    @dragstart="onDragStart"
                    @dragend="onDragEnd"
                    @dblclick="onDbClickImage(image)"
                    @load="onImgLoad"
                    style="width: 180px;">
                </div>
                <div v-else class="text-left" :id="'area_' + item.id + '_' + item.title" @wheel.ctrl="zoom">
                  <img :id="'img' + item.title + index"
                    v-for="image, index in item.images"
                    :src="image"
                    :key="index"
                    @dragstart="onDragStart"
                    @dragend="onDragEnd"
                    @dblclick="onDbClickImage(image)"
                    @load="onImgLoad"
                    style="width:180px; margin-left: 6px; margin-top: 11px;">
                </div>
              </b-col>
            </b-row>
          </div>

          <context-menu id="context-menu" ref="ctxMenu">
            <li id="menuOptions" @click="onClickClass(item)" v-for="(item, index) in drawClassList" >
              <div class="p-2">
                <div v-if="index < 9"> 0{{ index + 1 }}. {{ item.title }} </div>
                <div v-else> {{ index + 1 }}. {{ item.title }} </div>
              </div>
            </li>
          </context-menu>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import contextMenu from 'vue-context-menu'
  import lodash from 'lodash'
  import ModalViewer from '../../../Common/ModalViewer'
  import XLSX from 'xlsx'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/antd.css'
  import Viewer from 'viewerjs'
  import api from '@/service'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const path = require('path')

  export default {
    name: 'wbc-result-image-list',
    components: { contextMenu, VueSlider },
    computed: {
      ...mapGetters({
        classList: Constant.GET_WBC_CLASS_LIST,
        settings: Constant.GET_SETTINGS,
        // workList: Constant.GET_WORK_LIST,
        commonCode: Constant.GET_COMMON_CODE,
        currentUser: Constant.GET_CURRENT_USER,
        getRgbValue: Constant.GET_RGB_VALUE
      })
    },
    props: ['orderId', 'paramItem'],
    watch: {
      sliderValue: function (newVal, oldVal) {
        var images = document.getElementById('wbcImageCardWrapper').querySelectorAll('img')
        var maxWidth = 360
        var offsetWidth = (maxWidth * (newVal / 100)).toFixed(0)

        for (var i = 0; i < images.length; i++) {
          if (offsetWidth >= 120) {
            images[i].style.width = offsetWidth + 'px'
            this.imgWidth = offsetWidth + 'px'
          } else {
            images[i].style.width = '120px'
            this.imgWidth = '120px'
          }
        }

        console.log(this.isMarker)
        if (this.isMarker) {
          this.drawCellMarker()
        }

        this.$store.dispatch(Constant.SET_SIZE_SLIDE_VALUE, newVal)
      },
      rgbClassSelected: function(newVal, oldVal) {
        var self = this

        if (self.rgbClassSelected !== null) {
          const rgbValue = this.getRgbValue.find(function(item) {
            return item.id === self.rgbClassSelected.id
          })

          console.log(rgbValue)

          if (typeof(rgbValue) !== 'undefined') {
            this.redValue = rgbValue.redValue
            this.greenValue = rgbValue.greenValue
            this.blueValue = rgbValue.blueValue
          } else {
            this.redValue = 0
            this.greenValue = 0
            this.blueValue = 0
          }
        }
      },
      brightnessValue: function(newVal, oldVal) {
        this.$store.dispatch(Constant.SET_BRIGHTNESS_SLIDE_VALUE, newVal)
        this.setRgbColor()
      },
      redValue: function(newVal, oldVal) {
        if (this.rgbClassSelected !== null) {
          // var images = document.getElementById('wbcImageCardWrapper').querySelectorAll('img')
          var images = document.getElementById('area_' + this.rgbClassSelected.id + '_' + this.rgbClassSelected.title).querySelectorAll('img')
          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }

          var rgbItem = {}
          rgbItem.id = this.rgbClassSelected.id
          rgbItem.title = this.rgbClassSelected.title
          rgbItem.redValue = newVal
          rgbItem.greenValue = this.greenValue
          rgbItem.blueValue = this.blueValue
          this.$store.dispatch(Constant.SET_RGB_VALUE, rgbItem)
        }
      },
      greenValue: function(newVal, oldVal) {
        if (this.rgbClassSelected !== null) {
          var images = document.getElementById('area_' + this.rgbClassSelected.id + '_' + this.rgbClassSelected.title).querySelectorAll('img')
          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }

          var rgbItem = {}
          rgbItem.id = this.rgbClassSelected.id
          rgbItem.title = this.rgbClassSelected.title
          rgbItem.redValue = this.redValue
          rgbItem.greenValue = newVal
          rgbItem.blueValue = this.blueValue
          this.$store.dispatch(Constant.SET_RGB_VALUE, rgbItem)
        }
      },
      blueValue: function(newVal, oldVal) {
        if (this.rgbClassSelected !== null) {
          var images = document.getElementById('area_' + this.rgbClassSelected.id + '_' + this.rgbClassSelected.title).querySelectorAll('img')
          for (var i = 0; i < images.length; i++) {
            images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + this.brightnessValue + '%)'
          }

          var rgbItem = {}
          rgbItem.id = this.rgbClassSelected.id
          rgbItem.title = this.rgbClassSelected.title
          rgbItem.redValue = this.redValue
          rgbItem.greenValue = this.greenValue
          rgbItem.blueValue = newVal
          this.$store.dispatch(Constant.SET_RGB_VALUE, rgbItem)
        }
      },
      paramItem: function (newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
        // 커스텀 클래스 최초 로딩시 D/P되지 않는 문제로
        // init 타이밍을 커스텀 클래스 로딩 이후로 변경
        ipcRenderer.send(Constant.SELECT_WBC_CUSTOM_CLASS)

      }
    },
    data () {
      return {
        mousePosition: [],
        drawClassList: [],
        totalCount: 0,
        selectedItem: null,
        signedState: '',
        isSlidShow: true,
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        sliderValue: 50,
        brightnessValue: 100,
        redValue: 0,
        greenValue: 0,
        blueValue: 0,
        imgWidth: 180,
        // 세포 마킹 영역 표시
        isMarker: false,
        markerPosition: null,
        moveCnt: 0,
        // 최초 분석결과 저장
        firstClassList: null,
        wbcCustomClass: [],
        rgbClassSelected: null,
        imgLoadCount: 0,
        wbcHotKey: [],
        // 변경 이력 집계
        modifyClassificationList: null,
        selectDirPath: null
      }
    },
    beforeDestroy () {
      this.$off('APPEND_CHILD')
      this.$off('APPEND_TAB')
      this.EventBus.$off('SIDE_MENU_STATE_CHANGE')
      this.EventBus.$off('ROLLBACK_WBC_IMAGES')
      this.EventBus.$off('CHANGE_MARKER_STATE')
      this.EventBus.$off('EXPORT_CLASSIFICATION')
      this.EventBus.$off('REMOVE_MARKER')
      this.EventBus.$off('WBC_MODIFY_LIST')
      this.EventBus.$off('UPDATE_WBC_IMAGES')

      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_CUSTOM_CLASS)
      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_HOT_KEY)
      ipcRenderer.removeAllListeners(Constant.GET_WBC_MODIFY_LIST)

      // ipcRenderer.removeAllListeners(Constant.GET_WBC_CELL_POSITION)
    },
    mounted () {
      var self = this

      // 이미지 변경 내역 초기화
      this.$store.dispatch(Constant.INIT_WBC_IMAGE_HIST, null)

      // 세포 영역 표시
      this.isMarker = this.settings.isMarker
      this.sliderValue = this.settings.sizeSildeValue
      this.brightnessValue = this.settings.brightnessSlideValue

      // ipcRenderer.send(Constant.GET_WBC_CELL_POSITION, JSON.stringify({slotId: self.$route.params.orderNo, analysisType: '01'}))
      //
      // ipcRenderer.on(Constant.GET_WBC_CELL_POSITION, function (event, result) {
      //   self.markerPosition = result
      //
      //   if (self.settings.isMarker) {
      //     self.drawCellMarker()
      //   }
      // })

      // ipcRenderer.send(Constant.SELECT_WBC_CUSTOM_CLASS)
      ipcRenderer.send(Constant.SELECT_WBC_HOT_KEY, JSON.stringify({keyType: '01'}))

      // custom class
      ipcRenderer.on(Constant.SELECT_WBC_CUSTOM_CLASS, function (event, results) {
        console.log(results)
        self.wbcCustomClass = results
        self.initElement()
      })

      ipcRenderer.on(Constant.SELECT_WBC_HOT_KEY, function (event, results) {
        console.log(results)
        self.wbcHotKey = results
      })

      // WBC 변경 이력 집계
      ipcRenderer.on(Constant.GET_WBC_MODIFY_LIST, function (event, result) {
        self.modifyClassificationList = result
        self.onDownloadData(self.selectDirPath)
        console.log(self.selectDirPath)
        console.log(self.modifyClassificationList)
      })

      this.EventBus.$on('WBC_MODIFY_LIST', function(params) {
        console.log(path)
        self.selectDirPath = params.path
        ipcRenderer.send(Constant.GET_WBC_MODIFY_LIST, JSON.stringify({slotId: self.selectedItem.SLOT_ID}))
      })

      this.EventBus.$on('REMOVE_MARKER', function(state) {
        self.removeMarker()
      })

      this.EventBus.$on('UPDATE_WBC_IMAGES', function(state) {
        self.loadClassificationImages()

        setTimeout(function () {
          if (self.isMarker) {
            self.drawCellMarker()
          }
        }, 100)
      })

      this.$on('APPEND_CHILD', function(fileParams) {
        console.log(fileParams)

        var maxSize = fileParams.data.maxSize
        var url = fileParams.data.image.currentSrc.split('/')
        var fileName = url[url.length - 1]
        var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
        var classDirName = self.settings.wbcClassificationDirNm

        var srcId = fileParams.data.srcId.replace('area_', '')
        var targetId = fileParams.data.targetId.replace('area_', '')

        var srcPath = rootPath + '/' + classDirName + '/' + srcId + '/' + fileName
        var destPath = rootPath + '/' + classDirName + '/' + targetId + '/' + fileName

        // 파일 폴더 이동
        var params = {
          srcPath: srcPath,
          destPath: destPath
        }

        self.EventBus.$emit('OVERLAY', {state: true})
        api.moveFile(params).then(function (res) {
           console.log(res)
           self.moveCnt++

           var targetSectionName = ''

           // change models
           self.drawClassList.forEach(function(item) {
             // delete
             if (srcId.includes(item.id)) {
               item.count--
               item.images.splice(item.images.indexOf('file://' + srcPath), 1)
             }

             // insert
             if (targetId.includes(item.id)) {
               item.count++
               item.images.splice(fileParams.data.index, 0, 'file://' + destPath)
               targetSectionName = item.name
             }
           })

           // WBC 이미지 변경 로그 저장 (rollback)
           var histObj = {}
           histObj.userId = self.currentUser.userId
           histObj.modifyDttm = self.$getDateTime()
           histObj.seqNo = self.$getUuid()
           histObj.srcPath = srcPath
           histObj.destPath = destPath
           histObj.groupId = fileParams.data.groupId

           self.$store.dispatch(Constant.SET_WBC_IMAGE_HIST, histObj)

           // complete move files
           if (self.moveCnt === maxSize) {
             self.$nextTick(function () {
               setTimeout(function() {
                 self.moveCnt = 0

                 // 이미지 조정후 이동시 사이즈 동일하게 조정
                 // 2021_09_02_LBK : brightness 조정
                 var images = document.getElementById(targetSectionName).querySelectorAll('img')

                 self.drawClassList.forEach(function(classItem) {
                   if (classItem.name === targetSectionName) {
                     for (var i = 0; i < images.length; i++) {
                       if (typeof(classItem.imgWidth) !== 'undefined') {
                         images[i].style.width = classItem.imgWidth
                       } else {
                         images[i].style.width = self.imgWidth
                       }
                     }
                   }
                 })

                 // for (var i = 0; i < images.length; i++) {
                 //   images[i].style.width = self.imgWidth
                 //   images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + self.redValue + ',' + this.greenValue + ',' + self.blueValue + ')) brightness(' + self.brightnessValue + '%)'
                 // }

                 // marker
                 if (self.isMarker) {
                   self.drawCellMarker()
                 }

                 // update hist
                 self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(self.drawClassList))
                 self.EventBus.$emit('OVERLAY', {state: false})

                 // drag 활성화
                 self.$initDrag()
                 self.setRgbColor()
               })
             })
           }
         }).catch(function (err) {
           console.log(err.message)

           // draw cell marker
           setTimeout(function() {
             if (self.isMarker) {
               self.drawCellMarker()
               self.moveCnt = 0
             }
             self.EventBus.$emit('OVERLAY', {state: false})
             self.$toasted.show(err.message, {
               position: 'bottom-center',
               duration: '2000'
             })
           }, 0)

         })
      //   var url = params.data.image.currentSrc.split('/')
      //   var targetFileName = url[url.length - 1]
      //
      //   // 파일 폴더 이동
      //   self.EventBus.$emit('OVERLAY', {state: true})
      //   self.moveFile(params, targetFileName, 'APPEND_CHAILD').then(function(ret) {
      //     self.moveCnt++
      //     if (self.moveCnt === params.data.maxSize) {
      //       self.$nextTick(function () {
      //         // draw cell marker
      //         setTimeout(function() {
      //           if (self.isMarker) {
      //             self.drawCellMarker()
      //             self.moveCnt = 0
      //           }
      //           console.log('send UPDATE_HIST_LIST')
      //           self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(ret))
      //           self.moveCnt = 0
      //         }, 0)
      //       })
      //     }
      //   }).catch(function (err) {
      //     console.log(err)
      //     self.$toasted.show(err, {
      //       position: 'bottom-center',
      //       duration: '2000'
      //     })
      //
      //     self.$nextTick(function () {
      //       // draw cell marker
      //       setTimeout(function() {
      //         if (self.isMarker) {
      //           self.drawCellMarker()
      //           self.moveCnt = 0
      //         }
      //       }, 0)
      //     })
      //   }).finally(function () {
      //     self.EventBus.$emit('OVERLAY', {state: false})
      //   })
      })

      this.$on('APPEND_TAB', function(fileParams) {
        var maxSize = fileParams.data.maxSize
        var url = fileParams.data.image.currentSrc.split('/')
        var fileName = url[url.length - 1]
        var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
        var classDirName = self.settings.wbcClassificationDirNm

        var srcId = fileParams.data.srcId.replace('area_', '')
        var targetId = fileParams.data.targetId.replace('area_', '')

        var srcPath = rootPath + '/' + classDirName + '/' + srcId + '/' + fileName
        var destPath = rootPath + '/' + classDirName + '/' + targetId + '/' + fileName

        // 파일 폴더 이동
        var params = {
          srcPath: srcPath,
          destPath: destPath
        }

        self.EventBus.$emit('OVERLAY', {state: true})
        api.moveFile(params).then(function (res) {
           console.log(res)
           self.moveCnt++

           var targetSectionName = ''

           // change models
           self.drawClassList.forEach(function(item) {
             // delete
             if (srcId.includes(item.id)) {
               item.count--
               item.images.splice(item.images.indexOf('file://' + srcPath), 1)
             }

             // insert
             if (targetId.includes(item.id)) {
               item.count++
               item.images.splice(fileParams.data.index, 0, 'file://' + destPath)
               targetSectionName = item.name
             }
           })

           // WBC 이미지 변경 로그 저장 (rollback)
           var histObj = {}
           histObj.userId = self.currentUser.userId
           histObj.modifyDttm = self.$getDateTime()
           histObj.seqNo = self.$getUuid()
           histObj.srcPath = srcPath
           histObj.destPath = destPath
           histObj.groupId = fileParams.data.groupId

           self.$store.dispatch(Constant.SET_WBC_IMAGE_HIST, histObj)

           // complete move files
           if (self.moveCnt === maxSize) {
             self.$nextTick(function () {
               setTimeout(function() {
                 self.moveCnt = 0

                 // 이미지 조정후 이동시 사이즈 동일하게 조정
                 // 2021_09_02_LBK : brightness 조정
                 var images = document.getElementById(targetSectionName).querySelectorAll('img')

                 self.drawClassList.forEach(function(classItem) {
                   if (classItem.name === targetSectionName) {
                     for (var i = 0; i < images.length; i++) {
                       if (typeof(classItem.imgWidth) !== 'undefined') {
                         images[i].style.width = classItem.imgWidth
                       } else {
                         images[i].style.width = self.imgWidth
                       }
                     }
                   }
                 })

                 // for (var i = 0; i < images.length; i++) {
                 //   images[i].style.width = self.imgWidth
                 //   images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + self.redValue + ',' + this.greenValue + ',' + self.blueValue + ')) brightness(' + self.brightnessValue + '%)'
                 // }

                 // marker
                 if (self.isMarker) {
                   self.drawCellMarker()
                 }

                 // update hist
                 self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(self.drawClassList))
                 self.EventBus.$emit('OVERLAY', {state: false})

                 // drag 활성화
                 self.$initDrag()
                 self.setRgbColor()
               })
             })
           }
         }).catch(function (err) {
           console.log(err.message)

           // draw cell marker
           setTimeout(function() {
             if (self.isMarker) {
               self.drawCellMarker()
               self.moveCnt = 0
             }
             self.EventBus.$emit('OVERLAY', {state: false})
             self.$toasted.show(err.message, {
               position: 'bottom-center',
               duration: '2000'
             })
           }, 0)

         })
        // var url = params.data.image.currentSrc.split('/')
        // var targetFileName = url[url.length - 1]
        //
        // // 파일 폴더
        // self.EventBus.$emit('OVERLAY', {state: true})
        // self.moveFile(params, targetFileName, 'APPEND_TAB').then(function(ret) {
        //   self.moveCnt++
        //   if (self.moveCnt === params.data.maxSize) {
        //     self.$nextTick(function () {
        //       // draw cell marker
        //       setTimeout(function() {
        //         if (self.isMarker) {
        //           self.drawCellMarker()
        //           self.moveCnt = 0
        //         }
        //         self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(ret))
        //         self.moveCnt = 0
        //       }, 0)
        //     })
        //   }
        // }).catch(function (err) {
        //   console.log(err)
        //   self.$toasted.show(err, {
        //     position: 'bottom-center',
        //     duration: '2000'
        //   })
        //
        //   self.$nextTick(function () {
        //     // draw cell marker
        //     setTimeout(function() {
        //       if (self.isMarker) {
        //         self.drawCellMarker()
        //         self.moveCnt = 0
        //       }
        //     }, 0)
        //   })
        // }).finally(function () {
        //   self.EventBus.$emit('OVERLAY', {state: false})
        // })
      })

      this.EventBus.$on('ROLLBACK_WBC_IMAGES', function(params) {
        self.loadClassificationImages()
        if (self.isMarker) {
          self.drawCellMarker()
        }
      })

      this.EventBus.$on('SIDE_MENU_STATE_CHANGE', function(state) {
        self.isSlidShow = state
        if (self.isMarker) {
          self.drawCellMarker()
        }

        // classification 숨기기시 스크롤 동작 오류 수정
        window.dispatchEvent(new Event('resize'))
      })

      // 마커 표기 옵션 변경
      this.EventBus.$on('CHANGE_MARKER_STATE', function(params) {
        console.log(params)
        if (params.isShowMarker) {
          self.drawCellMarker()
        } else {
          self.removeMarker()
        }
      })

      this.EventBus.$on('EXPORT_CLASSIFICATION', function(params) {
        console.log(params)
        var classList = self.classList(self.selectedItem.IS_NS_NB_INTEGRATION)

        // custom class append
        self.wbcCustomClass.forEach(function(wbcCustom) {
          if (wbcCustom.CLASS_TITLE !== '') {
            var obj = {
              count: 0,
              id: wbcCustom.CLASS_ID,
              key: '',
              name: wbcCustom.CLASS_NM,
              title: wbcCustom.CLASS_TITLE,
              order: Number(wbcCustom.CLASS_ID)
            }
            classList.push(obj)
          }
        })

        var modifyList = lodash.cloneDeep(classList)
        modifyList.forEach(function(item) {
          item.targets = []
        })

        for (var i = 0; i < classList.length; i++) {
          var parentNode = document.getElementById(classList[i].name)
          if (parentNode) {
            var images = parentNode.querySelectorAll('img')
            for (var j = 0; j < images.length; j++) {
              var divLabel = document.getElementById('testTextArea' + images[j].id)
              if (divLabel) {
                var srcId = classList[i].title
                var destId = divLabel.innerHTML

                for (var k = 0; k < modifyList.length; k++) {
                  if (modifyList[k].title === srcId) {
                    modifyList[k].count--
                    modifyList[k].targets.push({destId: destId})
                  }
                }
              }
            }
          }
        }

        for (var i = 0; i < self.firstClassList.length; i++) {
          for (var j = 0; j < modifyList.length; j++) {
            if (self.firstClassList[i].id === modifyList[j].id) {
              self.firstClassList[i].count = self.drawClassList[i].count + modifyList[j].count
              self.firstClassList[i].targets = modifyList[j].targets
            }
          }
        }

        self.onDownloadXlsx(self.$replaceAll(params.path, '\\', '/'))
      })
    },
    methods: {
      onDownloadData (path) {
        console.log('onDownloadData')
        var self = this
        var xlsxArr = []
        var classList = null

        if (this.selectedItem.ANALYSIS_TYPE === '01') {
          classList = this.classList(this.selectedItem.IS_NS_NB_INTEGRATION)

          // custom class append
          self.wbcCustomClass.forEach(function(wbcCustom) {
            if (wbcCustom.CLASS_TITLE !== '') {
              var obj = {
                count: 0,
                id: wbcCustom.CLASS_ID,
                key: '',
                name: wbcCustom.CLASS_NM,
                title: wbcCustom.CLASS_TITLE,
                order: Number(wbcCustom.CLASS_ID)
              }
              classList.push(obj)
            }
          })
        }

        console.log(classList)
        console.log(this.modifyClassificationList)

        // title line
        var titleArr = []
        titleArr.push(this.selectedItem.BARCODE_NO)

        classList.forEach(function (item, index) {
          titleArr.push(item.id + '_' + item.title)
        })

        titleArr.push('Total count')
        titleArr.push('Inaccuracy')
        titleArr.push('Accuracy')
        titleArr.push('Accuracy %')

        xlsxArr.push(titleArr)

        // data line
        var totalSum = 0
        var inaccuracySum = 0

        titleArr.forEach(function (titleData) {
          var dataArr = []

          classList.forEach(function (wbcClass) {
            if (titleData === (wbcClass.id + '_' + wbcClass.title)) {
              var isPush = false
              var totalCnt = 0
              var inAccuracyCnt = 0

              // left title
              dataArr.push(titleData)

              // 데이터 있는 row
              self.modifyClassificationList.forEach(function (modifyItem) {
                if (titleData === modifyItem.CLASS_ID + '_' + modifyItem.CLASS_TITLE) {
                  isPush = true

                  classList.forEach(function (row) {
                    dataArr.push(modifyItem[row.id])
                    totalCnt += modifyItem[row.id]
                    totalSum += modifyItem[row.id]

                    if (modifyItem.CLASS_ID !== row.id) {
                      inAccuracyCnt += modifyItem[row.id]
                      inaccuracySum += modifyItem[row.id]
                    }
                  })
                }
              })

              if (isPush) {
                dataArr.push(totalCnt)
                dataArr.push(inAccuracyCnt)
                dataArr.push(totalCnt - inAccuracyCnt)
                dataArr.push((((totalCnt - inAccuracyCnt) / totalCnt) * 100).toFixed(2))

                totalCnt = 0
                inAccuracyCnt = 0
              } else {
                // 데이터 없는 row
                for (var i = 0; i < classList.length + 4; i++) {
                  dataArr.push(0)
                }
              }

              // for (var i = 0; i < classList.length + 4; i++) {
              //   dataArr.push(0)
              // }

              xlsxArr.push(dataArr)
            }
          })
        })

        // total line
        var totalArr = []
        totalArr.push('Count')

        classList.forEach(function(classItem) {
          var classCount = 0
          self.modifyClassificationList.forEach(function(modifyItem) {
            classCount += modifyItem[classItem.id]
          })

          totalArr.push(classCount)
        })

        totalArr.push(totalSum)
        totalArr.push(inaccuracySum)
        totalArr.push(totalSum - inaccuracySum)
        totalArr.push((((totalSum - inaccuracySum) / totalSum) * 100).toFixed(2))

        xlsxArr.push(totalArr)

        try {
          var dataWS = XLSX.utils.aoa_to_sheet(xlsxArr)
          // dataWS['C3'].s = {'border': '1px'}
          dataWS['!cols'] = [{wpx: 100}]
          // dataWS.cell(1, 1).string('cell conte').style = {
          //   fill: {
          //     patternType: "solid",
          //     bgColor: { rgb : "C6EFCE" },
          //     fgColor: { rgb : "C6EFCE" }
          //   }
          // }

          // 엑셀의 workbook을 만든다
          var wb = XLSX.utils.book_new()

          // workbook에 워크시트 추가
          XLSX.utils.book_append_sheet(wb, dataWS, '')

          // 엑셀 파일을 내보낸다.
          XLSX.writeFile(wb, path + '/' + self.$getFileNameDateTime() + '_aggr' + '.xlsx')

          this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
            position: 'bottom-center',
            duration: '2000'
          })
        } catch (err) {
          console.log(err)
          this.$toasted.show(err.message, {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      },
      onImgLoad (evt) {
        var self = this
        this.imgLoadCount++

        if (this.totalCount <= this.imgLoadCount) {
          this.imgLoadCount = 0
          if (this.isMarker) {
            this.drawCellMarker()
          }

          this.EventBus.$emit('OVERLAY', {state: false})
        }
      },
      onClickRollback () {
        console.log('onClickRollback')
      },
      onExport () {
        // 변경이력 다운로드
        console.log(this.selectedItem)
        setTimeout(function () {
          ipcRenderer.send('open-file-dialog-for-dir', 'exportWbcResult')
        }, 500)
      },
      onRgbReset () {
        if (this.rgbClassSelected !== null) {

          var rgbItem = {}
          rgbItem.id = this.rgbClassSelected.id
          rgbItem.title = this.rgbClassSelected.title
          rgbItem.redValue = 0
          rgbItem.greenValue = 0
          rgbItem.blueValue = 0

          this.redValue = 0
          this.greenValue = 0
          this.blueValue = 0
          this.rgbClassSelected = null

          this.$store.dispatch(Constant.SET_RGB_VALUE, rgbItem)

        } else {
          this.$toasted.show(Constant.IDS_PLEASE_SELECT_A_CLASS, {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      },
      onSliderDragStart (evt) {
        console.log('onSliderDragStart')

        this.removeMarker()
      },
      onSliderDragEnd (evt) {
        console.log('onSliderDragEnd')
      },
      onKeyUp (evt) {
        console.log(evt)
        console.log(evt.key.toLowerCase())
        var self = this
        var key = evt.key.toLowerCase()
        // var classList = null
        var targetItem = null
        var hotKey = null

        if (key === 'delete') {
          console.log(this.$getSelectrions())
          var items = this.$getSelectrions().items
          items.forEach(function (item, index) {
            console.log(item.currentSrc)
            var path = item.currentSrc.replace('file:///', '')
            console.log(path)

            // 파일 or 폴더 존재 여부 체크
            fs.access(path, function(err) {
              if (!err) {
                // 파일 삭제
                fs.unlinkSync(path)

                // change models
                self.drawClassList.forEach(function(drawItem) {
                  drawItem.images.forEach(function(image) {
                    var imgPath = image.replace('file://', '')

                    if (path === imgPath) {
                      // delete
                      drawItem.count--
                      drawItem.images.splice(drawItem.images.indexOf(image), 1)
                    }
                  })
                })

                self.setImageStyle()
                self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(self.drawClassList))
              }
            })
          })

        } else {
          if (this.selectedItem.ANALYSIS_TYPE === '01') {
            hotKey = this.wbcHotKey
          }

          hotKey.forEach(function (item, index) {
            if (item.HOT_KEY === evt.key.toLowerCase()) {
              self.removeMarker()
              targetItem = item
            }
          })

          console.log(targetItem)
          if (targetItem !== null) {
            for (var len = self.$getSelectrions().items.length, i = 0; i < len; i++) {
              if (self.$getSelectrions().owner !== null) {
                var maxSize = len
                var url = self.$getSelectrions().items[i].currentSrc.split('/')
                var fileName = url[url.length - 1]
                var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
                var classDirName = self.settings.wbcClassificationDirNm

                // 파일 폴더 이동
                self.EventBus.$emit('OVERLAY', {state: true})

                var srcId = (this.$getSelectrions().owner.id).replace('area_', '')
                var targetId = (targetItem.CLASS_ID + '_' + targetItem.CLASS_TITLE).replace('area_', '')
                var srcPath = rootPath + '/' + classDirName + '/' + srcId + '/' + fileName
                var destPath = rootPath + '/' + classDirName + '/' + targetId + '/' + fileName

                // 파일 폴더 이동
                var params = {
                  srcPath: srcPath,
                  destPath: destPath
                }

                api.moveFile(params).then(function(ret) {
                  self.moveCnt++

                  var targetSectionName = ''

                  // change models
                  self.drawClassList.forEach(function(item) {
                    // delete
                    if (srcId.includes(item.id)) {
                      item.count--
                      item.images.splice(item.images.indexOf('file://' + ret.srcPath), 1)
                    }

                    // insert
                    if (targetId.includes(item.id)) {
                      item.count++
                      item.images.splice(0, 0, 'file://' + ret.destPath)
                      targetSectionName = item.name
                    }
                  })

                  // WBC 이미지 변경 로그 저장 (rollback)
                  var histObj = {}
                  histObj.userId = self.currentUser.userId
                  histObj.modifyDttm = self.$getDateTime()
                  histObj.seqNo = self.$getUuid()
                  histObj.srcPath = srcPath
                  histObj.destPath = destPath
                  histObj.groupId = self.$getUuid()

                  self.$store.dispatch(Constant.SET_WBC_IMAGE_HIST, histObj)

                  // complete move files
                  if (self.moveCnt === maxSize) {
                    self.$nextTick(function () {
                      setTimeout(function() {
                        self.moveCnt = 0

                        // 이미지 조정후 이동시 사이즈 동일하게 조정
                        // 2021_09_02_LBK : brightness 조정
                        var images = document.getElementById(targetSectionName).querySelectorAll('img')

                        self.drawClassList.forEach(function(classItem) {
                          if (classItem.name === targetSectionName) {
                            for (var i = 0; i < images.length; i++) {
                              if (typeof(classItem.imgWidth) !== 'undefined') {
                                images[i].style.width = classItem.imgWidth
                              } else {
                                images[i].style.width = self.imgWidth
                              }
                            }
                          }
                        })

                        // marker
                        if (self.isMarker) {
                          self.drawCellMarker()
                        }

                        // update hist
                        self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(self.drawClassList))
                        self.EventBus.$emit('OVERLAY', {state: false})

                        // drag 활성화
                        self.$initDrag()
                        self.setRgbColor()
                      })
                    })
                  }

                }).catch(function (err) {
                  console.log(err)

                  // draw cell marker
                  setTimeout(function() {
                    if (self.isMarker) {
                      self.drawCellMarker()
                      self.moveCnt = 0
                    }
                    self.EventBus.$emit('OVERLAY', {state: false})
                    self.$toasted.show(err.message, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  }, 0)
                })

              } else {
                self.$toasted.show(Constant.IDS_ERROR_SELECT_A_TARGET_ITEM, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              }
            }
          }
        }
      },
      loadMarkerPosition (evt) {
        var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
        var filePath = rootPath + '/' + this.settings.wbcClassificationDirNm + '/' + this.selectedItem.SLOT_ID + '.json'

        try {
          var jsonFile = fs.readFileSync(filePath, 'utf-8')
          return JSON.parse(jsonFile)

        } catch (err) {
          console.log(err.message)
          return null
        }
      },
      onKeyupDelete (evt) {
        console.log('onKeyupDelete')
        // delete key
        if (evt.keyCode === 46) {
          console.log(this.$getSelectrions())
          var items = this.$getSelectrions().items
          items.forEach(function (item, index) {
            var path = item.currentSrc.replace('file:///', '')
            // 파일 or 폴더 존재 여부 체크
            if (fs.existsSync(path)) {
              // 파일 삭제
              fs.unlinkSync(path)
            }
          })

          this.loadClassificationImages()
        }
      },
      onDownloadXlsx (path) {
        console.log('onDownloadXlsx')
        var xlsxArr = [
          [this.selectedItem.BARCODE_NO, 'UNID', 'NE', 'ME', 'MY', 'PR', 'LY', 'LR', 'LA', 'MO', 'EO', 'BA', 'BL', 'PC', 'NR', 'AR', 'Count', 'Incorrect'],
          ['UNID', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0]
        ]

        var incorrectCnt = 0
        var answerList = []

        for (var i = 0; i < xlsxArr[0].length; i++) {
          var row = []
          // row title
          row.push(xlsxArr[0][i])
          // UNID
          row.push('')

          for (var j = 0; j < this.firstClassList.length; j++) {
            if (xlsxArr[0][i] === this.firstClassList[j].title) {
              var rowtotCnt = 0
              var rowExCnt = 0

              var targetsTmp = [
                {title: 'NE', count: 0},
                {title: 'ME', count: 0},
                {title: 'MY', count: 0},
                {title: 'PR', count: 0},
                {title: 'LY', count: 0},
                {title: 'LR', count: 0},
                {title: 'LA', count: 0},
                {title: 'MO', count: 0},
                {title: 'EO', count: 0},
                {title: 'BA', count: 0},
                {title: 'BL', count: 0},
                {title: 'PC', count: 0},
                {title: 'NR', count: 0},
                {title: 'AR', count: 0}
              ]

              // 변경 데이터
              for (var k = 0; k < this.firstClassList[j].targets.length; k++) {
                for (var l = 0; l < targetsTmp.length; l++) {
                  if (this.firstClassList[j].targets[k].destId === targetsTmp[l].title) {
                    targetsTmp[l].count++
                  }
                }
              }
              // 검출 데이터
              for (var l = 0; l < targetsTmp.length; l++) {
                if (targetsTmp[l].title === this.firstClassList[j].title) {
                  targetsTmp[l].count = this.firstClassList[j].count
                  answerList.push(this.firstClassList[j].count)
                }

                if (targetsTmp[l].count > 0) {
                  if (targetsTmp[l].title !== this.firstClassList[j].title) {
                    rowExCnt += targetsTmp[l].count
                  }
                  rowtotCnt += targetsTmp[l].count
                  row.push(targetsTmp[l].count)
                } else {
                  row.push('')
                }
              }

              row.push(rowtotCnt)
              row.push(rowExCnt)

              incorrectCnt += rowExCnt

              xlsxArr.push(row)
            }
          }
        }

        // total row [
        var row = []
        var rowTotCnt = 0

        row.push('Count')
        row.push(0)

        var targetsTmp = [
          {title: 'NE', count: 0},
          {title: 'ME', count: 0},
          {title: 'MY', count: 0},
          {title: 'PR', count: 0},
          {title: 'LY', count: 0},
          {title: 'LR', count: 0},
          {title: 'LA', count: 0},
          {title: 'MO', count: 0},
          {title: 'EO', count: 0},
          {title: 'BA', count: 0},
          {title: 'BL', count: 0},
          {title: 'PC', count: 0},
          {title: 'NR', count: 0},
          {title: 'AR', count: 0}
        ]

        xlsxArr.forEach(function (rows, index) {
          if (index > 1) {
            targetsTmp.forEach(function (target, targetIndex) {
              target.count += Number(rows[targetIndex + 2])
            })
          }
        })

        targetsTmp.forEach(function(item) {
          row.push(item.count)
          rowTotCnt += item.count
        })

        row.push(rowTotCnt)
        row.push(incorrectCnt)
        xlsxArr.push(row)
        // total row ]

        var answerCnt = 0
        answerList.forEach(function(item) {
          answerCnt += item
        })
        var percent = Number(((answerCnt / rowTotCnt) * 100).toFixed(2))
        row = []
        row.push('Result')
        row.push(percent)
        xlsxArr.push(row)

        try {
          var dataWS = XLSX.utils.aoa_to_sheet(xlsxArr)
          // dataWS['C3'].s = {'border': '1px'}
          dataWS['!cols'] = [{wpx: 100}]
          console.log(dataWS['C3'])
          // 엑셀의 workbook을 만든다
          var wb = XLSX.utils.book_new()

          // workbook에 워크시트 추가
          XLSX.utils.book_append_sheet(wb, dataWS, '')

          // 엑셀 파일을 내보낸다.
          XLSX.writeFile(wb, path + '/' + this.selectedItem.SLOT_ID + '.xlsx')

          this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
            position: 'bottom-center',
            duration: '2000'
          })
        } catch (err) {
          console.log(err)
          this.$toasted.show(err.message, {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      },
      onDragStart (evt) {
        console.log('drag start')
        this.removeMarker()
      },
      onDragEnd (evt) {
        console.log('drag end')
        if (this.isMarker) {
          this.drawCellMarker()
        }
      },
      initElement () {
        var self = this

        this.firstClassList = this.loadClassificationImages()
        this.markerPosition = this.loadMarkerPosition()

        // 스크롤 위치 초기화
        document.getElementById('wbcImageCardWrapper').scrollTo(0, 0)

        // rgb select 초기화
        this.rgbClassSelected = null
        this.redValue = 0
        this.greenValue = 0
        this.blueValue = 0

        // this.EventBus.$emit('OVERLAY', {state: true})
        // if (this.isMarker && this.markerPosition !== null) {
        //   setTimeout(function() {
        //     self.drawCellMarker()
        //   }, 500)
        // }
      },
      onDbClickImage (src) {
        console.log(src)
        // this.$modal.show(ModalViewer, {item: src}, {
        //   width: '250',
        //   height: 'auto',
        //   styles: 'background-color: rgba(255, 255, 255, 0.95)'
        // })

        var divNode = document.createElement('div')

        this.$getSelectrions().items.forEach(function (item) {
          var clone = item.cloneNode(false)
          divNode.appendChild(clone)
        })

        const viewer = new Viewer(divNode, {maxZoomRatio: 2})
        viewer.show()

        viewer.options.hide = function(e) {
          this.viewer.destroy()
          divNode = null
        }
      },
      // 스타고 검증으로 텍스트 박스 표기 (임시)
      modifyClassLabel (item) {
        var self = this

        // 기존 marker 삭제
        self.removeMarker()
        for (var len = this.$getSelectrions().items.length, i = 0; i < len; i++) {
          var divNode = document.createElement('div')
          divNode.id = 'testTextArea' + this.$getSelectrions().items[i].id
          divNode.className = 'testTextArea' + this.$getSelectrions().items[i].id
          divNode.style.width = '50px'
          divNode.style.height = '20px'
          divNode.style.border = '1px solid white'
          divNode.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'
          divNode.style.fontSize = '14px'
          divNode.style.fontWeight = '700'
          divNode.style.position = 'absolute'
          divNode.style.color = 'green'
          divNode.style.textAlign = 'center'
          divNode.style.left = this.$getSelectrions().items[i].offsetLeft + 'px'
          divNode.style.top = this.$getSelectrions().items[i].offsetTop + 'px'
          divNode.innerHTML = item.title

          var node = this.$getSelectrions().items[i].parentNode.getElementsByClassName('testTextArea' + this.$getSelectrions().items[i].id)
          var srcId = this.$getSelectrions().items[i].parentNode.id
          var destId = item.id + '_' + item.title

          if (node.length > 0) {
            this.$getSelectrions().items[i].parentNode.removeChild(node[0])
          }

          if (srcId === destId) {
            continue
          } else {
            this.$getSelectrions().items[i].parentNode.appendChild(divNode)
          }
        }
      },
      onClickClassTest (item) {
        this.modifyClassLabel(item)
      },
      onClickClass (item) {
        var self = this

        // 기존 marker 삭제
        self.removeMarker()

        for (var len = this.$getSelectrions().items.length, i = 0; i < len; i++) {
          if (this.$getSelectrions().owner !== null) {
            // var url = this.$getSelectrions().items[i].currentSrc.split('/')
            // var targetFileName = url[url.length - 1]
            // var params = {}
            // params.data = {}
            // params.data.image = this.$getSelectrions().items[i],
            // params.data.srcId = this.$getSelectrions().owner.id,
            // params.data.targetId = item.id + '_' + item.title,
            // params.data.index = 0
            //
            // // 파일 폴더 이동
            // api.moveFile(params, targetFileName, 'APPEND_TAB').then(function(ret) {
            //   self.$nextTick(function () {
            //     self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(ret))
            //   })
            // }).catch(function (err) {
            //   console.log(err)
            //   self.$toasted.show(err, {
            //     position: 'bottom-center',
            //     duration: '2000'
            //   })
            // }).finally(function () {
            //   self.EventBus.$emit('OVERLAY', {state: false})
            // })

            var maxSize = len
            var url = this.$getSelectrions().items[i].currentSrc.split('/')
            var fileName = url[url.length - 1]
            var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
            var classDirName = self.settings.wbcClassificationDirNm

            // 파일 폴더 이동
            self.EventBus.$emit('OVERLAY', {state: true})

            var srcId = (this.$getSelectrions().owner.id).replace('area_', '')
            var targetId = (item.id + '_' + item.title).replace('area_', '')
            var srcPath = rootPath + '/' + classDirName + '/' + srcId + '/' + fileName
            var destPath = rootPath + '/' + classDirName + '/' + targetId + '/' + fileName

            var params = {
              srcPath: srcPath,
              destPath: destPath
            }

            console.log(params)

            api.moveFile(params).then(function(ret) {
              self.moveCnt++

              var targetSectionName = ''

              // change models
              self.drawClassList.forEach(function(item) {
                // delete
                if (srcId.includes(item.id)) {
                  item.count--
                  item.images.splice(item.images.indexOf('file://' + ret.srcPath), 1)

                  console.log(ret.srcPath)
                }

                // insert
                if (targetId.includes(item.id)) {
                  item.count++
                  item.images.splice(0, 0, 'file://' + ret.destPath)
                  targetSectionName = item.name

                  console.log(ret.destPath)
                }
              })

              // WBC 이미지 변경 로그 저장 (rollback)
              var histObj = {}
              histObj.userId = self.currentUser.userId
              histObj.modifyDttm = self.$getDateTime()
              histObj.seqNo = self.$getUuid()
              histObj.srcPath = srcPath
              histObj.destPath = destPath
              histObj.groupId = self.$getUuid()

              self.$store.dispatch(Constant.SET_WBC_IMAGE_HIST, histObj)

              // complete move files
              if (self.moveCnt === maxSize) {
                self.$nextTick(function () {
                  setTimeout(function() {
                    self.moveCnt = 0

                    // 이미지 조정후 이동시 사이즈 동일하게 조정
                    // 2021_09_02_LBK : brightness 조정
                    var images = document.getElementById(targetSectionName).querySelectorAll('img')

                    self.drawClassList.forEach(function(classItem) {
                      if (classItem.name === targetSectionName) {
                        for (var i = 0; i < images.length; i++) {
                          if (typeof(classItem.imgWidth) !== 'undefined') {
                            images[i].style.width = classItem.imgWidth
                          } else {
                            images[i].style.width = self.imgWidth
                          }
                        }
                      }
                    })

                    // for (var i = 0; i < images.length; i++) {
                    //   images[i].style.width = self.imgWidth
                    //   images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + self.redValue + ',' + this.greenValue + ',' + self.blueValue + ')) brightness(' + self.brightnessValue + '%)'
                    // }

                    // marker
                    if (self.isMarker) {
                      self.drawCellMarker()
                    }

                    // update hist
                    self.EventBus.$emit('UPDATE_HIST_LIST', lodash.cloneDeep(self.drawClassList))
                    self.EventBus.$emit('OVERLAY', {state: false})

                    // drag 활성화
                    self.$initDrag()
                    self.setRgbColor()
                  })
                })
              }

            }).catch(function (err) {
              console.log(err)

              // draw cell marker
              setTimeout(function() {
                if (self.isMarker) {
                  self.drawCellMarker()
                  self.moveCnt = 0
                }
                self.EventBus.$emit('OVERLAY', {state: false})
                self.$toasted.show(err.message, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              }, 0)
            })
          }
        }
      },
      setImageStyle () {
        // this.$nextTick(function () {
        //   if (this.selectedItem.SIGNED_STATE === this.commonCode(Constant.GET_CODE_SIGNED_STATE, '01').cdNm) {
        //     for (var i = 0; i < this.drawClassList.length; i++) {
        //       if (document.getElementById(this.drawClassList[i].title) !== null) {
        //         var childNodes = document.getElementById(this.drawClassList[i].title).childNodes
        //
        //         for (var j = 0; j < childNodes.length; j++) {
        //           childNodes[j].removeAttribute('class')
        //           childNodes[j].removeAttribute('draggable')
        //           childNodes[j].removeAttribute('tabindex')
        //         }
        //       }
        //     }
        //   }
        // })
        this.$nextTick(function () {
          // size
          var images = document.getElementById('wbcImageCardWrapper').querySelectorAll('img')
          var maxWidth = 360
          var offsetWidth = (maxWidth * (this.sliderValue / 100)).toFixed(0)

          for (var i = 0; i < images.length; i++) {
            if (offsetWidth >= 120) {
              images[i].style.width = offsetWidth + 'px'
              this.imgWidth = offsetWidth + 'px'
            } else {
              images[i].style.width = '120px'
              this.imgWidth = '120px'
            }
          }

          this.setRgbColor()

        })
      },
      setRgbColor () {
        var self = this

        console.log(this.getRgbValue)
        console.log(this.drawClassList)

        var classTemp = this.drawClassList.filter(function(item) {
          return item.count > 0
        })

        console.log(classTemp)

        var setRgbIds = []

        // rgb
        classTemp.forEach(function(drawClass) {
          self.getRgbValue.forEach(function(rgbClass) {
            if (drawClass.id === rgbClass.id) {
              setRgbIds.push(rgbClass.id)
              var element = document.getElementById('area_' + rgbClass.id + '_' + rgbClass.title)
              if (element !== null) {
                var images = element.querySelectorAll('img')
                for (var i = 0; i < images.length; i++) {
                  images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + rgbClass.redValue + ',' + rgbClass.greenValue + ',' + rgbClass.blueValue + ')) brightness(' + self.brightnessValue + '%)'
                }
              }
            } else {
              if (setRgbIds.indexOf(drawClass.id) < 0) {
                var element = document.getElementById('area_' + drawClass.id + '_' + drawClass.title)
                if (element !== null) {
                  var images = element.querySelectorAll('img')
                  for (var i = 0; i < images.length; i++) {
                    images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(0, 0, 0)) brightness(' + self.brightnessValue + '%)'
                  }
                }
              }
            }
          })
        })

        this.getRgbValue.forEach(function(item) {
          var element = document.getElementById('area_' + item.id + '_' + item.title)
          if (element !== null) {
            var images = element.querySelectorAll('img')
            for (var i = 0; i < images.length; i++) {
              images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + item.redValue + ',' + item.greenValue + ',' + item.blueValue + ')) brightness(' + self.brightnessValue + '%)'
            }
          }
        })
      },
      loadClassificationImages () {
        var self = this
        var classList = []
        var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
        var classDir = rootPath + '/' + this.settings.wbcClassificationDirNm

        this.drawClassList = []
        this.totalCount = 0

        classList = this.classList(this.selectedItem.IS_NS_NB_INTEGRATION)

        // custom class append
        self.wbcCustomClass.forEach(function(wbcCustom) {
          if (wbcCustom.CLASS_TITLE !== '') {
            var obj = {
              count: 0,
              id: wbcCustom.CLASS_ID,
              key: '',
              name: wbcCustom.CLASS_NM,
              title: wbcCustom.CLASS_TITLE,
              order: Number(wbcCustom.CLASS_ID)
            }
            classList.push(obj)
          }
        })

        // wbc file load
        var params = {
          classList: classList,
          classDir: classDir,
          selectItem: this.selectedItem
        }

        console.log(params)

        api.getWbcFiles(params)
        .then(function (res) {
          console.log(res)

          self.drawClassList = res.classificationResult
          self.totalCount = res.imgCount

          self.drawClassList.sort(function(a, b) {
            return a.order - b.order
          })

          self.$initDrag()
          self.setImageStyle()

        }).catch(function (err) {
          console.log(err.message)
        })

        // for (var i = 0; i < classList.length; i++) {
        //   try {
        //     var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
        //     var slotDirList = fs.readdirSync(rootPath)
        //     var filePath = null
        //     var files = null
        //
        //     for (var j = 0; j < slotDirList.length; j++) {
        //       if (slotDirList[j].includes(this.settings.wbcClassificationDirNm)) {
        //         filePath = rootPath + '/' + slotDirList[j] + '/' + classList[i].id + '_' + classList[i].title
        //         // load files
        //         files = fs.readdirSync(filePath).filter(function (file) {
        //           return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
        //         })
        //
        //         // change file path
        //         for (var k = 0; k < files.length; k++) {
        //           files[k] = 'file://' + filePath + '/' + files[k]
        //         }
        //
        //         var obj = {
        //           title: classList[i].title,
        //           images: files,
        //           count: files.length,
        //           id: classList[i].id,
        //           name: classList[i].name
        //         }
        //
        //         this.totalCount += files.length
        //         this.drawClassList.push(obj)
        //       }
        //     }
        //
        //   } catch (err) {
        //     if (err.code === 'ENOENT') {
        //       var obj = {
        //         title: classList[i].title,
        //         images: [],
        //         count: 0,
        //         id: classList[i].id,
        //         name: classList[i].name
        //       }
        //
        //       this.drawClassList.push(obj)
        //     }
        //   }
        // }
        //
        // console.log(this.drawClassList)
        // this.$initDrag()
        // this.setImageStyle()
        //
        // return lodash.cloneDeep(this.drawClassList)
      },
      drawCellMarker () {
        var classList = []
        var self = this

        if (this.selectedItem !== null) {
          this.removeMarker()

          classList = this.classList(this.selectedItem.IS_NS_NB_INTEGRATION)
          // custom class append
          self.wbcCustomClass.forEach(function(wbcCustom) {
            if (wbcCustom.CLASS_TITLE !== '') {
              var obj = {
                count: 0,
                id: wbcCustom.CLASS_ID,
                key: '',
                name: wbcCustom.CLASS_NM,
                title: wbcCustom.CLASS_TITLE,
                order: Number(wbcCustom.CLASS_ID)
              }
              classList.push(obj)
            }
          })

          for (var i = 0; i < classList.length; i++) {
            var parentNode = document.getElementById(classList[i].name)
            if (parentNode !== null) {
              var images = parentNode.querySelectorAll('img')

              for (var j = 0; j < images.length; j++) {
                var divNode = document.createElement('div')
                divNode.className = 'cellMarker'
                divNode.id = 'div' + images[j].id
                divNode.style.width = '5px'
                divNode.style.height = '5px'
                divNode.style.border = '2px solid #00FF00'
                divNode.style.position = 'absolute'
                divNode.style.left = images[j].offsetLeft + 'px'
                divNode.style.top = images[j].offsetTop + 'px'

                var url = images[j].currentSrc.split('/')
                var srcFileName = url[url.length - 1]

                if (self.markerPosition !== null) {
                  var position = self.markerPosition[srcFileName]

                  if (typeof(position) !== 'undefined') {
                    if (position.POSX1 !== 0 && position.POSX2 !== 0) {
                      var widthRatio = (bmCellImage.offsetWidth / Number(position.ORG_WIDTH) * 100).toFixed(0)
                      var heightRatio = (bmCellImage.offsetHeight / Number(position.ORG_HEIGHT) * 100).toFixed(0)

                      var rectWidth = (Number(position.POSX2) - Number(position.POSX1)) * (widthRatio / 100)
                      var rectHeight = (Number(position.POSY2) - Number(position.POSY1)) * (heightRatio / 100)

                      divNode.style.left = bmCellImage.offsetLeft + (Number(position.POSX1) * (widthRatio / 100)) + (rectWidth / 2) + 'px'
                      divNode.style.top = bmCellImage.offsetTop + (Number(position.POSY1) * (heightRatio / 100)) + (rectWidth / 2) + 'px'

                      bmCellImage.parentNode.appendChild(divNode)
                    }
                  }

                  // this.markerPosition.forEach(function (position) {
                  //   if (position.FILE_NM === srcFileName) {
                  //     if (position.POSX1 !== 0 && position.POSX2 !== 0) {
                  //       var widthRatio = (images[j].offsetWidth / Number(position.ORG_WIDTH) * 100).toFixed(0)
                  //       var heightRatio = (images[j].offsetHeight / Number(position.ORG_HEIGHT) * 100).toFixed(0)
                  //
                  //       var rectWidth = (Number(position.POSX2) - Number(position.POSX1)) * (widthRatio / 100)
                  //       var rectHeight = (Number(position.POSY2) - Number(position.POSY1)) * (heightRatio / 100)
                  //
                  //       divNode.style.left = images[j].offsetLeft + (Number(position.POSX1) * (widthRatio / 100)) + (rectWidth / 2) + 'px'
                  //       divNode.style.top = images[j].offsetTop + (Number(position.POSY1) * (heightRatio / 100)) + (rectWidth / 2) + 'px'
                  //
                  //       images[j].parentNode.appendChild(divNode)
                  //
                  //     } else {
                  //       divNode.style.display = 'none'
                  //     }
                  //   }
                  // })
                }
              }
            }
          }
        }
      },
      removeMarker () {
        console.log(this.selectedItem)

        if (this.selectedItem !== null) {
          var classList = this.classList(this.selectedItem.IS_NS_NB_INTEGRATION)
          var self = this

          // custom class append
          self.wbcCustomClass.forEach(function(wbcCustom) {
            if (wbcCustom.CLASS_TITLE !== '') {
              var obj = {
                count: 0,
                id: wbcCustom.CLASS_ID,
                key: '',
                name: wbcCustom.CLASS_NM,
                title: wbcCustom.CLASS_TITLE,
                order: Number(wbcCustom.CLASS_ID)
              }
              classList.push(obj)
            }
          })

          for (var i = 0; i < classList.length; i++) {
            var parentNode = document.getElementById(classList[i].name)
            if (parentNode !== null) {
              var markers = parentNode.getElementsByClassName('cellMarker')
              while(markers.length > 0) {
                markers[0].parentNode.removeChild(markers[0])
              }
            }
          }
        }
      },
      zoom (evt) {
        var targetElement = null

        if (evt.target.querySelectorAll('img').length <= 0) {
          targetElement = evt.target.parentElement
        } else {
          targetElement = evt.target
        }

        var targetDirName = targetElement.id.replace('area_', '')
        var images = targetElement.querySelectorAll('img')

        if (evt.deltaY < 0) {
          var width = (images[0].offsetWidth + 1) + 'px'

          this.drawClassList.forEach(function(classItem) {
            if (classItem.dirName === targetDirName) {
              classItem.imgWidth = width
            }
          })

          if ((images[0].offsetWidth + 1) <= 360) {
            for (var i = 0; i < images.length; i++) {
              images[i].style.width = width
            }
          }
        } else {
          var width = (images[0].offsetWidth - 1) + 'px'

          this.drawClassList.forEach(function(classItem) {
            if (classItem.dirName === targetDirName) {
              classItem.imgWidth = width
            }
          })

          if ((images[0].offsetWidth - 1) >= 120) {
            for (var i = 0; i < images.length; i++) {
              images[i].style.width = width
            }
          }
        }

        if (this.isMarker) {
          this.drawCellMarker()
        }
      },
      // change scroll position
      onClickTab (item) {
        document.getElementById('wbcImageCardWrapper').scrollTop = document.getElementById(item.name).offsetTop - 60
      },
      onChangeMarker (value) {
        this.$store.dispatch(Constant.UPDATE_MARKER_STATE, value)
        if (value) {
          this.drawCellMarker()
        } else {
          this.removeMarker()
        }
      }
      // moveFile (params, targetFileName, evt) {
      //   return new Promise((succ, fail) => {
      //     var self = this
      //     var url = params.data.image.currentSrc.split('/')
      //     var srcFileName = url[url.length - 1]
      //     var srcId = params.data.srcId.replace('area_', '')
      //     var targetId = params.data.targetId.replace('area_', '')
      //
      //     // 대상 폴더에 동일 파일명 체크
      //     var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
      //     var targetPath = rootPath + '/' + self.settings.wbcClassificationDirNm + '/' + targetId
      //
      //     fs.access(targetPath + '/' + targetFileName, fs.F_OK, (err) => {
      //       if (err) {
      //         if (err.code === 'ENOENT') {
      //           var srcPath = rootPath + '/' + self.settings.wbcClassificationDirNm + '/' + srcId + '/' + srcFileName
      //           var destPath = rootPath + '/' + self.settings.wbcClassificationDirNm + '/' + targetId + '/' + targetFileName
      //
      //           // 현재 탭으로 이동 제외 (파일명에 _ 계속 추가 되는 문제 생김)
      //           if (srcId === targetId) {
      //             fail('current tab')
      //           }
      //
      //           // move
      //           fs.stat(targetPath, (err) => {
      //             if (!err) {
      //               fs.rename(srcPath, destPath, (err) => {
      //                 if (!err) {
      //                   var targetSectionName = ''
      //
      //                   // change models
      //                   for (var i = 0; i < self.drawClassList.length; i++) {
      //                     // delete
      //                     if (srcId.includes(self.drawClassList[i].id)) {
      //                       self.drawClassList[i].count--
      //                       self.drawClassList[i].images.splice(self.drawClassList[i].images.indexOf('file://' + srcPath), 1)
      //                     }
      //                     // insert
      //                     if (targetId.includes(self.drawClassList[i].id)) {
      //                       self.drawClassList[i].count++
      //                       self.drawClassList[i].images.splice(params.data.index, 0, 'file://' + destPath)
      //                       targetSectionName = self.drawClassList[i].name
      //                     }
      //                   }
      //
      //                   // 로그 저장
      //                   var logObj = {}
      //                   logObj.userId = self.currentUser.userId
      //                   logObj.eventTypeCd = Constant.EVENT_TYPE_USER
      //                   logObj.logDttm = self.$getDateTimeStr()
      //                   logObj.logMessage = '[' + Constant.EVENT_TYPE_USER + ']' +
      //                                       '[' + srcPath + ']->' + '[' + destPath + ']'
      //                   self.$store.dispatch(Constant.SET_EVENT_LOG, logObj)
      //
      //                   // WBC 이미지 변경 로그 저장
      //                   var histObj = {}
      //                   histObj.userId = self.currentUser.userId
      //                   histObj.modifyDttm = self.$getDateTime()
      //                   histObj.seqNo = self.$getUuid()
      //                   histObj.srcPath = srcPath
      //                   histObj.destPath = destPath
      //                   histObj.groupId = params.data.groupId
      //
      //                   self.$store.dispatch(Constant.SET_WBC_IMAGE_HIST, histObj)
      //
      //                   // 이미지 조정후 이동시 사이즈 동일하게 조정
      //                   // 2021_09_02_LBK : brightness 조정
      //                   self.$nextTick(function () {
      //                     var images = document.getElementById(targetSectionName).querySelectorAll('img')
      //
      //                     for (var i = 0; i < images.length; i++) {
      //                       images[i].style.width = self.imgWidth
      //                       images[i].style.filter = 'opacity(0.85) drop-shadow(0 0 0 rgb(' + this.redValue + ',' + this.greenValue + ',' + this.blueValue + ')) brightness(' + self.brightnessValue + '%)'
      //                     }
      //
      //                     self.$initDrag()
      //                     succ(self.drawClassList)
      //                   })
      //
      //                 } else {
      //                   self.$toasted.show(Constant.IDS_ERROR_FILE_CLISSIFICATION, {
      //                     position: 'bottom-center',
      //                     duration: '2000'
      //                   })
      //
      //                   fail(err.message)
      //                 }
      //               })
      //             } else {
      //               // self.$toasted.show(Constant.IDS_ERROR_FILE_CLISSIFICATION, {
      //               //   position: 'bottom-center',
      //               //   duration: '2000'
      //               // })
      //
      //               fail(err.message)
      //             }
      //             // else if (err.code === 'ENOENT') {
      //             //   // 디렉토리 없으면 생성
      //             //   fs.mkdirSync(targetPath)
      //             //   self.moveFile(params, targetFileName, evt)
      //             // }
      //           })
      //         }
      //       } else {
      //         fail('')
      //         // 동일 파일명 존재하면 _추가
      //         // targetFileName = '_' + targetFileName
      //         // self.moveFile(params, targetFileName, evt).then(function(ret) {
      //         //   succ(ret)
      //         // }).catch(function (err) {
      //         //   fail(err.message)
      //         // })
      //       }
      //     })
      //   })
      // }
    }
  }
</script>

<style>
  .tabBorderOn {
    border-bottom: 2px solid;
    border-color: #2A9284;
    text-align: center;
    width: 100%;
  }
  .tabBorderOff {
    border-bottom: 2px solid;
    border-color: gray;
    text-align: center;
  }
  #cls {
    color: white;
  }
  #tabCount {
    color: #2A9284;
    font-weight: bold;
    position: absolute;
    top: 0;
    right: 15px;
    font-size: 12px;
  }
  #imgClassName {
    font-size: 13px;
    margin-left: 5px;
    /* position: absolute; */
    top: 7px;
  }
  #imgTitle {
    border-bottom: 2px solid #09CBFC;
  }
  #menuOptions:hover {
    background-color: #3F628C;
    color: white;
  }
  #wbcImageCard {
    background-color: #282828 !important;
    padding: 3px 10px 20px 10px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px black;
    border: 1px solid #303744;
    height: 808px;
    /* height: 812px; */
    /* overflow-y: scroll; */
    /* overflow-x: hidden; */
  }
  #wbcImageCardWrapper {
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
