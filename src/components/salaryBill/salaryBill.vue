<template>
  <div class="salaryDetails">
    <!-- 内容 -->
    <div class="salaryDetails-content">
      <!-- 金额banner -->
      <div class="salaryDetails-banner">
          <div class="salary-text">
            <h2 class="date">{{dateInfo}}</h2>
            <h1 class="money"> {{realWages}}</h1>
          </div>
      </div>
      <!-- 应发工资 -->
      <div class="salaryPayable">
        <div class="salaryPayableTitle">
          <h2 class="salaryPayableTitle-text">应发金额</h2>
          <h2 class="salaryPayableTitle-total">{{salaryPayableTotal}}</h2>
        </div>
        <mt-cell v-show="allowanceState" title="岗位薪资" :value="allowance"></mt-cell>
        <mt-cell v-show="achievementsState" title="绩效薪资" :value="achievements"></mt-cell>
        <mt-cell v-show="workingYearsState" title="工龄津贴" :value="workingYears"></mt-cell>
        <mt-cell v-show="otherAllowanceState" title="其他津贴" :value="otherAllowance"></mt-cell>
        <mt-cell v-show="otherBonusState" title="奖金" :value="otherBonus"></mt-cell>

      </div>
      <!-- 扣减工资 -->
      <div class="deductSalary">
        <div class="deductSalaryTitle">
          <h2 class="deductSalaryTitle-text">扣减金额</h2>
          <h2 class="deductSalaryTitle-total">{{deductSalaryTotal}}</h2>
        </div>
        <mt-cell v-show="notpunchState" title="缺卡" :value="notpunch"></mt-cell>
        <mt-cell v-show="lateState" title="迟到" :value="late"></mt-cell>
        <mt-cell v-show="sickleaveState" title="事假" :value="sickleave"></mt-cell>
        <mt-cell v-show="compassionateState" title="病假" :value="compassionate"></mt-cell>
        <mt-cell v-show="absenteeismState" title="旷工" :value="absenteeism"></mt-cell>
        <mt-cell v-show="socialState" title="社保" :value="social"></mt-cell>
        <mt-cell v-show="otherDeductionsState" title="其他" :value="otherDeductions"></mt-cell>
        <mt-cell v-show="incomeState" title="个税" :value="income"></mt-cell>



      </div>
      <!-- 确认按钮 -->
      <div class="confirmButton">
        <p>温馨提示：工资属于敏感信息，请注意保密。</p>
        <mt-button @click="clickConfirm()" type="primary" class="btnText" size="large">{{btnText}}</mt-button>
        <p>如内容无异，请确认工资信息。</p>
      </div>
    </div>
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
  </div>
</template>

