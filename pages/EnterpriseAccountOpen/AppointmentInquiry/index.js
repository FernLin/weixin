// pages/User/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  goEnterAccOpen() {
    wx.navigateTo({
      url: "/pages/EnterpriseAccountOpen/EnterpriseInformation/index",
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    // TODO: 获取手机号查询记录
    console.log(option.mobilePhone);
    // app.service.EnterpriseAccountOPen.wxApplyOpenActQry({
    //   openFlag: "2",
    //   flag: "0",
    // }).then((res) => {
    //   console.log(res);
    // });
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
