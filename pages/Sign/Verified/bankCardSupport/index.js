// pages/Sign/bankCardSupport/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bindAccountBankName: '111', //绑定银行名称
    bindAccountMobilePhone: "100010",
    bankId: '701', //法人代码
    brchno: '70100', //账户归属机构
    bindAccountNo: '62226000000000000', //绑定卡卡号622260 0000 0000 00
    mobilePhone: '15100001111', // 手机号17733191781
    messageCode: '', //验证码
    messageChallenge: '', //挑战码
    times: 0, //倒计时
    timeEnd: true, //倒计时结束
  },
  //orc 银行卡
  bankCard(e) {
    this.setData({
      bindAccountNo: e.detail.number.text
    })
  },
  // 倒计时
  getCode() {
    this.setData({
      timeEnd: false,
      times: 60
    })
    let times = this.data.times
    this.timer = setInterval(() => {
      times--
      this.setData({
        times
      })
      if (times === 0) {
        this.setData({
          timeEnd: true,
        })
        clearInterval(this.timer)
      }
    }, 1000)
  },
  // 短信验证码发送
  getVerifyCode() {
    this.getCode()
    let data = {
      mobilePhone: this.data.mobilePhone, //手机号
      transactionId: "perOpenEleAccount",
    }
    app.api.post('/pweb/perSendSms.do', data).then(res => {
      if (res.respCode == '00000000') {
        let index = res.data.index
        this.setData({
          index
        })
        this.openAccount('1')
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 1500 //停留时间
        })
      }
    })
  },
  //调定投接口
  openAccount(step = '1') {

    let header;
    if (step == '1') {
      header = {
        trsType: "confirm"
      }
    }
    if (step == '2') {
      header = {
        transAuthType: "multi_step_auth"
      }
    }

    let params = {
      bankAcType: "PEA2",
      bindCard: this.data.bindAccountNo,
      openMobilePhone: this.data.mobilePhone,
      setPassword: "123456",
      checkPassword: "123456",
      openSMSFlag: "0",
      noticeMobilePhone: "0",
      startAmount: "1000",
      bankName: "客户经理"

    }
    app.api.post("pweb/perOpenEleAccount.do", params, header).then(res => {
      if (res.respCode === '00000000') {
        if (step == '2') {
          console.log()
        } else {

        }

      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }
    })
  },
  // 短信验证码校验
  veriFication() {
    let data = {
      index: this.data.index,
      code: this.data.messageCode,
      transactionId: "perOpenEleAccount"
    }
    app.api.post('pweb/perSAuthSmsStep.do', data).then(res => {
      if (res.respCode == '00000000') {
       this.openAccount('2')
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 1500 //停留时间
        })
      }
    })
  },


  goSupport() {
    wx.navigateTo({
      url: './Support/index',
    })
  },
  confirm() {
    wx.navigateTo({
      url: '/pages/Sign/Verified/cardTiedSuccessfully/index',
    })
  },
})