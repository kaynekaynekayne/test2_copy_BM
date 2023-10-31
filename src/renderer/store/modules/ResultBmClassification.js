import lodash from 'lodash'

const state = {
  bmClassList: [{
    id: '01', title: 'NE', name: 'Neutrophil', count: 0, percent: 0, order: 1
  }, {
    id: '71', title: 'NS', name: 'Neutrophil-Segmented', count: 0, percent: 0, key: '', order: 2
  }, {
    id: '72', title: 'NB', name: 'Neutrophil-Band', count: 0, percent: 0, key: '', order: 3
  }, {
    id: '02', title: 'ME', name: 'Metamyelocyte', count: 0, percent: 0, order: 4
  }, {
    id: '03', title: 'MY', name: 'Myelocyte', count: 0, percent: 0, order: 5
  }, {
    id: '04', title: 'PR', name: 'Promyelocyte', count: 0, percent: 0, order: 6
  }, {
    id: '05', title: 'LY', name: 'Lymphocyte', count: 0, percent: 0, order: 7
  }, {
    id: '06', title: 'LA', name: 'Abnormal lymphocyte', count: 0, percent: 0, order: 8
  }, {
    id: '07', title: 'MO', name: 'Monocyte', count: 0, percent: 0, order: 9
  }, {
    id: '08', title: 'EO', name: 'Eosinophil', count: 0, percent: 0, order: 10
  }, {
    id: '09', title: 'BA', name: 'Basophil', count: 0, percent: 0, order: 11
  }, {
    id: '10', title: 'BL', name: 'Blast', count: 0, percent: 0, order: 12
  }, {
    id: '11', title: 'PC', name: 'Plasma cell', count: 0, percent: 0, order: 13
  }, {
    id: '12', title: 'ON', name: 'Orthochromic Normoblast', count: 0, percent: 0, order: 14
  }, {
    id: '13', title: 'PN', name: 'Polychromic Normoblast', count: 0, percent: 0, order: 15
  }, {
    id: '14', title: 'BN', name: 'Basophilic Normoblast', count: 0, percent: 0, order: 16
  }, {
    id: '15', title: 'PE', name: 'Proerythroblast', count: 0, percent: 0, order: 17
  }, {
    id: '16', title: 'HC', name: 'Histiocyte', count: 0, percent: 0, order: 18
  }, {
    id: '17', title: 'OT', name: 'Others', count: 0, percent: 0, order: 19
  }],
  // {
  //   id: '17', title: 'MC', name: 'Malignant cell', count: 0, percent: 0
  // }
  bmModifyList: Object.freeze([])
}

const mutations = {
  UPDATE_BM_CELL_COUNT (state, obj) {
    console.log(obj)
    for (var i = 0; i < state.bmClassList.length; i++) {
      if (state.bmClassList[i].id === obj.id) {
        state.bmClassList[i].count = obj.count
        state.bmClassList[i].percent = obj.percent
      }
    }
  },
  INIT_BM_CELL_COUNT (state, obj) {
    for (var i = 0; i < state.bmClassList.length; i++) {
      state.bmClassList[i].count = 0
      state.bmClassList[i].percent = 0
    }
  },
  SET_BM_IMAGE_HIST (state, obj) {
    var cloneBmModifyList = lodash.cloneDeep(state.bmModifyList)
    cloneBmModifyList.push(obj)
    state.bmModifyList = Object.freeze(cloneBmModifyList)
  },
  INIT_BM_IMAGE_HIST (state, obj) {
    var cloneBmModifyList = lodash.cloneDeep(state.bmModifyList)
    cloneBmModifyList = []
    state.bmModifyList = Object.freeze(cloneBmModifyList)
  },
  UPDATE_ORDER_BM (state, list) {
    state.bmClassList.forEach(function(bmClass) {
      list.forEach(function(modifyClass) {
        if (bmClass.id === modifyClass.id) {
          bmClass.order = modifyClass.order
        }
      })
    })
  }
}

const actions = {
  updateBmCellCount: (context, obj) => {
    console.log(obj)
    context.commit('UPDATE_BM_CELL_COUNT', obj)
  },
  initBmCellCount: (context, obj) => {
    context.commit('INIT_BM_CELL_COUNT', obj)
  },
  setBmImageHist: (context, obj) => {
    context.commit('SET_BM_IMAGE_HIST', obj)
  },
  initBmImageHist: (context, obj) => {
    context.commit('INIT_BM_IMAGE_HIST', obj)
  },
  updateOrderBm: (context, list) => {
    context.commit('UPDATE_ORDER_BM', list)
  }
}

const getters = {
  getBmCell: (state, getters, rootState, rootGetters) => {
    console.log(getters.getIsNsNbIntegration)
    var classList = []

    if (getters.getIsNsNbIntegration) {
      classList = state.bmClassList.filter(function(item) {
        return item.id !== '71' && item.id !== '72'
      })
    } else {
      classList = state.bmClassList.filter(function(item) {
        return item.id !== '01'
      })
    }
    return classList
  },
  getBmImageHist: state => (userId) => {
    var now = new Date()
    var year = "" + now.getFullYear()
    var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
    var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }

    var modifyList = state.bmModifyList.filter(function (item) {
      var date = item.modifyDttm.split(' ')[0]
      return (item.userId === userId) && (date.replace(/-/gi, '') === year + month + day)
    })

    modifyList = modifyList.sort(function (a, b) {
      return b.seqNo - a.seqNo
    })

    return modifyList
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
