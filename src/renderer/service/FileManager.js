import axios from 'axios'

const fs = require('fs')
const path = require('path')
const filterExp = /^.png|.jpg|.bmp$/
const filterKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/

async function getWbcFiles(params) {
  var wbcImages = []
  var classificationResult = []
  var imgCount = 0

  return new Promise(function(resolve, reject) {
    console.log('getWbcFiles')

    // 클래스 디렉토리 순회
    params.classList.forEach(function(diffClass, index) {
      var dirName = diffClass.id + '_' + diffClass.title
      var classPath = params.classDir + '/' + dirName

      // 디렉터리 존재 여부 체크
      fs.access(classPath, fs.constants.F_OK, function(err) {
        if (!err) {
          // WBC 결과 폴더 탐색
          fs.readdir(classPath, function(err, files) {
            if (!err) {
              if (files) {
                var wbcFiles = files.filter(function(file) {
                  return filterExp.test(path.extname(file).toLowerCase()) && !filterKor.test(file)
                })

                var wbcFilesArray = []
                wbcFiles.forEach(function(wbcFile) {
                  wbcImages.push('file://' + classPath + '/' + wbcFile)
                  wbcFilesArray.push('file://' + classPath + '/' + wbcFile)
                })

                classificationResult.push({
                  id: diffClass.id,
                  title: diffClass.title,
                  name: diffClass.name,
                  images: wbcFilesArray,
                  dirName: dirName,
                  count: wbcFiles.length,
                  order: diffClass.order
                })

                // standard, primium
                if (params.selectItem.TEST_TYPE_CD === '01' || params.selectItem.TEST_TYPE_CD === '04') {
                  if (dirName !== '12_NR' && dirName !== '13_GP' &&
                    dirName !== '14_PA' && dirName !== '15_AR' &&
                    dirName !== '16_MA') {
                    imgCount += wbcFiles.length
                  }
                } else {
                  if (dirName !== '08_NR' && dirName !== '10_MC' && dirName !== '09_AR') {
                    imgCount += wbcFiles.length
                  }
                }

                if (index + 1 === params.classList.length) {
                  var res = {
                    classificationResult: classificationResult,
                    wbcImages: wbcImages,
                    imgCount: imgCount
                  }

                  resolve(res)
                }
              }
            } else {
              reject(err)
            }
          })
        } else {
          reject(err)
        }
      })
    })
  })
}

async function getRbcFiles(params) {
  var rowImages = []

  console.log('getRbcFiles')

  return new Promise(function(resolve, reject) {
    fs.readdir(params.rbcImagePath, function(err, files) {
      if (!err) {
        if (files) {
          var rbcFiles = files.filter(function(file) {
            return filterExp.test(path.extname(file).toLowerCase()) && !filterKor.test(file)
          })

          rbcFiles.forEach(function(item) {
            rowImages.push('file://' + params.rbcImagePath + '/' + item)
          })

          resolve(rowImages)
        }
      } else {
        reject(err)
      }
    })
  })
}

function getBmFiles(params) {
  var bmImages = []
  var classificationResult = []
  var imgCount = 0

  return new Promise(function(resolve, reject) {
    console.log('getBmFiles')

    // 클래스 디렉토리 순회
    params.classList.forEach(function(diffClass, index) {
      var dirName = diffClass.id + '_' + diffClass.title
      var classPath = params.classDir + '/' + dirName

      // 디렉터리 존재 여부 체크
      fs.access(classPath, fs.constants.F_OK, function(err) {
        if (!err) {
          // BM 결과 폴더 탐색
          fs.readdir(classPath, function(err, files) {
            if (!err) {
              if (files) {
                var bmFiles = files.filter(function(file) {
                  return filterExp.test(path.extname(file).toLowerCase()) && !filterKor.test(file)
                })

                var bmFilesArray = []
                bmFiles.forEach(function(bmFile) {
                  bmImages.push('file://' + classPath + '/' + bmFile)
                  bmFilesArray.push('file://' + classPath + '/' + bmFile)
                })

                classificationResult.push({
                  id: diffClass.id,
                  title: diffClass.title,
                  name: diffClass.name,
                  images: bmFilesArray,
                  dirName: dirName,
                  count: bmFiles.length,
                  order: diffClass.order
                })

                if (diffClass.title !== 'OT' && diffClass.title !== 'MC') {
                  imgCount += bmFiles.length
                }

                if (index + 1 === params.classList.length) {
                  var res = {
                    classificationResult: classificationResult,
                    bmImages: bmImages,
                    imgCount: imgCount
                  }

                  resolve(res)
                }
              }
            } else {
              reject(err)
            }
          })
        } else {
          reject(err)
        }
      })
    })
  })
}