<script type="text/ecmascript-6">
  import { Header, Cell, Button, Field, Indicator, MessageBox, Actionsheet } from 'mint-ui'
  import qs from 'qs'
  import axios from 'axios'
  export default {
    components: {
      'mt-header': Header,
      'mt-cell': Cell,
      'mt-button': Button,
      'mt-field': Field,
      'mt-actionsheet': Actionsheet
    },
    data () {
      return {
        sheetVisible: false,
        btnText: '确认以上信息',
        button: null,
        actions: [

        ],
        // 发放
        salaryPayableTotal: null,  // 应发总计
        allowance: null, // 岗位薪资
        allowanceState: true, // 岗位薪资状态
        otherAllowance: null, // 其他津贴
        otherAllowanceState: true,  // 其他津贴状态
        achievements: null, // 绩效薪资
        achievementsState: true,  // 绩效薪资状态
        otherBonus: null,  // 其他奖金
        otherBonusState: true, // 其他奖金状态
        workingYears: null,  // 工龄工资
        workingYearsState: true,  // 工龄工资状态
        // 扣除
        deductSalaryTotal: null,  // 扣除总计
        sickleave: null,  // 事假扣除
        sickleaveState: true, // 事假扣除状态
        compassionate: null, // 病假扣除
        compassionateState: true, // 病假扣除状态
        leaveearly: null, // 早退扣除
        leaveearlyState: true, // 早退扣除状态
        late: null, // 迟到扣除
        lateState: true, // 迟到扣除状态
        notpunch: null, // 却卡扣除
        notpunchState: true, // 却卡扣除状态
        income: null, // 个人所得税
        incomeState: true,  // 个人所得税状态
        social: null, // 社保扣除
        socialState: true, // 社保扣除状态
        otherDeductions: null, // 其他扣除
        otherDeductionsState: true, // 其他扣除状态
        absenteeism: null, // 旷工扣除
        absenteeismState: true, // 旷工扣除状态
        // 总计 时间
        realWages: null,  // 实发工资
        realWagesState: true, // 实发工资状态
        dateInfo: null,  // 时间
        status: true  // 工资条发布状态  1 发布   0 未发布
      }
    },
    mounted: function () {
      var tmp = this
      tmp.analogLoading()
      // 钉钉 导航接口
      dd.biz.navigation.setTitle({
        title: '工资条',  // 控制标题文本，空字符串表示显示默认文本
        onSuccess: function (result) {
        },
        onFail: function (erro) {}
      })
      dd.biz.navigation.setRight({
        show: true,   // 控制按钮显示， true 显示， false 隐藏， 默认true
        control: true,  // 是否控制点击事件，true 控制，false 不控制， 默认false
        text: '设置',  // 控制显示文本，空字符串表示显示默认文本
        onSuccess: function(result) {
          tmp.sheetVisible = !tmp.sheetVisible
        },
        onFail: function(err) {}
      })
      dd.biz.navigation.setLeft({
        show: true,  // 控制按钮显示， true 显示， false 隐藏， 默认true
        control: true,  // 是否控制点击事件，true 控制，false 不控制， 默认false
        showIcon: true,  // 是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
        text: '返回',   // 控制显示文本，空字符串表示显示默认文本
        onSuccess : function(result) {
        // 如果control为true，则onSuccess将在发生按钮点击事件被回调
        tmp.close()
        },
        onFail : function(err) {}
      })
      var tdp = tmp.$router
      this.actions = [
      {
        name: '设置密码',
        method: function() {
          console.log('设置密码')
          tdp.replace('/setPassword')
        }
      },
      {
        name: '薪资记录',
        method: function() {
          console.log('薪资记录')
          tdp.replace('/salaryDetails')
        }
      }]
    },
    methods: {
      clickConfirm () {
        var tmp = this
        // console.log(tmp)
        MessageBox.confirm('是否确认以上信息?').then(action => {
          axios.post('http://dingding.tzyun.com/index.php?g=hrm&m=api&a=Confirm',
          qs.stringify({'ids': window.messageId, 'user_id': window.dd_userid})).then(function (response) {
            tmp.button.disabled = true
            tmp.button.style.opacity = '0.6'
            tmp.btnText = '已经确认'
            console.log(response.data)
          })
          console.log('点击成功')
        })
      },
      handleClose () { console.log('关闭') },
      close() {
        dd.biz.navigation.close({
            onSuccess : function(result) {
            },
            onFail : function(err) {}
        })
      },
      refreshData() {
        var dataDom = document.getElementsByClassName('mint-cell-value')
        for (var i = 0; i < dataDom.length; i++) {
          dataDom[i].style.zIndex = "999"
        }
        // dataDom.style.zIndex = "999"
      },
      unissuedStyle() {
        var dataDom = document.getElementsByClassName('mint-cell-value')
        for (var i = 0; i < dataDom.length; i++) {
          dataDom[i].style.textDecoration = "line-through"
        }
        var tmp = this
        tmp.button = document.getElementsByClassName('btnText')[0]
        tmp.button.disabled = true
        tmp.button.style.opacity = '0.6'
      },
      analogLoading() {
        var tmp = this
        Indicator.open({
          text: '加载中...',
          spinnerType: 'fading-circle'
        })
        setTimeout(() => {
          Indicator.close()
          tmp.button = document.getElementsByClassName('btnText')[0]
          // 获取页面数据
          axios.post('http://dingding.tzyun.com/index.php?g=hrm&m=api&a=getNowTest',
          qs.stringify({'user_id': window.dd_userid})).then(function (response) {
          // 判断工资是否发放提示
            //  response.data.data.status = "0"  // 模拟未发放
            console.log(response)
            if (response.data.result === 0) {
              tmp.dateInfo = response.data.time  // 时间
              tmp.realWages = "工资未发放"  // 提示未发放
              tmp.salaryPayableTotal = '￥' + response.data.payable_sum
              tmp.deductSalaryTotal = '￥' + response.data.deduction_sum
              // 未发放状态  应发模块
              tmp.allowance = response.data.payable.allowance
              tmp.otherAllowance = response.data.payable.other_allowance
              tmp.achievements = response.data.payable.achievements
              tmp.otherBonus = response.data.payable.other_bonus
              tmp.workingYears = response.data.payable.working_years
              // 未发放状态  扣除工资
              tmp.achievementsDeduction = response.data.deduction.achievements_deduction
              tmp.sickleave = response.data.deduction.sickleave
              tmp.compassionate = response.data.deduction.compassionate
              tmp.leaveearly = tmp.leaveearly = response.data.deduction.leaveearly
              tmp.late = response.data.deduction.late
              tmp.notpunch = response.data.deduction.notpunch
              tmp.income = response.data.deduction.income
              tmp.social = response.data.deduction.social
              tmp.otherDeductions = response.data.deduction.other_deductions
              tmp.absenteeism = response.data.deduction.absenteeism
              tmp.$nextTick(function () {
                // dom已更新
                tmp.unissuedStyle()
              })
            } else if (response.data.result === 1) {
                // 应发
                tmp.salaryPayableTotal = '￥' + response.data.payable_sum
                // 扣除
                tmp.deductSalaryTotal = '￥' + response.data.deduction_sum
                tmp.realWages = response.data.real_wages // 实发工资 = 应发 - 扣除
                tmp.dateInfo = response.data.time
                // tmp.dateInfo = response.data.data.date_info.replace(/-/, '年') + '月'
              // 根据状态判断
                // 发放

                if (response.data.payable.allowance !== "0.00") {  // 岗位薪资
                  tmp.allowance = response.data.payable.allowance
                } else if (response.data.payable.allowance === "0.00") {
                  tmp.allowanceState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.payable.other_allowance !== "0.00") {  // 其他津贴
                  tmp.otherAllowance = response.data.payable.other_allowance
                } else if (response.data.payable.other_allowance === "0.00") {
                  tmp.otherAllowanceState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.payable.achievements !== "0.00") { // 绩效薪资
                  tmp.achievements = response.data.payable.achievements
                } else if (response.data.payable.achievements === "0.00") {
                  tmp.achievementsState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.payable.other_bonus !== "0.00") { // 其他奖金
                  tmp.otherBonus = response.data.payable.other_bonus
                } else if (response.data.payable.other_bonus === "0.00") {
                  tmp.otherBonusState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.payable.working_years !== "0.00") { // 工龄津贴
                  tmp.workingYears = response.data.payable.working_years
                } else if (response.data.payable.working_years === "0.00") {
                  tmp.workingYearsState = false   // 如果当前字段为空 隐藏
                }
                // 扣除
                if (response.data.deduction.achievements_deduction !== "0.00") { // 绩效扣除
                  tmp.achievementsDeduction = response.data.deduction.achievements_deduction
                } else {
                  tmp.achievementsDeductionState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.deduction.sickleave !== "0.00") { // 事假扣除
                  tmp.sickleave = response.data.deduction.sickleave
                } else {
                  tmp.sickleaveState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.deduction.compassionate !== "0.00") { // 病假扣除
                  tmp.compassionate = response.data.deduction.compassionate
                } else {
                  tmp.compassionateState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.deduction.leaveearly !== "0.00") { // 早退扣除
                  tmp.leaveearly = response.data.deduction.leaveearly
                } else {
                  tmp.leaveearlyState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.deduction.late !== "0.00") { // 迟到扣除
                  tmp.late = response.data.deduction.late
                } else {
                  tmp.lateState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.deduction.notpunch !== "0.00") { // 却卡扣除
                  tmp.notpunch = response.data.deduction.notpunch
                } else {
                  tmp.notpunchState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.deduction.income !== "0.00") { // 个人所得税扣除
                  tmp.income = response.data.deduction.income
                } else {
                  tmp.incomeState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.deduction.social !== "0.00") { // 社保扣除
                  tmp.social = response.data.deduction.social
                } else {
                  tmp.socialState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.deduction.other_deductions !== "0.00") { // 其他扣除
                  tmp.otherDeductions = response.data.deduction.other_deductions
                } else {
                  tmp.otherDeductionsState = false   // 如果当前字段为空 隐藏
                }
                if (response.data.deduction.absenteeism !== "0.00") { // 旷工扣除
                  tmp.absenteeism = response.data.deduction.absenteeism
                } else {
                  tmp.absenteeismState = false   // 如果当前字段为空 隐藏
                }
                tmp.$forceUpdate()
                tmp.$nextTick(function () {
                  // dom已更新
                  tmp.refreshData()
                })
                // 确认工资条
                window.messageId = response.data.id
                if (response.data.confirm) {
                  tmp.button.disabled = true
                  tmp.button.style.opacity = '0.6'
                  tmp.btnText = '已经确认'
                } else {
                  tmp.button.disabled = false
                  tmp.button.style.opacity = '1'
                  tmp.btnText = '确认以上信息'
                }
            }
          })
        }, 1000)
      }
    }
  }
