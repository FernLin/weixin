// pages/login/passwordSet/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    loginPassword: '',
    loginConfirmPassword: ''
  },
  bindPassword(e) {
    this.setData({
      loginPassword: e.detail.value
    })
  },
  bindPasswords(e) {
    this.setData({
      loginConfirmPassword: e.detail.value
      
    })
  },
  // 注冊
  goSuccess() {
    if (this.data.loginPassword !== this.data.loginConfirmPassword) {
      
      wx.showToast({
        title: '两次密码不同',
        icon: 'none', //icon
        duration: 1500 //停留时间
      })
      return false
    }
    // let pages = getCurrentPages();
    // let prevPage = pages[pages.length - 2];
    //console.log(this.data.bindPassword)
    let data = {
      mobilePhone: this.data.list.mobilePhone,
      loginPassword: this.data.loginPassword,
      loginConfirmPassword: this.data.loginConfirmPassword,
    }
    app.api.post('101:8020/pweb/perWxCifSign.do', data).then(res => {
      if (res.respCode == '00000000') {
        wx.navigateTo({
          url: "/pages/login/register/passwordSet/Success/index"
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
    let list = JSON.parse(decodeURIComponent(options.prama));
    this.setData({
      list
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