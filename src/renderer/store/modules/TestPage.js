const state = {
  isRunning: false,
  runningIntervalId: null,
  timeCounter: 0,
  workingIntervalId: null,
  rbcFields: ['Category', 'Class', 'Degree'],
  wbcFields: ['Class', 'Count', '%'],
  wbcCount: [{ value: '100', text: '100 WBC count' },
            { value: '200', text: '200 WBC count' },
            { value: '300', text: '300 WBC count' },
            { value: '400', text: '400 WBC count' },
            { value: '500', text: '500 WBC count' }],
  testList: []
}

const mutations = {
  SET_TEST_LIST (state, testObj) {
    state.testList.push(testObj)
  },
  UPDATE_RUNNING_STATE (state, isRunning) {
    state.isRunning = isRunning
  },
  SET_RUNNING_INTERVAL_ID (state, id) {
    state.runningIntervalId = id
  },
  UPDATE_WORKING_TIMER (state) {
    state.timeCounter++
  },
  SET_WORKING_TIMER (state, timeCount) {
    state.timeCounter = timeCount
  },
  SET_WORKING_INTERVAL_ID (state, id) {
    state.workingIntervalId = id
  },
  SET_USER_STOP (state, isUserStop) {
    state.userStop = isUserStop
  }
}

const actions = {
  setTestList: (context, testObj) => {
    context.commit('SET_TEST_LIST', testObj)
  },
  updateRunningState: (context, isRunning) => {
    context.commit('UPDATE_RUNNING_STATE', isRunning)
  },
  setRuningIntervalId: (context, id) => {
    context.commit('SET_RUNNING_INTERVAL_ID', id)
  },
  updateWorkingTimer: (context) => {
    context.commit('UPDATE_WORKING_TIMER')
  },
  setWorkingTimer: (context, timeCount) => {
    context.commit('SET_WORKING_TIMER', timeCount)
  },
  setWorkingIntervalId: (context, id) => {
    context.commit('SET_WORKING_INTERVAL_ID', id)
  },
  setUserStop: (context, isUserStop) => {
    context.commit('SET_USER_STOP', isUserStop)
  }
}

const getters = {
  getTestList: state => {
    return state.testList
  },
  getRbcFields: state => {
    return state.rbcFields
  },
  getWbcFields: state => {
    return state.wbcFields
  },
  getRbcItems: state => {
    return state.rbcItems
  },
  getWbcItems: state => {
    return state.wbcItems
  },
  getWbcCount: state => {
    return state.wbcCount
  },
  getRunningState: state => {
    return state.isRunning
  },
  getRunningIntervalId: state => {
    return state.runningIntervalId
  },
  getWorkingTimer: state => {
    return state.timeCounter
  },
  getWorkingIntervalId: state => {
    return state.workingIntervalId
  },
  getUserStop: state => {
    return state.userStop
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
