// pages/Deposit/depositProducts/productDetails/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    active: 4,
    rule: true,
    demandTransactionAmount: "", //本金 
    totalTaxAmount: 0, //收益
    steps: [{
        text: '1.当日起息',
        desc: '产品22:00前购买当日起息（包含节假日）',
        inactiveIcon: 'underway',
      },
      {
        text: '2.可提前支取',
        desc: '描述信息',
        inactiveIcon: 'gold-coin',
      },
      {
        text: '3.本息保证，50万以内100%赔付',
        desc: '银行存款产品，完全执行存款保险条例',
        inactiveIcon: 'youzan-shield',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  clickRule() {
    //console.log(1)
    this.setData({
      rule: true
    })
    //console.log(this.data.rule)
  },
  clickRule1() {
    //console.log(2)
    this.setData({
      rule: false
    })
    //console.log(this.data.rule)
  },
  showPopup() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },
  onLoad: function (options) {
    let list = JSON.parse(decodeURIComponent(options.prama));
    this.setData({
      list: list.listData,
      'steps[1].desc': list.listData.productFeatures,
    })
  },
  //到期收益
  getMoney() {
    let data = {
      demandTransactionAmount: this.data.demandTransactionAmount, // 本金
      termNumber: this.data.list.dueRate, //  利率
      demandProductNo: this.data.list.productCode,
      matureDate: '20200202',
      capitalizeStartDate: '20200202'
    }
    app.api.get('250:8019/api/product/deposit/getMoney', data).then(res => {
      //console.log(res)
      this.setData({
        totalTaxAmount: res.totalTaxAmount
      })
    })
    // 
  },
  goNext() {
    let prama = this.data.list;
    wx.navigateTo({
      url: '../buyProduct/index' + "?prama=" + encodeURIComponent(JSON.stringify(prama)),
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