// pages/Deposit/myProducts/tradingHistory/Details/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = JSON.parse(decodeURIComponent(options.prama))
    app.util.userComputed(list)
    this.setData({
      list
    })
    this.getCifIdentity(list.accountNo, list.isflag)
  },
  //身份信息查询
  getCifIdentity(accountNo, isflag) {
    let data = {
      cifSeq: wx.getStorageSync("cifSeq")
    }
    app.api.post('250:8022/api/cif/identity/getCifIdentity', data).then(res => {
      this.myDepositListAllQuery(res.idNo, accountNo, isflag)
    })
  },
  // 已加挂列表存款持仓查询 总持仓
  myDepositListAllQuery(idNo, accountNo, isflag) {
    let data = {
      idNo, // 证件号码
      idType: 'P01'
    }
    app.api.post('250:8019/api/product/deposit/myDepositListAllQuery', data).then(res => {
      if (res.respCode == '00000000') {
        if (isflag == '1') this.sazx(accountNo, app.util.userComputed(res.largeDepositBalanceList))
        else this.sazx(accountNo, app.util.userComputed(res.depositBalanceList))
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 1500 //停留时间
        })
      }
    })
  },
  sazx(accountNo, list) {
    let arr = {
      ...this.data.list,
      ...list.filter(res => res.accountNo = accountNo)[0]
    }
    this.setData({
      list: arr
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