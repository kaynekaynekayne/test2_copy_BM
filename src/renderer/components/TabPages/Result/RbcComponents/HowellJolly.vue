<template>
  <div id="divHowellJolly">
    <div v-if="signedState !== 'Signed'" v-drag-target id="19_HowellJolly" class="data-draggable-target" data-draggable="target" @wheel.ctrl="zoom"
      style="text-align: left; overflow: auto;">
      <img class="data-draggable-item" data-draggable="item" v-for="howellJolly in howellJollyList" :src="howellJolly" style="width: 120px;">
    </div>
    <div v-else id="19_HowellJolly" @wheel.ctrl="zoom" style="text-align: left; overflow: auto;">
      <img v-for="howellJolly in howellJollyList" :src="howellJolly" style="width: 115px; margin-left: 10px; margin-top: 5px;">
    </div>
  </div>
</template>

<script>
  const fs = require('fs')
  const path = require('path')
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'
  import ModalInfo from '../../../Common/ModalInfo'

  export default {
    name: 'howell-jolly',
    computed: {
      ...mapGetters({
        settings: Constant.GET_SETTINGS,
        // workList: Constant.GET_WORK_LIST,
        commonCode: Constant.GET_COMMON_CODE
      })
    },
    props: ['paramItem'],
    watch: {
      // orderId: function (newVal, oldVal) {
      //   this.initElement(newVal)
      // },
      // paramItem: function(newObj, oldObj) {
      //   console.log(newObj)
      //   this.selectedItem = newObj
      //   this.initElement()
      // }
      paramItem: function(newObj, oldObj) {
        this.selectedItem = newObj

        this.initElement()
      }
    },
    data () {
      return {
        howellJollyList: [],
        filterExp: /^.png|.jpg|.bmp$/,
        filterKor: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
        selectedItem: null,
        signedState: ''
      }
    },
    mounted () {
      this.selectedItem = JSON.parse(this.$route.params.selectedItem)
      this.signedState = this.selectedItem.SIGNED_STATE
    },
    methods: {
      initElement () {
        try {
          var self = this
          // for (var i = 0; i < this.workList.length; i++) {
          //   if (this.workList[i].ORDER_ID === orderId) {
          //     this.selectedItem = this.workList[i]
          //   }
          // }

          var rootPath = this.settings.pbiaRootPath + '/' + this.selectedItem.SLOT_ID
          var slotDirList = fs.readdirSync(rootPath)
          var rootPathHowellJolly = null

          for (var i = 0; i < slotDirList.length; i++) {
            if (slotDirList[i].includes(this.settings.rbcClassificationDirNm)) {
              rootPathHowellJolly = rootPath + '/' + slotDirList[i] + '/' + this.settings.howellJollyDirNm
            }
          }

          var howellJollyFiles = fs.readdirSync(rootPathHowellJolly).filter(function (file) {
            return self.filterExp.test(path.extname(file).toLowerCase()) && !self.filterKor.test(file)
          })

          this.howellJollyList = []
          for (var i = 0; i < howellJollyFiles.length; i++) {
            this.howellJollyList.push('file://' + rootPathHowellJolly + '/' + howellJollyFiles[i])
          }

        } catch (err) {
          this.$modal.show(ModalInfo, {item: err.message, path: 5}, {
            height: 'auto',
            width: '550px'
          })
        }
      },
      zoom (evt) {
        var targetElement = null
        if (evt.target.querySelectorAll('img').length <= 0) {
          targetElement = evt.target.parentElement
        } else {
          targetElement = evt.target
        }

        if (evt.deltaY < 0) {
          var width = 0
          var images = targetElement.querySelectorAll('img')

          width = (images[0].offsetWidth + 1) + 'px'
          if ((images[0].offsetWidth + 1) < 192) {
            for (var i = 0; i < images.length; i++) {
              images[i].style.width = width
            }
          }
        } else {
          var width = 0
          var images = targetElement.querySelectorAll('img')

          width = (images[0].offsetWidth - 1) + 'px'
          if ((images[0].offsetWidth - 1) > 65) {
            for (var i = 0; i < images.length; i++) {
              images[i].style.width = width
            }
          }
        }
      }
    }
  }
</script>

<style>
</style>