function getWbcClassification (params) {
  console.log('getWbcClassification')

  return new Promise(function(resolve, reject) {
    // 퍼센트
    var percentTotal = 0
    var maxItem = null

    if (params.classificationResult !== '' && typeof(params.classificationResult) !== 'undefined') {
      params.classificationResult.forEach(function (item, index) {
        params.classificationResult[index].percent = ((params.classificationResult[index].count / params.imgCount) * 100).toFixed(0)

        // blast 조정
        if (item.title === 'BL') {
          if (params.classificationResult[index].count > 0) {
            if (params.classificationResult[index].percent >= 0 && params.classificationResult[index].percent <= 1) {
              params.classificationResult[index].percent = 1
            }
          }
        }

        if ((item.title !== 'NR' && item.title !== 'AR' &&
              item.title !== 'GP' && item.title !== 'PA' &&
              item.title !== 'MC' && item.title !== 'MA')) {
          percentTotal += Number(params.classificationResult[index].percent)
          if (maxItem === null) {
            maxItem = params.classificationResult[index]
          } else {
            if (maxItem.count < item.count) {
              maxItem = params.classificationResult[index]
            }
          }
        }
      })

      if (maxItem !== null) {
        // 백분율 오차 보정
        maxItem.percent = Number(maxItem.percent) + (100 - percentTotal)

      }
      resolve(params.classificationResult)
    } else {
      reject(new Error('classificationResult not found'))
    }

  })
}

function getBmClassification (params) {
  console.log('getBmClassification')

  return new Promise(function(resolve, reject) {
    // 퍼센트
    var percentTotal = 0
    var maxItem = null

    if (params.classificationResult !== '' && typeof(params.classificationResult) !== 'undefined') {
      params.classificationResult.forEach(function (item, index) {
        params.classificationResult[index].percent = ((params.classificationResult[index].count / params.imgCount) * 100).toFixed(0)

        // blast 조정
        if (item.title === 'BL') {
          if (params.classificationResult[index].count > 0) {
            if (params.classificationResult[index].percent >= 0 && params.classificationResult[index].percent <= 1) {
              params.classificationResult[index].percent = 1
            }
          }
        }

        if (item.title !== 'OT' && item.title !== 'MC') {
          percentTotal += Number(params.classificationResult[index].percent)
          if (maxItem === null) {
            maxItem = params.classificationResult[index]
          } else {
            if (maxItem.count < item.count) {
              maxItem = params.classificationResult[index]
            }
          }
        }
      })

      if (maxItem !== null) {
        // 백분율 오차 보정
        maxItem.percent = Number(maxItem.percent) + (100 - percentTotal)
      }

      resolve(params.classificationResult)
    } else {
      reject(new Error('classificationResult not found'))
    }

  })
}

function moveFile (params) {
  console.log('moveFile')

  return new Promise(function(resolve, reject) {
    var srcPath = params.srcPath
    var destPath = params.destPath
    var isNsNbIntegration = params.isNsNbIntegration
    var isError = false

    // error check
    if (isNsNbIntegration) {
      if (destPath.includes('71_NS') || destPath.includes('72_NB')) {
        isError = true
        reject(new Error('target not found!'))
      }
    } else {
      if (destPath.includes('01_NE')) {
        isError = true
        reject(new Error('target not found!'))
      }
    }

    if (!isError) {
      fs.rename(srcPath, destPath, function(err) {
        if (!err) {
          var ret = {
            srcPath: srcPath,
            destPath: destPath
          }
          resolve(ret)
        } else {
          reject(err)
        }
      })
    }

  })
}

export default {
  async getWbcFiles (params) {
    return await getWbcFiles(params)
  },
  async getRbcFiles (params) {
    return await getRbcFiles(params)
  },
  async getWbcClassification (params) {
    return await getWbcClassification(params)
  },
  async getBmClassification (params) {
    return await getBmClassification(params)
  },
  async moveFile (params) {
    return await moveFile(params)
  },
  async getBmFiles (params) {
    return await getBmFiles(params)
  }
}
