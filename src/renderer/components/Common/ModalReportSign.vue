<template>
  <div class="container p-0">
    <div class="modalTitle">
      <b-row>
        <b-col>
          <img src="~@/assets/icon/chart.png" class="pointer" style="width: 5%;"/>
          <span>Submit</span>
          <img src="~@/assets/login/ic_clear_black_48dp.png" class="pointer float-right" @click="onClose" />
        </b-col>
      </b-row>
    </div>

    <div class="modalContent p-3 text-center">
      <h5>Modifications cannot be made after the final sign</h5>
      <div class="colorGray" style="font-size: 18px;">Have you cheked the classification of all cells?</div>
      <b-row class="mt-4">
        <b-col cols="3" class="text-right">
          <div>User ID : </div>
        </b-col>
        <b-col>
          <b-form-input id="userId" type="text" v-model="userId" size="sm"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col cols="3" class="text-right">
          <div>Password : </div>
        </b-col>
        <b-col>
          <b-form-input id="password" type="password" v-model="password" size="sm"></b-form-input>
        </b-col>
      </b-row>
      <div class="mt-3 text-right">
        <b-button variant="outline-secondary" @click="onClose">Cancel</b-button>
        <b-button variant="primary" @click="onSign">Yes, Submit</b-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Constant from '../../../Constant'
  const ipcRenderer = require('electron').ipcRenderer

  export default {
    name: 'modal-sign',

    data: function () {
      return {
        userId: '',
        password: ''
      }
    },
    props: ['orderId'],
    computed: {
      nameState () {
        // 로그인 사용자 ID 체크
        if (this.currentUser.userId !== this.userId) {
          return false
        } else {
          return true
        }
      },
      ...mapGetters({
        currentUser: Constant.GET_CURRENT_USER
      })
    },
    methods: {
      onClose (evt) {
        this.$emit('close')
      },
      onSign (evt) {
        if (!this.nameState) {
          this.$toasted.show(Constant.IDS_ERROR_LOGIN_ID, {
            position: 'bottom-center',
            duration: '2000'
          })

          return
        }
        // 패스워드 체크
        if (this.password !== null && this.password !== '') {
          var user = this.$store.getters.getUser(this.currentUser.userId)
          var decPassword = this.$CryptoJS.AES.decrypt(user.encPassword, this.password).toString(this.$CryptoJS.enc.Utf8)

          if (decPassword !== this.password) {
            this.$toasted.show(Constant.IDS_ERROR_NOT_MATCHED_PASSWORD, {
              position: 'bottom-center',
              duration: '2000'
            })
          } else {
            this.$toasted.show(Constant.IDS_MSG_SIGNING_COMPLETE, {
              position: 'bottom-center',
              duration: '2000'
            })

            var obj = {
              state: 'Signed',
              orderId: this.orderId,
              userId: this.currentUser.userId
            }
            // this.$store.dispatch(Constant.UPDATE_SIGNED_STATE, obj)
            ipcRenderer.send(Constant.UPDATE_SIGNED_STATE, JSON.stringify(obj))
            this.$store.dispatch(Constant.UPDATE_SIGNED_WORK_LIST, obj)
            this.$emit('close')
            this.$router.push({path: '/homePage/result'})
          }
        } else {
          this.$toasted.show(Constant.IDS_ERROR_NOT_MATCHED_PASSWORD, {
            position: 'bottom-center',
            duration: '2000'
          })
        }
      }
    }
  }
</script>

<style>
</style>
