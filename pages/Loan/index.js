// index.js
// 获取应用实例
const app = getApp()


// pages/loan/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: {
      indicatorDots: true, //指示点
      autoplay: false, //自动播放
      interval: 3000,
      duration: 500,
      loanList: "",
    },
  },
  // // 贷款产品查询
  // getLoanList() {
  //   app.api.post('/pweb/perWxLoanPrdQry.do').then(res => {
  //     if (res.respCode == "00000000") {
  //       if(res.data.btInf.length>0) {
  //         res.data.btInf.forEach(ele => {
  //           ele.typeTags = this.splitTypeTag(ele.typeTags)
  //         })
  //         this.setData({
  //           loanList: res.data.btInf
  //         })
  //       }
  //     }
  //   })
  // },
  // splitTypeTag(typeTags) {
  //   let arrList = typeTags.split(",")
  //   return arrList
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = JSON.parse(decodeURIComponent(options.prama));
    if(list.listData.length>0) {
      this.setData({
        loanList: list.listData
      })
    }
  },
  goLoan(item) {
    wx.navigateTo({
      url: "/pages/Loan/apply/index" + "?prama=" + encodeURIComponent(JSON.stringify(item)),
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