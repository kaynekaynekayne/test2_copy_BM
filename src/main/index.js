'use strict'

import { app, ipcMain, BrowserWindow, Tray, Menu } from 'electron'
import path  from 'path'
import Configs from '../Configs.js'
import Constant from '../Constant.js'
import query from './database/query.js'

const os = require('os')
const env = {...process.env,ELECTRON_VERSION:process.versions.electron}

const log = require('electron-log')
const { dialog } = require('electron')
const fs = require('fs')
const cp = require('child_process')

var processes = []

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
  env.DB_PROCESS_PATH = path.resolve(env.LOCALAPPDATA, Configs.DB_PATH)
} else {
  env.DB_PROCESS_PATH = path.join(__dirname, 'database')
}

var interfaceProcess = cp.spawn('cmd', ['/c', 'start', '""', Configs.INTERFACE_FILE_NM], {cwd: Configs.INTERFACE_PATH})
interfaceProcess.stdout.on('data', function(data) {
  log.info('stdout: ' + data)
})
interfaceProcess.stderr.on('data', function(data) {
  log.info('stderr: ' + data)
})
interfaceProcess.on('exit', function(data) {
  log.info('exit interfaceProcess : ' + data)
  processes.splice(processes.indexOf(interfaceProcess), 1)
})

processes.push(interfaceProcess)

/** Sqlite3 */
const sqlite3 = require('sqlite3').verbose()
const sqliteChild = cp.fork(env.DB_PROCESS_PATH, [], {env: env})

processes.push(sqliteChild)

// sqliteChild.send({msg: 'INIT'})
sqliteChild.on('message', function(message) {
  try {
    log.info('[on message] : ' + message.msg)
    if (message.msg.includes('FAILED')) {
      log.info(message.msg)
    } else {
      if (message.msg === 'SELECT_ALL_SUCCESS' || message.msg === 'SELECT_SUCCESS') {
        log.info(message.succMsg)
        mainWindow.webContents.send(message.succMsg, message.rows)
      } else if (message.msg === 'UPDATE_SUCCESS') {
        log.info(message.succMsg)
        if (message.succMsg === Constant.UPDATE_RBC_CLASSIFICATION) {
          mainWindow.webContents.send(message.succMsg, message.rows)
        } else if (message.succMsg === Constant.SET_WBC_CUSTOM_LIST) {
          mainWindow.webContents.send(message.succMsg, message.rows)
        } else if (message.succMsg === Constant.UPDATE_NORMAL_RANGE) {
          mainWindow.webContents.send(message.succMsg, message.rows)
        }

        log.info(message.isCommit)
        if (message.isCommit === 'Y') {
          log.info('UPDATE COMMIT')
          // sqliteChild.send({msg: 'COMMIT'})
        }
      } else if (message.msg === 'INIT_SUCCESS') {
        addColumn()
        insertSettings()
      }
    }
  } catch (e) {
    log.info(e)
  }
})

// sqliteChild.on('close', function() {
//   log.info('child close')
//
//   app.quit()
//   app.exit()
// })

sqliteChild.on('disconnect', function() {
  log.info('disconnect')
})

sqliteChild.on('exit', function(code, signal) {
  log.info('exit : ' + code + ':' + signal)
  processes.splice(processes.indexOf(sqliteChild), 1)
})

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

/**
 * prototype
 */
Array.prototype.division = function (n) {
  var arr = this
  var len = arr.length
  var cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0)
  var tmp = []

  for (var i = 0; i < cnt; i++) {
    tmp.push(arr.splice(0, n))
  }

  return tmp
}

/**
 * Add column
 */
function addColumn () {
  // sqliteChild.send({msg: 'ALTER_TABLE', sql: query.ADD_IS_NS_NB_INTEGRATION})
  // sqliteChild.send({msg: 'ALTER_TABLE', sql: query.ADD_PLTCOUNT})
  // sqliteChild.send({msg: 'ALTER_TABLE', sql: query.ADD_CELLULARITY})
  // sqliteChild.send({msg: 'ALTER_TABLE', sql: query.ADD_ME_RATIO})
  // sqliteChild.send({msg: 'ALTER_TABLE', sql: query.ADD_IS_NORMAL, table:'TB_TEST_HISTORY', column: 'IS_NORMAL'})
}

/**
 * Default settings
 */
 function insertSettings () {
   sqliteChild.send({msg: 'INSERT', sql: query.INSERT_COMMON_CODE_GRP})
   sqliteChild.send({msg: 'INSERT', sql: query.INSERT_COMMON_CODE})
   sqliteChild.send({msg: 'INSERT', sql: query.INSERT_DEFAULT_HOT_KEY})
   sqliteChild.send({msg: 'INSERT', sql: query.INSERT_WBC_CUSTOM_CLASS})
   sqliteChild.send({msg: 'INSERT', sql: query.INSERT_DEFAULT_RBC_DEGREE})
   sqliteChild.send({msg: 'INSERT', sql: query.INSERT_DEFAULT_NORMAL_RANAGE})
 }

/**
 * Initial window options
 */
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    useContentSize: true,
    frame: false,
    resizable: false,
    webPreferences: {
      webSecurity: false,
      nativeWindowOpen: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
    // icon: '~@/assets/icons/icon.png'
    // resizable: false
  })

  mainWindow.loadURL(winURL)
  mainWindow.setMenuBarVisibility(false)
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * insert wbc classification
 */
function insertWbcClassification(payload) {
  var params = JSON.parse(payload)
  var tmpQuery = query.INSERT_WBC_CLASSIFICATION_ALL
  var userInput = ''
  var insertArgs = []

  log.info(params)

  if (params.wbcInfo.length > 0) {
    params.wbcInfo.forEach(function(wbcItem, index) {
      userInput += '(?,?,?,?,?,?,?,?,?,?,?)'
      if (index + 1 < params.wbcInfo.length) {
        userInput += ', '
      }

      insertArgs.push(params.cassetId)
      insertArgs.push(params.slotId)
      insertArgs.push(params.orderId)
      insertArgs.push(wbcItem.id)
      insertArgs.push(wbcItem.name)
      insertArgs.push(wbcItem.title)
      insertArgs.push(wbcItem.count)
      insertArgs.push(getDateTime())
      insertArgs.push(params.userId)
      insertArgs.push(getDateTime())
      insertArgs.push(params.userId)
    })

    if (params.wbcInfo.length > 0) {
      tmpQuery = tmpQuery.replace('userInput', userInput)
      sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
    }
  }
}

/**
 * update bm image class
 */
function updateBmImages(payload) {
  var params = JSON.parse(payload)
  var tmpQuery = query.UPDATE_WBC_IMAGES_HIST
  var userInput = ''
  var updateArgs = []
  var tmpArray = []

  if (params.bmInfo.length > 0) {
    params.bmInfo.forEach(function(bmItem) {

      // 파라메터 50개씩 분할 (sqlite max params 100)
      if (bmItem.images !== null && typeof(bmItem.images) !== 'undefined') {
        var divArray = bmItem.images.division(50)
        divArray.forEach(function (divItem) {
          userInput = ''
          updateArgs = []

          updateArgs.push(bmItem.id)
          updateArgs.push(params.cassetId)
          updateArgs.push(params.slotId)
          updateArgs.push(params.orderId)

          divItem.forEach(function(image, index) {
            userInput += 'FILE_NM = ' + '\'' + image + '\''
            if (index < (divItem.length - 1)) {
              userInput += ' OR '
            }
          })

          if (userInput !== '') {
            tmpQuery = query.UPDATE_WBC_IMAGES_HIST
            tmpQuery = tmpQuery.replace('userInput', userInput)
            sqliteChild.send({msg: 'UPDATE', sql: tmpQuery, args: updateArgs})
          }
        })
      }
    })
  }
}

