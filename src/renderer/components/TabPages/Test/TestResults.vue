<template>
  <div id="testResults">
    <b-card class="blackCard h-100" text-variant="white" no-body>
      <b-row v-if="analysisType === '01'">

        <!-- RBC start -->
        <b-col style="overflow-y: none;">
          <div class="panelTitle">RBC Classification</div>
          <b-row class="mt-3">
            <b-col v-for="(field, index) in rbcFields" :key="field">
              {{ field }}
            </b-col>
          </b-row>
          <div v-for="(rbc, index) in dspRbcClassList" class="mt-4 panelContent" :key="index">
            <b-row v-for="(rbcClass, index) in rbc.classInfo" :key="rbcClass.classId">
              <b-col>
                <div v-if="index === 0">{{ rbc.categoryNm }}</div>
              </b-col>
              <b-col>
                {{ rbcClass.classNm }}
              </b-col>
              <b-col v-if="rbcClass.classNm !== 'Normal' || rbc.categoryId === '05'">
                <div v-if="rbcClass.degree === '1'">
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree0.png" />
                  <img src="~@/assets/test/degree0.png" />
                </div>
                <div v-else-if="rbcClass.degree === '2'">
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree0.png" />
                </div>
                <div v-else-if="rbcClass.degree === '3'">
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                </div>
                <!-- <div v-else-if="rbcClass.degree === '4'">
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree2.png" />
                </div> -->
                <div v-else>
                  <img src="~@/assets/test/degree2.png" />
                  <img src="~@/assets/test/degree0.png" />
                  <img src="~@/assets/test/degree0.png" />
                  <img src="~@/assets/test/degree0.png" />
                </div>
              </b-col>
              <b-col v-else>
                <div v-if="rbcClass.degree === '0'">
                  <img src="~@/assets/test/degree0.png" />
                </div>
                <div v-else>
                  <img src="~@/assets/test/degree2.png" />
                </div>
              </b-col>
            </b-row>
          </div>

          <b-row class="mt-3 panelContent">
            <b-col>
              Others
            </b-col>
            <b-col>
              Platelets
            </b-col>
            <b-col>
              {{ pltCount }} PLT / 1000 RBC
            </b-col>
          </b-row>

          <b-row class="mt-3 panelContent">
            <b-col></b-col>
            <b-col>
              Malaria
            </b-col>
            <b-col>
              {{ malariaCount }} / {{ maxRbcCount }} RBC
            </b-col>
          </b-row>
        </b-col>
        <!-- RBC end -->

        <b-col style="overflow-y: none;">
          <div class="panelTitle">WBC Classification</div>
          <b-row class="mt-3 mb-4">
            <b-col cols="5">
              Class
            </b-col>
            <b-col>
              Count
            </b-col>
            <b-col>
              %
            </b-col>
          </b-row>

          <div v-if="(wbc.title !== 'NR' && wbc.title !== 'AR' &&
              wbc.title !== 'GP' && wbc.title !== 'PA' &&
              wbc.title !== 'MC' && wbc.title !== 'MA')" v-for="wbc in dspWbcClassList" class="panelContent" :key="wbc.type">
            <b-row>
              <b-col cols="5">
                {{ wbc.name }}
              </b-col>
              <b-col>
                {{ wbc.count }}
              </b-col>
              <b-col v-if="wbc.percent !== 'NaN'">
                {{ wbc.percent }}
              </b-col>
              <b-col v-else>
                0
              </b-col>
            </b-row>
          </div>
          <div class="panelContent mt-2">
            <b-row>
              <b-col cols="5">
                Total
              </b-col>
              <b-col>
                {{ totalCount }}
              </b-col>
              <b-col>
                100.00
              </b-col>
            </b-row>
          </div>
          <div class="mt-3">
            Non-WBC
          </div>
          <div v-if="(wbc.title === 'NR' || wbc.title === 'AR' ||
            wbc.title === 'GP' || wbc.title === 'PA' ||
            wbc.title === 'MC' || wbc.title === 'MA')" v-for="wbc in dspWbcClassList" class="panelContent mt-2" :key="wbc.type">
            <b-row>
              <b-col cols="5">
                {{ wbc.name }}
              </b-col>
              <b-col>
                {{ wbc.count }} <span v-if="wbc.title === 'NR' || wbc.title === 'GP'"> / {{ maxWbcCount }} WBC</span>
              </b-col>
              <b-col>
                -
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>

      <b-row v-else>
        <b-col cols="7" class="pl-4">
          <div class="panelTitle">BM Cell Classification</div>
          <b-row class="mt-3 mb-3">
            <b-col cols="5">
              Class
            </b-col>
            <b-col>
              Count
            </b-col>
            <b-col>
              %
            </b-col>
          </b-row>
          <div v-if="cell.title !== 'MC' && cell.title !== 'OT'" v-for="cell in dspBmClassList" class="panelContent" :key="cell.type">
            <b-row>
              <b-col cols="5">
                {{ cell.name }}
              </b-col>
              <b-col>
                {{ cell.count }}
              </b-col>
              <b-col v-if="cell.percent !== 'NaN'">
                {{ cell.percent }}
              </b-col>
              <b-col v-else>
                0
              </b-col>
            </b-row>
          </div>
          <div class="panelContent mt-2">
            <b-row>
              <b-col cols="5">
                Total
              </b-col>
              <b-col>
                {{ totalCount }}
              </b-col>
              <b-col>
                100.00
              </b-col>
            </b-row>
          </div>
          <div class="mt-3">
            Non-BM Cell
          </div>
          <div v-if="cell.title === 'MC' || cell.title === 'OT'" v-for="cell in dspBmClassList" class="panelContent mt-2" :key="cell.type">
            <b-row>
              <b-col cols="5">
                {{ cell.name }}
              </b-col>
              <b-col>
                {{ cell.count }}
              </b-col>
              <b-col>
                -
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'
  import lodash from 'lodash'

  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'test-result-page',
    computed: {
      ...mapGetters({
        rbcFields: Constant.GET_RBC_FIELDS,
        wbcClassList: Constant.GET_WBC_CLASS_LIST,
        rbcClassList: Constant.GET_RBC_CLASS_LIST,
        // malariaCount: Constant.GET_MALARIA_COUNT,
        orderList: Constant.GET_ORDER_LIST_BM,
        bmClassList: Constant.GET_BM_CELL,
        settings: Constant.GET_SETTINGS
      })
    },
    data () {
      return {
        pltCount: 0,
        maxWbcCount: 0,
        totalCount: 0,
        maxRbcCount: 0,
        malariaCount: 0,
        analysisType: '01',
        dspWbcClassList: null,
        dspRbcClassList: null,
        dspBmClassList: null
      }
    },
    beforeDestroy () {
      this.EventBus.$off('CHANGE_SLOT')
      this.EventBus.$off('RECEIVE_DATA')
      this.EventBus.$off('CHANGE_USER')
    },
    mounted () {
      var self = this

      this.dspWbcClassList = lodash.cloneDeep(this.wbcClassList(this.settings.isNsNbIntegration))
      this.dspRbcClassList = lodash.cloneDeep(this.rbcClassList)
      this.dspBmClassList = lodash.cloneDeep(this.bmClassList)

      ipcRenderer.send(Constant.SELECT_RBC_DEGREE)

      ipcRenderer.on(Constant.SELECT_RBC_DEGREE, function (event, results) {
        console.log(results)

        self.rbcDegreeStandard = results
      })

      // classification
      self.$store.dispatch(Constant.INIT_WBC_COUNT, null)
      self.$store.dispatch(Constant.INIT_RBC_DEGREE, null)
      self.$store.dispatch(Constant.UPDATE_MALARIA_COUNT, 0)
      // self.totalCount = self.getTotalCount()

      this.EventBus.$on('CHANGE_USER', function(params) {
        self.totalCount = 0
        self.malariaCount = 0
        self.pltCount = 0
        self.maxRbcCount = 0
        self.maxWbcCount = 0

        self.dspWbcClassList = lodash.cloneDeep(self.wbcClassList(self.settings.isNsNbIntegration))
        self.dspRbcClassList = lodash.cloneDeep(self.rbcClassList)

        // classification
        // self.$store.dispatch(Constant.INIT_WBC_COUNT, null)
        // self.$store.dispatch(Constant.INIT_RBC_DEGREE, null)
        // self.$store.dispatch(Constant.INIT_BM_CELL_COUNT, null)
        // self.$store.dispatch(Constant.UPDATE_MALARIA_COUNT, 0)
      })

      this.EventBus.$on('CHANGE_SLOT', function(params) {
        self.$store.dispatch(Constant.INIT_WBC_COUNT, null)
        self.$store.dispatch(Constant.INIT_RBC_DEGREE, null)
        self.$store.dispatch(Constant.INIT_BM_CELL_COUNT, null)
        self.$store.dispatch(Constant.UPDATE_MALARIA_COUNT, 0)
      })

      this.EventBus.$on('RECEIVE_DATA', function(params) {
        var jobCmd = params.jobCmd

        if (jobCmd === 'RUNNING_INFO') {
          var currentSlot = params.slotInfo.find(function (item) {
            return item.stateCd === '03'
          })

          console.log(currentSlot)
          if (typeof(currentSlot) !== 'undefined') {
            // var wbcList = currentSlot.wbcInfo
            // var rbcList = currentSlot.rbcInfo
            // var bmList = currentSlot.bmInfo

            self.analysisType = currentSlot.analysisType

            // RBC
            self.maxRbcCount = currentSlot.maxRbcCount

            self.maxWbcCount = currentSlot.maxWbcCount

            // malaria
            self.malariaCount = currentSlot.malariaCount

            // PLT
            self.pltCount = currentSlot.pltCount

            // wbc total
            self.totalCount = 0

            self.calcRbcDegree(currentSlot.rbcInfo)
            // self.calcRbc(currentSlot.rbcInfo)

            // WBC PB
            if (self.analysisType === '01') {
              self.calcWbc(currentSlot.wbcInfo).then(function (totalCount) {
                for (var i = 0; i < self.dspWbcClassList.length; i++) {
                  self.dspWbcClassList[i].percent = ((Number(self.dspWbcClassList[i].count) / self.totalCount) * 100).toFixed(0)
                }
              })
            } else {
              self.calcBmCell(currentSlot.bmInfo).then(function (totalCount) {
                for (var i = 0; i < self.dspBmClassList.length; i++) {
                  self.dspBmClassList[i].percent = ((Number(self.dspBmClassList[i].count) / self.totalCount) * 100).toFixed(0)
                }
              })
              // self.totalCount = self.getTotalCount(bmList)
              // for (var i = 0; i < bmList.length; i++) {
              //   bmList[i].percent = self.getPercent(bmList[i].count)
              //   console.log(bmList[i])
              //   self.$store.dispatch(Constant.UPDATE_BM_CELL_COUNT, bmList[i])
              // }
            }
          }
        }
      })
    },
    methods: {
      calcRbc: function(rbcList) {
        return new Promise((succ, fail) => {
          try {
            for (var i = 0; i < this.dspRbcClassList.length; i++) {
              for (var j = 0; j < rbcList.length; j++) {
                if (this.dspRbcClassList[i].categoryId === rbcList[j].categoryId) {
                  for (var k = 0; k < this.dspRbcClassList[i].classInfo.length; k++) {
                    for (var l = 0; l < rbcList[j].classInfo.length; l++) {
                      if (this.dspRbcClassList[i].classInfo[k].classId === rbcList[j].classInfo[l].classId) {
                        this.dspRbcClassList[i].classInfo[k].degree = rbcList[j].classInfo[l].degree
                      }
                    }
                  }
                }
              }
            }
            succ()
          } catch (error) {
            fail(error)
          }
        })
      },
      calcBmCell: function(bmList) {
        return new Promise((succ, fail) => {
          try {
            var classList = this.dspBmClassList

            for (var i = 0; i < classList.length; i++) {
              for (var j = 0; j < bmList.length; j++) {
                if (classList[i].id === bmList[j].id) {
                  // AR, OT, NR, MC total 제외
                  if (classList[i].title !== 'AR' &&
                      classList[i].title !== 'OT' &&
                      classList[i].title !== 'NR' &&
                      classList[i].title !== 'MC') {
                    this.totalCount += Number(bmList[j].count)
                  }
                  classList[i].count = bmList[j].count
                }
              }
            }
            succ(this.totalCount)
          } catch (error) {
            fail(error)
          }
        })
      },
      calcWbc: function(wbcList) {
        return new Promise((succ, fail) => {
          try {
            var classList = this.dspWbcClassList

            for (var i = 0; i < classList.length; i++) {
              for (var j = 0; j < wbcList.length; j++) {
                if (classList[i].id === wbcList[j].id) {
                  // AR, NR, GP, PA, MC total 제외
                  if (classList[i].title !== 'AR' &&
                      classList[i].title !== 'NR' &&
                      classList[i].title !== 'GP' &&
                      classList[i].title !== 'PA' &&
                      classList[i].title !== 'MC' &&
                      classList[i].title !== 'MA') {
                    this.totalCount += Number(wbcList[j].count)
                  }
                  classList[i].count = wbcList[j].count
                }
              }
            }
            succ(this.totalCount)
          } catch (error) {
            fail(error)
          }
        })
      },
      calcRbcDegree: function (rbcInfo) {
        var self = this
        var totalCount = 0
        var sizeTotal = 0
        var chromiaTotal = 0

        // degree
        rbcInfo.forEach(function (rbcCategory, catIndex) {
          rbcCategory.classInfo.forEach(function (rbcClass, clsIndex) {

            // size total
            if (rbcCategory.categoryId === '01') {
              if (rbcClass.classId !== '04') {
                sizeTotal += Number(rbcClass.degree)
              }
            }
            // chromia total
            else if (rbcCategory.categoryId === '02') {
              if (rbcClass.classId !== '04') {
                chromiaTotal += Number(rbcClass.degree)
              }
            }
            // shape, inclusion body total
            else {
              totalCount += Number(rbcClass.degree)
            }
          })
        })

        rbcInfo.forEach(function (rbcCategory, catIndex) {
          rbcCategory.classInfo.forEach(function (rbcClass, clsIndex) {
            self.rbcDegreeStandard.forEach(function(degreeStandard) {
              if ((degreeStandard.CATEGORY_ID === rbcCategory.categoryId) &&
                  (degreeStandard.CLASS_ID === rbcClass.classId)) {
                var degreeCount = Number(rbcClass.degree)
                var percent = 0

                if (degreeStandard.CATEGORY_ID === '01') {
                  percent = ((degreeCount / sizeTotal) * 100).toFixed(2)
                } else if (degreeStandard.CATEGORY_ID === '02') {
                  percent = ((degreeCount / chromiaTotal) * 100).toFixed(2)
                } else {
                  percent = ((degreeCount / totalCount) * 100).toFixed(2)
                }

                // 0
                if (percent < degreeStandard.DEGREE_1) {
                  rbcClass.degree = '0'
                }
                // 1
                else if (percent >= degreeStandard.DEGREE_1 && percent < degreeStandard.DEGREE_2) {
                  rbcClass.degree = '1'
                }
                // 2
                else if (percent >= degreeStandard.DEGREE_2 && percent < degreeStandard.DEGREE_3) {
                  rbcClass.degree = '2'
                }
                // 3
                else if (percent >= degreeStandard.DEGREE_3) {
                  rbcClass.degree = '3'
                }
              }
            })
          })
        })

        rbcInfo.forEach(function (rbcCategory, catIndex) {
          rbcCategory.classInfo.forEach(function (rbcClass, clsIndex) {
            // size
            if (rbcCategory.categoryId === '01') {
              if (rbcClass.classId === '01') {
                rbcCategory.classInfo[0].degree = '1'
              }
              if (rbcClass.classId === '02' || rbcClass.classId === '03') {
                if (Number(rbcClass.degree) > 0) {
                  rbcCategory.classInfo[0].degree = '0'
                }
              }
            }

            // chromia
            if (rbcCategory.categoryId === '02') {
              if (rbcClass.classId === '01') {
                rbcCategory.classInfo[0].degree = '1'
              }

              if (rbcClass.classId === '02' || rbcClass.classId === '03') {
                if (Number(rbcClass.degree) > 0) {
                  rbcCategory.classInfo[0].degree = '0'
                }
              }
            }

            // Poikilocytosis
            if (rbcCategory.categoryId === '03') {
              if (rbcClass.classId === '01') {
                // normal
                rbcCategory.classInfo[0].degree = '1'
                // poikilo
                rbcCategory.classInfo[1].degree = '0'
              }

              if (rbcClass.classId !== '01' && rbcClass.classId !== '02') {
                var poikiloDegree = Number(rbcCategory.classInfo[1].degree)

                if (Number(rbcClass.degree) > poikiloDegree) {
                  rbcCategory.classInfo[0].degree = '0'
                  rbcCategory.classInfo[1].degree = rbcClass.degree
                }
              }
            }

            // display rbc info
            self.dspRbcClassList.forEach(function (dspRbcCategory) {
              dspRbcCategory.classInfo.forEach(function(dspRbcClass) {
                rbcCategory.classInfo.forEach(function(rbcClassInfo) {
                  if ((dspRbcCategory.categoryId === rbcCategory.categoryId) &&
                      (dspRbcClass.classId === rbcClassInfo.classId)) {
                    dspRbcClass.degree = rbcClassInfo.degree
                  }
                })
              })
            })
          })
        })
      },
      getTotalCount: function(list) {
        var totalCnt = 0
        for (var i = 0; i < list.length; i++) {
          if (list[i].title !== 'OT' && list[i].title !== 'AR' && list[i].title !== 'NR' && list[i].title !== 'MC') {
            totalCnt += Number(list[i].count)
          }
        }

        return totalCnt
      },
      getPercent: function(count) {
        return ((Number(count) / this.totalCount) * 100).toFixed(2)
      }
    }
  }
</script>
<style>
  #testResults{
    height: 730px;
  }
</style>
