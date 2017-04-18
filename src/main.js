// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Mint from 'mint-ui'
import App from './App'
import { routes } from './routes'

// import env from '../env.js'
import axios from 'axios'
import Q from 'q'
import qs from 'qs'
import '../dingtalk.js'
// import ddPlugin from './vue-dd-plugin'
// import CallJsApi from './ddApiConfig.js'

import Icon from './Icon'

Vue.component('icon', Icon)

Icon.inject('down_arrow')
Icon.inject('setting')
Icon.inject('backspace')
Icon.inject('password')
import './assets/style/reset.css'

window.md5 = null
window.dd_userid = null
window.localStorage.loadFailure = 1

// 钉钉配置目录
let dd = window.dd
let ddConfig = null

// getConfig().then((data) => {
//   ddConfig = data
//     // 钉钉权限验证
//   dd.config(ddConfig)
// }).catch((err) => {
//   console.log(JSON.stringify(err))
// }).finally(() => {
//   ddIsReady()
//     .catch((err) => {
//       console.log(qs.stringify(err))
//     }).then(initVue)
//     .then(() => {
//       console.log('init vue complete')
//     })
// })

getConfig().then((data) => {
  ddConfig = data
    // 钉钉权限验证
  dd.config(ddConfig)
}).catch((err) => {
  console.log(JSON.stringify(err))
}).finally(() => {
  ddIsReady()
})

// ajax获取钉钉参数
function getConfig () {
  return Q.Promise((success, error) => {
    axios.post('http://dingding.tzyun.com/index.php?g=Ding&m=Auth&a=getConfig',
    qs.stringify({'event': 'get_config'})).then(function (response) {
      if (response.status === 200 || response.data.code === 200) {
        let res = response.data
        console.log(res)
        ddConfig = {
          agentId: res.agentId,
          corpId: res.corpId,
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          signature: res.signature,
          type: 0,
          jsApiList: [
            'runtime.info',
            'device.notification.prompt',
            'biz.chat.pickConversation',
            'device.notification.confirm',
            'device.notification.alert',
            'device.notification.prompt',
            'biz.chat.open',
            'biz.util.open',
            'biz.user.get',
            'biz.contact.choose',
            'biz.telephone.call',
            'biz.ding.post']
        }
        success(ddConfig)
      } else {
        loadFailure()
        error({errCode: -2, msg: '接口请求失败1'})
      }
    }).catch()
  })
}

// 初始化钉钉
function ddIsReady () {
  return Q.Promise((success, error) => {
    // 验证通过的回调函数，jsAPI在这里调用
    dd.ready(function () {
      console.log('初始化钉钉')
      dd.runtime.permission.requestAuthCode({
        corpId: ddConfig.corpId,
        onSuccess: function (info) {
          // 调试用
          axios.post('http://dingding.tzyun.com/index.php?g=Ding&m=Auth&a=UserId',
          qs.stringify({'code': info.code}), {timeout: 2000}).then(function (response) {
            console.log(response)
            if (response.status === 200 && response.data.code === 1) {
              let userID = response.data.id
              window.dd_userid = userID
              // 通过userid获取密码md5
              axios.post('http://dingding.tzyun.com/index.php?g=hrm&m=api&a=ReturnMd5',
              qs.stringify({'user_id': userID}), {timeout: 2000}).then(function (response) {
                console.log(response.data)
                if (response.status === 200 && response.data.result === 1) {
                  // 通过userid获取手机号
                  axios.post('http://dingding.tzyun.com/index.php?g=hrm&m=api&a=getMobile',
                  qs.stringify({'user_id': userID})).then(function (response) {
                    console.log(response)
                    var reg = /^(\d{3})\d{4}(\d{4})$/
                    window.telephone = response.data.telephone.replace(reg, '$1****$2')
                    console.log(window.telephone)
                  })
                  window.headerimg = response.data.headerimg
                  window.md5 = response.data.password
                  window.name = response.data.name
                  window.position = response.data.position
                  initVue()
                } else {
                  error({msg: '用户验证获取失败'})
                  window.localStorage.loadFailure = 0
                  loadFailure()
                }
              })
              .catch((error) => {
                console.log(error)
                console.log('请求超时')
                window.localStorage.loadFailure = 0
                loadFailure()
              })
            } else {
              error({msg: '用户钉钉ID获取失败'})
              window.localStorage.loadFailure = 0
              loadFailure()
            }
          })
          .catch((error) => {
            console.log(error)
            console.log('请求超时')
            window.localStorage.loadFailure = 0
            loadFailure()
          })
        },
        onFail: function (err) {
          loadFailure()
          error({msg: 'requestAuthCode Failed:' + qs.stringify(err)})
        }
      })
      success(true)
    })

        // 验证失败的回调
    dd.error(function (err) {
      // clearTimeout(timeout)
      loadFailure()
      console.error('dd error:' + JSON.stringify(err))
      error({errCode: -1, msg: 'dd.error配置信息有误'})
    })
  })
}

// 初始化vue
function initVue () {
  // Vue.use(ddPlugin)
  Vue.use(VueRouter)
  Vue.use(VueResource)
  Vue.use(Mint)
  const router = new VueRouter({
    routes
  })

  /* eslint-disable no-new */
  new Vue({
    router,
    el: '#app',
    template: '<App/>',
    components: { App }
  })
  router.push('/')

  console.log('init vue complete')
}

function loadFailure () {
  // Vue.use(ddPlugin)
  Vue.use(VueRouter)
  Vue.use(VueResource)
  Vue.use(Mint)
  const router = new VueRouter({
    routes
  })

  /* eslint-disable no-new */
  new Vue({
    router,
    el: '#app',
    template: '<App/>',
    components: { App }
  })
  router.push('/loadFailure')

  console.log('网页加载失败')
}
