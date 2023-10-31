// electron version load for sqlite3(node-pre-gyp)
process.versions.electron = process.env.ELECTRON_VERSION

const sqlite3 = require('sqlite3').verbose()
const log = require('electron-log')
let db = null
let dbRootPath = null

log.info(process.versions.electron)
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

function connect () {
  if ((!db || !db.open) && dbRootPath !== null) {
    // 'Y:/UIMD_Data/UI_DB/bm.db'
    db = new sqlite3.Database(dbRootPath, (err) => {
      if (err) {
        log.info(err.message)
      } else {
        log.info('Connected to the mydb database.')
        db.run(`CREATE TABLE IF NOT EXISTS TB_TEST_HISTORY (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , CASSET_NO         TEXT
              , SLOT_NO           TEXT
              , BARCODE_NO        TEXT
              , PATIENT_ID        TEXT
              , PATIENT_NM        TEXT
              , ORDER_DTTM        TEXT
              , STATE_CD          TEXT
              , MALARIA_COUNT     TEXT
              , ANALYZE_DTTM      TEXT
              , BIRTHDAY          TEXT
              , AGE               TEXT
              , GENDER            TEXT
              , TEST_TYPE         TEXT
              , BM_NO             TEXT
              , ORDER_ID          TEXT
              , SIGNED_STATE      TEXT
              , SIGNED_DTTM       TEXT
              , SIGNED_USER_ID    TEXT
              , WBC_COMMENT       TEXT
              , RBC_COMMENT       TEXT
              , BM_COMMENT        TEXT
              , MAX_WBC_COUNT     TEXT
              , MAX_RBC_COUNT     TEXT
              , SERIAL_NO         TEXT
              , DEPARTMENT        TEXT
              , BM_SAMPLING_SITE  TEXT
              , STAIN_TYPE        TEXT
              , ANALYSIS_TYPE     TEXT
              , STITCH_COUNT      TEXT
              , IS_NS_NB_INTEGRATION    TEXT
              , PLT_COUNT         TEXT
              , CELLULARITY       TEXT
              , ME_RATIO          TEXT
              , IS_NORMAL         TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, ORDER_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_TEST_HISTORY ON TB_TEST_HISTORY (
              SLOT_ID
              , ORDER_ID
              , CASSET_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_USER_INPUT_STAIN_TYPE (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , ORDER_ID          TEXT
              , USER_STAIN_TYPE   TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, ORDER_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_USER_INPUT_STAIN_TYPE ON TB_USER_INPUT_STAIN_TYPE (
              SLOT_ID
              , ORDER_ID
              , CASSET_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_WBC_CLASSIFICATION (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , ORDER_ID          TEXT
              , CLASS_ID          TEXT
              , CLASS_NM          TEXT
              , CLASS_TITLE       TEXT
              , COUNT             TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, ORDER_ID, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_WBC_CLASSIFICATION ON TB_WBC_CLASSIFICATION (
              SLOT_ID
              , ORDER_ID
              , CASSET_ID
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_WBC_CLASSIFICATION_HIST (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , ORDER_ID          TEXT
              , CLASS_ID          TEXT
              , CLASS_NM          TEXT
              , CLASS_TITLE       TEXT
              , COUNT             TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, ORDER_ID, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_WBC_CLASSIFICATION_HIST ON TB_WBC_CLASSIFICATION_HIST (
              SLOT_ID
              , ORDER_ID
              , CASSET_ID
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_BM_CELL_CLASSIFICATION (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , ORDER_ID          TEXT
              , CLASS_ID          TEXT
              , CLASS_NM          TEXT
              , CLASS_TITLE       TEXT
              , COUNT             TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, ORDER_ID, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_BM_CELL_CLASSIFICATION ON TB_BM_CELL_CLASSIFICATION (
              SLOT_ID
              , ORDER_ID
              , CASSET_ID
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_BM_CELL_CLASSIFICATION_HIST (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , ORDER_ID          TEXT
              , CLASS_ID          TEXT
              , CLASS_NM          TEXT
              , CLASS_TITLE       TEXT
              , COUNT             TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, ORDER_ID, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_BM_CELL_CLASSIFICATION_HIST ON TB_BM_CELL_CLASSIFICATION_HIST (
              SLOT_ID
              , ORDER_ID
              , CASSET_ID
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_RBC_CATEGORY (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , ORDER_ID          TEXT
              , CATEGORY_ID       TEXT
              , CATEGORY_NM       TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, ORDER_ID, CATEGORY_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_RBC_CATEGORY ON TB_RBC_CATEGORY (
              SLOT_ID
              , ORDER_ID
              , CATEGORY_ID
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_RBC_CLASSIFICATION (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , ORDER_ID          TEXT
              , CATEGORY_ID       TEXT
              , CLASS_ID          TEXT
              , CLASS_NM          TEXT
              , DEGREE            TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, ORDER_ID, CATEGORY_ID, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_RBC_CLASSIFICATION ON TB_RBC_CLASSIFICATION (
              SLOT_ID
              , ORDER_ID
              , CATEGORY_ID
              , CLASS_ID
              , CASSET_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_WBC_CELL_POSITION (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , FILE_ID           TEXT
              , FILE_NM           TEXT
              , POSX1             TEXT
              , POSY1             TEXT
              , POSX2             TEXT
              , POSY2             TEXT
              , ORG_WIDTH         TEXT
              , ORG_HEIGHT        TEXT
              , ANALYSIS_TYPE     TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, FILE_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_WBC_CELL_POSITION ON TB_WBC_CELL_POSITION (
              SLOT_ID
              , FILE_ID
              , CASSET_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_USER (
              USER_ID             TEXT
              , USER_NM           TEXT
              , EMP_NO            TEXT
              , POSITION          TEXT
              , AUTH_CD           TEXT
              , ENC_PWD           TEXT
              , IS_AVAILABLE      TEXT
              , LOGIN_DTTM        TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(USER_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_USER ON TB_USER (
              USER_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_WBC_CUSTOM_CLASS (
                CLASS_ID          TEXT
              , CLASS_TITLE       TEXT
              , CLASS_NM          TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_WBC_CUSTOM_CLASS ON TB_WBC_CUSTOM_CLASS (
              CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_WBC_IMAGE_HIST (
              CASSET_ID           TEXT
              , SLOT_ID           TEXT
              , ORDER_ID          TEXT
              , CLASS_ID          TEXT
              , FILE_NM           TEXT
              , CURRENT_CLASS_ID  TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CASSET_ID, SLOT_ID, ORDER_ID, CLASS_ID, FILE_NM)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_WBC_IMAGE_HIST ON TB_WBC_IMAGE_HIST (
              SLOT_ID
              , ORDER_ID
              , FILE_NM
              , CASSET_ID
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_RBC_DEGREE_VAL (
              CATEGORY_ID         TEXT
              , CLASS_ID          TEXT
              , DEGREE_1          REAL
              , DEGREE_2          REAL
              , DEGREE_3          REAL
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(CATEGORY_ID, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_RBC_DEGREE_VAL ON TB_RBC_DEGREE_VAL (
              CATEGORY_ID
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_HOT_KEY (
              HOT_KEY_TYPE        TEXT
              , CLASS_ID          TEXT
              , CLASS_TITLE       TEXT
              , CLASS_NM          TEXT
              , HOT_KEY           TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(HOT_KEY_TYPE, CLASS_ID)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_HOT_KEY ON TB_HOT_KEY (
              HOT_KEY_TYPE
              , CLASS_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_COMMON_CODE_GRP (
              GRP_CD              TEXT
              , GRP_NM            TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(GRP_CD)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_COMMON_CODE_GRP ON TB_COMMON_CODE_GRP (
              GRP_CD
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_COMMON_CODE (
              GRP_CD              TEXT
              , CD                TEXT
              , CD_NM             TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(GRP_CD, CD)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_COMMON_CODE ON TB_COMMON_CODE (
              GRP_CD
              , CD
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_LIS_CONN_PATH (
              DEVICE_BARCODE      TEXT
              , LIS_FILE_PATH     TEXT
              , LIS_URL           TEXT
              , LIS_CONN_TYPE_CD  TEXT
              , CBC_FILE_PATH     TEXT
              , CBC_URL           TEXT
              , CBC_CONN_TYPE_CD  TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(DEVICE_BARCODE)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_LIS_CONN_PATH ON TB_LIS_CONN_PATH (
              DEVICE_BARCODE
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_LIS_TEST_CODE (
              IA_CD               TEXT
              , LIS_CD            TEXT
              , CD_NM             TEXT
              , TEST_TYPE         TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(IA_CD, TEST_TYPE)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_LIS_TEST_CODE ON TB_LIS_TEST_CODE (
              IA_CD
              , TEST_TYPE
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_CBC_TEST_CODE (
              IA_CD               TEXT
              , CBC_CD            TEXT
              , CD_NM             TEXT
              , IS_SELECTED       TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(IA_CD)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_CBC_TEST_CODE ON TB_CBC_TEST_CODE (
              IA_CD
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_BACKUP_HIST (
              BACKUP_SEQ_ID       INTEGER
              , CASSET_ID         TEXT
              , SLOT_ID           TEXT
              , ORDER_ID          TEXT
              , IS_BACKUP         TEXT
              , BACKUP_DTTM       TEXT
              , RESTORE_DTTM      TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(BACKUP_SEQ_ID AUTOINCREMENT)
            )`, [], arg => {
        })
        db.run(`CREATE INDEX IDX_BACKUP_HIST ON TB_BACKUP_HIST (
              BACKUP_SEQ_ID
            )`, [], arg => {
        })
        db.run(`CREATE TABLE IF NOT EXISTS TB_NORMAL_RANGE (
              ANALYSIS_TYPE       TEXT
              , CLASS_ID          TEXT
              , CLASS_TITLE       TEXT
              , CLASS_NM          TEXT
              , MIN               TEXT
              , MAX               TEXT
              , UNIT              TEXT
              , CREATE_DTTM       TEXT
              , CREATE_ID         TEXT
              , MODIFY_DTTM       TEXT
              , MODIFY_ID         TEXT
              , PRIMARY KEY(ANALYSIS_TYPE, CLASS_ID)
            )`, [], arg => {
        })
      }
    })
  }

  // db.configure('busyTimeout', 3000)

  return db
}