/**
 * update normal cell
 */
function updateIsNormalCell(payload) {
  var params = JSON.parse(payload)
  var updateArgs = []

  updateArgs.push(params.isNormal)
  updateArgs.push(params.slotId)

  sqliteChild.send({msg: 'UPDATE', sql: query.UPDATE_IS_NORMAL_CELL, args: updateArgs})
}

/**
 * update wbc image class
 */
function updateWbcImages(payload) {
  var params = JSON.parse(payload)
  var tmpQuery = query.UPDATE_WBC_IMAGES_HIST
  var userInput = ''
  var updateArgs = []
  var tmpArray = []

  if (params.wbcInfo.length > 0) {
    // sqliteChild.send({msg: 'BEGIN'})

    params.wbcInfo.forEach(function(wbcItem, index) {
      // 파라메터 50개씩 분할 (sqlite max params 100)
      if (wbcItem.images !== null && typeof(wbcItem.images) !== 'undefined') {
        var divArray = wbcItem.images.division(50)
        divArray.forEach(function (divItem) {
          userInput = ''
          updateArgs = []

          updateArgs.push(wbcItem.id)
          updateArgs.push(params.cassetId)
          updateArgs.push(params.slotId)
          updateArgs.push(params.orderId)

          divItem.forEach(function(image, index) {
            userInput += 'FILE_NM = ' + '\'' + image + '\''
            if (index < (divItem.length - 1)) {
              userInput += ' OR '
            }
          })

          if (userInput !== '') {
            tmpQuery = query.UPDATE_WBC_IMAGES_HIST
            tmpQuery = tmpQuery.replace('userInput', userInput)

            var isCommit = 'N'
            // if (index + 1 === params.wbcInfo.length) {
            //   isCommit = 'Y'
            // }

            sqliteChild.send({msg: 'UPDATE', sql: tmpQuery, args: updateArgs, isCommit: isCommit})
          }
        })
      }
    })
  }
}

/**
 * insert bm images
 */
function insertBmImages(payload) {
  var params = JSON.parse(payload)
  var tmpQuery = query.INSERT_WBC_IMAGES_HIST
  var userInput = ''
  var insertArgs = []

  log.info(params)

  if (params.bmInfo !== null && typeof(params.bmInfo) !== 'undefined') {
    params.bmInfo.forEach(function(bmItem) {

      // 파라메터 50개씩 분할 (sqlite max params 100)
      if (typeof(bmItem.images) !== 'undifined' && bmItem.images !== null) {
        var divArray = bmItem.images.division(50)
        divArray.forEach(function (divItem) {
          userInput = ''
          insertArgs = []

          divItem.forEach(function(image, index) {
            userInput += '(?,?,?,?,?,?,?,?,?,?)'
            if (index + 1 < divItem.length) {
              userInput += ', '
            }

            insertArgs.push(params.cassetId)
            insertArgs.push(params.slotId)
            insertArgs.push(params.orderId)
            insertArgs.push(bmItem.id)
            insertArgs.push(image.fileName)
            insertArgs.push(bmItem.id)
            insertArgs.push(getDateTime())
            insertArgs.push(params.userId)
            insertArgs.push(getDateTime())
            insertArgs.push(params.userId)
          })

          if (userInput !== '') {
            tmpQuery = query.INSERT_WBC_IMAGES_HIST
            tmpQuery = tmpQuery.replace('userInput', userInput)
            sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
          }
        })
      }
    })
  }
}

/**
 * insert wbc images
 */
function insertWbcImages(payload) {
  var params = JSON.parse(payload)
  var tmpQuery = query.INSERT_WBC_IMAGES_HIST
  var userInput = ''
  var insertArgs = []

  log.info(params)

  if (params.wbcInfo.length > 0) {
    params.wbcInfo.forEach(function(wbcItem) {

      // 파라메터 50개씩 분할 (sqlite max params 100)
      if (typeof(wbcItem.images) !== 'undefined' && wbcItem.images.length > 0) {
        var divArray = wbcItem.images.division(50)
        divArray.forEach(function (divItem) {
          userInput = ''
          insertArgs = []

          divItem.forEach(function(image, index) {
            userInput += '(?,?,?,?,?,?,?,?,?,?)'
            if (index + 1 < divItem.length) {
              userInput += ', '
            }

            insertArgs.push(params.cassetId)
            insertArgs.push(params.slotId)
            insertArgs.push(params.orderId)
            insertArgs.push(wbcItem.id)
            insertArgs.push(image.fileName)
            insertArgs.push(wbcItem.id)
            insertArgs.push(getDateTime())
            insertArgs.push(params.userId)
            insertArgs.push(getDateTime())
            insertArgs.push(params.userId)
          })

          if (userInput !== '') {
            tmpQuery = query.INSERT_WBC_IMAGES_HIST
            tmpQuery = tmpQuery.replace('userInput', userInput)
            sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
          }
        })
      }
    })
  }
}

/**
 * insert bm classification
 */
function insertBmCellClassification(payload) {
  var params = JSON.parse(payload)
  var tmpQuery = query.INSERT_BM_CLASSIFICATION_ALL
  var userInput = ''
  var insertArgs = []

  log.info(params)

  params.bmInfo.forEach(function(bmItem, index) {
    userInput += '(?,?,?,?,?,?,?,?,?,?,?)'
    if (index + 1 < params.bmInfo.length) {
      userInput += ', '
    }

    insertArgs.push(params.cassetId)
    insertArgs.push(params.slotId)
    insertArgs.push(params.orderId)
    insertArgs.push(bmItem.id)
    insertArgs.push(bmItem.name)
    insertArgs.push(bmItem.title)
    insertArgs.push(bmItem.count)
    insertArgs.push(getDateTime())
    insertArgs.push(params.userId)
    insertArgs.push(getDateTime())
    insertArgs.push(params.userId)
  })

  if (userInput !== '') {
    tmpQuery = tmpQuery.replace('userInput', userInput)
    sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
  }
}

/**
 * insert bm classification Hist
 */
function insertBmCellClassificationHist(payload) {
  var params = JSON.parse(payload)
  var tmpQuery = query.INSERT_BM_CLASSIFICATION_HIST
  var userInput = ''
  var insertArgs = []

  log.info(params)

  params.bmInfo.forEach(function(bmItem, index) {
    userInput += '(?,?,?,?,?,?,?,?,?,?,?)'
    if (index + 1 < params.bmInfo.length) {
      userInput += ', '
    }

    insertArgs.push(params.cassetId)
    insertArgs.push(params.slotId)
    insertArgs.push(params.orderId)
    insertArgs.push(bmItem.id)
    insertArgs.push(bmItem.name)
    insertArgs.push(bmItem.title)
    insertArgs.push(bmItem.count)
    insertArgs.push(getDateTime())
    insertArgs.push(params.userId)
    insertArgs.push(getDateTime())
    insertArgs.push(params.userId)
  })

  if (userInput !== '') {
    tmpQuery = tmpQuery.replace('userInput', userInput)
    sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
  }
}

