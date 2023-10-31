import LisApi from './LisApi'
import LisApiCommon from './LisApiCommon'
import FileManager from './FileManager'

export default {
  async getCdcResults_0002 (bcno) {
    return await LisApi.getCdcResults_0002(bcno)
  },
  async checkUserAuth_0002 (empNo) {
    return await LisApi.checkUserAuth_0002(empNo)
  },
  async uploadReport_0002 (params) {
    return await LisApi.uploadReport_0002(params)
  },
  async uploadReport (params) {
    return await LisApiCommon.uploadReport(params)
  },
  async getCdcResults (params) {
    return await LisApiCommon.getCdcResults(params)
  },
  async getWbcFiles (params) {
    return await FileManager.getWbcFiles(params)
  },
  async getRbcFiles (params) {
    return await FileManager.getRbcFiles(params)
  },
  async getWbcClassification (params) {
    return await FileManager.getWbcClassification(params)
  },
  async getBmClassification (params) {
    return await FileManager.getBmClassification(params)
  },
  async moveFile (params) {
    return await FileManager.moveFile(params)
  },
  async getBmFiles (params) {
    return await FileManager.getBmFiles(params)
  }
}
