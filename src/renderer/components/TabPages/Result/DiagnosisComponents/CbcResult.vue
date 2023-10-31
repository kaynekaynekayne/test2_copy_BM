<template>
  <b-container id="cbcResult" fluid>
    <b-row>
      <b-col class="p-0">
        <b-card id="cbcResultCard" text-variant="white" no-body>
          <div class="border-bottom borderColorGray pl-3 pt-2 pb-2">
            CBC (Complete blood cell count)
          </div>

          <div style="overflow-y: scroll; overflow-x: hidden; height: 770px;">
            <b-row>
              <b-col>
                111
              </b-col>
              <b-col>
                222
              </b-col>
            </b-row>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../../../Constant'

  export default {
    name: 'cbc-result',
    computed: {
      ...mapGetters({
      })
    },
    props: ['orderId'],
    watch: {
      orderId: function(newVal, oldVal) { // watch it
        console.log(newVal)
      }
    },
    data () {
      return {
      }
    },
    beforeDestroy () {
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style>
  #cbcResultCard {
    background-color: #282828 !important;
    border-radius: 5px;
    box-shadow: 2px 2px 2px black;
    border: 1px solid #303744;
    height: 862px;
  }
</style>
