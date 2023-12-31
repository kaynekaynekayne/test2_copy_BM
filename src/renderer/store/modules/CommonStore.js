// 공통 코드 정의
const state = {
  commonCodeList: [
    { grpCd: '00', grpNm: 'User position', cd: '00', cdNm: 'Position' },
    { grpCd: '00', grpNm: 'User position', cd: '01', cdNm: 'Executive advisor' },
    { grpCd: '00', grpNm: 'User position', cd: '02', cdNm: 'General manager' },
    { grpCd: '00', grpNm: 'User position', cd: '03', cdNm: 'Chief' },
    { grpCd: '00', grpNm: 'User position', cd: '04', cdNm: 'Assistant manager' },
    { grpCd: '00', grpNm: 'User position', cd: '05', cdNm: 'Staff' },
    { grpCd: '01', grpNm: 'User authorization', cd: '01', cdNm: 'Normal' },
    { grpCd: '01', grpNm: 'User authorization', cd: '02', cdNm: 'Admin' },
    { grpCd: '01', grpNm: 'User authorization', cd: '03', cdNm: 'Developer' },
    { grpCd: '02', grpNm: 'Cassete state', cd: '0', cdNm: 'Empty' },
    { grpCd: '02', grpNm: 'Cassete state', cd: '1', cdNm: 'Ready' },
    { grpCd: '02', grpNm: 'Cassete state', cd: '2', cdNm: 'Analyzing' },
    { grpCd: '02', grpNm: 'Cassete state', cd: '3', cdNm: 'Complete' },
    { grpCd: '02', grpNm: 'Cassete state', cd: '4', cdNm: 'Error' },
    { grpCd: '02', grpNm: 'Cassete state', cd: '9', cdNm: 'Scan' },
    { grpCd: '03', grpNm: 'Processing code', cd: '01', cdNm: 'Cassette Loaded.'},
    { grpCd: '03', grpNm: 'Processing code', cd: '02', cdNm: 'PB/BM Sequence Start.'},
    { grpCd: '03', grpNm: 'Processing code', cd: '03', cdNm: 'Cassette Scanning......'},
    { grpCd: '03', grpNm: 'Processing code', cd: '04', cdNm: 'Cassette Scanned.'},
    { grpCd: '03', grpNm: 'Processing code', cd: '05', cdNm: 'Loading Slide #'},
    { grpCd: '03', grpNm: 'Processing code', cd: '06', cdNm: 'Barcode Scanned : '},
    { grpCd: '03', grpNm: 'Processing code', cd: '07', cdNm: 'Low Power Slide Scanning......'},
    { grpCd: '03', grpNm: 'Processing code', cd: '08', cdNm: 'Low Power Slide Scan Complete.'},
    { grpCd: '03', grpNm: 'Processing code', cd: '09', cdNm: 'Dispensing Immersion Oil......'},
    { grpCd: '03', grpNm: 'Processing code', cd: '10', cdNm: 'High Power Slide Scanning......'},
    { grpCd: '03', grpNm: 'Processing code', cd: '11', cdNm: 'RBC Classification Processing......'},
    { grpCd: '03', grpNm: 'Processing code', cd: '11', cdNm: 'WBC Classification Processing......'},
    { grpCd: '03', grpNm: 'Processing code', cd: '12', cdNm: 'Unloading Slide #'},
    { grpCd: '03', grpNm: 'Processing code', cd: '13', cdNm: 'Cassette Complete'},
    { grpCd: '04', grpNm: 'Analysis type', cd: '01', cdNm: 'PB smear'},
    { grpCd: '04', grpNm: 'Analysis type', cd: '02', cdNm: 'BM smear'},
    { grpCd: '04', grpNm: 'Analysis type', cd: '03', cdNm: 'Touch print'},
    { grpCd: '04', grpNm: 'Analysis type', cd: '04', cdNm: 'BM biopsy'},
    { grpCd: '04', grpNm: 'Analysis type', cd: '05', cdNm: 'Clot section'},
    { grpCd: '05', grpNm: 'Cell count', cd: '01', cdNm: '100 count'},
    { grpCd: '05', grpNm: 'Cell count', cd: '02', cdNm: '200 count'},
    { grpCd: '05', grpNm: 'Cell count', cd: '03', cdNm: '300 count'},
    { grpCd: '05', grpNm: 'Cell count', cd: '04', cdNm: '400 count'},
    { grpCd: '05', grpNm: 'Cell count', cd: '05', cdNm: '500 count'},
    { grpCd: '06', grpNm: 'General stain', cd: '01', cdNm: 'Wright stain'},
    { grpCd: '06', grpNm: 'General stain', cd: '02', cdNm: 'Giemsa stain'},
    { grpCd: '06', grpNm: 'General stain', cd: '03', cdNm: 'Wright & Giemsa stain'},
    { grpCd: '07', grpNm: 'Special stain', cd: '04', cdNm: 'Iron stain'},
    { grpCd: '07', grpNm: 'Special stain', cd: '05', cdNm: 'Trichrome stain'},
    { grpCd: '07', grpNm: 'Special stain', cd: '06', cdNm: 'Myeloperoxidase stain'},
    { grpCd: '07', grpNm: 'Special stain', cd: '07', cdNm: 'NSE stain'},
    { grpCd: '07', grpNm: 'Special stain', cd: '08', cdNm: 'NSE stain after NaFinhibition'},
    { grpCd: '07', grpNm: 'Special stain', cd: '09', cdNm: 'Reticulin stain'},
    { grpCd: '07', grpNm: 'Special stain', cd: '10', cdNm: 'PAS stain'},
    { grpCd: '08', grpNm: 'Immuno stain', cd: '11', cdNm: 'CD 3'},
    { grpCd: '08', grpNm: 'Immuno stain', cd: '12', cdNm: 'CD 5'},
    { grpCd: '08', grpNm: 'Immuno stain', cd: '13', cdNm: 'CD 20'},
    { grpCd: '08', grpNm: 'Immuno stain', cd: '14', cdNm: 'CD 79a'},
    { grpCd: '09', grpNm: 'Sampling stain', cd: '01', cdNm: 'Single'},
    { grpCd: '09', grpNm: 'Sampling stain', cd: '02', cdNm: 'Both'},
    { grpCd: '10', grpNm: 'Gender', cd: '01', cdNm: 'Male'},
    { grpCd: '10', grpNm: 'Gender', cd: '02', cdNm: 'Female'},
    { grpCd: '11', grpNm: 'Test Type', cd: '01', cdNm: 'PB'},
    { grpCd: '11', grpNm: 'Test Type', cd: '02', cdNm: 'BM'},
    { grpCd: '11', grpNm: 'Test Type', cd: '03', cdNm: 'BF'},
    { grpCd: '12', grpNm: 'Signed state', cd: '01', cdNm: 'Signed'},
    { grpCd: '12', grpNm: 'Signed state', cd: '02', cdNm: 'Ready'},
    { grpCd: '13', grpNm: 'Log type', cd: '00', cdNm: 'User log'},
    { grpCd: '13', grpNm: 'Log type', cd: '01', cdNm: 'System log'},
    { grpCd: '14', grpNm: 'Slot state', cd: '00', cdNm: 'Empty'},
    { grpCd: '14', grpNm: 'Slot state', cd: '01', cdNm: 'Ready'},
    { grpCd: '14', grpNm: 'Slot state', cd: '02', cdNm: 'Scan'},
    { grpCd: '14', grpNm: 'Slot state', cd: '03', cdNm: 'Analyzing'},
    { grpCd: '14', grpNm: 'Slot state', cd: '04', cdNm: 'Complete'},
    { grpCd: '14', grpNm: 'Slot state', cd: '05', cdNm: 'Error'},
    { grpCd: '15', grpNm: 'Stitch count', cd: '00', cdNm: '0 count'},
    { grpCd: '15', grpNm: 'Stitch count', cd: '01', cdNm: '1 count'},
    { grpCd: '15', grpNm: 'Stitch count', cd: '02', cdNm: '2 count'},
    { grpCd: '15', grpNm: 'Stitch count', cd: '03', cdNm: '3 count'},
    { grpCd: '15', grpNm: 'Stitch count', cd: '04', cdNm: '4 count'}
  ],
  cbcList: [
    {cd: '01', testCd: '', testNm: 'WBC Diff. Count', isSelected: true},
    {cd: '02', testCd: '', testNm: 'Seg.-neutrophils', isSelected: true},
    {cd: '03', testCd: '', testNm: 'Band-neutrophils', isSelected: true},
    {cd: '04', testCd: '', testNm: 'Lymphocytes', isSelected: true},
    {cd: '05', testCd: '', testNm: 'Monocytes', isSelected: true},
    {cd: '06', testCd: '', testNm: 'Eosinophils', isSelected: true},
    {cd: '07', testCd: '', testNm: 'Basophils', isSelected: true},
    {cd: '08', testCd: '', testNm: 'Metamyelocytes', isSelected: true},
    {cd: '09', testCd: '', testNm: 'Myelocytes', isSelected: true},
    {cd: '10', testCd: '', testNm: 'Promyelocytes', isSelected: true},
    {cd: '11', testCd: '', testNm: 'Blasts', isSelected: true},
    {cd: '12', testCd: '', testNm: 'Immature cells', isSelected: true},
    {cd: '13', testCd: '', testNm: 'Atypical cells', isSelected: true},
    {cd: '14', testCd: '', testNm: 'Atypical lymphocyte', isSelected: true},
    {cd: '15', testCd: '', testNm: 'Activated lymphocyte', isSelected: true},
    {cd: '16', testCd: '', testNm: 'Prolymphocytes', isSelected: true},
    {cd: '17', testCd: '', testNm: 'Promonocytes', isSelected: true},
    {cd: '18', testCd: '', testNm: 'Plasma cells', isSelected: true},
    {cd: '19', testCd: '', testNm: 'Nucleated RBC', isSelected: true},
    {cd: '20', testCd: '', testNm: 'Others', isSelected: true},
    {cd: '21', testCd: '', testNm: 'Atypical Lymphoid cells', isSelected: true},
    {cd: '22', testCd: '', testNm: 'Leukemic cells', isSelected: true},
    {cd: '23', testCd: '', testNm: 'Abnormal lymphocyte', isSelected: true},
    {cd: '24', testCd: '', testNm: 'Reactive lymphocyte', isSelected: true},
    {cd: '25', testCd: '', testNm: 'Plasmacytoid lymphocyte', isSelected: true},
    {cd: '26', testCd: '', testNm: 'ANC calc', isSelected: true},
    {cd: '27', testCd: '', testNm: 'WBC', isSelected: true},
    {cd: '28', testCd: '', testNm: 'RBC', isSelected: true},
    {cd: '29', testCd: '', testNm: 'HGB', isSelected: true},
    {cd: '30', testCd: '', testNm: 'HCT', isSelected: true},
    {cd: '31', testCd: '', testNm: 'MCV', isSelected: true},
    {cd: '32', testCd: '', testNm: 'MCH', isSelected: true},
    {cd: '33', testCd: '', testNm: 'MCHC', isSelected: true},
    {cd: '34', testCd: '', testNm: 'RDW_SD', isSelected: true},
    {cd: '35', testCd: '', testNm: 'RDW_CV', isSelected: true},
    {cd: '36', testCd: '', testNm: 'Platelet', isSelected: true},
    {cd: '37', testCd: '', testNm: 'PCT', isSelected: true},
    {cd: '38', testCd: '', testNm: 'MPV', isSelected: true},
    {cd: '39', testCd: '', testNm: 'PDW', isSelected: true},
    {cd: '40', testCd: '', testNm: 'ESR', isSelected: true},
    {cd: '41', testCd: '', testNm: 'AEC calc', isSelected: true},
    {cd: '42', testCd: '', testNm: 'MN', isSelected: true},
    {cd: '43', testCd: '', testNm: 'PMN', isSelected: true},
    {cd: '44', testCd: '', testNm: 'TC_BF', isSelected: true},
    {cd: '45', testCd: '', testNm: 'WBC_BF', isSelected: true},
    {cd: '46', testCd: '', testNm: 'RBC_BF', isSelected: true},
    {cd: '47', testCd: '', testNm: 'IPF', isSelected: true},
    {cd: '48', testCd: '', testNm: 'HPC', isSelected: true},
    {cd: '49', testCd: '', testNm: 'RET_HE', isSelected: true},
    {cd: '50', testCd: '', testNm: 'P_LCR', isSelected: true},
    {cd: '51', testCd: '', testNm: 'IG', isSelected: true},
    {cd: '52', testCd: '', testNm: 'NEUT', isSelected: true},
    {cd: '53', testCd: '', testNm: 'RET', isSelected: true},
    {cd: '54', testCd: '', testNm: 'IRF', isSelected: true},
    {cd: '55', testCd: '', testNm: 'LFR', isSelected: true},
    {cd: '56', testCd: '', testNm: 'MFR', isSelected: true}
  ],
  wbcNormalRange: null,
  bmNormalRange: null,
  defaultRbcDegree: [{
    categoryId: '01',
    classId: '02',
    degree1: 11,
    degree2: 20,
    degree3: 30
  }, {
    categoryId: '01',
    classId: '03',
    degree1: 11,
    degree2: 20,
    degree3: 30
  }, {
    categoryId: '01',
    classId: '04',
    degree1: 11,
    degree2: 20,
    degree3: 30
  }, {
    categoryId: '02',
    classId: '02',
    degree1: 11,
    degree2: 20,
    degree3: 30
  }, {
    categoryId: '02',
    classId: '03',
    degree1: 11,
    degree2: 20,
    degree3: 30
  }, {
    categoryId: '02',
    classId: '04',
    degree1: 0.5,
    degree2: 5,
    degree3: 20
  }, {
    categoryId: '03',
    classId: '03',
    degree1: 0.5,
    degree2: 10,
    degree3: 25
  }, {
    categoryId: '03',
    classId: '04',
    degree1: 1,
    degree2: 10,
    degree3: 25
  }, {
    categoryId: '03',
    classId: '05',
    degree1: 1,
    degree2: 10,
    degree3: 25
  }, {
    categoryId: '03',
    classId: '06',
    degree1: 0.5,
    degree2: 5,
    degree3: 20
  }, {
    categoryId: '03',
    classId: '07',
    degree1: 1,
    degree2: 3,
    degree3: 6
  }, {
    categoryId: '03',
    classId: '08',
    degree1: 1,
    degree2: 3,
    degree3: 6
  }, {
    categoryId: '03',
    classId: '09',
    degree1: 1,
    degree2: 3,
    degree3: 6
  }, {
    categoryId: '03',
    classId: '10',
    degree1: 1,
    degree2: 3,
    degree3: 6
  }, {
    categoryId: '03',
    classId: '11',
    degree1: 1,
    degree2: 3,
    degree3: 6
  }, {
    categoryId: '05',
    classId: '01',
    degree1: 1,
    degree2: 3,
    degree3: 6
  }, {
    categoryId: '05',
    classId: '02',
    degree1: 0.5,
    degree2: 5,
    degree3: 20
  }],
  normalRange: [{
    classId: '01',
    min: 42,
    max: 85,
    unit: '%'
  }, {
    classId: '02',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '03',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '04',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '05',
    min: 11,
    max: 49,
    unit: '%'
  }, {
    classId: '61',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '62',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '07',
    min: 0,
    max: 9,
    unit: '%'
  }, {
    classId: '08',
    min: 0,
    max: 6,
    unit: '%'
  }, {
    classId: '09',
    min: 0,
    max: 2,
    unit: '%'
  }, {
    classId: '10',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '11',
    min: 0,
    max: 100,
    unit: '%'
  }, {
    classId: '12',
    min: 0,
    max: 100,
    unit: 'Count'
  }, {
    classId: '13',
    min: 0,
    max: 100,
    unit: 'Count'
  }, {
    classId: '14',
    min: 0,
    max: 100,
    unit: 'Count'
  }, {
    classId: '15',
    min: 0,
    max: 100,
    unit: 'Count'
  }, {
    classId: '16',
    min: 0,
    max: 100,
    unit: 'Count'
  }],
  settings: {
    // id, pass 저장
    isRememberMe: false,
    isAutoLogin: false,
    saveId: '',
    savePassword: '',
    maxOilCount: 1000,
    currentOilCount: 0,
    // runningPath: 'C:/img/running',
    // resultPathWbc: 'D:/img/result/WBC',
    // resultPathRbc: 'D:/img/result/RBC',
    // barcodePath: 'D:/img/barcode',
    pbiaRootPath: 'D:/IA_Proc',
    pbAnalysisType: '100',
    bfAnalysisType: '100',
    stitchCount: '1',
    positionMargin: '1',
    barcodeDirNm: '00_Barcode_Image',
    stitchingDirNm: '01_Stitching_Image',
    particleDirNm: '02_Particle_Image',
    cellIdealDirNm: '03_Cell_Ideal_Image',
    cellIdealStitchDirNm: '04_Cell_Ideal_Stitch',
    megaImageDirNm: '05_Mega_Image',
    bmClassificationDirNm: '04_BM_Classification',
    wbcClassificationDirNm: '01_WBC_Classification',
    rbcDirNm: '02_RBC_Image',
    rbcClassificationDirNm: '03_RBC_Classification',
    rbcImageDirName: '02_RBC_Image',
    malariaDirNm: '43_InclusionBody_Malaria',
    noMalariaDirNm: '44_InclusionBody_NoMalaria',
    howellJollyDirNm: '19_Howell_jolly',
    runningMode: '00',
    isMarker: false,
    sizeSildeValue: 50,
    brightnessSlideValue: 100,
    rbcBrightnessSlideValue: 100,
    rbcRedValue: 0,
    rbcGreenValue: 0,
    rbcBlueValue: 0,
    isShowModalBarcode: false,
    isNsNbIntegration: false,
    isCbcShow: false,
    modelWbcReportPrint: [],
    modelBmReportPrint: [],
    wbcRgbValues: [],
    rbcShape: [],
    rbcPlatelet: [],
    rbcInclusion: [],
    kumcCbcPath: 'C:/Users/user/Desktop/IA_MSG/CBC'
  },
  // system info id
  systemTimeId: null,
  siteCd: '',
  deviceBarcode: ''
}

