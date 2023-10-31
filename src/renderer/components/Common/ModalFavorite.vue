<template>
  <div class="container p-0">
    <div class="modalTitle">
      <b-row>
        <b-col>
          <img src="~@/assets/icon/chart.png" class="pointer" style="width: 2%;"/>
          <span>Favorites List</span>
          <span class="text-center modalFavoriteOff userSelectNone">{{ favoriteId }}</span>
        </b-col>
      </b-row>
    </div>
    <div class="modalContent mt-3 pb-3 pl-3 pr-3">
      <div>
        <table width="100%">
          <thead>
            <tr class="text-center" style="height: 40px;">
              <th style="width: 45px;">No.</th>
              <th style="width: 45px;">
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
              <th>Sampling Site</th>
              <th>Cell Count</th>
              <th>Stitch Count</th>
              <th>Scan Type</th>
              <th>Stain Type</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-center" v-for="(item, index) in dspFavoriteList" :key="index">
              <td>
                {{ index + 1 }}
              </td>
              <td>
                <b-form-checkbox
                  v-model="item.isSelect"
                  value="true"
                  unchecked-value="false"
                >
                </b-form-checkbox>
              </td>
              <td>
                <b-form-select id="bmSamplingSide" v-model="item.bmSamplingSide" :options="samplingSide" @change="onChangeItemState(item)">
                </b-form-select>
                <!-- <b-form-select v-else id="bmSamplingSide" v-model="item.bmSamplingSide" :options="samplingSide" disabled>
                  <b-form-select-option value="">-</b-form-select-option>
                </b-form-select> -->
              </td>
              <td>
                <b-form-select id="cellCount" v-model="item.cellCount" :options="cellCount" @change="onChangeItemState(item)">
                </b-form-select>
              </td>
              <td>
                <b-form-select id="stitchCount" v-model="item.stitchCount" :options="stitchCount" @change="onChangeItemState(item)">
                </b-form-select>
              </td>
              <td>
                <b-form-select id="analysisType" v-model="item.analysisType" :options="analysisType" @change="onChangeItemState(item)">
                </b-form-select>
              </td>
              <td>
                <b-form-select id="stainType" v-model="item.stainType" :options="stainType" @change="onChangeItemState(item)">
                </b-form-select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-3">
        <b-row>
          <b-col cols="3">
            <div>
              <b-icon icon="plus" class="pointer" @click="onAdd" style="color: #7952b3;"></b-icon>
              <span class="pointer userSelectNone" @click="onAdd">Add</span>
              <b-icon icon="dash" class="pointer" @click="onRemove" style="color: #7952b3;"></b-icon>
              <span class="pointer userSelectNone" @click="onRemove">Remove</span>
            </div>
          </b-col>
          <b-col class="text-right">
            <b-button variant="outline-primary" @click="onUpload" size="sm">Upload</b-button>
            <b-button variant="outline-primary" @click="onCancel" size="sm">Cancel</b-button>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../Constant'

  export default {
    name: 'modal-favorite',
    computed: {
      ...mapGetters({
        favorites: Constant.GET_FAVORITE,
        commonCodeList: Constant.GET_COMMON_CODE_LIST
      })
    },
    props: ['favoriteId'],
    mounted () {
      // 즐겨찾기
      this.favoriteList = this.favorites(this.favoriteId)
      this.dspFavoriteList = JSON.parse(JSON.stringify(this.favoriteList))

      console.log(this.dspFavoriteList)

      this.samplingSide = this.commonCodeList(Constant.GET_CODE_LIST_SAMPLING_STAIN)
      for (var i = 0; i < this.samplingSide.length; i++) {
        this.samplingSide[i].value = this.samplingSide[i].cd
        this.samplingSide[i].text = this.samplingSide[i].cdNm
      }

      this.cellCount = this.commonCodeList(Constant.GET_CODE_LIST_CELL_COUNT)
      for (var i = 0; i < this.cellCount.length; i++) {
        this.cellCount[i].value = this.cellCount[i].cd
        this.cellCount[i].text = this.cellCount[i].cdNm
      }

      this.analysisType = this.commonCodeList(Constant.GET_CODE_LIST_ANALYSIS_TYPE)
      for (var i = 0; i < this.analysisType.length; i++) {
        this.analysisType[i].value = this.analysisType[i].cd
        this.analysisType[i].text = this.analysisType[i].cdNm
      }

      // 2021_06_16_LBK : stitch count
      this.stitchCount = this.commonCodeList(Constant.GET_STITCH_COUNT)
      for (var i = 0; i < this.stitchCount.length; i++) {
        this.stitchCount[i].value = this.stitchCount[i].cd
        this.stitchCount[i].text = this.stitchCount[i].cdNm
      }

      this.stainType = this.stainType.concat(this.commonCodeList(Constant.GET_CODE_LIST_GENERAL_STAIN))
      this.stainType = this.stainType.concat(this.commonCodeList(Constant.GET_CODE_LIST_SPECIAL_STAIN))
      this.stainType = this.stainType.concat(this.commonCodeList(Constant.GET_CODE_LIST_IMMUNO_STAIN))
      for (var i = 0; i < this.stainType.length; i++) {
        this.stainType[i].value = this.stainType[i].cd
        this.stainType[i].text = this.stainType[i].cdNm
      }
    },
    data: function () {
      return {
        favoriteList: [],
        isSelectAll: 'false',
        samplingSide: [],
        cellCount: [],
        analysisType: [],
        stainType: [],
        dspFavoriteList: [],
        // 2021_06_16_LBK : stitch count
        stitchCount: []
      }
    },
    methods: {
      onChangeAll (state) {
        for (var i = 0; i < this.dspFavoriteList.length; i++) {
          if (state === 'true') {
            this.dspFavoriteList[i].isSelect = true
          } else {
            this.dspFavoriteList[i].isSelect = false
          }
        }
      },
      onUpload () {
        var self = this
        var targetList = []
        for (var i = 0; i < this.dspFavoriteList.length; i++) {
          if (this.dspFavoriteList[i].isSelect) {
            this.dspFavoriteList[i].orderNo = this.$getOrderNo()
            targetList.push(this.dspFavoriteList[i])
          }
        }

        if (targetList.length <= 0) {
          this.$toasted.show(Constant.IDS_ERROR_SELECT_TARGETS, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }
        this.sendFavorite(targetList)
      },
      sendFavorite (list) {
        this.EventBus.$emit('UPLOAD_FAVORITE', list)
        this.$emit('close')
      },
      onCancel () {
        this.$emit('close')
      },
      onAdd () {
        var self = this

        if ((this.favoriteList.length + 1) > 12) {
          this.$toasted.show(Constant.IDS_ERROR_FAVORITE_MAX_REGIST2, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        var obj = {
          favoriteId: this.favoriteId,
          row: {
            itemId: this.$getUuid(),
            bmSamplingSide: '01',
            cellCount: '01',
            analysisType: '01',
            stainType: '01',
            stitchCount: '02',
            isSelect: false
          }
        }

        setTimeout(function () {
          self.$store.dispatch(Constant.SET_FAVORITE, obj)
          self.dspFavoriteList = JSON.parse(JSON.stringify(self.favorites(self.favoriteId)))
        }, 10)
      },
      onRemove () {
        var targetList = []
        for (var i = 0; i < this.dspFavoriteList.length; i++) {
          if (this.dspFavoriteList[i].isSelect) {
            targetList.push(this.dspFavoriteList[i])
          }
        }

        if (targetList.length <= 0) {
          this.$toasted.show(Constant.IDS_ERROR_SELECT_TARGETS, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        for (var i = 0; i < targetList.length; i++) {
          targetList[i].favoriteId = this.favoriteId
          this.$store.dispatch(Constant.REMOVE_FAVORITE, targetList[i])
        }

        this.dspFavoriteList = JSON.parse(JSON.stringify(this.favorites(this.favoriteId)))
      },
      // 2020_09_15_LBK : 즐겨찾기 상태 update
      onChangeItemState (item) {
        item.favoriteId = this.favoriteId
        this.$store.dispatch(Constant.UPDATE_FAVORITE, item)
      }
    }
  }
</script>

<style>
  .modalFavoriteOn {
    width: 17px;
    height: 17px;
    display: inline-block;
    font-size: 14px;
    line-height: 17px;
    color: white;
    background-color: black;
  }
  .modalFavoriteOff {
    width: 18px;
    height: 18px;
    display: inline-block;
    font-size: 14px;
    line-height: 17px;
    color: white;
    background-color: #6A6A6A;
  }
</style>
