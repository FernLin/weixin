const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],


  },
  // 获取用户银行卡信息
  getAccountList() {
    app.api.post("pweb/perAcListQry.do").then(res => {
      if (res.respCode === '00000000') {
        this.setData({
          payerAcNo: res.data.accountList[0].acNo
        })
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }

    })
  },
  //获取记录
  getList() {

    app.api.post("pweb/perFundWxFixInputHistoryQry.do").then(res => {
      console.log(res, 'res')
      if (res.respCode === '00000000') {
        this.setData({
          list: res.data.list,
        })
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }

    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
    this.getAccountList()
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