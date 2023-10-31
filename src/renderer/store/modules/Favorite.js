const state = {
  favoriteList: []
}

const mutations = {
  SET_FAVORITE (state, params) {
    for (var i = 0; i < state.favoriteList.length; i++) {
      if (state.favoriteList[i].favoriteId === params.favoriteId) {
        state.favoriteList[i].favoriteItems.push(params.row)
      }
    }
  },
  ADD_FAVORITE (state, params) {
    state.favoriteList.push(params)
  },
  REMOVE_FAVORITE (state, params) {
    for (var i = 0; i < state.favoriteList.length; i++) {
      if (state.favoriteList[i].favoriteId === params.favoriteId) {
        for (var j = 0; j < state.favoriteList[i].favoriteItems.length; j++) {
          if (state.favoriteList[i].favoriteItems[j].itemId === params.itemId) {
            state.favoriteList[i].favoriteItems.splice(j, 1)
          }
        }
      }
    }
  },
  UPDATE_FAVORITE (state, params) {
    for (var i = 0; i < state.favoriteList.length; i++) {
      if (state.favoriteList[i].favoriteId === params.favoriteId) {
        for (var j = 0; j < state.favoriteList[i].favoriteItems.length; j++) {
          if (state.favoriteList[i].favoriteItems[j].itemId === params.itemId) {
            state.favoriteList[i].favoriteItems[j].analysisType = params.analysisType
            state.favoriteList[i].favoriteItems[j].bmSamplingSide = params.bmSamplingSide
            state.favoriteList[i].favoriteItems[j].cellCount = params.cellCount
            state.favoriteList[i].favoriteItems[j].stainType = params.stainType
            // 2021_06_16_LBK : stitch count
            state.favoriteList[i].favoriteItems[j].stitchCount = params.stitchCount
          }
        }
      }
    }
  }
}

const actions = {
  setFavorite: (context, params) => {
    context.commit('SET_FAVORITE', params)
  },
  addFavorite: (context, params) => {
    context.commit('ADD_FAVORITE', params)
  },
  removeFavorite: (context, params) => {
    context.commit('REMOVE_FAVORITE', params)
  },
  updateFavorite: (context, params) => {
    context.commit('UPDATE_FAVORITE', params)
  }
}

const getters = {
  getFavoriteList: state => {
    return state.favoriteList
  },
  getFavorite: state => (favoriteId) => {
    for (var i = 0; i < state.favoriteList.length; i++) {
      if (state.favoriteList[i].favoriteId === favoriteId) {
        return state.favoriteList[i].favoriteItems
      }
    }

    return []
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
