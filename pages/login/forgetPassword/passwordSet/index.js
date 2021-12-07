// pages/login/passwordSet/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobilePhone: '',
    smsCode: '',
    loginPassword: '',
    loginPasswords: ''
  },
  bindPassword(e) {
    this.setData({
      loginPassword: e.detail.value
    })
  },
  bindPasswords(e) {
    this.setData({
      loginPasswords: e.detail.value
    })
  },
  // 注冊
  goSuccess() {
    if (this.data.loginPassword !== this.data.loginPasswords) {
      wx.showToast({
        title: '两次密码不同',
        icon: 'none', //icon
        duration: 1500 //停留时间
      })
      return false
    }

    let data = {
      mobilePhone: this.data.mobilePhone,
      loginPassword: this.data.loginPassword,
      smsCode: this.data.smsCode
    }
    app.api.post('250:8019/api/user/channel/resetLoginPassword', data).then(res => {
      if (res.respCode == '00000000') {
        wx.navigateTo({
          url: "/pages/login/forgetPassword/passwordSet/Success/index"
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
    let prama = JSON.parse(decodeURIComponent(options.prama));
    //console.log(prama)
    this.setData({
      mobilePhone: prama.mobilePhone,
      smsCode: prama.messageCode,
    })
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