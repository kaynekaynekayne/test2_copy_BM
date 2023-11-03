<template>
  <b-container id="orderInput" class="text-center colorWhite p-0 h-100" fluid>
    <b-card class="blackCard p-0 h-100" text-variant="white" no-body>
      <b-row>
        <!-- <b-col cols="7">
          <div class="blackCardTitle p-2">
            <b-nav>
              <b-nav-item v-for="(item, index) in tabList" :id="item" :key="item" @click="onLink(item)" link-classes="tabStyle">{{ item }}</b-nav-item>
            </b-nav>
          </div>
        </b-col> -->
        <b-col class="text-right pt-2 pb-2 pr-4">
          <b-button variant="primary" size="sm" @click="onNewOrder">New order</b-button>
        </b-col>
      </b-row>
      <div class="pl-2 pr-2 pb-2">
        <div id="cardContent" class="p-2">
          <b-row class="pr-2">
            <b-col class="panelSubTitle pt-1 pl-3 text-left" cols="5">
              Sample Slot No. <span>&nbsp&nbsp&nbsp:</span>
            </b-col>
            <b-col>
              <b-row>
                <b-col>
                  <b-form-select class="borderNone" v-bind:class="{disabledColor : !isNewOrder}" id="cassetNo" v-model="modelData.cassetNo" :options="cassetNoList"></b-form-select>
                </b-col>
                <span class="mt-1">-</span>
                <b-col>
                  <b-form-select class="borderNone" v-bind:class="{disabledColor : !isNewOrder}" id="slotNo" v-model="modelData.slotNo" :options="slotNoList"></b-form-select>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="mt-2 pr-2">
            <b-col class="panelSubTitle pt-1 pl-3 text-left" cols="5">
              BM No. <span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</span>
            </b-col>
            <b-col>
              <b-form-input class="borderNone" v-bind:class="{disabledColor : !isNewOrder}" id="bmNo" type="text" v-model="modelData.bmNo"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mt-2 pr-2">
            <b-col class="panelSubTitle pt-1 pl-3 text-left" cols="5">
              Patient ID <span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</span>
            </b-col>
            <b-col>
              <b-form-input class="borderNone" v-bind:class="{disabledColor : !isNewOrder}" id="patientId" type="text" v-model="modelData.patientId"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mt-2 pr-2">
            <b-col class="panelSubTitle pt-1 pl-3 text-left" cols="5">
              Name <span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</span>
            </b-col>
            <b-col>
              <b-form-input class="borderNone" v-bind:class="{disabledColor : !isNewOrder}" id="patientName" type="text" v-model="modelData.patientName"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mt-2 pr-2">
            <b-col class="panelSubTitle pt-1 pl-3 text-left" cols="5">
              Age / Gender <span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</span>
            </b-col>
            <b-col>
              <b-row>
                <b-col>
                  <b-form-input class="borderNone" v-bind:class="{disabledColor : !isNewOrder}" id="age" type="number" v-model="modelData.age" min="1"></b-form-input>
                </b-col>
                <span class="mt-1">/</span>
                <b-col>
                  <b-form-select class="borderNone" v-bind:class="{disabledColor : !isNewOrder}" id="gender" v-model="modelData.gender" :options="genderList"></b-form-select>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="mt-2 pr-2">
            <b-col class="panelSubTitle pt-1 pl-3 text-left" cols="5">
              Department <span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp:</span>
            </b-col>
            <b-col>
              <b-form-input class="borderNone" v-bind:class="{disabledColor : !isNewOrder}" id="departMent" type="text" v-model="modelData.departMent"></b-form-input>
            </b-col>
          </b-row>
        </div>
      </div>
      <div class="text-right pb-2 pr-4">
        <b-button v-bind:class="{disabledColor : !isNewOrder}" id="upload" variant="outline-light" size="sm" @click="onUpload">Upload</b-button>
        <b-button v-bind:class="{disabledColor : !isNewOrder}" id="cancel" variant="outline-light" size="sm" @click="onCancel">Cancel</b-button>
      </div>
    </b-card>
  </b-container>
</template>

