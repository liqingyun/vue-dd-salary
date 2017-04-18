<template>
  <div class="salaryBill">
    <div class="salaryBill-content">
      <!-- 信息选择 -->
        <div class="personal-information">
          <div class="information-box">
            <div class="headPortrait">
              <img :src="information.url" width="40" alt="">
            </div>
            <div class="nickname-box">
              <h1 class="name">{{information.nickname}}</h1>
              <span class="title">{{information.title}}</span>
            </div>
          </div>
          <div v-show="timeSlotBtn" class="timeSlot-box" @click="toggleTime()">
            <div class="button-box">
              {{timeSlot1}} 至 {{timeSlot2}}
              <icon style="color: #26a2ff" slot="icon" name="down_arrow" scale="2"></icon>
            </div>
          </div>
        </div>
      <!-- 列表 -->
      <div class="salaryBill-list">
        <div class="itme-list" @click="clickGetCurrent(item)" v-for="item in salaryList">
          <mt-cell is-link style="border-bottom: 1px solid #e6e6e6" :title="item.time" :value="item.money" :key="item.id"></mt-cell>
        </div>
        <!-- 提示消息 -->
        <div class="NoRecord" v-show="NoRecord">
            <h1 class="NoRecord-text">你还没有薪资记录！</h1>
            <h1 class="NoRecord-text">快去工作吧！</h1>
            <div class="NoRecord-imgBox">
              <img class="NoRecord-img" src="../../../assets/images/work_character.png" alt="">
            </div>
        </div>
     </div>
    </div>
    <!-- 遮罩层 -->
    <mt-popup class="myPopup" v-model="timePopup" position="bottom">
      <div class="picker-bg">
        <mt-header class="popup-head">
            <mt-button @click="timePopup = !timePopup" slot="left">取消</mt-button>
            <mt-button @click="confirmTime()"slot="right">确认</mt-button>
        </mt-header>
        <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
      </div>
    </mt-popup>
  </div>
</template>

