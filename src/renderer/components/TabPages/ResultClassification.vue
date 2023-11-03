<template>
  <b-container id="resultClassification" class="pl-1 pt-0 pb-2" fluid>
    <b-row>
      <b-col class="p-0 pt-1 pb-1 pl-4">
        <div>
          <b-row>
            <b-col cols="1" class="pr-0">
              <img id="slideInfo" class="pointer" src="~@/assets/icon/slide_Information.png" style="width: 35px;"/>
              <b-popover
                target="slideInfo"
                placement="bottom"
                triggers="hover focus"
              >
                <img :src="barcodePath" style="width: 250px;" />
                <div class="mt-2">
                  <input type="hidden" id="barcodeNo" :value="selectedItemSlot.BARCODE_NO">
                  <b-button variant="outline-primary" size="sm" @click="onBarcodeCopy">{{ selectedItemSlot.BARCODE_NO }}</b-button>
                  <span class="float-right pt-1" style="font-size: 12px;">{{ $stringToDateTime(selectedItemSlot.ANALYZE_DTTM) }}</span>
                </div>
              </b-popover>
            </b-col>
            <b-col cols="1" class="pl-0 pr-1">
              <div class="cbcLabel text-center">
                {{ testTypeNm }}
              </div>
            </b-col>
            <b-col cols="1" class="pl-0 pr-1">
              <div class="cbcLabel text-center">
                {{ selectedItemSlot.BARCODE_NO }}
              </div>
            </b-col>
            <b-col cols="1" class="pl-0 pr-1">
              <div v-if="selectedItemSlot.PATIENT_ID !== ''" class="cbcLabel text-center">
                {{ selectedItemSlot.PATIENT_ID }}
              </div>
              <div v-else class="cbcLabel text-center">
                -
              </div>
            </b-col>
            <b-col cols="1" class="pl-0 pr-1">
              <div v-if="selectedItemSlot.PATIENT_NM !== ''" class="cbcLabel text-center">
                {{ selectedItemSlot.PATIENT_NM }}
              </div>
              <div v-else class="cbcLabel text-center">
                -
              </div>
            </b-col>
            <b-col cols="1" class="pl-0 pr-1">
              <div class="cbcLabel text-center">
                {{ $stringToDateTime(selectedItemSlot.ANALYZE_DTTM) }}
              </div>
            </b-col>
          </b-row>
        </div>

        <div style="width: 40px; float: left;">
          <div v-for="menu in menus" class="mt-2" v-bind:key="menu.id" @click="onClickMenu(menu)" style="font-size: 17px;">
            <b-row class="pointer mt-3">
              <b-col cols="2">
                <img v-if="menu.isSelect === true" :src="menu.iconOn" style="width: 35px;"/>
                <img v-else :src="menu.iconOff" style="width: 35px;"/>
                <div class="text-center mt-1" style="width: 35px; font-size: 8px;">{{ menu.name }}</div>
              </b-col>
            </b-row>
          </div>

          <img v-if="isCbcShow" class="pointer mt-5" src="~@/assets/icon/LIS_ON.png" @click="onClickCbc" style="width: 35px;"/>
          <img v-else="isCbcShow" class="pointer mt-5" src="~@/assets/icon/LIS_OFF.png" @click="onClickCbc" style="width: 35px;"/>
          <div class="text-center mt-1" style="width: 35px; font-size: 8px;">LIS-CBC</div>
        </div>

        <div v-if="isCbcShow" id="divCbcdiff" class="mt-0 p-1" style="width: 350px; float: left;">
          <b-card id="cbcDiffCard" class="cbcCard h-100" text-variant="white" no-body style="overflow-y: scroll; overflow-x: none;">
            <div class="panelTitle">
              <span>CBC + WBC Differential</span>
            </div>

            <div v-if="siteCd === '0002'">
              <b-row v-if="cbcWorkList !== null && typeof(cbcItem.inptrslt._cdata) !== 'undefined' && cbcItem.inptrslt._cdata > 0" class="mt-2 panelContent" v-for="(cbcItem, index) in cbcWorkList" :key="index">
                <b-col cols="8">
                  {{ cbcItem.tclsscrnnm._cdata }}
                </b-col>
                <b-col>
                  <div>
                    {{ cbcItem.inptrslt._cdata }}
                  </div>
                </b-col>
              </b-row>
            </div>
            <div v-else>
              <b-row v-if="cbcWorkList !== null" class="mt-2 panelContent" v-for="(cbcItem, index) in cbcWorkList" :key="index">
                <b-col cols="8">
                  {{ cbcItem.testNm }}
                </b-col>
                <b-col>
                  {{ cbcItem.count }}
                </b-col>
                <b-col>
                  {{ cbcItem.unit }}
                </b-col>
              </b-row>
            </div>
          </b-card>
        </div>

        <div v-if="isCbcShow" class="p-1 pl-3" style="width: 79%; float: left;">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
        <div v-else class="p-1 pl-3" style="width: 97%; float: left;">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>

        <div class="ml-1" style="position: absolute; bottom: 20px;">
          <div>
            <b-icon v-if="isPrev" id="iconPrev" class="pointer" icon="arrow-up-square" font-scale="2" @click="onClickPrev"></b-icon>
            <b-icon v-else id="iconPrevDisabled" icon="arrow-up-square" font-scale="2"></b-icon>
          </div>
          <div class="mt-2">
            <b-icon v-if="isNext" id="iconNext" class="pointer" icon="arrow-down-square" font-scale="2" @click="onClickNext"></b-icon>
            <b-icon v-else id="iconNextDisabled" icon="arrow-down-square" font-scale="2"></b-icon>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../Constant'
  import api from '@/service'
  import Configs from '../../../Configs'
  import ModalPrint from '../Common/ModalPrint.vue'
  import ModalReportSign from '../Common/ModalReportSign'
  import ModalSkmcMorphology from '../Common/ModalSkmcMorphology'
  import ModalConfirm from '../Common/ModalConfirm'

  // import VueSlideBar from 'vue-slide-bar'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/antd.css'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const path = require('path')
  const convert = require('xml-js')
  const hl7 = require('simple-hl7')
  const log = require('electron-log')

  export default {
    name: 'result-classification',
    components: { VueSlider },
    computed: {
      ...mapGetters({
        workList: Constant.GET_WORK_LIST,
        orderId: Constant.GET_SELECT_ORDER_ID,
        getModifyLog: Constant.GET_MODIFY_LOG,
        getCurrentUser: Constant.GET_CURRENT_USER,
        getWbcCursor: Constant.GET_WBC_CURSOR,
        getBmCursor: Constant.GET_BM_CURSOR,
        getWbcImageHist: Constant.GET_WBC_IMAGE_HIST,
        getBmImageHist: Constant.GET_BM_IMAGE_HIST,
        settings: Constant.GET_SETTINGS,
        getClassificationItem: Constant.GET_CLASSIFICATION_ITEM,
        searchOptions: Constant.GET_SEARCH_OPTIONS,
        siteCd: Constant.GET_SITE_CD,
        deviceBarcode: Constant.GET_DEVICE_BARCODE,
        getKumcCbcPath: Constant.GET_KUMC_CBC_PATH
      })
    },
    watch: {
      sliderValue: function(newVal, oldVal) {
        console.log(this.selectedItemSlot)
        console.log(this.$route.path)

        if (!this.$route.path.includes('wholeSlideReport')) {
          var wrapper = null

          if (this.selectedItemSlot.ANALYSIS_TYPE === '01') {
            wrapper = document.getElementById('wbcImageCardWrapper')
          } else {
            wrapper = document.getElementById('bmImageCardWrapper')
          }

          if (wrapper !== null) {
            var images = wrapper.querySelectorAll('img')
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

            if (this.isMarker) {
              this.EventBus.$emit('CHANGE_MARKER_STATE', {isShowMarker: true})
            }

            this.$store.dispatch(Constant.SET_SIZE_SLIDE_VALUE, newVal)
          }

        }

      },
      brightnessValue: function(newVal, oldVal) {
        if (!this.$route.path.includes('wholeSlideReport')) {
          var wrapper = null

          if (this.selectedItemSlot.ANALYSIS_TYPE === '01') {
            wrapper = document.getElementById('wbcImageCardWrapper')
          } else {
            wrapper = document.getElementById('bmImageCardWrapper')
          }

          if (wrapper !== null) {
            var images = wrapper.querySelectorAll('img')
            for (var i = 0; i < images.length; i++) {
              images[i].style.filter = 'brightness(' + newVal + '%)'
            }

            this.$store.dispatch(Constant.SET_BRIGHTNESS_SLIDE_VALUE, newVal)
          }
        }
      }
    },
    beforeDestroy () {
      this.EventBus.$off('SELECT_WORK_LIST')
      this.EventBus.$off('WBC_CLASSIFICATION_REPORT_LOADED')
      this.EventBus.$off('BM_CLASSIFICATION_REPORT_LOADED')
      this.EventBus.$off('RBC_CLASSIFICATION_REPORT_LOADED')
      this.EventBus.$off('ON_CLICK_LIS')
      this.EventBus.$off('WBC_CLASSIFICATION_LOADED')
      this.EventBus.$off('UPLOAD_LIS')
      this.EventBus.$off('UPLOAD_LIS_SKMC')
      this.EventBus.$off('ON_CLICK_REPORT_SIGN')
      this.EventBus.$off('REPORT_SIGN')

      ipcRenderer.removeAllListeners('selected-dir')
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY_PREV)
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY_NEXT)
      ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CONN_PATH)
      ipcRenderer.removeAllListeners(Constant.SELECT_CBC_CODE)
      ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CODE)
      ipcRenderer.removeAllListeners(Constant.SELECT_EMP_NO)

    },
    data () {
      return {
        testTypeNm: null,
        menus: [],
        signedInfo: {},
        isShowTools: false,
        isShowZoom: false,
        selectedItemSlot: {},
        tabList: ['RBC', 'WBC', 'Whole Slide', 'BM Cell', 'Diagnosis', 'REPORT'],
        sliderValue: 50,
        brightnessValue: 100,
        // 되돌리기 position
        curPos: 0,
        // 세포 마킹 영역 표시
        isMarker: false,
        rbcInfo: [],
        wbcClassificationResult: [],
        wbcTotalCount: 0,
        bmClassificationResult: [],
        bmCellTotalCount: 0,
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        barcodePath: '',
        isCbcShow: false,
        cbcWorkList: null,
        isPrev: false,
        isNext: false,
        prevItem: null,
        nextItem: null,
        lisConnObj: null,
        cbcCodeList: null,
        cbcPatientNm: '',
        cbcPatientNo: '',
        cbcSex: '',
        cbcAge: '',
        wbcInfo: [],
        bmInfo: [],
        isShowModal: false,
        empNo: ''
      }
    },
    mounted () {
      var self = this

      this.$nextTick(function() {
        console.log(this.workList)

        ipcRenderer.send(Constant.SELECT_LIS_CONN_PATH, JSON.stringify({deviceBarcode: self.deviceBarcode}))
        ipcRenderer.send(Constant.SELECT_CBC_CODE, null)
        ipcRenderer.send(Constant.SELECT_EMP_NO, JSON.stringify({userId: self.getCurrentUser.userId}))

        ipcRenderer.on(Constant.SELECT_EMP_NO, function (event, result) {
          console.log(result)

          self.empNo = result.EMP_NO
        })

        // search lis path
        ipcRenderer.on(Constant.SELECT_LIS_CONN_PATH, function (event, result) {
          console.log(result)
          if (result !== null) {
            self.lisConnObj = result
          }
        })

        // search cbc code
        ipcRenderer.on(Constant.SELECT_CBC_CODE, function (event, result) {
          console.log(result)
          self.cbcCodeList = result
        })

        // lis code
        ipcRenderer.on(Constant.SELECT_LIS_CODE, function (event, result) {
          console.log(result)
          console.log(self.wbcInfo)
          console.log(self.lisConnObj)

          // 고대 안암
          var wbcLisCode = result.filter(function(item) {
            return item.TEST_TYPE === '01'
          })

          var bmLisCode = result.filter(function(item) {
            return item.TEST_TYPE === '02'
          })

          if (self.siteCd === '0006') {
            if (self.lisConnObj !== null) {
              var data = 'H|\^&||||||||||P||' + self.selectedItemSlot.BARCODE_NO + '\n'
              var seq = 0

              console.log(self.wbcInfo)
              console.log(result)

              if (self.selectedItemSlot.ANALYSIS_TYPE === '01') {
                var kumcMergePercent = 0
                var kumcBandPercent = 0

                // 고대 NE 병합 로직 (NB -> NS)
                // start [
                self.wbcInfo.forEach(function(wbcItem) {
                  if (wbcItem.title === 'ME' || wbcItem.title === 'MY' ||
                      wbcItem.title === 'PR' || wbcItem.title === 'BL') {
                    kumcMergePercent += Number(wbcItem.percent)
                  }

                  if (wbcItem.title === 'NB') {
                    kumcBandPercent = Number(wbcItem.percent)
                  }
                })

                console.log(kumcMergePercent)
                console.log(kumcBandPercent)

                if (kumcMergePercent > 0 && kumcBandPercent < 6) {
                  // seg
                  var segItem = self.wbcInfo.filter(function(item) {
                    return item.title === 'NS'
                  })

                  // band
                  var bandItem = self.wbcInfo.filter(function(item) {
                    return item.title === 'NB'
                  })

                  segItem[0].percent = (Number(segItem[0].percent) + Number(kumcBandPercent)) + ''
                  bandItem[0].percent = '0'
                }
                //  end ]

                wbcLisCode.forEach(function(lisCode) {
                  if (lisCode.LIS_CD !== '') {
                    self.wbcInfo.forEach(function(wbcItem) {
                      if (wbcItem.id === lisCode.IA_CD) {
                        // 5diff는 0이어도 데이터 올림
                        if (wbcItem.title === 'NE' || wbcItem.title === 'NS' || wbcItem.title === 'LY' ||
                            wbcItem.title === 'MO' || wbcItem.title === 'EO' || wbcItem.title === 'BA') {
                            // count
                            data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '|' + wbcItem.count + '|||||||^' + self.getCurrentUser.userId + '\n'

                            // percent
                            data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '%|' + wbcItem.percent + '|%||||||^' + self.getCurrentUser.userId + '\n'

                        } else {
                          if (Number(wbcItem.percent) > 0 || Number(wbcItem.count) > 0) {
                            // count
                            data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '|' + wbcItem.count + '|||||||^' + self.getCurrentUser.userId + '\n'

                            // percent
                            data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '%|' + wbcItem.percent + '|%||||||^' + self.getCurrentUser.userId + '\n'
                          }
                        }
                      }
                    })
                  }
                })
              } else {
                var kumcMergePercent = 0
                var kumcBandPercent = 0

                // 고대 NE 병합 로직 (NB -> NS)
                // start [
                self.bmInfo.forEach(function(bmItem) {
                  if (bmItem.title === 'ME' || bmItem.title === 'MY' ||
                      bmItem.title === 'PR' || bmItem.title === 'BL') {
                    kumcMergePercent += Number(bmItem.percent)
                  }

                  if (bmItem.title === 'NB') {
                    kumcBandPercent = Number(bmItem.percent)
                  }
                })

                console.log(kumcMergePercent)
                console.log(kumcBandPercent)

                if (kumcMergePercent > 0 && kumcBandPercent < 6) {
                  // seg
                  var segItem = self.bmInfo.filter(function(item) {
                    return item.title === 'NS'
                  })

                  // band
                  var bandItem = self.bmInfo.filter(function(item) {
                    return item.title === 'NB'
                  })

                  segItem[0].percent = (Number(segItem[0].percent) + Number(kumcBandPercent)) + ''
                  bandItem[0].percent = '0'
                }
                //  end ]

                bmLisCode.forEach(function(lisCode) {
                  if (lisCode.LIS_CD !== '') {
                    self.bmInfo.forEach(function(bmItem) {
                      if (bmItem.id === lisCode.IA_CD) {
                        // 5diff는 0이어도 데이터 올림
                        if (bmItem.title === 'NE' || bmItem.title === 'NS' || bmItem.title === 'LY' || bmItem.title === 'MO'
                            || bmItem.title === 'EO' || bmItem.title === 'BA') {
                            // count
                            data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '|' + bmItem.count + '|||||||^' + self.getCurrentUser.userId + '\n'

                            // percent
                            data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '%|' + bmItem.percent + '|%||||||^' + self.getCurrentUser.userId + '\n'

                        } else {
                          if (Number(bmItem.percent) > 0) {
                            // count
                            data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '|' + bmItem.count + '|||||||^' + self.getCurrentUser.userId + '\n'

                            // percent
                            data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '%|' + bmItem.percent + '|%||||||^' + self.getCurrentUser.userId + '\n'
                          }
                        }
                      }
                    })
                  }
                })
              }

              data += 'L|1|N'
              log.info(data)

              // file
              if (self.lisConnObj.LIS_CONN_TYPE_CD === '01') {
                // create directory
                !fs.existsSync(self.lisConnObj.LIS_FILE_PATH + '/') && fs.mkdirSync(self.lisConnObj.LIS_FILE_PATH)

                fs.writeFile(self.lisConnObj.LIS_FILE_PATH + '/' + self.selectedItemSlot.BARCODE_NO + '.lst2msg', data, function(err) {
                  if (err) {
                    console.log(err)
                    self.$toasted.show(err.message, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  } else {
                    self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  }

                  self.EventBus.$emit('OVERLAY', {state: false})
                })
              } else if (self.lisConnObj.LIS_CONN_TYPE_CD === '02') { // URL
                self.sendLisMessage(data)
              }

            } else {
              self.$toasted.show(Constant.IDS_MSG_FAILED, {
                position: 'bottom-center',
                duration: '2000'
              })

              self.EventBus.$emit('OVERLAY', {state: false})
            }
          } else {
            if (self.lisConnObj !== null) {
              // create directory
              !fs.existsSync(self.lisConnObj.LIS_FILE_PATH) && fs.mkdirSync(self.lisConnObj.LIS_FILE_PATH)

              var client = hl7.Server.createFileClient(self.lisConnObj.LIS_FILE_PATH)

              var msg = new hl7.Message(
                'PBIA',                           // sending application
                'PBIA',                           // sending facility
                'LIS',                            // receiving application
                'LIS',                            // receiving facility
                self.$getDateTimeStr(),           // date/time of message
                '',                               // security
                ['ADT', 'R02'],                   // message type : This field has 2 components
                self.selectedItemSlot.BARCODE_NO,     // message control ID : file name
                'P',                              // Processing ID
                '2.5\n'                             // HL7 version ID
                //Keep adding fields
              )

              var seq = 0
              if (self.selectedItemSlot.ANALYSIS_TYPE === '01') {
                wbcLisCode.forEach(function(lisCode) {
                  if (lisCode.LIS_CD !== '') {
                    self.wbcInfo.forEach(function(wbcItem) {
                      if (wbcItem.id === lisCode.IA_CD) {
                        if (Number(wbcItem.percent) > 0 || Number(wbcItem.count)) {
                          msg.addSegment(
                            'OBX',                // ID
                            seq++,                // sequence
                            'NM',                 // value type
                            lisCode.LIS_CD,       // observation identifier
                            '',                   // observation Sub-ID
                            wbcItem.count,        // observation Value
                            '',                   // units
                            '',                   // references range
                            '',                   // abnormal flags
                            '',                   // probability
                            '',                   // nature of abnormal test
                            'P\n'                   // observation result status
                          )

                          // percent
                          msg.addSegment(
                            'OBX',                // ID
                            seq++,                // sequence
                            'NM',                 // value type
                            lisCode.LIS_CD + '%', // observation identifier
                            '',                   // observation Sub-ID
                            wbcItem.percent,      // observation Value
                            '%',                  // units
                            '',                   // references range
                            '',                   // abnormal flags
                            '',                   // probability
                            '',                   // nature of abnormal test
                            'P\n'                 // observation result status
                          )
                        }
                      }
                    })
                  }
                })
              } else {
                bmLisCode.forEach(function(lisCode) {
                  if (lisCode.LIS_CD !== '') {
                    self.bmInfo.forEach(function(bmItem) {
                      if (bmItem.id === lisCode.IA_CD) {
                        if (Number(bmItem.percent) > 0 || Number(bmItem.count)) {
                          msg.addSegment(
                            'OBX',                // ID
                            seq++,                // sequence
                            'NM',                 // value type
                            lisCode.LIS_CD,       // observation identifier
                            '',                   // observation Sub-ID
                            bmItem.count,        // observation Value
                            '',                   // units
                            '',                   // references range
                            '',                   // abnormal flags
                            '',                   // probability
                            '',                   // nature of abnormal test
                            'P\n'                   // observation result status
                          )

                          // percent
                          msg.addSegment(
                            'OBX',                // ID
                            seq++,                // sequence
                            'NM',                 // value type
                            lisCode.LIS_CD + '%', // observation identifier
                            '',                   // observation Sub-ID
                            bmItem.percent,      // observation Value
                            '%',                  // units
                            '',                   // references range
                            '',                   // abnormal flags
                            '',                   // probability
                            '',                   // nature of abnormal test
                            'P\n'                 // observation result status
                          )
                        }
                      }
                    })
                  }
                })
              }

              // file
              if (self.lisConnObj.LIS_CONN_TYPE_CD === '01') {
                console.log(msg.toString())
                client.send(msg, function(err) {
                  console.log('************sending message****************')
                  if (err) {
                    console.log("ERR: " + err.message)
                    self.$toasted.show(err.message, {
                      position: 'bottom-center',
                      duration: '2000'
                    })

                    self.EventBus.$emit('OVERLAY', {state: false})
                  } else {
                    self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                      position: 'bottom-center',
                      duration: '2000'
                    })

                    //NO ACK for File Client
                    self.EventBus.$emit('OVERLAY', {state: false})
                  }
                })
              } else {      // url
                self.sendLisMessage(msg.toString())
              }
            }
          }
        })

        console.log(this.searchOptions)
        this.onClickList(this.$route.params.orderId, true)

        // 출력 버튼 visable
        if (this.$route.path.includes('finalReport')) {
          this.isShowTools = true
        } else if (this.$route.path.includes('wbcReport')) {
          this.isShowZoom = true
        } else if (this.$route.path.includes('bmCellReport')) {
          this.isShowZoom = true
        }

        // 세포 영역 표시
        this.isMarker = this.settings.isMarker
        // image size
        this.sliderValue = this.settings.sizeSildeValue
        // brightness
        this.brightnessValue = this.settings.brightnessSlideValue
      })

      // 디렉터리 선택
      ipcRenderer.on('selected-dir', function (event, results) {
        self.resultPath = self.$replaceAll(results.path, '\\', '/')

        if (results.pathType === 'images') {
          self.EventBus.$emit('OVERLAY', {state: true})

          if (!self.$route.path.includes('wholeSlideReport')) {
            if (self.selectedItemSlot.ANALYSIS_TYPE === '01') {
              var images = document.getElementById('wbcImageCardWrapper').querySelectorAll('img')
            } else {
              var images = document.getElementById('bmImageCardWrapper').querySelectorAll('img')
            }

            images.forEach(function (item) {
              var path = item.currentSrc.replace('file:///', '')
              var url = path.split('/')
              var fileName = url[url.length - 1]

              fs.copyFileSync(path, results.path + '/' + fileName)
            })

            self.EventBus.$emit('OVERLAY', {state: false})
            self.$toasted.show(Constant.IDS_DOWNLOAD_COMPLETE, {
              position: 'bottom-center',
              duration: '2000'
            })
          }

        } else if (results.pathType === 'resultExcel') {
          console.log('resultExcel')
          console.log(results)
          self.EventBus.$emit('EXPORT_CLASSIFICATION', {path: results.path})
        } else if (results.pathType === 'exportWbcResult') {
          self.EventBus.$emit('WBC_MODIFY_LIST', {path: self.resultPath})
        } else if (results.pathType === 'exportBmResult') {
          self.EventBus.$emit('BM_MODIFY_LIST', {path: self.resultPath})
        }
      })

      // bm classification
      this.EventBus.$on('RBC_CLASSIFICATION_REPORT_LOADED', function(params) {
        console.log(params)
        self.rbcInfo = params
      })

      // wbc classification
      this.EventBus.$on('WBC_CLASSIFICATION_REPORT_LOADED', function(params) {
        console.log(params)
        self.wbcTotalCount = 0
        self.wbcClassificationResult = params
        self.wbcClassificationResult.forEach(function (item, index) {
          if (item.title !== 'NR' && item.title !== 'GP' && item.title !== 'PA' && item.title !== 'AR') {
            self.wbcTotalCount += Number(item.count)
          }
        })
      })

      // bm classification
      this.EventBus.$on('BM_CLASSIFICATION_REPORT_LOADED', function(params) {
        console.log(params)
        self.bmCellTotalCount = 0
        self.bmClassificationResult = params
        self.bmClassificationResult.forEach(function (item, index) {
          if (item.title !== 'MC' && item.title !== 'OT') {
            self.bmCellTotalCount += Number(item.count)
          }
        })
      })

      this.EventBus.$on('UPLOAD_LIS_SKMC', function(params) {
        console.log('UPLOAD_LIS_SKMC')
        self.uploadLis()
      })

      this.EventBus.$on('REPORT_SIGN', function(params) {
          var obj = {}
          obj.state = 'Submit'
          obj.slotId = self.selectedItemSlot.SLOT_ID
          obj.userId = self.getCurrentUser.userId
          obj.orderId = self.selectedItemSlot.ORDER_ID          
          
          // console.log(obj)
          // {state: "Submit", slotId: "20230927121018_01_20230927122000", userId: "ddddd"}
          
          // orderId 보내줘라

          ipcRenderer.send(Constant.UPDATE_SIGNED_STATE, JSON.stringify(obj))

          self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
            position: 'bottom-center',
            duration: '2000'
          })
      })

      this.EventBus.$on('ON_CLICK_REPORT_SIGN', function(params) {
        self.$modal.show(ModalConfirm, {openType: 'reportSign', message: Constant.IDS_MSG_CONFIRM_SLIDE}, {
          height: 'auto',
          width: '350px'
        }, {
          'before-open': self.beforeConfirmOpen,
          'before-close': self.beforeConfirmClose
        })        
      })

      // lis upload
      this.EventBus.$on('UPLOAD_LIS', function(params) {
        console.log('UPLOAD_LIS')
        self.uploadLis()
      })

      this.EventBus.$on('ON_CLICK_LIS', function(params) {
        console.log('ON_CLICK_LIS')

        if (!self.isShowModal) {
          if (self.siteCd === '0007') {
            self.$modal.show(ModalSkmcMorphology, {}, {
              height: 'auto',
              width: '800px'
            }, {
              'before-open': self.beforeConfirmOpen,
              'before-close': self.beforeConfirmClose
            })
          } else {
            self.$modal.show(ModalConfirm, {openType: 'lisUpload', message: Constant.IDS_MSG_UPLOAD_LIS}, {
              height: 'auto',
              width: '350px'
            }, {
              'before-open': self.beforeConfirmOpen,
              'before-close': self.beforeConfirmClose
            })
          }
        }
      })

      this.EventBus.$on('WBC_CLASSIFICATION_LOADED', function(params) {
        console.log(params)
        self.wbcInfo = params
      })

      this.EventBus.$on('BM_CLASSIFICATION_LOADED', function(params) {
        console.log(params)
        self.bmInfo = params
      })

      ipcRenderer.on(Constant.GET_TEST_HISTORY_PREV, function (event, results) {
        console.log(results)
        self.prevItem = results
        if (results !== null) {
          self.isPrev = true
        } else {
          self.isPrev = false
        }
      })

      ipcRenderer.on(Constant.GET_TEST_HISTORY_NEXT, function (event, results) {
        console.log(results)
        self.nextItem = results
        if (results !== null) {
          self.isNext = true
        } else {
          self.isNext = false
        }
      })

      if (this.isCbcShow) {
        this.getCbcResults(true)
      }
    },
    methods: {
      sendLisMessage (data) {
        var self = this

        var params = {
          url: self.lisConnObj.LIS_URL,
          barcodeNo: self.selectedItem.BARCODE_NO,
          userId: self.currentUser.userId,
          deviceBarcode: self.deviceBarcode,
          resultMsg: data
        }

        api.uploadReport(params).then(function(result) {
          console.log(result)
          if (result.data.errorCode === 'E000') {
            self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
              position: 'bottom-center',
              duration: '2000'
            })
          } else {
            self.$toasted.show(result.data.errorMessage, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
          self.EventBus.$emit('OVERLAY', {state: false})

        }).catch(function(err) {
          console.log(err)
          self.$toasted.show(err.message, {
            position: 'bottom-center',
            duration: '2000'
          })

          self.EventBus.$emit('OVERLAY', {state: false})
        })
      },
      uploadLis () {
        var self = this

        console.log(self.selectedItemSlot)
        console.log(self.getCurrentUser.userId)
        console.log(Configs.BUCKET_NAME)

        self.EventBus.$emit('OVERLAY', {state: true})

        if (self.siteCd === '0002') {
          var codeList = self.$store.getters.CbcWbcTestCdList_0002
          console.log(codeList)

          // cbc 결과 조회
          api.getCdcResults_0002(self.selectedItemSlot.BARCODE_NO).then(function(result) {
            var xml = result.data
            var json = JSON.parse(convert.xml2json(xml, {compact: true}))
            var cbcWorkList = json.root.spcworklist.worklist

            console.log('-cbc work list start-')
            console.log(cbcWorkList)
            console.log('-cbc work list end-')

            var fiveDiffWorkList = ['LHR10501', 'LHR10502', 'LHR10503', 'LHR10504', 'LHR10505', 'LHR10506']

            console.log('-five diff list start-')
            console.log(fiveDiffWorkList)
            console.log('-five diff list end-')

            // Diff Count item
            var wbcDiffCountItem = cbcWorkList.filter(function(item) {
              return item.testcd._cdata === 'LHR100'
            })

            console.log('-LHR100 start-')
            console.log(wbcDiffCountItem)
            console.log('-LHR100 end-')

            // code copy
            self.wbcInfo.forEach(function(wbcItem) {
              wbcItem.testCd = ''

              codeList.forEach(function(code) {
                if (wbcItem.id === code.id) {
                  wbcItem.testCd = code.cd
                }
              })
            })

            var wbcTemp = []

            // five diff push
            self.wbcInfo.forEach (function(wbcItem) {
              fiveDiffWorkList.forEach (function (fiveDiffItem) {
                if (wbcItem.testCd === fiveDiffItem) {
                  wbcTemp.push(wbcItem)

                  // if ((wbcItem.count > 0 || Number(fiveDiffItem.inptrslt._cdata) > 0) && wbcItem.testCd !== '' ) {
                  //   wbcTemp.push(wbcItem)
                  // }
                } else {
                  if ((wbcItem.count > 0) && wbcItem.testCd !== '') {
                    wbcTemp.push(wbcItem)
                  }
                }
              })
            })

            console.log('-wbcInfo start-')
            console.log(self.wbcInfo)
            console.log('-wbcInfo end-')

            console.log('-wbcTemp start-')
            console.log(wbcTemp)
            console.log('-wbcTemp end-')

            // neutrophil-seg
            var nsPercentItem = wbcTemp.filter(function(item) {
              return item.testCd === 'LHR10501'
            })

            console.log(nsPercentItem)
            // ANC insert
            if ((nsPercentItem.length > 0) && (wbcDiffCountItem.length > 0)) {
              console.log('---CDC diff count--- : ' + Number(wbcDiffCountItem[0].inptrslt._cdata))
              console.log('IA NS percent : ' + nsPercentItem[0].percent)

              var ancResult = ((Number(wbcDiffCountItem[0].inptrslt._cdata) * nsPercentItem[0].percent) / 100).toFixed(2)

              wbcTemp.push({
                testCd: 'LHR10599',
                percent: ancResult
              })
            }

            self.checkUserAuth(self.empNo).then(function(isUserAuth) {
              console.log('isUserAuth : ' + isUserAuth)
              if (isUserAuth === 'succ') {
                // upload
                var params = {
                  empNo: self.empNo,
                  barcodeNo: self.selectedItemSlot.BARCODE_NO,
                  wbcInfo: wbcTemp
                }

                api.uploadReport_0002(params).then(function(result) {
                  var xml = result.data
                  var json = JSON.parse(convert.xml2json(xml, {compact: true}))
                  console.log(json)
                  var resultFlag = json.root.ResultFlag.resultflag._text

                  if (resultFlag === 'Y') {
                    self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  } else {
                    self.$toasted.show(json.root.ResultFlag.error2._text, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  }

                }).catch(function (err) {
                  console.log('catch : ' + err.message)
                  self.$toasted.show(err.message, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                })

              } else {
                self.$toasted.show(Constant.IDS_ERROR_PLEASE_CONFIRM_YOUR_USER_ID, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              }

              self.EventBus.$emit('OVERLAY', {state: false})
            }).catch(function (err) {
              console.log(err.message)
              self.$toasted.show(err.message, {
                position: 'bottom-center',
                duration: '2000'
              })

              self.EventBus.$emit('OVERLAY', {state: false})
            })
          }).catch(function (err) {
            console.log(err.message)
            self.$toasted.show(err.message, {
              position: 'bottom-center',
              duration: '2000'
            })

            self.EventBus.$emit('OVERLAY', {state: false})

          })
        } else {
          console.log('site : ' + self.siteCd)

          ipcRenderer.send(Constant.SELECT_LIS_CODE, null)
        }
      },
      beforeConfirmOpen () {
        console.log('beforeConfirmOpen')
        this.isShowModal = true
      },
      beforeConfirmClose () {
        console.log('beforeConfirmClose')
        this.isShowModal = false
      },
      onClickMenu (menu) {
        if (this.$route.path !== menu.childrenPage) {
          for (var i = 0; i < this.menus.length; i++) {
            if (this.menus[i].id === menu.id) {
              this.menus[i].isSelect = true
            } else {
              this.menus[i].isSelect = false
            }
          }

          this.$router.push(menu.childrenPage)
        }
      },
      onClickCbc () {
        console.log('onClickCbc')
        this.isCbcShow = !this.isCbcShow

        this.$store.dispatch(Constant.SET_IS_CBC_SHOW, this.isCbcShow)
        this.EventBus.$emit('SLIDE_STATE_CHANGE', this.isCbcShow)

        if (this.isCbcShow) {
          this.getCbcResults(true)
        }
      },
      onBarcodeCopy () {
        const copyText = document.getElementById('barcodeNo')
        console.log(copyText.value)
        copyText.setAttribute('type', 'text')
        copyText.select()

        try {
          var successful = document.execCommand('copy')
          var msg = successful ? 'successful' : 'unsuccessful'

          this.$toasted.show('barcode was copied ' + msg, {
            position: 'bottom-center',
            duration: '2000'
          })

        } catch (err) {
          this.$toasted.show('unable to copy', {
            position: 'bottom-center',
            duration: '2000'
          })
        }

        copyText.setAttribute('type', 'hidden')
        window.getSelection().removeAllRanges()
      },
      onChangeMarker (value) {
        this.$store.dispatch(Constant.UPDATE_MARKER_STATE, value)
        this.EventBus.$emit('CHANGE_MARKER_STATE', {isShowMarker: value})
      },
      onSliderDragStart (evt) {
        console.log('onSliderDragStart')
        this.EventBus.$emit('SLIDER_DRAG', {isDragStart: true})
      },
      onSliderDragEnd (evt) {
        console.log('onSliderDragEnd')
        this.EventBus.$emit('SLIDER_DRAG', {isDragStart: false})
      },
      onSubmit () {
        this.$modal.show(ModalReportSign, {orderId: this.selectedItemSlot.ORDER_ID}, {
          height: 'auto',
          width: '550px'
        })
      },
      onExport (path) {
        ipcRenderer.send('open-file-dialog-for-dir', path)
      },
      onClickList (orderId, isRefreshMenu) {
        var self = this

        console.log(orderId)
        this.EventBus.$emit('REMOVE_MARKER')

        this.selectSlot(orderId, isRefreshMenu)
        this.$store.dispatch(Constant.UPDATE_SELECT_ORDER_ID, orderId)
      },
      selectSlot (orderId, isRefreshMenu) {
        var self = this

        console.log(self.getClassificationItem)

        ipcRenderer.send(Constant.GET_TEST_HISTORY_PREV, JSON.stringify({
          limit: 0,
          size: self.getClassificationItem.limit,
          searchType: self.searchOptions.searchTypeCd,
          searchText: self.searchOptions.searchText,
          startDate: self.searchOptions.startDate,
          endDate: self.searchOptions.endDate,
          wbcClassList: self.searchOptions.wbcClassList,
          orderId: orderId
        }))

        ipcRenderer.send(Constant.GET_TEST_HISTORY_NEXT, JSON.stringify({
          limit: 0,
          size: self.getClassificationItem.limit,
          searchType: self.searchOptions.searchTypeCd,
          searchText: self.searchOptions.searchText,
          startDate: self.searchOptions.startDate,
          endDate: self.searchOptions.endDate,
          wbcClassList: self.searchOptions.wbcClassList,
          orderId: orderId
        }))

        ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({orderId: orderId}))

        ipcRenderer.once(Constant.GET_TEST_HISTORY, function (event, result) {
          self.selectedItemSlot = result
          console.log(self.selectedItemSlot)
          self.signedInfo.signedState = self.selectedItemSlot.SIGNED_STATE
          self.signedInfo.signedUserId = self.selectedItemSlot.SIGNED_USER_ID
          self.testTypeNm = self.selectedItemSlot.TEST_TYPE_NM

          self.getCbcResults(false)

          // left menu refresh
          if (isRefreshMenu) {
            self.createMenus()
          } else {
            ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({orderId: self.selectedItemSlot.ORDER_ID}))
          }

          // load barcode
          var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItemSlot.SLOT_ID
          var barcodePath = rootPath + '/' + self.settings.barcodeDirNm
          // self.barcodePath = 'file://' + barcodePath + '/' + fs.readdirSync(barcodePath)[0] + '?' + self.$getDateTimeStr()

          fs.readdir(rootPath + '/' + self.settings.barcodeDirNm, function(err, files) {
            if (!err) {
              self.barcodePath = 'file://' + rootPath + '/' + self.settings.barcodeDirNm + '/' + files[0] + '?' + self.$getDateTimeStr()

            } else {
              self.$toasted.show(err.message, {
                position: 'bottom-center',
                duration: '2000'
              })
            }
          })
        })
      },
      createMenus () {
        console.log(this.selectedItemSlot)
        this.menus = []

        if (this.selectedItemSlot.ANALYSIS_TYPE === '01') {
          var objMenu1 = {
            id: '1',
            title: 'RBC classification',
            childrenPage: '/homePage/resultClassification/' +
                           this.selectedItemSlot.ORDER_ID +
                          '/rbcReport/' + JSON.stringify(this.selectedItemSlot),
            iconOn: require('@/assets/icon/RBC_ON.png'),
            iconOff: require('@/assets/icon/RBC_OFF.png'),
            isSelect: false,
            name: 'RBC'
          }

          var objMenu2 = {
            id: '2',
            title: 'WBC classification',
            childrenPage: '/homePage/resultClassification/' +
                          this.selectedItemSlot.ORDER_ID +
                          '/wbcReport/' + JSON.stringify(this.selectedItemSlot),
            iconOn: require('@/assets/icon/WBC_ON.png'),
            iconOff: require('@/assets/icon/WBC_OFF.png'),
            isSelect: true,
            name: 'WBC'
          }

          this.menus.push(objMenu1)
          this.menus.push(objMenu2)

        } else if (this.selectedItemSlot.ANALYSIS_TYPE === '03' || this.selectedItemSlot.ANALYSIS_TYPE === '04' || this.selectedItemSlot.ANALYSIS_TYPE === '05') {
          var title = 'BM biopsy'
          var name = 'BIOPSY'

          if (this.selectedItemSlot.ANALYSIS_TYPE === '03' || this.selectedItemSlot.ANALYSIS_TYPE === '05') {
            title = 'Slide scan'
            name = 'SLIDE SCAN'
          }

          var objMenu1 = {
            id: '1',
            title: title,
            childrenPage: '/homePage/resultClassification/' +
                           this.selectedItemSlot.ORDER_ID +
                          '/bmBiopsy/' + JSON.stringify(this.selectedItemSlot),
            iconOn: require('@/assets/icon/RBC_ON.png'),
            iconOff: require('@/assets/icon/RBC_OFF.png'),
            isSelect: true,
            name: name
          }
          // var objMenu2 = {
          //   id: '2',
          //   title: 'BM Cell',
          //   childrenPage: '/homePage/resultClassification/' +
          //                  this.selectedItemSlot.ORDER_ID +
          //                 '/bmCellReport/' + JSON.stringify(this.selectedItemSlot),
          //   iconOn: require('@/assets/icon/RBC_ON.png'),
          //   iconOff: require('@/assets/icon/RBC_OFF.png'),
          //   isSelect: true,
          //   name: 'BMCELL'
          // }

          this.menus.push(objMenu1)
          // this.menus.push(objMenu2)

        } else {
          var objMenu1 = {
            id: '1',
            title: 'Whole slide image',
            childrenPage: '/homePage/resultClassification/' +
                           this.selectedItemSlot.ORDER_ID +
                          '/wholeSlideReport/' + JSON.stringify(this.selectedItemSlot),
            iconOn: require('@/assets/icon/RBC_ON.png'),
            iconOff: require('@/assets/icon/RBC_OFF.png'),
            isSelect: false,
            name: 'WHOLE'
          }
          var objMenu2 = {
            id: '2',
            title: 'BM Cell',
            childrenPage: '/homePage/resultClassification/' +
                           this.selectedItemSlot.ORDER_ID +
                          '/bmCellReport/' + JSON.stringify(this.selectedItemSlot),
            iconOn: require('@/assets/icon/RBC_ON.png'),
            iconOff: require('@/assets/icon/RBC_OFF.png'),
            isSelect: true,
            name: 'BMCELL'
          }

          this.menus.push(objMenu1)
          this.menus.push(objMenu2)
        }

        if (this.selectedItemSlot.ANALYSIS_TYPE === '01' || this.selectedItemSlot.ANALYSIS_TYPE === '02') {
          this.menus.push({
            id: '3',
            title: 'Report',
            childrenPage: '/homePage/resultClassification/' +
                          this.selectedItemSlot.ORDER_ID +
                          '/finalReport/' + JSON.stringify(this.selectedItemSlot),
            iconOn: require('@/assets/icon/REPORT_ON.png'),
            iconOff: require('@/assets/icon/REPORT_OFF.png'),
            isSelect: false,
            name: 'REPORT'
          })
        }

        if (this.selectedItemSlot.ANALYSIS_TYPE === '02') {
          this.menus.push({
            id: '4',
            title: 'Diagnosis',
            childrenPage: '/homePage/resultClassification/' +
                          this.selectedItemSlot.ORDER_ID +
                          '/diagnosis/' + JSON.stringify(this.selectedItemSlot),
            iconOn: require('@/assets/icon/REPORT_ON.png'),
            iconOff: require('@/assets/icon/REPORT_OFF.png'),
            isSelect: false,
            name: 'DIAG'
          })
        }

        console.log(this.menus)

        for (var i = 0; i < this.menus.length; i++) {
          if (this.menus[i].isSelect) {
            if (this.$route.path !== this.menus[i].childrenPage) {
              this.$router.push(this.menus[i].childrenPage)
            }
          }
        }
      },
      onLink (item) {
        console.log(item)
        this.$nextTick(function() {
          for (var i = 0; i < this.tabList.length; i++) {
            if (this.tabList[i] === item) {
              document.getElementById(item).children[0].classList.add('activeClassResult')
            } else {
              document.getElementById(this.tabList[i]).children[0].classList.remove('activeClassResult')
            }
          }
        })

        console.log(this.selectedItemSlot.ORDER_ID)
        console.log(this.$route.path)

        if (item === 'RBC' && !this.$route.path.includes('rbcReport')) {
          this.isShowTools = false
          this.isShowZoom = false
          this.$router.push('/homePage/resultClassification/rbcReport/' + this.selectedItemSlot.ORDER_ID)
        } else if (item === 'WBC' && !this.$route.path.includes('wbcReport')) {
          this.isShowTools = false
          this.isShowZoom = true
          this.$router.push('/homePage/resultClassification/wbcReport/' + this.selectedItemSlot.ORDER_ID)
        } else if (item === 'REPORT' && !this.$route.path.includes('finalReport')) {
          this.isShowTools = true
          this.isShowZoom = false
          this.$router.push('/homePage/resultClassification/finalReport/' + this.selectedItemSlot.ORDER_ID)
        } else if (item === 'Whole Slide' && !this.$route.path.includes('wholeSlideReport')) {
          this.isShowTools = false
          this.isShowZoom = false
          this.$router.push('/homePage/resultClassification/wholeSlideReport/' + this.selectedItemSlot.ORDER_ID)
        } else if (item === 'BM Cell' && !this.$route.path.includes('bmCellReport')) {
          this.isShowTools = false
          this.isShowZoom = true
          this.$router.push('/homePage/resultClassification/bmCellReport/' + this.selectedItemSlot.ORDER_ID)
        } else if (item === 'bmBiopsy' && !this.$route.path.includes('bmBiopsy')) {
          this.isShowTools = false
          this.isShowZoom = false
          this.$router.push('/homePage/resultClassification/bmBiopsy/' + this.selectedItemSlot.ORDER_ID)
        } else if (item === 'Diagnosis' && !this.$route.path.includes('diagnosis')) {
          this.isShowTools = false
          this.isShowZoom = false
          this.$router.push('/homePage/resultClassification/diagnosis/' + this.selectedItemSlot.ORDER_ID)
        }
      },
      onClickPrint () {
        var html = this.$makePrintHtml(this.selectedItemSlot, this.wbcClassificationResult, this.rbcInfo, this.wbcTotalCount)
        this.$modal.show(ModalPrint, {item: html}, {
          width: '900',
          height: 'auto',
          scrollable: true
        })
      },
      createBmClassification () {
        var result = '<div class="bmContainer" style="display: flex; flex-wrap: wrap;">'
        result += `<div class="item" style="flex-basis: 100%;">BM WBC Diff count classification` + `</div><br /><br />`

        console.log(this.bmClassificationResult)
        for (var i = 0; i < this.bmClassificationResult.length; i++) {
          if ((this.bmClassificationResult[i].id !== '16' &&
               this.bmClassificationResult[i].id !== '17')) {
            result += `<div class="item" style="flex-basis: 40%;">` + this.bmClassificationResult[i].name + `</div>`
            result += `<div class="item" style="flex-basis: 30%;">` + this.bmClassificationResult[i].count + `</div>`
            result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + this.bmClassificationResult[i].percent + `%</div>`
          }

          if (i === (this.bmClassificationResult.length - 1)) {
            result += `<div class="item" style="flex-basis: 40%;">` + 'Total count' + `</div>`
            result += `<div class="item" style="flex-basis: 30%;">` + this.bmCellTotalCount + `</div>`
            result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + '100.00%' + `</div>`
          }
        }

        for (var j = 0; j < this.bmClassificationResult.length; j++) {
          if ((this.bmClassificationResult[j].id === '16' ||
               this.bmClassificationResult[j].id === '17')) {
            result += `<div class="item" style="flex-basis: 40%;">` + this.bmClassificationResult[j].name + `</div>`
            result += `<div class="item" style="flex-basis: 30%;">` + this.bmClassificationResult[j].count + `</div>`
            // if (this.bmClassificationResult[j].id === '12') {
            //   result += `<div class="item" style="flex-basis: 30%;">` + this.bmClassificationResult[j].count + '/ 100 WBC' + `</div>`
            // } else {
            //   result += `<div class="item" style="flex-basis: 30%;">` + this.bmClassificationResult[j].count + `</div>`
            // }
            result += `<div class="item" style="flex-basis: 30%;">` + `</div>`
          }
        }

        result += `<br /><br /><div class="item" style="flex-basis: 100%;">` + 'Comment' + `</div>`
        result += `<div class="item" style="flex-basis: 100%; word-break: break-all;">>&nbsp` + this.selectedItemSlot.BM_COMMENT + `</div>`

        result += '</div>'
        return result
      },
      createWbcClassification() {
        var result = '<div class="wbcContainer" style="display: flex; flex-wrap: wrap;">'
        result += `<div class="item" style="flex-basis: 100%;">WBC classification result` + `</div><br /><br />`

        console.log(this.wbcClassificationResult)
        for (var i = 0; i < this.wbcClassificationResult.length; i++) {
          if ((this.wbcClassificationResult[i].id !== '12' &&
               this.wbcClassificationResult[i].id !== '13' &&
               this.wbcClassificationResult[i].id !== '14' &&
               this.wbcClassificationResult[i].id !== '15')) {
            result += `<div class="item" style="flex-basis: 40%;">` + this.wbcClassificationResult[i].name + `</div>`
            result += `<div class="item" style="flex-basis: 30%;">` + this.wbcClassificationResult[i].count + `</div>`
            result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + this.wbcClassificationResult[i].percent + `%</div>`
          }

          if (i === (this.wbcClassificationResult.length - 1)) {
            result += `<div class="item" style="flex-basis: 40%;">` + 'Total count' + `</div>`
            result += `<div class="item" style="flex-basis: 30%;">` + this.wbcTotalCount + `</div>`
            result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + '100.00%' + `</div></div><br /></br />`
          }
        }

        for (var j = 0; j < this.wbcClassificationResult.length; j++) {
          if ((this.wbcClassificationResult[j].id === '12' ||
               this.wbcClassificationResult[j].id === '13' ||
               this.wbcClassificationResult[j].id === '14' ||
               this.wbcClassificationResult[j].id === '15')) {
            result += `<div class="item" style="flex-basis: 40%;">` + this.wbcClassificationResult[j].name + `</div>`
            if (this.wbcClassificationResult[j].id === '12') {
              result += `<div class="item" style="flex-basis: 30%;">` + this.wbcClassificationResult[j].count + '/ 100 WBC' + `</div>`
            } else {
              result += `<div class="item" style="flex-basis: 30%;">` + this.wbcClassificationResult[j].count + `</div>`
            }
            result += `<div class="item" style="flex-basis: 30%;">` + `</div>`
          }
        }

        result += `<br /><br /><div class="item" style="flex-basis: 100%;">` + 'Comment' + `</div>`
        result += `<div class="item" style="flex-basis: 100%; word-break: break-all;">>&nbsp` + this.selectedItemSlot.WBC_COMMENT + `</div>`

        result += '</div>'
        return result
      },
      createRbcClassification() {
        var result = '<div class="rbcContainer" style="display: flex; flex-wrap: wrap;">'
        result += `<div class="item" style="flex-basis: 100%;">RBC classification result` + `</div><br /><br />`

        for (var i = 0; i < this.rbcInfo.length; i++) {
          result += `<div class="item" style="flex-basis: 30%;">` + this.rbcInfo[i].CATEGORY_NM + `</div>`
          result += `<div class="item" style="flex-basis: 30%;">` + this.rbcInfo[i].CLASS_NM + `</div>`

          if ((this.rbcInfo[i].CATEGORY_ID === '01' ||
               this.rbcInfo[i].CATEGORY_ID === '02' ||
               this.rbcInfo[i].CATEGORY_ID === '03') && this.rbcInfo[i].CLASS_ID === '01') {
            result += `<div class="item" style="flex-basis: 30%;">` + Number(this.rbcInfo[i].DEGREE) + `+</div>`
          } else {
            result += `<div class="item" style="flex-basis: 30%;">` + (Number(this.rbcInfo[i].DEGREE) - 1) + `+</div>`
          }

          if (i === (this.rbcInfo.length - 1)) {
            result += `<br /><br /><br /><div class="item" style="flex-basis: 30%;">` + 'Malaria' + `</div>`
            result += `<div class="item" style="flex-basis: 30%;"></div>`
            result += `<div class="item" style="flex-basis: 30%;">` + this.selectedItemSlot.MALARIA_COUNT + '/' + this.selectedItemSlot.MAX_RBC_COUNT + `RBC</div>`

            result += `<br /><br /><div class="item" style="flex-basis: 100%;">` + 'Comment' + `</div>`
            result += `<div class="item" style="flex-basis: 100%; word-break: break-all;">>&nbsp` + this.selectedItemSlot.RBC_COMMENT + `</div>`
          }
        }

        result += '</div>'
        return result
      },
      onClickSize (evt) {
        // console.log(evt)
      },
      onClickRollback (evt) {
        console.log('onClickRollback')
        var self = this

        // bm cell
        if (this.$route.path.includes('bmCellReport')) {
          var bmModifyList = self.getBmImageHist(self.getCurrentUser.userId)

          if ((bmModifyList.length) > 0 && (self.curPos < bmModifyList.length)) {
            var curGroupId = bmModifyList[self.curPos].groupId

            bmModifyList.forEach(function (item, index) {
              if (item.groupId === curGroupId) {
                fs.rename(item.destPath, item.srcPath, (err) => {
                  if (!err) {
                    curGroupId = item.groupId
                    self.curPos++

                    self.EventBus.$emit('ROLLBACK_BM_IMAGES', null)
                    if (self.curPos >= bmModifyList.length) {
                      self.curPos = 0

                      // 이미지 변경 내역 초기화
                      self.$store.dispatch(Constant.INIT_BM_IMAGE_HIST, null)
                    }
                  } else {
                    self.$toasted.show(Constant.IDS_ERROR_FILE_CLISSIFICATION, {
                      position: 'bottom-center',
                      duration: '2000'
                    })

                    return
                  }
                })
              }
            })
          }

        } else if (this.$route.path.includes('wbcReport')) {
          var wbcModifyList = self.getWbcImageHist(self.getCurrentUser.userId)

          if ((wbcModifyList.length) > 0 && (self.curPos < wbcModifyList.length)) {
            var curGroupId = wbcModifyList[self.curPos].groupId

            wbcModifyList.forEach(function (item, index) {
              if (item.groupId === curGroupId) {
                fs.rename(item.destPath, item.srcPath, (err) => {
                  if (!err) {
                    curGroupId = item.groupId
                    self.curPos++

                    self.EventBus.$emit('ROLLBACK_WBC_IMAGES', null)
                    if (self.curPos >= wbcModifyList.length) {
                      self.curPos = 0

                      // 이미지 변경 내역 초기화
                      self.$store.dispatch(Constant.INIT_WBC_IMAGE_HIST, null)
                    }
                  } else {
                    self.$toasted.show(Constant.IDS_ERROR_FILE_CLISSIFICATION, {
                      position: 'bottom-center',
                      duration: '2000'
                    })

                    return
                  }
                })
              }
            })
          }
        }
      },
      onClickPrev () {
        console.log('onClickPrev')
        console.log(this.prevItem)

        if (this.prevItem !== null) {
          if (this.selectedItemSlot.ANALYSIS_TYPE !== this.prevItem.ANALYSIS_TYPE) {
            this.onClickList(this.prevItem.ORDER_ID, true)
          } else {
            this.onClickList(this.prevItem.ORDER_ID, false)
          }

          if (this.isCbcShow) {
            this.getCbcResults(true)
          }

          this.$store.dispatch(Constant.SET_CLASSIFICATION_ITEM, { item: this.prevItem, limit: this.getClassificationItem.limit})

          // this.EventBus.$emit('OVERLAY', {state: true})
        }
      },
      onClickNext () {
        console.log('onClickNext')
        if (this.nextItem !== null) {
          if (this.selectedItemSlot.ANALYSIS_TYPE !== this.nextItem.ANALYSIS_TYPE) {
            this.onClickList(this.nextItem.ORDER_ID, true)
          } else {
            this.onClickList(this.nextItem.ORDER_ID, false)
          }

          if (this.isCbcShow) {
            this.getCbcResults(true)
          }

          this.$store.dispatch(Constant.SET_CLASSIFICATION_ITEM, { item: this.nextItem, limit: this.getClassificationItem.limit})

          // this.EventBus.$emit('OVERLAY', {state: true})
        }
      },
      getCbcResults (isToast) {
        var self = this

        console.log('getCbcResults')
        console.log(self.selectedItemSlot)
        console.log(isToast)

        // if (Configs.BUCKET_NAME === 'pb-082-0001') {
        if (self.siteCd === '0002') {
          api.getCdcResults_0002(self.selectedItemSlot.BARCODE_NO).then(function(result) {
            var xml = result.data
            var json = JSON.parse(convert.xml2json(xml, {compact: true}))
            self.cbcWorkList = json.root.spcworklist.worklist
            console.log(self.cbcWorkList)

          }).catch(function (err) {
            console.log(err.message)
            self.$toasted.show(err.message, {
              position: 'bottom-center',
              duration: '2000'
            })
          })
        } else if (self.siteCd === '0006') {  // 고대 안암
          console.log(self.getKumcCbcPath)

          self.cbcWorkList = []
          fs.readFile(self.getKumcCbcPath + '/' + self.selectedItemSlot.BARCODE_NO + '.txt', function(err, data) {
            if (err) {
              console.log(err)
              if (isToast) {
                self.$toasted.show(err.message, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              }
            } else {
              var cbcData = data.toString()
              var cbcDataArray = cbcData.split('\n')

              cbcDataArray.forEach(function(cbcData) {
                var itemArray = cbcData.split('\t')
                console.log(itemArray)

                var title = itemArray[0].trim()
                var value = itemArray[1].trim()

                console.log(title)
                // 검체번호, 검사일시, 환자번호, 환자명, 성별, 나이, 그래프 데이터 제외
                if (title !== 'SPC_NO' && title !== 'BLCL_DT' &&
                    title !== 'PT_NO' && title !== 'PT_NM' &&
                    title !== 'SEX' && title !== 'AGE' &&
                    title !== 'SCAT_WDF' && title !== 'SCAT_WNR' &&
                    title !== 'DIST_RBC' && title !== 'DIST_WDF(FSC)' &&
                    title !== 'DIST_PLT') {

                  var unit = ''
                  if (title.indexOf('%') > 0) {
                    unit = '%'
                  }

                  var obj = {
                    testNm: title,
                    count: value,
                    unit: unit
                  }

                  self.cbcWorkList.push(obj)
                }

                if (title === 'PT_NO') {
                  self.cbcPatientNo = value
                }

                if (title === 'PT_NM') {
                  self.cbcPatientNm = value
                }

                if (title === 'SEX') {
                  self.cbcSex = value
                }

                if (title === 'AGE') {
                  self.cbcAge = value
                }
              })
            }
          })
        } else {
          if (self.lisConnObj !== null) {
            if (self.lisConnObj.CBC_CONN_TYPE_CD === '01') {
              fs.readFile(self.lisConnObj.CBC_FILE_PATH + '/' + self.selectedItemSlot.BARCODE_NO + '.hl7', function(err, data) {
                if (err) {
                  console.log(err.message)
                  if (isToast) {
                    self.$toasted.show(err.message, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  }

                } else {
                  console.log(data.toString())
                  var parser = new hl7.Parser({segmentSeperator: '\n'})
                  var msg = parser.parse(data.toString())

                  console.log(msg)
                  console.log(self.cbcCodeList)
                  self.cbcWorkList = []

                  self.cbcCodeList.forEach(function(cbcCode) {
                    msg.segments.forEach(function(cbcSegment) {
                      console.log(cbcSegment)

                      if (cbcCode.CBC_CD === cbcSegment.fields[2].value[0][0].value[0]) {
                        var obj = {
                          iaCd: cbcCode.IA_CD,
                          testCd: cbcCode.CBC_CD,
                          testNm: cbcCode.CD_NM,
                          count: cbcSegment.fields[4].value[0][0].value[0],
                          unit: cbcSegment.fields[5].value[0][0].value[0]
                        }

                        self.cbcWorkList.push(obj)
                      }
                    })
                  })

                  self.EventBus.$emit('CBC_DATA_LOADED', self.cbcWorkList)
                  console.log(self.cbcWorkList)

                }
              })

            } else if (self.lisConnObj.CBC_CONN_TYPE_CD === '02') {
              var params = {
                url: self.lisConnObj.CBC_URL,
                barcodeNo: self.selectedItemSlot.BARCODE_NO,
                userId: self.currentUser.userId,
                deviceBarcode: self.deviceBarcode
              }

              api.getCdcResults(params).then(function(result) {
                console.log(result)

                var parser = new hl7.Parser({segmentSeperator: '\n'})
                var msg = parser.parse(result.data)

                console.log(msg)
                console.log(self.cbcCodeList)
                self.cbcWorkList = []

                self.cbcCodeList.forEach(function(cbcCode) {
                  msg.segments.forEach(function(cbcSegment) {
                    console.log(cbcSegment)

                    if (cbcCode.CBC_CD === cbcSegment.fields[2].value[0][0].value[0]) {
                      var obj = {
                        testNm: cbcCode.CD_NM,
                        count: cbcSegment.fields[4].value[0][0].value[0],
                        unit: cbcSegment.fields[5].value[0][0].value[0]
                      }

                      self.cbcWorkList.push(obj)
                    }
                  })
                })

                self.EventBus.$emit('CBC_DATA_LOADED', self.cbcWorkList)
                console.log(self.cbcWorkList)

              }).catch(function (err) {
                console.log(err.message)
                if (isToast) {
                  self.$toasted.show(err.message, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                }
              })
            }
          }
        }
      }
    }
  }
</script>
<style>
  #listWrapper {
    height: 380px;
    overflow-y: scroll;
  }
  #btnExport {
    height: 27px;
    font-size: 13px !important;
    line-height: 10px;
    width: 70px;
  }
  .printStylePb {
    position: absolute;
    left: 880px;
    top: 0px;
  }
  .printStyleBm {
    position: absolute;
    left: 500px;
    top: 0px;
  }
  .cellMarking {
    position: absolute;
    left: 500px;
    top: 0px;
  }
  #iconPrev:hover {
    color: #3F628C;
  }
  #iconPrevDisabled {
    color: gray
  }
  #iconNext:hover {
    color: #3F628C;
  }
  #iconNextDisabled {
    color: gray;
  }
  #divCbcdiff {
    height: 919px;
  }
  .height532 {
    height: 532px;
  }
  .height485 {
    height: 485px;
  }
  .barcodeCopy {
    border: 1px solid;
    border-radius: 50px;
    padding: 5px;
    font-size: 12px;
  }
  .barcodeCopy:hover {
    background-color: #3F628C;
  }
</style>