/**
 * insert rbc classification
 */
function insertRbcClassification(payload) {
  var params = JSON.parse(payload)
  var tmpQuery = query.INSERT_RBC_CLASSIFICATION
  var userInput = ''
  var insertArgs = []

  log.info(params)

  params.rbcInfo.forEach(function (rbcItem, rbcIndex) {
    rbcItem.classInfo.forEach(function (classItem, classIndex) {
      userInput += '(?,?,?,?,?,?,?,?,?,?,?)'
      if (classIndex + 1 < rbcItem.classInfo.length) {
        userInput += ', '
      }

      insertArgs.push(params.cassetId)
      insertArgs.push(params.slotId)
      insertArgs.push(params.orderId)
      insertArgs.push(rbcItem.categoryId)
      insertArgs.push(classItem.classId)
      insertArgs.push(classItem.classNm)
      insertArgs.push(classItem.degree)
      insertArgs.push(getDateTime())
      insertArgs.push(params.userId)
      insertArgs.push(getDateTime())
      insertArgs.push(params.userId)
    })

    if (rbcIndex + 1 < params.rbcInfo.length) {
      userInput += ', '
    }
  })

  if (userInput !== '') {
    tmpQuery = tmpQuery.replace('userInput', userInput)
    sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
  }
}

/**
 * insert rbc category
 */
function insertRbcCategories(payload) {
  var params = JSON.parse(payload)
  var tmpQuery = query.INSERT_RBC_CATEGORYES
  var userInput = ''
  var insertArgs = []

  log.info(params)

  if (params.rbcInfo.length > 0) {
    params.rbcInfo.forEach(function(rbcItem, index) {
      userInput += '(?,?,?,?,?,?,?,?,?)'
      if (index + 1 < params.rbcInfo.length) {
        userInput += ', '
      }

      insertArgs.push(params.cassetId)
      insertArgs.push(params.slotId)
      insertArgs.push(params.orderId)
      insertArgs.push(rbcItem.categoryId)
      insertArgs.push(rbcItem.categoryNm)
      insertArgs.push(getDateTime())
      insertArgs.push(params.userId)
      insertArgs.push(getDateTime())
      insertArgs.push(params.userId)
    })

    if (userInput !== '') {
      tmpQuery = tmpQuery.replace('userInput', userInput)
      sqliteChild.send({msg: 'INSERT', sql: tmpQuery, args: insertArgs})
    }
  }
}

function getDateTime() {
  var now = new Date()
  var year = "" + now.getFullYear()
  var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month }
  var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day }
  var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour }
  var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute }
  var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second }

  return year + month + day + hour + minute + second
}

/**
 * create progressbar window
 */
function createProgressBar() {
  progressBar = new ProgressBar({
    text: 'Preparing data...',
    detail: 'Wait...'
  })

  progressBar.on('completed', function() {
    log.info(`completed...`)
    progressBar.detail = 'Task completed. Exiting...'
  })

  progressBar.on('aborted', function() {
    log.info(`aborted...`)
  })
}

// single instance lock 요청
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    log.info('second-instance')
    log.info(mainWindow)

    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      } else if (!mainWindow.isVisible()) {
        mainWindow.show()
      }
      mainWindow.focus()
    }
  })
}

/**
 * [ELECTRON EVENTS START]
 */
app.on('ready', () => {
  log.info('---- electron ready ----')
  log.info(path.join(__dirname, '../globalEnv.env'))
  log.info(`file://${__dirname}/index.html`)
  log.info(process.argv)

  // 메인 윈도우 생성
  createWindow()

  // if (process.env.NODE_ENV !== 'production') {
  //   autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml')
  // }
  //  else {
  //   if (fs.existsSync("D:/IA_Proc/tmp.db")) {
  //     // 백업db 복구
  //     fs.copyFileSync("D:/IA_Proc/tmp.db", 'pb.db')
  //
  //     // 파일 삭제
  //     fs.unlinkSync('D:/IA_Proc/tmp.db')
  //   }
  //
  //   autoUpdater.checkForUpdatesAndNotify()
  //   createProgressBar()
  // }
})

app.on('window-all-closed', () => {
  log.info('window-all-closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('before-quit', () => {
  cp.exec('taskkill /im ' + Configs.INTERFACE_FILE_NM + ' /f')
  processes.forEach(function(proc) {
    log.info('kill - ' + os.platform() + ':' + proc.pid)
    proc.kill()
  })
})
// [ELECTRON EVENTS END]

/**
 * [IPC RECEIVER START]
 */
ipcMain.on('SHUTDOWN', (event, payload) => {
  log.info('SHUTDOWN')

  app.quit()
  app.exit()
  // sqliteChild.send({msg: 'SHUTDOWN'})
})

ipcMain.on('open-file-dialog-for-dir', async (event, pathType) => {
  const dir = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (dir) {
    var params = {
      path: dir[0],
      pathType: pathType
    }
    event.sender.send("selected-dir", params)
  }
})

// select db file
ipcMain.on('open-file-dialog-restore', async (event, pathType) => {
  // const file = await dialog.showOpenDialog({ properties: ['openFile'] })
  const file = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'json', extension: ['json'] }
    ]
  })
  if (file) {
    // fs.copyFileSync(file[0], Configs.DB_FILE_NAME)
    // event.sender.send("restore-success", null)
    event.sender.send("file-select", file)
  }
})

// save file
ipcMain.on('open-save-dialog', async (event, pathType) => {
  dialog.showSaveDialog({}, (filename) => {
    if (filename) {
      fs.copyFileSync(Configs.DB_FILE_NAME, filename + '.db')
      event.sender.send("backup-success", null)
    }
  })
})

// 영상 이동시 insert replace 처리
ipcMain.on(Constant.INSERT_WBC_CLASSIFICATION, (event, payload) => {
  insertWbcClassification(payload)
  // 전체 업데이트 하지 말고 변경된 image만 업데이트 칩시다.
  // updateWbcImages(payload)
  updateIsNormalCell(payload)
})

ipcMain.on(Constant.INSERT_BM_CLASSIFICATION, (event, payload) => {
  insertBmCellClassification(payload)
  // 전체 업데이트 하지 말고 변경된 image만 업데이트 칩시다.
  // updateBmImages(payload)
  updateIsNormalCell(payload)
})

ipcMain.on(Constant.GET_WBC_MODIFY_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.GET_WBC_MODIFY_LIST, sql: query.SELECT_WBC_MODIFY_LIST, args: args})
})

ipcMain.on(Constant.GET_BM_MODIFY_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.GET_BM_MODIFY_LIST, sql: query.SELECT_BM_MODIFY_LIST, args: args})
})

ipcMain.on(Constant.UPDATE_SIGNED_STATE, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.state)
  args.push(getDateTime())
  args.push(params.userId)
  args.push(getDateTime())
  args.push(params.userId)
  args.push(params.orderId)

  sqliteChild.send({msg: 'INSERT', sql: query.UPDATE_SIGNED_STATE, args: args})
})

