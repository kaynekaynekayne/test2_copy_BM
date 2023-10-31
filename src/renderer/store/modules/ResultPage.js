const state = {
  resultData: [],
  searchOptions: {
    searchType: [
      { value: '01', text: 'All' },
      { value: '02', text: 'BM No' },
      { value: '03', text: 'Patient ID' },
      { value: '04', text: 'Patient Name' },
      { value: '05', text: 'Department' }
    ],
    signedState: [
      { value: '00', text: 'All' },
      { value: '01', text: 'Signed' },
      { value: '02', text: 'Ready' }
    ],
    searchTypeCd: '01',
    searchText: '',
    startDate: '',
    endDate: '',
    signedStateCd: '00',
    // 체크 박스
    wbcClassList: []
  },
  // classification item
  classificationItem: {
    item: null,
    limit: 0
  }
}

const mutations = {
  UPDATE_SEARCH_OPTIONS (state, params) {
    state.searchOptions.searchTypeCd = params.searchTypeCd
    state.searchOptions.searchText = params.searchText
    state.searchOptions.startDate = params.startDate
    state.searchOptions.endDate = params.endDate
    state.searchOptions.wbcClassList = params.wbcClassList
  },
  SET_CLASSIFICATION_ITEM (state, params) {
    console.log('SET_CLASSIFICATION_ITEM : ' + params.limit)
    state.classificationItem.item = params.item
    state.classificationItem.limit = params.limit
  }
}

const actions = {
  updateSearchOption: (context, params) => {
    context.commit('UPDATE_SEARCH_OPTIONS', params)
  },
  setClassificationItem: (context, params) => {
    context.commit('SET_CLASSIFICATION_ITEM', params)
  }
}

const getters = {
  getSearchOptions: state => {
    return state.searchOptions
  },
  getClassificationItem: state => {
    return state.classificationItem
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
