import Vue from 'vue'
import Router from 'vue-router'
import VueCryptojs from 'vue-cryptojs'
import store from '../store'

Vue.use(Router)

async function redirectAutoLogin (to, from, next) {
  // console.log(store.state.CommonStore.settings)
  var isAutoLogin = store.state.CommonStore.settings.isAutoLogin
  var saveId = store.state.CommonStore.settings.isAutoLogin.saveId
  var savePassword = store.state.CommonStore.settings.isAutoLogin.savePassword

  // console.log(from)
  if (isAutoLogin && saveId !== '' && savePassword !== '' && from.fullPath === '/') {
    next('/homePage/orderEntry')
  } else {
    next()
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: require('@/components/LoginPage').default,
      beforeEnter: redirectAutoLogin
    },
    {
      path: '/loginPage',
      name: 'loginPage',
      component: require('@/components/LoginPage').default,
      beforeEnter: redirectAutoLogin
    },
    {
      path: '/homePage',
      name: 'homePage',
      component: require('@/components/HomePage').default,
      children: [
        {
          path: 'test',
          component: require('@/components/TabPages/TestPage').default
        },
        {
          path: 'result',
          component: require('@/components/TabPages/ResultPage').default
        },
        {
          path: 'orderEntry',
          component: require('@/components/TabPages/OrderEntry').default
        },
        {
          path: 'resultClassification/:orderId',
          component: require('@/components/TabPages/resultClassification').default,
          children: [
            {
              path: 'finalReport/:selectedItem',
              component: require('@/components/TabPages/result/FinalReport').default
            },
            {
              path: 'rbcReport/:selectedItem',
              component: require('@/components/TabPages/result/RbcReport').default
            },
            {
              path: 'wbcReport/:selectedItem',
              component: require('@/components/TabPages/result/WbcReport').default
            },
            {
              path: 'wholeSlideReport/:selectedItem',
              component: require('@/components/TabPages/result/WholeSlideReport').default
            },
            {
              path: 'bmCellReport/:selectedItem',
              component: require('@/components/TabPages/result/BmCellReport').default
            },
            {
              path: 'bmBiopsy/:selectedItem',
              component: require('@/components/TabPages/result/BmBiopsy').default
            },
            {
              path: 'diagnosis/:selectedItem',
              component: require('@/components/TabPages/result/Diagnosis').default
            }
          ]
        },
        {
          path: 'settings',
          component: require('@/components/TabPages/SettingsPage').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