ipcMain.on(Constant.UPDATE_TEST_HISTORY, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.bmNo)
  args.push(params.patientId)
  args.push(params.patientNm)
  args.push(getDateTime())
  args.push(params.userId)
  args.push(params.orderId)

  sqliteChild.send({msg: 'UPDATE', sql: query.UPDATE_TEST_HISTORY_PATIENT, args: args})
})

// 테스트 결과 저장
ipcMain.on(Constant.SET_TEST_HISTORY, (event, payload) => {
  var params = JSON.parse(payload)

  var insertHistArgs = []
  insertHistArgs.push(params.cassetId)
  insertHistArgs.push(params.slotId)
  insertHistArgs.push(params.cassetNo)
  insertHistArgs.push(params.slotNo)
  insertHistArgs.push(params.barcodeNo)
  insertHistArgs.push(params.patientId)
  insertHistArgs.push(params.patientNm)
  insertHistArgs.push(params.orderDttm)
  insertHistArgs.push(params.stateCd)
  insertHistArgs.push(params.malariaCount)
  insertHistArgs.push(params.analyzedDttm)
  insertHistArgs.push(params.birthDay)
  insertHistArgs.push(params.age)
  insertHistArgs.push(params.gender)
  insertHistArgs.push(params.testType)
  insertHistArgs.push(params.bmNo)
  insertHistArgs.push(params.orderId)
  insertHistArgs.push('Ready')
  insertHistArgs.push('')
  insertHistArgs.push('')
  insertHistArgs.push('')
  insertHistArgs.push('')
  insertHistArgs.push('')
  insertHistArgs.push(params.cellCount)
  insertHistArgs.push(params.maxRbcCount)
  insertHistArgs.push(params.slotId)
  insertHistArgs.push(params.department)
  insertHistArgs.push(params.bmSamplingSide)
  insertHistArgs.push(params.stainType)
  insertHistArgs.push(params.analysisType)
  insertHistArgs.push(params.stitchCount)
  insertHistArgs.push(params.isNsNbIntegration)
  insertHistArgs.push(params.pltCount)
  insertHistArgs.push(params.cellularity)
  insertHistArgs.push(params.meRatio)
  insertHistArgs.push(params.isNormal)
  insertHistArgs.push(getDateTime())
  insertHistArgs.push(params.userId)
  insertHistArgs.push(getDateTime())
  insertHistArgs.push(params.userId)

  sqliteChild.send({msg: 'INSERT', sql: query.INSERT_TEST_HISTORY, args: insertHistArgs})
})

ipcMain.on(Constant.GET_TEST_HISTORY, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.orderId)

  sqliteChild.send({msg: 'SELECT', succMsg: Constant.GET_TEST_HISTORY, sql: query.SELECT_TEST_HISTORY, args: args})
})

ipcMain.on(Constant.GET_DIAG_WBC_DETAIL, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.orderId)

  sqliteChild.send({msg: 'SELECT', succMsg: Constant.GET_DIAG_WBC_DETAIL, sql: query.SELECT_TEST_HISTORY, args: args})
})

ipcMain.on(Constant.GET_PB_SMEAR, (event, payload) => {
  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.GET_PB_SMEAR, sql: query.SELECT_PB_SEMAR})
})

ipcMain.on(Constant.GET_BM_CELL_CLASSIFICATION, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.orderId)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.GET_BM_CELL_CLASSIFICATION, sql: query.SELECT_BM_CELL_CLASSIFICATION, args: args})
})

// 최대 25건 조회
ipcMain.on(Constant.GET_TEST_HISTORY_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  var searchQuery = query.SEARCH_TEST_HISTORY_LIST

  if (params.searchText !== '' && params.searchType !== '01') {
    args.push('%' + params.searchText + '%')

    if (params.searchType === '02') {
      searchQuery += '\n AND BM_NO LIKE ?'
    } else if (params.searchType === '03') {
      searchQuery += '\n AND PATIENT_ID LIKE ?'
    } else if (params.searchType === '04') {
      searchQuery += '\n AND PATIENT_NM LIKE ?'
    } else if (params.searchType === '05') {
      searchQuery += '\n AND DEPARTMENT LIKE ?'
    }
  }

  if (params.startDate !== '' && params.endDate !== '') {
    searchQuery += `\n AND SUBSTR(ANALYZE_DTTM, 1, 8) BETWEEN REPLACE(?, '-', '') AND REPLACE(?, '-', '')`

    args.push(params.startDate)
    args.push(params.endDate)
  }

  if (params.wbcClassList.length > 0) {
    var tmpStr = ''

    params.wbcClassList.forEach(function(value, index) {
      tmpStr += `'` + value + `'`

      if ((params.wbcClassList.length - 1) !== (index)) {
        tmpStr += ','
      }
    })

    searchQuery += `\n AND A.ORDER_ID IN (SELECT IFNULL(MIN(TB.ORDER_ID), 0) AS ORDER_ID
                                          FROM TB_WBC_CLASSIFICATION TB
                                         WHERE A.CASSET_ID = TB.CASSET_ID
                                           AND A.ORDER_ID = TB.ORDER_ID
                                           AND TB.COUNT > 0
                                           AND TB.CLASS_ID IN (%s)
                                         UNION
                                         SELECT IFNULL(MIN(TC.ORDER_ID), 0) AS ORDER_ID
                                           FROM TB_BM_CELL_CLASSIFICATION TC
                                          WHERE A.CASSET_ID = TC.CASSET_ID
                                            AND A.ORDER_ID = TC.ORDER_ID
                                            AND TC.COUNT > 0
                                            AND TC.CLASS_ID IN (%s))`
    searchQuery = searchQuery.replace(/%s/gi, tmpStr)
  }

  args.push(params.limit)
  args.push(params.size)

  searchQuery += '\n ORDER BY ANALYZE_DTTM DESC'
  searchQuery += '\n LIMIT ?, ?'

  log.info(searchQuery)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.GET_TEST_HISTORY_LIST, sql: searchQuery, args: args})
})

