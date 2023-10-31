// 공통 코드 정의
const state = {
  pbTreedata: null,
  bmTreedata: null,
  diagTree: [{
    name: 'RBC Size',
    id: '01',
    disabled: true,
    children: [{
      id: '01_01',
      name: 'Normal',
      disabled: true,
      isUserInput: true
    }, {
      id: '01_02',
      name: 'Microcyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '01_03',
      name: 'Macrocyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '01_04',
      name: 'Anisocytosis',
      disabled: true,
      isUserInput: true
    }]
  }, {
    name: 'RBC Chromia',
    id: '02',
    disabled: true,
    children: [{
      id: '02_01',
      name: 'Normal',
      disabled: true,
      isUserInput: true
    }, {
      id: '02_02',
      name: 'Hypochromia',
      disabled: true,
      isUserInput: true
    }, {
      id: '02_03',
      name: 'Hyperchromia',
      disabled: true,
      isUserInput: true
    }, {
      id: '02_04',
      name: 'Polychromia',
      disabled: true,
      isUserInput: true
    }]
  }, {
    name: 'RBC Shape',
    id: '03',
    disabled: false,
    children: [{
      id: '03_01',
      name: 'Normal',
      disabled: true,
      isUserInput: true
    }, {
      id: '03_02',
      name: 'Poikilocytosis',
      disabled: true,
      isUserInput: true
    }, {
      id: '03_03',
      name: 'Target Cell',
      disabled: true,
      isUserInput: true
    }, {
      id: '03_04',
      name: 'Burr Cell',
      disabled: true,
      isUserInput: true
    }, {
      id: '03_05',
      name: 'Ovalocyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '03_06',
      name: 'Schistocyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '03_07',
      name: 'Sickle Cell',
      disabled: true,
      isUserInput: true
    }, {
      id: '03_08',
      name: 'Stomatocyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '03_09',
      name: 'Tear Drop Cell',
      disabled: true,
      isUserInput: true
    }, {
      id: '03_10',
      name: 'Spherocyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '03_11',
      name: 'Dimorphism',
      disabled: false,
      isUserInput: true
    }]
  }, {
    name: 'RBC inclusion body',
    id: '05',
    disabled: true,
    children: [{
      id: '05_01',
      name: 'Howell-Jolly bodies',
      disabled: true,
      isUserInput: true
    }, {
      id: '05_02',
      name: 'Basophilic stippling',
      disabled: true,
      isUserInput: true
    }, {
      id: '05_03',
      name: 'Malaria',
      disabled: true,
      isUserInput: true
    }, {
      id: '05_04',
      name: 'Platelets',
      disabled: true,
      isUserInput: true
    }]
  }, {
    name: 'RBC distribution',
    id: '06',
    disabled: false,
    children: [{
      id: '06_01',
      name: 'Normal',
      disabled: false,
      isUserInput: false
    }, {
      id: '06_02',
      name: 'Rouleaux formation',
      disabled: false,
      isUserInput: false
    }, {
      id: '06_03',
      name: 'Agglutination',
      disabled: false,
      isUserInput: false
    }]
  }, {
    name: 'WBC Classification',
    id: '07',
    disabled: true,
    children: [{
      id: '07_01',
      name: 'Neutrophil',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_71',
      name: 'Neutrophil-Segmented',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_72',
      name: 'Neutrophil-Band',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_02',
      name: 'Metamyelocyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_03',
      name: 'Myelocyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_04',
      name: 'Promyelocyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_05',
      name: 'Lymphocyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_61',
      name: 'Reactive lymphocyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_62',
      name: 'Abnormal lymphocyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_07',
      name: 'Monocyte',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_08',
      name: 'Eosinophil',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_09',
      name: 'Basophil',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_10',
      name: 'Blast',
      disabled: true,
      isUserInput: true
    }, {
      id: '07_11',
      disabled: true,
      name: 'Plasma cell',
      isUserInput: true
    }, {
      id: '07_12',
      disabled: true,
      name: 'nRBC',
      isUserInput: true
    }, {
      id: '07_13',
      disabled: true,
      name: 'Giant platelet',
      isUserInput: true
    }, {
      id: '07_14',
      disabled: true,
      name: 'Platelet aggregation',
      isUserInput: true
    }, {
      id: '07_16',
      disabled: true,
      name: 'Malaria',
      isUserInput: true
    }, {
      id: '07_15',
      disabled: true,
      name: 'Artifact(Smudge)',
      isUserInput: true
    }]
  }, {
    id: '08',
    name: 'Blast Option',
    children: [{
      id: '08_01',
      name: 'Pure erythroid leukemia 30% 이상 all BM Cell;Immature erythroid, PE>30%',
      isUserInput: false
    }, {
      id: '08_02',
      name: 'APL cell +',
      isUserInput: false
    }, {
      id: '08_03',
      name: 'Blast가 20%<=&Burkitt cell이 blast 의 50%이상',
      isUserInput: false
    }, {
      id: '08_04',
      name: 'Blast 20%<=& blast의 20%<=dl MK blast 형태',
      isUserInput: false
    }, {
      id: '08_05',
      name: 'Auer rod +',
      isUserInput: false
    }]
  }, {
    id: '09',
    name: 'Neutrophil Morphology',
    children: [{
      id: '09_01',
      name: 'Toxic Neutrophil',
      isUserInput: false
    }, {
      id: '09_02',
      name: 'Dysplastic Neutrophil',
      isUserInput: false
    }, {
      id: '09_03',
      name: 'Hypersegmented Neutrophil',
      isUserInput: false
    }, {
      id: '09_04',
      name: 'Left shift',
      isUserInput: false
    }]
  },
  // {
  //   id: '09',
  //   name: 'PLT',
  //   children: [{
  //     id: '09_01',
  //     name: 'Normal(15-45만) RBC count의 7-15%',
  //     isUserInput: false
  //   }, {
  //     id: '09_02',
  //     name: 'Decreaed(<15만)<RBC count의 7%',
  //     isUserInput: false
  //   }, {
  //     id: '09_03',
  //     name: 'Increased(45-100만)>RBC count의 15%',
  //     isUserInput: false
  //   }, {
  //     id: '09_04',
  //     name: '>100만',
  //     isUserInput: false
  //   }]
  // },
  {
    id: '10',
    name: 'Past History',
    children: [{
      id: '10_01',
      name: 'MDS',
      isUserInput: false
    }, {
      id: '10_02',
      name: 'AML(Erythroleukemia 포함)',
      isUserInput: false
    }, {
      id: '10_03',
      name: 'ALL',
      isUserInput: false
    }, {
      id: '10_04',
      name: 'CML',
      isUserInput: false
    }, {
      id: '10_05',
      name: 'CLL',
      isUserInput: false
    }, {
      id: '10_06',
      name: 'Plasma cell myeloma',
      isUserInput: false
    }, {
      id: '10_07',
      name: 'CMML',
      isUserInput: false
    }, {
      id: '10_08',
      name: 'PV',
      isUserInput: false
    }, {
      id: '10_09',
      name: 'ET',
      isUserInput: false
    }, {
      id: '10_10',
      name: 'PMF',
      isUserInput: false
    }, {
      id: '10_11',
      name: 'HLH',
      isUserInput: false
    }, {
      id: '10_12',
      name: 'Malignant lymphoma',
      isUserInput: false
    }, {
      id: '10_13',
      name: 'Malignant tumor of other organ',
      isUserInput: false
    }, {
      id: '10_14',
      name: 'Aplastic anemia',
      isUserInput: false
    }, {
      id: '10_15',
      name: 'Hereditary spherocytosis',
      isUserInput: false
    }, {
      id: '10_16',
      name: 'Autoimmune hemolytic anemia',
      isUserInput: false
    }, {
      id: '10_17',
      name: 'DIC or TTP',
      isUserInput: false
    }, {
      id: '10_18',
      name: 'PRA',
      isUserInput: false
    }, {
      id: '10_19',
      name: 'Sepsis',
      isUserInput: false
    }, {
      id: '10_20',
      name: 'Viral infection',
      isUserInput: false
    }, {
      id: '10_21',
      name: 'APL',
      isUserInput: false
    }, {
      id: '10_22',
      name: 'AMoL',
      isUserInput: false
    }, {
      id: '10_23',
      name: 'AMegakaryoL',
      isUserInput: false
    }, {
      id: '10_24',
      name: 'Burkitt lymphoma',
      isUserInput: false
    }, {
      id: '10_25',
      name: 'Chemotherapy for leukemia or other malignancy',
      isUserInput: false
    }, {
      id: '10_26',
      name: 'HSCT',
      isUserInput: false
    }]
  }, {
    id: '11',
    name: 'Present clinical impression',
    children: [{
      id: '11_01',
      name: 'Acute leukemia after chemotherapy',
      isUserInput: false
    }, {
      id: '11_02',
      name: 'CR of acute leukemia',
      isUserInput: false
    }, {
      id: '11_03',
      name: 'Relapse of acute leukemia',
      isUserInput: false
    }, {
      id: '11_04',
      name: 'Acute leukemia after HSCT',
      isUserInput: false
    }, {
      id: '11_05',
      name: 'MDS after chemotherpy',
      isUserInput: false
    }, {
      id: '11_06',
      name: 'Transformation to AML',
      isUserInput: false
    }, {
      id: '11_07',
      name: 'MDS after HSCT',
      isUserInput: false
    }, {
      id: '11_08',
      name: 'CML after chemotherapy',
      isUserInput: false
    }, {
      id: '11_09',
      name: 'Transformation to blast phase',
      isUserInput: false
    }, {
      id: '11_10',
      name: 'CML after HSCT',
      isUserInput: false
    }, {
      id: '11_11',
      name: 'Post HSCT for other disease',
      isUserInput: false
    }, {
      id: '11_12',
      name: 'After chemotherapy for other disease',
      isUserInput: false
    }, {
      id: '11_13',
      name: 'Staging of malignant lymphoma',
      isUserInput: false
    }, {
      id: '11_14',
      name: 'Fever',
      isUserInput: false
    }, {
      id: '11_15',
      name: 'Bleeding',
      isUserInput: false
    }, {
      id: '11_16',
      name: 'Anemia',
      isUserInput: false
    }, {
      id: '11_17',
      name: 'Pancytopenia',
      isUserInput: false
    }, {
      id: '11_18',
      name: 'Leukocytosis',
      isUserInput: false
    }, {
      id: '11_19',
      name: 'Leukopenia',
      isUserInput: false
    }, {
      id: '11_20',
      name: 'Thrombocytosis',
      isUserInput: false
    }, {
      id: '11_21',
      name: 'Thrombocytopenia',
      isUserInput: false
    }, {
      id: '11_22',
      name: 'PB blasts(>1%)',
      isUserInput: false
    }, {
      id: '11_23',
      name: 'CLL',
      isUserInput: false
    }, {
      id: '11_24',
      name: 'HS',
      isUserInput: false
    }, {
      id: '11_25',
      name: 'HLH',
      isUserInput: false
    }, {
      id: '11_26',
      name: 'PV',
      isUserInput: false
    }, {
      id: '11_27',
      name: 'MM',
      isUserInput: false
    }, {
      id: '11_28',
      name: 'Staging of nonhematopoietic malignancy',
      isUserInput: false
    }]
  }],

  diagBmTree: [
  // {
  //   id: '07',
  //   name: 'Cellularity',
  //   disabled: false,
  //   isUserInput: true,
  //   children: []
  // },
  {
    id: '08',
    name: 'M:E ratio',
    disabled: true,
    isUserInput: true,
    children: []
  }, {
    id: '09',
    name: 'Blast count',
    children: [{
      id: '09_01',
      name: '20%<=&blast의 20%<MK lineage형태',
      isUserInput: false
    }, {
      id: '09_02',
      name: 'Blast의 50%<Burkitt 형태',
      isUserInput: false
    }, {
      id: '09_03',
      name: 'APL cell+',
      isUserInput: false
    }]
  }, {
    id: '10',
    name: 'BM biopsy/clot section',
    children: [{
      id: '10_01',
      name: 'Normal',
      isUserInput: false
    }, {
      id: '10_02',
      name: 'Hypocellularity',
      isUserInput: false
    }, {
      id: '10_03',
      name: 'Hypercellularity',
      isUserInput: false
    }, {
      id: '10_04',
      name: 'Lymphoma involvement +',
      isUserInput: false
    }, {
      id: '10_05',
      name: 'Fibrosis',
      isUserInput: false
    }, {
      id: '10_06',
      name: 'Tumor metastasis',
      isUserInput: false
    }, {
      id: '10_07',
      name: 'Diffuse necrosis',
      isUserInput: false
    }]
  }, {
    id: '11',
    name: 'Megakaryocyte',
    children: [{
      id: '11_01',
      name: 'bm',
      isUserInput: false,
      children: [{
        id: '11_01_01',
        name: 'N megakaryo 0.1-1%',
        isUserInput: false
      }, {
        id: '11_01_02',
        name: 'no megakaryocyte',
        isUserInput: false
      },{
        id: '11_01_03',
        name: 'megakaryocytosis >= 1%',
        isUserInput: false
      }]
    }, {
      id: '11_02',
      name: 'bm biopsy or clot section',
      isUserInput: false,
      children: [{
        id: '11_02_01',
        name: 'Normal',
        isUserInput: false
      }, {
        id: '11_02_02',
        name: 'Decreased or No',
        isUserInput: false
      }, {
        id: '11_02_03',
        name: 'Increased',
        isUserInput: false
      }, {
        id: '11_02_04',
        name: 'Increased size and hyperlobated MK',
        isUserInput: false
      }]
    }]
    // children: [{
    //   id: '11_01',
    //   name: 'Normal',
    //   isUserInput: false
    // }, {
    //   id: '11_02',
    //   name: 'Decreased or No',
    //   isUserInput: false
    // }, {
    //   id: '11_03',
    //   name: 'Increased',
    //   isUserInput: false
    // }, {
    //   id: '11_04',
    //   name: 'Increased size and hyperlobated MK',
    //   isUserInput: false
    // }]
  }, {
    id: '12',
    name: 'BM iron stain',
    children: [{
      id: '12_01',
      name: 'Normal or increased with<5% (Ring siderblasts)',
      isUserInput: false
    }, {
      id: '12_02',
      name: 'No iron pigment',
      isUserInput: false
    }, {
      id: '12_03',
      name: '5-15% of E in BM ; ring sideroblasts - possible MDS-RS',
      isUserInput: false
    }, {
      id: '12_04',
      name: 'RS>15% of E in BM ; ring sideroblasts MDS-RS',
      isUserInput: false
    }]
  }, {
    id: '13',
    name: 'BM dysplasia',
    children: [{
      id: '13_01',
      name: 'Only erythroid dysplasia',
      isUserInput: false
    }, {
      id: '13_02',
      name: 'Only Myeloid dysplasia',
      isUserInput: false
    }, {
      id: '13_03',
      name: 'Only Megakaryocytic dysplasia',
      isUserInput: false
    }, {
      id: '13_04',
      name: '50%<MK with nonlolobated nucleus',
      isUserInput: false
    }]
  }, {
    id: '14',
    name: 'BM Cell Classification',
    disabled: true,
    children: [{
      id: '14_01',
      name: 'Neutrophil',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_02',
      name: 'Metamyelocyte',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_03',
      name: 'Myelocyte',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_04',
      name: 'Promyelocyte',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_05',
      name: 'Lymphocyte',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_06',
      name: 'Abnormal lymphocyte',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_07',
      name: 'Monocyte',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_08',
      name: 'Eosinophil',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_09',
      name: 'Basophil',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_10',
      name: 'Blast',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_11',
      name: 'Plasma cell',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_12',
      name: 'Orthochromic normoblast',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_13',
      name: 'Polychromic normoblast',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_14',
      name: 'Basophilic normoblast',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_15',
      name: 'Proerythroblast',
      isUserInput: true,
      disabled: true
    }, {
      id: '14_16',
      name: 'Others',
      isUserInput: true,
      disabled: true
    }]
  }]
}

