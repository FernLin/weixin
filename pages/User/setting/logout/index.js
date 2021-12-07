// pages/User/setting/logout/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  exitToUser: function () {
    wx.clearStorage()
    wx.login({
      success: res => {
        wx.request({
          url: 'http://192.168.0.250:9080/wechat/getOpidByCode',
          data: {
            code: res.code
          },
          success(res) {
            wx.setStorageSync(
              'openid', res.data.baseCommandResponse.openid
            )
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    wx.switchTab({
      url: '/pages/User/index',
    })
  },
  backToSetting: function () {
    wx.navigateBack({
      delta: 1,
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