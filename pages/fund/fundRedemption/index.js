// pages/foud/fundRedemption/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fundInfo: {},
    trsAccount: '21312312312',
    redeemShares: '1',
    redeemAmount: '6666'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fundInfo: JSON.parse(options.fundInfo)
    })
    // let accountList = wx.getStorageSync('accountList')
  },
  //修改份额
  changeRedeem(e) {
    if (Number(e.detail.value) > Number(this.data.fundInfo.positionShare)) {
      this.setData({
        redeemShares: this.data.fundInfo.positionShare
      })
    }
  },
  //全部赎回
  allRed() {
    this.setData({
      redeemShares: this.data.fundInfo.positionShare
    })
  },
  showPwdWrap() {
    let params = {
      fundCode: this.data.fundInfo.prdCodeSeq,
      fundName: this.data.fundInfo.prdName,
      trsAccount: this.data.trsAccount,
      redeemShares: this.data.redeemShares,
      redeemAmount: this.data.redeemAmount
    }
    app.api.post("pweb/perWxFundRedeem.do", params).then(res => {
      if (res.respCode === '00000000') {
        let prdInfo = this.data.fundInfo
        prdInfo.trsAccount = this.data.trsAccount
        prdInfo.redeemShares = this.data.redeemShares
        wx.navigateTo({
          url: `/pages/fund/fundRedemptionResult/index?prdInfo=${JSON.stringify(prdInfo)}`
        })
        // wx.showToast({
        //   title: '赎回成功',
        //   icon: 'none', //icon
        //   duration: 2000, //停留时间
        //   success: () => {
        //     wx.navigateBack({ //返回
        //       delta: 2
        //     })
        //   }
        // })
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