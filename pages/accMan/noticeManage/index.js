const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  jumpTo(event) {
    wx.navigateTo({
      url: "/pages/accMan/noticeShareManage/index?type=" + event.currentTarget.dataset.type,
    })
  },

  //跳转动账通知分享查询
  goNoticeQuery() {
    wx.navigateTo({
      url: "/pages/accMan/accNotice/index",
    });
  },
  //跳转动账通知分享签约
  goNoticeBind() {
    wx.navigateTo({
      url: "/pages/accMan/accNoticeOpera/index?type=1",
    });
  },
  //跳转动账通知分享解约
  goNoticeUnbind() {
    wx.navigateTo({
      url: "/pages/accMan/accNoticeOpera/index?type=0",
    });
  },

  onShow: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})