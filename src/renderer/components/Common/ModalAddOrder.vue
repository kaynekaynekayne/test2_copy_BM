<template>
  <div class="container">
    <div class="btnClose text-right">
      <img src="~@/assets/login/ic_clear_black_48dp.png" class="pointer" @click="onClose" />
    </div>
    <div class="modalTitle">
      Add order data
    </div>
    <div class="modalContent mt-3 pb-3 pl-3 pr-3">
      <b-row class="border-bottom mt-2">
        <b-col>
          <b-form-group>
            <b-row>
              <b-col>
                <b-form-radio size="sm" v-model="rSelected" name="Peripheral" value="01">
                  <span style="font-size: 12px;">Peripheral blood</span>
                </b-form-radio>
              </b-col>
              <b-col>
                <b-form-radio size="sm" v-model="rSelected" name="Body" value="02">
                  <span style="font-size: 12px;">Body fluid</span>
                </b-form-radio>
              </b-col>
            </b-row>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-select v-model="sSelected" :options="sOptions" size="sm"></b-form-select>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          CASSETE NO
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="cassetNo" v-model="modelData.cassetNo" type="number"></b-form-input>
            </b-col>
            <span class="mt-1">-</span>
            <b-col>
              <b-form-input id="slotNo" v-model="modelData.slotNo" type="number"></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          BARCODE ID
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="barcodeId" v-model="modelData.barcodeId" type="text"></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          PATIENT ID
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="patientId" v-model="modelData.patientId" type="text"></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          PATIENT NAME
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="patientName" v-model="modelData.patientName" type="text"></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          WBC COUNT
        </b-col>
        <b-col>
          <b-form-input id="wbcCount" type="text" readonly v-model="sSelected"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2">
        <b-col class="text-right">
          <b-button id="btnOrderEntry" class="custom-blue-btn" @click="onOrderEntry" size="sm">Order entry</b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
  import Constant from '../../../Constant'

  export default {
    name: 'modal-add-order',
    data () {
      return {
        modelData: {
          cassetNo: '',
          slotNo: '',
          barcodeId: '',
          patientId: '',
          patientName: ''
        },
        rSelected: '01',
        sSelected: '100',
        sOptions: [
          { value: '100', text: '100 WBC count' },
          { value: '200', text: '200 WBC count' },
          { value: '300', text: '300 WBC count' },
          { value: '400', text: '400 WBC count' },
          { value: '500', text: '500 WBC count' }
        ]
      }
    },
    methods: {
      onOrderEntry (evt) {
        var tmpObj = {}
        tmpObj.TestType = this.rSelected
        tmpObj.WbcCount = this.sSelected
        tmpObj.TraySlot = this.modelData.cassetNo + '-' + this.modelData.slotNo
        tmpObj.BarcodeID = this.modelData.barcodeId
        tmpObj.PatientId = this.modelData.patientId
        tmpObj.PatientName = this.modelData.patientName
        tmpObj.OrderDate = this.$getDateTime()
        tmpObj.OrderNo = this.$getOrderNo()
        tmpObj.State = 'Ready'

        this.$store.dispatch(Constant.SET_TEST_LIST, tmpObj)
        this.$emit('close')
      },
      onClose (evt) {
        this.$emit('close')
      }
    }
  }
</script>

<style>
</style>
