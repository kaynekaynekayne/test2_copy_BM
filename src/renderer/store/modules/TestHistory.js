const state = {
  testHistoryList: []
}

const mutations = {
  SET_TEST_HISTORY (state, params) {
    var isSaveHistory = ''
    isSaveHistory = state.testHistoryList.find(function (item) {
      return item.orderId === params.orderId
    })

    if (!isSaveHistory) {
      params.signedState = 'Ready'
      params.signedDate = ''
      params.signedUserId = ''
      params.rbcComment = ''
      params.wbcComment = ''
      params.bmComment = ''

      state.testHistoryList.push(params)
    }
  },
  UPDATE_TEST_HISTORY (state, params) {
    for (var i = 0; i < state.testHistoryList.length; i++) {
      if (state.testHistoryList[i].orderId === params.obj.orderId) {
        state.testHistoryList[i].bmNo = params.obj.bmNo
        state.testHistoryList[i].patientId = params.obj.patientId
        state.testHistoryList[i].patientNm = params.obj.patientNm
      }
    }
  },
  UPDATE_SIGNED_STATE (state, obj) {
    for (var i = 0; i < state.testHistoryList.length; i++) {
      if (state.testHistoryList[i].orderId === obj.orderId) {
        var now = new Date()
        var year = "" + now.getFullYear()
        var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
        var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }
        var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour }
        var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute }
        var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second }

        state.testHistoryList[i].signedState = 'Signed'
        state.testHistoryList[i].signedDate = year + month + day + hour + minute + second
        state.testHistoryList[i].signedUserId = obj.userId
      }
    }
  },
  UPDATE_TEST_HISTORY_WBC_INFO (state, params) {
    for (var i = 0; i < state.testHistoryList.length; i++) {
      if (state.testHistoryList[i].slotId === params.slotId) {
        state.testHistoryList[i].wbcInfo = []

        for (var j = 0; j < params.list.length; j++) {
          if (params.list[j].count > 0) {
            state.testHistoryList[i].wbcInfo.push(params.list[j])
          }
        }
      }
    }
  },
  DELETE_TEST_HISTORY (state, objList) {
    for (var i = 0; i < objList.length; i++) {
      for (var j = 0; j < state.testHistoryList.length; j++) {
        if (state.testHistoryList[j].orderId === objList[i].orderId) {
          state.testHistoryList.splice(j, 1)
          j = 0
        }
      }
    }
  },
  UPDATE_RBC_COMMENT (state, obj) {
    for (var i = 0; i < state.testHistoryList.length; i++) {
      if (state.testHistoryList[i].orderId === obj.orderId) {
        state.testHistoryList[i].rbcComment = obj.rbcComment
      }
    }
  },
  UPDATE_WBC_COMMENT (state, obj) {
    for (var i = 0; i < state.testHistoryList.length; i++) {
      if (state.testHistoryList[i].orderId === obj.orderId) {
        state.testHistoryList[i].wbcComment = obj.wbcComment
      }
    }
  },
  UPDATE_BM_COMMENT (state, obj) {
    for (var i = 0; i < state.testHistoryList.length; i++) {
      if (state.testHistoryList[i].orderId === obj.orderId) {
        state.testHistoryList[i].bmComment = obj.bmComment
      }
    }
  }
}

const actions = {
  setTestHistory: (context, params) => {
    // 검사 완료된 항목만 등록
    var orderList = context.getters.getOrderListBm

    for (var i = 0; i < orderList.length; i++) {
      if (orderList[i].cassetNo === params.cassetNo) {
        for (var j = 0; j < orderList[i].slotInfo.length; j++) {
          if (typeof(orderList[i].slotInfo[j].analysisState) !== 'undefined' && orderList[i].slotInfo[j].analysisState === 'Complete') {
            context.commit('SET_TEST_HISTORY', orderList[i].slotInfo[j])
          }
        }
      }
    }
  },
  updateTestHistory: (context, params) => {
    context.commit('UPDATE_TEST_HISTORY', params)
  },
  updateSignedState: (context, obj) => {
    context.commit('UPDATE_SIGNED_STATE', obj)
  },
  updateTestHistoryWbcInfo: (context, params) => {
    context.commit('UPDATE_TEST_HISTORY_WBC_INFO', params)
  },
  deleteTestHistory: (context, objList) => {
    context.commit('DELETE_TEST_HISTORY', objList)
  },
  updateRbcComment: (context, obj) => {
    context.commit('UPDATE_RBC_COMMENT', obj)
  },
  updateWbcComment: (context, obj) => {
    context.commit('UPDATE_WBC_COMMENT', obj)
  },
  updateBmComment: (context, obj) => {
    context.commit('UPDATE_BM_COMMENT', obj)
  }
}

const getters = {
  getTestHistoryList: state => {
    return state.testHistoryList
  },
  getTestHistory: state => (orderId) => {
    for (var i = 0; i < state.testHistoryList.length; i++) {
      if (state.testHistoryList[i].orderId === orderId) {
        return state.testHistoryList[i]
      }
    }
  },
  getRbcComment: state => (orderId) => {
    var rbcComment = ''
    for (var i = 0; i < state.testHistoryList.length; i++) {
      if (state.testHistoryList[i].orderId === orderId) {
        rbcComment = state.testHistoryList[i].rbcComment
      }
    }

    return rbcComment
  },
  getWbcComment: state => (orderId) => {
    var wbcComment = ''
    for (var i = 0; i < state.testHistoryList.length; i++) {
      if (state.testHistoryList[i].orderId === orderId) {
        wbcComment = state.testHistoryList[i].wbcComment
      }
    }

    return wbcComment
  },
  getBmComment: state => (orderId) => {
    var wbcComment = ''
    for (var i = 0; i < state.testHistoryList.length; i++) {
      if (state.testHistoryList[i].orderId === orderId) {
        wbcComment = state.testHistoryList[i].bmComment
      }
    }

    return wbcComment
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
