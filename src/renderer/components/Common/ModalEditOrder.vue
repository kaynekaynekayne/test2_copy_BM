<template>
  <div class="container p-0">
    <div class="modalTitle">
      <span>Edit result data</span>
      <img src="~@/assets/login/ic_clear_black_48dp.png" class="pointer float-right" @click="onClose" />
    </div>
    <div class="modalContent mt-3 pb-3 pl-3 pr-3">
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          BM No.
        </b-col>
        <b-col>
          <b-form-input id="type" type="text" v-model="modelData.bmNo"></b-form-input>
        </b-col>
      </b-row>
      <!-- <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          Tray Slot
        </b-col>
        <b-col>
          <b-form-input id="type" type="text" v-model="modelData.traySlot" disabled></b-form-input>
        </b-col>
      </b-row> -->
      <!-- <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          BARCODE ID
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="barcodeNo" v-model="modelData.barcodeNo" type="text"></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row> -->
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
              <b-form-input id="patientNm" v-model="modelData.patientNm" type="text"></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          Analyzed date
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="analyzedDate" type="text" v-model="modelData.analyzedDate" disabled></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          Signed state
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <b-form-input id="signedState" type="text" v-model="modelData.signedState" disabled></b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2 border-bottom">
        <b-col cols="3" class="pt-1">
          Analysis Slide
        </b-col>
        <b-col>
          <b-row>
            <b-col>
              <img class="barcode p-1" :src="barcodePath" />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="pt-2 pb-2">
        <b-col class="text-right">
          <b-button id="btnOrderEntry" class="custom-blue-btn" @click="onOk" size="sm">OK</b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
  import Constant from '../../../Constant'
  import { mapGetters } from 'vuex'
  const fs = require('fs')
  const path = require('path')
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-edit-order',
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS,
        currentUser: Constant.GET_CURRENT_USER
      })
    },
    props: [
      'item'
    ],
    data: function () {
      return {
        modelData: {
          bmNo: '',
          traySlot: '',
          barcodeNo: '',
          patientId: '',
          patientNm: '',
          analyzedDate: '',
          signedState: '',
          orderId: ''
        },
        barcodePath: '',
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
      }
    },
    mounted () {
      var self = this

      console.log(this.item)

      this.modelData.bmNo = this.item.BM_NO
      this.modelData.traySlot = this.item.CASSET_NO + '-' + this.item.SLOT_NO
      this.modelData.barcodeNo = this.item.BARCODE_NO
      this.modelData.patientId = this.item.PATIENT_ID
      this.modelData.patientNm = this.item.PATIENT_NM
      this.modelData.analyzedDate = this.$stringToDateTime(this.item.ANALYZE_DTTM)
      this.modelData.signedState = this.item.SIGNED_STATE
      this.modelData.orderId = this.item.ORDER_ID

      var rootPath = this.settings.pbiaRootPath + '/' + this.item.SLOT_ID
      var directories = fs.readdirSync(rootPath)

      for (var i = 0; i < directories.length; i++) {
        if (directories[i].includes(this.settings.barcodeDirNm)) {
          var barCodeImages = fs.readdirSync(rootPath + '/' + directories[i]).filter(function (file) {
            return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
          })

          this.barcodePath = 'file://' + rootPath + '/' + directories[i] + '/' + barCodeImages[0]
        }
      }
    },
    methods: {
      onClose (evt) {
        this.$emit('close')
      },
      onOk (evt) {
        var self = this
        var obj = {
          orderId: this.modelData.orderId,
          bmNo: this.modelData.bmNo,
          patientId: this.modelData.patientId,
          patientNm: this.modelData.patientNm,
          userId: this.currentUser.userId
        }

        ipcRenderer.send(Constant.UPDATE_TEST_HISTORY, JSON.stringify(obj))

        self.EventBus.$emit('EDIT_OK')
        self.$emit('close')
      }
    }
  }
</script>

<style>
</style>
