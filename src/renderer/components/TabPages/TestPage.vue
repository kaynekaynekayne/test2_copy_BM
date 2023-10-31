<template>
  <b-container id="testPage" fluid>
    <b-row>
      <b-col class="colbox" cols="3">
        <exec-controller></exec-controller>
        <processing-info></processing-info>
        <order-list></order-list>
      </b-col>
      <b-col class="colbox pl-1">
        <b-row>
          <b-col cols="3" class="pl-3 pr-2">
            <processing-panel></processing-panel>
          </b-col>
          <b-col class="pl-0 pr-2">
            <test-results></test-results>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="mt-2 pr-2">
            <founding-cells></founding-cells>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ExecController from './Test/ExecController'
  import OrderList from './Test/OrderList'
  import ProcessingPanel from './Test/ProcessingPanel'
  import TestResults from './Test/TestResults'
  import FoundingCells from './Test/FoundingCells'
  import ProcessingInfo from './Test/ProcessingInfo'
  import { mapGetters } from 'vuex'
  import Constant from '../../../Constant'
  import worker from '../../workers/promise'

  export default {
    name: 'test-page',
    components: { ExecController, OrderList, ProcessingPanel, TestResults, FoundingCells, ProcessingInfo },
    computed: {
      ...mapGetters({
        currentUser: Constant.GET_CURRENT_USER
      })
    },
    mounted () {
      this.sendSearchCardCount()
    },
    methods: {
      sendSearchCardCount () {
        console.log('sendSearchCardCount')

        var params = {
          jobCmd: 'SEARCH_CARD_COUNT',
          reqUserId: this.currentUser.userId,
          reqDttm: this.$getDateTimeStr(),
          testType: '05'
        }

        worker.sendDataToServer(this, JSON.stringify(params))
      }
    }
  }
</script>
<style>
  #testPage {
    padding-left: 20px;
    padding-right: 20px;
  }
</style>