// 최대 500건 조회
ipcMain.on(Constant.ALL_TEST_HISTORY_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  var searchQuery = query.SEARCH_TEST_HISTORY_LIST_ALL

  if (params.jsonList !== null && params.jsonList.length > 0) {
    var tmpStr = ''

    params.jsonList.forEach(function(item, index) {
      tmpStr += `'` + item.SLOT_ID + `'`

      if ((params.jsonList.length - 1) !== (index)) {
        tmpStr += ','
      }
    })

    searchQuery += `\n AND A.SLOT_ID IN (%s)`
    searchQuery = searchQuery.replace('%s', tmpStr)
  } else {
    if (params.searchText !== '' && params.searchType !== '01') {
      args.push('%' + params.searchText + '%')

      if (params.searchType === '02') {
        searchQuery += '\n AND A.BM_NO LIKE ?'
      } else if (params.searchType === '03') {
        searchQuery += '\n AND A.PATIENT_ID LIKE ?'
      } else if (params.searchType === '04') {
        searchQuery += '\n AND A.PATIENT_NM LIKE ?'
      } else if (params.searchType === '05') {
        searchQuery += '\n AND A.DEPARTMENT LIKE ?'
      }
    }

    if (params.startDate !== '' && params.endDate !== '') {
      searchQuery += `\n AND SUBSTR(A.ANALYZE_DTTM, 1, 8) BETWEEN REPLACE(?, '-', '') AND REPLACE(?, '-', '')`

      args.push(params.startDate)
      args.push(params.endDate)
    }

    if (params.wbcClassList.length > 0) {
      var tmpStr = ''

      params.wbcClassList.forEach(function(value, index) {
        tmpStr += `'` + value + `'`

        if ((params.wbcClassList.length - 1) !== (index)) {
          tmpStr += ','
        }
      })

      searchQuery += `\n AND A.ORDER_ID IN (SELECT IFNULL(MIN(TB.ORDER_ID), 0) AS ORDER_ID
                                            FROM TB_WBC_CLASSIFICATION TB
                                           WHERE A.CASSET_ID = TB.CASSET_ID
                                             AND A.ORDER_ID = TB.ORDER_ID
                                             AND TB.COUNT > 0
                                             AND TB.CLASS_ID IN (%s)
                                           UNION
                                           SELECT IFNULL(MIN(TC.ORDER_ID), 0) AS ORDER_ID
                                             FROM TB_BM_CELL_CLASSIFICATION TC
                                            WHERE A.CASSET_ID = TC.CASSET_ID
                                              AND A.ORDER_ID = TC.ORDER_ID
                                              AND TC.COUNT > 0
                                              AND TC.CLASS_ID IN (%s))`
      searchQuery = searchQuery.replace(/%s/gi, tmpStr)
    }
  }

  args.push(params.limit)

  searchQuery += '\n ORDER BY A.ANALYZE_DTTM DESC'
  searchQuery += '\n LIMIT ?, 500'

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.ALL_TEST_HISTORY_LIST, sql: searchQuery, args: args})
})

ipcMain.on(Constant.DELETE_TEST_HISTORY, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  var userInput = ''
  var tmpQuery = query.DELETE_TEST_HISTORY

  params.forEach(function (item, index) {
    userInput += '?'
    if (index + 1 < params.length) {
      userInput += ', '
    }
    args.push(item.SLOT_ID)
  })

  tmpQuery = tmpQuery.replace('userInput', userInput)
  log.info(tmpQuery)

  sqliteChild.send({msg: 'DELETE', sql: tmpQuery, args: args})
})

// 분석 결과 저장
ipcMain.on(Constant.SET_CLASSIFICATION, (event, payload) => {
  var params = JSON.parse(payload)

  if (params.analysisType === '01') {
    // wbc
    insertWbcClassification(payload)

    // wbc image
    insertWbcImages(payload)

    // rbc category
    insertRbcCategories(payload)

    // rbc
    insertRbcClassification(payload)
  } else {
    // bm
    insertBmCellClassification(payload)

    // bm 원본 데이터
    insertBmCellClassificationHist(payload)

    // bm image
    insertBmImages(payload)
  }
})

// LIS----
ipcMain.on(Constant.SELECT_LIS_CODE, (event, payload) => {
  var params = JSON.parse(payload)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.SELECT_LIS_CODE, sql: query.SELECT_LIS_CODE, args: []})
})

ipcMain.on(Constant.UPDATE_LIS_CODE, (event, payload) => {
  var params = JSON.parse(payload)

  log.info(params.codeList)
  params.codeList.forEach(function(item, index) {
    if (item.code !== '' && typeof(item.code) !== 'undefined') {
      var insertHistArgs = []

      insertHistArgs.push(item.value)
      insertHistArgs.push(item.code.trim())
      insertHistArgs.push(item.text)
      insertHistArgs.push(params.testType)
      insertHistArgs.push(getDateTime())
      insertHistArgs.push(params.userId)
      insertHistArgs.push(getDateTime())
      insertHistArgs.push(params.userId)

      sqliteChild.send({msg: 'INSERT', sql: query.INSERT_LIS_CODE, args: insertHistArgs})
    }
  })
})

// CBC----
ipcMain.on(Constant.SELECT_CBC_CODE, (event, payload) => {
  var params = JSON.parse(payload)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.SELECT_CBC_CODE, sql: query.SELECT_CBC_CODE, args: []})
})

ipcMain.on(Constant.UPDATE_CBC_CODE, (event, payload) => {
  var params = JSON.parse(payload)

  log.info(params.codeList)
  params.codeList.forEach(function(item, index) {
    if (item.testCd !== '' && typeof(item.testCd) !== 'undefined') {
      var insertHistArgs = []

      insertHistArgs.push(item.cd)
      insertHistArgs.push(item.testCd.trim())
      insertHistArgs.push(item.testNm)
      insertHistArgs.push(item.isSelected)
      insertHistArgs.push(getDateTime())
      insertHistArgs.push(params.userId)
      insertHistArgs.push(getDateTime())
      insertHistArgs.push(params.userId)

      sqliteChild.send({msg: 'INSERT', sql: query.INSERT_CBC_CODE, args: insertHistArgs})
    }
  })
})

// lis connection path
ipcMain.on(Constant.SELECT_LIS_CONN_PATH, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.deviceBarcode)

  sqliteChild.send({msg: 'SELECT', succMsg: Constant.SELECT_LIS_CONN_PATH, sql: query.SELECT_LIS_CONN_PATH, args: args})
})

ipcMain.on(Constant.UPDATE_LIS_CONN_PATH, (event, payload) => {
  var params = JSON.parse(payload)
  var insertHistArgs = []

  insertHistArgs.push(params.deviceBarcode)
  insertHistArgs.push(params.lisFilePath.trim())
  insertHistArgs.push(params.lisUrl.trim())
  insertHistArgs.push(params.lisTypeCd)
  insertHistArgs.push(params.cbcFilePath)
  insertHistArgs.push(params.cbcUrl)
  insertHistArgs.push(params.cbcTypeCd)
  insertHistArgs.push(getDateTime())
  insertHistArgs.push(params.userId)
  insertHistArgs.push(getDateTime())
  insertHistArgs.push(params.userId)

  sqliteChild.send({msg: 'INSERT', sql: query.UPDATE_LIS_CONN_PATH, args: insertHistArgs})
})

ipcMain.on(Constant.GET_RBC_COUNT, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.orderId)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.GET_RBC_COUNT, sql: query.SELECT_RBC_CLASSIFICATION, args: args})
})

ipcMain.on(Constant.UPDATE_RBC_COMMENT, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.obj.rbcComment)
  args.push(params.obj.slotId)

  sqliteChild.send({msg: 'UPDATE', sql: query.UPDATE_RBC_COMMENT, args: args})
})

ipcMain.on(Constant.UPDATE_RBC_CLASSIFICATION, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  log.info(params)
  args.push(params.degree)
  args.push(params.cassetId)
  args.push(params.slotId)
  args.push(params.categoryId)
  args.push(params.classId)

  sqliteChild.send({msg: 'UPDATE', succMsg: Constant.UPDATE_RBC_CLASSIFICATION, sql: query.UPDATE_RBC_CLASSIFICATION, args: args})
})

ipcMain.on(Constant.UPDATE_WBC_COMMENT, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.obj.wbcComment)
  args.push(params.obj.slotId)

  sqliteChild.send({msg: 'UPDATE', sql: query.UPDATE_WBC_COMMENT, args: args})
})

