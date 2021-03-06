// pages/foud/shareBonusSet/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareList:[]
  },
   //获取详情
   getShareList() {
    app.api.post('pweb/perDividendMode.do').then(res => {
      console.log(res)
      if (res.respCode == "00000000") {
        this.setData({
          shareList: res.data.dataList
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShareList()
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
  goSet:function(e){
    let fundInfo=JSON.stringify(e.target.dataset.prdinfo)

    wx.navigateTo({
      url: `/pages/fund/updateShareBonus/index?fundInfo=${fundInfo}`
    })
  }
})