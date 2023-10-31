<template>
  <b-container id="orderList" class="text-center colorWhite p-0" fluid>
    <b-row>
      <b-col>
        <div class="blackCardTitle p-2">
          <b-nav>
            <b-nav-item v-for="(item, index) in tabItems" :id="item.cassetNo" :key="item.cassetNo" @click="onLink(item.cassetNo)" link-classes="tabStyle">
              {{ index + 1 }}
            </b-nav-item>
          </b-nav>
        </div>
      </b-col>
      <b-col>
        <div class="text-right pr-3 mt-3">
          <b-button id="delete" variant="outline-light" size="sm" @click="onDelete">Delete</b-button>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <table width="100%" height="480px">
          <thead v-columns-resizable style="background-color: #35363A;">
            <tr style="height: 40px;">
              <th width="3%" style="border-right: 1px solid #2B455C;">No.</th>
              <th width="3%" style="border-right: 1px solid #2B455C;">
                <b-form-checkbox
                  id="selectAll"
                  v-model="isSelectAll"
                  name="selectAll"
                  value="true"
                  unchecked-value="false"
                  @change="onChangeAll"
                >
                </b-form-checkbox>
              </th>
              <th width="5%" style="border-right: 1px solid #2B455C;">
                <span>BM No.</span>
                <span style="color: red;">*</span>
              </th>
              <th style="border-right: 1px solid #2B455C;">Order ID</th>
              <th style="border-right: 1px solid #2B455C;">Patient ID</th>
              <th style="border-right: 1px solid #2B455C;">Name</th>
              <th style="border-right: 1px solid #2B455C;">Age</th>
              <th style="border-right: 1px solid #2B455C;">M/F</th>
              <th style="border-right: 1px solid #2B455C;">Department</th>
              <th style="border-right: 1px solid #2B455C;">Sampling Site</th>
              <th style="border-right: 1px solid #2B455C;">Cell Count</th>
              <th style="border-right: 1px solid #2B455C;">Stitch Count</th>
              <th style="border-right: 1px solid #2B455C;">Scan Type</th>
              <th style="border-right: 1px solid #2B455C;">Stain Type</th>
              <th style="border-right: 1px solid #2B455C;">Analysis State</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in selectedCasseteList.slotInfo" :key="item.orderId">
              <td>{{ index + 1 }}</td>
              <td v-if="item.orderId">
                <b-form-checkbox
                  :id="selectedCassete + '_' + index "
                  v-model="item.isSelected"
                  :value="true"
                  :unchecked-value="false"
                >
                </b-form-checkbox>
              </td>
              <td v-if="item.orderId">
                <b-form-input
                  class="borderNone"
                  id="bmNo"
                  v-model="item.bmNo"
                  @input="onUpdateOrder"
                  style="height: 25px; width: 100%; background-color: rgba(255, 255, 255, 0); color: white;">
                </b-form-input>
              </td>
              <td v-if="item.orderId">{{ item.orderId }}</td>
              <td v-if="item.orderId">
                <b-form-input
                  class="borderNone"
                  id="patientId"
                  v-model="item.patientId"
                  @input="onUpdateOrder"
                  style="height: 25px; width: 100%; background-color: rgba(255, 255, 255, 0); color: white;">
                </b-form-input>
              </td>
              <td v-if="item.orderId">
                <b-form-input
                  class="borderNone"
                  id="name"
                  v-model="item.name"
                  @input="onUpdateOrder"
                  style="height: 25px; width: 100%; background-color: rgba(255, 255, 255, 0); color: white;">
                </b-form-input>
              </td>
              <td v-if="item.orderId">
                <b-form-input
                  type="number"
                  class="borderNone"
                  id="age"
                  v-model="item.age"
                  @input="onUpdateOrder"
                  min="1"
                  style="height: 25px; width: 100%; background-color: rgba(255, 255, 255, 0); color: white;">
                </b-form-input>
              </td>
              <td>
                {{ item.mF }}
              </td>
              <td v-if="item.orderId">
                <b-form-input
                  class="borderNone"
                  id="mF"
                  v-model="item.departMent"
                  @input="onUpdateOrder"
                  style="height: 25px; width: 100%; background-color: rgba(255, 255, 255, 0); color: white;">
                </b-form-input>
              </td>
              <td>{{ item.bmSamplingSide }}</td>
              <td>{{ item.cellCount }}</td>
              <td>{{ item.stitchCount }}</td>
              <td>{{ item.analysisType }}</td>
              <td>{{ item.stainType }}</td>
              <td>{{ item.analysisState }}</td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'

  export default {
    name: 'order-list',
    computed: {
      ...mapGetters({
        commonCodeList: Constant.GET_COMMON_CODE_LIST,
        commonCode: Constant.GET_COMMON_CODE,
        tabItems: Constant.GET_ORDER_LIST_BM
      }),
    },
    mounted () {
      var self = this

      this.analysisTypeList = this.commonCodeList(Constant.GET_CODE_LIST_ANALYSIS_TYPE)
      this.cellCountList = this.commonCodeList(Constant.GET_CODE_LIST_CELL_COUNT)
      this.samplingSideList = this.commonCodeList(Constant.GET_CODE_LIST_SAMPLING_STAIN)
      this.stainType = this.stainType.concat(this.commonCodeList(Constant.GET_CODE_LIST_GENERAL_STAIN))
      this.stainType = this.stainType.concat(this.commonCodeList(Constant.GET_CODE_LIST_SPECIAL_STAIN))
      this.stainType = this.stainType.concat(this.commonCodeList(Constant.GET_CODE_LIST_IMMUNO_STAIN))
      // 2021_06_16_LBK : stitch count
      this.stitchCountList = this.commonCodeList(Constant.GET_STITCH_COUNT)

      if (this.tabItems.length <= 0) {
        this.addCasset()
      }

      this.$nextTick(function() {
        this.onLink('1')
      })

      this.EventBus.$on('UPLOAD_FAVORITE_COMP', function(params) {
        console.log(params)
        var inputSlotCount = 0

        // row 입력 최대 12 체크 [
        for (var i = 0; i < self.selectedCasseteList.slotInfo.length; i++) {
          if (self.selectedCasseteList.slotInfo[i].orderId !== undefined) {
            inputSlotCount++
          }
        }

        if (inputSlotCount + params.length > 12) {
            self.$toasted.show(Constant.IDS_ERROR_FAVORITE_MAX_REGIST2, {
              position: 'bottom-center',
              duration: '2000'
            })

            return
        }
        // row 입력 최대 12 체크 ]

        // 비어있는 슬롯에 insert
        var favoriteIdx = 0
        for (var i = 0; i < self.selectedCasseteList.slotInfo.length; i++) {
          if (self.selectedCasseteList.slotInfo[i].orderId === undefined && favoriteIdx < params.length) {
            var samplingSide = ''
            var cellCount = ''
            var stainType = ''
            var stitchCount = ''

            samplingSide = self.commonCode(Constant.GET_CODE_LIST_SAMPLING_STAIN, params[favoriteIdx].bmSamplingSide).cdNm

            console.log(params)
            if (params[favoriteIdx].analysisType === '03' || params[favoriteIdx].analysisType === '04' || params[favoriteIdx].analysisType === '05') {
              cellCount = '0'
            } else {
              for (var l = 0; l < self.cellCountList.length; l++) {
                if (self.cellCountList[l].cd === params[favoriteIdx].cellCount) {
                  cellCount = self.cellCountList[l].cdNm.substring(0, 3)
                }
              }
            }

            // 2021_06_16_LBK : stitch count
            console.log(self.stitchCountList)
            console.log(params[favoriteIdx].stitchCount)

            for (var k = 0; k < self.stitchCountList.length; k++) {
              if (self.stitchCountList[k].cd === params[favoriteIdx].stitchCount) {
                stitchCount = self.stitchCountList[k].cdNm.substring(0, 1)
              }
            }

            for (var m = 0; m < self.stainType.length; m++) {
              if (self.stainType[m].cd === params[favoriteIdx].stainType) {
                stainType = self.stainType[m].cdNm
              }
            }

            var obj = {
              cassetNo: params[favoriteIdx].cassetNo,
              slotNo: self.selectedCasseteList.slotInfo[i].slotNo,
              isSelected: false,
              pbBf: self.commonCode(Constant.GET_CODE_LIST_TEST_TYPE, params[favoriteIdx].pbBm).cdNm,
              orderId: params[favoriteIdx].orderNo,
              patientId: params[favoriteIdx].patientId,
              name: params[favoriteIdx].patientName,
              age: params[favoriteIdx].age,
              bmNo: params[favoriteIdx].bmNo,
              gender: params[favoriteIdx].gender,
              mF: self.commonCode(Constant.GET_CODE_LIST_GENDER, params[favoriteIdx].gender).cdNm,
              departMent: params[favoriteIdx].departMent,
              bmSamplingSide: samplingSide,
              bmSamplingSideCd: params[favoriteIdx].bmSamplingSide,
              cellCount: cellCount,
              // 2021_06_16_LBK : stitch count
              stitchCount: stitchCount,
              analysisTypeCd: params[favoriteIdx].analysisType,
              analysisType: self.commonCode(Constant.GET_CODE_LIST_ANALYSIS_TYPE, params[favoriteIdx].analysisType).cdNm,
              stainTypeCd: params[favoriteIdx].stainType,
              stainType: stainType,
              analysisState: 'Ready'
            }

            self.$store.dispatch(Constant.SET_ORDER_LIST_BM, obj)
            ++favoriteIdx
          }
        }

        self.onLink(self.selectedCassete)
      })

      this.EventBus.$on('UPLOAD_ORDER_COMP', function(params) {
        console.log("orderlisttab에서 UPLOAD_ORDER_COMP ON")
        console.log("orderlisttab에서 UPLOAD_ORDER_COMP ON")
        console.log("orderlisttab에서 UPLOAD_ORDER_COMP ON")
        console.log(params)
        console.log("orderlisttab에서 UPLOAD_ORDER_COMP ON")
        console.log("orderlisttab에서 UPLOAD_ORDER_COMP ON")
        console.log("orderlisttab에서 UPLOAD_ORDER_COMP ON")

        var samplingSide = ''
        var stainType = params.addStainInput
        var cellCount = params.cellCountInput
        // 2021_06_16_LBK : stitch count
        var stitchCount = params.stitchCountInput

        samplingSide = self.commonCode(Constant.GET_CODE_LIST_SAMPLING_STAIN, params.samplingSide).cdNm

        for (var i = 0; i < self.stainType.length; i++) {
          if (self.stainType[i].cd === params.stainType) {
            stainType = self.stainType[i].cdNm
          }
        }

        if (params.analysisType === '03' || params.analysisType === '04' || params.analysisType === '05') {
          cellCount = '0'
        } else {
          for (var j = 0; j < self.cellCountList.length; j++) {
            if (self.cellCountList[j].cd === params.cellCount) {
              cellCount = self.cellCountList[j].cdNm.substring(0, 3)
            }
          }
        }

        // 2021_06_16_LBK : stitch count
        for (var k = 0; k < self.stitchCountList.length; k++) {
          if (self.stitchCountList[k].cd === params.stitchCount) {
            stitchCount = self.stitchCountList[k].cdNm.substring(0, 1)
          }
        }

        var obj = {
          cassetNo: params.cassetNo,
          slotNo: params.slotNo,
          isSelected: false,
          pbBf: params.selectedTestType,
          orderId: self.$getOrderNo(),
          patientId: params.patientId,
          name: params.patientName,
          age: params.age,
          bmNo: params.bmNo,
          gender: params.gender,
          mF: self.commonCode(Constant.GET_CODE_LIST_GENDER, params.gender).cdNm,
          departMent: params.departMent,
          bmSamplingSide: samplingSide,
          bmSamplingSideCd: params.samplingSide,
          cellCount: cellCount,
          // 2021_06_16_LBK : stitch count
          stitchCount: stitchCount,
          analysisTypeCd: params.analysisType,
          analysisType: self.commonCode(Constant.GET_CODE_LIST_ANALYSIS_TYPE, params.analysisType).cdNm,
          stainTypeCd: params.stainType,
          stainType: stainType,
          analysisState: 'Ready'
        }

        self.$store.dispatch(Constant.SET_ORDER_LIST_BM, obj)
        self.onLink(self.selectedCassete)
      })
    },
    beforeDestroy () {
      // remove EventBus
      this.EventBus.$off('UPLOAD_FAVORITE_COMP')
      this.EventBus.$off('UPLOAD_ORDER_COMP')
    },
    data () {
      return {
        analysisTypeList: [],
        cellCountList: [],
        samplingSideList: [],
        stainType: [],
        // 전체 선택 여부
        isSelectAll: 'false',
        // 선택한 카세트
        selectedCassete: '',
        selectedCasseteList: [],
        // 2021_06_16_LBK : stitch count
        stitchCountList: []
      }
    },
    methods: {
      onRowSelected(items) {
        this.selected = items
      },
      onLink(item) {
        this.selectedCassete = item

        for (var i = 0; i < this.tabItems.length; i++) {
          if (this.tabItems[i].cassetNo === item) {
            document.getElementById(item).classList.add('activeClass')
          } else {
            document.getElementById(this.tabItems[i].cassetNo).classList.remove('activeClass')
          }
        }

        for (var i = 0; i < this.tabItems.length; i++) {
          if (this.tabItems[i].cassetNo === this.selectedCassete) {
            this.selectedCasseteList = JSON.parse(JSON.stringify(this.tabItems[i]))
          }
        }

        console.log(this.selectedCasseteList)
      },
      onChangeAll (state) {
        for (var i = 0; i < this.selectedCasseteList.slotInfo.length; i++) {
          this.selectedCasseteList.slotInfo[i].isSelected = state
        }
      },
      onDelete () {
        this.$store.dispatch(Constant.DELETE_ORDER_LIST_BM, this.selectedCasseteList)
        this.onLink(this.selectedCassete)
      },
      onUpdateOrder () {
        this.$store.dispatch(Constant.UPDATE_ORDER_LIST_BM, this.selectedCasseteList)
        this.onLink(this.selectedCassete)
      },
      addCasset () {
        this.$store.dispatch(Constant.ADD_ORDER_CASSET)
      }
    }
  }
</script>

<style>
</style>