const mutations = {
  UPDATE_REMEMBER_STATE (state, obj) {
    state.settings.isRememberMe = obj.isRememberMe
    state.settings.isAutoLogin = obj.isAutoLogin
    state.settings.saveId = obj.saveId
    state.settings.savePassword = obj.savePassword
  },
  UPDATE_ROOT_PATH (state, path) {
    state.settings.pbiaRootPath = path
  },
  UPDATE_OIL_COUNT (state, cnt) {
    state.settings.currentOilCount = cnt
  },
  INIT_OIL_COUNT (state) {
    state.settings.currentOilCount = state.settings.maxOilCount
  },
  SET_SYSTEM_TIME_ID (state, id) {
    state.systemTimeId = id
  },
  UPDATE_ANALYSIS_TYPE (state, obj) {
    state.settings.pbAnalysisType = obj.pbAnalysisType
    state.settings.stitchCount = obj.stitchCount
    state.settings.positionMargin = obj.positionMargin
    // state.settings.bfAnalysisType = obj.bfAnalysisType
  },
  UPDATE_RUNNING_MODE (state, obj) {
    state.settings.runningMode = obj.runningMode
  },
  UPDATE_MARKER_STATE (state, isShow) {
    state.settings.isMarker = isShow
  },
  SET_SIZE_SLIDE_VALUE (state, value) {
    console.log(value)
    state.settings.sizeSildeValue = value
  },
  SET_BRIGHTNESS_SLIDE_VALUE (state, value) {
    state.settings.brightnessSlideValue = value
  },
  SET_IS_SHOW_MODAL_BARCODE (state, isShowModalBarcode) {
    state.settings.isShowModalBarcode = isShowModalBarcode
  },
  SET_IS_NS_NB_INTEGRATION (state, isNsNbIntegration) {
    state.settings.isNsNbIntegration = isNsNbIntegration
  },
  SET_IS_CBC_SHOW (state, isCbcShow) {
    state.settings.isCbcShow = isCbcShow
  },
  SET_SITE_CD (state, siteCd) {
    state.siteCd = siteCd
  },
  SET_WBC_REPORT_PRINT (state, array) {
    state.settings.modelWbcReportPrint = array
  },
  SET_BM_REPORT_PRINT (state, array) {
    state.settings.modelBmReportPrint = array
  },
  SET_RGB_VALUE (state, obj) {
    var isFind = state.settings.wbcRgbValues.find(function(item) {
      return item.id === obj.id
    })

    if (typeof(isFind) !== 'undefined') {
      state.settings.wbcRgbValues.forEach(function(item) {
        if (item.id === obj.id) {
          item.redValue = obj.redValue
          item.greenValue = obj.greenValue
          item.blueValue = obj.blueValue
        }
      })
    } else {
      state.settings.wbcRgbValues.push(obj)
    }
  },
  SET_RBC_BRIGHTNESS_SLIDE_VALUE (state, value) {
    console.log(value)
    state.settings.rbcBrightnessSlideValue = value
  },
  SET_RBC_RED_VALUE (state, value) {
    state.settings.rbcRedValue = value
  },
  SET_RBC_GREEN_VALUE (state, value) {
    state.settings.rbcGreenValue = value
  },
  SET_RBC_BLUE_VALUE (state, value) {
    state.settings.rbcBlueValue = value
  },
  SET_RBC_SHAPE (state, array) {
    state.settings.rbcShape = array
  },
  SET_RBC_PLATELET (state, array) {
    state.settings.rbcPlatelet = array
  },
  SET_RBC_INCLUSION (state, array) {
    state.settings.rbcInclusion = array
  },
  SET_DEVICE_BARCODE (state, deviceBarcode) {
    state.deviceBarcode = deviceBarcode
  },
  SET_WBC_NORMAL_RANGE (state, range) {
    state.wbcNormalRange = range
  },
  SET_BM_NORMAL_RANGE (state, range) {
    state.bmNormalRange = range
  }
}

