// pages/Deposit/myProducts/withdrawalConfirmed/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
  },
  goNext() {
    wx.navigateTo({
      url: './Result/index',
    })
  },
  // 存款赎回
  myDepositRedeem(transAmount) {
    let data = {
      accountNo: this.data.list.accountNo, //电子账号
      bankOrderNo: this.data.list.bankOrderNo, // 银行订单号
      orderNo: this.data.list.orderNo, //渠道订单号
      bankUserId: '20200202', // 用户ID
      redeemNo: '20200202', //渠道方赎回订单号
      transAmount: String(transAmount), // 赎回金额
    }
    //console.log(data)
    app.api.post('250:8019/api/product/deposit/myDepositRedeem', data).then(res => {
      if (res.respCode == '00000000') {
        this.goNext()
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 1500 //停留时间
        })
      }

    })
  },
  // 计算收益查询
  profitQuery() {
    let data = {
      accountNo: this.data.list.accountNo, //电子账号
      bankOrderNo: this.data.list.bankOrderNo, // 银行订单号
      orderNo: this.data.list.orderNo, //渠道订单号
      bankUserId: this.data.list.bankUserId, // 银行用户ID
      principal: this.data.list.principal, // 本金

    }
    app.api.post('250:8019/api/product/deposit/profitQuery', data).then(res => {
      let transAmount = Number(res.principal) + Number(res.interest) - Number(res.paidInterest)
      //console.log(res)
      this.myDepositRedeem(transAmount)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = JSON.parse(decodeURIComponent(options.prama))
    //console.log(list)
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