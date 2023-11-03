<template>
  <b-container id="orderInput" class="text-center colorWhite p-0 h-100" fluid>
    <b-card class="blackCard p-0 h-100" text-variant="white" no-body>
      <b-row class="text-left pl-3 pt-3">
        <b-col cols="2" class="pl-2 pr-2">
          <div>
            Scan Type
          </div>
          <div class="mt-3 p-2" id="cardContent">
            <b-form-group id="analysisType">
              <b-form-radio
                class="mt-1"
                v-for="item in analysisTypeList"
                v-model="modelData.analysisType"
                :value="item.cd"
                :key="item.cd"
                @change="onChangeScanType(item.cd)">{{ item.cdNm }}</b-form-radio>
            </b-form-group>
          </div>
          <div class="mt-2">
            Sampling Site
          </div>
          <div class="p-2 mt-2" id="cardContent">
            <b-form-group id="samplingSide">
              <b-form-radio
                class="mt-1"
                v-for="item in samplingSideList"
                v-model="modelData.samplingSide"
                name="samplingSide"
                :key="item.cd"
                :value="item.cd">{{ item.cdNm }}</b-form-radio>
            </b-form-group>
          </div>
        </b-col>
        <b-col cols="2" class="pl-2 pr-2">
          <div>
            Cell Count
          </div>
          <div class="mt-3 p-2 contentHeight" id="cardContent">
            <b-form-group id="cellCount">
              <b-form-radio
                class="mt-1"
                v-for="(item, index) in cellCountList"
                v-model="modelData.cellCount"
                @change="onChangeCellCount"
                :value="item.cd"
                :key="item.cd">{{ item.cdNm }}</b-form-radio>
              <b-form-radio class="mt-2" v-model="modelData.cellCount" @change="onChangeCellCount" value="06">
                <b-form-input
                  class="borderNone"
                  v-bind:class="{disabledColor : !isNewOrder || modelData.cellCount !== '06'}"
                  type="number"
                  id="cellCountInputs"
                  v-model="modelData.cellCountInputs"
                  style="height: 25px;">
                </b-form-input>
              </b-form-radio>
            </b-form-group>
          </div>
        </b-col>
        <b-col cols="2" class="pl-2 pr-2">
          <div>
            Stitch Count
          </div>
          <div class="mt-3 p-2 contentHeight" id="cardContent">
            <b-form-group id="stitchCount">
              <b-form-radio
                class="mt-1"
                v-for="(item, index) in stitchCountList"
                v-model="modelData.stitchCount"
                @change="onChangeStitchCount"
                :value="item.cd"
                :key="item.cd">{{ item.cdNm }}</b-form-radio>
              <b-form-radio class="mt-2" v-model="modelData.stitchCount" @change="onChangeStitchCount" value="05">
                <b-form-input
                  class="borderNone"
                  v-bind:class="{disabledColor : !isNewOrder || modelData.stitchCount !== '05'}"
                  type="number"
                  id="stitchCountInputs"
                  v-model="modelData.stitchCountInputs"
                  :formatter="maxNum"
                  style="height: 25px;">
                </b-form-input>
              </b-form-radio>
            </b-form-group>
          </div>
        </b-col>
        <b-col class="pl-4 pr-5">
          <div>
            <b-row>
              <b-col cols="9">
                <div>Stain Type</div>
              </b-col>
              <b-col class="text-right pr-0">
                <span v-for="(item, index) in favorites"
                  :key="index"
                  class="pointer text-center userSelectNone ml-1"
                  @click="onFavorite(item.favoriteId)"
                  v-bind:class="{favoriteOn: item.favoriteItems.length > 0, favoriteOff: item.favoriteItems.length <= 0}">
                  {{ item.favoriteId }}
                </span>
                <span id="favoritePlus" class="pointer text-center favoriteOn userSelectNone" @click="onFavoriteAdd('plus')">+</span>
              </b-col>
            </b-row>
          </div>
          <b-row class="mt-3 p-2 contentHeight" id="cardContent">
            <b-col>
              <b-form-group id="generalStain" label="General stain">
                <b-form-radio
                  class="mt-1"
                  v-for="item in generalStainList"
                  v-model="modelData.stainType"
                  name="grneralStain"
                  @change="onChangeStainType"
                  :key="item.cd"
                  :value="item.cd">{{ item.cdNm }}
                </b-form-radio>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="specialStain" label="Special stain">
                <b-form-radio
                  class="mt-1"
                  v-for="item in specialStainList"
                  v-model="modelData.stainType"
                  name="specialStain"
                  @change="onChangeStainType"
                  :key="item.cd"
                  :value="item.cd">{{ item.cdNm }}
                </b-form-radio>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="immunoStain" label="Immuno stain">
                <b-form-radio
                  class="mt-1"
                  v-for="item in immunoStainList"
                  v-model="modelData.stainType"
                  name="immunoStain"
                  @change="onChangeStainType"
                  :key="item.cd"
                  :value="item.cd">{{ item.cdNm }}</b-form-radio>
              </b-form-group>

              <b-form-group id="addStain" class="mt-3" label="Add stain">
                <b-form-radio
                  class="mt-1"
                  v-model="modelData.stainType"
                  value="15"
                  @change="onChangeStainType">
                  <b-form-input
                    class="borderNone"
                    id="addStainInput"
                    v-bind:class="{disabledColor : !isNewOrder || modelData.stainType !== '15'}"
                    type="text"
                    v-model="modelData.addStainInput"
                    style="height: 25px;"></b-form-input>
                </b-form-radio>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'
  import ModalFavorite from '../../Common/ModalFavorite'
  import ModalInfo from '../../Common/ModalInfo'

  export default {
    name: 'order-options',
    computed: {
      ...mapGetters({
        commonCodeList: Constant.GET_COMMON_CODE_LIST,
        favorites: Constant.GET_FAVORITE_LIST
      })
    },
    mounted () {
      var self = this

      this.analysisTypeList = this.commonCodeList(Constant.GET_CODE_LIST_ANALYSIS_TYPE)
      this.cellCountList = this.commonCodeList(Constant.GET_CODE_LIST_CELL_COUNT)
      this.generalStainList = this.commonCodeList(Constant.GET_CODE_LIST_GENERAL_STAIN)
      this.specialStainList = this.commonCodeList(Constant.GET_CODE_LIST_SPECIAL_STAIN)
      this.immunoStainList = this.commonCodeList(Constant.GET_CODE_LIST_IMMUNO_STAIN)
      this.samplingSideList = this.commonCodeList(Constant.GET_CODE_LIST_SAMPLING_STAIN)
      this.addStainList = this.commonCodeList(Constant.GET_CODE_LIST_ADD_STAIN)
      // 2021_06_16_LBK : stitch count
      this.stitchCountList = this.commonCodeList(Constant.GET_STITCH_COUNT)
      console.log(this.stitchCountList)
      
      this.EventBus.$on('NEW_ORDER', function(params) {
        self.isNewOrder = params
        self.loadElementState()
        self.onChangeCellCount(self.modelData.cellCount)
        self.onChangeStainType(self.modelData.stainType)

        // 2021_06_16_LBK : stitch count
        self.onChangeStitchCount(self.modelData.stitchCount)
      })

      this.EventBus.$on('UPLOAD_ORDER', function(params) {
        params.addStainInput = self.modelData.addStainInput
        params.analysisType = self.modelData.analysisType
        params.cellCount = self.modelData.cellCount
        params.cellCountInput = self.modelData.cellCountInputs
        params.stainType = self.modelData.stainType
        params.samplingSide = self.modelData.samplingSide

        // 2021_06_16_LBK : stitch count
        params.stitchCount = self.modelData.stitchCount
        params.stitchCountInput = self.modelData.stitchCountInputs

        self.EventBus.$emit('UPLOAD_ORDER_COMP', params)
      })

      this.loadElementState()
    },
    beforeDestroy () {
      // remove EventBus
      this.EventBus.$off('NEW_ORDER')
      this.EventBus.$off('UPLOAD_ORDER')
    },
    data () {
      return {
        modelData: {
          // 검사 종류
          analysisType: '01',
          cellCount: '01',
          samplingSide: '01',
          stainType: '01',
          cellCountInputs: '',
          addStainInput: '',
          // 2021_06_16_LBK : stitch count
          stitchCount: '02',
          stitchCountInputs: ''
        },
        isNewOrder: false,
        analysisTypeList: [],
        cellCountList: [],
        generalStainList: [],
        specialStainList: [],
        immunoStainList: [],
        samplingSideList: [],
        addStainList: [],
        dspFavorites: [],
        // 2021_06_16_LBK : stitch count
        stitchCountList: []
      }
    },
    methods: {
      loadElementState () {
        console.log(this.modelData.analysisType)
        console.log(this.isNewOrder)

        if (!this.isNewOrder) {
          document.getElementById('analysisType').disabled = true
          document.getElementById('cellCount').disabled = true
          document.getElementById('samplingSide').disabled = true
          document.getElementById('generalStain').disabled = true
          document.getElementById('specialStain').disabled = true
          document.getElementById('immunoStain').disabled = true
          document.getElementById('addStain').disabled = true
          // 2021_06_16_LBK : stitch count
          document.getElementById('stitchCount').disabled = true

        } else {
          document.getElementById('analysisType').disabled = false
          document.getElementById('cellCount').disabled = false
          // 2021_06_16_LBK : stitch count
          document.getElementById('stitchCount').disabled = false

          if (this.modelData.analysisType !== '01') {
            document.getElementById('samplingSide').disabled = false
            document.getElementById('specialStain').disabled = false
            document.getElementById('immunoStain').disabled = false
            document.getElementById('addStain').disabled = false
          }
          document.getElementById('generalStain').disabled = false
        }
      },
      onChangeCellCount (value) {
        if (value !== '06') {
          document.getElementById('cellCountInputs').disabled = true
        } else {
          document.getElementById('cellCountInputs').disabled = false
        }
      },
      // 2021_06_16_LBK : stitch count
      onChangeStitchCount (value) {
        if (value !== '05') {
          document.getElementById('stitchCountInputs').disabled = true
        } else {
          document.getElementById('stitchCountInputs').disabled = false
        }
      },
      onChangeStainType (value) {
        if (value !== '15') {
          document.getElementById('addStainInput').disabled = true
        } else {
          document.getElementById('addStainInput').disabled = false
        }
      },
      onFavorite (id) {
        this.$modal.show(ModalFavorite, {favoriteId: id}, {
          height: 'auto',
          width: '900px'
        })
      },
      onFavoriteAdd () {
        if ((this.favorites.length + 1) > 5) {
          this.$modal.show(ModalInfo, {item: Constant.IDS_ERROR_FAVORITE_MAX_REGIST}, {
            height: 'auto',
            width: '400px'
          })

          return
        }

        var obj = {
          favoriteId: this.favorites.length + 1,
          favoriteItems: []
        }

        this.$store.dispatch(Constant.ADD_FAVORITE, obj)
      },
      onChangeScanType (type) {
        console.log('onChangeScanType')
        console.log(type)

        if (type === '01') {
          this.modelData.samplingSide = '01'
          this.modelData.stainType = '01'
          this.modelData.cellCount = '01'
          this.modelData.stitchCount = '00'

          document.getElementById('samplingSide').disabled = true
          document.getElementById('specialStain').disabled = true
          document.getElementById('immunoStain').disabled = true
          document.getElementById('addStain').disabled = true
          document.getElementById('cellCount').disabled = false
        } else {
          document.getElementById('samplingSide').disabled = false
          document.getElementById('specialStain').disabled = false
          document.getElementById('immunoStain').disabled = false
          document.getElementById('addStain').disabled = false

          if (type === '03' || type === '04' || type === '05') {
            document.getElementById('cellCount').disabled = true
            this.modelData.cellCount = '01'
            this.modelData.stitchCount = '00'
          } else {
            document.getElementById('cellCount').disabled = false
            this.modelData.cellCount = '05'
            this.modelData.stitchCount = '01'
          }
        }
      },
      maxNum (num) {
        if (num > 10) {
          return 10
        } else {
          return num
        }
      }
    }
  }
</script>

<style>
  .contentHeight {
    height: 300px;
  }
  .contentHeightBm {
    height: 270px;
  }
  .favoriteOn {
    width: 17px;
    height: 17px;
    display: inline-block;
    font-size: 14px;
    line-height: 14px;
    color: black;
    background-color: white;
  }
  .favoriteOff {
    width: 17px;
    height: 17px;
    display: inline-block;
    font-size: 14px;
    line-height: 14px;
    color: black;
    background-color: #4B4B4B;
  }
</style>
