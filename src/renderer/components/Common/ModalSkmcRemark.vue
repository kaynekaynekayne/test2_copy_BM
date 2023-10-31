<template>
  <div class="container">
    <div class="modalTitle"></div>
    <div class="modalContent pb-3 pl-3 pr-3">
      <b-row>
        <b-col cols="3">
          <strong>부서선택</strong>
        </b-col>
        <b-col cols="4">
          <b-form-select v-model="department" size="sm" :options="departmentOptions"></b-form-select>
        </b-col>
      </b-row>

      <!-- remark -->
      <b-card class="mt-2">
        <b-row>
          <b-col cols="2" class="text-center colorWhite" style="background-color: #282828;"></b-col>
          <b-col cols="2" class="text-center colorWhite" style="background-color: #282828;">
            <strong>리마크 코드</strong>
          </b-col>
          <b-col class="text-center colorWhite" style="background-color: #282828;">
            <strong>리마크 내용</strong>
          </b-col>
        </b-row>

        <b-row class="mt-2" v-for="remark in remarkList" :key="remark.remarkCd">
          <b-col cols="2">
            <b-form-checkbox
              v-model="remark.isSelected"
              value="Y"
              unchecked-value="N"
              @change="onSelectRemark(remark)">
            </b-form-checkbox>
          </b-col>
          <b-col cols="3">
            {{ remark.remarkCd }}
          </b-col>
          <b-col>
            <div v-html="remark.remarkDetail">
            </div>
          </b-col>
        </b-row>
      </b-card>

      <div class="text-right mt-3">
        <b-button class="custom-blue-btn" @click="onOk" size="sm">OK</b-button>
        <b-button class="custom-blue-btn" @click="onCancel" size="sm">CANCEL</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Constant from '../../../Constant'
  import worker from '../../workers/promise'
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-skmc-remark',
    props: [],
    mounted () {

    },
    data: function () {
      return {
        department: '01',
        departmentOptions: [
          { value: '01', text: 'department 1' },
          { value: '02', text: 'department 2' }
        ],
        remarkList: [
          { remarkCd: '1', remarkDetail: `1 Normocytic normochromic anemia
                                          2 Neutrophilic leukocytosis
                                          3 R/O) Anemia of chronic disease
                                          4 Iron deficiency anemia
                                          5 Infection or inflammation
                                          6 Hemolytic anemia or bleeding
                                          7 Recommendation : reticulocyte count & ferritin level
                                          8 CRP & ESR , and follow up CBC`,
                           isSelected: 'N' },
          { remarkCd: '5', remarkDetail: `thrombocytosis`, isSelected: 'N'},
          { remarkCd: '11', remarkDetail: `1 Malaria: not found
          2 임상적으로 강력히 의심되면 발열직전 또는 12시간 간격으로 채혈해서 F/U 하십시오.`, isSelected: 'N'}
        ]
      }
    },
    methods: {
      onSelectRemark (remark) {
        console.log('onSelectRemark')
        console.log(remark)
        console.log(this.remarkList)

        this.remarkList.forEach(function(item) {
          if (remark.remarkCd !== item.remarkCd) {
            item.isSelected = 'N'
          } else {
            item.isSelected = remark.isSelected
          }
        })
      },
      onOk (evt) {
        var selectd = this.remarkList.filter(function(item) {
          return item.isSelected === 'Y'
        })

        this.EventBus.$emit('REMARK_SELECTED', selectd)
        this.$emit('close')

        // console.log(selectd)
        //
        // if (selectd.length > 0) {
        //   this.$emit('close')
        // } else {
        //   this.$toasted.show(Constant.IDS_DOWNLOAD_COMPLETE, {
        //     position: 'bottom-center',
        //     duration: '2000'
        //   })
        // }

      },
      onCancel (evt) {
        this.$emit('close')
      },
      onClose (evt) {
        this.$emit('close')
      }
    }
  }
</script>

<style>
  .modalTitle {
    padding: 10px;
  }
</style>
