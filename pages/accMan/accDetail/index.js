// pages/accMan/accDetail/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    accountDetail: "",
    noticeSwitch: false,
  },

  // 交易明细
  toTranDetail() {
    wx.navigateTo({
      url: "/pages/tranDetail/index?acNo=" + this.data.accountDetail.acNo,
    });
  },

  onChange(data) {
    this.setData({
      noticeSwitch: data.detail,
    });
  },

  jumpTo(event) {
    wx.navigateTo({
      url:
        "/pages/accMan/noticeShareManage/index?type=" +
        event.currentTarget.dataset.type,
    });
  },

  onShow: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loading: false,
      accountDetail: JSON.parse(decodeURIComponent(options.obj)),
    });
  },
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
  onShareAppMessage: function () {},
});
