<template>
  <b-container id="rbcImageViewer" fluid>
    <b-row class="h-100">
      <b-col class="p-0">
        <b-card id="cardRowMagnification" text-variant="white" no-body>
          <b-nav class="mt-2">
            <b-nav-item
              v-for="(item, index) in tabList"
              :id="item.id"
              :key="item.id"
              @click="onLink(item)"
              link-classes="tabStyleImageViewer">
                {{ item.title }}
            </b-nav-item>
          </b-nav>

          <div v-if="selectedTab.id === '1'" class="mt-4">
            <row-magnification-image :param-item="paramItem"></row-magnification-image>
          </div>
          <div v-else-if="selectedTab.id === '2'" class="mt-4">
            <malaria-image :param-item="paramItem"></malaria-image>
          </div>
          <div v-else-if="selectedTab.id === '3'" class="mt-4">
            <howell-jolly :param-item="paramItem"></howell-jolly>
          </div>
          <div v-else class="mt-4">
            <div>Please wait...</div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import RowMagnificationImage from './RowMagnificationImage'
  import MalariaImage from './MalariaImage'
  import HowellJolly from './HowellJolly'
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'

  export default {
    name: 'rbc-image-viewer',
    components: { RowMagnificationImage, MalariaImage, HowellJolly },
    computed: {
      ...mapGetters({
        // workList: Constant.GET_WORK_LIST
      })
    },
    props: ['paramItem'],
    watch: {
      paramItem: function(newObj, oldObj) {
        console.log(newObj)

        this.selectedItem = newObj
        this.signedState = newObj.SIGNED_STATE

        if (typeof(this.selectedTab.id) === 'undefined') {
          this.onLink(this.tabList[0])
        }
      }
    },
    data () {
      return {
        // tabIndex: 0,
        tabList: [{id: '1', title: 'Low magnification'},
          {id: '2', title: 'Malaria'},
          {id: '3', title: 'Howell-Jolly body'}],
        selectedItem: null,
        selectedTab: {},
        signedState: ''
      }
    },
    methods: {
      // linkClass(idx) {
      //   if (this.tabIndex === idx) {
      //     return ['tabSelected']
      //   } else {
      //     return ['tabNonSelected']
      //   }
      // },
      // initElement (orderId) {
        // for (var i = 0; i < this.workList.length; i++) {
        //   if (this.workList[i].ORDER_ID === orderId) {
        //     this.signedState = this.workList[i].SIGNED_STATE
        //   }
        // }
      // },
      onLink (item) {
        var self = this

        this.selectedTab = item

        for (var i = 0; i < this.tabList.length; i++) {
          if (this.tabList[i].id === item.id) {
            document.getElementById(item.id).children[0].classList.add('tabStyleImageViewerActive')
          } else {
            document.getElementById(this.tabList[i].id).children[0].classList.remove('tabStyleImageViewerActive')
          }
        }
      }
    }
  }
</script>

<style>
  #cardRowMagnification {
    background-color: #282828 !important;
    padding: 3px 10px 20px 10px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px black;
    border: 1px solid #303744;
    height: 910px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .tabStyleImageViewer {
    color: white;
    width: 150px;
    background-color: #1B2A42;
    text-align: center;
    font-size: 13px;
    border-radius: 5px;
  }
  .tabStyleImageViewerActive {
    background-color: #1561D6;
  }
</style>
