<template>
  <b-container id="resultPage" class="pl-2 pt-2 pb-2" fluid>
    <b-row>
      <b-col id="resultCard" class="pr-1" cols="10">
        <div>
          <b-row class="mt-2 mb-2">
            <b-col cols="1" class="pr-3 text-right pr-1">
              <img src="~@/assets/result/search.png" />
            </b-col>
            <b-col cols="1" class="p-0">
              <b-form-select v-model="sSelected" :options="searchOptions.searchType" size="sm" @change="onChangeSelectBox"></b-form-select>
            </b-col>
            <b-col cols="1" class="p-0">
              <b-form-input id="inputSearch" v-bind:class="{disabledColor : sSelected == '01'}" v-model="searchText" size="sm" disabled style="border: none !important;"></b-form-input>
            </b-col>
            <b-col cols="2">
              <b-form-datepicker
                id="startDate"
                size="sm"
                v-model="startDate"
                placeholder="Start date"
                :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
              ></b-form-datepicker>
            </b-col>
            <span class="mt-1">~</span>
            <b-col cols="2">
              <b-form-datepicker
                id="endDate"
                size="sm"
                v-model="endDate"
                placeholder="End date"
                :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
              ></b-form-datepicker>
            </b-col>
            <b-col cols="1">
              <b-row>
                <b-col>
                  <button type="button" id="btnSearch" class="btn btn-outline-light" @click="onSearch">Search</button>
                </b-col>
                <b-col class="pl-4">
                  <button type="button" id="btnClear" class="btn btn-outline-light" @click="onClearOption()">Clear</button>
                </b-col>
              </b-row>
            </b-col>
            <!-- <b-col class="text-right">
              <button type="button" id="btnClassification" class="btn btn-outline-light" @click="onClassification">Classification</button>
            </b-col> -->
            <b-col>
              <img class="pointer ml-2" src="~@/assets/result/excel.png" @click="onDownloadData('database')" style="width: 30px;"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col v-if="selectItem.ANALYSIS_TYPE === '01'" class="pb-1 pl-4">
              <b-form-group>
                <b-form-checkbox-group
                  id="filterClassGroup"
                  v-model="wbcClassList"
                  :options="wbcOptions"
                  name="filterClassGroup"
                ></b-form-checkbox-group>
              </b-form-group>
            </b-col>
            <b-col v-else class="pb-1 pl-4">
              <b-form-group>
                <b-form-checkbox-group
                  id="filterClassGroup"
                  v-model="wbcClassList"
                  :options="bmCellOptions"
                  name="filterClassGroup"
                ></b-form-checkbox-group>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
        <b-card class="blackCard" text-variant="white" no-body style="height: 843px;">
          <div>
            <b-row>
              <b-col>
                <div id="tableResultList" style="overflow-y: scroll;">
                  <table width="100%">
                    <thead v-columns-resizable>
                      <tr>
                        <th width="3%">No.</th>
                        <th width="3%">
                          <b-form-checkbox
                            id="selectAll"
                            v-model="isSelectAll"
                            name="selectAll"
                            value="Y"
                            unchecked-value="N"
                            @change="onChangeAll"
                          >
                          </b-form-checkbox>
                        </th>
                        <!-- <th width="6%">Work list</th> -->
                        <th width="6%">BM No.</th>
                        <th width="6%">Tray slot</th>
                        <th width="9%">Patient ID</th>
                        <th width="8%">Name</th>
                        <th width="4%">Age</th>
                        <th width="5%">Gender</th>
                        <th width="7%">Department</th>
                        <th width="8%">Bm sampling site</th>
                        <th width="8%">Cell count</th>
                        <th width="8%">Stitch count</th>
                        <th width="8%">Scan type</th>
                        <th width="8%">Stain type</th>
                        <th width="5%">State</th>
                        <th width="10%">Analyzed date</th>
                        <th width="6%">Signed state</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        tabindex="0"
                        :id="item.ORDER_ID"
                        class="pointer"
                        v-for="(item, index) in dspTestList"
                        @keyup="onKeyup($event, item)"
                        :key="index"
                        >
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          {{ index + 1}}
                          <b-icon v-if="item.IS_NORMAL === 'N'"
                            icon="exclamation-circle-fill"
                            variant="danger"
                            :id="'abnormalTarget_' + index">
                          </b-icon>
                          <b-popover :target="'abnormalTarget_' + index" triggers="hover" placement="right">
                            <b-row v-for="(abItem, index) in item.ABNORMAL" :key="index">
                              <b-col>
                                {{abItem}}
                              </b-col>
                            </b-row>
                          </b-popover>

                          <!--is checked-->
                          <span v-if="item.IS_CHECKED" style="float:right">
                            <b-icon v-if="item.SIGNED_STATE !== 'Submit'" 
                              icon="check-circle" variant="success"></b-icon>
                            <b-icon v-else icon="check-circle" variant="primary"></b-icon>
                          </span>

                        </td>
                        <td>
                          <b-form-checkbox
                            v-model="item.isSelected"
                            value="Y"
                            unchecked-value="N">
                          </b-form-checkbox>
                        </td>
                        <!-- <td
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <div v-if="checkWorkList(item.ORDER_ID) >= 0">Y</div>
                          <div v-else>N</div>
                        </td> -->
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          {{ item.BM_NO }}
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          {{ item.CASSET_NO }} - {{ item.SLOT_NO }}
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span> {{ item.PATIENT_ID }} </span>
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span> {{ item.PATIENT_NM }} </span>
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span>{{ item.AGE }}</span>
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span>{{ item.GENDER_NM }}</span>
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span> {{ item.DEPARTMENT }} </span>
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span> {{ item.BM_SAMPLING_SITE_NM }} </span>
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span> {{ item.MAX_WBC_COUNT }} </span>
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span> {{ item.STITCH_COUNT }} </span>
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span> {{ item.ANALYSIS_TYPE_NM }} </span>
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span> {{ item.STAIN_TYPE_NM }} </span>
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span> {{ item.STATE_CD_NM }} </span>
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span> {{ $stringToDateTime(item.ANALYZE_DTTM) }} </span>
                        </td>
                        <td v-bind:class="{ colorGray: item.SIGNED_STATE === 'Signed' }"
                          @click.left="onFocusRow(item)"
                          @click.right="onFocusRow(item)"
                          @dblclick="onDbClick(item)"
                          @contextmenu.prevent="$refs.ctxMenu.open">
                          <span> {{ item.SIGNED_STATE }} </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <infinite-loading @infinite="infiniteHandler" ref="infiniteLoading" spinner="waveDots"></infinite-loading>
                </div>
              </b-col>
            </b-row>
          </div>
        </b-card>
      </b-col>
      <b-col class="p-0">
        <div id="divSlideInformation" class="border p-3" style="border-radius: 5px; border-color: #4F4F4F !important;">
          <div id="slideInfoTitle" class="mb-2">Slide Information</div>
          <b-card v-if="selectItem !== null" class="blackCard" text-variant="white" no-body style="height: 35%; overflow-y: scroll;">
            <div>Order ID : {{ selectItem.ORDER_ID }}</div>
            <div>Ordered by known</div>
            <div>Date : {{ $stringToDateTime(selectItem.ORDER_DTTM) }}</div>
            <div>LIS status : data sent or received from LIS</div>
            <div>Type of slide : {{ selectItem.ANALYSIS_TYPE_NM }}</div>
            <div>Type of stain : {{ selectItem.STAIN_TYPE_NM }}</div></br>
            <div>Patient ID : {{ selectItem.PATIENT_ID }}</div>
            <div>Patient name : {{ selectItem.PATIENT_NM }}</div>
          </b-card>

          <div class="mt-2 mb-2">Classification Result</div>
          <b-card v-if="selectItem !== null" class="blackCard" text-variant="white" no-body style="height: 33%; overflow-y: scroll; overflow-x: hidden;">
            <div v-if="selectItem.ANALYSIS_TYPE === '01'">
              <b-row v-for="(wbcResult, index) in wbcClassificationResult" :key="index"
                v-if="wbcResult.title !== 'NR' && wbcResult.title !== 'GP' && wbcResult.title !== 'PA' && wbcResult.title !== 'AR'" style="font-size: 12px;">
                <b-col cols="5">
                  {{ wbcResult.name }}
                </b-col>
                <b-col class="text-right">
                  {{ wbcResult.count }}
                </b-col>
                <b-col class="text-right">
                  {{ wbcResult.percent }} %
                </b-col>
              </b-row>
              <b-row style="font-size: 12px;">
                <b-col cols="5">
                  Total
                </b-col>
                <b-col class="text-right">
                  {{ wbcTotalCount }}
                </b-col>
                <b-col class="text-right">
                  100.00 %
                </b-col>
              </b-row>
              <hr style="border-color: white;" />
              <b-row v-for="(wbcResult, index) in wbcClassificationResult" :key="index"
                v-if="wbcResult.title === 'NR' || wbcResult.title === 'GP' || wbcResult.title === 'PA' || wbcResult.title === 'AR'" style="font-size: 12px;">
                <b-col cols="5">
                  {{ wbcResult.name }}
                </b-col>
                <b-col class="text-right">
                  {{ wbcResult.count }} <span v-if="wbcResult.title === 'NR'"> / 100 WBC</span>
                </b-col>
                <b-col class="text-right">
                  -
                </b-col>
              </b-row>
            </div>
            <div v-else>
              <b-row v-if="bmResult.title !== 'NR' && bmResult.title !== 'MK' && bmResult.title !== 'HH' && bmResult.title !== 'OT' && bmResult.title !== 'MC'"
                v-for="(bmResult, index) in bmClassificationResult" :key="index" style="font-size: 12px;">
                <b-col cols="5">
                  {{ bmResult.name }}
                </b-col>
                <b-col class="text-right">
                  {{ bmResult.count }}
                </b-col>
                <b-col class="text-right">
                  {{ bmResult.percent }} %
                </b-col>
              </b-row>
              <b-row style="font-size: 12px;">
                <b-col cols="5">
                  Total
                </b-col>
                <b-col class="text-right">
                  {{ bmCellTotalCount }}
                </b-col>
                <b-col class="text-right">
                  100.00 %
                </b-col>
              </b-row>
              <hr style="border-color: white;" />
              <b-row v-for="(bmResult, index) in bmClassificationResult" :key="index"
                v-if="bmResult.title === 'NR' || bmResult.title === 'MK' || bmResult.title === 'HH' || bmResult.title === 'OT' || bmResult.title === 'MC'"
                style="font-size: 12px;">
                <b-col cols="5">
                  {{ bmResult.name }}
                </b-col>
                <b-col class="text-right">
                  {{ bmResult.count }} <span v-if="bmResult.title === 'NR'"> / 100 WBC</span>
                </b-col>
                <b-col class="text-right">
                  -
                </b-col>
              </b-row>
            </div>
          </b-card>

          <div id="analysisTitle" class="mt-2 mb-2">Analysis Slide</div>
          <b-card v-if="selectItem !== null" class="blackCard text-center" text-variant="white" no-body>
            <img class="barcode p-1" v-for="(image, index) in barcodeImages" :src="image" :key="index"  />
          </b-card>
        </div>
      </b-col>
    </b-row>
    <context-menu id="context-menu" ref="ctxMenu">
      <li id="menuOptions" @click="onClickClass(item)" v-for="(item, index) in contextMenuItems" :key="index">
        <div class="p-2">
          <div>{{ item }}</div>
        </div>
      </li>
    </context-menu>
  </b-container>
