<template>
  <b-container id="report" class="h-100" fluid>
    <b-row class="mt-2 mb-2" style="height: 30px;">
      <b-col>
        <img class="pointer" src="~@/assets/result/print.png"
          v-b-tooltip.hover title="print a report" @click="onClickPrint" style="width: 35px;" />
        <b-icon class="ml-2 pointer" icon="file-earmark-arrow-up" font-scale="1.5" @click="onClickLisUpload"
          v-b-tooltip.hover title="upload to lis (F9)"></b-icon>
      </b-col>
    </b-row>
    <b-row id="printRoot" class="h-100">
      <b-col class="p-0 h-100">
        <b-card id="reportCard" class="pl-1 pr-1" text-variant="white" no-body>
          <div v-bind:class="{reportStyleBm: selectedItem.ANALYSIS_TYPE === '02', reportStyle: selectedItem.ANALYSIS_TYPE === '01'}" id="reportWrapper">
            <b-row style="border-bottom: 1px dashed gray;">
              <b-col class="p-0" cols="2" style="color: gray;">
                <span>&nbsp&nbsp&nbsp&nbsp &#60; Hospital &#62;</span>
              </b-col>
              <b-col class="p-0" style="text-align: center; margin-right: 100px; color: gray;">
                <span id="reportSerialNo">DM Serial Nbr : {{ serialNo }}</span>
              </b-col>
            </b-row>
            <div id="printSection">
              <b-row>
                <b-col id="reportBody" class="reportBody" style="overflow-y: auto; overflow-x: hidden; height: 810px;">
                  <div id="reportTitle" class="pt-3 pb-5" style="text-align: center; color: white; font-size: 18px;">
                    <span>Analysis Report from UIMD BM system</span>
                  </div>
                  <b-row>
                    <b-col class="pl-4">
                      <span>Order ID</span>
                    </b-col>
                    <b-col>
                      <span>{{ selectedItem.ORDER_ID }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="mt-4">
                    <b-col class="pl-4">
                      <span>Ordered date</span>
                    </b-col>
                    <b-col>
                      <span>{{$stringToDateTime(selectedItem.ORDER_DTTM)}}</span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-4">
                      <span>Signed by ID</span>
                    </b-col>
                    <b-col>
                      <span> {{ selectedItem.SIGNED_USER_ID }} </span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-4">
                      <span>Signed date</span>
                    </b-col>
                    <b-col>
                      <span>{{ selectedItem.SIGNED_DTTM }}</span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-4">
                      <span>Classification ordered analysis</span>
                    </b-col>
                    <b-col>
                      <span>{{ selectedItem.ANALYSIS_TYPE_NM }}</span>
                    </b-col>
                  </b-row>
                  <b-row class="mt-4">
                    <b-col class="pl-4">
                      <span>Patient ID</span>
                    </b-col>
                    <b-col>
                      <span> {{ selectedItem.PATIENT_ID }} </span>
                    </b-col>
                  </b-row>
                  <!-- <b-row>
                    <b-col class="pl-4">
                      <span>&nbsp&nbsp> Ordered Classification</span>
                    </b-col>
                    <b-col>
                      <span>{{ selectedItem.ANALYSIS_TYPE_NM }}</span>
                    </b-col>
                  </b-row> -->
                  <b-row>
                    <b-col class="pl-4">
                      <span>Name</span>
                    </b-col>
                    <b-col>
                      <span>{{ selectedItem.PATIENT_NM }}</span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-4">
                      <span>Birth</span>
                    </b-col>
                    <b-col>
                      <span>{{ $stringToDate(selectedItem.BIRTHDAY) }}</span>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="pl-4">
                      <span>Gender</span>
                    </b-col>
                    <b-col>
                      <span>{{ selectedItem.GENDER_NM }}</span>
                    </b-col>
                  </b-row>
                  <!-- PB -->
                  <b-row v-show="selectedItem.ANALYSIS_TYPE === '01'" class="mt-3">
                    <b-col class="pl-4">
                      <div>RBC classification result</div>
                      <b-row v-if="item.CATEGORY_ID !== '04'" v-for="item in rbcClassList" :key="item.classId">
                        <b-col cols="3">>{{ item.CATEGORY_NM }}</b-col>
                        <b-col>{{ item.CLASS_NM }}</b-col>
                        <b-col class="text-right">
                          {{ item.DEGREE }}+
                          <!-- <div v-if="(item.CATEGORY_ID === '01' || item.CATEGORY_ID === '02' || item.CATEGORY_ID === '03') && item.CLASS_ID === '01'">
                            {{ item.DEGREE }}+
                          </div>
                          <div v-else>
                            {{ item.DEGREE - 1 }}+
                          </div> -->
                        </b-col>
                      </b-row>
                      </br>
                      <b-row>
                        <b-col cols="3">>Others</b-col>
                        <b-col>Platelets</b-col>
                        <b-col cols="5" class="text-right">{{ selectedItem.PLT_COUNT }} PLT / 1000 RBC</b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="3"></b-col>
                        <b-col>Malaria</b-col>
                        <b-col class="text-right">{{ selectedItem.MALARIA_COUNT }} / {{ selectedItem.MAX_RBC_COUNT }} RBC</b-col>
                      </b-row>
                      <b-row class="mt-2">
                        <b-col>
                          <div>Comment</div>
                          <div>>{{ selectedItem.RBC_COMMENT }}</div>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col>
                      <div>WBC classification result</div>
                      <b-row v-if="(item.title !== 'NR' && item.title !== 'GP' && item.title !== 'PA' && item.title !== 'AR')" v-for="item in wbcClassList" :key="item.id">
                        <b-col cols="5">>{{ item.name }}</b-col>
                        <b-col class="text-center">{{ item.count }}</b-col>
                        <b-col class="text-right">{{ item.percent }} %</b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="5">>Total count</b-col>
                        <b-col class="text-center">{{ wbcTotalCount }}</b-col>
                        <b-col class="text-right">100.00%</b-col>
                      </b-row>
                      <b-row class="mt-2" v-if="(item.title === 'NR' || item.title === 'GP' ||
                        item.title === 'PA' || item.title === 'AR' ||
                        item.title === 'MA') && item.count > 0" v-for="item in wbcClassList" :key="item.id">
                        <b-col cols="5">>{{ item.name }}</b-col>
                        <b-col class="text-center">
                          {{ item.count }}
                          <span v-if="item.title === 'NR' || item.title === 'GP'"> / {{ maxWbcCount }} WBC</span></b-col>
                        <b-col></b-col>
                      </b-row>
                      <b-row class="mt-2">
                        <b-col>
                          <div>Comment</div>
                          <div>>{{ selectedItem.WBC_COMMENT }}</div>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                  <!-- BM -->
                  <b-row v-show="selectedItem.ANALYSIS_TYPE === '02'" class="mt-3">
                    <b-col class="pl-4" cols="7">
                      <div>BM Cell Diff count classification</div>
                      <b-row v-if="item.title !== 'MC' && item.title !== 'OT'" v-for="item in bmClassList" :key="item.id">
                        <b-col cols="6">&nbsp&nbsp> {{ item.name }}</b-col>
                        <b-col class="text-right">{{ item.count }}</b-col>
                        <b-col class="text-right">{{ item.percent }}%</b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="6">&nbsp&nbsp> Total count</b-col>
                        <b-col class="text-right">{{ bmCellTotalCount }}</b-col>
                        <b-col class="text-right">{{ getPercent(bmCellTotalCount) }}%</b-col>
                      </b-row>

                      <div>Non-BM Cell</div>
                      <b-row v-if="item.title === 'MC' || item.title === 'OT'" v-for="item in bmClassList" :key="item.id">
                        <b-col cols="6">&nbsp&nbsp> {{ item.name }} </b-col>
                        <b-col class="text-right">{{ item.count }}</b-col>
                        <b-col class="text-right">-</b-col>
                      </b-row>
                      <b-row>
                        <b-col cols="6">&nbsp&nbsp> M:E Ratio </b-col>
                        <b-col class="text-right">{{ meRatio }} : 1</b-col>
                        <b-col class="text-right">-</b-col>
                      </b-row>

                      </br>
                      <b-row class="mt-2">
                        <b-col>
                          <div>Comment</div>
                          <div>&nbsp&nbsp>{{ bmComment }}</div>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
  import Constant from '../../../../../Constant'
  import ModalPrint from '../../../Common/ModalPrint.vue'
  import ModalConfirm from '../../../Common/ModalConfirm'
  import ModalSkmcMorphology from '../../../Common/ModalSkmcMorphology'
  import { mapGetters } from 'vuex'
  import Configs from '../../../../../Configs'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const path = require('path')
  const convert = require('xml-js')
  const hl7 = require('simple-hl7')

  export default {
    name: 'report',
    computed: {
      ...mapGetters({
        // workList: Constant.GET_WORK_LIST
        // getRbcComment: Constant.GET_RBC_COMMENT,
        // getWbcComment: Constant.GET_WBC_COMMENT,
        // getBmComment: Constant.GET_BM_COMMENT
        currentUser: Constant.GET_CURRENT_USER,
        siteCd: Constant.GET_SITE_CD,
        deviceBarcode: Constant.GET_DEVICE_BARCODE
      })
    },
    props: ['orderId', 'paramItem'],
    watch: {
      // orderId: function(newVal, oldVal) { // watch it
        // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({orderId: newVal}))
        // ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({orderId: newVal}))
      // },
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
        this.serialNo = this.selectedItem.SERIAL_NO
        this.maxWbcCount = this.selectedItem.MAX_WBC_COUNT

        ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({orderId: this.selectedItem.ORDER_ID}))
      }
    },
    beforeDestroy () {
      this.EventBus.$off('WBC_CLASSIFICATION_LOADED')
      this.EventBus.$off('BM_CLASSIFICATION_LOADED')
      // this.EventBus.$off('UPLOAD_LIS')
      // this.EventBus.$off('UPLOAD_LIS_SKMC')

      this.EventBus.$off(Constant.UPDATE_RBC_COMMENT)
      this.EventBus.$off(Constant.UPDATE_WBC_COMMENT)

      ipcRenderer.removeAllListeners(Constant.GET_RBC_COUNT)
      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_CUSTOM_CLASS)
      // ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CODE)
      // ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CONN_PATH)
    },
    data () {
      return {
        selectedItem: {},
        rbcClassList: [],
        wbcClassList: [],
        bmClassList: [],
        wbcCustomClass: [],
        wbcTotalCount: 0,
        bmCellTotalCount: 0,
        rbcComment: '',
        wbcComment: '',
        bmComment: '',
        serialNo: '',
        maxWbcCount: 0,
        empNo: '',
        lisConnObj: null,
        meRatio: 0
      }
    },
    mounted () {
      var self = this

      console.log('device------' + self.deviceBarcode)
      // ipcRenderer.send(Constant.SELECT_EMP_NO, JSON.stringify({userId: self.currentUser.userId}))
      // ipcRenderer.send(Constant.SELECT_LIS_CONN_PATH, JSON.stringify({deviceBarcode: self.deviceBarcode}))

      // ipcRenderer.on(Constant.SELECT_LIS_CONN_PATH, function (event, result) {
      //   console.log(result)
      //   if (result !== null) {
      //     self.lisConnObj = result
      //   }
      // })
      //
      // ipcRenderer.on(Constant.SELECT_EMP_NO, function (event, result) {
      //   self.empNo = result.EMP_NO
      // })

      ipcRenderer.on(Constant.GET_RBC_COUNT, function (event, result) {
        console.log(result)
        self.rbcClassList = result
      })

      // custom class
      ipcRenderer.on(Constant.SELECT_WBC_CUSTOM_CLASS, function (event, result) {
        self.wbcCustomClass = result
      })

      // lis code
      // ipcRenderer.on(Constant.SELECT_LIS_CODE, function (event, result) {
      //   console.log(result)
      //
      //   var lisCodes = null
      //   var classList = null
      //
      //   if (self.selectedItem.ANALYSIS_TYPE === '01') {
      //     classList = self.wbcClassList
      //     lisCodes = result.filter(function(item) {
      //       return item.TEST_TYPE === '01'
      //     })
      //
      //   } else {
      //     classList = self.bmClassList
      //     lisCodes = result.filter(function(item) {
      //       return item.TEST_TYPE === '02'
      //     })
      //   }
      //
      //   console.log(classList)
      //   console.log(lisCodes)
      //
      //   // 고대 안암
      //   if (self.siteCd === '0006') {
      //     if (self.lisConnObj !== null) {
      //       var data = 'H|\^&||||||||||P||' + self.$getDateTimeStr() + '\n'
      //
      //       var seq = 0
      //       lisCodes.forEach(function(lisCode) {
      //         if (lisCode.LIS_CD !== '') {
      //           classList.forEach(function(item) {
      //             if (item.id === lisCode.IA_CD) {
      //               console.log(item)
      //
      //               if (Number(item.percent) > 0 || Number(item.count) > 0) {
      //                 // count
      //                 data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '|' + item.count + '|||||||^' + self.currentUser.userId + '\n'
      //
      //                 // percent
      //                 data += 'R|' + (++seq) + '|^^^^' + lisCode.LIS_CD + '%|' + item.percent + '|%||||||^' + self.currentUser.userId + '\n'
      //               }
      //             }
      //           })
      //         }
      //       })
      //
      //       data += 'L|1|N'
      //       console.log(data)
      //
      //       // file
      //       if (self.lisConnObj.LIS_CONN_TYPE_CD === '01') {
      //         // create directory
      //         !fs.existsSync(self.lisConnObj.LIS_FILE_PATH + '/') && fs.mkdirSync(self.lisConnObj.LIS_FILE_PATH)
      //
      //         fs.writeFile(self.lisConnObj.LIS_FILE_PATH + '/' + self.selectedItem.BARCODE_NO + '.lst2msg', data, function(err) {
      //           if (err) {
      //             console.log(err)
      //             self.$toasted.show(err.message, {
      //               position: 'bottom-center',
      //               duration: '2000'
      //             })
      //           } else {
      //             self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
      //               position: 'bottom-center',
      //               duration: '2000'
      //             })
      //           }
      //
      //           self.EventBus.$emit('OVERLAY', {state: false})
      //         })
      //       } else if (self.lisConnObj.LIS_CONN_TYPE_CD === '02') { // URL
      //         self.sendLisMessage(data)
      //       }
      //
      //     } else {
      //       self.$toasted.show(Constant.IDS_MSG_FAILED, {
      //         position: 'bottom-center',
      //         duration: '2000'
      //       })
      //
      //       self.EventBus.$emit('OVERLAY', {state: false})
      //     }
      //   } else {
      //     console.log(self.lisConnObj)
      //     if (self.lisConnObj !== null) {
      //       // create directory
      //       !fs.existsSync(self.lisConnObj.LIS_FILE_PATH) && fs.mkdirSync(self.lisConnObj.LIS_FILE_PATH)
      //
      //       var client = hl7.Server.createFileClient(self.lisConnObj.LIS_FILE_PATH)
      //       // var parser = new hl7.Parser({segmentSeperator: '\n'})
      //       // var msg = parser.parseFileSync('test/samples/adt.hl7')
      //
      //       var msg = new hl7.Message(
      //         'PBIA',                           // sending application
      //         'PBIA',                           // sending facility
      //         'LIS',                            // receiving application
      //         'LIS',                            // receiving facility
      //         self.$getDateTimeStr(),           // date/time of message
      //         '',                               // security
      //         ['ADT', 'R02'],                   // message type : This field has 2 components
      //         self.selectedItem.BARCODE_NO,     // message control ID : file name
      //         'P',                              // Processing ID
      //         '2.5\n'                           // HL7 version ID
      //         //Keep adding fields
      //       )
      //
      //       var seq = 0
      //       result.forEach(function(lisCode) {
      //         console.log(lisCode.TEST_TYPE)
      //
      //         if (self.selectedItem.ANALYSIS_TYPE === '01') {
      //           if (lisCode.LIS_CD !== '') {
      //             self.wbcClassList.forEach(function(wbcItem) {
      //               if (wbcItem.id === lisCode.IA_CD) {
      //                 if (Number(wbcItem.percent) > 0 || Number(wbcItem.count)) {
      //                   msg.addSegment(
      //                     'OBX',                // ID
      //                     seq++,                // sequence
      //                     'NM',                 // value type
      //                     lisCode.LIS_CD,       // observation identifier
      //                     '',                   // observation Sub-ID
      //                     wbcItem.count,        // observation Value
      //                     '',                   // units
      //                     '',                   // references range
      //                     '',                   // abnormal flags
      //                     '',                   // probability
      //                     '',                   // nature of abnormal test
      //                     'P\n'                 // observation result status
      //                   )
      //
      //                   msg.addSegment(
      //                     'OBX',                // ID
      //                     seq++,                // sequence
      //                     'NM',                 // value type
      //                     lisCode.LIS_CD + '%', // observation identifier
      //                     '%',                  // observation Sub-ID
      //                     wbcItem.percent,      // observation Value
      //                     '',                   // units
      //                     '',                   // references range
      //                     '',                   // abnormal flags
      //                     '',                   // probability
      //                     '',                   // nature of abnormal test
      //                     'P\n'                 // observation result status
      //                   )
      //                 }
      //               }
      //             })
      //           }
      //         } else {
      //           self.bmClassList.forEach(function(bmItem) {
      //             if (bmItem.id === lisCode.IA_CD) {
      //               if (Number(bmItem.percent) > 0 || Number(bmItem.count)) {
      //                 msg.addSegment(
      //                   'OBX',                // ID
      //                   seq++,                // sequence
      //                   'NM',                 // value type
      //                   lisCode.LIS_CD,       // observation identifier
      //                   '',                   // observation Sub-ID
      //                   bmItem.count,        // observation Value
      //                   '',                   // units
      //                   '',                   // references range
      //                   '',                   // abnormal flags
      //                   '',                   // probability
      //                   '',                   // nature of abnormal test
      //                   'P\n'                 // observation result status
      //                 )
      //
      //                 msg.addSegment(
      //                   'OBX',                // ID
      //                   seq++,                // sequence
      //                   'NM',                 // value type
      //                   lisCode.LIS_CD + '%', // observation identifier
      //                   '',                   // observation Sub-ID
      //                   bmItem.percent,       // observation Value
      //                   '%',                  // units
      //                   '',                   // references range
      //                   '',                   // abnormal flags
      //                   '',                   // probability
      //                   '',                   // nature of abnormal test
      //                   'P\n'                 // observation result status
      //                 )
      //               }
      //             }
      //           })
      //         }
      //       })
      //
      //       // file
      //       if (self.lisConnObj.LIS_CONN_TYPE_CD === '01') {
      //         console.log(msg.toString())
      //         client.send(msg, function(err) {
      //           console.log('************sending message****************')
      //           if (err) {
      //             console.log("ERR: " + err.message)
      //             self.$toasted.show(err.message, {
      //               position: 'bottom-center',
      //               duration: '2000'
      //             })
      //
      //             self.EventBus.$emit('OVERLAY', {state: false})
      //           } else {
      //             //NO ACK for File Client
      //             self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
      //               position: 'bottom-center',
      //               duration: '2000'
      //             })
      //             self.EventBus.$emit('OVERLAY', {state: false})
      //           }
      //         })
      //       } else {      // url
      //         self.sendLisMessage(msg.toString())
      //       }
      //     }
      //   }
      // })

      // lis upload
      // this.EventBus.$on('UPLOAD_LIS', function(params) {
      //   self.uploadLis()
      // })

      // lis upload skmc
      // this.EventBus.$on('UPLOAD_LIS_SKMC', function(params) {
        // self.uploadLis()
        // console.log(params)
      // })

      // update comment [
      this.EventBus.$on(Constant.UPDATE_RBC_COMMENT, function(params) {
        self.selectedItem.RBC_COMMENT = params
      })
      this.EventBus.$on(Constant.UPDATE_WBC_COMMENT, function(params) {
        self.selectedItem.WBC_COMMENT = params
      })
      // update comment ]

      // wbc classification
      this.EventBus.$on('WBC_CLASSIFICATION_LOADED', function(params) {
        console.log(params)
        self.wbcTotalCount = 0
        self.wbcClassList = params

        self.wbcClassList.forEach(function (item, index) {
          if (item.title !== 'NR' && item.title !== 'GP' &&
              item.title !== 'PA' && item.title !== 'MA' && item.title !== 'AR') {
            self.wbcTotalCount += Number(item.count)
          }
        })

        self.wbcClassList.sort(function(a, b) {
          return a.order - b.order
        })
        self.drawWbcImages()

        self.EventBus.$emit('WBC_CLASSIFICATION_REPORT_LOADED', params)
      })

      // bm classification
      this.EventBus.$on('BM_CLASSIFICATION_LOADED', function(params) {
        console.log(params)
        var mTotal = 0
        var eTotal = 0

        self.bmCellTotalCount = 0
        self.bmClassList = params
        self.bmClassList.forEach(function (item, index) {
          if (item.title !== 'MC' && item.title !== 'OT') {
            self.bmCellTotalCount += Number(item.count)
          }

          if (item.title === 'BL' || item.title === 'PR' || item.title === 'MY' ||
              item.title === 'ME' || item.title === 'NS' || item.title === 'NB' ||
              item.title === 'EO' || item.title === 'BA') {
            mTotal += item.count
          } else if (item.title === 'PE' || item.title === 'BN' || item.title === 'PN' ||
                     item.title === 'ON') {
            eTotal += item.count
          }
        })

        self.meRatio = (mTotal / eTotal).toFixed(2)

        self.bmClassList.sort(function(a, b) {
          return a.order - b.order
        })
        self.EventBus.$emit('BM_CLASSIFICATION_REPORT_LOADED', params)
      })
    },
    methods: {
      drawWbcImages () {
        console.log('drawWbcImages')
      },
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

          } else {

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
      onClickLisUpload () {
        // var self = this
        //
        // if (self.siteCd === '0007') {
        //   self.$modal.show(ModalSkmcMorphology, {}, {
        //     height: 'auto',
        //     width: '800px'
        //   })
        // } else {
        //   self.$modal.show(ModalConfirm, {openType: 'lisUpload', message: Constant.IDS_MSG_UPLOAD_LIS}, {
        //     height: 'auto',
        //     width: '350px'
        //   })
        // }
        this.EventBus.$emit('ON_CLICK_LIS', null)
      },
      uploadLis () {
        var self = this

        console.log('uploadlis')
        console.log(self.selectedItem)
        console.log(self.currentUser)
        console.log(self.siteCd)

        self.EventBus.$emit('OVERLAY', {state: true})

        if (self.siteCd === '0002') {
          var codeList = self.$store.getters.CbcWbcTestCdList_0002
          console.log(codeList)

          // cbc 결과 조회
          api.getCdcResults_0002(self.selectedItem.BARCODE_NO).then(function(result) {
            var xml = result.data
            var json = JSON.parse(convert.xml2json(xml, {compact: true}))
            var cbcWorkList = json.root.spcworklist.worklist

            console.log('-cbc work list start-')
            console.log(cbcWorkList)
            console.log('-cbc work list end-')

            // 5 diff (NE, NS, NB, LY, MO, EO, BA)
            // var fiveDiffWorkList = cbcWorkList.filter(function(item) {
            //   return (item.testcd._cdata === 'LHR10501' || item.testcd._cdata === 'LHR10502' ||
            //           item.testcd._cdata === 'LHR10503' || item.testcd._cdata === 'LHR10504' ||
            //           item.testcd._cdata === 'LHR10505' || item.testcd._cdata === 'LHR10506')
            // })

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
            self.wbcClassList.forEach(function(wbcItem) {
              wbcItem.testCd = ''

              codeList.forEach(function(code) {
                if (wbcItem.id === code.id) {
                  wbcItem.testCd = code.cd
                }
              })
            })

            var wbcTemp = []

            // five diff push
            self.wbcClassList.forEach (function(wbcItem) {
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
                  barcodeNo: self.selectedItem.BARCODE_NO,
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
      checkUserAuth(empNo) {
        return new Promise((succ, fail) => {
          console.log('checkUserAuth')
          console.log(Configs.BUCKET_NAME)

          if (this.siteCd === '0002') {
            api.checkUserAuth_0002(empNo).then(function(result) {
              console.log(result)
              var xml = result.data
              var json = JSON.parse(convert.xml2json(xml, {compact: true}))
              console.log(json)
              var userNm = json.root.getUsernm.usernm._text

              console.log(json.root.getUsernm.usernm._text)
              if (userNm === null || userNm === '') {
                succ('fail')
              } else {
                succ('succ')
              }

            }).catch(function (err) {
              console.log('checkUserAuth :' + err.message)
              fail(new Error(err.message))
            })
          }
        })
      },
      getPercent (count) {
        return ((Number(count) / this.bmCellTotalCount) * 100).toFixed(0)
      },
      onClickPrint () {
        console.log(this.bmClassList)
        var classResult = null
        var rbcInfo = null
        var totalCount = 0

        if (this.selectedItem.ANALYSIS_TYPE === '01') {
          classResult = this.wbcClassList
          rbcInfo = this.rbcClassList
          totalCount = this.wbcTotalCount
        } else {
          classResult = this.bmClassList
          rbcInfo = null
          totalCount = this.bmCellTotalCount
        }

        var html = this.$makePrintHtml(this.selectedItem, classResult, rbcInfo, totalCount)
        this.$modal.show(ModalPrint, {item: html}, {
          width: '900',
          height: 'auto',
          scrollable: true
        })
      }
    }
  }
</script>
<style>
  #reportCard {
    background-color: #282828 !important;
    padding: 3px 10px 3px 10px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px black;
    border: 1px solid #303744;
    height: 862px;
  }
  .reportStyleBm {
    width: 70%;
    height: 100%;
    border: 1px solid gray;
    padding: 10px 20px 10px 20px;
    margin: 0 auto;
  }
  .reportStyle {
    width: 90%;
    height: 100%;
    border: 1px solid gray;
    padding: 10px 20px 10px 20px;
    margin: 0 auto;
  }
</style>