process.on('message', (message) => {
  try {
    switch (message.msg) {
      case 'INIT': {
        try {
          dbRootPath = message.path
          log.info('dbRootPath : ' + dbRootPath)

          let db = connect()
          if (!db || !db.open) {
            process.send({msg: 'INIT_SUCCESS'})
          } else {
            process.send({msg: 'INIT FAILED'})
          }
        } catch (err) {
          log.info(err.message)
          process.send({msg: 'INIT FAILED : ' + err.message})
        }
        break
      }
      case 'INSERT': {
        try {
          let db = connect()

          log.info(message.sql)
          log.info(message.args)
          db.run(message.sql, message.args, (err, arg) => {
            if (err) {
              process.send({msg: 'INSERT FAILED : ' + err.message})
              // db.run('ROLLBACK')
            } else {
              process.send({msg: 'INSERT_SUCCESS'})
            }
          })
        } catch (err) {
          process.send({msg: 'INSERT FAILED : ' + err.message})
        }
        break
      }
      case 'SELECT': {
        try {
          let db = connect()
          if(message.args == undefined || message.args == null) {
            message.args = []
          }

          log.info(message.sql)
          log.info(message.args)

          db.get(message.sql, message.args, (err, arg) => {
            if (err) {
              process.send({msg: 'SELECT FAILED : ' + err.message})
            } else {
              process.send({msg: 'SELECT_SUCCESS', succMsg: message.succMsg, rows: arg})
            }
          })
        } catch (err) {
          process.send({msg: 'SELECT FAILED : ' + err.message})
        }
        break
      }
      case 'SELECT_ALL': {
        try {
          let db = connect()
          if(message.args == undefined || message.args == null) {
            message.args = []
          }

          log.info(message.sql)
          log.info(message.args)
          db.all(message.sql, message.args, (err, arg) => {
            if (err) {
              process.send({msg: 'SELECT_ALL FAILED : ' + err.message})
            } else {
              process.send({msg: 'SELECT_ALL_SUCCESS', succMsg: message.succMsg, rows: arg})
            }
          })
        } catch (err) {
          process.send({msg: 'SELECT_ALL FAILED : ' + err.message})
        }
        break
      }
      case 'DELETE': {
        try {
          let db = connect()

          log.info(message.sql)
          log.info(message.args)
          db.run(message.sql, message.args, (err, arg) => {
            if (err) {
              process.send({msg: 'FAILED : ' + err.message})
            } else {
              process.send({msg: 'DELETE_SUCCESS'})
            }
          })
        } catch (err) {
          process.send({msg: 'DELETE FAILED : ' + err.message})
        }
        break
      }
      case 'UPDATE': {
        try {
          let db = connect()

          log.info(message.sql)
          log.info(message.args)
          log.info(message.isCommit)

          db.run(message.sql, message.args, (err, arg) => {
            if (err) {
              process.send({msg: 'FAILED : ' + err.message})
            } else {
              process.send({msg: 'UPDATE_SUCCESS', succMsg: message.succMsg, rows: arg, isCommit: message.isCommit})
            }
          })
        } catch (err) {
          process.send({msg: 'UPDATE FAILED : ' + err.message})
        }
        break
      }
      case 'ALTER_TABLE': {
        try {
          let db = connect()

          var columnCheckSql = "SELECT (CASE WHEN COUNT(*) > 0 THEN 'Y'\n" +
                                    		 "ELSE 'N'\n" +
                                    		"END) AS IS_ADDED\n" +
                                "FROM sqlite_master\n" +
                               "WHERE name=" + '\'' + message.table + '\'\n' +
                               "AND sql LIKE "  + '\'%' + message.column + '%\''

          log.info(columnCheckSql)
          db.get(columnCheckSql, {}, (err, arg) => {
            log.info(err)
            if (!err) {
              log.info('arg.IS_ADDED : ' + arg.IS_ADDED)

              if (arg.IS_ADDED === 'N') {
                log.info(message.sql)
                log.info(message.args)

                db.run(message.sql, message.args, (err, arg) => {
                  if (err) {
                    process.send({msg: 'ALTER_TABLE FAILED : ' + err.message})
                  } else {
                    process.send({msg: 'ALTER_TABLE_SUCCESS'})
                  }
                })
              }
            }
          })
        } catch (err) {
          process.send({msg: 'ALTER_TABLE FAILED : ' + err.message})
        }
        break
      }
      case 'SHUTDOWN': {
        process.exit(0)
        break
      }
      case 'CLOSE': {
        if (db || db.open) {
          db.close((err) => {
            log.info(err)
          })

          db = null
        }
        break
      }
      case 'BEGIN': {
        db.run('BEGIN TRANSACTION', [], (err, arg) => {
          if (err) {
            log.info(err)
          }
        })
        break
      }
      case 'COMMIT': {
        db.run('END TRANSACTION', [], (err, arg) => {
          if (err) {
            log.info(err)
          }
        })
        break
      }
      case 'ROLLBACK': {
        db.run('ROLLBACK', [], (err, arg) => {
          if (err) {
            log.info(err)
          }
        })
        break
      }
      default:
        throw new Error('Unrecognized message received by sqlite3')
    }
  } catch (e) {
    log.info(e)
  }
})

module.exports = {}