ipcMain.on(Constant.UPDATE_BM_COMMENT, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.obj.bmComment)
  args.push(params.obj.slotId)

  sqliteChild.send({msg: 'UPDATE', sql: query.UPDATE_BM_COMMENT, args: args})
})

ipcMain.on(Constant.SET_WBC_CELL_POSITION, (event, payload) => {
  var params = JSON.parse(payload)

  if (params.slotInfo) {
    params.slotInfo.forEach(function(slot) {
      slot.positionInfo.forEach(function(position) {
        var args = []

        args.push(params.cassetId)
        args.push(slot.slotId)
        args.push(position.fileId)
        args.push(position.fileName)
        args.push(position.posX1)
        args.push(position.posY1)
        args.push(position.posX2)
        args.push(position.posY2)
        args.push(position.orgWidth)
        args.push(position.orgHeight)
        args.push(slot.analysisType)
        args.push(getDateTime())
        args.push(params.userId)
        args.push(getDateTime())
        args.push(params.userId)

        sqliteChild.send({msg: 'INSERT', sql: query.INSERT_WBC_CELL_POSITION, args: args})
      })
    })
  }
})

// get cell position
ipcMain.on(Constant.GET_WBC_CELL_POSITION, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)
  args.push(params.analysisType)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.GET_WBC_CELL_POSITION, sql: query.SELECT_WBC_CELL_POSITION, args: args})
})


// 가입 여부 체크
ipcMain.on(Constant.IS_REGIST_USER, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.userId)

  sqliteChild.send({msg: 'SELECT', succMsg: Constant.IS_REGIST_USER, sql: query.IS_REGIST_USER, args: args})
})

ipcMain.on(Constant.SET_USER, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.userId)
  args.push(params.userName)
  args.push(params.empNo)
  args.push(params.position)
  args.push(params.authCd)
  args.push(params.encPassword)
  args.push(params.isAvailable)
  args.push('')
  args.push(getDateTime())
  args.push(params.userId)
  args.push(getDateTime())
  args.push(params.userId)

  sqliteChild.send({msg: 'INSERT', sql: query.INSERT_USER, args: args})
})

ipcMain.on(Constant.UPDATE_LOGIN_DTTM, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(getDateTime())
  args.push(getDateTime())
  args.push(params.userId)

  sqliteChild.send({msg: 'UPDATE', sql: query.UPDATE_USER_DTTM, args})
})

ipcMain.on(Constant.GET_USER_LIST, (event, payload) => {
  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.GET_USER_LIST, sql: query.SELECT_USER_LIST})
})

ipcMain.on(Constant.UPDATE_USER, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.authCd)
  args.push(params.userName)
  args.push(params.isAvailable)
  args.push(getDateTime())
  args.push(params.userId)

  sqliteChild.send({msg: 'UPDATE', sql: query.UPDATE_USER, args})
})

ipcMain.on(Constant.DELETE_USER, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.userId)

  sqliteChild.send({msg: 'DELETE', sql: query.DELETE_USER, args})
})

ipcMain.on(Constant.UPDATE_MALARIA_COUNT, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.malariaCount)
  args.push(getDateTime())
  args.push(params.userId)
  args.push(params.slotId)

  sqliteChild.send({msg: 'UPDATE', sql: query.UPDATE_MALARIA_COUNT, args: args})
})

ipcMain.on(Constant.GET_BM_HIST_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.orderId)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.GET_BM_HIST_LIST, sql: query.SELECT_BM_CELL_CLASSIFICATION_HIST, args: args})
})

ipcMain.on(Constant.GET_TEST_HISTORY_PREV, (event, payload) => {
  log.info('GET_TEST_HISTORY_PREV')
  var params = JSON.parse(payload)
  var args = []
  var searchQuery = query.SEARCH_TEST_HISTORY_LIST

  if (params.searchText !== '') {
    // args.push('%' + params.searchText + '%')

    if (params.searchType === '02') {
      searchQuery += '\n AND A.BM_NO LIKE ' + `'%` + params.searchText + `%'`
    } else if (params.searchType === '03') {
      searchQuery += '\n AND A.PATIENT_ID LIKE ' + `'%` + params.searchText + `%'`
    } else if (params.searchType === '04') {
      searchQuery += '\n AND A.PATIENT_NM LIKE ' + `'%` + params.searchText + `%'`
    } else if (params.searchType === '05') {
      searchQuery += '\n AND A.DEPARTMENT LIKE ' + `'%` + params.searchText + `%'`
    }
  }

  if (params.startDate !== '' && params.endDate !== '') {
    searchQuery += `\n AND SUBSTR(A.ANALYZE_DTTM, 1, 8) BETWEEN REPLACE('` + params.startDate + `', '-', '')` +
                   `\n AND REPLACE('` + params.endDate + `', '-', '')`

    // args.push(params.startDate)
    // args.push(params.endDate)
  }

  if (params.wbcClassList.length > 0) {
    var tmpStr = ''

    params.wbcClassList.forEach(function(value, index) {
      tmpStr += `'` + value + `'`

      if ((params.wbcClassList.length - 1) !== (index)) {
        tmpStr += ','
      }
    })

    searchQuery += `\n AND A.ORDER_ID IN (SELECT IFNULL(MIN(TB.ORDER_ID), 0) AS ORDER_ID
                                          FROM TB_WBC_CLASSIFICATION TB
                                         WHERE A.CASSET_ID = TB.CASSET_ID
                                           AND A.ORDER_ID = TB.ORDER_ID
                                           AND TB.COUNT > 0
                                           AND TB.CLASS_ID IN (%s)
                                         UNION
                                         SELECT IFNULL(MIN(TC.ORDER_ID), 0) AS ORDER_ID
                                           FROM TB_BM_CELL_CLASSIFICATION TC
                                          WHERE A.CASSET_ID = TC.CASSET_ID
                                            AND A.ORDER_ID = TC.ORDER_ID
                                            AND TC.COUNT > 0
                                            AND TC.CLASS_ID IN (%s))`
    searchQuery = searchQuery.replace(/%s/gi, tmpStr)
  }

  // args.push(params.limit)
  // args.push(params.size)
  // args.push(params.limit)
  // args.push(params.size)

  searchQuery += '\n ORDER BY A.ANALYZE_DTTM DESC'
  searchQuery += '\n LIMIT ' + params.limit + ',' + params.size

  args.push(params.orderId)

  var prevQuery = 'SELECT * FROM (' + searchQuery + ') TA'
  prevQuery += `\n WHERE 1=1 AND TA.ROW_NUM < (SELECT B.ROW_NUM
                                           FROM (` + searchQuery + `) B
                                          WHERE B.ORDER_ID = ?)`
  prevQuery += '\n ORDER BY TA.ROW_NUM DESC'
  prevQuery += '\n LIMIT 1'

  log.info(prevQuery)
  log.info(args)
  sqliteChild.send({msg: 'SELECT', succMsg: Constant.GET_TEST_HISTORY_PREV, sql: prevQuery, args: args})
})

