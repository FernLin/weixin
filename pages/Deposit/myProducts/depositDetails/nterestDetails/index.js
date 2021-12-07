// pages/Deposit/myProducts/depositDetails/nterestDetails/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paidInterestList: [],
    distributedInterest: 0 //累计派发利息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let prama = JSON.parse(decodeURIComponent(options.prama))
    this.setData({
      distributedInterest: prama.distributedInterest,
    })
    this.myInterestQuery(prama)
  },
  myInterestQuery(prama) {
    app.api.post('250:8019/api/product/deposit/myInterestQuery', prama).then(res => {
      this.setData({
        paidInterestList: res.paidInterestList,

      })
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