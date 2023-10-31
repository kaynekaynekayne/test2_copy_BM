<template>
  <b-container id="diagnosisResult" fluid>
    <b-row>
      <b-col class="p-0">
        <b-card id="diagnosisResult" text-variant="white" no-body>
          <b-row class="p-1 pl-2 pr-2 border-bottom borderColorGray">
            <b-col>
              <b-badge class="p-2" variant="secondary">{{ pbBarcode }}</b-badge>
              <b-badge class="p-2" variant="secondary">{{ selectedItem.BARCODE_NO }}</b-badge>
            </b-col>
            <b-col class="text-right">
              <b-button variant="outline-primary" size="sm" @click="onClickSubmit">Submit</b-button>
            </b-col>
          </b-row>
          <b-row class="p-2">
            <b-col>
              <b-form-input type="number" size="sm" v-model="modelAge" placeholder="age"></b-form-input>
            </b-col>
            <b-col>
              <b-form-select v-model="modelSex" :options="sexOption" size="sm"></b-form-select>
            </b-col>
          </b-row>

          <b-row class="p-2">
            <b-col>
              <div style="overflow-y: scroll; overflow-x: hidden; height: 300px; margin-top: 39px;">
                <div v-for="(diag, index) in diagnosisConditions" :key="index">
                  <li>{{ diag }}</li>
                </div>
              </div>
              <div v-if="diagResults.length > 0" style="overflow-y: scroll; overflow-x: hidden; height: 450px; margin-top: 39px;">
                <div>Suggest Diagnosis</div>
                <div v-for="(result, index) in diagResults" :key="index">
                  <li>{{ result }}</li>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import ModalConfirm from '../../../Common/ModalConfirm'
  import worker from '../../../../workers/promise'

  export default {
    name: 'dignosis-result',
    computed: {
      ...mapGetters({
        currentUser: Constant.GET_CURRENT_USER,
        cbcList: Constant.GET_CBC_LIST
      })
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newVal, oldVal) { // watch it
        console.log(newVal)
        this.selectedItem = newVal
      }
    },
    data () {
      return {
        selectedItem: {},
        pbBarcode: '-',
        pbTreeData: null,
        diagnosisConditions: [],
        diagResults: [],
        diagCbcDataList: [],
        modelAge: '',
        modelSex: '01',
        sexOption: [
          { value: '01', text: 'male'},
          { value: '02', text: 'female'}
        ]
      }
    },
    beforeDestroy () {
      this.EventBus.$off('DIAG_PB_ITEM_SELECTED')
      this.EventBus.$off('SUBMIT_DIAGNOSIS')
      this.EventBus.$off('SEND_PB_TREE_DATA')
      this.EventBus.$off('SEND_BM_TREE_DATA')
      this.EventBus.$off('RECEIVE_DATA')
      this.EventBus.$off('CBC_DATA_LOADED')

    },
    mounted () {
      var self = this

      this.EventBus.$on('CBC_DATA_LOADED', function (obj) {
        console.log(obj)
        self.diagCbcDataList = obj
      })

      this.EventBus.$on('DIAG_PB_ITEM_SELECTED', function(params) {
        console.log('DIAG_PB_ITEM_SELECTED : ' + params)
        self.pbBarcode = params
      })

      this.EventBus.$on('SUBMIT_DIAGNOSIS', function(params) {
        self.sendDiagnosis()
      })

      this.EventBus.$on('SEND_PB_TREE_DATA', function(params) {
        console.log(params)
        self.pbTreeData = params
      })

      this.EventBus.$on('SEND_BM_TREE_DATA', function(params) {
        console.log(params)
        self.bmTreeData = params
      })

      this.EventBus.$on('RECEIVE_DATA', function(params) {
        var jobCmd = params.jobCmd
        console.log(params)
        if (jobCmd === 'SEARCH_DIAGNOSIS') {
          self.diagnosisConditions = params.diagnosisConditions
          self.diagResults = params.diagnosis
          self.EventBus.$emit('SEND_DIAG_RESULT', params.diagnosis)
        }
      })

    },
    methods: {
      sendDiagnosis() {
        console.log('SUBMIT_DIAGNOSIS')
        // console.log(this.pbTreeData)
        // console.log(this.bmTreeData)
        // console.log(this.selectedItem)
        var self = this

        var reqObj = {
          jobCmd: 'SEARCH_DIAGNOSIS',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          cbcInfo: {},
          rbcSize: {},
          rbcChromia: {},
          rbcShape: {},
          rbcInclusionBody: {},
          rbcDistribution: {},
          wbcClassification: {},
          blastOptions: [],
          neutrophilMorphology: [],
          plt: [],
          pastHistory: [],
          presentClinicalImpression: [],
          // cellularity: this.selectedItem.CELLULARITY,
          // meRatio: this.selectedItem.ME_RATIO,
          cellularity: this.bmTreeData.modelCellularity,
          meRatio: this.bmTreeData['08'].data.value,
          blastCount: [],
          bmBiopsyClotSection: [],
          megakaryocyte: {},
          bmIronStain: [],
          bmDysplasia: [],
          bmCellClassification: {},
          hemophagocytic: '',
          mpo: '',
          nseAfterNaf: ''
        }

        console.log(this.cbcList)
        console.log(this.pbTreeData)
        console.log(this.bmTreeData)

        // CBC
        var patientInfo = {}
        patientInfo.age = this.modelAge
        patientInfo.sex = this.modelSex
        patientInfo.name = '0'
        patientInfo.patientNo = '0'
        reqObj.cbcInfo.patientInfo = patientInfo

        var data = []

        self.cbcList.forEach(function(iaCbcData) {
          self.diagCbcDataList.forEach(function(diagCbcData) {
            if (iaCbcData.cd === diagCbcData.iaCd) {
              data.cd = diagCbcData.iaCd
              data.value = diagCbcData.count

              data.push({value: diagCbcData.count, cd: diagCbcData.iaCd})
            }
          })
        })

        reqObj.cbcInfo.data = data

        // rbc size
        reqObj.rbcSize.normal = this.pbTreeData['01_01'].data.value
        reqObj.rbcSize.microcyte = this.pbTreeData['01_02'].data.value
        reqObj.rbcSize.macrocyte = this.pbTreeData['01_03'].data.value
        reqObj.rbcSize.anisocytosis = this.pbTreeData['01_04'].data.value

        // rbc chromia
        reqObj.rbcChromia.normal = this.pbTreeData['02_01'].data.value
        reqObj.rbcChromia.hypochromia = this.pbTreeData['02_02'].data.value
        reqObj.rbcChromia.hyperchromia = this.pbTreeData['02_03'].data.value
        reqObj.rbcChromia.polychromia = this.pbTreeData['02_04'].data.value

        // rbc shape
        reqObj.rbcShape.normal = this.pbTreeData['03_01'].data.value
        reqObj.rbcShape.poikilocytosis = this.pbTreeData['03_02'].data.value
        reqObj.rbcShape.targetCells = this.pbTreeData['03_03'].data.value
        reqObj.rbcShape.burrCell = this.pbTreeData['03_04'].data.value
        reqObj.rbcShape.ovalocytes = this.pbTreeData['03_05'].data.value
        reqObj.rbcShape.schistocytes = this.pbTreeData['03_06'].data.value
        reqObj.rbcShape.sickleCells = this.pbTreeData['03_07'].data.value
        reqObj.rbcShape.stomatocytes = this.pbTreeData['03_08'].data.value
        reqObj.rbcShape.tearDropCells = this.pbTreeData['03_09'].data.value
        reqObj.rbcShape.spherocytes = this.pbTreeData['03_10'].data.value
        reqObj.rbcShape.dimorphism = this.pbTreeData['03_11'].data.value

        // rbc inclusion body
        reqObj.rbcInclusionBody.howellJollyBodies = this.pbTreeData['05_01'].data.value
        reqObj.rbcInclusionBody.basophilicStippling = this.pbTreeData['05_02'].data.value
        reqObj.rbcInclusionBody.malaria = this.pbTreeData['05_03'].data.value
        reqObj.rbcInclusionBody.platelets = this.pbTreeData['05_04'].data.value

        // rbc distribution
        if (this.pbTreeData['06_01'].data.checked) {
          reqObj.rbcDistribution.normal = 'P'
        } else {
          reqObj.rbcDistribution.normal = 'N'
        }

        if (this.pbTreeData['06_02'].data.checked) {
          reqObj.rbcDistribution.rouleauxFormation = 'P'
        } else {
          reqObj.rbcDistribution.rouleauxFormation = 'N'
        }

        if (this.pbTreeData['06_03'].data.checked) {
          reqObj.rbcDistribution.agglutination = 'P'
        } else {
          reqObj.rbcDistribution.agglutination = 'N'
        }

        // wbc classification
        if (typeof(this.pbTreeData['07_01'].data.value) !== 'undefined') {
          reqObj.wbcClassification.neutrophil = this.pbTreeData['07_01'].data.value
        } else {
          reqObj.wbcClassification.neutrophil = '0'
        }
        if (typeof(this.pbTreeData['07_71'].data.value) !== 'undefined') {
          reqObj.wbcClassification.neutrophilSegmentation = this.pbTreeData['07_71'].data.value
        } else {
          reqObj.wbcClassification.neutrophilSegmentation = '0'
        }
        if (typeof(this.pbTreeData['07_72'].data.value) !== 'undefined') {
          reqObj.wbcClassification.neutrophilBand = this.pbTreeData['07_72'].data.value
        } else {
          reqObj.wbcClassification.neutrophilBand = '0'
        }

        reqObj.wbcClassification.metamyelocyte = this.pbTreeData['07_02'].data.value
        reqObj.wbcClassification.myelocyte = this.pbTreeData['07_03'].data.value
        reqObj.wbcClassification.promyelocyte = this.pbTreeData['07_04'].data.value
        reqObj.wbcClassification.lymphocyte = this.pbTreeData['07_05'].data.value
        reqObj.wbcClassification.reactiveLymphocyte = this.pbTreeData['07_61'].data.value
        reqObj.wbcClassification.abnormalLymphocyte = this.pbTreeData['07_62'].data.value
        reqObj.wbcClassification.monocyte = this.pbTreeData['07_07'].data.value
        reqObj.wbcClassification.eosinophil = this.pbTreeData['07_08'].data.value
        reqObj.wbcClassification.basophil = this.pbTreeData['07_09'].data.value
        reqObj.wbcClassification.blast = this.pbTreeData['07_10'].data.value
        reqObj.wbcClassification.plasmaCell = this.pbTreeData['07_11'].data.value
        reqObj.wbcClassification.nrbc = this.pbTreeData['07_12'].data.value
        reqObj.wbcClassification.giantPlatelet = this.pbTreeData['07_13'].data.value
        reqObj.wbcClassification.plateletAggregation = this.pbTreeData['07_14'].data.value
        reqObj.wbcClassification.malaria = this.pbTreeData['07_16'].data.value
        reqObj.wbcClassification.artifact = this.pbTreeData['07_15'].data.value

        reqObj.pbProlyLymp = this.pbTreeData.modelProlyLymp
        reqObj.hairyCell = this.pbTreeData.modelHairyCell

        // reqObj.wbcClassification.blastOptions = []
        // this.pbTreeData['07_10'].children.forEach(function(item) {
        //   if (item.data.checked) {
        //     reqObj.wbcClassification.blastOptions.push(item.data.id.substr(3, item.data.id.length - 1))
        //   }
        // })

        // blast
        reqObj.blastOptions = []

        this.pbTreeData['08'].children.forEach(function(item) {
          if (item.data.checked) {
            reqObj.blastOptions.push(item.data.id.substr(3, item.data.id.length - 1))
          }
        })

        // neutrophil morphology
        this.pbTreeData['09'].children.forEach(function(item) {
          if (item.data.checked) {
            reqObj.neutrophilMorphology.push(item.data.id.substr(3, item.data.id.length - 1))
          }
        })

        // past history
        this.pbTreeData['10'].children.forEach(function(item) {
          if (item.data.checked) {
            reqObj.pastHistory.push(item.data.id.substr(3, item.data.id.length - 1))
          }
        })

        // present clinical impression
        this.pbTreeData['11'].children.forEach(function(item) {
          if (item.data.checked) {
            reqObj.presentClinicalImpression.push(item.data.id.substr(3, item.data.id.length - 1))
          }
        })

        // blast count
        this.bmTreeData['09'].children.forEach(function(item) {
          if (item.data.checked) {
            reqObj.blastCount.push(item.data.id.substr(3, item.data.id.length - 1))
          }
        })

        // bm biopsy clot section
        this.bmTreeData['10'].children.forEach(function(item) {
          if (item.data.checked) {
            reqObj.bmBiopsyClotSection.push(item.data.id.substr(3, item.data.id.length - 1))
          }
        })

        // megakaryocyte bm
        reqObj.megakaryocyte.bm = []
        this.bmTreeData['11_01'].children.forEach(function(item) {
          if (item.data.checked) {
            reqObj.megakaryocyte.bm.push(item.data.id.substr(6, item.data.id.length - 1))
          }
        })

        // megakaryocyte bmBiopsy
        reqObj.megakaryocyte.bmBiopsy = []
        this.bmTreeData['11_02'].children.forEach(function(item) {
          if (item.data.checked) {
            reqObj.megakaryocyte.bmBiopsy.push(item.data.id.substr(6, item.data.id.length - 1))
          }
        })

        // bmIronStain
        this.bmTreeData['12'].children.forEach(function(item) {
          if (item.data.checked) {
            reqObj.bmIronStain.push(item.data.id.substr(3, item.data.id.length - 1))
          }
        })

        // bmDysplasia
        this.bmTreeData['13'].children.forEach(function(item) {
          if (item.data.checked) {
            reqObj.bmDysplasia.push(item.data.id.substr(3, item.data.id.length - 1))
          }
        })

        // bm cell classification
        reqObj.bmCellClassification.neutrophil = this.bmTreeData['14_01'].data.value
        reqObj.bmCellClassification.metamyelocyte = this.bmTreeData['14_02'].data.value
        reqObj.bmCellClassification.myelocyte = this.bmTreeData['14_03'].data.value
        reqObj.bmCellClassification.promyelocyte = this.bmTreeData['14_04'].data.value
        reqObj.bmCellClassification.lymphocyte = this.bmTreeData['14_05'].data.value
        reqObj.bmCellClassification.abnormalLymphocyte = this.bmTreeData['14_06'].data.value
        reqObj.bmCellClassification.monocyte = this.bmTreeData['14_07'].data.value
        reqObj.bmCellClassification.eosinophil = this.bmTreeData['14_08'].data.value
        reqObj.bmCellClassification.basophil = this.bmTreeData['14_09'].data.value
        reqObj.bmCellClassification.blast = this.bmTreeData['14_10'].data.value
        reqObj.bmCellClassification.plasmaCell = this.bmTreeData['14_11'].data.value
        reqObj.bmCellClassification.orthochromicNormoblast = this.bmTreeData['14_12'].data.value
        reqObj.bmCellClassification.polychromicNormoblast = this.bmTreeData['14_13'].data.value
        reqObj.bmCellClassification.basophilicNormoblast = this.bmTreeData['14_14'].data.value
        reqObj.bmCellClassification.proerythroblast = this.bmTreeData['14_15'].data.value
        reqObj.bmCellClassification.others = this.bmTreeData['14_16'].data.value

        reqObj.hemophagocytic = this.bmTreeData.modelHemophagocytic
        reqObj.mpo = this.bmTreeData.modelMpo
        reqObj.nseAfterNaf = this.bmTreeData.modelNseAfterNaf
        reqObj.bmProlyLymp = this.bmTreeData.modelProlyLymp
        reqObj.cellularity = this.bmTreeData.modelCellularity

        console.log(reqObj)
        worker.sendDataToServer(this, JSON.stringify(reqObj))
      },
      onClickSubmit() {
        console.log('onClickSubmit : ' + this.pbBarcode)
        if (this.pbBarcode !== '-') {
          // 진단 로직 -start-
          this.$modal.show(ModalConfirm, {openType: 'diagSubmit', message: 'Do you want to query diagnostic results?'}, {
            height: 'auto',
            width: '350px'
          })
        } else {
          this.$toasted.show(Constant.IDS_ERROR_PLASE_SELECT_A_PB_ITEM, {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      }
    }
  }
</script>

<style>
  #diagnosisResult {
    background-color: #282828 !important;
    border-radius: 5px;
    box-shadow: 2px 2px 2px black;
    border: 1px solid #303744;
    height: 912px;
  }
</style>
