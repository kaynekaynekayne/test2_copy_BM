<template>
  <b-container id="settingPage" class="pl-2 pt-2 pb-2" fluid>

    <!-- <b-card class="blackCard h-100 w-50" text-variant="white" no-body>
      <div id="title" class="panelTitle">Image path</div>
      <b-row class="mt-3">
        <b-col class="panelSubTitle pt-1 pl-5" cols="4">
          PB-IA Root directory
        </b-col>
        <b-col>
          <input type="text" class="w-100" v-model="pbiaRootPath" @click="onFileSelectorClick('pbiaRootPath')" readonly />
        </b-col>
      </b-row>
    </b-card> -->
    <b-row>
      <b-col cols="3">
        <div>
          <div class="collapseListTitle" :class="{collapseListTitleOpen : isOpenUserSetting}" v-b-toggle.userSetting>
            User Setting
            <span class="text-right" style="float: right; padding-right: 10px;">
              <b-icon v-if="!isOpenUserSetting" icon="caret-right" style="margin-top: 8px;"></b-icon>
              <b-icon v-else icon="caret-down" style="margin-top: 8px;"></b-icon>
            </span>
          </div>
          <b-collapse id="userSetting" accordion="userSetting" role="tabpanel" v-model="isOpenUserSetting"
            @shown="shown"
            @hidden="hidden">
            <div v-for="item in subMenus"
              :id="'sub' + item.id"
              :key="item.id"
              class="collapseListSubTitle pointer"
              @click="onClickSubMenu(item)">
              {{ item.title }}
            </div>
          </b-collapse>
        </div>
        <!-- 엔지니어 모드 -->
        <!-- <div class="collapseListTitle" v-b-toggle.adminSetting>
          Administrate Setting
          <span class="text-right" style="float: right; padding-right: 10px;">
            <b-icon v-if="!isAdminSetting" icon="caret-right" style="margin-top: 8px;"></b-icon>
            <b-icon v-else icon="caret-down" style="margin-top: 8px;"></b-icon>
          </span>
        </div>
        <b-collapse id="adminSetting" accordion="adminSetting" role="tabpanel" v-model="isAdminSetting"
          @shown="shown"
          @hidden="hidden">
        </b-collapse> -->
      </b-col>
      <b-col>
        <transition name="fade">
          <div v-if="selectedItemId === 1" style="overflow-y: auto; overflow-x: hidden; height: 920px;">
            <div class="p-2 border borderColorGray">
              <b-row class="pl-3">
                <b-col cols="2" class="p-0">
                  <b-form-select v-model="modelSearchUserType" :options="searchUserType" size="sm"></b-form-select>
                </b-col>
                <b-col cols="2" class="p-0">
                  <b-form-input v-model="searchText" size="sm" style="border: none !important;"></b-form-input>
                </b-col>
                <b-col cols="1">
                  <button type="button" id="btnSearch" class="btn btn-outline-light" @click="onSearchUser">Search</button>
                </b-col>
                <b-col>
                  <img class="pointer" src="~@/assets/result/excel.png"
                    @click="onDownloadLog('saveUsers')"
                    style="width: 30px;"/>
                </b-col>
              </b-row>
            </div>
            <table class="w-100">
              <tr class="border-bottom borderColorGray">
                <th v-for="field in accountFileds" class="pb-2 text-center" style="font-size: 13px; font-weight: bold;">
                  {{ field }}
                </th>
              </tr>
              <tr v-for="(item, index) in dspUserList" :key="index" height="35" style="font-size: 13px;">
                <td class="text-center borderColorGray colorWhite" style="width: 40px;">{{ index + 1 }}</td>
                <td class="text-center borderColorGray colorWhite" style="width: 40px;">{{ getCommonCode('01', item.authCd).cdNm }}</td>
                <td class="text-center borderColorGray colorWhite" style="width: 40px;">{{ item.userId }}</td>
                <td class="text-center borderColorGray colorWhite" style="width: 40px;">{{ item.userName }}</td>
                <td class="text-center borderColorGray colorWhite" style="width: 40px;">{{ $stringToDateTime(item.createDttm) }}</td>
                <td class="text-center borderColorGray colorWhite" style="width: 40px;">{{ $stringToDateTime(item.loginDttm) }}</td>
                <td class="text-center borderColorGray colorWhite" style="width: 40px;">{{ item.isAvailable}}</td>
                <td v-if="currentUser.authCd === '02' || currentUser.authCd === '03'"
                  class="text-center borderColorGray colorWhite pointer" @click="onClickEdit(item)"
                  style="width: 40px;">
                  <b-icon icon="pencil"></b-icon>
                </td>
                <td v-if="(currentUser.authCd === '02' || currentUser.authCd === '03') && currentUser.userId !== item.userId"
                  class="text-center borderColorGray colorWhite pointer" @click="onClickDelete(item)"
                  style="width: 40px;">
                  <b-icon icon="trash"></b-icon>
                </td>
              </tr>
            </table>
          </div>
        </transition>
        <transition name="fade">
          <div v-if="selectedItemId === 2" style="overflow-y: scroll; overflow-x: hidden; height: 900px;">
            <div class="panelTitle colorWhite" style="width: 250px;">
              Cell image analyzed
            </div>

            <b-row class="mt-2">
              <b-col cols="2">
                <div>
                  PB analysis values
                </div>
              </b-col>
              <b-col cols="5">
                <b-row>
                  <b-col cols="4" class="p-0">
                    Position margin:
                  </b-col>
                  <b-col>
                    <b-form-select v-model="positionMargin" :options="PositionMarginList" size="sm" @change="onChangeSelect"></b-form-select>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <!-- <b-row class="mt-2">
              <b-col cols="2">
                <div>
                  BF analysis values
                </div>
              </b-col>
              <b-col cols="5">
                <b-row>
                  <b-col cols="4" class="p-0">
                    Cell analyzing count:
                  </b-col>
                  <b-col>
                    <b-form-select v-model="bfAnalysisType" :options="AnalysisList" size="sm" @change="onChangeSelect"></b-form-select>
                  </b-col>
                </b-row>
              </b-col>
            </b-row> -->
            <b-row class="mt-2">
              <b-col cols="2">
                <div>
                  IA root path
                </div>
              </b-col>
              <b-col cols="5" class="pl-0">
                <b-form-input type="text" size="sm" v-model="pbiaRootPath" readonly @click="onFileSelectorClick('pbiaRootPath')">
                </b-form-input>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col cols="2">
                <div>
                  NS/NB Integration
                </div>
              </b-col>
              <b-col cols="5" class="pl-0">
                <b-form-checkbox v-model="isNsNbIntegration" switch size="lg" @change="onChangeNsNb">
                </b-form-checkbox>
              </b-col>
            </b-row>
            <div class="panelTitle colorWhite mt-5" style="width: 250px;">
              Device controls
            </div>
            <b-row class="mt-2">
              <b-col>
                <b-row>
                  <b-col cols="2">
                    <div>
                      Gripper open &nbsp&nbsp
                      <b-button variant="outline-primary" size="sm" @click="onGripperOpen">OK</b-button>
                    </div>
                  </b-col>
                  <b-col cols="2">
                    <div>
                      Camera Reset &nbsp&nbsp
                      <b-button variant="outline-primary" size="sm" @click="onCameraReset">OK</b-button>
                    </div>
                  </b-col>
                  <b-col cols="3">
                    <div>
                      Charge remaining count &nbsp &nbsp
                      <b-button variant="outline-primary" size="sm" @click="onBarcodeScan">Scan</b-button>
                    </div>
                  </b-col>
                </b-row>

                <!-- backup and restore -->
                <div class="panelTitle colorWhite mt-5" style="width: 250px;">
                  Backup and Restore
                </div>
                <b-row class="mt-2">
                  <b-col>
                    <b-row>
                      <b-col cols="2">
                        <b-form-input type="text" size="sm" placeholder="backup path" v-model="backupPath" readonly @click="onFileSelectorClick('backupPath')">
                        </b-form-input>
                      </b-col>
                      <b-col cols="2">
                        <b-form-datepicker
                          id="backupStartDate"
                          size="sm"
                          v-model="backupStartDate"
                          placeholder="Start date"
                          dropup
                          :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
                        ></b-form-datepicker>
                      </b-col>
                      <span class="mt-1">~</span>
                      <b-col cols="2">
                        <b-form-datepicker
                          id="backupEndDate"
                          size="sm"
                          v-model="backupEndDate"
                          placeholder="End date"
                          dropup
                          :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
                        ></b-form-datepicker>
                      </b-col>
                      <b-col cols="1" class="text-left pl-0">
                        <b-button variant="outline-primary" size="sm" @click="onBackup">Backup</b-button>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <b-row class="mt-2">
                  <b-col>
                    <b-row>
                      <b-col cols="4">
                        <b-form-input type="text" size="sm" placeholder="Select a backup file" v-model="restoreFile" readonly @click="onOpenRestoreDialog('restorePath')">
                        </b-form-input>
                      </b-col>
                      <b-col cols="1">
                        <b-button variant="outline-primary" size="sm" @click="onRestore">Restore</b-button>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>

                <!-- WBC Custom class -->
                <div v-b-toggle.collapse-1 class="panelTitle colorWhite mt-5" style="width: 350px;">
                  <b-row>
                    <b-col cols="9">
                      WBC Custom Class
                    </b-col>
                    <b-col class="text-right">
                      <b-icon icon="arrow-down-circle"></b-icon>
                    </b-col>
                  </b-row>
                </div>
                <b-collapse id="collapse-1">
                  <b-row class="mt-2" v-for="wbcCustom in wbcCustomClass" :key="wbcCustom.CLASS_ID">
                    <b-col cols="1">
                      <div>ID: {{ wbcCustom.CLASS_ID }}</div>
                    </b-col>
                    <b-col cols="2">
                      <b-form-input type="text" size="sm" maxlength="2" v-model="wbcCustom.CLASS_TITLE" placeholder="abbreviation">
                      </b-form-input>
                    </b-col>
                    <b-col cols="4">
                      <b-form-input type="text" size="sm" maxlength="30" v-model="wbcCustom.CLASS_NM" placeholder="class name">
                      </b-form-input>
                    </b-col>
                  </b-row>
                  <b-row class="mt-2">
                    <b-col cols="7">
                      <div>
                        <b-button block variant="outline-primary" size="sm" @click="onClassSave">Save</b-button>
                      </div>
                    </b-col>
                  </b-row>
                </b-collapse>

                <div v-b-toggle.collapse-2 class="panelTitle colorWhite mt-5" style="width: 350px;">
                  <b-row>
                    <b-col cols="9">
                      WBC Hot Keys
                    </b-col>
                    <b-col class="text-right">
                      <b-icon icon="arrow-down-circle"></b-icon>
                    </b-col>
                  </b-row>
                </div>
                <b-collapse id="collapse-2">
                  <b-row class="mt-2" v-for="(key, index) in hotKeyClassList" :key="'wbc' + index">
                    <b-col cols="1">
                      {{ key.CLASS_TITLE }}
                    </b-col>
                    <b-col cols="2">
                      {{ key.CLASS_NM }}
                    </b-col>
                    <b-col cols="4">
                      <b-form-input type="text" size="sm" maxlength="1" v-model="key.HOT_KEY" @keyup="onWbcKeyUp(key)">
                      </b-form-input>
                    </b-col>
                  </b-row>
                </b-collapse>

                <div v-b-toggle.collapse-3 class="panelTitle colorWhite mt-5" style="width: 350px;">
                  <b-row>
                    <b-col cols="9">
                      BM Hot Keys
                    </b-col>
                    <b-col class="text-right">
                      <b-icon icon="arrow-down-circle"></b-icon>
                    </b-col>
                  </b-row>
                </div>
                <b-collapse id="collapse-3">
                  <b-row class="mt-2" v-for="(key, index) in bmHotKeyClassList" :key="'wbc' + index">
                    <b-col cols="1">
                      {{ key.CLASS_TITLE }}
                    </b-col>
                    <b-col cols="2">
                      {{ key.CLASS_NM }}
                    </b-col>
                    <b-col cols="4">
                      <b-form-input type="text" size="sm" maxlength="1" v-model="key.HOT_KEY" @keyup="onBmKeyUp(key)">
                      </b-form-input>
                    </b-col>
                  </b-row>
                </b-collapse>

                <div v-b-toggle.collapse-4 class="panelTitle colorWhite mt-5" style="width: 350px;">
                  <b-row>
                    <b-col cols="9">
                      RBC Degree
                    </b-col>
                    <b-col class="text-right">
                      <b-icon icon="arrow-down-circle"></b-icon>
                    </b-col>
                  </b-row>
                </div>
                <b-collapse id="collapse-4">
                  <b-row class="mt-2" v-for="(category, index) in rbcClassList" :key="'rbc' + index">
                    <b-col cols="2">
                      {{ category.categoryNm }}
                    </b-col>
                    <b-col cols="10">
                      <b-row v-for="(classItem, classIndex) in category.classInfo" :key="classIndex">
                        <b-col cols="3">
                          {{ classItem.classNm }}
                        </b-col>
                        <b-col cols="3"
                          v-if="(category.categoryId === '01' && classItem.classId !== '01') ||
                            (category.categoryId === '02' && (classItem.classId !== '01')) ||
                            (category.categoryId === '03' && ((classItem.classId !== '01') && (classItem.classId !== '02')) ||
                            (category.categoryId === '05')
                            )">
                          <vue-slider
                            v-model="classItem.sliderValue"
                            :max="30"
                            :interval="0.5"
                            ref="slider"
                            @change="onChangeSlider(category.categoryId, classItem)"
                            ></vue-slider>
                        </b-col>
                        <b-col v-if="(category.categoryId === '01' && classItem.classId !== '01') ||
                          (category.categoryId === '02' && (classItem.classId !== '01')) ||
                          (category.categoryId === '03' && ((classItem.classId !== '01') && (classItem.classId !== '02')) ||
                          (category.categoryId === '05')
                          )">
                          <label>{{classItem.sliderValue}}</label>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                  <b-row class="mt-2">
                    <b-col cols="7">
                      <b-button block variant="outline-primary" size="sm" @click="onResetDegree">Reset</b-button>
                    </b-col>
                  </b-row>
                </b-collapse>

                <div v-b-toggle.collapse-5 class="panelTitle colorWhite mt-5" style="width: 350px;">
                  <b-row>
                    <b-col cols="9">
                      WBC Normal Range
                    </b-col>
                    <b-col class="text-right">
                      <b-icon icon="arrow-down-circle"></b-icon>
                    </b-col>
                  </b-row>
                </div>
                <b-collapse id="collapse-5">
                  <b-row class="mt-2" v-for="(range, index) in wbcNormalRange" :key="'wbc' + index">
                    <b-col cols="1">
                      {{ range.classTitle }}
                    </b-col>
                    <b-col cols="2">
                      {{ range.classNm }}
                    </b-col>
                    <b-col cols="2">
                      <b-form-input type="number" size="sm" v-model="range.min" @keyup="onChangeRange(range)">
                      </b-form-input>
                    </b-col>
                    <b-col cols="2">
                      <b-form-input type="number" size="sm" v-model="range.max" @keyup="onChangeRange(range)">
                      </b-form-input>
                    </b-col>
                    <b-col>
                      {{ range.unit }}
                    </b-col>
                  </b-row>
                  <b-row class="mt-2">
                    <b-col cols="7">
                      <b-button block variant="outline-primary" size="sm" @click="onResetWbcNormalRange">Reset</b-button>
                    </b-col>
                  </b-row>
                </b-collapse>
              </b-col>
            </b-row>
          </div>
        </transition>
        <transition name="fade">
          <div v-if="selectedItemId === 3" style="overflow-y: auto; overflow-x: hidden; height: 900px;">
            <b-row>
              <b-col>
                <div class="panelTitle colorWhite">
                  <b-form-checkbox
                    id="wbcSelectAll"
                    value="Y"
                    unchecked-value="N"
                    size="lg"
                    @change="onWbcSelectAll">
                    WBC image print
                  </b-form-checkbox>
                </div>
                <div class="mt-3">
                  <b-form-group>
                    <b-form-checkbox-group
                      id="wbcPrintGroup"
                      v-model="wbcClassList"
                      :options="wbcOptions"
                      name="wbcPrintGroup"
                      @change="onChangeWbc"
                      stacked
                    ></b-form-checkbox-group>
                  </b-form-group>
                </div>
              </b-col>
              <b-col>
                <div class="panelTitle colorWhite">
                  <b-form-checkbox
                    id="bmSelectAll"
                    value="Y"
                    unchecked-value="N"
                    size="lg"
                    @change="onBmSelectAll">
                    BM image print
                  </b-form-checkbox>
                </div>
                <div class="mt-3">
                  <b-form-group>
                    <b-form-checkbox-group
                      id="bmPrintGroup"
                      v-model="bmImageModel"
                      :options="bmImageOptions"
                      name="bmPrintGroup"
                      @change="onChangeBm"
                      stacked
                    ></b-form-checkbox-group>
                  </b-form-group>
                </div>
              </b-col>
            </b-row>

            <div v-b-toggle.collapse-lis class="panelTitle colorWhite mt-5" style="width: 350px;">
              <b-row>
                <b-col cols="9">
                  LIS Code
                </b-col>
                <b-col class="text-right">
                  <b-icon icon="arrow-down-circle"></b-icon>
                </b-col>
              </b-row>
            </div>
            <b-collapse id="collapse-lis">
              <b-row class="mt-2">
                <b-col cols="5">
                  <strong style="font-size: 18px;">[PB]</strong>
                </b-col>
                <b-col cols="5">
                  <strong style="font-size: 18px;">[BM]</strong>
                </b-col>
              </b-row>

              <b-row class="mt-2">
                <b-col cols="5">
                  <b-row class="mt-2" v-for="(wbc, index) in wbcOptions" :key="index">
                    <b-col cols="5">
                      {{ wbc.text }}
                    </b-col>
                    <b-col cols="5">
                      <b-form-input v-model="wbc.code" size="sm" @keyup="onLisCodeup('01')"></b-form-input>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col cols="5">
                  <b-row class="mt-2" v-for="(bm, index) in bmImageOptions" :key="index">
                    <b-col cols="5">
                      {{ bm.text }}
                    </b-col>
                    <b-col cols="5">
                      <b-form-input v-model="bm.code" size="sm" @keyup="onLisCodeup('02')"></b-form-input>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row class="mt-3">
                <b-col cols="6">
                  <b-form-group>
                    <b-form-radio-group
                      id="radioLisGroup"
                      v-model="modelLisTypeCd"
                      @change="onChangeLisType"
                    >
                      <b-form-radio value="01">
                        <b-form-input v-if="modelLisTypeCd === '01'" type="text" v-model="modelLisFilePath" id="lisFilePath" size="sm" @click="onFileSelectorClick('lisFilePath')" placeholder="file path"></b-form-input>
                        <b-form-input v-else type="text" v-model="modelLisFilePath" id="lisFilePath" size="sm" placeholder="file path" disabled></b-form-input>
                      </b-form-radio>
                      <b-form-radio value="02">
                        <b-form-input v-if="modelLisTypeCd === '02'" type="text" v-model="modelLisUrl" id="lisUrl" size="sm" @keyup="onUpdateLisPath" placeholder="url"></b-form-input>
                        <b-form-input v-else id="lisUrl" type="text" v-model="modelLisUrl" size="sm" placeholder="url" disabled></b-form-input>
                      </b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-collapse>

            <div v-b-toggle.collapse-cbc class="panelTitle colorWhite mt-5" style="width: 350px;">
              <b-row>
                <b-col cols="9">
                  CBC Code
                </b-col>
                <b-col class="text-right">
                  <b-icon icon="arrow-down-circle"></b-icon>
                </b-col>
              </b-row>
            </div>
            <b-collapse id="collapse-cbc">
              <b-row class="mt-2" v-for="(cbc, index) in cbcList" :key="index">
                <b-col cols="3">
                  {{ cbc.testNm }}
                </b-col>
                <b-col cols="3">
                  <b-form-input v-model="cbc.testCd" size="sm" @keyup="onCbcCodeup"></b-form-input>
                </b-col>
              </b-row>

              <b-row class="mt-3">
                <b-col cols="6">
                  <b-form-group>
                    <b-form-radio-group
                      id="radioCbcGroup"
                      v-model="modelCbcTypeCd"
                      @change="onChangeCbcType"
                    >
                      <b-form-radio value="01">
                        <b-form-input v-if="modelCbcTypeCd === '01'" type="text" v-model="modelCbcFilePath" id="cbcFilePath" size="sm" @click="onFileSelectorClick('cbcFilePath')" placeholder="file path"></b-form-input>
                        <b-form-input v-else type="text" v-model="modelCbcFilePath" id="cbcFilePath" size="sm" placeholder="file path" disabled></b-form-input>
                      </b-form-radio>
                      <b-form-radio value="02">
                        <b-form-input v-if="modelCbcTypeCd === '02'" type="text" v-model="modelCbcUrl" id="cbcUrl" size="sm" @keyup="onUpdateLisPath" placeholder="url"></b-form-input>
                        <b-form-input v-else id="cbcUrl" type="text" v-model="modelCbcUrl" size="sm" placeholder="url" disabled></b-form-input>
                      </b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-collapse>
          </div>
        </transition>

        <!-- <transition name="fade">
          <div v-if="selectedItemId === 3" style="overflow-y: auto; overflow-x: hidden; height: 920px;">
            <div class="p-2 border borderColorGray">
              <b-row>
                <b-col class="p-0 pl-3" cols="3">
                  <b-input-group class="mb-3" style="border-radius: 5px;">
                    <b-form-input
                      id="startDate"
                      v-model="startDate"
                      type="text"
                      placeholder="Start date"
                      autocomplete="off"
                      readonly
                      style="height: 30px; font-size: 12px;"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-form-datepicker
                        v-model="startDate"
                        button-only
                        right
                        locale="en-US"
                        aria-controls="startDate"
                        @context="onStartDateContext"
                        size="sm"
                        style="height: 30px; border: 1px solid;"
                      ></b-form-datepicker>
                    </b-input-group-append>
                  </b-input-group>
                </b-col>
                <b-col class="p-0 pl-3" cols="3">
                  <b-input-group class="mb-3" style="border-radius: 5px;">
                    <b-form-input
                      id="endDate"
                      v-model="endDate"
                      type="text"
                      placeholder="End date"
                      autocomplete="off"
                      readonly
                      style="height: 30px; font-size: 12px;"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-form-datepicker
                        v-model="endDate"
                        button-only
                        right
                        locale="en-US"
                        aria-controls="endDate"
                        @context="onEndDateContext"
                        size="sm"
                        style="height: 30px; border: 1px solid;"
                      ></b-form-datepicker>
                    </b-input-group-append>
                  </b-input-group>
                </b-col>
                <b-col cols="1">
                  <button type="button" id="btnSearch" class="btn btn-outline-light" @click="onSearch">Search</button>
                </b-col>
                <b-col>
                  <img class="pointer" src="~@/assets/result/excel.png"
                    @click="onDownloadLog('saveLogs')"
                    style="width: 30px;"/>
                </b-col>
              </b-row>
            </div>
            <table class="mt-2">
              <tr class="border-bottom borderColorGray">
                <th v-for="field in logFileds" class="pb-2 text-center" style="font-size: 13px; font-weight: bold;">
                  {{ field }}
                </th>
              </tr>
              <tr class="text-center" v-for="(item, index) in dspList" :key="index" height="35" style="font-size: 13px;">
                <td width="40" >
                  {{ index + 1 }}
                </td>
                <td width="80" >
                  {{ getCommonCode('13', item.eventTypeCd).cdNm }}
                </td>
                <td width="150" >
                  {{ $stringToDateTime(item.logDttm) }}
                </td>
                <td class="text-left">
                  {{ item.logMessage }}
                </td>
                <td width="150" >
                  {{ item.userId }}
                </td>
              </tr>
            </table>
          </div>
        </transition> -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../Constant'
  import worker from '../../workers/promise'
  import ModalEditAccount from '../Common/ModalEditAccount'
  import ModalConfirm from '../Common/ModalConfirm'
  import ModalBarcodeScan from '../Common/ModalBarcodeScan'
  import XLSX from 'xlsx'
  import lodash from 'lodash'
  import Configs from '../../../Configs'
  import Package from '../../../../package.json'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/antd.css'
  import ModalProgress from '../Common/ModalProgress'

  const fs = require('fs')
  const renameOverwrite = require('rename-overwrite')
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'setting-page',
    components: { XLSX, VueSlider },
    computed: {
      ...mapGetters([
        Constant.GET_CURRENT_USER,
        Constant.GET_SETTINGS,
        Constant.GET_USER_LIST,
        Constant.GET_COMMON_CODE,
        Constant.GET_USER,
        Constant.GET_WBC_COUNT,
        Constant.GET_EVENT_LOG,
        Constant.GET_RBC_CLASS_LIST,
        Constant.GET_DEVICE_BARCODE,
        Constant.GET_BM_CELL,
        Constant.GET_CBC_LIST,
        Constant.GET_WBC_NORMAL_RANGE,
        Constant.GET_NORMAL_RANGE,
        Constant.GET_BM_REPORT_PRINT,
        Constant.GET_DEFAULT_RBC_DEGREE
      ])
    },
    beforeDestroy () {
      this.EventBus.$off('RECEIVE_DATA')
      this.EventBus.$off('BACKUP_DATA')
      this.EventBus.$off('RESTORE_DATA')
      this.EventBus.$off(Constant.DELETE_USER)

      ipcRenderer.removeAllListeners('selected-dir')
      ipcRenderer.removeAllListeners('file-select')

      // ipcRenderer.removeAllListeners('restore-success')
      // ipcRenderer.removeAllListeners('backup-success')

      ipcRenderer.removeAllListeners(Constant.SELECT_RBC_DEGREE)
      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_CUSTOM_CLASS)
      ipcRenderer.removeAllListeners(Constant.SELECT_WBC_HOT_KEY)

      ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CODE)
      ipcRenderer.removeAllListeners(Constant.SELECT_CBC_CODE)
      ipcRenderer.removeAllListeners(Constant.SELECT_LIS_CONN_PATH)

      ipcRenderer.removeAllListeners(Constant.GET_BACKUP_LIST)
      // ipcRenderer.removeAllListeners(Constant.GET_NORMAL_RANGE)
    },
    mounted () {
      var self = this
      this.pbiaRootPath = this.getSettings.pbiaRootPath
      this.onClickSubMenu(this.subMenus[0])
      this.userList = this.getUserList
      this.pbAnalysisType = this.getSettings.pbAnalysisType
      this.stitchCount = this.getSettings.stitchCount
      this.positionMargin = this.getSettings.positionMargin
      this.runningMode = this.getSettings.runningMode
      this.wbcClassList = this.getSettings.modelWbcReportPrint
      this.cbcList = lodash.cloneDeep(this.getCbcList)
      this.isNsNbIntegration = this.getSettings.isNsNbIntegration

      this.rbcClassList = lodash.cloneDeep(this.getRbcClassList)
      this.bmCellList = lodash.cloneDeep(this.getBmCell)

      // default normalRange
      this.defaultWbcNormalRange = this.getNormalRange
      // wbc range
      this.wbcNormalRange = lodash.cloneDeep(this.getWbcNormalRange)
      // bm image print
      this.bmImageModel = this.getBmReportPrint
      console.log(this.bmImageModel)

      // this.bfAnalysisType = this.getSettings.bfAnalysisType
      // this.logList = this.getEventLog
      // this.dspList = this.getEventLog

      // 30일 이전 로그 삭제
      this.$store.dispatch(Constant.REMOVE_EVENT_LOG, null)

      this.sendSearchCardCount()

      for (var i = 0; i < this.userList.length; i++) {
        this.userList[i].authNm = this.getCommonCode(Constant.GET_CODE_LIST_USER_AUTHORIZATION, this.userList[i].authCd).cdNm
      }

      this.currentUser = this.getUser(this.getCurrentUser.userId)
      this.dspUserList = this.userList

      ipcRenderer.send(Constant.SELECT_WBC_CUSTOM_CLASS)
      ipcRenderer.send(Constant.SELECT_RBC_DEGREE)
      // wbc
      ipcRenderer.send(Constant.SELECT_WBC_HOT_KEY, JSON.stringify({keyType: '01'}))
      // bm cell
      ipcRenderer.send(Constant.SELECT_BM_HOT_KEY, JSON.stringify({keyType: '02'}))
      // normal range
      // ipcRenderer.send(Constant.GET_NORMAL_RANGE)

      ipcRenderer.on('restore-success', function (event, results) {
        self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
          position: 'bottom-center',
          duration: '2000'
        })
      })

      ipcRenderer.on('backup-success', function (event, results) {
        self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
          position: 'bottom-center',
          duration: '2000'
        })
      })

      ipcRenderer.on('file-select', function (event, results) {
        console.log(results)
        self.restoreFile = results[0]
      })

      ipcRenderer.on('selected-dir', function (event, results) {
        results.path = self.$replaceAll(results.path, '\\', '/')

        if (results.pathType === 'pbiaRootPath') {
          self.pbiaRootPath = results.path
          self.$store.dispatch(Constant.UPDATE_ROOT_PATH, self.pbiaRootPath)

          // 설정 정보 등록
          // var params = {
          //   jobCmd: 'SETTINGS',
          //   reqUserId: self.getCurrentUser.userId,
          //   reqDttm: self.$getDateTimeStr(),
          //   pbiaRootDir: self.pbiaRootPath,
          //   oilCount: self.getSettings.oilCount,
          //   isOilReset: 'N',
          //   deviceType: '02',
          //   uiVersion: Configs.BUCKET_NAME + '_v' + Package.version
          // }

          // worker.sendDataToServer(self, JSON.stringify(params))
          self.sendSettingInfo()
          self.EventBus.$emit('OVERLAY', {state: true})

        } else if (results.pathType === 'saveLogs') {

          var logs = []

          for (var i = 0; i < self.dspList.length; i++) {
            var logObj = {}
            logObj.no = i + 1
            logObj.event = self.getCommonCode(Constant.GET_CODE_LOG_TYPE, self.dspList[i].eventTypeCd).cdNm
            logObj.date_time = self.$stringToDateTime(self.dspList[i].logDttm)
            logObj.message = self.dspList[i].message
            logObj.user_id = self.dspList[i].userId

            logs.push(logObj)
          }
          self.onDownloadXlsx(results.path, logs, self.$getFileNameDateTime() + '_logData.xlsx')

          self.$toasted.show(Constant.IDS_DOWNLOAD_COMPLETE, {
            position: 'bottom-center',
            duration: '2000'
          })
        } else if (results.pathType === 'saveUsers') {
          var users = []

          for (var i = 0; i < self.dspUserList.length; i++) {
            var userObj = {}
            userObj.no = i + 1
            userObj.user_type = self.getCommonCode(Constant.GET_CODE_LIST_USER_AUTHORIZATION, self.dspUserList[i].authCd).cdNm
            userObj.user_id = self.dspUserList[i].userId
            userObj.user_name = self.dspUserList[i].userName
            userObj.create_date = self.dspUserList[i].createDttm
            userObj.last_date = self.dspUserList[i].loginDttm
            userObj.state = self.dspUserList[i].isAvailable

            users.push(userObj)
          }
          self.onDownloadXlsx(results.path, users, self.$getFileNameDateTime() + '_userData.xlsx')

          self.$toasted.show(Constant.IDS_DOWNLOAD_COMPLETE, {
            position: 'bottom-center',
            duration: '2000'
          })
        } else if (results.pathType === 'lisFilePath') {
          console.log(results.path)
          self.modelLisFilePath = results.path
          self.onUpdateLisPath()
        } else if (results.pathType === 'cbcFilePath') {
          console.log(results.path)
          self.modelCbcFilePath = results.path
          self.onUpdateLisPath()
        } else if (results.pathType === 'backupPath') {
          self.backupPath = results.path
        }
      })

      // normal range
      // ipcRenderer.on(Constant.GET_NORMAL_RANGE, function (event, results) {
      //   self.wbcNormalRange = results
      //   console.log(self.wbcNormalRange)
      // })

      ipcRenderer.on(Constant.UPDATE_NORMAL_RANGE, function (event, results) {
        console.log(results)
        // update Vue store
        ipcRenderer.send(Constant.GET_NORMAL_RANGE)
      })
      // custom class
      ipcRenderer.on(Constant.SELECT_WBC_CUSTOM_CLASS, function (event, results) {
        console.log(results)
        self.wbcCustomClass = results
        self.wbcOptions = []
        self.wbcOptions.push({ text: 'Neutrophil', value: '01' })
        self.wbcOptions.push({ text: 'Neutrophil-Segmented', value: '71' })
        self.wbcOptions.push({ text: 'Neutrophil-Band', value: '72' })
        self.wbcOptions.push({ text: 'Metamyelocyte', value: '02' })
        self.wbcOptions.push({ text: 'Myelocyte', value: '03' })
        self.wbcOptions.push({ text: 'Promyelocyte', value: '04' })
        self.wbcOptions.push({ text: 'Lymphocyte', value: '05' })
        self.wbcOptions.push({ text: 'Reactive lymphocyte', value: '61' })
        self.wbcOptions.push({ text: 'Abnormal lymphocyte', value: '62' })
        self.wbcOptions.push({ text: 'Monocyte', value: '07' })
        self.wbcOptions.push({ text: 'Eosinophil', value: '08' })
        self.wbcOptions.push({ text: 'Basophil', value: '09' })
        self.wbcOptions.push({ text: 'Blast', value: '10' })
        self.wbcOptions.push({ text: 'Plasma cell', value: '11' })
        self.wbcOptions.push({ text: 'nRBC', value: '12' })
        self.wbcOptions.push({ text: 'Giant platelet', value: '13' })
        self.wbcOptions.push({ text: 'Platelet aggregation', value: '14' })
        self.wbcOptions.push({ text: 'Malaria', value: '16' })
        self.wbcOptions.push({ text: 'Artifact(Smudge)', value: '15' })

        self.wbcCustomClass.forEach(function(wbcCustom) {
          if (wbcCustom.CLASS_TITLE !== '') {
            var obj = {
              text: wbcCustom.CLASS_NM,
              value: wbcCustom.CLASS_ID
            }
            self.wbcOptions.push(obj)
          }
        })

        self.bmImageOptions = []
        self.bmImageOptions.push({ text: 'Neutrophil', value: '01'}),
        self.bmImageOptions.push({ text: 'Neutrophil-Segmented', value: '71'}),
        self.bmImageOptions.push({ text: 'Neutrophil-Band', value: '72'}),
        self.bmImageOptions.push({ text: 'Metamyelocyte', value: '02'}),
        self.bmImageOptions.push({ text: 'Myelocyte', value: '03'}),
        self.bmImageOptions.push({ text: 'Promyelocyte', value: '04'}),
        self.bmImageOptions.push({ text: 'Lymphocyte', value: '05'}),
        self.bmImageOptions.push({ text: 'Abnormal lymphocyte', value: '06'}),
        self.bmImageOptions.push({ text: 'Monocyte', value: '07'}),
        self.bmImageOptions.push({ text: 'Eosinophil', value: '08'}),
        self.bmImageOptions.push({ text: 'Basophil', value: '09'}),
        self.bmImageOptions.push({ text: 'Blast', value: '10'}),
        self.bmImageOptions.push({ text: 'Plasma cell', value: '11'}),
        self.bmImageOptions.push({ text: 'Orthochromic Normoblast', value: '12'}),
        self.bmImageOptions.push({ text: 'Polychromic Normoblast', value: '13'}),
        self.bmImageOptions.push({ text: 'Basophilic Normoblast', value: '14'}),
        self.bmImageOptions.push({ text: 'Proerythroblast', value: '15'}),
        self.bmImageOptions.push({ text: 'Histiocyte', value: '16'}),
        self.bmImageOptions.push({ text: 'Others', value: '17'})

        ipcRenderer.send(Constant.SELECT_LIS_CODE, null)
        ipcRenderer.send(Constant.SELECT_CBC_CODE, null)
        ipcRenderer.send(Constant.SELECT_LIS_CONN_PATH, JSON.stringify({deviceBarcode: self.getDeviceBarcode}))
      })

      ipcRenderer.on(Constant.SELECT_LIS_CONN_PATH, function (event, results) {
        console.log(results)
        if (results !== null) {
          self.modelLisTypeCd = results.LIS_CONN_TYPE_CD
          self.modelLisFilePath = results.LIS_FILE_PATH
          self.modelLisUrl = results.LIS_URL
          self.modelCbcTypeCd = results.CBC_CONN_TYPE_CD
          self.modelCbcFilePath = results.CBC_FILE_PATH
          self.modelCbcUrl = results.CBC_URL
        }
      })

      ipcRenderer.on(Constant.SELECT_LIS_CODE, function (event, results) {
        console.log(results)
        console.log(self.wbcOptions)
        console.log(self.bmImageOptions)

        results.forEach(function(lisCode) {
          if (lisCode.TEST_TYPE === '01') {
            self.wbcOptions.forEach(function(wbcItem) {
              if (lisCode.IA_CD === wbcItem.value) {
                wbcItem.code = lisCode.LIS_CD
                wbcItem.cbcCode = lisCode.CBC_CD
              }
            })
          } else {
            self.bmImageOptions.forEach(function(bmItem) {
              if (lisCode.IA_CD === bmItem.value) {
                bmItem.code = lisCode.LIS_CD
                bmItem.cbcCode = lisCode.CBC_CD
              }
            })
          }
        })
      })

      ipcRenderer.on(Constant.SELECT_CBC_CODE, function (event, results) {
        console.log(results)

        results.forEach(function(cbcCode) {
          self.cbcList.forEach(function(cbcItem) {
            if (cbcCode.IA_CD === cbcItem.cd) {
              cbcItem.testCd = cbcCode.CBC_CD
              cbcItem.testNm = cbcCode.CD_NM
            }
          })
        })
      })

      this.EventBus.$on('RECEIVE_DATA', function(params) {
        var jobCmd = params.jobCmd
        if (jobCmd === 'SETTINGS') {
          self.EventBus.$emit('OVERLAY', {state: false})
        }
      })

      this.EventBus.$on('RESTORE_DATA', function(params) {
        console.log(params)
        fs.readFile(self.restoreFile, function(err, data) {
          if (err) {
            self.$toasted.show(err.message, {
              position: 'bottom-center',
              duration: '2000'
            })
          } else {
            console.log(self.restoreFile.split('\\'))
            var restoreArr = self.restoreFile.split('\\')
            var restorePath = ''

            for (var i = 0; i < restoreArr.length - 1; i++) {
              restorePath += restoreArr[i] + '/'
            }

            var restoreData = JSON.parse(data)
            console.log(restoreData)

            // 복원 progress
            self.$modal.show(ModalProgress, {}, {
              height: 'auto',
              clickToClose: false
            })

            restoreData.forEach(function(item, index) {
              // 디렉터리 이동
              renameOverwrite(restorePath + item.SLOT_ID, self.pbiaRootPath + '/' + item.SLOT_ID).then(function() {
                console.log(index)

                self.EventBus.$emit('VERSION_UPDATE_CHECK', {
                  value: Number(((index / restoreData.length) * 100).toFixed(0)),
                  text: '[' + (index + 1) + '/' + restoreData.length + '] Copying files...'
                })

                if (index + 1 === restoreData.length) {
                  self.$modal.hideAll()
                  var params = {
                    userId: self.getCurrentUser.userId,
                    restoreList: restoreData
                  }
                  ipcRenderer.send(Constant.RESTORE_BACKUP_DATA, JSON.stringify(params))

                  self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                }
              }).catch(function(err) {
                console.log(err)

                if (index + 1 === restoreData.length) {
                  self.$modal.hideAll()
                  var params = {
                    userId: self.getCurrentUser.userId,
                    restoreList: restoreData
                  }
                  ipcRenderer.send(Constant.RESTORE_BACKUP_DATA, JSON.stringify(params))

                  self.$toasted.show(err.message, {
                    position: 'bottom-center',
                    duration: '2000'
                  })
                }
              })
            })
          }
        })
      })

      this.EventBus.$on('BACKUP_DATA', function(params) {
        // 날짜 조회
        var params = {
          backupStartDate: self.backupStartDate,
          backupEndDate: self.backupEndDate
        }

        ipcRenderer.send(Constant.GET_BACKUP_LIST, JSON.stringify(params))
      })

      this.EventBus.$on(Constant.DELETE_USER, function(params) {
        console.log(params)
        ipcRenderer.send(Constant.DELETE_USER, JSON.stringify({userId: params}))
        self.$store.dispatch(Constant.DELETE_USER, params)
      })

      // wbc 단축키
      ipcRenderer.on(Constant.SELECT_WBC_HOT_KEY, function (event, results) {
        console.log(results)

        self.hotKeyClassList = results
      })

      // bm cell
      ipcRenderer.on(Constant.SELECT_BM_HOT_KEY, function (event, results) {
        console.log(results)

        self.bmHotKeyClassList = results
      })

      // RBG 조건 설정값 append
      ipcRenderer.on(Constant.SELECT_RBC_DEGREE, function (event, results) {
        console.log(results)
        self.rbcDegree = results

        self.rbcClassList.forEach(function (rbcCategory) {
          rbcCategory.classInfo.forEach(function (rbcClass, classIndex) {
            rbcCategory.classInfo[classIndex].sliderValue = []

            self.rbcDegree.forEach(function (rbcDegree) {
              if ((rbcCategory.categoryId === rbcDegree.CATEGORY_ID) &&
                  rbcClass.classId === rbcDegree.CLASS_ID) {

                rbcCategory.classInfo[classIndex].sliderValue.push(rbcDegree.DEGREE_1)
                rbcCategory.classInfo[classIndex].sliderValue.push(rbcDegree.DEGREE_2)
                rbcCategory.classInfo[classIndex].sliderValue.push(rbcDegree.DEGREE_3)
              }
            })
          })
        })
      })

      // 백업 목록 get
      ipcRenderer.on(Constant.GET_BACKUP_LIST, function (event, results) {
        console.log(results)
        if (results.length <= 0) {
          self.$toasted.show(Constant.IDS_NO_DATA_FOUND, {
            position: 'bottom-center',
            duration: '2000'
          })
        } else {
          fs.writeFile(self.backupPath + '/' + self.backupStartDate + '_' + self.backupEndDate + '.json', JSON.stringify(results), function(err) {
            console.log(err)
            if (!err) {
              // 다운로드 progress
              self.$modal.show(ModalProgress, {}, {
                height: 'auto',
                clickToClose: false
              })

              results.forEach(function(item, index) {
                // 디렉터리 이동
                renameOverwrite(self.pbiaRootPath + '/' + item.SLOT_ID, self.backupPath + '/' + item.SLOT_ID).then(function() {
                  console.log(index)

                  self.EventBus.$emit('VERSION_UPDATE_CHECK', {
                    value: Number(((index / results.length) * 100).toFixed(0)),
                    text: '[' + (index + 1) + '/' + results.length + '] Copying files...'
                  })

                  if (index + 1 === results.length) {
                    self.$modal.hideAll()

                    var params = {
                      userId: self.getCurrentUser.userId,
                      backupList: results
                    }
                    ipcRenderer.send(Constant.DELETE_BACKUP_DATA, JSON.stringify(params))

                    self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  }

                }).catch(function(err) {
                  console.log(err)

                  if (index + 1 === results.length) {
                    self.$modal.hideAll()

                    var params = {
                      userId: self.getCurrentUser.userId,
                      backupList: results
                    }
                    ipcRenderer.send(Constant.DELETE_BACKUP_DATA, JSON.stringify(params))

                    self.$toasted.show(Constant.IDS_MSG_SUCCESS, {
                      position: 'bottom-center',
                      duration: '2000'
                    })
                  }
                })
              })

            } else {
              self.$toasted.show(err.message, {
                position: 'bottom-center',
                duration: '2000'
              })
            }
          })
        }
      })
    },
    data () {
      return {
        pbiaRootPath: '',
        runningMode: '',
        isOpenUserSetting: true,
        isAdminSetting: false,
        selectedItemId: 1,
        currentUser: null,
        pbAnalysisType: '100',
        // bfAnalysisType: '100',
        stitchCount: '1',
        positionMargin: '1',
        accountFileds: ['No.', 'User Type', 'User ID', 'Name', 'Subscription Date', 'Latest Date', 'State'],
        logFileds: ['No.', 'Event Type', 'Date / Time', 'Message', 'User ID'],
        logList: null,
        dspList: null,
        startDate: '',
        endDate: '',
        startDateUser: '',
        endDateUser: '',
        modelSearchUserType: '00',
        userList: [],
        dspUserList: [],
        searchText: '',
        wbcClassList: [],
        wbcOptions: [],
        wbcCustomClass: [],
        isNsNbIntegration: false,
        hotKeyClassList: [],
        bmHotKeyClassList: [],
        rbcClassList: [],
        rbcDegree: null,
        modelLisTypeCd: '01',
        modelLisFilePath: '',
        modelLisUrl: '',
        modelCbcTypeCd: '01',
        modelCbcFilePath: '',
        modelCbcUrl: '',
        bmCellList: [],
        backupStartDate: '',
        backupEndDate: '',
        backupPath: '',
        restoreFile: '',
        wbcNormalRange: null,
        defaultWbcNormalRange: null,
        subMenus: [{
          id: 1,
          title: 'Login / Account',
        }, {
          id: 2,
          title: 'Analysis / Database',
        }, {
          id: 3,
          title: 'Report'
        }],
        // , {
        //   id: 3,
        //   title: 'Event Log',
        // }],
        AnalysisList: [
          { value: '100', text: '100' },
          { value: '150', text: '150' },
          { value: '200', text: '200' },
          { value: '250', text: '250' },
          { value: '300', text: '300' },
          { value: '350', text: '350' },
          { value: '400', text: '400' },
          { value: '450', text: '450' },
          { value: '500', text: '500' }
        ],
        stitchCountList: [
          { value: '1', text: '1' },
          { value: '2', text: '2' },
          { value: '3', text: '3' },
          { value: '4', text: '4' },
          { value: '5', text: '5' }
        ],
        PositionMarginList: [
          { value: '1', text: '1' },
          { value: '2', text: '2' },
          { value: '3', text: '3' },
          { value: '4', text: '4' },
          { value: '5', text: '5' }
        ],
        runningModeList: [
          { value: '00', text: 'Normal' },
          { value: '01', text: 'RBC dection' },
          { value: '02', text: 'Hardware' }
        ],
        searchUserType: [
          { value: '00', text: 'User Id' },
          { value: '01', text: 'User Name' }
        ],
        bmImageModel: [],
        bmImageOptions: []
      }
    },
    methods: {
      onResetDegree () {
        var self = this

        console.log(this.getDefaultRbcDegree)
        console.log(this.rbcClassList)
        console.log(this.$refs.slider)

        var sliderIndex = 0

        self.getDefaultRbcDegree.forEach(function(defaultRbcDegree, defaultRbcIndex) {
          self.rbcClassList.forEach(function(rbcClass) {
            if (defaultRbcDegree.categoryId === rbcClass.categoryId) {
              rbcClass.classInfo.forEach(function(slider) {
                if (defaultRbcDegree.classId === slider.classId) {
                  if (slider.sliderValue.length > 0) {
                    console.log(sliderIndex)
                    console.log(defaultRbcDegree.categoryId + ':' + defaultRbcDegree.classId)
                    console.log(self.$refs.slider[sliderIndex])

                    self.$refs.slider[sliderIndex].setValue([defaultRbcDegree.degree1, defaultRbcDegree.degree2, defaultRbcDegree.degree3])
                    sliderIndex++
                  }
                }
              })
            }
          })
        })

      },
      onResetWbcNormalRange () {
        console.log('onResetWbcNormalRange')
        console.log(this.defaultWbcNormalRange)
        console.log(this.wbcNormalRange)

        var self = this

        self.wbcNormalRange.forEach(function(wbcRange) {
          self.defaultWbcNormalRange.forEach(function(defaultWbcRange) {
            if (wbcRange.classId === defaultWbcRange.classId) {
              wbcRange.min = defaultWbcRange.min
              wbcRange.max = defaultWbcRange.max
            }
          })
        })

        ipcRenderer.send(Constant.RESET_NORMAL_RANGE, JSON.stringify(self.wbcNormalRange))
      },
      onChangeRange (range) {
        console.log('onChangeRange')
        console.log(range)

        var params = {
          analysisType: range.analysisType,
          classId: range.classId,
          min: range.min,
          max: range.max,
          unit: range.unit
        }
        ipcRenderer.send(Constant.UPDATE_NORMAL_RANGE, JSON.stringify(params))
      },
      onRestore () {
        console.log('onRestore')
        if (this.restoreFile === '') {
          this.$toasted.show(Constant.IDS_PLEASE_SELECT_A_BACKUP_FILE, {
            position: 'bottom-center',
            duration: '2000'
          })
        } else {
          this.$modal.show(ModalConfirm, {
            openType: 'dataRestore',
            message: '[' + this.restoreFile + ']' +
              Constant.IDS_MSG_DATA_RESTORE
          }, {
            height: 'auto',
            width: '500px'
          })
        }
      },
      onBackup () {
        console.log('onBackup : ' + this.backupPath)
        console.log(this.backupStartDate + ' ~ ' + this.backupEndDate)
        if (this.backupPath === '') {
          this.$toasted.show(Constant.IDS_PLEASE_SELECT_A_BACKUP_PATH, {
            position: 'bottom-center',
            duration: '2000'
          })
        } else if (this.backupStartDate === '' || this.backupEndDate === '') {
          this.$toasted.show(Constant.IDS_PLEASE_SELECT_A_BACKUP_DATE, {
            position: 'bottom-center',
            duration: '2000'
          })
        } else {
          this.$modal.show(ModalConfirm, {
            openType: 'dataBackup',
            message: '[' + this.backupStartDate + ' ~ ' + this.backupEndDate + ']' +
              Constant.IDS_MSG_DATA_BACKUP
          }, {
            height: 'auto',
            width: '500px'
          })
        }
      },
      onChangeCbcType () {
        console.log('onChangeCbcType')
        console.log(this.modelCbcTypeCd)

        if (this.modelCbcTypeCd === '01') {
          document.getElementById('cbcFilePath').disabled = false
          document.getElementById('cbcUrl').disabled = true
        } else {
          document.getElementById('cbcFilePath').disabled = true
          document.getElementById('cbcUrl').disabled = false
        }

        this.onUpdateLisPath()
      },
      onUpdateLisPath () {
        var params = {
          userId: this.getCurrentUser.userId,
          lisTypeCd: this.modelLisTypeCd,
          lisFilePath: this.modelLisFilePath,
          lisUrl: this.modelLisUrl,
          cbcTypeCd: this.modelCbcTypeCd,
          cbcFilePath: this.modelCbcFilePath,
          cbcUrl: this.modelCbcUrl,
          deviceBarcode: this.getDeviceBarcode
        }

        ipcRenderer.send(Constant.UPDATE_LIS_CONN_PATH, JSON.stringify(params))
      },
      onChangeLisType () {
        console.log('onChangeLisType')
        console.log(this.modelLisTypeCd)

        if (this.modelLisTypeCd === '01') {
          document.getElementById('lisFilePath').disabled = false
          document.getElementById('lisUrl').disabled = true
        } else {
          document.getElementById('lisFilePath').disabled = true
          document.getElementById('lisUrl').disabled = false
        }

        this.onUpdateLisPath()
      },
      /**
       * testType: 01 - PB, 02 - BM
       */
      onLisCodeup(testType) {
        console.log('onCodeup')
        console.log(this.wbcOptions)
        console.log(this.bmImageOptions)

        var codeList = []

        if (testType === '01') {
          codeList = lodash.cloneDeep(this.wbcOptions)
        } else {
          codeList = lodash.cloneDeep(this.bmImageOptions)
        }

        var params = {
          userId: this.getCurrentUser.userId,
          codeList: codeList,
          testType: testType
        }

        console.log(params)
        ipcRenderer.send(Constant.UPDATE_LIS_CODE, JSON.stringify(params))
      },
      onCbcCodeup() {
        console.log('onCbcCodeup')
        console.log(this.cbcList)

        var params = {
          userId: this.getCurrentUser.userId,
          codeList: this.cbcList
        }

        ipcRenderer.send(Constant.UPDATE_CBC_CODE, JSON.stringify(params))
      },
      onChangeSlider (categoryId, classItem) {
        var params = {
          categoryId: categoryId,
          classId: classItem.classId,
          degree1: classItem.sliderValue[0],
          degree2: classItem.sliderValue[1],
          degree3: classItem.sliderValue[2]
        }
        ipcRenderer.send(Constant.UPDATE_RBC_DEGREE, JSON.stringify(params))
        this.$forceUpdate()
      },
      onWbcKeyUp (key) {
        var self = this
        var value = key.HOT_KEY.toLowerCase().trim()
        var isError = false

        // error check
        if (value !== '') {
          self.hotKeyClassList.forEach(function (item, index) {
            if (item.CLASS_ID !== key.CLASS_ID) {
              if (item.HOT_KEY === value) {
                self.$toasted.show(Constant.IDS_MSG_DUPLICATE_KEY.replace('%s', value), {
                  position: 'bottom-center',
                  duration: '2000'
                })
                key.HOT_KEY = ''
                isError = true
              }
            }
          })
        }

        if (!isError) {
          ipcRenderer.send(Constant.UPDATE_HOT_KEYS, JSON.stringify({id: key.CLASS_ID, key: value, keyType: '01'}))
        }
      },
      onBmKeyUp (key) {
        var self = this
        var value = key.HOT_KEY.toLowerCase().trim()
        var isError = false

        // error check
        if (value !== '') {
          self.bmHotKeyClassList.forEach(function (item, index) {
            if (item.CLASS_ID !== key.CLASS_ID) {
              if (item.HOT_KEY === value) {
                self.$toasted.show(Constant.IDS_MSG_DUPLICATE_KEY.replace('%s', value), {
                  position: 'bottom-center',
                  duration: '2000'
                })
                key.HOT_KEY = ''
                isError = true
              }
            }
          })
        }

        if (!isError) {
          ipcRenderer.send(Constant.UPDATE_BM_HOT_KEYS, JSON.stringify({id: key.CLASS_ID, key: value, keyType: '02'}))
        }
      },
      createDirs (path) {
        var self = this

        var slotList = fs.readdirSync(this.pbiaRootPath).filter(function(item) {
          return (item.indexOf('.') < 0)
        })

        console.log(slotList)
        var mkList = this.wbcCustomClass.filter(function(item) {
          return (item.CLASS_TITLE !== '' && item.CLASS_NM !== '')
        })
        var rmList = this.wbcCustomClass.filter(function(item) {
          return (item.CLASS_TITLE === '' || item.CLASS_NM === '')
        })

        console.log(mkList)
        console.log(rmList)

        slotList.forEach(function(item) {
          var wbcPath = self.pbiaRootPath + '/' + item + '/' + self.wbcClassDirName
          var customDirList = fs.readdirSync(wbcPath).filter(function(item) {
            return (item.includes('90') || item.includes('91') || item.includes('92') || item.includes('93') ||
                    item.includes('94') || item.includes('95') || item.includes('96'))
          })

          console.log(item)
          console.log(customDirList)

          // delete
          rmList.forEach(function(rmItem) {
            customDirList.forEach(function(customItem) {
              var id = customItem.split('_')[0]

              if (rmItem.id === id) {
                try {
                  fs.rmdirSync(wbcPath + '/' + customItem)
                } catch (err) {
                  console.log(err.message)
                }
              }
            })
          })

          // create
          mkList.forEach(function(mkItem) {
            var updateList = customDirList.filter(function(customItem) {
              var id = customItem.split('_')[0]
              return (mkItem.id === id)
            })
            var tmpMkList = customDirList.filter(function(customItem) {
              var id = customItem.split('_')[0]
              return (mkItem.id !== id)
            })

            try {
              // update
              updateList.forEach(function(item) {
                fs.renameSync(wbcPath + '/' + customItem, wbcPath + '/' + item.id + '_' + item.name)
              })

              // create
              tmpMkList.forEach(function(item) {
                fs.mkdirSync(wbcPath + '/' + customItem, wbcPath + '/' + item.id + '_' + item.name)
              })
            } catch (err) {
              console.log(err.message)
            }

          })

          // create
          mkList.forEach(function(mkItem) {
            try {
              customDirList.forEach(function(customItem) {
                var id = customItem.split('_')[0]

                // 기존 있는 폴더 update
                if (mkItem.id === id) {
                  fs.renameSync(wbcPath + '/' + customItem, wbcPath + '/' + mkItem.id + '_' + mkItem.name)
                }
              })
            } catch (err) {
              console.log(err.message)
            }
          })
        })
      },
      onClassSave () {
        console.log('onClassSave')
        var self = this

        for (var i = 0; i < this.wbcCustomClass.length - 1; i++) {
          if (this.wbcCustomClass[i].CLASS_TITLE !== '') {
            if (this.wbcCustomClass[i].CLASS_TITLE === this.wbcCustomClass[i + 1].CLASS_TITLE) {
              this.$toasted.show(Constant.IDS_THIS_IS_A_DUPLICATION_ABBREVIATION, {
                position: 'bottom-center',
                duration: '2000'
              })

              return false
            }
          }
        }

        for (var i = 0; i < this.wbcCustomClass.length; i++) {
          if (this.wbcCustomClass[i].CLASS_TITLE !== '') {
            if (this.wbcCustomClass[i].CLASS_NM === '') {
              this.$toasted.show(Constant.IDS_ERROR_ENTER_CLASS_INFO, {
                position: 'bottom-center',
                duration: '2000'
              })

              return false
            }
          } else if (this.wbcCustomClass[i].CLASS_NM !== '') {
            if (this.wbcCustomClass[i].CLASS_TITLE === '') {
              this.$toasted.show(Constant.IDS_ERROR_ENTER_CLASS_INFO, {
                position: 'bottom-center',
                duration: '2000'
              })

              return false
            }
          }
        }

        console.log(this.wbcCustomClass)
        ipcRenderer.send(Constant.SET_WBC_CUSTOM_LIST, JSON.stringify({wbcCustomList: this.wbcCustomClass}))

        setTimeout(function () {
          ipcRenderer.send(Constant.SELECT_WBC_HOT_KEY, JSON.stringify({keyType: '01'}))
        }, 500)
        // save store ]

        // save settings
        this.sendSettingInfo()

        this.$toasted.show(Constant.IDS_MSG_SUCCESS, {
          position: 'bottom-center',
          duration: '2000'
        })
      },
      onBmSelectAll (value) {
        console.log(value)
        var self = this

        self.bmImageModel = []

        if (value === 'Y') {
          self.bmImageOptions.forEach(function(item) {
            self.bmImageModel.push(item.value)
          })
        }

        console.log(self.bmImageModel)
        self.$store.dispatch(Constant.SET_BM_REPORT_PRINT, self.bmImageModel)
      },
      onWbcSelectAll (value) {
        console.log(value)
        var self = this

        self.wbcClassList = []

        if (value === 'Y') {
          self.wbcOptions.forEach(function(item) {
            self.wbcClassList.push(item.value)
          })
        }

        console.log(self.wbcClassList)
        self.$store.dispatch(Constant.SET_WBC_REPORT_PRINT, self.wbcClassList)
      },
      onChangeWbc (value) {
        console.log(value)
        this.$store.dispatch(Constant.SET_WBC_REPORT_PRINT, value)
      },
      onChangeBm (value) {
        console.log(value)
        this.$store.dispatch(Constant.SET_BM_REPORT_PRINT, value)
      },
      sendSettingInfo () {
        var isNsNbIntegration = 'N'
        if (this.isNsNbIntegration) {
          isNsNbIntegration = 'Y'
        }
        // 설정 정보 등록
        var params = {
          jobCmd: 'SETTINGS',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          pbiaRootDir: this.pbiaRootPath,
          oilCount: this.getSettings.oilCount,
          isOilReset: 'N',
          deviceType: '02',
          uiVersion: Configs.BUCKET_NAME + '_v' + Package.version,
          isNsNbIntegration: isNsNbIntegration
        }

        console.log(params)
        worker.sendDataToServer(this, JSON.stringify(params))
      },
      onChangeNsNb (value) {
        this.$store.dispatch(Constant.SET_IS_NS_NB_INTEGRATION, value)
        this.sendSettingInfo()
      },
      onFileSelectorClick (path) {
        ipcRenderer.send('open-file-dialog-for-dir', path)
      },
      onOpenSaveDialog (path) {
        ipcRenderer.send('open-save-dialog', path)
      },
      onOpenRestoreDialog (path) {
        ipcRenderer.send('open-file-dialog-restore', path)
      },
      toggleChildren () {
        this.showChildren = !this.showChildren
      },
      shown () {
        // console.log(this.isOpenUserSetting)
      },
      hidden () {
        // console.log(this.isOpenUserSetting)
      },
      onClickSubMenu (item) {
        this.selectedItemId = item.id
        for (var i = 0; i < this.subMenus.length; i++) {
          document.getElementById('sub' + this.subMenus[i].id).style.color = 'gray'
        }
        document.getElementById('sub' + item.id).style.color = 'white'
      },
      onChangeSelect () {
        var obj = {
          pbAnalysisType: this.pbAnalysisType,
          stitchCount: this.stitchCount,
          positionMargin: this.positionMargin
          // bfAnalysisType: this.bfAnalysisType
        }
        this.$store.dispatch(Constant.UPDATE_ANALYSIS_TYPE, obj)
      },
      onChangeMode () {
        var obj = {
          runningMode: this.runningMode
        }
        this.$store.dispatch(Constant.UPDATE_RUNNING_MODE, obj)
      },
      onClickEdit (item) {
        this.$modal.show(ModalEditAccount, {item: item}, {
          height: 'auto'
        })
      },
      onClickDelete (item) {
        this.$modal.show(ModalConfirm, {openType: 'deleteAccount', item: item, message: Constant.IDS_MSG_DELETE_ACCOUNT}, {
          height: 'auto',
          width: '350px'
        })
      },
      onGripperOpen (evt) {
        var params = {
          jobCmd: 'GRIPPER_OPEN',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      },
      onCameraReset (evt) {
        var params = {
          jobCmd: 'CAMERA_RESET',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr()
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      },
      onBarcodeScan (evt) {
        if (this.$store.getters.getRunningState) {
          this.$toasted.show(Constant.IDS_ERROR_ALREADY_RUNNING, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }

        this.$modal.show(ModalBarcodeScan, {}, {
          width: '420px',
          height: 'auto'
        })
      },
      onStartDateContext (ctx) {
        // The date formatted in the locale, or the `label-no-date-selected` string
        this.formatted = ctx.selectedFormatted
        // The following will be an empty string until a valid date is entered
        this.selected = ctx.selectedYMD
      },
      onEndDateContext (ctx) {
        // The date formatted in the locale, or the `label-no-date-selected` string
        this.formatted = ctx.selectedFormatted
        // The following will be an empty string until a valid date is entered
        this.selected = ctx.selectedYMD
      },
      onSearch (evt) {
        if (this.startDate !== '' && this.endDate !== '') {
          var arrStartDate = this.startDate.split('-')
          var startDate = new Date(arrStartDate[0], arrStartDate[1] - 1, arrStartDate[2])
          var arrEndDate = this.endDate.split('-')
          var endDate = new Date(arrEndDate[0], arrEndDate[1] - 1, arrEndDate[2])

          this.dspList = this.logList.filter(function(item) {
            var logDate = new Date(Number(item.logDttm.substring(0, 4)), Number(item.logDttm.substring(4, 6)) - 1, Number(item.logDttm.substring(6, 8)))

            if (startDate.getTime() <= logDate.getTime() && endDate >= logDate.getTime()) {
              return item
            }
          })
        }
      },
      onSearchUser (evt) {
        console.log('onSearchUser')
        console.log(this.userList)
        var self = this

        this.dspUserList = this.userList.filter(function (item) {
          if (self.modelSearchUserType === '00') {
            if (item.userId.toLowerCase().includes(self.searchText)) {
              return item
            }
          } else {
            if (item.userName.toLowerCase().includes(self.searchText)) {
              return item
            }
          }
        })
      },
      onDownloadLog (path) {
        ipcRenderer.send('open-file-dialog-for-dir', path)
      },
      onDownloadXlsx (path, jsonData, fileName) {
        var dataWS = XLSX.utils.json_to_sheet(jsonData)
        // 엑셀의 workbook을 만든다
        // workbook은 엑셀파일에 지정된 이름이다.
        var wb = XLSX.utils.book_new()
        // workbook에 워크시트 추가
        // 시트명은 'nameData'
        XLSX.utils.book_append_sheet(wb, dataWS, '')
        // 엑셀 파일을 내보낸다.
        XLSX.writeFile(wb, path + '/' + fileName)
      },
      sendSearchCardCount () {
        console.log('sendSearchCardCount')

        var params = {
          jobCmd: 'SEARCH_CARD_COUNT',
          reqUserId: this.getCurrentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          testType: '05'
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      }
    }
  }
</script>
<style>
  .collapseListTitle {
    height: 50px;
    font-size: 20px;
    border: 1px solid gray;
    padding-left: 10px;
    padding-top: 7px;
  }
  .collapseListTitle:hover {
    background-color: #0075DB;
  }
  .collapseListTitleOpen {
    background-color: #0075DB;
  }
  .collapseListSubTitle {
    height: 40px;
    font-size: 17px;
    padding-left: 22px;
    padding-top: 5px;
    color: gray;
  }
  .collapseListSubTitle:hover {
    color: white;
  }
</style>