<script>
  import Constant from '../../../../Constant'
  import ModalInfo from '../../Common/ModalInfo'
  import { mapGetters } from 'vuex'

  export default {
    name: 'order-input',
    computed: {
      ...mapGetters({
        commonCodeList: Constant.GET_COMMON_CODE_LIST
      })
    },
    mounted () {
      var self = this

      // this.onLink('PB')
      this.loadElementState()

      this.genderList = this.commonCodeList(Constant.GET_CODE_LIST_GENDER)
      for (var i = 0; i < this.genderList.length; i++ ) {
        this.genderList[i].value = this.genderList[i].cd
        this.genderList[i].text = this.genderList[i].cdNm
      }

      this.EventBus.$on('UPLOAD_FAVORITE', function(params) {
        for (var i = 0; i < params.length; i++) {
          params[i].gender = self.modelData.gender
          params[i].cassetNo = self.modelData.cassetNo
          params[i].patientId = self.modelData.patientId
          params[i].patientName = self.modelData.patientName
          params[i].age = self.modelData.age
          params[i].departMent = self.modelData.departMent
          params[i].bmNo = self.modelData.bmNo
        }

        this.EventBus.$emit('UPLOAD_FAVORITE_COMP', params)
      })

    },
    beforeDestroy () {
      // remove EventBus
      this.EventBus.$off('UPLOAD_FAVORITE')
    },
    data () {
      return {
        modelData: {
          // 성별
          gender: '01',
          // 카세트 번호
          cassetNo: '1',
          // 슬롯 번호
          slotNo: '1',
          // BM 번호
          bmNo: '',
          // 고객 ID
          patientId: '',
          // 고객 명
          patientName: '',
          // 나이
          age: '',
          // 부서
          departMent: ''
        },
        genderList: [],
        // 카세트 번호 목록
        cassetNoList: ['1'],
        // 슬롯 번호 목록
        slotNoList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        // 메인 탭 목록
        // tabList: ['PB', 'BM', 'BF'], 2020_08_27 : 삭제
        // 신규 등록
        isNewOrder: false,
        // 선택한 테스트 tab
        selectedTestType: 'BM'
      }
    },
    methods: {
      loadElementState () {
        if (!this.isNewOrder) {
          document.getElementById('cassetNo').disabled = true
          document.getElementById('slotNo').disabled = true
          document.getElementById('bmNo').disabled = true
          document.getElementById('patientId').disabled = true
          document.getElementById('patientName').disabled = true
          document.getElementById('age').disabled = true
          document.getElementById('gender').disabled = true
          document.getElementById('departMent').disabled = true
          document.getElementById('upload').disabled = true
          document.getElementById('cancel').disabled = true
        } else {
          document.getElementById('cassetNo').disabled = false
          document.getElementById('slotNo').disabled = false
          document.getElementById('bmNo').disabled = false
          document.getElementById('patientId').disabled = false
          document.getElementById('patientName').disabled = false
          document.getElementById('age').disabled = false
          document.getElementById('gender').disabled = false
          document.getElementById('departMent').disabled = false
          document.getElementById('upload').disabled = false
          document.getElementById('cancel').disabled = false
        }
        // this.EventBus.$emit('SELECT_TEST_TYPE', this.selectedTestType)
      },
      // 2020_08_27 : 삭제
      // onLink (item) {
      //   this.selectedTestType = item
      //
      //
      //   // for (var i = 0; i < this.tabList.length; i++) {
      //   //   if (this.tabList[i] === item) {
      //   //     document.getElementById(item).classList.add('activeClass')
      //   //   } else {
      //   //     document.getElementById(this.tabList[i]).classList.remove('activeClass')
      //   //   }
      //   // }
      //
      //   this.EventBus.$emit('SELECT_TEST_TYPE', this.selectedTestType)
      // },
      onNewOrder () {
        this.isNewOrder = true
        this.loadElementState()
        this.EventBus.$emit('NEW_ORDER', this.isNewOrder)
      },
      onUpload () {
        this.modelData.selectedTestType = this.selectedTestType
        this.EventBus.$emit('UPLOAD_ORDER', this.modelData)

        if (Number(this.modelData.slotNo) < 12) {
          this.modelData.slotNo = String(Number(this.modelData.slotNo) + 1)
        }
      },
      onCancel () {
        this.modelData.gender = '01'
        this.modelData.bmNo = ''
        this.modelData.patientId = ''
        this.modelData.patientName = ''
        this.modelData.age = ''
        this.modelData.departMent = ''

        this.isNewOrder = false
        this.loadElementState()
        this.EventBus.$emit('NEW_ORDER', this.isNewOrder)
      }
    }
  }
</script>

<style>
</style>
