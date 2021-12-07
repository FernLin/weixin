// pages/Loan/applyResult/index.js
Page({

  /**
   * 所有状态公用页面，跳入时传参控制，参数见resultList，身份认证未通过时需要传入原因说明使用参数reason
   * 重新申请和网点列表的跳转还没做
   */
  data: {
    result: {
      status: 0,
      iconUrl: '../../../assets/LoanApplyResult/success.png',
      title: '提交成功',
      id: "392034934090",
      content: '您的开户申请已受理，我们将在2个工作日内通过电话/短信通知您审核结果。'
    }
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

  },

  handleBack: function () {
    if (this.data.result.status === 5 || this.data.result.status === 6) {
      // 重新申请
    } else {
      // 返回
      wx.navigateBack()
    }
  }
})