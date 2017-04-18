<!-- loadFailure -->
<template>
  <div class="loadFailure">
    <div class="loadFailure-content">
      <div class="imgBox">
        <img src="../../assets/images/monster_bg.png" alt="">
      </div>
      <p class="prompt-text">你的网页被怪兽吃了，请重新获取。</p>
      <div class="btnBox">
          <mt-button @click="refresh()" class="refreshBtn" type="default" size="large">点击获取</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
  //修改
  import { Button } from 'mint-ui'
  //修改  导入插件
  // import axios from 'axios'
  // import qs from 'qs'
  // import utils from 'utility'
  // import env from '../../../env.js'


  export default {
    components: {
      'mt-button': Button
    },
    data () {
      return {
      }
    },
    methods: {
      refresh() {
        console.log('刷新当前页面')
        window.location.reload()
      }
    },
    mounted() {
      dd.biz.navigation.setTitle({
        title: '加载超时',  // 控制标题文本，空字符串表示显示默认文本
        onSuccess: function (result) {
        },
        onFail: function (erro) {}
      })
    }
  }
</script>

<style lang="sass">
  .loadFailure
    .loadFailure-content
      padding-top: 40%
      .imgBox
        width: 50%
        margin: 0px auto
        img
          width: 100%
      .prompt-text
        text-align: center
        margin-top: 15px
        color: #666
        padding: 10px 0px
      .btnBox
        margin-top: 30px
        padding: 0px 20%
        .refreshBtn
          background: #56d176
          color: #fff
</style>
