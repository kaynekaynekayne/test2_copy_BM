export default Object.freeze({
  // TEST HISTORY
  INSERT_TEST_HISTORY:
  `INSERT OR REPLACE INTO TB_TEST_HISTORY
   (
     CASSET_ID
     , SLOT_ID
     , CASSET_NO
     , SLOT_NO
     , BARCODE_NO
     , PATIENT_ID
     , PATIENT_NM
     , ORDER_DTTM
     , STATE_CD
     , MALARIA_COUNT
     , ANALYZE_DTTM
     , BIRTHDAY
     , AGE
     , GENDER
     , TEST_TYPE
     , BM_NO
     , ORDER_ID
     , SIGNED_STATE
     , SIGNED_DTTM
     , SIGNED_USER_ID
     , WBC_COMMENT
     , RBC_COMMENT
     , BM_COMMENT
     , MAX_WBC_COUNT
     , MAX_RBC_COUNT
     , SERIAL_NO
     , DEPARTMENT
     , BM_SAMPLING_SITE
     , STAIN_TYPE
     , ANALYSIS_TYPE
     , STITCH_COUNT
     , IS_NS_NB_INTEGRATION
     , PLT_COUNT
     , CELLULARITY
     , ME_RATIO
     , IS_NORMAL
     , IS_CHECKED
     , CREATE_DTTM
     , CREATE_ID
     , MODIFY_DTTM
     , MODIFY_ID
   )
  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

  SEARCH_TEST_HISTORY_LIST:
  `SELECT CASSET_ID
    , SLOT_ID
    , CASSET_NO
    , SLOT_NO
    , BARCODE_NO
    , PATIENT_ID
    , PATIENT_NM
    , ORDER_DTTM
    , (CASE WHEN (STATE_CD = '00') THEN 'Empty'
            WHEN (STATE_CD = '01') THEN 'Ready'
            WHEN (STATE_CD = '02') THEN 'Scan'
            WHEN (STATE_CD = '03') THEN 'Analyzing'
            WHEN (STATE_CD = '04') THEN 'Complete'
        ELSE 'Error'
       END) AS STATE_CD_NM
    , STATE_CD
    , MALARIA_COUNT
    , PLT_COUNT
    , ANALYZE_DTTM
    , BIRTHDAY
    , AGE
    , (CASE WHEN (GENDER = '01') THEN 'Male'
        ELSE 'Female'
       END) AS GENDER_NM
    , GENDER
    , (CASE WHEN (TEST_TYPE = '01') THEN 'PB'
        WHEN (TEST_TYPE = '02') THEN 'BM'
        ELSE 'BF'
       END) AS TEST_TYPE_NM
    , TEST_TYPE
    , TEST_TYPE AS TEST_TYPE_CD
    , BM_NO
    , ORDER_ID
    , SIGNED_STATE
    , SIGNED_DTTM
    , SIGNED_USER_ID
    , WBC_COMMENT
    , RBC_COMMENT
    , BM_COMMENT
    , MAX_WBC_COUNT
    , MAX_RBC_COUNT
    , SERIAL_NO
    , DEPARTMENT
    , (CASE WHEN (BM_SAMPLING_SITE = '01') THEN 'Single'
        ELSE 'Both'
       END) AS BM_SAMPLING_SITE_NM
    , BM_SAMPLING_SITE
    , (CASE WHEN (STAIN_TYPE = '01') THEN 'Wright stain'
      			WHEN (STAIN_TYPE = '02') THEN 'Giemsa stain'
      			WHEN (STAIN_TYPE = '03') THEN 'Wright & Giemsa stain'
      			WHEN (STAIN_TYPE = '04') THEN 'Iron stain'
      			WHEN (STAIN_TYPE = '05') THEN 'Trichrome stain'
      			WHEN (STAIN_TYPE = '06') THEN 'Myeloperoxidase stain'
      			WHEN (STAIN_TYPE = '07') THEN 'NSE stain'
      			WHEN (STAIN_TYPE = '08') THEN 'NSE stain after NaFinhibition'
      			WHEN (STAIN_TYPE = '09') THEN 'Reticulin stain'
      			WHEN (STAIN_TYPE = '10') THEN 'PAS stain'
      			WHEN (STAIN_TYPE = '11') THEN 'CD 3'
      			WHEN (STAIN_TYPE = '12') THEN 'CD 5'
      			WHEN (STAIN_TYPE = '13') THEN 'CD 20'
      			WHEN (STAIN_TYPE = '14') THEN 'CD 79a'
		   ELSE (SELECT IFNULL(MIN(B.USER_STAIN_TYPE), '')
    				  FROM TB_USER_INPUT_STAIN_TYPE B
    			   WHERE A.CASSET_ID = B.CASSET_ID
    				   AND A.SLOT_ID = B.SLOT_ID)
	    END) AS STAIN_TYPE_NM
    , STAIN_TYPE
    , (CASE WHEN (ANALYSIS_TYPE = '01') THEN 'PB smear'
            WHEN (ANALYSIS_TYPE = '02') THEN 'BM smear'
            WHEN (ANALYSIS_TYPE = '03') THEN 'Touch print'
            WHEN (ANALYSIS_TYPE = '04') THEN 'BM biopsy'
        ELSE 'Clot section'
       END) AS ANALYSIS_TYPE_NM
    , ANALYSIS_TYPE
    , STITCH_COUNT
    , IS_NS_NB_INTEGRATION
    , CELLULARITY
    , ME_RATIO
    , IS_NORMAL
    , IS_CHECKED
    , ROW_NUMBER() OVER(ORDER BY A.ANALYZE_DTTM DESC) AS ROW_NUM
    , (SELECT JSON_GROUP_ARRAY(
				        JSON_OBJECT('id', B.CLASS_ID, 'title', B.CLASS_TITLE, 'name', B.CLASS_NM, 'count', B.COUNT)
			        )
    	  FROM TB_WBC_CLASSIFICATION B
    	 WHERE A.CASSET_ID = B.CASSET_ID AND A.SLOT_ID = B.SLOT_ID AND A.ORDER_ID = B.ORDER_ID) WBC_INFO
  FROM TB_TEST_HISTORY A
  WHERE 1=1`,

  SEARCH_TEST_HISTORY_LIST_ALL:
  `SELECT A.*
    FROM (
    	SELECT
      (CASE WHEN (C.ANALYSIS_TYPE = '01') THEN 'PB smear'
          WHEN (C.ANALYSIS_TYPE = '02') THEN 'BM smear'
          WHEN (C.ANALYSIS_TYPE = '03') THEN 'Touch print'
          WHEN (C.ANALYSIS_TYPE = '04') THEN 'BM biopsy'
          WHEN (C.ANALYSIS_TYPE = '05') THEN 'Clot section'
        ELSE 'BM smear'
       END) AS ANALYSIS_TYPE
        , (CASE WHEN (C.TEST_TYPE = '01') THEN 'PB'
            ELSE 'BM'
           END) AS TEST_TYPE
    		, C.CASSET_ID
    		, C.ORDER_ID
    		, C.SLOT_ID
        , C.BM_NO
        , C.PATIENT_ID
        , C.PATIENT_NM
        , C.DEPARTMENT
        , C.ANALYZE_DTTM
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'NE' THEN A.COUNT END), '0') AS A_Neutrophil
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'NS' THEN A.COUNT END), '0') AS A_NeutrophilS
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'NB' THEN A.COUNT END), '0') AS A_NeutrophilB
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'ME' THEN A.COUNT END), '0') AS A_Metamyelocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'MY' THEN A.COUNT END), '0') AS A_Myelocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'PR' THEN A.COUNT END), '0') AS A_Promyelocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'LY' THEN A.COUNT END), '0') AS A_Lymphocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'LR' THEN A.COUNT END), '0') AS A_Reactive_lymphocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'LA' THEN A.COUNT END), '0') AS A_Abnormal_lymphocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'MO' THEN A.COUNT END), '0') AS A_Monocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'EO' THEN A.COUNT END), '0') AS A_Eosinophil
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'BA' THEN A.COUNT END), '0') AS A_Basophil
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'BL' THEN A.COUNT END), '0') AS A_Blast
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'PC' THEN A.COUNT END), '0') AS A_Plasma_cell
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'NR' THEN A.COUNT END), '0') AS A_nRBC
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'GP' THEN A.COUNT END), '0') AS A_Giant_platelet
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'PA' THEN A.COUNT END), '0') AS A_Platelet_aggregation
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'MA' THEN A.COUNT END), '0') AS A_Malaria
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'AR' THEN A.COUNT END), '0') AS A_Artifact
    		, IFNULL(MAX(CASE WHEN A.CLASS_ID = '90' THEN A.COUNT END), '0') AS A_CUSTOM_90_CNT
    		, IFNULL(MAX(CASE WHEN A.CLASS_ID = '90' THEN A.CLASS_NM END), 'N/A') AS A_CUSTOM_90_NM
    		, IFNULL(MAX(CASE WHEN A.CLASS_ID = '91' THEN A.COUNT END), '0') AS A_CUSTOM_91_CNT
    		, IFNULL(MAX(CASE WHEN A.CLASS_ID = '91' THEN A.CLASS_NM END), 'N/A') AS A_CUSTOM_91_NM
    		, IFNULL(MAX(CASE WHEN A.CLASS_ID = '92' THEN A.COUNT END), '0') AS A_CUSTOM_92_CNT
    		, IFNULL(MAX(CASE WHEN A.CLASS_ID = '92' THEN A.CLASS_NM END), 'N/A') AS A_CUSTOM_92_NM
    		, IFNULL(MAX(CASE WHEN A.CLASS_ID = '93' THEN A.COUNT END), '0') AS A_CUSTOM_93_CNT
    		, IFNULL(MAX(CASE WHEN A.CLASS_ID = '93' THEN A.CLASS_NM END), 'N/A') AS A_CUSTOM_93_NM
    		, IFNULL(MAX(CASE WHEN A.CLASS_ID = '94' THEN A.COUNT END), '0') AS A_CUSTOM_94_CNT
    		, IFNULL(MAX(CASE WHEN A.CLASS_ID = '94' THEN A.CLASS_NM END), 'N/A') AS A_CUSTOM_94_NM
    		, '0' AS A_Orthochromic_Normoblast
    		, '0' AS A_Polychromic_Normoblast
    		, '0' AS A_Basophilic_Normoblast
    		, '0' AS A_Proerythroblast
    		, '0' AS A_Histiocyte
    		, '0' AS A_Others
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'NE' THEN B.COUNT END), '0') AS B_Neutrophil
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'NS' THEN B.COUNT END), '0') AS B_NeutrophilS
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'NB' THEN B.COUNT END), '0') AS B_NeutrophilB
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'ME' THEN B.COUNT END), '0') AS B_Metamyelocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'MY' THEN B.COUNT END), '0') AS B_Myelocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'PR' THEN B.COUNT END), '0') AS B_Promyelocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'LY' THEN B.COUNT END), '0') AS B_Lymphocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'LR' THEN B.COUNT END), '0') AS B_Reactive_lymphocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'LA' THEN B.COUNT END), '0') AS B_Abnormal_lymphocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'MO' THEN B.COUNT END), '0') AS B_Monocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'EO' THEN B.COUNT END), '0') AS B_Eosinophil
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'BA' THEN B.COUNT END), '0') AS B_Basophil
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'BL' THEN B.COUNT END), '0') AS B_Blast
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'PC' THEN B.COUNT END), '0') AS B_Plasma_cell
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'NR' THEN B.COUNT END), '0') AS B_nRBC
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'GP' THEN B.COUNT END), '0') AS B_Giant_platelet
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'PA' THEN B.COUNT END), '0') AS B_Platelet_aggregation
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'MA' THEN B.COUNT END), '0') AS B_Malaria
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'AR' THEN B.COUNT END), '0') AS B_Artifact
    		, IFNULL(MAX(CASE WHEN B.CLASS_ID = '90' THEN B.COUNT END), '0') AS B_CUSTOM_90_CNT
    		, IFNULL(MAX(CASE WHEN B.CLASS_ID = '90' THEN B.CLASS_NM END), 'N/A') AS B_CUSTOM_90_NM
    		, IFNULL(MAX(CASE WHEN B.CLASS_ID = '91' THEN B.COUNT END), '0') AS B_CUSTOM_91_CNT
    		, IFNULL(MAX(CASE WHEN B.CLASS_ID = '91' THEN B.CLASS_NM END), 'N/A') AS B_CUSTOM_91_NM
    		, IFNULL(MAX(CASE WHEN B.CLASS_ID = '92' THEN B.COUNT END), '0') AS B_CUSTOM_92_CNT
    		, IFNULL(MAX(CASE WHEN B.CLASS_ID = '92' THEN B.CLASS_NM END), 'N/A') AS B_CUSTOM_92_NM
    		, IFNULL(MAX(CASE WHEN B.CLASS_ID = '93' THEN B.COUNT END), '0') AS B_CUSTOM_93_CNT
    		, IFNULL(MAX(CASE WHEN B.CLASS_ID = '93' THEN B.CLASS_NM END), 'N/A') AS B_CUSTOM_93_NM
    		, IFNULL(MAX(CASE WHEN B.CLASS_ID = '94' THEN B.COUNT END), '0') AS B_CUSTOM_94_CNT
    		, IFNULL(MAX(CASE WHEN B.CLASS_ID = '94' THEN B.CLASS_NM END), 'N/A') AS B_CUSTOM_94_NM
    		, '0' AS B_Orthochromic_Normoblast
    		, '0' AS B_Polychromic_Normoblast
    		, '0' AS B_Basophilic_Normoblast
    		, '0' AS B_Proerythroblast
    		, '0' AS B_Histiocyte
    		, '0' AS B_Others
    	FROM  TB_WBC_CLASSIFICATION A
    		, TB_WBC_CLASSIFICATION_HIST B
    		, TB_TEST_HISTORY C
    	WHERE 1=1
    		AND A.CASSET_ID = B.CASSET_ID
    		AND A.SLOT_ID = B.SLOT_ID
    		AND A.ORDER_ID = B.ORDER_ID
    		AND A.CLASS_ID = B.CLASS_ID
    		AND A.CASSET_ID = C.CASSET_ID
    		AND A.SLOT_ID = C.SLOT_ID
    		AND A.ORDER_ID = C.ORDER_ID
    		GROUP BY A.CASSET_ID, A.ORDER_ID, A.SLOT_ID
    	UNION
    	SELECT
        (CASE WHEN (C.ANALYSIS_TYPE = '01') THEN 'PB smear'
            WHEN (C.ANALYSIS_TYPE = '02') THEN 'BM smear'
            WHEN (C.ANALYSIS_TYPE = '03') THEN 'Touch print'
            WHEN (C.ANALYSIS_TYPE = '04') THEN 'BM biopsy'
            WHEN (C.ANALYSIS_TYPE = '05') THEN 'Clot section'
          ELSE 'BM smear'
         END) AS ANALYSIS_TYPE
        , (CASE WHEN (C.TEST_TYPE = '01') THEN 'PB'
            ELSE 'BM'
           END) AS TEST_TYPE
    		, C.CASSET_ID
    		, C.ORDER_ID
    		, C.SLOT_ID
        , C.BM_NO
        , C.PATIENT_ID
        , C.PATIENT_NM
        , C.DEPARTMENT
        , C.ANALYZE_DTTM
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'NE' THEN A.COUNT END), '0') AS A_Neutrophil
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'NS' THEN A.COUNT END), '0') AS A_NeutrophilS
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'NB' THEN A.COUNT END), '0') AS A_NeutrophilB
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'ME' THEN A.COUNT END), '0') AS A_Metamyelocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'MY' THEN A.COUNT END), '0') AS A_Myelocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'PR' THEN A.COUNT END), '0') AS A_Promyelocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'LY' THEN A.COUNT END), '0') AS A_Lymphocyte
    		, '0' AS A_Reactive_lymphocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'LA' THEN A.COUNT END), '0') AS A_Abnormal_lymphocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'MO' THEN A.COUNT END), '0') AS A_Monocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'EO' THEN A.COUNT END), '0') AS A_Eosinophil
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'BA' THEN A.COUNT END), '0') AS A_Basophil
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'BL' THEN A.COUNT END), '0') AS A_Blast
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'PC' THEN A.COUNT END), '0') AS A_Plasma_cell
    		, '0' AS A_nRBC
    		, '0' AS A_Giant_platelet
    		, '0' AS A_Platelet_aggregation
    		, '0' AS A_Malaria
    		, '0' AS A_Artifact
    		, '0' AS A_CUSTOM_90_CNT
    		, 'N/A' A_CUSTOM_90_NM
    		, '0' AS A_CUSTOM_91_CNT
    		, 'N/A' AS A_CUSTOM_91_NM
    		, '0' AS A_CUSTOM_92_CNT
    		, 'N/A' AS A_CUSTOM_92_NM
    		, '0' AS A_CUSTOM_93_CNT
    		, 'N/A' AS A_CUSTOM_93_NM
    		, '0' AS A_CUSTOM_94_CNT
    		, 'N/A' AS A_CUSTOM_94_NM
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'ON' THEN A.COUNT END), '0') AS A_Orthochromic_Normoblast
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'PN' THEN A.COUNT END), '0') AS A_Polychromic_Normoblast
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'BN' THEN A.COUNT END), '0') AS A_Basophilic_Normoblast
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'PE' THEN A.COUNT END), '0') AS A_Proerythroblast
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'HC' THEN A.COUNT END), '0') AS A_Histiocyte
    		, IFNULL(MAX(CASE WHEN A.CLASS_TITLE = 'OT' THEN A.COUNT END), '0') AS A_Others
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'NE' THEN B.COUNT END), '0') AS B_Neutrophil
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'NS' THEN B.COUNT END), '0') AS B_NeutrophilS
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'NB' THEN B.COUNT END), '0') AS B_NeutrophilB
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'ME' THEN B.COUNT END), '0') AS B_Metamyelocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'MY' THEN B.COUNT END), '0') AS B_Myelocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'PR' THEN B.COUNT END), '0') AS B_Promyelocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'LY' THEN B.COUNT END), '0') AS B_Lymphocyte
    		, '0' AS B_Reactive_lymphocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'LA' THEN B.COUNT END), '0') AS B_Abnormal_lymphocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'MO' THEN B.COUNT END), '0') AS B_Monocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'EO' THEN B.COUNT END), '0') AS B_Eosinophil
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'BA' THEN B.COUNT END), '0') AS B_Basophil
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'BL' THEN B.COUNT END), '0') AS B_Blast
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'PC' THEN B.COUNT END), '0') AS B_Plasma_cell
    		, '0' AS A_nRBC
    		, '0' AS A_Giant_platelet
    		, '0' AS A_Platelet_aggregation
    		, '0' AS A_Malaria
    		, '0' AS A_Artifact
    		, '0' AS B_CUSTOM_90_CNT
    		, 'N/A' B_CUSTOM_90_NM
    		, '0' AS B_CUSTOM_91_CNT
    		, 'N/A' AS B_CUSTOM_91_NM
    		, '0' AS B_CUSTOM_92_CNT
    		, 'N/A' AS B_CUSTOM_92_NM
    		, '0' AS B_CUSTOM_93_CNT
    		, 'N/A' AS B_CUSTOM_93_NM
    		, '0' AS B_CUSTOM_94_CNT
    		, 'N/A' AS B_CUSTOM_94_NM
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'ON' THEN B.COUNT END), '0') AS B_Orthochromic_Normoblast
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'PN' THEN B.COUNT END), '0') AS B_Polychromic_Normoblast
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'BN' THEN B.COUNT END), '0') AS B_Basophilic_Normoblast
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'PE' THEN B.COUNT END), '0') AS B_Proerythroblast
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'HC' THEN B.COUNT END), '0') AS B_Histiocyte
    		, IFNULL(MAX(CASE WHEN B.CLASS_TITLE = 'OT' THEN B.COUNT END), '0') AS B_Others
    	FROM  TB_BM_CELL_CLASSIFICATION A
    		, TB_BM_CELL_CLASSIFICATION_HIST B
    		, TB_TEST_HISTORY C
    	WHERE 1=1
    		AND A.CASSET_ID = B.CASSET_ID
    		AND A.SLOT_ID = B.SLOT_ID
    		AND A.ORDER_ID = B.ORDER_ID
    		AND A.CLASS_ID = B.CLASS_ID
    		AND A.CASSET_ID = C.CASSET_ID
    		AND A.SLOT_ID = C.SLOT_ID
    		AND A.ORDER_ID = C.ORDER_ID
    		GROUP BY A.CASSET_ID, A.ORDER_ID, A.SLOT_ID
    ) A
    WHERE 1=1
  `,

  SELECT_TEST_HISTORY:
  `SELECT CASSET_ID
    , SLOT_ID
    , CASSET_NO
    , SLOT_NO
    , BARCODE_NO
    , PATIENT_ID
    , PATIENT_NM
    , ORDER_DTTM
    , (CASE WHEN (STATE_CD = '00') THEN 'Empty'
            WHEN (STATE_CD = '01') THEN 'Ready'
            WHEN (STATE_CD = '02') THEN 'Scan'
            WHEN (STATE_CD = '03') THEN 'Analyzing'
            WHEN (STATE_CD = '04') THEN 'Complete'
        ELSE 'Error'
       END) AS STATE_CD_NM
    , STATE_CD
    , MALARIA_COUNT
    , PLT_COUNT
    , ANALYZE_DTTM
    , BIRTHDAY
    , AGE
    , (CASE WHEN (GENDER = '01') THEN 'Male'
        ELSE 'Female'
       END) AS GENDER_NM
    , GENDER
    , (CASE WHEN (TEST_TYPE = '01') THEN 'PB'
        WHEN (TEST_TYPE = '02') THEN 'BM'
        ELSE 'BF'
       END) AS TEST_TYPE_NM
    , TEST_TYPE
    , TEST_TYPE AS TEST_TYPE_CD
    , BM_NO
    , ORDER_ID
    , SIGNED_STATE
    , SIGNED_DTTM
    , SIGNED_USER_ID
    , WBC_COMMENT
    , RBC_COMMENT
    , BM_COMMENT
    , MAX_WBC_COUNT
    , MAX_RBC_COUNT
    , SERIAL_NO
    , DEPARTMENT
    , (CASE WHEN (BM_SAMPLING_SITE = '01') THEN 'Single'
        ELSE 'Both'
       END) AS BM_SAMPLING_SITE_NM
    , BM_SAMPLING_SITE
    , (CASE WHEN (STAIN_TYPE = '01') THEN 'Wright stain'
      			WHEN (STAIN_TYPE = '02') THEN 'Giemsa stain'
      			WHEN (STAIN_TYPE = '03') THEN 'Wright & Giemsa stain'
      			WHEN (STAIN_TYPE = '04') THEN 'Iron stain'
      			WHEN (STAIN_TYPE = '05') THEN 'Trichrome stain'
      			WHEN (STAIN_TYPE = '06') THEN 'Myeloperoxidase stain'
      			WHEN (STAIN_TYPE = '07') THEN 'NSE stain'
      			WHEN (STAIN_TYPE = '08') THEN 'NSE stain after NaFinhibition'
      			WHEN (STAIN_TYPE = '09') THEN 'Reticulin stain'
      			WHEN (STAIN_TYPE = '10') THEN 'PAS stain'
      			WHEN (STAIN_TYPE = '11') THEN 'CD 3'
      			WHEN (STAIN_TYPE = '12') THEN 'CD 5'
      			WHEN (STAIN_TYPE = '13') THEN 'CD 20'
      			WHEN (STAIN_TYPE = '14') THEN 'CD 79a'
		   ELSE (SELECT IFNULL(MIN(B.USER_STAIN_TYPE), '')
    				  FROM TB_USER_INPUT_STAIN_TYPE B
    			   WHERE A.CASSET_ID = B.CASSET_ID
    				   AND A.SLOT_ID = B.SLOT_ID)
	    END) AS STAIN_TYPE_NM
    , STAIN_TYPE
    , (CASE WHEN (ANALYSIS_TYPE = '01') THEN 'PB smear'
            WHEN (ANALYSIS_TYPE = '02') THEN 'BM smear'
            WHEN (ANALYSIS_TYPE = '03') THEN 'Touch print'
            WHEN (ANALYSIS_TYPE = '04') THEN 'BM biopsy'
        ELSE 'Clot section'
       END) AS ANALYSIS_TYPE_NM
    , ANALYSIS_TYPE
    , STITCH_COUNT
    , IS_NS_NB_INTEGRATION
    , CELLULARITY
    , ME_RATIO
    , IS_NORMAL
    , IS_CHECKED
  FROM TB_TEST_HISTORY A
  WHERE ORDER_ID = ?
  ORDER BY ANALYZE_DTTM DESC`,

  SELECT_PB_SEMAR:
  `SELECT CASSET_ID
    , SLOT_ID
    , CASSET_NO
    , SLOT_NO
    , BARCODE_NO
    , PATIENT_ID
    , PATIENT_NM
    , ORDER_DTTM
    , (CASE WHEN (STATE_CD = '00') THEN 'Empty'
            WHEN (STATE_CD = '01') THEN 'Ready'
            WHEN (STATE_CD = '02') THEN 'Scan'
            WHEN (STATE_CD = '03') THEN 'Analyzing'
            WHEN (STATE_CD = '04') THEN 'Complete'
        ELSE 'Error'
       END) AS STATE_CD_NM
    , STATE_CD
    , MALARIA_COUNT
    , PLT_COUNT
    , ANALYZE_DTTM
    , BIRTHDAY
    , AGE
    , (CASE WHEN (GENDER = '01') THEN 'Male'
        ELSE 'Female'
       END) AS GENDER_NM
    , GENDER
    , (CASE WHEN (TEST_TYPE = '01') THEN 'PB'
        WHEN (TEST_TYPE = '02') THEN 'BM'
        ELSE 'BF'
       END) AS TEST_TYPE_NM
    , TEST_TYPE
    , TEST_TYPE AS TEST_TYPE_CD
    , BM_NO
    , ORDER_ID
    , SIGNED_STATE
    , SIGNED_DTTM
    , SIGNED_USER_ID
    , WBC_COMMENT
    , RBC_COMMENT
    , BM_COMMENT
    , MAX_WBC_COUNT
    , MAX_RBC_COUNT
    , SERIAL_NO
    , DEPARTMENT
    , (CASE WHEN (BM_SAMPLING_SITE = '01') THEN 'Single'
        ELSE 'Both'
       END) AS BM_SAMPLING_SITE_NM
    , BM_SAMPLING_SITE
    , (CASE WHEN (STAIN_TYPE = '01') THEN 'Wright stain'
      			WHEN (STAIN_TYPE = '02') THEN 'Giemsa stain'
      			WHEN (STAIN_TYPE = '03') THEN 'Wright & Giemsa stain'
      			WHEN (STAIN_TYPE = '04') THEN 'Iron stain'
      			WHEN (STAIN_TYPE = '05') THEN 'Trichrome stain'
      			WHEN (STAIN_TYPE = '06') THEN 'Myeloperoxidase stain'
      			WHEN (STAIN_TYPE = '07') THEN 'NSE stain'
      			WHEN (STAIN_TYPE = '08') THEN 'NSE stain after NaFinhibition'
      			WHEN (STAIN_TYPE = '09') THEN 'Reticulin stain'
      			WHEN (STAIN_TYPE = '10') THEN 'PAS stain'
      			WHEN (STAIN_TYPE = '11') THEN 'CD 3'
      			WHEN (STAIN_TYPE = '12') THEN 'CD 5'
      			WHEN (STAIN_TYPE = '13') THEN 'CD 20'
      			WHEN (STAIN_TYPE = '14') THEN 'CD 79a'
		   ELSE (SELECT IFNULL(MIN(B.USER_STAIN_TYPE), '')
    				  FROM TB_USER_INPUT_STAIN_TYPE B
    			   WHERE A.CASSET_ID = B.CASSET_ID
    				   AND A.SLOT_ID = B.SLOT_ID)
	    END) AS STAIN_TYPE_NM
    , STAIN_TYPE
    , (CASE WHEN (ANALYSIS_TYPE = '01') THEN 'PB smear'
            WHEN (ANALYSIS_TYPE = '02') THEN 'BM smear'
            WHEN (ANALYSIS_TYPE = '03') THEN 'Touch print'
            WHEN (ANALYSIS_TYPE = '04') THEN 'BM biopsy'
        ELSE 'Clot section'
       END) AS ANALYSIS_TYPE_NM
    , ANALYSIS_TYPE
    , STITCH_COUNT
    , IS_NS_NB_INTEGRATION
    , CELLULARITY
    , ME_RATIO
    , IS_NORMAL
  FROM TB_TEST_HISTORY A
  WHERE ANALYSIS_TYPE = '01'
  ORDER BY ANALYZE_DTTM DESC`,

  SELECT_BM_CELL_CLASSIFICATION:
  `SELECT CASSET_ID
    , SLOT_ID
    , ORDER_ID
    , CLASS_ID
    , CLASS_NM
    , CLASS_TITLE
    , COUNT
    , CREATE_DTTM
    , CREATE_ID
    , MODIFY_DTTM
    , MODIFY_ID
   FROM TB_BM_CELL_CLASSIFICATION
   WHERE ORDER_ID = ?`,

  SELECT_BM_CELL_CLASSIFICATION_HIST:
    `SELECT CASSET_ID
     , SLOT_ID
     , ORDER_ID
     , CLASS_ID
     , CLASS_NM
     , CLASS_TITLE
     , COUNT
     , CREATE_DTTM
     , CREATE_ID
     , MODIFY_DTTM
     , MODIFY_ID
     FROM TB_BM_CELL_CLASSIFICATION_HIST
    WHERE ORDER_ID = ?`,

  DELETE_TEST_HISTORY:
  `DELETE FROM TB_TEST_HISTORY
   WHERE SLOT_ID IN (SELECT SLOT_ID
                     FROM TB_TEST_HISTORY
                     WHERE SLOT_ID IN (userInput))`,

  INSERT_WBC_CLASSIFICATION:
  `INSERT OR REPLACE INTO TB_WBC_CLASSIFICATION
   VALUES (?,?,?,?,?,?,?,?,?,?,?)`,

  INSERT_WBC_CLASSIFICATION_ALL:
  `INSERT OR REPLACE INTO TB_WBC_CLASSIFICATION
   VALUES userInput`,

  INSERT_BM_CLASSIFICATION_ALL:
  `INSERT OR REPLACE INTO TB_BM_CELL_CLASSIFICATION
   VALUES userInput`,

  INSERT_BM_CLASSIFICATION_HIST:
  `INSERT OR REPLACE INTO TB_BM_CELL_CLASSIFICATION_HIST
   VALUES userInput`,

  INSERT_RBC_CATEGORYES:
  `INSERT OR REPLACE INTO TB_RBC_CATEGORY
   VALUES userInput`,

  INSERT_RBC_CLASSIFICATION:
  `INSERT OR REPLACE INTO TB_RBC_CLASSIFICATION
   VALUES userInput`,

  INSERT_BM_CELL_CLASSIFICATION:
  `INSERT OR REPLACE INTO TB_BM_CELL_CLASSIFICATION
   VALUES (?,?,?,?,?,?,?,?,?,?,?)`,

  SELECT_RBC_CLASSIFICATION:
  `SELECT TA.CASSET_ID
     , TA.SLOT_ID
     , TA.ORDER_ID
     , TA.CATEGORY_ID
     , TA.CATEGORY_NM
     , TB.CLASS_ID
     , TB.CLASS_NM
     , TB.DEGREE
   FROM TB_RBC_CATEGORY TA
   	, TB_RBC_CLASSIFICATION TB
   WHERE TA.CASSET_ID = TB.CASSET_ID
    AND TA.SLOT_ID = TB.SLOT_ID
    AND TA.CATEGORY_ID = TB.CATEGORY_ID
    AND TA.ORDER_ID = ?`,

  UPDATE_IS_NORMAL_CELL:
  `UPDATE TB_TEST_HISTORY
    SET IS_NORMAL = ?
   WHERE SLOT_ID = ?`,

  UPDATE_IS_CHECKED_CELL: 
  `UPDATE TB_TEST_HISTORY
     SET IS_CHECKED = ?
   WHERE SLOT_ID = ?`,

  UPDATE_RBC_COMMENT:
  `UPDATE TB_TEST_HISTORY
    SET RBC_COMMENT = ?
   WHERE SLOT_ID = ?`,

  UPDATE_RBC_CLASSIFICATION:
  `UPDATE TB_RBC_CLASSIFICATION
    SET DEGREE = ?
   WHERE CASSET_ID = ?
    AND SLOT_ID = ?
    AND CATEGORY_ID = ?
    AND CLASS_ID = ?`,

  UPDATE_WBC_COMMENT:
  `UPDATE TB_TEST_HISTORY
    SET WBC_COMMENT = ?
   WHERE SLOT_ID = ?`,

  UPDATE_BM_COMMENT:
  `UPDATE TB_TEST_HISTORY
    SET BM_COMMENT = ?
   WHERE SLOT_ID = ?`,

   UPDATE_TEST_HISTORY_PATIENT:
   `UPDATE TB_TEST_HISTORY
     SET BM_NO = ?
      , PATIENT_ID = ?
      , PATIENT_NM = ?
      , MODIFY_DTTM = ?
      , MODIFY_ID = ?
    WHERE ORDER_ID = ?`,

   UPDATE_SIGNED_STATE:
   `UPDATE TB_TEST_HISTORY
     SET SIGNED_STATE = ?
      , SIGNED_DTTM = ?
      , SIGNED_USER_ID = ?
      , MODIFY_DTTM = ?
      , MODIFY_ID = ?
    WHERE ORDER_ID = ?`,

   INSERT_WBC_CELL_POSITION:
   `INSERT OR REPLACE INTO TB_WBC_CELL_POSITION
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

   SELECT_WBC_CELL_POSITION:
   `SELECT CASSET_ID
       , SLOT_ID
       , FILE_ID
       , FILE_NM
       , POSX1
       , POSY1
       , POSX2
       , POSY2
       , ORG_WIDTH
       , ORG_HEIGHT
       , ANALYSIS_TYPE
       , CREATE_DTTM
       , CREATE_ID
       , MODIFY_DTTM
       , MODIFY_ID
    FROM TB_WBC_CELL_POSITION
   WHERE SLOT_ID = ?
    AND ANALYSIS_TYPE = ?`,

    INSERT_USER:
    `INSERT INTO TB_USER
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,

    IS_REGIST_USER:
    `SELECT (CASE WHEN (COUNT(1) > 0) THEN 1
    		     ELSE 0
    	      END) AS IS_REGIST
     FROM TB_USER
     WHERE USER_ID = ?`,

    SELECT_USER_LIST:
    `SELECT USER_ID
       , USER_NM
       , EMP_NO
       , POSITION
       , AUTH_CD
       , ENC_PWD
       , IS_AVAILABLE
       , LOGIN_DTTM
       , CREATE_DTTM
       , CREATE_ID
       , MODIFY_DTTM
       , MODIFY_ID
     FROM TB_USER`,

    UPDATE_USER_DTTM:
    `UPDATE TB_USER
      SET LOGIN_DTTM = ?
       , MODIFY_DTTM = ?
     WHERE USER_ID = ?`,

    UPDATE_USER:
    `UPDATE TB_USER
      SET AUTH_CD = ?
       , USER_NM = ?
       , IS_AVAILABLE = ?
       , MODIFY_DTTM = ?
     WHERE USER_ID = ?`,

    DELETE_USER:
    `DELETE
      FROM TB_USER
     WHERE USER_ID = ?`,

    UPDATE_MALARIA_COUNT:
   `UPDATE TB_TEST_HISTORY
     SET MALARIA_COUNT = ?
       , MODIFY_DTTM = ?
       , MODIFY_ID = ?
    WHERE SLOT_ID = ?`,

    INSERT_WBC_CUSTOM_CLASS:
    `INSERT OR IGNORE INTO TB_WBC_CUSTOM_CLASS
      VALUES('90', '', '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
        , ('91', '', '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
        , ('92', '', '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
        , ('93', '', '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
        , ('94', '', '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
    `,

    SELECT_WBC_CUSTOM_CLASS:
    `SELECT CLASS_ID
      , CLASS_TITLE
      , CLASS_NM
     FROM TB_WBC_CUSTOM_CLASS
     WHERE 1=1
    `,

    UPDATE_WBC_CUSTOM_CLASS:
    `UPDATE TB_WBC_CUSTOM_CLASS
      SET CLASS_TITLE = ?
        , CLASS_NM = ?
     WHERE CLASS_ID = ?
    `,

    INSERT_WBC_IMAGES_HIST:
    `INSERT OR REPLACE INTO TB_WBC_IMAGE_HIST
      VALUES userInput`,

    UPDATE_WBC_IMAGES_HIST:
    `UPDATE TB_WBC_IMAGE_HIST
      SET CURRENT_CLASS_ID = ?
     WHERE 1=1
      AND CASSET_ID = ?
      AND SLOT_ID = ?
      AND ORDER_ID = ?
      AND userInput`,

    SELECT_BM_MODIFY_LIST:
    `SELECT
    	A.CASSET_ID
    	, A.SLOT_ID
    	, A.CLASS_ID
    	, A.CLASS_TITLE
    	, A.CLASS_NM
    	, A.COUNT
    	, B.CURRENT_CLASS_ID
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '01' THEN 1 END) AS '01'
      , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '71' THEN 1 END) AS '71'
      , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '72' THEN 1 END) AS '72'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '02' THEN 1 END) AS '02'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '03' THEN 1 END) AS '03'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '04' THEN 1 END) AS '04'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '05' THEN 1 END) AS '05'
      , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '06' THEN 1 END) AS '06'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '07' THEN 1 END) AS '07'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '08' THEN 1 END) AS '08'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '09' THEN 1 END) AS '09'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '10' THEN 1 END) AS '10'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '11' THEN 1 END) AS '11'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '12' THEN 1 END) AS '12'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '13' THEN 1 END) AS '13'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '14' THEN 1 END) AS '14'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '15' THEN 1 END) AS '15'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '16' THEN 1 END) AS '16'
      , COUNT(CASE WHEN B.CURRENT_CLASS_ID = '17' THEN 1 END) AS '17'
    FROM TB_BM_CELL_CLASSIFICATION A
    	, TB_WBC_IMAGE_HIST B
    WHERE 1=1
      AND A.SLOT_ID = ?
    	AND A.CASSET_ID = B.CASSET_ID
    	AND A.SLOT_ID = B.SLOT_ID
    	AND A.CLASS_ID = B.CLASS_ID
    GROUP BY A.CLASS_ID
    ORDER BY A.CLASS_ID ASC`,

    SELECT_WBC_MODIFY_LIST:
    `SELECT
    	A.CASSET_ID
    	, A.SLOT_ID
    	, A.CLASS_ID
    	, A.CLASS_TITLE
    	, A.CLASS_NM
    	, A.COUNT
    	, B.CURRENT_CLASS_ID
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '01' THEN 1 END) AS '01'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '71' THEN 1 END) AS '71'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '72' THEN 1 END) AS '72'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '02' THEN 1 END) AS '02'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '03' THEN 1 END) AS '03'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '04' THEN 1 END) AS '04'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '05' THEN 1 END) AS '05'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '61' THEN 1 END) AS '61'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '62' THEN 1 END) AS '62'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '07' THEN 1 END) AS '07'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '08' THEN 1 END) AS '08'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '09' THEN 1 END) AS '09'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '10' THEN 1 END) AS '10'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '11' THEN 1 END) AS '11'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '12' THEN 1 END) AS '12'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '13' THEN 1 END) AS '13'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '14' THEN 1 END) AS '14'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '15' THEN 1 END) AS '15'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '16' THEN 1 END) AS '16'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '90' THEN 1 END) AS '90'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '91' THEN 1 END) AS '91'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '92' THEN 1 END) AS '92'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '93' THEN 1 END) AS '93'
    	, COUNT(CASE WHEN B.CURRENT_CLASS_ID = '94' THEN 1 END) AS '94'
    FROM TB_WBC_CLASSIFICATION A
    	, TB_WBC_IMAGE_HIST B
    WHERE 1=1
      AND A.SLOT_ID = ?
    	AND A.CASSET_ID = B.CASSET_ID
    	AND A.SLOT_ID = B.SLOT_ID
    	AND A.CLASS_ID = B.CLASS_ID
    GROUP BY A.CLASS_ID
    ORDER BY A.CLASS_ID ASC`,

    ADD_IS_NS_NB_INTEGRATION:
   `ALTER TABLE TB_TEST_HISTORY ADD COLUMN IS_NS_NB_INTEGRATION TEXT DEFAULT 'N'`,

    ADD_PLTCOUNT:
   `ALTER TABLE TB_TEST_HISTORY ADD COLUMN PLT_COUNT TEXT DEFAULT '0'`,

    ADD_CELLULARITY:
    `ALTER TABLE TB_TEST_HISTORY ADD COLUMN CELLULARITY TEXT DEFAULT '0'`,

    ADD_ME_RATIO:
    `ALTER TABLE TB_TEST_HISTORY ADD COLUMN ME_RATIO TEXT DEFAULT '0'`,

    ADD_IS_NORMAL:
    `ALTER TABLE TB_TEST_HISTORY ADD COLUMN IS_NORMAL TEXT DEFAULT 'Y'`,

    SELECT_RBC_DEGREE:
    `SELECT CATEGORY_ID
        , CLASS_ID
        , DEGREE_1
        , DEGREE_2
        , DEGREE_3
     FROM TB_RBC_DEGREE_VAL
     WHERE 1=1`,

    UPDATE_RBC_DEGREE:
    `UPDATE TB_RBC_DEGREE_VAL
      SET DEGREE_1 = ?
        , DEGREE_2 = ?
        , DEGREE_3 = ?
      WHERE CATEGORY_ID = ?
       AND CLASS_ID = ?`,

   INSERT_DEFAULT_RBC_DEGREE:
   `INSERT OR IGNORE INTO TB_RBC_DEGREE_VAL
     VALUES('01', '02', 11, 20, 30, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '03', 11, 20, 30, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '04', 11, 20, 30, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '01', 11, 20, 30, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '02', 11, 20, 30, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '03', 11, 20, 30, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '04', 0.5, 5, 20, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('03', '03', 0.5, 10, 30, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('03', '04', 1, 10, 25, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('03', '05', 1, 10, 25, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('03', '06', 0.5, 5, 20, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('03', '07', 1, 3, 6, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('03', '08', 1, 3, 6, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('03', '09', 1, 3, 6, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('03', '10', 1, 3, 6, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('03', '11', 1, 3, 6, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('05', '01', 1, 3, 6, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('05', '02', 0.5, 5, 20, strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')`,

   INSERT_COMMON_CODE_GRP:
     `INSERT OR IGNORE INTO TB_COMMON_CODE_GRP
       VALUES('A00', 'hotkey type', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')`,

   INSERT_COMMON_CODE:
   `INSERT OR IGNORE INTO TB_COMMON_CODE
     VALUES('A00', '01', 'WBC', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('A00', '02', 'BM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')`,

   SELECT_WBC_HOT_KEY:
   `SELECT A.HOT_KEY_TYPE
      , A.CLASS_ID
      , A.CLASS_TITLE
      , A.CLASS_NM
      , A.HOT_KEY
   FROM TB_HOT_KEY A
   WHERE 1=1
      AND A.HOT_KEY_TYPE = ?
      AND A.CLASS_TITLE != ''`,

   UPDATE_HOT_KEYS:
   `UPDATE TB_HOT_KEY
     SET HOT_KEY = ?
    WHERE HOT_KEY_TYPE = ?
      AND CLASS_ID = ?`,

   UPDATE_HOT_KEYS_WBC_CUSTOM:
   `UPDATE TB_HOT_KEY
     SET CLASS_TITLE = ?
      , CLASS_NM = ?
    WHERE HOT_KEY_TYPE = ?
      AND CLASS_ID = ?`,

   INSERT_DEFAULT_HOT_KEY:
   `INSERT OR IGNORE INTO TB_HOT_KEY
     VALUES ('01', '01', 'NE', 'Neutrophil',         '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '71', 'NS', 'Neutrophil-Segmented',  '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '72', 'NB', 'Neutrophil-Band',       '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '02', 'ME', 'Metamyelocyte',         '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '03', 'MY', 'Myelocyte',             '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '04', 'PR', 'Promyelocyte',          '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '05', 'LY', 'Lymphocyte',            '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '61', 'LR', 'Reactive lymphocyte',   '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '62', 'LA', 'Abnormal lymphocyte',   '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '07', 'MO', 'Monocyte',              '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '08', 'EO', 'Eosinophil',            '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '09', 'BA', 'Basophil',              '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '10', 'BL', 'Blast',                 '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '11', 'PC', 'Plasma cell',           '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '12', 'NR', 'nRBC',                  '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '13', 'GP', 'Giant platelet',        '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '14', 'PA', 'Platelet aggregation',  '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '16', 'MA', 'Malaria',               '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '15', 'AR', 'Artifact(Smudge)',      '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '90', '', '',                        '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '91', '', '',                        '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '92', '', '',                        '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '93', '', '',                        '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('01', '94', '', '',                        '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '01', 'NE', 'Neutrophil',            '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '71', 'NS', 'Neutrophil-Segmented',  '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '72', 'NB', 'Neutrophil-Band',       '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '02', 'ME', 'Metamyelocyte',         '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '03', 'MY', 'Myelocyte',             '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '04', 'PR', 'Promyelocyte',          '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '05', 'LY', 'Lymphocyte',            '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '06', 'LA', 'Abnormal lymphocyte',   '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '07', 'MO', 'Monocyte',              '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '08', 'EO', 'Eosinophil',            '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '09', 'BA', 'Basophil',              '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '10', 'BL', 'Blast',                 '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '11', 'PC', 'Plasma cell',           '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '12', 'ON', 'Orthochromic Normoblast',      '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '13', 'PN', 'Polychromic Normoblast',       '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '14', 'BN', 'Basophilic Normoblast',        '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '15', 'PE', 'Proerythroblast',              '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '16', 'HC', 'Histiocyte',                   '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
       , ('02', '17', 'OT', 'Others',                       '', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')`,

    SELECT_LIS_CODE:
    `SELECT
       IA_CD
       , LIS_CD
       , CD_NM
       , TEST_TYPE
     FROM TB_LIS_TEST_CODE
     WHERE 1=1`,

    INSERT_CBC_CODE:
    `INSERT OR REPLACE INTO TB_CBC_TEST_CODE
     (IA_CD
       , CBC_CD
       , CD_NM
       , IS_SELECTED
       , CREATE_DTTM
       , CREATE_ID
       , MODIFY_DTTM
       , MODIFY_ID)
    VALUES(?,?,?,?,?,?,?,?)`,

    SELECT_CBC_CODE:
    `SELECT
      IA_CD
      , CBC_CD
      , CD_NM
      , IS_SELECTED
    FROM TB_CBC_TEST_CODE
    WHERE 1=1`,

    SELECT_LIS_CONN_PATH:
    `SELECT
      DEVICE_BARCODE
      , LIS_FILE_PATH
      , LIS_URL
      , LIS_CONN_TYPE_CD
      , CBC_FILE_PATH
      , CBC_URL
      , CBC_CONN_TYPE_CD
    FROM TB_LIS_CONN_PATH
    WHERE 1=1
      AND DEVICE_BARCODE = ?`,

    UPDATE_LIS_CONN_PATH:
    `INSERT OR REPLACE INTO TB_LIS_CONN_PATH
      (DEVICE_BARCODE
        , LIS_FILE_PATH
        , LIS_URL
        , LIS_CONN_TYPE_CD
        , CBC_FILE_PATH
        , CBC_URL
        , CBC_CONN_TYPE_CD
        , CREATE_DTTM
        , CREATE_ID
        , MODIFY_DTTM
        , MODIFY_ID)
    VALUES(?,?,?,?,?,?,?,?,?,?,?)`,

   INSERT_LIS_CODE:
   `INSERT OR REPLACE INTO TB_LIS_TEST_CODE
    (IA_CD
      , LIS_CD
      , CD_NM
      , TEST_TYPE
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID)
    VALUES(?,?,?,?,?,?,?,?)`,

  SELECT_BACKUP_LIST:
  `SELECT *
    FROM TB_TEST_HISTORY
   WHERE 1=1
    AND SUBSTR(ANALYZE_DTTM, 1, 8) BETWEEN REPLACE(?, '-', '') AND REPLACE(?, '-', '')`,

  DELETE_BACKUP_TEST_HISTORY:
  `DELETE
    FROM TB_TEST_HISTORY
   WHERE CASSET_ID = ?
    AND SLOT_ID = ?
    AND ORDER_ID = ?`,

  INSERT_BACKUP_HIST:
  `INSERT INTO TB_BACKUP_HIST
    (
      CASSET_ID
      , SLOT_ID
      , ORDER_ID
      , IS_BACKUP
      , BACKUP_DTTM
      , RESTORE_DTTM
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
    )
   VALUES(?,?,?,?,?,?,?,?,?,?)`,

  SELECT_WBC_CLASSIFICATION_HIST:
  `SELECT
     CASSET_ID
     , SLOT_ID
     , ORDER_ID
     , CLASS_ID
     , CLASS_NM
     , CLASS_TITLE
     , COUNT
     , CREATE_DTTM
     , CREATE_ID
     , MODIFY_DTTM
     , MODIFY_ID
  FROM TB_WBC_CLASSIFICATION_HIST
   WHERE SLOT_ID = ?`,

  SELECT_NORMAL_RANGE:
  `SELECT ANALYSIS_TYPE
      , CLASS_ID
      , CLASS_TITLE
      , CLASS_NM
      , MIN
      , MAX
      , UNIT
      , CREATE_DTTM
      , CREATE_ID
      , MODIFY_DTTM
      , MODIFY_ID
    FROM TB_NORMAL_RANGE
   WHERE 1=1`,

  UPDATE_NORMAL_RANGE:
  `UPDATE TB_NORMAL_RANGE
    SET MIN = ?
      , MAX = ?
      , UNIT = ?
   WHERE ANALYSIS_TYPE = ?
     AND CLASS_ID = ?`,

  INSERT_DEFAULT_NORMAL_RANAGE:
  `INSERT OR IGNORE INTO TB_NORMAL_RANGE
    VALUES ('01', '01', 'NE', 'Neutrophil', '42', '85', '%', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '02', 'ME', 'Metamyelocyte', '0', '100', '%', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '03', 'MY', 'Myelocyte', '0', '100', '%', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '04', 'PR', 'Promyelocyte', '0', '100', '%', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '05', 'LY', 'Lymphocyte', '11', '49', '%', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '61', 'LR', 'Reactive lymphocyte', '0', '100', '%', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '62', 'LA', 'Abnormal lymphocyte', '0', '100', '%', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '07', 'MO', 'Monocyte', '0', '9', '%', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '08', 'EO', 'Eosinophil', '0', '6', '%', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '09', 'BA', 'Basophil', '0', '2', '%', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '10', 'BL', 'Blast', '0', '100', '%', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '11', 'PC', 'Plasma cell', '0', '100', '%', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '12', 'NR', 'nRBC', '0', '100', 'Count', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '13', 'GP', 'Giant platelet', '0', '100', 'Count', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '14', 'PA', 'Platelet aggregation', '0', '100', 'Count', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '15', 'AR', 'Artifact(Smudge)', '0', '100', 'Count', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')
      , ('01', '16', 'MA', 'Malaria', '0', '100', 'Count', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM', strftime('%Y%m%d%H%M%S', 'now'), 'SYSTEM')`
})
