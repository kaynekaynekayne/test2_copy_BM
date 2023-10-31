<template>
  <b-container id="pbResult" fluid>
    <b-row>
      <b-col class="p-0">
        <b-card id="pbResultCard" text-variant="white" no-body>
          <div class="border-bottom borderColorGray pl-3 pt-2 pb-2">
            Peripheral blood (BMIA-12A)
          </div>
          <div style="overflow-y: scroll; overflow-x: hidden; height: 750px;">
            <div id="plList" class="p-1 pointer accordion" v-b-toggle="'collapse-' + pbItem.ORDER_ID"
              v-for="(pbItem, index) in pbList" :key="index">
              <b-row @click="onClickRow(pbItem, $event)">
                <b-col>
                  {{ pbItem.BARCODE_NO }}
                </b-col>
                <b-col class="text-right">
                  {{ $stringToDateTime(pbItem.ORDER_DTTM) }}
                </b-col>
              </b-row>
              <!-- <b-collapse :id="'collapse-' + pbItem.ORDER_ID" accordion="pb-accordion">
                <vue-tree ref="tree"
                  showCheckbox
                  :treeData="treeData"
                  :searchVal="searchVal"
                  @on-drop="dropNode"
                  @on-checked-item="checkedItem"
                  @on-selected-change="clickNode"
                  @on-checked-change="clickCheckbox"
                /> -->
                <!-- <b-row>
                  <b-col class="text-center">
                    Class
                  </b-col>
                  <b-col class="text-center">
                    Count
                  </b-col>
                  <b-col class="text-center">
                    Percent
                  </b-col>
                </b-row>
                <b-row v-for="(wbcItem, index) in wbcClassList" :key="index">
                  <b-col class="text-center">
                    {{ wbcItem.name }}
                  </b-col>
                  <b-col class="text-center">
                    {{ wbcItem.count }}
                  </b-col>
                  <b-col class="text-center">
                    {{ wbcItem.percent }} %
                  </b-col>
                </b-row> -->
              <!-- </b-collapse> -->
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col class="p-0">
        <b-card id="pbTreeCard" text-variant="white" no-body>
          <div class="border-bottom borderColorGray pl-3 pt-2 pb-2">
            <b-badge class="p-2 text-right" variant="secondary">{{ pbBarcode }}</b-badge>
          </div>
          <div style="overflow-y: scroll; overflow-x: hidden; height: 750px;">
            <b-form-input size="sm" v-model="searchVal" placeholder="search"></b-form-input>
            <b-row class="mt-2">
              <b-col class="pl-4 pt-1" cols="9">
                Hairy cell > 10%
              </b-col>
              <b-col>
                <b-form-select v-model="modelHairyCell" :options="hairyCell" size="sm" @change="onClickChange"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col class="pl-4 pt-1" cols="9">
                prolymphocytes > 50% of lymphoid cells
              </b-col>
              <b-col>
                <b-form-select v-model="modelProlyLymp" :options="prolyLymp" size="sm" @change="onClickChange"></b-form-select>
              </b-col>
            </b-row>
            <hr style="border-color: gray; width: 96%" />
            <vue-tree ref="pbtree"
              showCheckbox
              :treeData="treeData"
              :searchVal="searchVal"
              @on-drop="dropNode"
              @on-checked-item="checkedItem"
              @on-selected-change="clickNode"
              @on-checked-change="clickCheckbox"
            />
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import lodash from 'lodash'
  import ModalDiagUserInput from '../../../Common/ModalDiagUserInput'

  const ipcRenderer = require('electron').ipcRenderer
  const fs = require('fs')
  const path = require('path')

  export default {
    name: 'pb-result',
    computed: {
      ...mapGetters({
        classList: Constant.GET_WBC_CLASS_LIST,
        settings: Constant.GET_SETTINGS,
        getPbTree: Constant.GET_PB_TREE
      })
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newVal, oldVal) { // watch it
        console.log(newVal)
        console.log(this.$refs.pbtree)

        this.selectedItem = newVal

        ipcRenderer.send(Constant.GET_PB_SMEAR)
        ipcRenderer.send(Constant.SELECT_WBC_CUSTOM_CLASS)
        ipcRenderer.send(Constant.GET_DIAG_WBC_DETAIL, JSON.stringify({orderId: this.selectedItem.ORDER_ID}))

        // ipcRenderer.send(Constant.GET_PB_SMEAR, JSON.stringify({orderId: newVal}))
      }
      // paramItem: function (newObj, oldObj) {
      //   console.log(newObj)
      //   // this.selectedItem = newObj
      //   // this.initElement()
      // }
    },
    data () {
      return {
        pbList: null,
        wbcList: null,
        selectedItem: null,
        wbcClassList: [],
        wbcCustomClass: [],
        rbcClassList: [],
        totalCount: 0,
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        searchVal: '',
        treeData: [],
        pbBarcode: '-',
        modelProlyLymp: 'N',
        prolyLymp: [
          { value: 'N', text: 'N'},
          { value: 'P', text: 'P'}
        ],
        modelHairyCell: 'N',
        hairyCell: [
          { value: 'N', text: 'N'},
          { value: 'P', text: 'P'}
        ]
      }
    },
    beforeDestroy () {
      ipcRenderer.removeAllListeners(Constant.GET_PB_SMEAR)
      ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      ipcRenderer.removeAllListeners(Constant.GET_RBC_COUNT)
      ipcRenderer.removeAllListeners(Constant.GET_DIAG_WBC_DETAIL)
      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_CUSTOM_CLASS)

      this.EventBus.$off(Constant.DIAG_UPDATE_RBC_DEGREE)
      this.EventBus.$off(Constant.DIAG_UPDATE_INPUT)
    },
    mounted () {
      var self = this

      // ipcRenderer.send(Constant.GET_PB_SMEAR)
      // ipcRenderer.send(Constant.SELECT_WBC_CUSTOM_CLASS)

      ipcRenderer.on(Constant.GET_PB_SMEAR, function (event, result) {
        console.log(result)
        self.pbList = result
      })

      // custom class
      ipcRenderer.on(Constant.SELECT_WBC_CUSTOM_CLASS, function (event, results) {
        console.log(results)
        self.wbcCustomClass = results
      })

      // wbc data
      ipcRenderer.on(Constant.GET_DIAG_WBC_DETAIL, function (event, result) {
        console.log(result)
        self.selectedItem = result
        self.getWbcList()

        self.$nextTick(function () {
          self.pbBarcode = self.selectedItem.BARCODE_NO
          self.EventBus.$emit('DIAG_PB_ITEM_SELECTED', self.selectedItem.BARCODE_NO)
          self.EventBus.$emit('OVERLAY', {state: false})

          ipcRenderer.send(Constant.GET_RBC_COUNT, JSON.stringify({orderId: self.selectedItem.ORDER_ID}))
        })
      })

      // rbc data
      ipcRenderer.on(Constant.GET_RBC_COUNT, function (event, result) {
        console.log(result)
        self.rbcClassList = result
        self.getTreeData()

        // dimorphism initialize
        self.EventBus.$emit(Constant.DIAG_UPDATE_RBC_DEGREE, {id: '03_11', value: 'N'})
      })

      this.EventBus.$on(Constant.DIAG_UPDATE_INPUT, function (obj) {
        console.log(obj)

        self.EventBus.$emit('SEND_PB_TREE_DATA', self.$refs.pbtree.nodeMap)

      })

      this.EventBus.$on(Constant.DIAG_UPDATE_RBC_DEGREE, function (obj) {
        console.log(obj)
        // var treeData = lodash.cloneDeep(self.treeData)
        //
        // treeData.forEach(function(treeRoot) {
        //   treeRoot.children.forEach(function(child) {
        //     if (obj.id === child.id) {
        //       child.value = obj.value
        //     }
        //   })
        // })
        //
        // self.treeData = treeData

        self.$refs.pbtree.nodeMap.modelProlyLymp = self.modelProlyLymp
        self.$refs.pbtree.nodeMap.modelHairyCell = self.modelHairyCell

        self.EventBus.$emit('SEND_PB_TREE_DATA', self.$refs.pbtree.nodeMap)
      })
    },
    methods: {
      // onClickInput (event) {
      //   console.log('onClickInput')
      //   // 이벤트 전파 방지
      //   event.stopPropagation()
      // },
      onClickChange (event) {
        console.log('onClickChange')
        this.$refs.pbtree.nodeMap.modelProlyLymp = this.modelProlyLymp
        this.$refs.pbtree.nodeMap.modelHairyCell = this.modelHairyCell
      },
      dropNode({ parentNode, targetNode, callback }) {
        console.log("dropNode", parentNode, targetNode)
        callback(targetNode)
      },
      checkedItem({ node, vNode }) {
        console.log("checkedItem", node, vNode)
        console.log(this.$refs.pbtree)

        this.EventBus.$emit('SEND_PB_TREE_DATA', this.$refs.pbtree.nodeMap)
      },
      clickNode(node) {
        console.log("clickNode", node)

        if (node.isUserInput) {
          if (node.id === '03_11') {
            this.$modal.show(ModalDiagUserInput, {node: node, type: 'yesno'}, {
              width: '500px',
              height: 'auto'
            })
          } else {
            this.$modal.show(ModalDiagUserInput, {node: node, type: 'number'}, {
              width: '500px',
              height: 'auto'
            })
          }
        } else {
          if (!node.disabled) {
            if (node.checked || node.partialSelected) {
              this.$refs.pbtree.setRemoveNodeKeys(node.id)
            } else {
              this.$refs.pbtree.setCheckedNodeKeys(node.id)
            }
          }
        }
      },
      clickCheckbox({ node, selectedData }) {
        console.log("clickCheckbox", node, selectedData)
      },
      onClickRow (pbItem, event) {
        console.log(pbItem)
        console.log(event.target)

        this.EventBus.$emit('OVERLAY', {state: true})
        ipcRenderer.send(Constant.GET_DIAG_WBC_DETAIL, JSON.stringify({orderId: pbItem.ORDER_ID}))
      },
      getTreeData () {
        console.log(this.selectedItem)
        var self = this
        var treeData = lodash.cloneDeep(this.getPbTree)

        console.log(this.rbcClassList)
        console.log(treeData)

        treeData.forEach(function(treeItem) {
          treeItem.children.forEach(function(childItem) {
            // rbc
            self.rbcClassList.forEach(function(rbcClass) {
              if (rbcClass.CATEGORY_ID === treeItem.id) {
                if (rbcClass.CLASS_ID === childItem.id.substr(3, childItem.id.length - 1)) {
                  childItem.value = rbcClass.DEGREE
                }

                // malaria
                if (childItem.id === '05_03') {
                  childItem.value = self.selectedItem.MALARIA_COUNT
                }

                // plt
                if (childItem.id === '05_04') {
                  childItem.value = self.selectedItem.PLT_COUNT
                }
              }
            })

            // wbc
            if (treeItem.id === '07') {
              self.wbcClassList.forEach(function(wbcClass) {
                if (wbcClass.id === childItem.id.substr(3, childItem.id.length - 1)) {
                  childItem.value = wbcClass.percent.toString()
                }
              })
            }

            // rbc shape
            if (treeItem.id === '03') {
              treeItem.children.forEach(function(child) {
                // dimorphism
                if (child.id === '03_11') {
                  child.value = 'N'
                }
              })
            }

            // Blast
            // if (treeItem.id === '08') {
            //   self.wbcClassList.forEach(function(wbcClass) {
            //     if (wbcClass.id === '10') {
            //       treeItem.value = wbcClass.percent.toString()
            //     }
            //   })
            // }
          })
        })

        this.treeData = treeData

        this.$refs.pbtree.nodeMap.modelProlyLymp = this.modelProlyLymp
        this.$refs.pbtree.nodeMap.modelHairyCell = this.modelHairyCell

        this.EventBus.$emit('SEND_PB_TREE_DATA', this.$refs.pbtree.nodeMap)
        // this.$store.dispatch(Constant.SET_PB_TREE_DATA, lodash.cloneDeep(this.$refs.pbtree.nodeMap))

        console.log(this.treeData)
      },
      getWbcList () {
        var self = this

        console.log(self.selectedItem)
        self.wbcClassList = []
        self.totalCount = 0

        var classList = self.classList(self.selectedItem.IS_NS_NB_INTEGRATION)

        // custom class append
        self.wbcCustomClass.forEach(function(wbcCustom) {
          if (wbcCustom.CLASS_TITLE !== '') {
            var obj = {
              count: 0,
              id: wbcCustom.CLASS_ID,
              key: '',
              name: wbcCustom.CLASS_NM,
              title: wbcCustom.CLASS_TITLE,
              order: Number(wbcCustom.CLASS_ID)
            }
            classList.push(obj)
          }
        })
        console.log(self.wbcCustomClass)
        console.log(classList)

        classList.forEach(function (classItem, classIndex) {
          try {
            var rootPath = self.settings.pbiaRootPath + '/' + self.selectedItem.SLOT_ID
            var slotDirList = fs.readdirSync(rootPath)
            var filePath = null
            var files = null

            slotDirList.forEach(function (dirItem, dirIndex) {
              if (slotDirList[dirIndex].includes(self.settings.wbcClassificationDirNm)) {
                filePath = rootPath + '/' + slotDirList[dirIndex] + '/' + classList[classIndex].id + '_' + classList[classIndex].title

                // load files
                files = fs.readdirSync(filePath).filter(function (file) {
                  return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
                })

                // change file path
                for (var k = 0; k < files.length; k++) {
                  files[k] = 'file://' + filePath + '/' + files[k]
                }

                var obj = {
                  title: classList[classIndex].title,
                  images: files,
                  count: files.length,
                  id: classList[classIndex].id,
                  name: classList[classIndex].name
                }

                self.wbcClassList.push(obj)
                if ((obj.title === 'NR' || obj.title === 'AR' || obj.title === 'GP' || obj.title === 'PA') && obj.count > 0) {
                  self.isNonWbc = true
                } else {
                  self.isNonWbc = false
                  self.totalCount += Number(obj.count)
                }
              }
            })
          } catch (err) {
            console.log(err)
          }
        })

        // 퍼센트
        var percentTotal = 0
        var maxItem = null

        self.wbcClassList.forEach(function (item, index) {
          self.wbcClassList[index].percent = self.getPercent(item.count, self.totalCount)

          // blast 조정
          if (item.title === 'BL') {
            if (self.wbcClassList[index].count > 0) {
              if (self.wbcClassList[index].percent >= 0 && self.wbcClassList[index].percent <= 1) {
                self.wbcClassList[index].percent = 1
              }
            }
          }

          if ((item.title !== 'NR' && item.title !== 'AR' &&
                item.title !== 'GP' && item.title !== 'PA' &&
                item.title !== 'MC' && item.title !== 'MA')) {
            percentTotal += Number(self.wbcClassList[index].percent)
            if (maxItem === null) {
              maxItem = self.wbcClassList[index]
            } else {
              if (maxItem.count < item.count) {
                maxItem = self.wbcClassList[index]
              }
            }
          }
        })

        if (maxItem !== null) {
          // 백분율 오차 보정
          maxItem.percent = Number(maxItem.percent) + (100 - percentTotal)
        }

        console.log(self.wbcClassList)
      },
      getPercent (count, totalCount) {
        return ((Number(count) / totalCount) * 100).toFixed(0)
      }
    }
  }
</script>

<style>
  #pbResultCard {
    background-color: #282828 !important;
    border-radius: 5px;
    box-shadow: 2px 2px 2px black;
    border: 1px solid #303744;
    height: 912px;
  }
  #pbTreeCard {
    background-color: #282828 !important;
    border-radius: 5px;
    box-shadow: 2px 2px 2px black;
    border: 1px solid #303744;
    height: 912px;
    font-size: 14px;
  }
  #plList {
    font-size: 14px;
  }
  #plList:hover {
    background-color: #3F628C;
  }
</style>
