<template>
  <b-container id="bmCellClassification" fluid>
    <b-row>
      <b-col class="p-0">
        <b-card id="bmInfoCard" text-variant="white" no-body>
          <div class="panelTitle">
            <span>
              BM Cell Classification
            </span>
            <b-icon v-if="isLisShow" class="ml-2 pointer" icon="file-earmark-arrow-up" font-scale="1.1" @click="onClickLisUpload"
              v-b-tooltip.hover title="upload to lis (F9)" style="color: white;"></b-icon>
            <b-icon v-if="isLisShow" class="ml-2 pointer"
              icon="check-square"
              font-scale="1.1"
              @click="onCommit"
              v-b-tooltip.hover title="submit"
              style="color: #82FA58;"></b-icon>

          </div>
          <div id="divBmInfoWrapper">
            <div class="mt-3">
              <b-row>
                <b-col cols="5">
                  Class
                </b-col>
                <b-col class="text-center">
                  Count
                </b-col>
                <b-col class="text-center">
                  %
                </b-col>
              </b-row>
            </div>
            <draggable v-model="bmClassList" group="bm" @start="drag=true" @end="onListDragEnd">
              <div v-if="cell.title !== 'MC' && cell.title !== 'OT'" v-for="(cell, index) in bmClassList" class="panelContent mt-2" :key="cell.type">
                <b-row>
                  <b-col cols="5">
                    {{ cell.name }}
                  </b-col>
                  <b-col class="text-center">
                    {{ cell.count }}
                  </b-col>
                  <b-col class="text-center">
                    {{ cell.percent }}
                  </b-col>
                </b-row>
              </div>
            </draggable>
            <div class="panelContent mt-2">
              <b-row>
                <b-col cols="5">
                  Total
                </b-col>
                <b-col class="text-center">
                  {{ totalCount }}
                </b-col>
                <b-col class="text-center">
                  100.00
                </b-col>
              </b-row>
            </div>
            <div v-if="cell.title === 'MC' || cell.title === 'OT'" v-for="(cell, index) in bmClassList" class="panelContent mt-2" :key="cell.type">
              <b-row>
                <b-col cols="5">
                  {{ cell.name }}
                </b-col>
                <b-col class="text-center">
                  {{ cell.count }}
                </b-col>
                <b-col class="text-center">
                  -
                </b-col>
              </b-row>
            </div>
            <div class="panelContent mt-2 border-top">
              <b-row>
                <b-col cols="5">
                  M:E Ratio
                </b-col>
                <b-col class="text-center">
                  {{ meRatio }} : 1
                </b-col>
                <b-col class="text-center">
                  -
                </b-col>
              </b-row>
            </div>
          </div>
          <b-row v-if="!isReportPage">
            <b-col class="pointer" @click="onClickBefore">
              <div id="divBmBefore">Before</div>
            </b-col>
            <b-col class="pointer" @click="onClickAfter">
              <div id="divBmAfter">After</div>
            </b-col>
          </b-row>
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
                <textarea id="inputBmComment"
                  class="form-control"
                  rows="4"
                  aria-label="With textarea"
                  v-model="modelData.bmComment"
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
  import api from '@/service'
  import draggable from 'vuedraggable'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const path = require('path')

  export default {
    name: 'bm-cell-classification',
    components: { draggable },
    computed: {
      ...mapGetters({
        // workList: Constant.GET_WORK_LIST,
        commonCode: Constant.GET_COMMON_CODE,
        currentUser: Constant.GET_CURRENT_USER,
        classList: Constant.GET_BM_CELL,
        settings: Constant.GET_SETTINGS
        // getbmComment: Constant.GET_BM_COMMENT,
        // getTestHistory: Constant.GET_TEST_HISTORY
      })
    },
    props: ['paramItem'],
    watch: {
      // orderId: function(newVal, oldVal) { // watch it
      //   console.log(newVal)
        // ipcRenderer.send(Constant.GET_TEST_HISTORY, JSON.stringify({orderId: newVal}))
      // },
      paramItem: function(newObj, oldObj) {
        console.log(newObj)

        this.selectedItem = newObj

        if (this.selectedItem.ANALYSIS_TYPE === '02') {
          this.modelData.bmComment = this.selectedItem.BM_COMMENT
          this.initElement()
        }
      }
    },
    data () {
      return {
        totalCount: 0,
        selectedItem: null,
        bmClassList: [],
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        modelData: {
          bmComment: ''
        },
        isReportPage: false,
        isBefore: false,
        isLisShow: false,
        meRatio: 0
      }
    },
    beforeDestroy () {
      this.EventBus.$off('UPDATE_HIST_LIST')
      this.EventBus.$off('ROLLBACK_BM_IMAGE')

      ipcRenderer.removeAllListeners(Constant.GET_BM_HIST_LIST)

    },
    mounted () {
      var self = this

      console.log(this.$route.path)
      if (this.$route.path.includes('bmCellReport')) {
        self.isLisShow = true
      }

      this.EventBus.$on('UPDATE_HIST_LIST', function(params) {
        self.initElement()
      })

      this.EventBus.$on('ROLLBACK_BM_IMAGES', function(params) {
        self.initElement()
      })

      // BM 원본 데이터
      ipcRenderer.on(Constant.GET_BM_HIST_LIST, function (event, result) {
        console.log(result)
        console.log(self.bmClassList)

        self.totalCount = 0

        var tmpClass = []

        result.forEach(function (item) {
          self.bmClassList.forEach(function(bmItem) {
            if (item.CLASS_ID === bmItem.id) {
              var obj = {
                title: item.CLASS_TITLE,
                id: item.CLASS_ID,
                name: item.CLASS_NM,
                count: item.COUNT,
                images: [],
                order: bmItem.order
              }

              tmpClass.push(obj)

              if (bmItem.title !== 'OT') {
                self.totalCount += Number(obj.count)
              }
            }
          })
        })

        self.bmClassList = tmpClass
        self.bmClassList.sort(function(a, b) {
          return a.order - b.order
        })

        // percent
        var percentTotal = 0
        var maxItem = null

        self.bmClassList.forEach(function (item) {
          item.percent = self.getPercent(item.count)

          // blast 조정
          if (item.title === 'BL') {
            if (item.count > 0) {
              if (item.percent >= 0 && item.percent <= 1) {
                item.percent = 1
              }
            }
          }

          if (item.title !== 'OT') {
            percentTotal += Number(item.percent)
            if (maxItem === null) {
              maxItem = item
            } else {
              if (maxItem.count < item.count) {
                maxItem = item
              }
            }
          }
        })

        console.log(maxItem)
        console.log(percentTotal)

        if (maxItem !== null) {
          // 백분율 오차 보정
          maxItem.percent = Number(maxItem.percent) + (100 - percentTotal)
        }

      })
    },
    methods: {
      onCommit () {
        this.EventBus.$emit('ON_CLICK_REPORT_SIGN', null)
      },
      onClickLisUpload () {
        this.EventBus.$emit('ON_CLICK_LIS', null)
      },
      loadBeforeBmClassification () {
        ipcRenderer.send(Constant.GET_BM_HIST_LIST, JSON.stringify({orderId: this.selectedItem.ORDER_ID}))
      },
      onClickBefore (evt) {
        console.log('onClickBefore')
        this.loadBeforeBmClassification()

        document.getElementById('divBmBefore').style.color = 'red'
        document.getElementById('divBmAfter').style.color = ''

        this.isBefore = true
      },
      onClickAfter (evt) {
        console.log('onClickAfter')

        this.initElement()
        this.isBefore = false
      },
      onListDragEnd () {
        console.log('onListDragEnd')
        var self = this

        this.bmClassList.forEach(function(bmClass, index) {
          bmClass.order = index + 1
        })

        console.log(this.$route.path)
        this.$store.dispatch(Constant.UPDATE_ORDER_BM, this.bmClassList)

        if (!this.isBefore) {
          if (this.$route.path.indexOf('bmCellReport') > 0) {
            this.EventBus.$emit('UPDATE_BM_IMAGES', this.bmClassList)
          } else if (this.$route.path.indexOf('finalReport') > 0) {
            this.EventBus.$emit('BM_CLASSIFICATION_LOADED', lodash.cloneDeep(this.bmClassList))
          }
        }
      },
      initElement () {
        var self = this

        this.totalCount = 0

        var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
        var bmPath = rootPath + '/' + this.settings.bmClassificationDirNm

        if (this.$route.path.includes('finalReport') > 0) {
          this.isReportPage = true
        }

        if (document.getElementById('divBmBefore')) {
          document.getElementById('divBmBefore').style.color = ''
        }

        if (document.getElementById('divBmAfter')) {
          document.getElementById('divBmAfter').style.color = 'red'
        }

        // bm file load
        var params = {
          classList: this.classList,
          classDir: bmPath,
          selectItem: this.selectedItem
        }

        console.log(params)

        api.getBmFiles(params)
        .then(function (res) {
          console.log(res)

          self.totalCount = res.imgCount
          // self.bmClassList = res.classificationResult

          setTimeout(function() {
            res.classificationResult.sort(function(a, b) {
              return a.order - b.order
            })

            self.bmClassList = res.classificationResult

            var params = {
              classificationResult: self.bmClassList,
              imgCount: self.totalCount
            }

            // M:E ratio
            console.log(self.bmClassList)
            var mTotal = 0
            var eTotal = 0

            self.bmClassList.forEach(function(item) {
              if (item.title === 'BL' || item.title === 'PR' || item.title === 'MY' ||
                  item.title === 'ME' || item.title === 'NS' || item.title === 'NB' ||
                  item.title === 'EO' || item.title === 'BA') {
                mTotal += item.count
              } else if (item.title === 'PE' || item.title === 'BN' || item.title === 'PN' ||
                         item.title === 'ON') {
                eTotal += item.count
              }
            })

            console.log(mTotal)
            console.log(eTotal)
            console.log((mTotal / eTotal).toFixed(2))

            self.meRatio = (mTotal / eTotal).toFixed(2)

            // percent
            api.getBmClassification(params)
            .then(function (res) {
              if (self.selectedItem.SIGNED_STATE === self.commonCode(Constant.GET_CODE_SIGNED_STATE, '01').cdNm) {
                document.getElementById('inputBmComment').disabled = true
              } else {
                document.getElementById('inputBmComment').disabled = false
              }

              self.$nextTick(function () {
                // db 저장
                if (self.selectedItem !== null) {
                  var params = {
                    cassetId: self.selectedItem.CASSET_ID,
                    slotId: self.selectedItem.SLOT_ID,
                    orderId: self.selectedItem.ORDER_ID,
                    bmInfo: self.bmClassList,
                    userId: self.currentUser.userId,
                    // PB 비정상 클래스 체크
                    isNormal: self.$checkBmNormalCell(self.bmClassList)
                  }

                  console.log(params)
                  ipcRenderer.send(Constant.INSERT_BM_CLASSIFICATION, JSON.stringify(params))
                  // classification에서만 load
                  console.log('send BM_CLASSIFICATION_LOADED')
                  self.EventBus.$emit('BM_CLASSIFICATION_LOADED', lodash.cloneDeep(self.bmClassList))
                }
              })
            }).catch(function (err) {
              console.log(err.message)

              self.$toasted.show(err.message, {
                position: 'bottom-center',
                duration: '2000'
              })
            })
          }, 100)

        }).catch(function (err) {
          console.log(err.message)

          self.$toasted.show(err.message, {
            position: 'bottom-center',
            duration: '2000'
          })
        })
      },
      getPercent (count) {
        return ((Number(count) / this.totalCount) * 100).toFixed(0)
      },
      onChangeComment (evt) {
        console.log(this.selectedItem)
        var obj = {
          slotId: this.selectedItem.SLOT_ID,
          bmComment: this.modelData.bmComment
        }

        ipcRenderer.send(Constant.UPDATE_BM_COMMENT, JSON.stringify({obj}))

        this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
          position: 'bottom-center',
          duration: '2000'
        })
      }
    }
  }
</script>

<style>
  #bmInfoCard {
    background-color: #282828 !important;
    padding: 3px 10px 20px 10px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px black;
    border: 1px solid #303744;
    height: 755px;
  }
  #divBmInfoWrapper {
    height: 730px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
