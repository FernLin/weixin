// pages/login/register/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobilePhone: "", //手机号
    messageCode: '', //验证码
    messageChallenge: '', //挑战码
    times: 0, //倒计时
    timeEnd: true //倒计时结束
  },
  bindModel(e) {
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
      messageTransCode: "FOPWD", //FOPWD-忘记密码
    }
    app.api.post('250:8019/api/authen/message/create', data).then(res => {
      if (res.respCode == '00000000') {
        let messageChallenge = res.messageChallenge
        this.setData({
          messageChallenge
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
      mobilePhone: this.data.mobilePhone, //手机号
      messageChallenge: this.data.messageChallenge, //返回码
      messageCode: this.data.messageCode, //验证码
      messageTransCode: "FOPWD", //FOPWD-忘记密码
    }
    app.api.post('250:8019/api/authen/message/validate', data).then(res => {
      if (res.respCode == '00000000') {
        wx.navigateTo({
          url: "/pages/login/forgetPassword/passwordSet/index" + "?prama=" + encodeURIComponent(JSON.stringify(data)),
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