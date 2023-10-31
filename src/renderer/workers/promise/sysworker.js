import Configs from '../../../Configs.js'
import Constant from '../../../Constant.js'

const net = require('net')
const MAX_BUFF_LENGTH = 0xfffffff

var client = null
var bufList = []
var totalLenth = 0
var port = Configs.PORT
var addr = Configs.HOST_NAME
var bufStr = ''
var bodyLen = 0
var headerLength = 0

function onReceiveData (buff) {
  try {
    if (buff.indexOf('\n') === -1) {
      bufStr += buff.toString()
    } else {
      bufStr += buff.toString()

      self.postMessage({params: JSON.parse(bufStr.toString())})
      bufStr = ''
    }

  } catch (e) {
    bufList = ''
    // totalLenth = 0
  }
}

async function initConnToServer (callback) {
  console.log('initConnToServer')
  if (!client || !client.writable) {
    client = new net.Socket()
    client.connect({port: port, host: addr, keepAlive: false}, callback)

    client.on('data', function (chunck) {
      try {
        onReceiveData(chunck)
        // client.end()
      } catch (e) {
        console.log('onDataError', e.message)
      }
    })
    client.on('error', function (e) {
      console.log(e.message)
      var errObj = {resultCd: '-100', resultMsg: '[sys]' + e.message, jobCmd: 'OTHER'}
      self.postMessage({params: errObj})
    })
  }

  // if (!client.connecting) {
  //   client.connect(port, addr)
  // }
}

async function sendToServer (requestObj) {
  // if (!client || client.destroyed) {
  //   await initConnToServer()
  // }

  if (!client || !client.writable) {
    await initConnToServer(function() {
      // console.log(requestObj)
      if (requestObj && requestObj.length > 0) {
        if (client.writable) {
          requestObj += '\n'
          // console.log('write')
          client.write(requestObj)
        }
      }
    })
  } else {
    if (requestObj && requestObj.length > 0) {
      if (client.writable) {
        requestObj += '\n'
        // console.log('write')
        client.write(requestObj)
      }
    }
  }
}

self.onmessage = function (event) {
  if (event.data.type === 'sendDataToServerSys') {
    sendToServer(event.data.params)
  }
}