const mutations = {
  DIAG_UPDATE_RBC_DEGREE (state, obj) {
    state.diagTree.forEach(function(root) {
      root.children.forEach(function(child) {
        if (child.id === obj.id) {
          child.degree = obj.degree
        }
      })
    })
  },
  SET_PB_TREE_DATA (state, obj) {
    state.pbTreedata = obj
  },
  SET_BM_TREE_DATA (state, obj) {
    state.bmTreedata = obj
  },
  DIAG_UPDATE_INPUT (state, obj) {
    state.bmTreedata.forEach(function(root) {
      root.children.forEach(function(child) {
        if (child.id === obj.id) {
          child.degree = obj.degree
        }
      })
    })
  }
}

const actions = {
  diagUpdateRbcDegree: (context, obj) => {
    context.commit('DIAG_UPDATE_RBC_DEGREE', obj)
  },
  setPbTreeData: (context, obj) => {
    context.commit('SET_PB_TREE_DATA', obj)
  },
  setBmTreeData: (context, obj) => {
    context.commit('SET_BM_TREE_DATA', obj)
  },
  diagUpdateInput: (context, obj) => {
    context.commit('DIAG_UPDATE_INPUT', obj)
  }
}

const getters = {
  getPbTree: (state) => {
    return state.diagTree
  },
  getBmTree: (state) => {
    return state.diagBmTree
  },
  getPbTreeData: (state) => {
    return state.pbTreedata
  },
  getBmTreeData: (state) => {
    return state.bmTreedata
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