ipcMain.on(Constant.GET_TEST_HISTORY_NEXT, (event, payload) => {
  log.info('GET_TEST_HISTORY_NEXT')
  var params = JSON.parse(payload)
  var args = []
  var searchQuery = query.SEARCH_TEST_HISTORY_LIST

  log.info(params)

  if (params.searchText !== '') {
    // args.push('%' + params.searchText + '%')

    if (params.searchType === '02') {
      searchQuery += '\n AND A.BM_NO LIKE ' + `'%` + params.searchText + `%'`
    } else if (params.searchType === '03') {
      searchQuery += '\n AND A.PATIENT_ID LIKE ' + `'%` + params.searchText + `%'`
    } else if (params.searchType === '04') {
      searchQuery += '\n AND A.PATIENT_NM LIKE ' + `'%` + params.searchText + `%'`
    } else if (params.searchType === '05') {
      searchQuery += '\n AND A.DEPARTMENT LIKE ' + `'%` + params.searchText + `%'`
    }
  }

  if (params.startDate !== '' && params.endDate !== '') {
    searchQuery += `\n AND SUBSTR(A.ANALYZE_DTTM, 1, 8) BETWEEN REPLACE('` + params.startDate + `', '-', '')` +
                   `\n AND REPLACE('` + params.endDate + `', '-', '')`

    // args.push(params.startDate)
    // args.push(params.endDate)
  }

  if (params.wbcClassList.length > 0) {
    var tmpStr = ''

    params.wbcClassList.forEach(function(value, index) {
      tmpStr += `'` + value + `'`

      if ((params.wbcClassList.length - 1) !== (index)) {
        tmpStr += ','
      }
    })

    searchQuery += `\n AND A.ORDER_ID IN (SELECT IFNULL(MIN(TB.ORDER_ID), 0) AS ORDER_ID
                                          FROM TB_WBC_CLASSIFICATION TB
                                         WHERE A.CASSET_ID = TB.CASSET_ID
                                           AND A.ORDER_ID = TB.ORDER_ID
                                           AND TB.COUNT > 0
                                           AND TB.CLASS_ID IN (%s)
                                         UNION
                                         SELECT IFNULL(MIN(TC.ORDER_ID), 0) AS ORDER_ID
                                           FROM TB_BM_CELL_CLASSIFICATION TC
                                          WHERE A.CASSET_ID = TC.CASSET_ID
                                            AND A.ORDER_ID = TC.ORDER_ID
                                            AND TC.COUNT > 0
                                            AND TC.CLASS_ID IN (%s))`
    searchQuery = searchQuery.replace(/%s/gi, tmpStr)
  }

  // args.push(params.limit)
  // args.push(params.size)
  // args.push(params.limit)
  // args.push(params.size)

  searchQuery += '\n ORDER BY A.ANALYZE_DTTM DESC'
  searchQuery += '\n LIMIT ' + params.limit + ',' + params.size

  args.push(params.orderId)

  var nextQuery = 'SELECT * FROM (' + searchQuery + ') TA'
  nextQuery += `\n WHERE 1=1 AND TA.ROW_NUM > (SELECT B.ROW_NUM
                                           FROM (` + searchQuery + `) B
                                          WHERE B.ORDER_ID = ?)`
  nextQuery += '\n ORDER BY TA.ROW_NUM ASC'
  nextQuery += '\n LIMIT 1'

  log.info(nextQuery)
  log.info(args)

  sqliteChild.send({msg: 'SELECT', succMsg: Constant.GET_TEST_HISTORY_NEXT, sql: nextQuery, args: args})
})

ipcMain.on(Constant.SELECT_WBC_CUSTOM_CLASS, (event, payload) => {
  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.SELECT_WBC_CUSTOM_CLASS, sql: query.SELECT_WBC_CUSTOM_CLASS})
})

ipcMain.on(Constant.SET_WBC_CUSTOM_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  log.info(params.wbcCustomList)
  params.wbcCustomList.forEach(function(item) {
    var args = []
    args.push(item.CLASS_TITLE)
    args.push(item.CLASS_NM)
    args.push(item.CLASS_ID)

    sqliteChild.send({msg: 'UPDATE', succMsg: Constant.SET_WBC_CUSTOM_LIST, sql: query.UPDATE_WBC_CUSTOM_CLASS, args: args})

    var hotArgs = []
    hotArgs.push(item.CLASS_TITLE)
    hotArgs.push(item.CLASS_NM)
    hotArgs.push('01')
    hotArgs.push(item.CLASS_ID)

    sqliteChild.send({msg: 'UPDATE', succMsg: Constant.UPDATE_HOT_KEYS_WBC_CUSTOM, sql: query.UPDATE_HOT_KEYS_WBC_CUSTOM, args: hotArgs})
  })
})

ipcMain.on(Constant.DELETE_BACKUP_DATA, (event, payload) => {
  var params = JSON.parse(payload)

  if (params.backupList !== null && typeof(params.backupList) !== 'undefined') {
    // sqliteChild.send({msg: 'BEGIN'})

    params.backupList.forEach(function (item, index) {
      var insertArgs = []
      insertArgs.push(item.CASSET_ID)
      insertArgs.push(item.SLOT_ID)
      insertArgs.push(item.ORDER_ID)
      insertArgs.push('Y')
      insertArgs.push(getDateTime())
      insertArgs.push('')
      insertArgs.push(getDateTime())
      insertArgs.push(params.userId)
      insertArgs.push(getDateTime())
      insertArgs.push(params.userId)

      sqliteChild.send({msg: 'INSERT', sql: query.INSERT_BACKUP_HIST, args: insertArgs})

      var deleteArgs = []
      deleteArgs.push(item.CASSET_ID)
      deleteArgs.push(item.SLOT_ID)
      deleteArgs.push(item.ORDER_ID)

      sqliteChild.send({msg: 'DELETE', sql: query.DELETE_BACKUP_TEST_HISTORY, args: deleteArgs})

      // if (index + 1 === params.backupList.length) {
      //   sqliteChild.send({msg: 'COMMIT'})
      // }
    })
  }
})

