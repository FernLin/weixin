// pages/Sign/bankCardSupport/Support/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankDataList: []
  },
  bindUserAccount() {
    //console.log(1)
    let data = {}
    app.api.post('250:8019/api/base/bank/getSupportBank', data).then(res => {
      if (res.respCode == '00000000') {
        //console.log(res)
        this.setData({
          bankDataList: res.bankDataList
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
  onShow: function (options) {
    this.bindUserAccount()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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