</template>
<script>

  import ModalEditOrder from '../Common/ModalEditOrder.vue'
  import { mapGetters } from 'vuex'
  import Constant from '../../../Constant'
  import ModalInfo from '../Common/ModalInfo'
  import ModalPrint from '../Common/ModalPrint'
  import ModalConfirm from '../Common/ModalConfirm'
  import contextMenu from 'vue-context-menu'
  import XLSX from 'xlsx'
  import api from '@/service'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const path = require('path')

  export default {
    name: 'result-page',
    components: { contextMenu, XLSX },
    computed: {
      ...mapGetters({
        searchOptions: Constant.GET_SEARCH_OPTIONS,
        settings: Constant.GET_SETTINGS,
        // testHistoryList: Constant.GET_TEST_HISTORY_LIST,
        commonCode: Constant.GET_COMMON_CODE,
        commonCodeList: Constant.GET_COMMON_CODE_LIST,
        // workList: Constant.GET_WORK_LIST,
        getClassificationItem: Constant.GET_CLASSIFICATION_ITEM,
        bmClassList: Constant.GET_BM_CELL,
        getWbcClassList: Constant.GET_WBC_CLASS_LIST
      })
    },
    data () {
      return {
        limit: 0,
        MAX_LOAD_SIZE: 25,
        isSelectAll: 'N',
        selectItem: {},
        searchText: '',
        dspTestList: [],
        searchList: [],
        sSelected: '01',
        startDate: '',
        endDate: '',
        signedStateCd: '',
        barcodeImages: [],
        filterExp: /^.png|.jpg|.bmp$/,
	      filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        // contextMenuItems: ['Print', 'Classification', 'Edit order data', 'Add to worklist', 'Delete', 'export XLSX'],
        contextMenuItems: ['Print', 'Classification', 'Edit order data', 'Delete', 'export XLSX'],
        scrollCnt: 0,
        bmClassificationResult: [],
        bmCellTotalCount: 0,
        wbcClassificationResult: [],
        wbcTotalCount: 0,
        rbcInfo: [],
        wbcClassList: [],
        wbcCustomClass: [],
        infiniteState: null,
        wbcOptions: [
          { text: 'NE', value: '01' },
          { text: 'NS', value: '71' },
          { text: 'NB', value: '72' },
          { text: 'ME', value: '02' },
          { text: 'MY', value: '03' },
          { text: 'PR', value: '04' },
          { text: 'LY', value: '05' },
          { text: 'LR', value: '61' },
          { text: 'LA', value: '62' },
          { text: 'MO', value: '07' },
          { text: 'EO', value: '08' },
          { text: 'BA', value: '09' },
          { text: 'BL', value: '10' },
          { text: 'PC', value: '11' },
          { text: 'NR', value: '12' },
          { text: 'GP', value: '13' },
          { text: 'PA', value: '14' },
          { text: 'MA', value: '16' },
          { text: 'AR', value: '15' }
        ],
        bmCellOptions: [
          { text: 'NE', value: '01' },
          { text: 'NS', value: '71' },
          { text: 'NB', value: '72' },
          { text: 'ME', value: '02' },
          { text: 'MY', value: '03' },
          { text: 'PR', value: '04' },
          { text: 'LY', value: '05' },
          { text: 'LA', value: '06' },
          { text: 'MO', value: '07' },
          { text: 'EO', value: '08' },
          { text: 'BA', value: '09' },
          { text: 'BL', value: '10' },
          { text: 'PC', value: '11' },
          { text: 'ON', value: '12' },
          { text: 'PN', value: '13' },
          { text: 'BN', value: '14' },
          { text: 'PE', value: '15' },
          { text: 'HC', value: '16' },
          { text: 'OT', value: '17' }
          // { text: 'MC', value: '17' }
        ]
      }
    },
    beforeDestroy () {
      this.EventBus.$off('EDIT_OK')
      this.EventBus.$off(Constant.DELETE_TEST_HISTORY)
      this.EventBus.$off(Constant.DELETE_TEST_HISTORY_ONE)

      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY_LIST)
      ipcRenderer.removeAllListeners(Constant.ALL_TEST_HISTORY_LIST)
      ipcRenderer.removeAllListeners(Constant.GET_RBC_COUNT)
      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_CUSTOM_CLASS)
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY_PREV)
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY_NEXT)

      ipcRenderer.removeAllListeners('selected-dir')
    },
    mounted () {
      var self = this

      console.log(this.workList)
      console.log(self.getClassificationItem)

      this.sSelected = this.searchOptions.searchTypeCd
      this.searchText = this.searchOptions.searchText
      this.startDate = this.searchOptions.startDate
      this.endDate = this.searchOptions.endDate
      this.wbcClassList = this.searchOptions.wbcClassList

      // 콘솔 찍으려고 임시
      ipcRenderer.on(Constant.UPDATE_CHECKED_CELL, function (event, results) {
        console.log(results)
        // (2) ["Y", "20230918172821_01_0013,5.79"]
      })

      
      // 셀렉트 박스 on/off
      this.onChangeSelectBox()

      ipcRenderer.send(Constant.SELECT_WBC_CUSTOM_CLASS)

      // custom class
      ipcRenderer.on(Constant.SELECT_WBC_CUSTOM_CLASS, function (event, results) {
        console.log(results)
        self.wbcCustomClass = results
      })

      // 주문내역 조회
      ipcRenderer.on(Constant.GET_TEST_HISTORY_LIST, function (event, result) {
        setTimeout(function() {
          var loadSize = self.MAX_LOAD_SIZE

          // normal 체크 조회시 하도록 수정
          result.forEach(function(slide) {
            if (slide.ANALYSIS_TYPE === '01') {
              var obj = self.$checkPbNormalCell(JSON.parse(slide.WBC_INFO))
              slide.IS_NORMAL = obj.isNormal
              slide.ABNORMAL = obj.class
            }
          })

          console.log(result)

          if (self.isBarcodeScan) {
            self.isBarcodeScan = false

            $state.complete()
            self.onSearch()
          } else {
            if (result.length > 0) {
              self.scrollCnt++
              self.dspTestList = self.dspTestList.concat(result)
              if (result.length > loadSize) {
                self.limit = result.length
              } else {
                self.limit += loadSize
              }

              self.infiniteState.loaded()
            } else {
              self.infiniteState.complete()
            }
          }

          console.log(self.limit)
          // 이전 선택한 항목 포커싱
          self.$nextTick(function() {
            self.dspTestList.forEach(function(item, index) {
              item.isSelected = 'N'
            })

            console.log(self.getClassificationItem)
            if (self.getClassificationItem.item !== null) {
              var row = document.getElementById(self.getClassificationItem.item.ORDER_ID)

              if (row !== null) {
                self.onFocusRow(self.getClassificationItem.item)
                row.focus()
              } else {
                // 검색 후 이전 선택한 항목 존재 하지 않으면 첫번째 row 포커스함
                if (self.dspTestList.length > 0) {
                  self.onFocusRow(self.dspTestList[0])
                  var firstRow = document.getElementById(self.dspTestList[0].ORDER_ID)
                  if (firstRow) {
                    firstRow.focus()
                  }
                }
              }
            } else {
              // 검색 후 이전 선택한 항목 존재 하지 않으면 첫번째 row 포커스함
              if (self.dspTestList.length > 0) {
                self.onFocusRow(self.dspTestList[0])
                var firstRow = document.getElementById(self.dspTestList[0].ORDER_ID)
                if (firstRow) {
                  firstRow.focus()
                }
              }
            }
          })
        }, 500)
      })

      // 전체 이력 조회 (max : 500)
      ipcRenderer.on(Constant.ALL_TEST_HISTORY_LIST, function (event, results) {
        console.log(results)
        var database = []
        self.onDownloadXlsx(self.resultPath, results, self.$getFileNameDateTime() + '_resultData.xlsx')

        self.$toasted.show(Constant.IDS_DOWNLOAD_COMPLETE, {
          position: 'bottom-center',
          duration: '2000'
        })

        self.EventBus.$emit('OVERLAY', {state: false})
      })

      // RBC Count
      ipcRenderer.on(Constant.GET_RBC_COUNT, function (event, result) {
        self.rbcInfo = result
      })

      ipcRenderer.on('selected-dir', function (event, results) {
        self.EventBus.$emit('OVERLAY', {state: true})

        console.log(results)
        self.resultPath = self.$replaceAll(results.path, '\\', '/')
        if (results.pathType === 'database') {
          ipcRenderer.send(Constant.ALL_TEST_HISTORY_LIST, JSON.stringify({
            limit: 0,
            searchType: self.sSelected,
            searchText: self.searchText.replace(/ /g, ''),
            startDate: self.startDate,
            endDate: self.endDate,
            wbcClassList: self.wbcClassList,
            jsonList: []
          }))
        } else if (results.pathType === 'exportXlsx') {
          var jsonList = self.dspTestList.filter(function(item, index) {
            return item.isSelected === 'Y'
          })

          console.log(jsonList)
          console.log(self.dspTestList)

          ipcRenderer.send(Constant.ALL_TEST_HISTORY_LIST, JSON.stringify({
            limit: 0,
            searchType: self.sSelected,
            searchText: self.searchText.replace(/ /g, ''),
            startDate: self.startDate,
            endDate: self.endDate,
            wbcClassList: self.wbcClassList,
            jsonList: jsonList
          }))
        }
      })

      this.EventBus.$on('EDIT_OK', function(params) {
        self.EventBus.$emit('OVERLAY', {state: true})
        setTimeout(function() {
          self.limit = 0
          self.dspTestList = []
          self.$refs.infiniteLoading.stateChanger.reset()
          self.EventBus.$emit('OVERLAY', {state: false})
        }, 500)
      })

      this.EventBus.$on(Constant.DELETE_TEST_HISTORY_ONE, function(params) {
        console.log(params)
        console.log(self.dspTestList)
        var pathArr = params.split('/')
        var slotId = pathArr[pathArr.length - 1]
        console.log(slotId)

        var items = []
        for (var i = 0; i < self.dspTestList.length; i++) {
          if (self.dspTestList[i].SLOT_ID === slotId) {
            items.push(self.dspTestList[i])
          }
        }

        ipcRenderer.send(Constant.DELETE_TEST_HISTORY, JSON.stringify(items))
        self.limit = 0
        self.dspTestList = []
        self.$store.dispatch(Constant.SET_CLASSIFICATION_ITEM, { item: null, limit: 0 })
        self.selectItem = {}
        self.$refs.infiniteLoading.stateChanger.reset()
      })

      this.EventBus.$on(Constant.DELETE_TEST_HISTORY, function(params) {
        var items = []
        for (var i = 0; i < self.dspTestList.length; i++) {
          if (self.dspTestList[i].isSelected === 'Y') {
            items.push(self.dspTestList[i])
          }
        }

        console.log(items)

        // 2020_09_17_LBK : 디렉터리 삭제
        for (var i = 0; i < items.length; i++) {
          var path = self.settings.pbiaRootPath + '/' + items[i].SLOT_ID
          self.deleteDirectory(path)
        }

        ipcRenderer.send(Constant.DELETE_TEST_HISTORY, JSON.stringify(items))
        self.limit = 0
        self.dspTestList = []
        self.$store.dispatch(Constant.SET_CLASSIFICATION_ITEM, { item: null, limit: 0 })
        self.selectItem = {}
        self.$refs.infiniteLoading.stateChanger.reset()
      })

      ipcRenderer.on(Constant.GET_TEST_HISTORY_PREV, function (event, results) {
        console.log(results)
        if (results !== null) {
          self.onFocusRow(results)
        }

        self.EventBus.$emit('OVERLAY', {state: false})
      })

      ipcRenderer.on(Constant.GET_TEST_HISTORY_NEXT, function (event, results) {
        console.log(results)
        if (results !== null) {
          self.onFocusRow(results)
        }

        self.EventBus.$emit('OVERLAY', {state: false})
      })
    },
    methods: {
      onKeyup (evt, item) {
        console.log('onKeyup')
        console.log(evt)
        console.log(item)
        console.log(this.getClassificationItem)

        if (evt.key === 'ArrowDown') {
          console.log('down')
          this.EventBus.$emit('OVERLAY', {state: true})

          ipcRenderer.send(Constant.GET_TEST_HISTORY_NEXT, JSON.stringify({
            limit: 0,
            size: this.getClassificationItem.limit,
            searchType: this.searchOptions.searchTypeCd,
            searchText: this.searchOptions.searchText,
            startDate: this.searchOptions.startDate,
            endDate: this.searchOptions.endDate,
            wbcClassList: this.searchOptions.wbcClassList,
            orderId: this.selectItem.ORDER_ID
          }))

        } else if (evt.key === 'ArrowUp') {
          console.log('up')
          this.EventBus.$emit('OVERLAY', {state: true})

          ipcRenderer.send(Constant.GET_TEST_HISTORY_PREV, JSON.stringify({
            limit: 0,
            size: this.getClassificationItem.limit,
            searchType: this.searchOptions.searchTypeCd,
            searchText: this.searchOptions.searchText,
            startDate: this.searchOptions.startDate,
            endDate: this.searchOptions.endDate,
            wbcClassList: this.searchOptions.wbcClassList,
            orderId: this.selectItem.ORDER_ID
          }))

        }
      },
      createDirs (path) {
        var self = this

        console.log('createDirs')
        console.log(path)
        var dirList = null

        fs.readdir(path, function(err, file) {
          if (!err) {
            dirList = file.filter(function(item) {
              return (item.indexOf('.') < 0)
            })

            console.log(dirList)

            // 현재 생성되어 있는 커스텀 dir
            var customDir = dirList.filter(function(item) {
              return (item.includes('90') || item.includes('91') ||
                      item.includes('92') || item.includes('93') || item.includes('94'))
            })

            var rmList = []

            customDir.forEach(function(item) {
              var list = self.wbcCustomClass.filter(function(mkItem) {
                var id = item.split('_')[0]
                return (id === mkItem.CLASS_ID)
              })

              if (list.length <= 0) {
                rmList.push(item)
              }
            })

            console.log(rmList)

            // delete
            rmList.forEach(function(item) {
              self.deleteDirectory(path + '/' + item)
            })

            // create
            self.wbcCustomClass.forEach(function(mkItem) {
              var updateList = customDir.filter(function(customItem) {
                var id = customItem.split('_')[0]
                return (mkItem.CLASS_ID === id)
              })

              try {
                if (updateList.length > 0) {
                  // update
                  updateList.forEach(function(item) {
                    fs.rename(path + '/' + item, path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE, function(err) {
                      if (!err) {
                        console.log('update : ' + path + '/' + item + ' to ' + path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE)
                      } else {
                        console.log('update error : ' + err.message)
                      }
                    })
                  })
                } else {
                  // create
                  if (mkItem.CLASS_TITLE !== '') {
                    fs.access(path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE, function(err) {
                      // 폴더 없으면 생성
                      if (err) {
                        fs.mkdir(path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE, {recursive: true}, function(err) {
                          if (!err) {
                            console.log('mkdir : ' + path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE)
                          } else {
                            console.log('mkdir : error ' + err.message)
                          }
                        })
                        // fs.mkdirSync(path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE)
                      }
                    })
                    // if (!fs.existsSync(path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE)) {
                    //   fs.mkdirSync(path + '/' + mkItem.CLASS_ID + '_' + mkItem.CLASS_TITLE)
                    // }
                  }
                }
              } catch (err) {
                console.log(err.message)
              }
            })
          }
        })
      },
      onClearOption () {
        console.log('onClearOption')
        this.sSelected = '01'
        this.searchText = ''
        this.startDate = ''
        this.endDate = ''
        this.wbcClassList = []

        this.updateSearchOption()
        this.$store.dispatch(Constant.INIT_WORK_LIST)
      },
      updateSearchOption () {
        var obj = {
          searchTypeCd: this.sSelected,
          searchText: this.searchText,
          startDate: this.startDate,
          endDate: this.endDate,
          wbcClassList: this.wbcClassList
        }

        console.log(obj)
        this.$store.dispatch(Constant.UPDATE_SEARCH_OPTIONS, obj)
      },
      // 2020_09_17_LBK : 디렉터리 삭제
      deleteDirectory (path) {
        var self = this

        // 파일 or 폴더 존재 여부 체크
        fs.access(path, fs.constants.F_OK, function(err) {
          if (!err) {
            fs.readdir(path, function(err, files) {
              if (!err) {
                files.forEach(function(file, index) {
                  var curPath = path + "/" + file
                  fs.lstat(curPath, function(err, stats) {
                    if (!err) {
                      if (stats.isDirectory()) {
                        self.deleteDirectory(curPath)
                      } else {
                        // 파일 삭제
                        fs.unlink(curPath, (err) => {
                          if (err) {
                            console.log('delete : ' + curPath)
                          } else {
                            console.log('delete error : ' + curPath)
                          }
                        })
                      }
                    } else {
                      self.$toasted.show(err.message, {
                        position: 'bottom-center',
                        duration: '2000'
                      })
                    }
                  })
                })
              } else {
                self.$toasted.show(err.message, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              }
            })
          } else {
            self.$toasted.show(err.message, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
        })

        // 파일 or 폴더 존재 여부 체크
        // if (fs.existsSync(path)) {
        //   // 디렉터리 내부 순회
        //   fs.readdirSync(path).forEach(function(file, index) {
        //     var curPath = path + "/" + file
        //     if (fs.lstatSync(curPath).isDirectory()) {
        //       self.deleteDirectory(curPath)
        //     } else {
        //       // 파일 삭제
        //       fs.unlinkSync(curPath)
        //     }
        //   })
        //   // 폴더 삭제
        //   fs.rmdirSync(path)
        // }
      },
      onSearch () {
        console.log('search-----------------------')
        // 입력 날짜 체크 [
        if (this.startDate !== '') {
          if (this.endDate === '') {
            this.$toasted.show(Constant.IDS_PLEASE_ENTER_END_DATE, {
              position: 'bottom-center',
              duration: '2000'
            })

            return
          }
        }

        if (this.endDate !== '') {
          if (this.startDate === '') {
            this.$toasted.show(Constant.IDS_PLEASE_ENTER_START_DATE, {
              position: 'bottom-center',
              duration: '2000'
            })

            return
          }
        }
        // 입력 날짜 체크 ]

        // 연속 검색시 중복데이터 load 오류 수정 (!isShowSpinner)
        if (!this.$refs.infiniteLoading.isShowSpinner) {
          this.limit = 0
          this.dspTestList = []
          this.$refs.infiniteLoading.stateChanger.reset()

          this.updateSearchOption()
        }
      },
      onClassification (evt) {
        if (this.workList.length <= 0) {
          this.$toasted.show(Constant.IDS_ERROR_ADD_A_WORKLIST, {
            position: 'bottom-center',
            duration: '2000'
          })
        } else {
          this.EventBus.$emit('CHANGE_TAB', {id: 5})
        }
      },
      onFocusRow (item) {
        var self = this

        console.log(item)
        console.log(self.getClassificationItem)
        console.log(self.limit)

        self.selectItem = item
        self.barcodeImages = []
        self.$store.dispatch(Constant.SET_CLASSIFICATION_ITEM, { item: item, limit: self.limit })

        console.log("💦💦💦💦💦")
        console.log("💦💦💦💦💦")
        console.log("💦💦💦💦💦")
        console.log(item)
        console.log("💦💦💦💦💦")
        console.log("💦💦💦💦💦")
        console.log("💦💦💦💦💦")


        ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({orderId: item.ORDER_ID}))

        try {
          var barcodePath = null
          var rootPath = self.settings.pbiaRootPath + '/' + item.SLOT_ID

          // load barcode
          fs.readdir(rootPath + '/' + self.settings.barcodeDirNm, function(err, barcodes) {
            if (!err) {
              var barCodeImages = barcodes.filter(function(file) {
                return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
              })

              barcodePath = rootPath + '/' + self.settings.barcodeDirNm + '/' + barCodeImages[0]

              self.barcodeImages.push('file://' + barcodePath)

            } else {
              self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                position: 'bottom-center',
                duration: '2000'
              })
            }
          })

          // PB
          if (self.selectItem.ANALYSIS_TYPE === '01') {
            var wbcPath = rootPath + '/' + self.settings.wbcClassificationDirNm

            // create folder
            self.createDirs(wbcPath)

            var classList = self.getWbcClassList(self.selectItem.IS_NS_NB_INTEGRATION)

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
              classDir: wbcPath,
              selectItem: self.selectItem
            }

            console.log(params)

            api.getWbcFiles(params)
            .then(function (res) {
              console.log(res)

              self.wbcImages = res.wbcImages
              self.wbcTotalCount = res.imgCount
              self.wbcClassificationResult = res.classificationResult
              self.wbcClassificationResult.sort(function(a, b) {
                return a.order - b.order
              })

              var params = {
                classificationResult: self.wbcClassificationResult,
                imgCount: self.wbcTotalCount
              }

              api.getWbcClassification(params)
              .then(function (res) {
                console.log(res)

              }).catch(function (err) {
                console.log(err.message)

                self.$toasted.show(err.message, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              })
            }).catch(function (err) {
              console.log(err.message)

              self.$toasted.show(err.message, {
                position: 'bottom-center',
                duration: '2000'
              })
            })
          } else {
            var bmPath = rootPath + '/' + self.settings.bmClassificationDirNm

            // bm file load
            var params = {
              classList: self.bmClassList,
              classDir: bmPath,
              selectItem: self.selectItem
            }

            console.log(params)

            api.getBmFiles(params)
            .then(function (res) {
              console.log(res)

              // self.bmImages = res.bmImages
              self.bmCellTotalCount = res.imgCount
              self.bmClassificationResult = res.classificationResult
              self.bmClassificationResult.sort(function(a, b) {
                return a.order - b.order
              })

              var params = {
                classificationResult: self.bmClassificationResult,
                imgCount: self.bmCellTotalCount
              }

              console.log(params)

              api.getBmClassification(params)
              .then(function (res) {
                console.log(res)

              }).catch(function (err) {
                console.log(err.message)

                self.$toasted.show(err.message, {
                  position: 'bottom-center',
                  duration: '2000'
                })
              })
            }).catch(function (err) {
              console.log(err.message)

              self.$toasted.show(err.message, {
                position: 'bottom-center',
                duration: '2000'
              })
            })
          }


          // fs.readdir(rootPath, function(err, directories) {
          //   if (!err) {
          //     var directories = directories
          //
          //     directories.forEach(function(directory) {
          //       console.log(directory)
          //       console.log(self.settings.barcodeDirNm)
          //
          //
          //       if (directory.includes(self.settings.barcodeDirNm)) {
          //         fs.readdir(rootPath + '/' + directory, function(err, barcodes) {
          //           if (!err) {
          //             var barCodeImages = barcodes.filter(function(file) {
          //               return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
          //             })
          //
          //             barcodePath = rootPath + '/' + directory + '/' + barCodeImages[0]
          //
          //             self.barcodeImages.push('file://' + barcodePath)
          //
          //           } else {
          //             self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
          //               position: 'bottom-center',
          //               duration: '2000'
          //             })
          //           }
          //         })
          //       } else if (directory.includes(self.settings.bmClassificationDirNm)) {
          //         var bmPath = rootPath + '/' + directory
          //
          //         // bm file load
          //         var params = {
          //           classList: self.bmClassList,
          //           classDir: bmPath,
          //           selectItem: self.selectItem
          //         }
          //
          //         console.log(params)
          //
          //         api.getBmFiles(params)
          //         .then(function (res) {
          //           console.log(res)
          //
          //           // self.bmImages = res.bmImages
          //           self.bmCellTotalCount = res.imgCount
          //           self.bmClassificationResult = res.classificationResult
          //
          //           var params = {
          //             classificationResult: self.bmClassificationResult,
          //             imgCount: self.bmCellTotalCount
          //           }
          //
          //           api.getBmClassification(params)
          //           .then(function (res) {
          //             console.log(res)
          //
          //           }).catch(function (err) {
          //             console.log(err.message)
          //
          //             self.$toasted.show(err.message, {
          //               position: 'bottom-center',
          //               duration: '2000'
          //             })
          //           })
          //
          //         }).catch(function (err) {
          //           console.log(err.message)
          //
          //           self.$toasted.show(err.message, {
          //             position: 'bottom-center',
          //             duration: '2000'
          //           })
          //         })
          //       } else if (directory.includes(self.settings.wbcClassificationDirNm)) {
          //         var wbcPath = rootPath + '/' + directory
          //
          //         // create folder
          //         self.createDirs(wbcPath)
          //
          //         var classList = self.getWbcClassList(self.selectItem.IS_NS_NB_INTEGRATION)
          //
          //         // custom class append
          //         self.wbcCustomClass.forEach(function(wbcCustom) {
          //           if (wbcCustom.CLASS_TITLE !== '') {
          //             var obj = {
          //               count: 0,
          //               id: wbcCustom.CLASS_ID,
          //               key: '',
          //               name: wbcCustom.CLASS_NM,
          //               title: wbcCustom.CLASS_TITLE,
          //               order: Number(wbcCustom.CLASS_ID)
          //             }
          //             classList.push(obj)
          //           }
          //         })
          //
          //         // wbc file load
          //         var params = {
          //           classList: classList,
          //           classDir: wbcPath,
          //           selectItem: self.selectItem
          //         }
          //
          //         console.log(params)
          //
          //         api.getWbcFiles(params)
          //         .then(function (res) {
          //           console.log(res)
          //
          //           self.wbcImages = res.wbcImages
          //           self.wbcTotalCount = res.imgCount
          //           self.wbcClassificationResult = res.classificationResult
          //
          //           var params = {
          //             classificationResult: self.wbcClassificationResult,
          //             imgCount: self.wbcTotalCount
          //           }
          //
          //           api.getWbcClassification(params)
          //           .then(function (res) {
          //             console.log(res)
          //
          //           }).catch(function (err) {
          //             console.log(err.message)
          //
          //             self.$toasted.show(err.message, {
          //               position: 'bottom-center',
          //               duration: '2000'
          //             })
          //           })
          //
          //         }).catch(function (err) {
          //           console.log(err.message)
          //
          //           self.$toasted.show(err.message, {
          //             position: 'bottom-center',
          //             duration: '2000'
          //           })
          //         })
          //       }
          //     })
          //   } else {
          //     console.log(err.message)
          //   }
          // })

          if (document.getElementById(item.ORDER_ID) !== null) {
            for (var i = 0; i < this.dspTestList.length; i++) {
              document.getElementById(this.dspTestList[i].ORDER_ID).style.backgroundColor = ''
            }
            document.getElementById(item.ORDER_ID).style.backgroundColor = '#3F628C'
            document.getElementById(item.ORDER_ID).style.outline = '0'
          }
        } catch (err) {
          console.log(err.code)
          // 폴더 없으면 삭제
          // if (err.code === 'ENOENT') {
          //   self.$modal.show(ModalConfirm, {openType: Constant.DELETE_TEST_HISTORY_ONE, message: err.message +
          //     '<br /><br />' + Constant.IDS_MSG_DELETE_THE_SELECTED_ITEMS, item: rootPath}, {
          //     height: 'auto',
          //     width: '550px'
          //   })
          // } else {
          //   self.$modal.show(ModalInfo, {item: err.message}, {
          //     height: 'auto',
          //     width: '550px'
          //   })
          // }

          self.$modal.show(ModalInfo, {item: err.message}, {
            height: 'auto',
            width: '550px'
          })
        }
      },
      getPercent (count, totalCount) {
        return ((Number(count) / totalCount) * 100).toFixed(0)
      },
      onDbClick (item) {
        var self = this
        ipcRenderer.send(Constant.UPDATE_CHECKED_CELL, JSON.stringify({
          isChecked:"Y",
          slotId:self.selectItem.SLOT_ID
        }));

        this.$router.push({path: '/homePage/resultClassification/' + item.SLOT_ID})
      },
      onClickClass (item) {
        var items = []
        items = this.dspTestList.filter(function(item, index) {
          return item.isSelected === 'Y'
        })

        if (items.length <= 0 && (item === 'Delete' || item === 'export XLSX' || item === 'Add to worklist')) {
          this.$modal.show(ModalInfo, {item: Constant.IDS_ERROR_SELECT_A_TARGET_ITEM}, {
            height: 'auto',
            width: '550px'
          })

          return
        }

        if (item === 'Classification') {
          // this.$store.dispatch(Constant.SET_WORK_LIST, items)
          // this.EventBus.$emit('CHANGE_TAB', {id: 5})
          this.$router.push({path: '/homePage/resultClassification/' + this.selectItem.SLOT_ID})

        } else if (item === 'Delete') {
          this.$modal.show(ModalConfirm, {openType: Constant.DELETE_TEST_HISTORY, message: Constant.IDS_MSG_DELETE_THE_SELECTED_ITEMS}, {
            height: 'auto',
            width: '350px'
          })
        } else if (item === 'Add to worklist') {
          var isSaveWorkList = false

          for (var i = 0; i < this.workList.length; i++) {
            for (var j = 0; j < items.length; j++) {
              if (this.workList[i].ORDER_ID === items[j].ORDER_ID) {
                isSaveWorkList = true
                break
              }
            }
          }

          if (isSaveWorkList) {
            this.$modal.show(ModalInfo, {item: Constant.IDS_ERROR_ALREADY_ADDED}, {
              height: 'auto',
              width: '550px'
            })

            return

          } else {
            this.$store.dispatch(Constant.ADD_WORK_LIST, items)

            this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
              position: 'bottom-center',
              duration: '2000'
            })
          }
        } else if (item === 'Edit order data') {
          this.$modal.show(ModalEditOrder, {item: this.selectItem}, {
            height: 'auto'
          })
        } else if (item === 'Print') {
          var classResult = null
          var rbcInfo = null
          var totalCount = 0

          console.log(this.selectItem)
          if (this.selectItem.ANALYSIS_TYPE === '01') {
            classResult = this.wbcClassificationResult
            rbcInfo = this.rbcInfo
            totalCount = this.wbcTotalCount
          } else {
            classResult = this.bmClassificationResult
            rbcInfo = null
            totalCount = this.bmCellTotalCount
          }

          var html = this.$makePrintHtml(this.selectItem, classResult, rbcInfo, totalCount)
          this.$modal.show(ModalPrint, {item: html}, {
            width: '900',
            height: 'auto',
            scrollable: true
          })

          // this.drawPreview()

        } else if (item === 'export XLSX') {
          this.onDownloadData('exportXlsx')
        }
      },
      // drawPreview () {
      //   console.log(this.selectItem)
      //   var html = `<div style="height: 900px; overflow-y: scroll; padding-right: 10px;">` +
      //     `<span>&#60; Hospital &#62; &nbsp;&nbsp;</span>` +
      //     `<span> DM Serial Nbr :` + this.selectItem.SERIAL_NO + `</span>` +
      //     `<hr style="border-top: 1px dashed" />` +
      //     `<div style="text-align: center; font-size: 19px;"> Analysis Report from UIMD BM system</div>` +
      //     `<div class="userContainer" style="display: flex; flex-wrap: wrap; margin-top: 40px; font-size: 15px;">` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       `Order ID` +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       this.selectItem.ORDER_ID +
      //     `</div><br /><br />` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       `Ordered date` +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       this.$stringToDateTime(this.selectItem.ORDER_DTTM) +
      //     `</div>` +
      //     `<div class=\"item\" style=\"flex-basis: 50%;\">` +
      //       `Signed by ID` +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       this.selectItem.SIGNED_USER_ID +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       `Signed date` +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       this.$stringToDateTime(this.selectItem.SIGNED_DTTM) +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       `Classification ordered analysis` +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       this.selectItem.ANALYSIS_TYPE_NM +
      //     `</div><br /><br />` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       `Patient ID` +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       this.selectItem.PATIENT_ID +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       `Name` +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       this.selectItem.PATIENT_NM +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       `Birth` +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       this.$stringToDate(this.selectItem.BIRTHDAY) +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       `Gender` +
      //     `</div>` +
      //     `<div class="item" style="flex-basis: 50%;">` +
      //       this.selectItem.GENDER_NM +
      //     `</div><br /><br />`
      //     if (this.selectItem.ANALYSIS_TYPE === '01') {
      //       html += `<div class="item" style="flex-basis: 50%;">` +
      //         this.createRbcClassification() +
      //       `</div>` +
      //       `<div class="item" style="flex-basis: 50%;">` +
      //         this.createWbcClassification() +
      //       `</div>`
      //     } else {
      //       html += `<div class="item" style="flex-basis: 50%;">` +
      //         this.createBmClassification() +
      //       `</div>`
      //     }
      //     + `</div>`
      //
      //   this.$modal.show(ModalPrint, {item: html}, {
      //     width: '800px',
      //     height: 'auto'
      //   })
      // },
      createWbcClassification() {
        var result = '<div class="wbcContainer" style="display: flex; flex-wrap: wrap;">'
        result += `<div class="item" style="flex-basis: 100%;">WBC classification result` + `</div><br /><br />`

        console.log(this.wbcClassificationResult)
        for (var i = 0; i < this.wbcClassificationResult.length; i++) {
          if ((this.wbcClassificationResult[i].title !== 'NR' &&
               this.wbcClassificationResult[i].title !== 'GP' &&
               this.wbcClassificationResult[i].title !== 'PA' &&
               this.wbcClassificationResult[i].title !== 'AR')) {
            result += `<div class="item" style="flex-basis: 40%;">` + this.wbcClassificationResult[i].name + `</div>`
            result += `<div class="item" style="flex-basis: 30%;">` + this.wbcClassificationResult[i].count + `</div>`
            result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + this.wbcClassificationResult[i].percent + `%</div>`
          }

          if (i === (this.wbcClassificationResult.length - 1)) {
            result += `<div class="item" style="flex-basis: 40%;">` + 'Total count' + `</div>`
            result += `<div class="item" style="flex-basis: 30%;">` + this.wbcTotalCount + `</div>`
            result += `<div class="item" style="flex-basis: 30%; text-align: right;">` + '100.00%' + `</div><br /></br />`
          }
        }

        for (var j = 0; j < this.wbcClassificationResult.length; j++) {
          if ((this.wbcClassificationResult[j].title === 'NR' ||
               this.wbcClassificationResult[j].title === 'GP' ||
               this.wbcClassificationResult[j].title === 'PA' ||
               this.wbcClassificationResult[j].title === 'AR')) {
            result += `<div class="item" style="flex-basis: 40%;">` + this.wbcClassificationResult[j].name + `</div>`
            if (this.wbcClassificationResult[j].title === 'NR') {
              result += `<div class="item" style="flex-basis: 30%;">` + this.wbcClassificationResult[j].count + '/ 100 WBC' + `</div>`
            } else {
              result += `<div class="item" style="flex-basis: 30%;">` + this.wbcClassificationResult[j].count + `</div>`
            }
            result += `<div class="item" style="flex-basis: 30%;">` + `</div>`
          }
        }

        result += `<br /><br /><div class="item" style="flex-basis: 100%;">` + 'Comment' + `</div>`
        result += `<div class="item" style="flex-basis: 100%; word-break: break-all;">>&nbsp` + this.selectItem.WBC_COMMENT + `</div>`

        result += '</div>'
        return result
      },
      createRbcClassification() {
        var result = '<div class="rbcContainer" style="display: flex; flex-wrap: wrap;">'
        result += `<div class="item" style="flex-basis: 100%;">RBC classification result` + `</div><br /><br />`
        console.log(this.rbcInfo)
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
            result += `<div class="item" style="flex-basis: 30%;">` + this.selectItem.MALARIA_COUNT + '/' + this.selectItem.MAX_RBC_COUNT + `RBC</div>`

            result += `<br /><br /><div class="item" style="flex-basis: 100%;">` + 'Comment' + `</div>`
            result += `<div class="item" style="flex-basis: 100%; word-break: break-all;">>&nbsp` + this.selectItem.RBC_COMMENT + `</div>`
          }
        }

        result += '</div>'
        return result
      },
      createBmClassification () {
        var result = '<div class="bmContainer" style="display: flex; flex-wrap: wrap;">'
        result += `<div class="item" style="flex-basis: 100%;">BM WBC Diff count classification` + `</div><br /><br />`

        console.log(this.bmClassificationResult)
        for (var i = 0; i < this.bmClassificationResult.length; i++) {
          if ((this.bmClassificationResult[i].title !== 'OT' &&
               this.bmClassificationResult[i].title !== 'MC')) {
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
          if ((this.bmClassificationResult[j].title === 'OT' ||
               this.bmClassificationResult[j].title === 'MC')) {
            result += `<div class="item" style="flex-basis: 40%;">` + this.bmClassificationResult[j].name + `</div>`
            result += `<div class="item" style="flex-basis: 30%;">` + this.bmClassificationResult[j].count + `</div>`
            result += `<div class="item" style="flex-basis: 30%;">` + `</div>`
          }
        }

        result += `<br /><br /><div class="item" style="flex-basis: 100%;">` + 'Comment' + `</div>`
        result += `<div class="item" style="flex-basis: 100%; word-break: break-all;">>&nbsp` + this.selectItem.BM_COMMENT + `</div>`

        result += '</div>'
        return result
      },
      infiniteHandler ($state) {
        var self = this
        var loadSize = self.MAX_LOAD_SIZE

        self.infiniteState = $state

        console.log(self.getClassificationItem)
        if (self.getClassificationItem.item !== null && self.scrollCnt <= 0) {
          if (self.getClassificationItem.limit > 0) {
            loadSize = self.getClassificationItem.limit + 5
          }
        }

        console.log(self.wbcClassList)
        console.log(self.bmClassList)

        ipcRenderer.send(Constant.GET_TEST_HISTORY_LIST, JSON.stringify({
          limit: self.limit,
          size: loadSize,
          searchType: self.sSelected,
          searchText: self.searchText.replace(/ /g, ''),
          startDate: self.startDate,
          endDate: self.endDate,
          wbcClassList: self.wbcClassList
        }))
      },
      onChangeAll (isSelect) {
        console.log(isSelect)
        console.log(this.dspTestList)

        this.dspTestList.forEach(function(item, index) {
          item.isSelected = isSelect
        })

        // this.$forceUpdate()
      },
      onChangeSelectBox () {
        if (this.sSelected === '01') {
          document.getElementById('inputSearch').disabled = true
        } else {
          document.getElementById('inputSearch').disabled = false
        }
      },
      onDownloadData (path) {
        ipcRenderer.send('open-file-dialog-for-dir', path)
      },
      onDownloadXlsx (path, arrayData, fileName) {
        var self = this
        var resultData = []

        console.log(arrayData)
        arrayData.forEach(function(item) {
          var obj = {
            'SERIAL_NO': item.SERIAL_NO,
            'ANALYSIS_TYPE': item.ANALYSIS_TYPE,
            'SLOT_ID': item.SLOT_ID,
            'ORDER_ID': item.ORDER_ID,
            'BM_NO': item.BM_NO,
            'PATIENT_ID': item.PATIENT_ID,
            'PATIENT_NM': item.PATIENT_NM,
            'A_Neutrophil': item.A_Neutrophil,
            'B_Neutrophil': item.B_Neutrophil,
            'A_NeutrophilS': item.A_NeutrophilS,
            'B_NeutrophilS': item.B_NeutrophilS,
            'A_NeutrophilB': item.A_NeutrophilB,
            'B_NeutrophilB': item.B_NeutrophilB,
            'A_Metamyelocyte': item.A_Metamyelocyte,
            'B_Metamyelocyte': item.B_Metamyelocyte,
            'A_Myelocyte': item.A_Myelocyte,
            'B_Myelocyte': item.B_Myelocyte,
            'A_Promyelocyte': item.A_Promyelocyte,
            'B_Promyelocyte': item.B_Promyelocyte,
            'A_Lymphocyte': item.A_Lymphocyte,
            'B_Lymphocyte': item.B_Lymphocyte,
            'A_Reactive_lymphocyte': item.A_Reactive_lymphocyte,
            'B_Reactive_lymphocyte': item.B_Reactive_lymphocyte,
            'A_Abnormal_lymphocyte': item.A_Abnormal_lymphocyte,
            'B_Abnormal_lymphocyte': item.B_Abnormal_lymphocyte,
            'A_Monocyte': item.A_Monocyte,
            'B_Monocyte': item.B_Monocyte,
            'A_Eosinophil': item.A_Eosinophil,
            'B_Eosinophil': item.B_Eosinophil,
            'A_Basophil': item.A_Basophil,
            'B_Basophil': item.B_Basophil,
            'A_Blast': item.A_Blast,
            'B_Blast': item.B_Blast,
            'A_Plasma_cell': item.A_Plasma_cell,
            'B_Plasma_cell': item.B_Plasma_cell,
            'A_nRBC': item.A_nRBC,
            'B_nRBC': item.B_nRBC,
            'A_Giant_platelet': item.A_Giant_platelet,
            'B_Giant_platelet': item.B_Giant_platelet,
            'A_Platelet_aggregation': item.A_Platelet_aggregation,
            'B_Platelet_aggregation': item.B_Platelet_aggregation,
            'A_Malaria': item.A_Malaria,
            'B_Malaria': item.B_Malaria,
            'A_Artifact': item.A_Artifact,
            'B_Artifact': item.B_Artifact,
            'A_Orthochromic_Normoblast': item.A_Orthochromic_Normoblast,
            'B_Orthochromic_Normoblast': item.B_Orthochromic_Normoblast,
            'A_Polychromic_Normoblast': item.A_Polychromic_Normoblast,
            'B_Polychromic_Normoblast': item.B_Polychromic_Normoblast,
            'A_Basophilic_Normoblast': item.A_Basophilic_Normoblast,
            'B_Basophilic_Normoblast': item.B_Basophilic_Normoblast,
            'A_Proerythroblast': item.A_Proerythroblast,
            'B_Proerythroblast': item.B_Proerythroblast,
            'A_Histiocyte': item.A_Histiocyte,
            'B_Histiocyte': item.B_Histiocyte,
            'A_Others': item.A_Others,
            'B_Others': item.B_Others
          }

          // custom class
          for (var i = 90; i < 95; i++) {
            var afterCustomId = 'A_CUSTOM_' + i + '_NM'
            var beforeCustomId = 'B_CUSTOM_' + i + '_NM'

            if (item[afterCustomId] !== 'N/A') {
              obj['A_' + item[afterCustomId]] = item['A_CUSTOM_' + i + '_CNT']
            }

            if (item[beforeCustomId] !== 'N/A') {
              obj['B_' + item[beforeCustomId]] = item['B_CUSTOM_' + i + '_CNT']
            }
          }

          obj['A_TOTAL'] = Number(item.A_Neutrophil) + Number(item.A_NeutrophilS) + Number(item.A_NeutrophilB) +
            Number(item.A_Metamyelocyte) + Number(item.A_Myelocyte) + Number(item.A_Promyelocyte) +
            Number(item.A_Lymphocyte) + Number(item.A_Reactive_lymphocyte) + Number(item.A_Abnormal_lymphocyte) +
            Number(item.A_Monocyte) + Number(item.A_Eosinophil) + Number(item.A_Basophil) +
            Number(item.A_Blast) + Number(item.A_Plasma_cell) +
            Number(item.A_CUSTOM_90_CNT) + Number(item.A_CUSTOM_91_CNT) + Number(item.A_CUSTOM_92_CNT) +
            Number(item.A_CUSTOM_93_CNT) + Number(item.A_CUSTOM_94_CNT) + Number(item.A_Orthochromic_Normoblast) +
            Number(item.A_Polychromic_Normoblast) + Number(item.A_Basophilic_Normoblast) +
            Number(item.A_Proerythroblast) + Number(item.A_Histiocyte)

          obj['B_TOTAL'] = Number(item.B_Neutrophil) + Number(item.B_NeutrophilS) + Number(item.B_NeutrophilB) +
            Number(item.B_Metamyelocyte) + Number(item.B_Myelocyte) + Number(item.B_Promyelocyte) +
            Number(item.B_Lymphocyte) + Number(item.B_Reactive_lymphocyte) + Number(item.B_Abnormal_lymphocyte) +
            Number(item.B_Monocyte) + Number(item.B_Eosinophil) + Number(item.B_Basophil) +
            Number(item.B_Blast) + Number(item.B_Plasma_cell) +
            Number(item.B_CUSTOM_90_CNT) + Number(item.B_CUSTOM_91_CNT) + Number(item.B_CUSTOM_92_CNT) +
            Number(item.B_CUSTOM_93_CNT) + Number(item.B_CUSTOM_94_CNT) + Number(item.B_Orthochromic_Normoblast) +
            Number(item.B_Polychromic_Normoblast) + Number(item.B_Basophilic_Normoblast) +
            Number(item.B_Proerythroblast) + Number(item.B_Histiocyte)

          obj['A_Neutrophil_P'] = ((Number(item.A_Neutrophil) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Neutrophil_P'] = ((Number(item.B_Neutrophil) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_NeutrophilS_P'] = ((Number(item.A_NeutrophilS) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_NeutrophilS_P'] = ((Number(item.B_NeutrophilS) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_NeutrophilB_P'] = ((Number(item.A_NeutrophilB) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_NeutrophilB_P'] = ((Number(item.B_NeutrophilB) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Metamyelocyte_P'] = ((Number(item.A_Metamyelocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Metamyelocyte_P'] = ((Number(item.B_Metamyelocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Myelocyte_P'] = ((Number(item.A_Myelocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Myelocyte_P'] = ((Number(item.B_Myelocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Promyelocyte_P'] = ((Number(item.A_Promyelocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Promyelocyte_P'] = ((Number(item.B_Promyelocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Lymphocyte_P'] = ((Number(item.A_Lymphocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Lymphocyte_P'] = ((Number(item.B_Lymphocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Reactive_lymphocyte_P'] = ((Number(item.A_Reactive_lymphocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Reactive_lymphocyte_P'] = ((Number(item.B_Reactive_lymphocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Abnormal_lymphocyte_P'] = ((Number(item.A_Abnormal_lymphocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Abnormal_lymphocyte_P'] = ((Number(item.B_Abnormal_lymphocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Monocyte_P'] = ((Number(item.A_Monocyte) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Monocyte_P'] = ((Number(item.B_Monocyte) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Eosinophil_P'] = ((Number(item.A_Eosinophil) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Eosinophil_P'] = ((Number(item.B_Eosinophil) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Basophil_P'] = ((Number(item.A_Basophil) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Basophil_P'] = ((Number(item.B_Basophil) / obj['B_TOTAL']) * 100).toFixed(0)

          obj['A_Plasma_cell_P'] = ((Number(item.A_Plasma_cell) / obj['A_TOTAL']) * 100).toFixed(0)
          obj['B_Plasma_cell_P'] = ((Number(item.B_Plasma_cell) / obj['B_TOTAL']) * 100).toFixed(0)

          // after blast
          var aBlastPercent = ((Number(item.A_Blast) / obj['A_TOTAL']) * 100)
          if (aBlastPercent > 0 && aBlastPercent <= 1) {
            obj['A_Blast_P'] = 1
          } else {
            obj['A_Blast_P'] = ((Number(item.A_Blast) / obj['A_TOTAL']) * 100).toFixed(0)
          }

          // before blast
          var bBlastPercent = ((Number(item.B_Blast) / obj['B_TOTAL']) * 100)
          if (bBlastPercent > 0 && bBlastPercent <= 1) {
            obj['B_Blast_P'] = 1
          } else {
            obj['B_Blast_P'] = ((Number(item.B_Blast) / obj['B_TOTAL']) * 100).toFixed(0)
          }

          // after percent array
          var aPercentArray = [
            {name: 'A_Neutrophil_P', percent: Number(obj['A_Neutrophil_P'])},
            {name: 'A_NeutrophilS_P', percent: Number(obj['A_NeutrophilS_P'])},
            {name: 'A_NeutrophilB_P', percent: Number(obj['A_NeutrophilB_P'])},
            {name: 'A_Metamyelocyte_P', percent: Number(obj['A_Metamyelocyte_P'])},
            {name: 'A_Myelocyte_P', percent: Number(obj['A_Myelocyte_P'])},
            {name: 'A_Promyelocyte_P', percent: Number(obj['A_Promyelocyte_P'])},
            {name: 'A_Lymphocyte_P', percent: Number(obj['A_Lymphocyte_P'])},
            {name: 'A_Reactive_lymphocyte_P', percent: Number(obj['A_Reactive_lymphocyte_P'])},
            {name: 'A_Abnormal_lymphocyte_P', percent: Number(obj['A_Abnormal_lymphocyte_P'])},
            {name: 'A_Monocyte_P', percent: Number(obj['A_Monocyte_P'])},
            {name: 'A_Eosinophil_P', percent: Number(obj['A_Eosinophil_P'])},
            {name: 'A_Basophil_P', percent: Number(obj['A_Basophil_P'])},
            {name: 'A_Plasma_cell_P', percent: Number(obj['A_Plasma_cell_P'])},
            {name: 'A_Blast_P', percent: Number(obj['A_Blast_P'])}
          ]

          // before percent array
          var bPercentArray = [
            {name: 'B_Neutrophil_P', percent: Number(obj['B_Neutrophil_P'])},
            {name: 'B_NeutrophilS_P', percent: Number(obj['B_NeutrophilS_P'])},
            {name: 'B_NeutrophilB_P', percent: Number(obj['B_NeutrophilB_P'])},
            {name: 'B_Metamyelocyte_P', percent: Number(obj['B_Metamyelocyte_P'])},
            {name: 'B_Myelocyte_P', percent: Number(obj['B_Myelocyte_P'])},
            {name: 'B_Promyelocyte_P', percent: Number(obj['B_Promyelocyte_P'])},
            {name: 'B_Lymphocyte_P', percent: Number(obj['B_Lymphocyte_P'])},
            {name: 'B_Reactive_lymphocyte_P', percent: Number(obj['B_Reactive_lymphocyte_P'])},
            {name: 'B_Abnormal_lymphocyte_P', percent: Number(obj['B_Abnormal_lymphocyte_P'])},
            {name: 'B_Monocyte_P', percent: Number(obj['B_Monocyte_P'])},
            {name: 'B_Eosinophil_P', percent: Number(obj['B_Eosinophil_P'])},
            {name: 'B_Basophil_P', percent: Number(obj['B_Basophil_P'])},
            {name: 'B_Plasma_cell_P', percent: Number(obj['B_Plasma_cell_P'])},
            {name: 'B_Blast_P', percent: Number(obj['B_Blast_P'])}
          ]

          var aPercentTotal = Number(obj['A_Neutrophil_P']) + Number(obj['A_NeutrophilS_P']) + Number(obj['A_NeutrophilB_P']) +
            Number(obj['A_Metamyelocyte_P']) + Number(obj['A_Myelocyte_P']) + Number(obj['A_Promyelocyte_P']) +
            Number(obj['A_Lymphocyte_P']) + Number(obj['A_Reactive_lymphocyte_P']) + Number(obj['A_Abnormal_lymphocyte_P']) +
            Number(obj['A_Monocyte_P']) + Number(obj['A_Eosinophil_P']) + Number(obj['A_Basophil_P']) + Number(obj['A_Blast_P']) +
            Number(obj['A_Plasma_cell_P']) + Number(obj['A_Blast_P'])

          var bPercentTotal = Number(obj['B_Neutrophil_P']) + Number(obj['B_NeutrophilS_P']) + Number(obj['B_NeutrophilB_P']) +
            Number(obj['B_Metamyelocyte_P']) + Number(obj['B_Myelocyte_P']) + Number(obj['B_Promyelocyte_P']) +
            Number(obj['B_Lymphocyte_P']) + Number(obj['B_Reactive_lymphocyte_P']) + Number(obj['B_Abnormal_lymphocyte_P']) +
            Number(obj['B_Monocyte_P']) + Number(obj['B_Eosinophil_P']) + Number(obj['B_Basophil_P']) + Number(obj['B_Blast_P']) +
            Number(obj['B_Plasma_cell_P']) + Number(obj['B_Blast_P'])

          // custom class
          for (var i = 90; i < 95; i++) {
            var afterCustomId = 'A_CUSTOM_' + i + '_NM'
            var beforeCustomId = 'B_CUSTOM_' + i + '_NM'

            if (item[afterCustomId] !== 'N/A') {
              obj['A_' + item[afterCustomId] + '_P'] = ((item['A_CUSTOM_' + i + '_CNT'] / obj['A_TOTAL']) * 100).toFixed(0)
              aPercentArray.push({name: 'A_' + item[afterCustomId] + '_P', percent: obj['A_' + item[afterCustomId] + '_P']})
              aPercentTotal += Number(obj['A_' + item[afterCustomId] + '_P'])
            }

            if (item[beforeCustomId] !== 'N/A') {
              obj['B_' + item[beforeCustomId] + '_P'] = ((item['B_CUSTOM_' + i + '_CNT'] / obj['B_TOTAL']) * 100).toFixed(0)
              bPercentArray.push({name: 'B_' + item[beforeCustomId] + '_P', percent: obj['B_' + item[beforeCustomId] + '_P']})
              bPercentTotal += Number(obj['B_' + item[beforeCustomId] + '_P'])
            }
          }

          var aMaxItem = null
          var bMaxItem = null

          aPercentArray.forEach(function(afterItem) {
            if (aMaxItem === null) {
              aMaxItem = afterItem
            } else {
              if (aMaxItem.percent < afterItem.percent) {
                aMaxItem = afterItem
              }
            }
          })

          bPercentArray.forEach(function(beforeItem) {
            if (bMaxItem === null) {
              bMaxItem = beforeItem
            } else {
              if (bMaxItem.percent < beforeItem.percent) {
                bMaxItem = beforeItem
              }
            }
          })

          // 백분율 사사오입
          if (aMaxItem !== null) {
            obj[aMaxItem.name] = (Number(aMaxItem.percent) + (100 - aPercentTotal)).toString()
          }

          if (bMaxItem !== null) {
            obj[bMaxItem.name] = (Number(bMaxItem.percent) + (100 - bPercentTotal)).toString()
          }

          console.log(obj)
          resultData.push(obj)
        })

        var dataWS = XLSX.utils.json_to_sheet(resultData)

        // 엑셀의 workbook을 만든다
        // workbook은 엑셀파일에 지정된 이름이다.
        var wb = XLSX.utils.book_new()
        // workbook에 워크시트 추가
        // 시트명은 'nameData'
        // XLSX.utils.book_append_sheet(wb, dataWS, '')
        XLSX.utils.book_append_sheet(wb, dataWS, '')
        // XLSX.utils.book_append_sheet(wb, wbcWS, '')
        // 엑셀 파일을 내보낸다.
        XLSX.writeFile(wb, path + '/' + fileName)
      },
      checkWorkList (orderId) {
        return this.workList.findIndex(function (lstItem) {
          return lstItem.ORDER_ID === orderId
        })
      }
    }
  }
</script>
<style>
  #resultPage {
    color: white;
  }
  /* #inputSearch {
    background-color: #333E52;
    height: 30px;
    color: white;
  } */
  #btnSearch {
    height: 30px;
    font-size: 13px !important;
    line-height: 10px;
    width: 70px;
  }
  #btnClear {
    height: 30px;
    font-size: 13px !important;
    line-height: 10px;
    width: 70px;
  }
  #btnClassification {
    height: 30px;
    font-size: 13px !important;
    line-height: 10px;
    width: 120px;
  }
  #tableResultList {
    margin-top: 20px;
    height: 800px;
    text-align: center;
    overflow: auto;
  }
  #tableResultList > table > tbody > tr:hover {
    background-color: #3F628C;
  }
  /* #tableResultList > table > tbody > tr:focus {
    background-color: #3F628C;
    outline: 0;
  } */
  #tableResultList > table > thead > tr {
    color: white;
    font-size: 15px;
  }
  #tableResultList > table > tbody > tr {
    color: white;
    font-size: 15px;
  }
  #tableResultList > table > thead > tr > th {
    padding-bottom: 5px;
    padding-top: 5px;
    border-bottom: 1px solid;
    border-right: 1px solid;
    border-color: #2B455C;
  }
  #tableResultList > table > tbody > tr > td {
    padding-bottom: 5px;
    padding-top: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  #error {
    color: red;
  }
  #divContents {
    font-size: 12px;
    color: gray;
  }
  #resultCard {
    height: 885px;
  }
  #divSlideInformation {
    height: 934px;
  }
</style>