const actions = {
  // ID, PASSWORD 저장 여부 업데이트
  updateRememberState: (context, obj) => {
    context.commit('UPDATE_REMEMBER_STATE', obj)
  },
  updateRootPath: (context, path) => {
    context.commit('UPDATE_ROOT_PATH', path)
  },
  // 오일 카운트 update
  updateOilCount: (context, cnt) => {
    context.commit('UPDATE_OIL_COUNT', cnt)
  },
  // 오일 카운트 초기화
  initOilCount: (context) => {
    context.commit('INIT_OIL_COUNT')
  },
  setSystemTimeId: (context, id) => {
    context.commit('SET_SYSTEM_TIME_ID', id)
  },
  updateAnalysisType: (context, obj) => {
    context.commit('UPDATE_ANALYSIS_TYPE', obj)
  },
  updateRunningMode: (context, obj) => {
    context.commit('UPDATE_RUNNING_MODE', obj)
  },
  updateMarkerState: (context, isShow) => {
    context.commit('UPDATE_MARKER_STATE', isShow)
  },
  setSizeSlideValue: (context, value) => {
    context.commit('SET_SIZE_SLIDE_VALUE', value)
  },
  setBrightnessSlideValue: (context, value) => {
    context.commit('SET_BRIGHTNESS_SLIDE_VALUE', value)
  },
  setIsShowModalBarcode: (context, isShowModalBarcode) => {
    context.commit('SET_IS_SHOW_MODAL_BARCODE', isShowModalBarcode)
  },
  setIsNsNbIntegration: (context, isNsNbIntegration) => {
    console.log(isNsNbIntegration)
    context.commit('SET_IS_NS_NB_INTEGRATION', isNsNbIntegration)
  },
  setIsCbcShow: (context, isCbcShow) => {
    context.commit('SET_IS_CBC_SHOW', isCbcShow)
  },
  setSiteCd: (context, siteCd) => {
    context.commit('SET_SITE_CD', siteCd)
  },
  setWbcReportPrint: (context, array) => {
    context.commit('SET_WBC_REPORT_PRINT', array)
  },
  setBmReportPrint: (context, array) => {
    context.commit('SET_BM_REPORT_PRINT', array)
  },
  setRgbValue: (context, obj) => {
    context.commit('SET_RGB_VALUE', obj)
  },
  setRbcBrightnessSlideValue: (context, value) => {
    context.commit('SET_RBC_BRIGHTNESS_SLIDE_VALUE', value)
  },
  setRbcRedValue: (context, value) => {
    context.commit('SET_RBC_RED_VALUE', value)
  },
  setRbcGreenValue: (context, value) => {
    context.commit('SET_RBC_GREEN_VALUE', value)
  },
  setRbcBlueValue: (context, value) => {
    context.commit('SET_RBC_BLUE_VALUE', value)
  },
  setRbcShape: (context, array) => {
    context.commit('SET_RBC_SHAPE', array)
  },
  setRbcPlatelet: (context, array) => {
    context.commit('SET_RBC_PLATELET', array)
  },
  setRbcInclusion: (context, array) => {
    context.commit('SET_RBC_INCLUSION', array)
  },
  setDeviceBarcode: (context, deviceBarcode) => {
    context.commit('SET_DEVICE_BARCODE', deviceBarcode)
  },
  setWbcNormalRange: (context, range) => {
    context.commit('SET_WBC_NORMAL_RANGE', range)
  },
  setBmNormalRange: (context, range) => {
    context.commit('SET_BM_NORMAL_RANGE', range)
  }
}

