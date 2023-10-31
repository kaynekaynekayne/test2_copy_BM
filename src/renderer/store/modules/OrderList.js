import Constant from '../../../Constant.js'

const state = {
  orderList: [],
  MAX_CASSET_NO: 12
}

const mutations = {
  SET_ORDER_LIST (state, obj) {
    if (obj.iCasStat !== '999999999999') {
      // 저장 여부 체크
      var isSaveOrder = state.orderList.find(function (item) {
        return item.cassetId === obj.cassetId && item.slotInfo.slotNo === obj.slotInfo.slotNo
      })

      // 저장
      if (!isSaveOrder) {
        state.orderList.push(obj)
      }

      // 주문 상태 업데이트
      for (var i = 0; i < state.orderList.length; i++) {
        if (state.orderList[i].cassetId === obj.cassetId) {
          // 동일 슬롯 정보 update
          if (state.orderList[i].slotInfo.slotNo === obj.slotInfo.slotNo) {
            state.orderList[i].slotInfo.orderDttm = obj.slotInfo.orderDttm
            state.orderList[i].slotInfo.analyzedDttm = obj.slotInfo.analyzedDttm
            state.orderList[i].slotInfo.slotId = obj.slotInfo.slotId
            state.orderList[i].slotInfo.barcodeNo = obj.slotInfo.barcodeNo
            state.orderList[i].iCasStat = obj.iCasStat
            state.orderList[i].oCasStat = obj.oCasStat
          }
          // 전체 슬롯 상태 update
          for (var j = 0; j < state.MAX_CASSET_NO; j++) {
            if (Number(state.orderList[i].slotInfo.slotNo) === j+1) {
              var slotState = obj.iCasStat.charAt(j)
              state.orderList[i].state = obj.getCommonCode(Constant.GET_CODE_LIST_USER_CASSETE_STATE, slotState).cdNm
            }
          }
        }
      }
    }
  },
  INIT_ORDER_LIST (state, obj) {
    state.orderList = []
  }
}

const actions = {
  setOrderList: (context, obj) => {
    obj.getCommonCode = context.getters.getCommonCode
    context.commit('SET_ORDER_LIST', obj)
  },
  initOrderList: (context, obj) => {
    context.commit('INIT_ORDER_LIST', obj)
  }
}

const getters = {
  getOrderList: state => {
    return state.orderList
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
