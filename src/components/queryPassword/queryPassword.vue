<template>
  <div class="queryPassword">
    <!-- 内容 -->
    <div class="queryPassword-content">
      <!-- 请输入4位密码 -->
      <div class="inputPassword">
        <!-- 文字 提示 -->
        <h2 class="icon-text">
          <icon style="color: #333" slot="icon" name="password" scale="3"></icon>
          <span class="text">请输入四位数密码</span>
        </h2>
        <!-- 输入格子 -->
        <ul class="inputBox">
          <li class="liBox">
            <span class="spot" v-show="storageNumber.length >= 1"></span>
          </li>
          <li class="liBox">
            <span class="spot" v-show="storageNumber.length >= 2"></span>
          </li>
          <li class="liBox">
            <span class="spot" v-show="storageNumber.length >= 3"></span>
          </li>
          <li class="liBox">
            <span class="spot" v-show="storageNumber.length >= 4"></span>
          </li>
        </ul>
        <div class="forgetPasswordBox">
          <router-link class="forgetPassword" to="/forgetPassword">
            忘记密码？
          </router-link>
        </div>
      </div>
      <!-- 键盘 -->
      <div class="keyboard">
        <ul class="number-ul">
          <li class="number-li" v-for="n in 9">
            <button class="numberBtn" @touchstart="getNumber(n)" type="button">{{n}}</button>
          </li>
          <li class="null-li"><button type="button">0</button></li>
          <li class="number-li"><button class="numberBtn" @touchstart="getNumber(0)" type="button">0</button></li>
          <li class="btn-li">
            <button @touchstart="deleteNumber()" type="button">
              <icon style="color: #333" slot="icon" name="backspace" scale="4"></icon>
            </button>
          </li>
          <li class="clear"></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { Header, Button, Field, Toast } from 'mint-ui'
  import qs from 'qs'
  import axios from 'axios'
  import utils from 'utility'
  export default {
    components: {
      'mt-header': Header,
      'mt-button': Button,
      'mt-field': Field
    },
    data () {
      return {
        storageNumber: [],
        numberBtn: null,
        // password: '1014',  // 模拟密码
        passwordNumber: 5,  // 记录输入密码次数
        First: true,
        newPassword: null  // 新密码
      }
    },
    methods: {
      getNumber(num) { // 获得键盘 数字
        var tdp = this
        tdp.storageNumber.push(num)
        tdp.numberBtn = document.getElementsByClassName('numberBtn')
        var tmp = tdp.$router
        // 判断 当输入密码长度为 4 为时 获取到密码  做各种判断
        if (tdp.storageNumber.length === 4 && window.md5 !== null) {  // 判断 密码是否 存在 并且 按钮变为不可点击状态
          tdp.storageNumber = tdp.storageNumber.join('') // 数组转为 字符串
          tdp.passwordNumber--
          let f = (utils.md5(tdp.storageNumber + 'tchrm') === window.md5) ? true : false
          if (f) {
            // 输完密码做个 判断是否 正确
            Toast({
              message: '验证成功',
              duration: 500
            })
            setTimeout(() => {
              tmp.replace('/salaryBill')
            }, 500)
          } else {
            tdp.storageNumber = []   // 当前数组 变为空数组
            if (tdp.passwordNumber === 0) {
              tmp.replace('/forgetPassword')
            } else {
              Toast({
                message: '密码错误,还有' + tdp.passwordNumber + '次机会',
                duration: 500,
                className: 'toast-message'
              })
            }
          }
        } else if (tdp.storageNumber.length === 4 && window.md5 === null) {  // 当密码等于 4 为时
          tdp.newPassword = tdp.storageNumber.join('') // 数组转为 字符串
          axios.post('http://dingding.tzyun.com/index.php?g=hrm&m=api&a=setShowPassword',
          qs.stringify({'user_id': window.dd_userid, 'password': tdp.newPassword})).then(function (response) {
            tdp.storageNumber = []   // 当前数组 变为空数组
            Toast({
              message: '设置密码成功',
              duration: 500
            })
            setTimeout(() => {
              tmp.replace('/salaryBill')
            }, 500)
          })
        }
      },
      deleteNumber() {
        var tdp = this
        tdp.storageNumber.pop()
        if (tdp.storageNumber.length < 4) {  // 点击删除 当长度小于 4 按钮重新变为  可点击
          for (let i = 0; i < tdp.numberBtn.length; i++) {
            tdp.numberBtn[i].disabled = false
          }
        }
      },
      close() {
        dd.biz.navigation.close({
            onSuccess : function(result) {
            },
            onFail : function(err) {}
        })
      }
    },
    mounted() {
      var tdp = this
      if (window.md5 === null) {
        dd.biz.navigation.setTitle({
          title: '请设置安全密码',  // 控制标题文本，空字符串表示显示默认文本
          onSuccess: function (result) {
          },
          onFail: function (erro) {}
        })
      } else {
        dd.biz.navigation.setTitle({
          title: '查询密码验证',  // 控制标题文本，空字符串表示显示默认文本
          onSuccess: function (result) {
          },
          onFail: function (erro) {}
        })
      }
      dd.biz.navigation.setLeft({
        show: true,  // 控制按钮显示， true 显示， false 隐藏， 默认true
        control: true,  // 是否控制点击事件，true 控制，false 不控制， 默认false
        showIcon: true,  // 是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
        text: '返回',   // 控制显示文本，空字符串表示显示默认文本
        onSuccess : function(result) {
        // 如果control为true，则onSuccess将在发生按钮点击事件被回调
          tdp.close()
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
  .queryPassword
    .queryPassword-header
      height: 50px
    .queryPassword-content
      // margin-top: 50px
      .inputPassword
        margin-top: 25%
        .icon-text
          text-align: center
          .text
            vertical-align: middle
        .inputBox
          display: -webkit-flex /* Safari */
          display: flex
          justify-content: space-around
          padding: 0px 10%
          margin-top: 30px
          .liBox
            width: 50px
            height: 50px
            border: 2px solid #3397e4
            .spot
              display: block
              width: 25px
              height: 25px
              background: #0475cc
              border-radius: 50%
              margin: 0px auto
              margin-top: 12.5px
        .forgetPasswordBox
          text-align: center
          margin-top: 25px
          .forgetPassword
            color: #4395ff
      .keyboard
        position: fixed
        bottom: 0px
        width: 100%
        .number-ul
          li
            border-top: 1px solid #c2c2c2
            border-right: 1px solid #c2c2c2
            box-sizing: border-box
          .clear
            clear: both
          .null-li
            width: 33.3333333%
            background: #e2e2e2
            float: left
            button
              display: block
              padding: 15px 0px
              width: 100%
              border: 0px
              visibility: hidden
              outline: none
              font-size: 20px
          .number-li
            float: left
            width: 33.3333333%
            text-align: center
            button
              &:active
                background: #e2e2e2
              display: block
              padding: 15px 0px
              width: 100%
              border: 0px
              outline: none
              background: #f7f7f7
              font-size: 20px
          .btn-li
            float: left
            width: 33.3333333%
            background: #e2e2e2
            vertical-align: middle
            box-sizing: border-box
            button
              display: block
              padding: 9.25px 0px
              width: 100%
              border: 0px
              outline: none
              box-sizing: border-box
</style>
