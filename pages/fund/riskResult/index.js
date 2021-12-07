// pages/foud/riskAssessment/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: {},
    riskLevel: {
      1: '成长型',
      2: '平衡型',
      3: '进取型',
      4: '激进型'
    },
    suitType:{
      1:'极低风险',
      2:'较低风险',
      3:'中风险',
      4:'较高风险'
    }
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      result: JSON.parse(options.result)
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

  },
  goFund(){
    wx.reLaunch({
      url: `/pages/fund/index/index`
    })
  }

})