<script type="text/ecmascript-6">
  import { Header, Cell, Button, Picker, Indicator, Popup, MessageBox } from 'mint-ui'
  import qs from 'qs'
  import axios from 'axios'
  export default {
    components: {
      'mt-header': Header,
      'mt-cell': Cell,
      'mt-button': Button,
      'mt-picker': Picker,
      'mt-popup': Popup
    },
    data () {
      return {
        NoRecord: false,
        timeSlotBtn: false,
        information: {
          url: window.headerimg,
          nickname: window.name,
          title: window.position
        },
        slots: [
          {
            flex: 1,
            values: [
            ],
            className: 'slot1',
            textAlign: 'right'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: [
            ],
            className: 'slot3',
            textAlign: 'left'
          }
        ],
        salaryList: [
        ],
        timePopup: false,
        timeSlot: '',
        timeSlot1: '',
        timeSlot2: ''
      }
    },
    methods: {
      onValuesChange(picker, values) {  // 滑动时间滚轴  获取选中时间
        var tmp = this
        if (values[0] > values[1]) {
          picker.setSlotValue(1, values[0])
        }
        tmp.timeSlot = picker.getValues()
      },
      confirmTime() {  // 点击确认  选择时间段  查询薪资记录
        var tmp = this
        if (tmp.timeSlot[0] && tmp.timeSlot[1]) {
          tmp.timePopup = !tmp.timePopup
          Indicator.open({
            text: '加载中...',
            spinnerType: 'fading-circle'
          })
          // 工资查询
          axios.post('http://dingding.tzyun.com/index.php?g=hrm&m=api&a=WageQuery',
          qs.stringify({'user_id': window.dd_userid,'start_time': tmp.timeSlot[0] ,'end_time': tmp.timeSlot[1]})).then(function (response) {
            tmp.salaryList = []
            var item = response.data.data
            for (var j in item) {
              var  list= {}
              if (!(item[j] instanceof Array)) {
                list.time = item[j].month
                list.money = '￥' + item[j].real_wages
                list.salaryId = item[j].id
                tmp.salaryList.push(list)
              }
            }
          })
          setTimeout(() => {
            tmp.timeSlot1 = tmp.timeSlot[0].replace(/年/g, '.').replace(/月/g, '')
            tmp.timeSlot2 = tmp.timeSlot[1].replace(/年/g, '.').replace(/月/g, '')
            Indicator.close()
          }, 1000)
        } else {
          tmp.timePopup = !tmp.timePopup
        }
      },
      toggleTime() {   //  切换日期选择
        var tmp = this
        console.log('点击选择日期')
        tmp.timePopup = !tmp.timePopup
        console.log(tmp.timePopup)
      },
      analogLoading() {    // 模拟加载   并 获取薪资记录列表
        var tmp = this
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        setTimeout(() => {
          Indicator.close()
          axios.post('http://dingding.tzyun.com/index.php?g=hrm&m=api&a=WageQuery',
          qs.stringify({'user_id': window.dd_userid})).then(function (response) {
            console.log(response)
            if (response.data.result === 1) {
              tmp.timeSlotBtn = true
              tmp.slots[0].values = response.data.data.Induction_time
              tmp.slots[2].values = response.data.data.Induction_time
              tmp.salaryList = []
              var defaultTime = response.data.data
              for (var k in defaultTime) {
                var  list= {}
                if (!(defaultTime[k] instanceof Array)) {
                  list.time = defaultTime[k].month
                  list.money = '￥' + defaultTime[k].real_wages
                  list.salaryId = defaultTime[k].id
                  tmp.salaryList.push(list)
                }
              }
              tmp.timeSlot1 = tmp.salaryList[0].time.replace(/年/g, '.').replace(/月/g, '')
              tmp.timeSlot2 = tmp.salaryList[tmp.salaryList.length-1].time.replace(/年/g, '.').replace(/月/g, '')
            } else {
              console.log('没有记录')
              tmp.NoRecord = true
              var timeValue = [response.data.time]
              tmp.slots[0].values = timeValue
              tmp.slots[2].values = timeValue
              tmp.timeSlot1 = response.data.time.replace(/年/g, '.').replace(/月/g, '')
              tmp.timeSlot2 = response.data.time.replace(/年/g, '.').replace(/月/g, '')
            }
          })
        }, 1000)
      },
      clickGetCurrent(data) {
        var tmp = this
        window.salaryId = data.salaryId
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        setTimeout(() => {
          Indicator.close()
          tmp.$router.replace('/recordDetails')
        }, 1000)
      }
    },
    mounted() {
      var tmp = this
      if (tmp.information.url === '') {
        tmp.information.url = require('../../../assets/images/default-teacher-avatar.png')
      }
      tmp.analogLoading()
      // 钉钉接口
      var tdp = tmp.$router
      dd.biz.navigation.setTitle({
        title: '薪资记录',  // 控制标题文本，空字符串表示显示默认文本
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
  .salaryBill
    .salaryBill-content
      background: #d5d5d5
      .personal-information
        display: -webkit-flex; /* Safari */
        display: flex
        justify-content: space-between
        align-items: center
        position: fixed
        top: 0px
        z-index: 40
        padding: 15px 10px
        width: 100%
        background: #fff
        box-sizing: border-box
        border-bottom: 1px solid #e6e6e6
        .information-box
          display: -webkit-flex; /* Safari */
          display: flex
          align-items: center
          .headPortrait
            border-radius: 50%
          .nickname-box
            display: inline-block
            margin-left: 10px
            .name
              font-size: 14px
            .title
              color: #888
              font-size: 10px
          @media (max-width: 320px)
            .title
              color: #888
              font-size: 10px
        .timeSlot-box
          .button-box
            display: inline-block
            padding: 5px 5px
            border: 1px solid #3397e4
            border-radius: 6px
            line-height: 20px
            font-size: 12px
            color: #26a2ff
            background: rgba(100, 151, 228, 0.2)
      .salaryBill-list
        margin-top: 70px
        background: #fff
        .mint-cell
          border: 0px
          .mint-cell-wrapper
            background-size: 120% 0px
        .NoRecord
          width: 60%
          margin: 0 auto
          margin-top: 55%
          .NoRecord-text
            margin-bottom: 20px
            text-align: center
            color: #888
          .NoRecord-imgBox
            background: #e6e6e6
            border-radius: 50%
            padding: 25px
            box-sizing: border-box
            .NoRecord-img
              width: 100%
    .myPopup
      width: 100%
      .picker-bg
        width: 100%
        padding: 30px 15px
        background: #fff
        box-sizing: border-box
        .popup-head
          padding: 0px 50px
          padding-bottom: 20px
          background: #fff
          border-bottom: 1px solid #e6e6e6
          .mint-header-button
            text-align: center
          .mint-button
            font-size: 18px
            color: #26a2ff
        .picker
          margin-top: 30px
</style>
