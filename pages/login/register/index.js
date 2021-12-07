// pages/login/register/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobilePhone: "", //手机号
    index:'',
    messageCode: '', //验证码
    messageChallenge: '', //挑战码
    times: 0, //倒计时
    timeEnd: true //倒计时结束
  },
  bindModel(e) {
    if (e.detail.value.length == 11) {
      let data = {
        mobile: e.detail.value, //手机号
      }
      app.api.post('101:8020/pweb/perPhoneCheck.do', data).then(res => {
        if (res.respCode == '00000000') {
          if (res.data.result == '0') {
            return
          } else {
            wx.showToast({
              title: '该手机号已注册，请登录',
              icon: 'none', //icon
              duration: 3000 //停留时间
            })
          }
        }
      })
    }
    this.setData({
      mobilePhone: e.detail.value
    })
  },
  bindCode(e) {
    this.setData({
      messageCode: e.detail.value
    })
  },
  // 倒计时
  getCode() {
    this.setData({
      timeEnd: false,
      times: 6
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
      transactionId:'perWxCifSign',//	场景编号，
      // messageTransCode: "REGISTER", //注册
    }
    app.api.post('101:8020/pweb/perSendSmsNoLogin.do', data).then(res => {
      if (res.respCode == '00000000') {
      
  
        wx.showToast({
          title:'验证码为'+ res.data.smsCode,
          icon: 'none', //icon
          duration:1500 //停留时间
        })
        this.setData({
          messageCode: res.data.smsCode,
           index:res.data.index
        })
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 1500 //停留时间
        })
      }
    })
  },
  // 短信验证码校验
  veriFication() {
    let data = {
      index:this.data.index, //手机号
      messageChallenge: this.data.messageChallenge, //返回码
      transactionId: 'perWxCifSign', //	场景编号，
      code: this.data.messageCode, //验证码
      // messageTransCode: "REGISTER", //注册
    }
    app.api.post('101:8020/pweb/perAuthSmsNoLogin.do', data).then(res => {
      if (res.respCode == '00000000') {
        let prama={
          mobilePhone:this.data.mobilePhone
        }
        wx.navigateTo({
          url: "/pages/login/register/passwordSet/index"+ "?prama=" + encodeURIComponent(JSON.stringify(prama)),
        })
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 1500 //停留时间
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})