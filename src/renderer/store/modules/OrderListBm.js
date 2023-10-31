import Constant from '../../../Constant.js'

const state = {
  orderListBm: [],
  MAX_CASSET_NO: 12
}

const mutations = {
  SET_ORDER_LIST_BM (state, obj) {
    for (var i = 0; i < state.orderListBm.length; i++) {
      if (state.orderListBm[i].cassetNo === obj.cassetNo) {
        for (var j = 0; j < state.orderListBm[i].slotInfo.length; j++) {
          state.orderListBm[i].slotInfo[j].slotNo = String(j + 1)
          if (state.orderListBm[i].slotInfo[j].slotNo === obj.slotNo) {
            state.orderListBm[i].slotInfo[j] = obj
          }
        }
      }
    }
  },
  UPDATE_ORDER_STATE (state, obj) {
    if (obj.iCasStat !== '999999999999') {
      for (var i = 0; i < state.orderListBm.length; i++) {
        if (state.orderListBm[i].cassetNo === obj.cassetNo) {
          // slot 상태 변경
          for (var j = 0; j < state.orderListBm[i].slotInfo.length; j++) {
            if (typeof(state.orderListBm[i].slotInfo[j].orderId) !== 'undefined') {

              var slotState = obj.iCasStat.charAt(j)
              state.orderListBm[i].slotInfo[j].analysisState = obj.getCommonCode(Constant.GET_CODE_LIST_USER_CASSETE_STATE, slotState).cdNm

              // 파라메터 수신
              if (state.orderListBm[i].slotInfo[j].orderId == obj.orderId) {
                state.orderListBm[i].slotInfo[j].malariaCount = obj.malariaCount
                state.orderListBm[i].slotInfo[j].wbcInfo = obj.wbcInfo
                state.orderListBm[i].slotInfo[j].rbcInfo = obj.rbcInfo
                state.orderListBm[i].slotInfo[j].bmInfo = obj.bmInfo
                state.orderListBm[i].slotInfo[j].age = obj.slotInfo.age
                state.orderListBm[i].slotInfo[j].analyzedDttm = obj.slotInfo.analyzedDttm
                state.orderListBm[i].slotInfo[j].barcodeNo = obj.slotInfo.barcodeNo
                state.orderListBm[i].slotInfo[j].birthDay = obj.slotInfo.birthDay
                state.orderListBm[i].slotInfo[j].bmNo = obj.slotInfo.bmNo
                state.orderListBm[i].slotInfo[j].gender = obj.slotInfo.gender
                state.orderListBm[i].slotInfo[j].orderDttm = obj.slotInfo.orderDttm
                state.orderListBm[i].slotInfo[j].patientId = obj.slotInfo.patientId
                state.orderListBm[i].slotInfo[j].patientNm = obj.slotInfo.patientNm
                state.orderListBm[i].slotInfo[j].slotId = obj.slotInfo.slotId
                state.orderListBm[i].slotInfo[j].slotNo = obj.slotInfo.slotNo
                state.orderListBm[i].slotInfo[j].testType = obj.slotInfo.testType
                state.orderListBm[i].slotInfo[j].wbcCount = obj.slotInfo.wbcCount
              }

              console.log(state.orderListBm)
            }
          }
        }
      }
    }
  },
  DELETE_ORDER_LIST_BM (state, obj) {
    var targetList = []
    for (var i = 0; i < obj.slotInfo.length; i++) {
      if (obj.slotInfo[i].isSelected) {
        targetList.push(obj.slotInfo[i])
      }
    }

    for (var i = 0; i < state.orderListBm.length; i++) {
      for (var j = 0; j < state.orderListBm[i].slotInfo.length; j++) {
        for (var k = 0; k < targetList.length; k++) {
          if (state.orderListBm[i].slotInfo[j].orderId === targetList[k].orderId) {
            var slotNo = state.orderListBm[i].slotInfo[j].slotNo
            state.orderListBm[i].slotInfo[j] = {}
            state.orderListBm[i].slotInfo[j].slotNo = slotNo
          }
        }
      }
    }
  },
  ADD_ORDER_CASSET (state, obj) {
    var cassetNo = String(state.orderListBm.length + 1)
    var casset = {
      cassetNo: cassetNo,
      slotInfo: [
                  { slotNo: '1' }, { slotNo: '2' }, { slotNo: '3' }, { slotNo: '4' }, { slotNo: '5' }, { slotNo: '6' },
                  { slotNo: '7' }, { slotNo: '8' }, { slotNo: '9' }, { slotNo: '10' }, { slotNo: '11' }, { slotNo: '12' }
                ]
    }
    state.orderListBm.push(casset)
  },
  UPDATE_ORDER_LIST_BM (state, objList) {
    for (var i = 0; i < state.orderListBm.length; i++) {
      if (state.orderListBm[i].cassetNo === objList.cassetNo) {
        state.orderListBm[i] = objList
      }
    }
  }
}

const actions = {
  setOrderListBm: (context, obj) => {
    context.commit('SET_ORDER_LIST_BM', obj)
  },
  updateOrderState: (context, obj) => {
    obj.getCommonCode = context.getters.getCommonCode
    context.commit('UPDATE_ORDER_STATE', obj)
  },
  deleteOrderListBm: (context, obj) => {
    context.commit('DELETE_ORDER_LIST_BM', obj)
  },
  addOrderCasset: (context, obj) => {
    context.commit('ADD_ORDER_CASSET', obj)
  },
  updateOrderListBm: (context, objList) => {
    context.commit('UPDATE_ORDER_LIST_BM', objList)
  }
}

const getters = {
  // 전체
  getOrderListBm: state => {
    return state.orderListBm
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
