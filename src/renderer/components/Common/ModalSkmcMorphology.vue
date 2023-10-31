<template>
  <div class="container">
    <div class="modalTitle"></div>
    <div class="modalContent pb-3 pl-3 pr-3">
      <b-row>
        <b-col cols="3">
          <strong>종합결과코드</strong>
        </b-col>
        <b-col cols="4">
          <b-form-select v-model="overallResultCd" size="sm" :options="overallResultCdOptions"></b-form-select>
        </b-col>
      </b-row>

      <!-- RBC morphology -->
      <b-card class="mt-2">
        <b-row>
          <b-col class="text-center colorWhite" style="background-color: #282828;">
            <strong>RBC morphology</strong>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col>
            <b-row>
              <b-col>
                <div>Size</div>
              </b-col>
              <b-col>
                <b-form-select v-model="rbcSize" size="sm" :options="rbcSizeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>Chromicity</div>
              </b-col>
              <b-col>
                <b-form-select v-model="rbcChromia" size="sm" :options="rbcChromiaOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>Anisocytosis</div>
              </b-col>
              <b-col>
                <b-form-select v-model="anisocytosis" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>Poikilocytosis</div>
              </b-col>
              <b-col>
                <b-form-select v-model="poikilocytosis" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>elliptocyte</div>
              </b-col>
              <b-col>
                <b-form-select v-model="elliptocyte" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>burr cell</div>
              </b-col>
              <b-col>
                <b-form-select v-model="buurCell" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>target cell</div>
              </b-col>
              <b-col>
                <b-form-select v-model="targetCell" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>spherocyte</div>
              </b-col>
              <b-col>
                <b-form-select v-model="spherocyte" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
          </b-col>

          <b-col>
            <b-row class="mt-1">
              <b-col>
                <div>Schistocyte</div>
              </b-col>
              <b-col>
                <b-form-select v-model="schistocyte" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>dimorphism</div>
              </b-col>
              <b-col>
                <b-form-select v-model="dimorphism" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>rouleaux</div>
              </b-col>
              <b-col>
                <b-form-select v-model="rouleaux" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>polychromasia</div>
              </b-col>
              <b-col>
                <b-form-select v-model="polychromasia" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>baso</div>
              </b-col>
              <b-col>
                <b-form-select v-model="baso" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>H - J body</div>
              </b-col>
              <b-col>
                <b-form-select v-model="hjBody" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>Nucleated RBC</div>
              </b-col>
              <b-col>
                <b-row>
                  <b-col class="pr-0">
                    <b-form-input type="number" size="sm" v-model="nucleatedRbc"></b-form-input>
                  </b-col>
                  <b-col>
                    <span style="font-size: 12px;">/ 100WBC'S</span>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>기타</div>
              </b-col>
              <b-col>
                <b-row>
                  <b-col>
                    <b-form-input size="sm" v-model="rbcOthers"></b-form-input>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row>
          <!-- WBC morphology -->
          <b-col>
            <b-row class="mt-1">
              <b-col class="text-center colorWhite" style="background-color: #282828;">
                <strong>WBC morphology</strong>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>Number</div>
              </b-col>
              <b-col>
                <b-form-select v-model="wbcNumber" size="sm" :options="wbcNumberOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>Toxic granule</div>
              </b-col>
              <b-col>
                <b-form-select v-model="wbcTocxicgranule" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>Toxic vacuole</div>
              </b-col>
              <b-col>
                <b-form-select v-model="wbcTocxicVacuole" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>Dohle body</div>
              </b-col>
              <b-col>
                <b-form-select v-model="wbcDohleBody" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>L-S maturation</div>
              </b-col>
              <b-col>
                <b-form-select v-model="wbcLsMaturation" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>N-segmentation</div>
              </b-col>
              <b-col>
                <b-form-select v-model="nSegmentation" size="sm" :options="nSegmentationOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>기타</div>
              </b-col>
              <b-col>
                <b-form-input size="sm" v-model="wbcOthers"></b-form-input>
              </b-col>
            </b-row>
          </b-col>

          <!-- Platelet morphology -->
          <b-col>
            <b-row class="mt-1">
              <b-col class="text-center colorWhite" style="background-color: #282828;">
                <strong>Platelet morphology</strong>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>Number</div>
              </b-col>
              <b-col>
                <b-form-select v-model="plateletNumber" size="sm" :options="plateletNumberOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col>
                <div>Size</div>
              </b-col>
              <b-col>
                <b-form-select v-model="plateletSize" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div>Clumping</div>
              </b-col>
              <b-col>
                <b-form-select v-model="clumping" size="sm" :options="degreeOptions"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col>
                <b-button class="custom-blue-btn w-100" @click="onSelectRemark" size="sm">Select remark</b-button>
                <b-button class="custom-blue-btn w-100 mt-2" @click="onDeleteRemark" size="sm">Delete remark</b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <!-- remark -->
        <b-row class="mt-1">
          <b-col class="text-center colorWhite" style="background-color: #282828;">
            <strong>Remark</strong>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="p-0 colorWhite">
            <b-form-textarea id="remarkArea" v-model="remark.remarkDetail" rows="5">
            </b-form-textarea>
            <!-- <div v-html="remark.remarkDetail" style="height: 120px; background-color: #282828; overflow-y: scroll;"> -->
            <!-- </div> -->
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
  import ModalSkmcRemark from './ModalSkmcRemark'
  import ModalConfirm from './ModalConfirm'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-skmc-morphology',
    props: [],
    mounted () {
      var self = this

      this.EventBus.$on('REMARK_SELECTED', function(selectedRemarkList) {
        self.remark = selectedRemarkList[0]
      })
    },
    data: function () {
      return {
        wbcOthers: 0,
        rbcOthers: 0,
        nucleatedRbc: 0,
        remark: {},
        overallResultCd: '01',
        overallResultCdOptions: [
          { value: '01', text: 'result cd 1' },
          { value: '02', text: 'result cd 2' },
          { value: '03', text: 'result cd 3' },
          { value: '04', text: 'result cd 4' },
          { value: '05', text: 'result cd 5' }
        ],
        rbcSize: '01',
        rbcSizeOptions: [
          { value: '01', text: 'rbc size 1' },
          { value: '02', text: 'rbc size 2' }
        ],
        rbcChromia: '01',
        rbcChromiaOptions: [
          { value: '01', text: 'rbc chromia 1' },
          { value: '02', text: 'rbc chromia 2' }
        ],
        anisocytosis: '-',
        poikilocytosis: '-',
        elliptocyte: '-',
        buurCell: '-',
        targetCell: '-',
        spherocyte: '-',
        schistocyte: '-',
        dimorphism: '-',
        rouleaux: '-',
        polychromasia: '-',
        baso: '-',
        hjBody: '-',
        wbcNumber: '01',
        wbcNumberOptions: [
          { value: '01', text: 'wbc normal 1' },
          { value: '02', text: 'wbc normal 2' }
        ],
        wbcTocxicgranule: '-',
        wbcTocxicVacuole: '-',
        wbcDohleBody: '-',
        wbcLsMaturation: '-',
        nSegmentation: '01',
        nSegmentationOptions: [
          { value: '01', text: 'segmentation number 1' },
          { value: '02', text: 'segmentation number 2' }
        ],
        plateletNumber: '01',
        plateletNumberOptions: [
          { value: '01', text: 'plt number 1' },
          { value: '02', text: 'plt number 2' }
        ],
        plateletSize: '-',
        clumping: '-',
        degreeOptions: [
          { value: '-', text: '-' },
          { value: '00', text: 'trace' },
          { value: '01', text: '1+' },
          { value: '02', text: '2+' },
          { value: '03', text: '3+' },
          { value: '04', text: '4+' }
        ]
      }
    },
    methods: {
      onOk (evt) {
        var params = {
          wbcOthers: this.wbcOthers,
          rbcOthers: this.rbcOthers,
          nucleatedRbc: this.nucleatedRbc,
          overallResultCd: this.overallResultCd,
          rbcSize: this.rbcSize,
          rbcChromia: this.rbcChromia,
          anisocytosis: this.anisocytosis,
          poikilocytosis: this.poikilocytosis,
          elliptocyte: this.elliptocyte,
          buurCell: this.buurCell,
          targetCell: this.targetCell,
          spherocyte: this.spherocyte,
          schistocyte: this.schistocyte,
          dimorphism: this.dimorphism,
          rouleaux: this.rouleaux,
          polychromasia: this.polychromasia,
          baso: this.baso,
          hjBody: this.hjBody,
          wbcNumber: this.wbcNumber,
          wbcTocxicgranule: this.wbcTocxicgranule,
          wbcTocxicVacuole: this.wbcTocxicVacuole,
          wbcDohleBody: this.wbcDohleBody,
          wbcLsMaturation: this.wbcLsMaturation,
          nSegmentation: this.nSegmentation,
          plateletNumber: this.plateletNumber,
          plateletSize: this.plateletSize,
          clumping: this.clumping,
          remark: this.remark
        }

        this.$modal.show(ModalConfirm, {openType: 'lisUploadSkmc', message: Constant.IDS_MSG_UPLOAD_LIS, item: params}, {
          height: 'auto',
          width: '350px'
        })

        // this.$emit('close')
      },
      onCancel (evt) {
        this.$emit('close')
      },
      onSelectRemark (evt) {
        this.$modal.show(ModalSkmcRemark, {}, {
          height: 'auto',
          width: '800px'
        })
      },
      onDeleteRemark (evt) {
        this.remark = {}
      }
    }
  }
</script>

<style>
  .modalTitle {
    padding: 10px;
  }
</style>
