<template>
  <b-container id="bmResult" fluid>
    <b-row>
      <b-col class="p-0">
        <b-card id="bmResultCard" text-variant="white" no-body>
          <div class="border-bottom borderColorGray pl-3 pt-2 pb-2">
            Bone marrow (BMIA-12A)
          </div>
          <div id="bmResultTree" style="overflow-y: scroll; overflow-x: hidden; height: 750px;">
            <b-form-input size="sm" v-model="bmSearchVal" placeholder="search"></b-form-input>
            <b-row class="mt-2">
              <b-col class="pl-4 pt-1" cols="9">
                Hemophagocytic histiocytes
              </b-col>
              <b-col>
                <b-form-select v-model="modelHemophagocytic" :options="hemophagocyticOptions" size="sm" @change="onClickChange"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col class="pl-4 pt-1" cols="9">
                MPO
              </b-col>
              <b-col>
                <b-form-select v-model="modelMpo" :options="mpoOptions" size="sm" @change="onClickChange"></b-form-select>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col class="pl-4 pt-1" cols="9">
                NSE after NaF
              </b-col>
              <b-col>
                <b-form-select v-model="modelNseAfterNaf" :options="nseAfterNafOptions" size="sm" @change="onClickChange"></b-form-select>
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
            <b-row class="mt-2">
              <b-col class="pl-4 pt-1" cols="9">
                Cellularity
              </b-col>
              <b-col>
                <b-form-input type="number" v-model="modelCellularity" size="sm" @change="onClickChange"></b-form-input>
              </b-col>
            </b-row>
            <hr style="border-color: gray; width: 96%" />
            <vue-tree ref="bmtree"
              showCheckbox
              :treeData="bmTreeData"
              :searchVal="bmSearchVal"
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

  export default {
    name: 'bm-result',
    computed: {
      ...mapGetters({
        getBmTree: Constant.GET_BM_TREE
      })
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newVal, oldVal) { // watch it
        this.selectedItem = newVal
        ipcRenderer.send(Constant.GET_BM_CELL_CLASSIFICATION, JSON.stringify({orderId: this.selectedItem.ORDER_ID}))
      }
    },
    data () {
      return {
        selectedItem: null,
        bmCellClassification: null,
        bmSearchVal: '',
        bmTreeData: [],
        bmCellTotalCount: 0,
        modelHemophagocytic: 'N',
        hemophagocyticOptions: [
          { value: 'N', text: 'N'},
          { value: 'P', text: 'P'}
        ],
        modelMpo: 'N',
        mpoOptions: [
          { value: 'N', text: 'N'},
          { value: 'P', text: 'P'}
        ],
        modelNseAfterNaf: 'N',
        nseAfterNafOptions: [
          { value: 'N', text: 'N'},
          { value: 'P', text: 'P'}
        ],
        modelProlyLymp: 'N',
        prolyLymp: [
          { value: 'N', text: 'N'},
          { value: 'P', text: 'P'}
        ],
        modelCellularity: '0'
      }
    },
    beforeDestroy () {
      // ipcRenderer.removeAllListeners(Constant.GET_TEST_HISTORY)
      ipcRenderer.removeAllListeners(Constant.GET_BM_CELL_CLASSIFICATION)
      this.EventBus.$off(Constant.DIAG_UPDATE_INPUT)

    },
    mounted () {
      var self = this

      // get test
      // ipcRenderer.on(Constant.GET_TEST_HISTORY, function (event, result) {
      //   console.log(result)
      //   self.selectedItem = result
      //   ipcRenderer.send(Constant.GET_BM_CELL_CLASSIFICATION, JSON.stringify({orderId: result.ORDER_ID}))
      // })

      // get bm
      ipcRenderer.on(Constant.GET_BM_CELL_CLASSIFICATION, function (event, result) {
        console.log(result)
        self.bmCellTotalCount = 0
        self.bmCellClassification = result
        self.bmCellClassification.forEach(function(bmCell) {
          if (bmCell.CLASS_TITLE !== 'OT' && bmCell.CLASS_TITLE !== 'MC' && bmCell.CLASS_TITLE !== 'ER') {
            self.bmCellTotalCount += Number(bmCell.COUNT)
          }
        })
        self.getTreeData()
      })

      this.EventBus.$on(Constant.DIAG_UPDATE_INPUT, function (obj) {
        console.log(obj)
        self.EventBus.$emit('SEND_BM_TREE_DATA', self.$refs.bmtree.nodeMap)
      })

    },
    methods: {
      onClickChange(event) {
        console.log(event)

        this.$refs.bmtree.nodeMap.modelHemophagocytic = this.modelHemophagocytic
        this.$refs.bmtree.nodeMap.modelMpo = this.modelMpo
        this.$refs.bmtree.nodeMap.modelNseAfterNaf = this.modelNseAfterNaf
        this.$refs.bmtree.nodeMap.modelProlyLymp = this.modelProlyLymp
        this.$refs.bmtree.nodeMap.modelCellularity = this.modelCellularity
      },
      dropNode({ parentNode, targetNode, callback }) {
        console.log("dropNode", parentNode, targetNode)
        callback(targetNode)
      },
      checkedItem({ node, vNode }) {
        console.log("checkedItem", node, vNode)
        var self = this
        self.EventBus.$emit('SEND_BM_TREE_DATA', self.$refs.bmtree.nodeMap)
      },
      clickNode(node) {
        console.log("clickNode", node)
        if (node.isUserInput) {
          this.$modal.show(ModalDiagUserInput, {node: node, type: 'number'}, {
            width: '500px',
            height: 'auto'
          })
        } else {
          console.log(this.$refs.bmtree)
          if (!node.disabled) {
            if (node.checked || node.partialSelected) {
              this.$refs.bmtree.setRemoveNodeKeys(node.id)
            } else {
              this.$refs.bmtree.setCheckedNodeKeys(node.id)
            }
          }
        }
      },
      clickCheckbox({ node, selectedData }) {
        console.log("clickCheckbox", node, selectedData)
      },
      getPercent (count, total) {
        return ((Number(count) / total) * 100).toFixed(0)
      },
      getTreeData () {
        console.log(this.selectedItem)
        var self = this
        var bmTreeData = lodash.cloneDeep(this.getBmTree)

        var percentTotal = 0
        var maxItem = null

        self.bmCellClassification.forEach(function (item, index) {
          console.log(self.bmCellTotalCount)
          console.log(item.CLASS_TITLE + ':' + item.COUNT)

          if (item.CLASS_TITLE !== 'OT' && item.CLASS_TITLE !== 'MC' && item.CLASS_TITLE !== 'ER') {
            item.PERCENT = self.getPercent(item.COUNT, self.bmCellTotalCount)

            percentTotal += Number(item.PERCENT)
            if (maxItem === null) {
              maxItem = item
            } else {
              if (Number(maxItem.COUNT) < Number(item.COUNT)) {
                maxItem = item
              }
            }
          }
        })

        console.log(maxItem)
        if (maxItem !== null) {
          // 백분율 오차 보정
          maxItem.PERCENT = Number(maxItem.PERCENT) + (100 - percentTotal)
        }

        bmTreeData.forEach(function(treeItem) {
          console.log(treeItem.id)
          // M:E ratio
          if (treeItem.id === '08') {
            treeItem.value = self.selectedItem.ME_RATIO
          }

          treeItem.children.forEach(function(childItem) {
            // cellularity
            // if (treeItem.id === '07') {
            //   childItem.value = self.selectedItem.CELLULARITY
            // }

            // bm classification
            if (treeItem.id === '14') {
              console.log(self.bmCellClassification)
              self.bmCellClassification.forEach(function(bmClass) {
                if (bmClass.CLASS_ID === childItem.id.substr(3, childItem.id.length - 1)) {
                  if (bmClass.CLASS_TITLE !== 'OT' && bmClass.CLASS_TITLE !== 'MC' && bmClass.CLASS_TITLE !== 'ER') {
                    childItem.value = bmClass.PERCENT.toString()
                  } else {
                    childItem.value = bmClass.COUNT.toString()
                  }
                }
              })
            }
          })
        })

        this.bmTreeData = bmTreeData
        this.$refs.bmtree.nodeMap.modelHemophagocytic = this.modelHemophagocytic
        this.$refs.bmtree.nodeMap.modelMpo = this.modelMpo
        this.$refs.bmtree.nodeMap.modelNseAfterNaf = this.modelNseAfterNaf
        this.$refs.bmtree.nodeMap.modelProlyLymp = this.modelProlyLymp
        this.$refs.bmtree.nodeMap.modelCellularity = this.selectedItem.CELLULARITY

        this.EventBus.$emit('SEND_BM_TREE_DATA', this.$refs.bmtree.nodeMap)
        // this.$store.dispatch(Constant.SET_BM_TREE_DATA, this.$refs.bmtree.nodeMap)

        console.log(this.bmTreeData)
      }
    }
  }
</script>

<style>
  #bmResultCard {
    background-color: #282828 !important;
    border-radius: 5px;
    box-shadow: 2px 2px 2px black;
    border: 1px solid #303744;
    height: 912px;
  }
  #bmResultTree {
    font-size: 14px;
  }
</style>
