<template>
  <div class="mt-2" id="orderList">
    <b-card class="blackCard h-100" text-variant="white" no-body>
      <b-row>
        <b-col>
          <div id="title" class="panelTitle">Processing List</div>
        </b-col>
      </b-row>
      <b-row class="mt-4">
        <b-col>
          <div class="h-100" style="overflow: auto;">
            <table v-if="dspOrderList.length > 0" class="w-100" id="orderTable">
              <tr class="border-bottom borderColorGray">
                <th class="pb-3 text-center" style="width: 40px;"></th>
                <th v-for="field in fileds" class="pb-2 text-center" style="font-size: 13px; font-weight: bold;">
                  {{ field }}
                </th>
              </tr>
              <tr v-for="(item, index) in dspOrderList" :key="index" style="font-size: 13px;">
                <td class="text-center border-right borderColorGray colorWhite" style="width: 40px;">{{ cassetNo }} - {{ item.slotNo }}</td>
                <td class="text-center colorWhite">{{ item.bmNo }}</td>
                <td class="text-center colorWhite">{{ item.patientId }}</td>
                <td class="text-center colorWhite">{{ item.patientNm }}</td>
                <td class="text-center colorWhite">{{ commonCode('04', item.analysisType).cdNm }}</td>
                <td class="text-center colorWhite">{{ item.stainTypeNm }}</td>
                <td class="text-center colorWhite">{{ commonCode('14', item.stateCd).cdNm }}</td>
              </tr>
            </table>
          </div>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
  import ModalAddOrder from '../../Common/ModalAddOrder.vue'
  import { mapGetters } from 'vuex'
  import Constant from '../../../../Constant'

  export default {
    name: 'order-list',
    computed: {
      ...mapGetters({
        // orderList: Constant.GET_ORDER_LIST_BM,
        commonCode: Constant.GET_COMMON_CODE,
        commonCodeList: Constant.GET_COMMON_CODE_LIST
      })
    },
    data () {
      return {
        fileds: ['BM No.', 'Patient ID', 'Name', 'Scan Type', 'Stain Type', 'State'],
        dspOrderList: [],
        stainType: [],
        cassetNo: ''
      }
    },
    beforeDestroy () {
      this.EventBus.$off('CHANGE_USER')
      this.EventBus.$off('RECEIVE_DATA')
    },
    mounted () {
      var self = this

      this.stainType = this.stainType.concat(this.commonCodeList(Constant.GET_CODE_LIST_GENERAL_STAIN))
      this.stainType = this.stainType.concat(this.commonCodeList(Constant.GET_CODE_LIST_SPECIAL_STAIN))
      this.stainType = this.stainType.concat(this.commonCodeList(Constant.GET_CODE_LIST_IMMUNO_STAIN))

      console.log(this.stainType)
      // for (var i = 0; i < this.orderList.length; i++) {
      //   for (var j = 0; j < this.orderList[i].slotInfo.length; j++) {
      //     if (typeof(this.orderList[i].slotInfo[j].orderId) !== 'undefined') {
      //       this.dspOrderList.push(this.orderList[i].slotInfo[j])
      //     }
      //   }
      // }

      this.EventBus.$on('CHANGE_USER', function(params) {
        self.dspOrderList = []
        self.cassetNo = ''
      })

      this.EventBus.$on('RECEIVE_DATA', function(params) {
        var jobCmd = params.jobCmd

        if (jobCmd === 'RUNNING_INFO') {
          self.dspOrderList = params.slotInfo
          self.cassetNo = params.cassetNo

          for (var i = 0; i < self.dspOrderList.length; i++) {
            var stainTypeNm = self.dspOrderList[i].userInputStainType

            for (var j = 0; j < self.stainType.length; j++) {
              if (self.stainType[j].cd === self.dspOrderList[i].stainType) {
                stainTypeNm = self.stainType[j].cdNm
              }
            }

            self.dspOrderList[i].stainTypeNm = stainTypeNm
          }
        }
      })
    },
    methods: {
    }
  }
</script>
<style>
  #orderList {
    height: 370px;
  }
</style>
