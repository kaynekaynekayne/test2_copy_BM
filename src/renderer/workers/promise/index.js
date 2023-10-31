// import PromiseWorker from 'promise-worker'
import NorWorker from 'worker-loader!./norworker'
import SysWorker from 'worker-loader!./sysworker'
import Constant from '../../../Constant.js'

const norWorker = new NorWorker()
// const sysWorker = new SysWorker()

const sendDataToServer = function (content, data) {
  // if (JSON.parse(data).jobCmd === 'SYSINFO') {
  //   sysWorker.postMessage({type: 'sendDataToServerSys', params: data})
  // } else {
  //   norWorker.postMessage({type: 'sendDataToServer', params: data})
  // }
  norWorker.postMessage({type: 'sendDataToServer', params: data})
}

// norWorker.onmessage = function(event) {
//   const bc = new BroadcastChannel(Constant.RECEIVE_DATA_BROADCAST_CHAN)
//   bc.postMessage({type: 'RECEIVE_DATA_NORMAL_WORKER', params: event.data.params})
//   bc.close()
// }
norWorker.onmessageerror = function(event) {
  event.preventDefault()
}

// sysWorker.onmessage = function(event) {
//   const bc = new BroadcastChannel(Constant.RECEIVE_DATA_BROADCAST_CHAN)
//   bc.postMessage({type: 'RECEIVE_DATA_SYSINFO_WORKER', params: event.data.params})
// }
// sysWorker.onmessageerror = function(event) {
//   event.preventDefault()
// }

export default {
  sendDataToServer,
  norWorker
  // sysWorker
}
