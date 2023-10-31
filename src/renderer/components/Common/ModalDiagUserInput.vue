<template>
  <div class="container">
    <div class="modalTitle">
      <span>User Input</span>
      <img src="~@/assets/login/ic_clear_black_48dp.png" class="pointer float-right" @click="onClose" />
    </div>
    <div class="modalContent mt-3 pb-3 pl-3 pr-3">
      <div v-if="this.type === 'yesno'">
        <b-form-select v-model="modelDegree" :options="modelDegreeOptions" size="sm"></b-form-select>
      </div>
      <div v-else>
        <b-form-input type="number" v-model="inputValue" size="sm"></b-form-input>
      </div>
      <div class="text-right mt-3">
        <b-button class="custom-blue-btn" @click="onOk" size="sm">OK</b-button>
        <b-button class="custom-blue-btn" @click="onCancel" size="sm">CANCEL</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Constant from '../../../Constant'
  import worker from '../../workers/promise'
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-diag-user-input',
    props: ['node', 'type'],
    beforeDestroy () {
    },
    mounted () {
      console.log(this.node)
    },
    data: function () {
      return {
        modelDegree: 'N',
        modelDegreeOptions: [
          { value: 'N', text: 'N'},
          { value: 'P', text: 'P'}
        ],
        inputValue: ''
      }
    },
    methods: {
      onOk (evt) {
        if (this.type === 'yesno') {
          this.node.value = this.modelDegree
          this.EventBus.$emit(Constant.DIAG_UPDATE_RBC_DEGREE, this.node)
        } else {
          this.node.value = this.inputValue
          this.EventBus.$emit(Constant.DIAG_UPDATE_INPUT, this.node)
        }

        this.$emit('close')
      },
      onCancel (evt) {
        this.$emit('close')
      },
      onClose (evt) {
        this.$emit('close')
      }
    }
  }
</script>

<style>
  .modalTitle {
    padding: 10px;
  }
</style>
