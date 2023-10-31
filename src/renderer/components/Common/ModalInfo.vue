<template>
  <div class="container p-0">
    <div class="modalTitle">
      <b-row>
        <b-col>
          <img src="~@/assets/icon/chart.png" class="pointer" style="width: 5%;"/>
          <span>Inforamtion</span>
          <img src="~@/assets/login/ic_clear_black_48dp.png" class="pointer float-right" @click="onClose" />
        </b-col>
      </b-row>
    </div>

    <div class="modalContent mt-3 pb-3 pl-3 pr-3">
      <div>
        {{ modalContent }}
      </div>
      <div class="text-right mt-3">
        <b-button class="custom-blue-btn" @click="onOk" size="sm">OK</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'modal-info',
    props: [
      'item',
      'path'
    ],
    mounted () {
      this.modalContent = this.item
    },
    data: function () {
      return {
        modalContent: ''
      }
    },
    methods: {
      onOk (evt) {
        if (this.path !== null && typeof(this.path) !== 'undefined') {
          this.EventBus.$emit('CHANGE_TAB', {id: this.path})
        }
        this.$emit('close')
      },
      onClose (evt) {
        this.$emit('close')
      }
    }
  }
</script>

<style>
</style>
