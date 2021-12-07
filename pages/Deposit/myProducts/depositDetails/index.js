// pages/Deposit/myProducts/depositDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list: {},
    steps: [{
        text: '2020/05/27',
        desc: '交易日'
      },
      {
        text: '2020/05/27',
        desc: '起息日'
      },
      {
        text: '2020/05/27',
        desc: '到期日'
      },
    ],
  },
  goNext() {
    let prama = {
      orderNo: this.data.list.orderNo, //渠道订单号
      accountNo: this.data.list.accountNo, //卡号
      distributedInterest: this.data.list.distributedInterest //累计派发利息
    }
    wx.navigateTo({
      url: './nterestDetails/index' + "?prama=" + encodeURIComponent(JSON.stringify(prama)),
    })
  },
  goNext1() {
    let prama = {
      productCode: this.data.list.productCode, // 产品代码
      productName: this.data.list.productName, //产品名称
      dueRate: this.data.list.inrate, //  利率
      demandProductNo: this.data.list.productCode,
    }
    wx.navigateTo({
      url: '../../depositProducts/buyProduct/index' + "?prama=" + encodeURIComponent(JSON.stringify(prama)),
    })
  },
  goNext2() {
    wx.navigateTo({
      url: '../withdrawalConfirmed/index' + "?prama=" + encodeURIComponent(JSON.stringify(this.data.list)),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let prama = JSON.parse(decodeURIComponent(options.prama))
    //console.log(prama.list)
    this.data.steps[0].text = prama.list.transDate;
    this.data.steps[1].text = prama.list.interestBeginDate;
    this.data.steps[2].text = prama.list.interestDueDate;
    this.setData({
      list: prama.list,
      steps: this.data.steps,
    })
    //console.log(this.data.steps)
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