</script>

<style lang="sass">
  .salaryDetails
    .salaryDetails-content
      background: #d5d5d5
      .salaryDetails-banner
        background: linear-gradient(top,  #26a2ff, #3397e4)
        width: 100%
        height: 120px
        padding: 6% 0
        text-align: center
        box-sizing: border-box
        .salary-text
          .date
            color: #fff
            font-size: 16px
          .money
            margin-top: 15px
            color: #fff
            font-size: 36px
      .salaryPayable, .deductSalary, .confirmButton
        padding: 0px 15px
        background: #fff
        .mint-cell-wrapper
          background-size: 120% 0px
          border-bottom: 1px solid #e6e6e6
          padding: 0 2px
          .mint-cell-text, .mint-cell-value
            font-size: 14px
        .salaryPayableTitle, .deductSalaryTitle
          display: -webkit-flex /* Safari */
          display: flex
          justify-content: space-between
          padding: 10px 0px
          .salaryPayableTitle-text, .deductSalaryTitle-text, .salaryPayableTitle-total, .deductSalaryTitle-total
            color: #ff6f02
      .salaryPayable
        padding-top: 20px
      .deductSalary
        margin-top: 20px
        padding-top: 20px
      .confirmButton
        margin-top: 20px
        padding-top: 20px
        p
          padding: 15px 0px
          font-size: 14px
          color: #666
</style>