ipcMain.on(Constant.RESTORE_BACKUP_DATA, (event, payload) => {
  var params = JSON.parse(payload)

  if (params !== null && typeof(params) !== 'undefined') {
    // sqliteChild.send({msg: 'BEGIN'})

    params.restoreList.forEach(function (item, index) {
      var insertBackupArgs = []
      insertBackupArgs.push(item.CASSET_ID)
      insertBackupArgs.push(item.SLOT_ID)
      insertBackupArgs.push(item.ORDER_ID)
      insertBackupArgs.push('N')
      insertBackupArgs.push('')
      insertBackupArgs.push(getDateTime())
      insertBackupArgs.push(getDateTime())
      insertBackupArgs.push(params.userId)
      insertBackupArgs.push(getDateTime())
      insertBackupArgs.push(params.userId)

      sqliteChild.send({msg: 'INSERT', sql: query.INSERT_BACKUP_HIST, args: insertBackupArgs})

      var insertHistArgs = []
      insertHistArgs.push(item.CASSET_ID)
      insertHistArgs.push(item.SLOT_ID)
      insertHistArgs.push(item.CASSET_NO)
      insertHistArgs.push(item.SLOT_NO)
      insertHistArgs.push(item.BARCODE_NO)
      insertHistArgs.push(item.PATIENT_ID)
      insertHistArgs.push(item.PATIENT_NM)
      insertHistArgs.push(item.ORDER_DTTM)
      insertHistArgs.push(item.STATE_CD)
      insertHistArgs.push(item.MALARIA_COUNT)
      insertHistArgs.push(item.ANALYZE_DTTM)
      insertHistArgs.push(item.BIRTHDAY)
      insertHistArgs.push(item.AGE)
      insertHistArgs.push(item.GENDER)
      insertHistArgs.push(item.TEST_TYPE)
      insertHistArgs.push(item.BM_NO)
      insertHistArgs.push(item.ORDER_ID)
      insertHistArgs.push(item.SIGNED_STATE)
      insertHistArgs.push(item.SIGNED_DTTM)
      insertHistArgs.push(item.SIGNED_USER_ID)
      insertHistArgs.push(item.WBC_COMMENT)
      insertHistArgs.push(item.RBC_COMMENT)
      insertHistArgs.push(item.BM_COMMENT)
      insertHistArgs.push(item.MAX_WBC_COUNT)
      insertHistArgs.push(item.MAX_RBC_COUNT)
      insertHistArgs.push(item.SERIAL_NO)
      insertHistArgs.push(item.DEPARTMENT)
      insertHistArgs.push(item.BM_SAMPLING_SITE)
      insertHistArgs.push(item.STAIN_TYPE)
      insertHistArgs.push(item.ANALYSIS_TYPE)
      insertHistArgs.push(item.STITCH_COUNT)
      insertHistArgs.push(item.IS_NS_NB_INTEGRATION)
      insertHistArgs.push(item.PLT_COUNT)
      insertHistArgs.push(item.CELLULARITY)
      insertHistArgs.push(item.ME_RATIO)
      insertHistArgs.push(item.IS_NORMAL)
      insertHistArgs.push(item.CREATE_DTTM)
      insertHistArgs.push(item.CREATE_ID)
      insertHistArgs.push(item.MODIFY_DTTM)
      insertHistArgs.push(item.MODIFY_ID)

      sqliteChild.send({msg: 'INSERT', sql: query.INSERT_TEST_HISTORY, args: insertHistArgs})

      // if (index + 1 === params.restoreList.length) {
      //   sqliteChild.send({msg: 'COMMIT'})
      // }
    })
  }
})

ipcMain.on(Constant.SELECT_RBC_DEGREE, (event, payload) => {
  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.SELECT_RBC_DEGREE, sql: query.SELECT_RBC_DEGREE})
})

ipcMain.on(Constant.UPDATE_RBC_DEGREE, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.degree1)
  args.push(params.degree2)
  args.push(params.degree3)
  args.push(params.categoryId)
  args.push(params.classId)

  sqliteChild.send({msg: 'UPDATE', succMsg: Constant.UPDATE_RBC_DEGREE, sql: query.UPDATE_RBC_DEGREE, args: args})
})

ipcMain.on(Constant.SELECT_WBC_HOT_KEY, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.keyType)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.SELECT_WBC_HOT_KEY, sql: query.SELECT_WBC_HOT_KEY, args: args})
})

ipcMain.on(Constant.SELECT_BM_HOT_KEY, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.keyType)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.SELECT_BM_HOT_KEY, sql: query.SELECT_WBC_HOT_KEY, args: args})
})

// normal range [
ipcMain.on(Constant.GET_NORMAL_RANGE, (event, payload) => {
  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.GET_NORMAL_RANGE, sql: query.SELECT_NORMAL_RANGE})
})

ipcMain.on(Constant.RESET_NORMAL_RANGE, (event, payload) => {
  var params = JSON.parse(payload)

  log.info(params)

  params.forEach(function(item) {
    var args = []

    args.push(item.min)
    args.push(item.max)
    args.push(item.unit)
    args.push(item.analysisType)
    args.push(item.classId)

    sqliteChild.send({msg: 'UPDATE', succMsg: Constant.UPDATE_NORMAL_RANGE, sql: query.UPDATE_NORMAL_RANGE, args: args})
  })
})

ipcMain.on(Constant.UPDATE_NORMAL_RANGE, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.min)
  args.push(params.max)
  args.push(params.unit)
  args.push(params.analysisType)
  args.push(params.classId)

  sqliteChild.send({msg: 'UPDATE', succMsg: Constant.UPDATE_NORMAL_RANGE, sql: query.UPDATE_NORMAL_RANGE, args: args})
})
// normal range ]

ipcMain.on(Constant.GET_WBC_HIST_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []
  args.push(params.slotId)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.GET_WBC_HIST_LIST, sql: query.SELECT_WBC_CLASSIFICATION_HIST, args: args})
})

ipcMain.on(Constant.UPDATE_HOT_KEYS, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.key)
  args.push(params.keyType)
  args.push(params.id)

  sqliteChild.send({msg: 'UPDATE', succMsg: Constant.UPDATE_HOT_KEYS, sql: query.UPDATE_HOT_KEYS, args: args})
})

ipcMain.on(Constant.UPDATE_BM_HOT_KEYS, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.key)
  args.push(params.keyType)
  args.push(params.id)

  sqliteChild.send({msg: 'UPDATE', succMsg: Constant.UPDATE_BM_HOT_KEYS, sql: query.UPDATE_HOT_KEYS, args: args})
})

ipcMain.on(Constant.GET_BACKUP_LIST, (event, payload) => {
  var params = JSON.parse(payload)
  var args = []

  args.push(params.backupStartDate)
  args.push(params.backupEndDate)

  sqliteChild.send({msg: 'SELECT_ALL', succMsg: Constant.GET_BACKUP_LIST, sql: query.SELECT_BACKUP_LIST, args: args})
})

ipcMain.on('INIT_DATABASE', (event, payload) => {
  var dbPath = payload.dbPath.substring(0, payload.dbPath.lastIndexOf('/')) + '/UIMD_Data/UI_DB/bm.db'
  log.info(dbPath)
  sqliteChild.send({msg: 'INIT', path: dbPath})
})

// [IPC RECEIVER END]

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
const { autoUpdater } = require('electron-updater')
const ProgressBar = require('electron-progressbar')
let progressBar = null

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

autoUpdater.on('checking-for-update', () => {
  log.info('checking-for-update')
})

autoUpdater.on('update-available', (info) => {
  log.info('update-available')
})

autoUpdater.on('update-not-available', () => {
  progressBar.setCompleted()
  log.info('update-not-available')
})

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = 'Download speed : ' + progressObj.bytesPerSecond
  logMessage = logMessage + ' - Downloaded ' + progressObj.percent.toFixed(2) + '%'
  logMessage = logMessage + ' (' + progressObj.transferred + ' /' + progressObj.total + ')'
  log.info(logMessage)

  progressBar.detail = logMessage
})

autoUpdater.on('update-downloaded', (info) => {
  progressBar.setCompleted()

  const option = {
     type: 'question',
     buttons: ['Update', 'Exit'],
     defaultId: 0,
     title: 'IA-UPDATER',
     message: 'A new version has been downloaded. Please restart the application to apply the update.'
  }

  dialog.showMessageBox(option, (response) => {
    fs.copyFile(Configs.DB_FILE_NAME, Configs.DB_BACKUP_PATH, function(err) {
      log.info('copy : ' + err)
    })

    if (response === 0) {
      autoUpdater.quitAndInstall()
    } else {
      sqliteChild.send({msg: 'SHUTDOWN'})
    }
  })
})

autoUpdater.on('error', (err) => {
  log.error('update-error')
  log.error(err)
})
