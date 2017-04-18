<template>
  <div class="setPassword">
    <!-- 头部 -->
    <!-- <mt-header class="setPassword-header" fixed title="身份验证">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header> -->
    <!-- 内容 -->
    <div class="setPassword-content">
      <!-- 输入框 -->
      <div class="setPassword-input">
        <mt-field :value="telephone" readonly="true" disableClear="true" class="field-tel" type="tel"></mt-field>
        <a class="mint-cell mint-field field-tel is-nolabel display-flex">
          <div class="mint-cell-wrapper clear-border">
            <div class="mint-cell-value">
              <input type="number" placeholder="请输入验证码" class="mint-field-core" v-model="verificationCode">
            </div>
          </div>
          <mt-button class="verification-btn" type="primary" @click="verificationClick">{{verificationBtn}}</mt-button>
        </a>
      </div>
      <!-- 提交按钮 -->
      <div class="submit-box">
        <mt-button size="large" type="primary" @click="submit()">提交</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  //修改
  import { Header, Button, Field, Toast } from 'mint-ui'
  //修改  导入插件
  import axios from 'axios'
  import qs from 'qs'
  import utils from 'utility'
  import env from '../../../env.js'


  export default {
    components: {
      'mt-header': Header,
      'mt-button': Button,
      'mt-field': Field
    },
    data () {
      return {
        telephone: null,
        verificationBtn: '获取短信验证码',
        nums: 60,
        btn: null,
        clock: null,
        telNumber: '',
        // 修改
        verificationCode: null,
        code_md5: null
      }
    },
    methods: {
      verificationClick() {
        var tmp = this
        tmp.btn = document.getElementsByClassName('verification-btn')[0]
        tmp.btn.disabled = true
        tmp.btn.style.opacity = '0.6'
        tmp.verificationBtn = tmp.nums + '秒后可重新获取'
        tmp.clock = setInterval(tmp.doLoop, 1000)

        //修改 发送验证码
        var userid = window.dd_userid
        axios.post(env.API_HOST + 'index.php?g=hrm&m=api&a=verificationCode',
        qs.stringify({'user_id': userid})).then(function (response) {
          if (response.status === 200 && response.data.result === 1) {
            //保存验证码
            console.log(response.data)
            tmp.code_md5 = response.data.code
            Toast({
              message: '短信发送成功',
              duration: 1000,
              className: 'toast-message'
            })
          }else{
            Toast({
              message: '短信发送失败,请联系管理员',
              duration: 1000,
              className: "toast-message"
            })
          }
        })
      },
      // 修改
      submit() {
        var tmp = this
        console.log('提交')
        console.log(tmp.code_md5)
        if (tmp.code_md5){
          if (tmp.verificationCode === '') {
              Toast({
                message: '请填写验证码',
                duration: 1000,
                className: 'toast-message'
              })
          }else {
            console.log(tmp.verificationCode)
            console.log(utils)
            // 判断是否与md5相等
            // let f = utils.md5(tmp.verificationCode + 'tchrm').should.equal(tmp.code_md5)
            console.log(utils.md5(tmp.verificationCode + 'tchrm'))
            console.log('+++++++++++++++++')
            console.log(tmp.code_md5)
            let f = (utils.md5(tmp.verificationCode + 'tchrm') === tmp.code_md5) ? true : false
            console.log(f)
            if (f) {
              tmp.$router.replace('/')
              window.md5 = null
              console.log(window.md5)
            } else {
              tmp.code_md5 = ''
              Toast({
                message: '验证码错误，请重新获取',
                duration: 1000,
                className: 'toast-message'
              })
            }
          }
        }else{
          return
        }
      },
      doLoop() {
         var tmp = this
         tmp.nums--
         if (tmp.nums > 0) {
          tmp.verificationBtn = tmp.nums + '秒后可重新获取'
         } else {
          clearInterval(tmp.clock) // 清除js定时器
          tmp.btn.disabled = false
          tmp.verificationBtn = '获取短信验证码'
          tmp.btn.style.opacity = '1'
          tmp.nums = 60 // 重置时间
         }
      }
    },
    mounted() {
      var tmp = this
      tmp.telephone = '发送验证码至：' + window.telephone
      console.log(tmp.telephone)
      var tdp = tmp.$router
      dd.biz.navigation.setTitle({
        title: '身份验证',  // 控制标题文本，空字符串表示显示默认文本
        onSuccess: function (result) {
        },
        onFail: function (erro) {}
      })
      dd.biz.navigation.setLeft({
        show: true,  // 控制按钮显示， true 显示， false 隐藏， 默认true
        control: true,  // 是否控制点击事件，true 控制，false 不控制， 默认false
        showIcon: true,  // 是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
        text: '返回',   // 控制显示文本，空字符串表示显示默认文本
        onSuccess : function(result) {
        // 如果control为true，则onSuccess将在发生按钮点击事件被回调
        tdp.replace('/salaryBill')
        },
        onFail : function(err) {}
      })
      dd.biz.navigation.setRight({
        show: false,   // 控制按钮显示， true 显示， false 隐藏， 默认true
        control: true,   // 是否控制点击事件，true 控制，false 不控制， 默认false
        text: '',   // 控制显示文本，空字符串表示显示默认文本
        onSuccess : function(result) {
          // 如果control为true，则onSuccess将在发生按钮点击事件被回调
        },
        onFail : function(err) {}
      })
    }
  }
</script>

<style lang="sass">
  .setPassword
    // .setPassword-header
    //   height: 50px
    .setPassword-content
      background: #e6e6e6
      padding-top: 20px
      .setPassword-input
        border-top: 1px solid #d5d5d5
        border-bottom: 1px solid #d5d5d5
        .field-tel
          padding: 0px 15px
          .mint-cell-wrapper
            border-bottom: 1px solid #d5d5d5
            background-size: 120% 0px
        .display-flex
          display: -webkit-flex; /* Safari */
          display: flex
          align-items: center
          justify-content: space-between
          .clear-border
            border: none
            width: 50%
          .verification-btn
            font-size: 12px
      .submit-box
        margin-top: 20px
        padding: 15px
        background: #fff
        button
          font-size: 14px
</style>