const getters = {
  getCommonCodeList: (state, getters) => (grpCd) => {
    var list = []

    for (var i = 0; i < state.commonCodeList.length; i++) {
      if (state.commonCodeList[i].grpCd === grpCd) {
        list.push(state.commonCodeList[i])
      }
    }

    return list
  },
  getCommonCode: (state, getters) => (grpCd, cd) => {
    var obj = {}

    for (var i = 0; i < state.commonCodeList.length; i++) {
      if (state.commonCodeList[i].grpCd === grpCd && state.commonCodeList[i].cd === cd) {
        obj = state.commonCodeList[i]
      }
    }

    return obj
  },
  getSettings: (state, getters) => {
    return state.settings
  },
  getSystemTimeId: (state) => {
    return state.systemTimeId
  },
  getMarkerState: (state) => {
    return state.settings.isMarker
  },
  getSizeSlideValue: (state) => {
    return state.settings.sizeSildeValue
  },
  getBrightnessSlideValue: (state) => {
    return state.settings.brightnessSlideValue
  },
  getIsShowModalBarcode: (state) => {
    return state.settings.isShowModalBarcode
  },
  getIsNsNbIntegration: (state) => {
    return state.settings.isNsNbIntegration
  },
  getIsCbcShow: (state) => {
    return state.settings.isCbcShow
  },
  getSiteCd: (state) => {
    return state.siteCd
  },
  getWbcReportPrint: (state) => {
    return state.settings.modelWbcReportPrint
  },
  getBmReportPrint: (state) => {
    return state.settings.modelBmReportPrint
  },
  getRgbValue: (state) => {
    if (state.settings.wbcRgbValues.length <= 0) {
      state.settings.wbcRgbValues.push({
        redValue: 0,
        greenValue: 0,
        blueValue: 0,
        id: '',
        title: ''
      })
    }

    return state.settings.wbcRgbValues
  },
  getRbcBrightnessSlideValue: (state) => {
    return state.settings.rbcBrightnessSlideValue
  },
  getRbcRedValue: (state) => {
    return state.settings.rbcRedValue
  },
  getRbcGreenValue: (state) => {
    return state.settings.rbcGreenValue
  },
  getRbcBlueValue: (state) => {
    return state.settings.rbcBlueValue
  },
  getRbcShape: (state) => {
    return state.settings.rbcShape
  },
  getRbcPlatelet: (state) => {
    return state.settings.rbcPlatelet
  },
  getRbcInclusion: (state) => {
    return state.settings.rbcInclusion
  },
  getDeviceBarcode: (state) => {
    return state.deviceBarcode
  },
  getCbcList: (state) => {
    return state.cbcList
  },
  getNormalRange: (state) => {
    return state.normalRange
  },
  getWbcNormalRange: (state) => {
    return state.wbcNormalRange
  },
  getBmNormalRange: (state) => {
    return state.bmNormalRange
  },
  getKumcCbcPath: (state) => {
    return state.settings.kumcCbcPath
  },
  getDefaultRbcDegree: (state) => {
    return state.defaultRbcDegree
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
