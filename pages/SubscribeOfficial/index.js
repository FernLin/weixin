// pages/SubscribeOfficial/index.js
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultData: "",
    backUrl: "",
  },

  toBack() {
    const openId = wx.getStorageSync("openid");
    const unionId = wx.getStorageSync("unionId");
    app.service.Global.wxGetUserInfo({
      openid: openId,
      unionId,
    }).then((res) => {
      if (res.subscribe) {
        const url =
          this.data.backUrl +
          `${
            !!this.data.defaultData
              ? "?defaultData=" + JSON.stringify(this.data.defaultData)
              : ""
          }`;
        wx.reLaunch({
          url,
        });
      } else {
        Toast('请先关注赣州银行公众号！');
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      defaultData: !!options.defaultData ? JSON.parse(options.defaultData) : "",
      backUrl: decodeURIComponent(options.backUrl),
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton();
  },

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
