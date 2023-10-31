<template>
  <b-container id="rbcClassification" fluid>
    <b-row>
      <b-col class="p-0">
        <b-card id="rbcInfoCard" text-variant="white" no-body>
          <div id="divRbcWrapper">
            <div class="panelTitle">RBC Classification</div>
            <b-row class="mt-3">
              <b-col v-for="field in rbcFields" :key="field">
                {{ field }}
              </b-col>
            </b-row>
            <div>
              <b-row v-for="(rbc, index) in rbcClassList" class="mt-2 panelContent" :key="index">
                <b-col>
                  <div v-if="rbc.CATEGORY_ID === '01' && index === 0">{{ rbc.CATEGORY_NM }}</div>
                  <div v-if="rbc.CATEGORY_ID === '02' && index === 4">{{ rbc.CATEGORY_NM }}</div>
                  <div v-if="rbc.CATEGORY_ID === '03' && index === 8">{{ rbc.CATEGORY_NM }}</div>
                  <!-- <div v-if="rbc.CATEGORY_ID === '04' && index === 18">{{ rbc.CATEGORY_NM }}</div> -->
                  <div v-if="rbc.CATEGORY_ID === '05' && index === 18">{{ rbc.CATEGORY_NM }}</div>
                </b-col>
                <b-col>
                  {{ rbc.CLASS_NM }}
                </b-col>
                <b-col v-if="((rbc.CATEGORY_ID === '01' || rbc.CATEGORY_ID === '02' || rbc.CATEGORY_ID === '03') && rbc.CLASS_ID !== '01') || (rbc.CATEGORY_ID === '05')"
                  class="pointer"
                  @click="onClickDegree($event, rbc)">
                  <div v-if="rbc.DEGREE === '1'">
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 0" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 1" />
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 2" />
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 3" />
                  </div>
                  <div v-else-if="rbc.DEGREE === '2'">
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 0" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 1" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 2" />
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 3" />
                  </div>
                  <div v-else-if="rbc.DEGREE === '3'">
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 0" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 1" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 2" />
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 3" />
                  </div>
                  <div v-else>
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 0" />
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 1" />
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 2" />
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 3" />
                  </div>
                </b-col>
                <b-col v-else class="pointer" @click="onClickDegree($event, rbc)">
                  <div v-if="rbc.DEGREE === '0'">
                    <img src="~@/assets/test/degree0.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 0" />
                  </div>
                  <div v-else>
                    <img src="~@/assets/test/degree2.png" :id="rbc.CATEGORY_ID + rbc.CLASS_ID + 1" />
                  </div>
                </b-col>
              </b-row>
            </div>
            <b-row class="mt-2 panelContent">
              <b-col>
                Others
              </b-col>
              <b-col>
                Platelets
              </b-col>
              <b-col>
                <span v-if="selectedItem">{{ selectedItem.PLT_COUNT }} PLT / 1000 RBC</span>
              </b-col>
            </b-row>
            <b-row class="mt-2 panelContent">
              <b-col></b-col>
              <b-col>
                Malaria
              </b-col>
              <b-col>
                <span v-if="selectedItem">{{ selectedItem.MALARIA_COUNT }} / {{ selectedItem.MAX_RBC_COUNT }} RBC</span>
              </b-col>
            </b-row>
          </div>
          <div id="markerWrapper">
            <div>[ Shape ]</div>
            <b-form-group>
              <b-form-checkbox-group
                id="rbcShapeGroup"
                v-model="shapeClassList"
                :options="shapeOptions"
                name="rbcShapeGroup"
                @change="onChangeShape"
                stacked
              ></b-form-checkbox-group>
            </b-form-group>

            <div class="mt-3">
              <div>[ Platelet ]</div>
              <b-form-group>
                <b-form-checkbox-group
                  id="rbcPlateGroup"
                  v-model="plateletClassList"
                  :options="plateletOptions"
                  name="rbcPlateGroup"
                  @change="onChangePlatelet"
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>
            </div>

            <div class="mt-3">
              <div>[ Inclusion Body ]</div>
              <b-form-group>
                <b-form-checkbox-group
                  id="rbcInclusionGroup"
                  v-model="inclusionBodyClassList"
                  :options="inclusionBodyOptions"
                  name="rbcInclusionGroup"
                  @change="onChangeInclusion"
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>
            </div>
            <div class="pb-4">
              <b-form-checkbox
                id="rbcSelectAll"
                value="Y"
                unchecked-value="N"
                @change="onRbcSelectAll">
                Select All
              </b-form-checkbox>
            </div>
          </div>
          <!-- <div class="commentWrapper">
            <div id="title">
              <b-row>
                <b-col>
                  Comment
                  <img class="pointer" src="~@/assets/icon/ic_save_white.png" @click="onChangeComment" style="width: 25px height: 25px;" />
                </b-col>
              </b-row>
            </div>
            <div class="input-group"
              style="background-color: #313131;
              border-radius: 10px;">
              <textarea id="inputRbcComment"
                class="form-control"
                rows="4"
                aria-label="With textarea"
                v-model="modelData.rbcComment"
                style="resize: none;">
              </textarea>
            </div>
          </div> -->
        </b-card>
        <b-card class="blackCard mt-2 pt-3" text-variant="white" no-body>
          <b-row class="commentWrapper">
            <b-col cols="3">
              <img src="~@/assets/icon/Comment.png"/>
            </b-col>
            <b-col>
              <div class="input-group"
                style="background-color: #313131;
                border-radius: 10px;">
                <textarea id="inputRbcComment"
                  class="form-control"
                  rows="4"
                  aria-label="With textarea"
                  v-model="modelData.rbcComment"
                  @change="onChangeComment"
                  style="resize: none;"></textarea>
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
  import lodash from 'lodash'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'rbc-classification',
    computed: {
      ...mapGetters({
        rbcFields: Constant.GET_RBC_FIELDS,
        // workList: Constant.GET_WORK_LIST,
        commonCode: Constant.GET_COMMON_CODE,
        currentUser: Constant.GET_CURRENT_USER,
        settings: Constant.GET_SETTINGS
        // orderId: Constant.GET_SELECT_ORDER_ID,
        // getRbcComment: Constant.GET_RBC_COMMENT
      })
    },
    props: ['orderId', 'paramItem'],
    watch: {
      // orderId: function(newVal, oldVal) { // watch it
        // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({orderId: newVal}))
        // ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({orderId: newVal}))
      // }
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.selectedItem = newObj
        this.modelData.rbcComment = this.selectedItem.RBC_COMMENT

        if (this.selectedItem.SIGNED_STATE === this.commonCode(Constant.GET_CODE_SIGNED_STATE, '01').cdNm) {
          document.getElementById('inputRbcComment').disabled = true
        } else {
          document.getElementById('inputRbcComment').disabled = false
        }

        ipcRenderer.send(Constant.SELECT_RBC_DEGREE)
        ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({orderId: this.selectedItem.ORDER_ID}))
      }
    },
    data () {
      return {
        modelData: {
          rbcComment: ''
        },
        rbcClassList: null,
        selectedItem: null,
        isInclusion: false,
        rbcDegreeStandard: null,
        shapeClassList: [],
        shapeOptions: [
          { text: 'Normal', value: '01' },
          { text: 'Poikilocytosis', value: '02' },
          { text: 'Target Cell', value: '03' },
          { text: 'Burr Cell', value: '04' },
          { text: 'Acanthocyte', value: '05' },
          { text: 'Ovalocyte', value: '06' },
          { text: 'Schistocyte', value: '07' },
          { text: 'Sickle Cell', value: '08' },
          { text: 'Stomatocyte', value: '09' },
          { text: 'Tear Drop Cell', value: '10' },
          { text: 'Spherocyte', value: '11' }
        ],
        plateletClassList: [],
        plateletOptions: [
          { text: 'Platelet', value: '01' }
        ],
        inclusionBodyClassList: [],
        inclusionBodyOptions: [
          { text: 'Howell-Jolly Body', value: '01' },
          { text: 'Malaria', value: '02' }
        ]
      }
    },
    beforeDestroy () {
      ipcRenderer.removeAllListeners(Constant.GET_RBC_COUNT)
      ipcRenderer.removeAllListeners(Constant.UPDATE_RBC_COMMENT)
      ipcRenderer.removeAllListeners(Constant.UPDATE_RBC_CLASSIFICATION)
      ipcRenderer.removeAllListeners(Constant.SELECT_RBC_DEGREE)
      // ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)

      this.EventBus.$off('MALARIA_MOVE_COMPLETE')
    },
    mounted () {
      var self = this
      console.log('rbc mount-')
      console.log(this.selectedItem)

      this.shapeClassList = this.settings.rbcShape
      this.plateletClassList = this.settings.rbcPlatelet
      this.inclusionBodyClassList = this.settings.rbcInclusion

      ipcRenderer.on(Constant.SELECT_RBC_DEGREE, function (event, results) {
        console.log(results)

        self.rbcDegreeStandard = results
      })

      // RBC Count
      ipcRenderer.on(Constant.GET_RBC_COUNT, function (event, result) {
        self.rbcClassList = result
        var findItem = result.find(function (item) {
          item.CATEGORY_ID === '05'
        })

        if (findItem) {
          self.isInclusion = true
        }

        // self.calcRbcDegree()

        self.EventBus.$emit('OVERLAY', {state: false})
        self.EventBus.$emit('RBC_CLASSIFICATION_REPORT_LOADED', lodash.cloneDeep(self.rbcClassList))
      })

      ipcRenderer.on(Constant.UPDATE_RBC_CLASSIFICATION, function (event, result) {
        ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({orderId: self.selectedItem.ORDER_ID}))
      })

      // malaria count update
      this.EventBus.$on('MALARIA_MOVE_COMPLETE', function(params) {
        console.log(self.selectedItem)
        self.selectedItem.MALARIA_COUNT = params

        var obj = {
          malariaCount: self.selectedItem.MALARIA_COUNT,
          userId: self.currentUser.userId,
          slotId: self.selectedItem.SLOT_ID
        }
        ipcRenderer.send(Constant.UPDATE_MALARIA_COUNT, JSON.stringify(obj))
      })
    },
    methods: {
      onRbcSelectAll (value) {
        if (value === 'Y') {
          this.shapeClassList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']
          this.plateletClassList = ['01']
          this.inclusionBodyClassList = ['01', '02']

          this.$store.dispatch(Constant.SET_RBC_SHAPE, this.shapeClassList)
          this.$store.dispatch(Constant.SET_RBC_PLATELET, this.plateletClassList)
          this.$store.dispatch(Constant.SET_RBC_INCLUSION, this.inclusionBodyClassList)
        } else {
          this.shapeClassList = []
          this.plateletClassList = []
          this.inclusionBodyClassList = []

          this.$store.dispatch(Constant.SET_RBC_SHAPE, this.shapeClassList)
          this.$store.dispatch(Constant.SET_RBC_PLATELET, this.plateletClassList)
          this.$store.dispatch(Constant.SET_RBC_INCLUSION, this.inclusionBodyClassList)
        }

        this.EventBus.$emit('UPDATE_RBC_MARKER', true)
        // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({slotId: this.orderId}))
      },
      onChangeShape (value) {
        this.$store.dispatch(Constant.SET_RBC_SHAPE, value)
        this.EventBus.$emit('UPDATE_RBC_MARKER', true)
      },
      onChangePlatelet (value) {
        this.$store.dispatch(Constant.SET_RBC_PLATELET, value)
        this.EventBus.$emit('UPDATE_RBC_MARKER', true)
      },
      onChangeInclusion (value) {
        this.$store.dispatch(Constant.SET_RBC_INCLUSION, value)
        this.EventBus.$emit('UPDATE_RBC_MARKER', true)
      },
      calcRbcDegree () {
        var self = this

        console.log(self.rbcClassList)
        console.log(self.rbcDegreeStandard)

        // total
        var totalCount = 0
        var poikiloDegree = '0'

        self.rbcClassList.forEach(function (rbcClass, dspRbcInfoIndex) {
          self.rbcDegreeStandard.forEach(function (degreeStandard, dspRbcClassIndex) {
            if ((rbcClass.CATEGORY_ID === degreeStandard.CATEGORY_ID) &&
              (rbcClass.CLASS_ID === degreeStandard.CLASS_ID)) {
              var degreeCount = Number(rbcClass.DEGREE)
              totalCount += degreeCount

              console.log(totalCount)

              var percent = ((degreeCount / totalCount) * 100).toFixed(2)

              // 0
              if (percent < degreeStandard.DEGREE_1) {
                self.rbcClassList[dspRbcInfoIndex].DEGREE = '0'
              }
              // 1
              else if (percent >= degreeStandard.DEGREE_1 && percent < degreeStandard.DEGREE_2) {
                self.rbcClassList[dspRbcInfoIndex].DEGREE = '1'
              }
              // 2
              else if (percent >= degreeStandard.DEGREE_2 && percent < degreeStandard.DEGREE_3) {
                self.rbcClassList[dspRbcInfoIndex].DEGREE = '2'
              }
              // 3
              else if (percent >= degreeStandard.DEGREE_3) {
                self.rbcClassList[dspRbcInfoIndex].DEGREE = '3'
              }
            }

            // size
            if (rbcClass.CATEGORY_ID === '01') {
              if (rbcClass.CLASS_ID === '02' || rbcClass.CLASS_ID === '03') {
                if (Number(rbcClass.DEGREE) > 0) {
                  rbcClass.DEGREE = '1'
                }
              }
            }

            // Poikilocytosis
            if (rbcClass.CATEGORY_ID === '03') {
              if (rbcClass.CLASS_ID !== '01' || rbcClass.CLASS_ID !== '02') {
                if (Number(rbcClass.DEGREE) > Number(poikiloDegree)) {
                  poikiloDegree = rbcClass.DEGREE
                }
              }
            }
          })
        })

        // Poikilocytosis
        self.rbcClassList.forEach(function (rbcClass, dspRbcInfoIndex) {
          if (rbcClass.CATEGORY_ID === '03') {
            if (rbcClass.CLASS_ID === '02') {
              rbcClass.DEGREE = poikiloDegree
            }

            // shape normal
            if (Number(rbcClass.DEGREE) > 0) {
              self.rbcClassList[0].DEGREE = '1'
            }
          }
        })
      },
      onClickDegree (evt, rbc) {
        console.log(evt)
        if (this.isBefore) {
          return
        }

        if (evt.target.id) {
          var categoryId = evt.target.id.slice(0, 2)
          var classId = evt.target.id.slice(2, 4)
          var degree = evt.target.id.slice(4)

          var params = {
            degree: degree,
            cassetId: rbc.CASSET_ID,
            slotId: rbc.SLOT_ID,
            categoryId: rbc.CATEGORY_ID,
            classId: rbc.CLASS_ID
          }

          if (categoryId === '01' || categoryId === '02' || categoryId === '03') {
            if (classId === '01') {
              var normalDegree = '0'
              if (degree === '0') {
                normalDegree = '1'
              }

              params.degree = normalDegree
            }
          }
          console.log(params)

          this.EventBus.$emit('OVERLAY', {state: true})
          ipcRenderer.send(Constant.UPDATE_RBC_CLASSIFICATION, JSON.stringify(params))
        }
      },
      onChangeComment (evt) {
        var obj = {
          slotId: this.selectedItem.SLOT_ID,
          rbcComment: this.modelData.rbcComment
        }

        ipcRenderer.send(Constant.UPDATE_RBC_COMMENT, JSON.stringify({obj}))
        this.EventBus.$emit(Constant.UPDATE_RBC_COMMENT, this.modelData.rbcComment)

        this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
          position: 'bottom-center',
          duration: '2000'
        })
      }
    }
  }
</script>

<style>
  #rbcInfoCard {
    background-color: #282828 !important;
    padding: 3px 10px 20px 10px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px black;
    border: 1px solid #303744;
    height: 755px;
  }
  #divRbcWrapper {
    height: 500px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  #markerWrapper {
    height: 240px;
    padding-top: 10px;
    border-top: 1px solid #2B455C;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
