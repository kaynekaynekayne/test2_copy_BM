const env = {...process.env,ELECTRON_VERSION:process.versions.electron}

export default Object.freeze({
  HOST_NAME: '127.0.0.1',
  PORT: '11235',
  INTERFACE_PATH: env.LOCALAPPDATA + '\\Programs\\UIMD\\UIMD_Backend_Install',
  INTERFACE_FILE_NM: 'UIMD_Backend.exe',
  DB_PATH: 'Programs/UIMD_BM_IA/resources/app.asar/src/main/database',
  DB_BACKUP_PATH: 'D:/IA_Proc/tmp.db',
  // DB_FILE_NAME: 'D:/UIMD_Data/UI_DB/bm.db',
  DB_FILE_NAME: 'UIMD_Data/UI_DB/pb.db',
  DB_FILE_PATH: 'UIMD_Data/UI_DB',
  N_CLOUD_BASE_URL: 'https://kr.object.ncloudstorage.com',
  LATEST_OBJECT_NAME: 'latest.yml',
  REGION: 'kr-standard',
  DOWNLOAD_PATH: 'D:/UIMD_Data/download',
  DOWNLOAD_BACKEND_PATH: env.LOCALAPPDATA + '\\Programs\\UIMD\\UIMD_Backend_Install',
  DOWNLOAD_TASK_PATH: 'D:\\UIMD_Data\\download',
  NACCESS_KEY: '4XfPlHYUaIT3H5OrRZrI',
  NSECRET_KEY: 'ldDLztdUBQKSV5u6vjRbd14hwPF6mHYqbEu9x3Mu',


  // 서울 성모 병원
  // BUCKET_NAME: 'bm-082-0001'
  // 여의도 성모 병원
  // BUCKET_NAME: 'bm-082-0002'
  // 이원 의료재단
  // BUCKET_NAME: 'bm-082-0003'
  // 일산 병원
  // BUCKET_NAME: 'bm-082-0004'
  // 스타고
  // BUCKET_NAME: 'bm-033-0001'

  // common
  BUCKET_NAME: 'uimd-bm-comm'
})
