<template>
  <b-container id="rbcTilingViewer" fluid>
    <b-row>
      <b-col class="pl-0 pr-0 pt-1">
        <b-card id="cardRowMagnification" class="blackCard" text-variant="white" no-body>
          <div id="rbcTilingToolbar">
            <img id="popoverBrightness" class="pointer ml-3" src="~@/assets/result/brightness.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverBrightness"
              placement="bottom"
              title="Brightness"
              triggers="hover focus"
            >
              <vue-slider
                class="mt-2 mr-3"
                v-model="brightnessValue"
                :min="50"
                :max="150"
                :width="150"
                :process-style="{ backgroundColor: '#20968E' }" />
            </b-popover>

            <!-- RGB -->
            <img id="popoverRGB" class="pointer ml-3" src="~@/assets/result/rgb.png" style="width: 25px; height: 25px;"/>
            <b-popover
              target="popoverRGB"
              placement="bottom"
              title="RGB"
              triggers="hover focus"
            >
              <vue-slider
                class="mt-2 mr-3"
                v-model="redValue"
                :min="0"
                :max="255"
                :width="150"
                :process-style="{ backgroundColor: 'red' }" />
              <vue-slider
                class="mt-2 mr-3"
                v-model="greenValue"
                :min="0"
                :max="256"
                :width="150"
                :process-style="{ backgroundColor: 'green' }" />
              <vue-slider
                class="mt-2 mr-3"
                v-model="blueValue"
                :min="0"
                :max="256"
                :width="150"
                :process-style="{ backgroundColor: 'blue' }" />
              <b-button class="w-100 mt-2" variant="outline-primary" size="sm" @click="onRgbReset">Reset</b-button>
            </b-popover>

            <b-icon v-if="!isCropMode" icon="crop" class="pointer ml-3" style="width: 17px; height: 17px;" @click="onClickCrop"
              v-b-tooltip.hover title="crop malaria"></b-icon>
            <b-icon v-else="isCropMode" icon="crop" class="pointer ml-3" style="width: 17px; height: 17px;" @click="onClickCrop"
              v-b-tooltip.hover title="crop malaria" variant="danger"></b-icon>
          </div>
          <b-tabs v-model="tabIndex" pills card lazy>
            <b-tab title="Low magnification" :title-link-class="linkClass(0)" active @click="onClickTab">
              <tiling-viewer :param-item="paramItem"></tiling-viewer>
            </b-tab>
            <b-tab title="Malaria" :title-link-class="linkClass(1)" @click="onClickTab">
              <malaria-image :param-item="paramItem"></malaria-image>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import ModalInfo from '../../../Common/ModalInfo'
  import MalariaImage from './MalariaImage'
  import TilingViewer from './TilingViewer'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/antd.css'

  const fs = require('fs')
  const path = require('path')
  const ipcRenderer = require('electron').ipcRenderer

  // const jarPath = 'D:/UIMD_Data/UI_DB/pyramidio-cli-1.1.0.jar'

  export default {
    name: 'rbc-tiling-viewer',
    components: { MalariaImage, VueSlider, TilingViewer },
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS
      })
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newObj, oldObj) {
        console.log(newObj)
        this.rbcSelectedItem = newObj
      },
      brightnessValue: function(newVal, oldVal) {
        this.EventBus.$emit('SET_RBC_BRIGHTNESS', this.brightnessValue)
        this.$store.dispatch(Constant.SET_RBC_BRIGHTNESS_SLIDE_VALUE, newVal)
      },
      redValue: function(newVal, oldVal) {
        this.EventBus.$emit('SET_RED_VALUE', newVal)
        this.$store.dispatch(Constant.SET_RBC_RED_VALUE, newVal)
      },
      greenValue: function(newVal, oldVal) {
        this.EventBus.$emit('SET_GREEN_VALUE', newVal)
        this.$store.dispatch(Constant.SET_RBC_GREEN_VALUE, newVal)
      },
      blueValue: function(newVal, oldVal) {
        this.EventBus.$emit('SET_BLUE_VALUE', newVal)
        this.$store.dispatch(Constant.SET_RBC_BLUE_VALUE, newVal)
      }
    },
    data () {
      return {
        brightnessValue: 0,
        redValue: 0,
        greenValue: 0,
        blueValue: 0,
        tabIndex: 0,
        isCropMode: false,
        rbcSelectedItem: null
      }
    },
    beforeDestroy () {
      this.EventBus.$off('UPDATE_LOWMAGNIFICATION')
    },
    mounted () {
      var self = this

      this.$nextTick(function () {
        self.brightnessValue = self.settings.rbcBrightnessSlideValue
        self.redValue = self.settings.rbcRedValue
        self.greenValue = self.settings.rbcGreenValue
        self.blueValue = self.settings.rbcBlueValue

        self.EventBus.$on('UPDATE_LOWMAGNIFICATION', function(value) {
          self.isCropMode = false
        })
      })

    },
    methods: {
      onClickTab (e) {
        console.log('-onClickTab-')
        console.log(this.tabIndex)
        var self = this

        // malaria -> low
        setTimeout(function() {
          console.log(self.tabIndex)
          if (self.tabIndex === 0) {
            self.isCropMode = false
            self.EventBus.$emit('UPDATE_LOWMAGNIFICATION', self.rbcSelectedItem)
          } else {
            self.EventBus.$emit('UPDATE_MALARIA', self.rbcSelectedItem)
          }
        }, 100)
      },
      linkClass (idx) {
        if (this.tabIndex === idx) {
          return ['tabSelected']
        } else {
          return ['tabNonSelected']
        }
      },
      onRgbReset () {
        this.redValue = 0
        this.greenValue = 0
        this.blueValue = 0
      },
      onClickCrop () {
        this.isCropMode = !this.isCropMode
        this.EventBus.$emit('SET_CROP_MODE', this.isCropMode)
      }
    }
  }
</script>

<style>
  #cardRowMagnification {
    height: 905px;
  }
  #rbcTilingToolbar {
    width: 200px;
    position: absolute;
    top: 14px;
    right: 10px;
  }
</style>
