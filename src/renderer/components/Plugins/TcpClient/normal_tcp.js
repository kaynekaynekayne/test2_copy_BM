import net from 'net'

var ip = 'localhost'
var port = '11235'
var socketClient = null

export default {
  initSocket() {
    const socket = new net.Socket()
    socketClient = socket

    socketClient.on('data', function (chunck) {
      try {
        console.log(chunck)
        // onReceiveData(chunck)
        socketClient.end()
      } catch (e) {
        console.log('onDataError', e.message)
      }
    })
    socketClient.on('error', function (e) {
      console.log(e.message)
      // var errObj = {resultCd: '-100', resultMsg: '[nor]' + e.message, jobCmd: 'OTHER'}
      // self.postMessage({params: errObj})
    })

  },
  connect() {
    socketClient.connect({port: port, host: ip})
  },
  sendMessage(msg) {

    console.log(msg)
    console.log(socketClient)
    socketClient.write(msg)
  }
}
