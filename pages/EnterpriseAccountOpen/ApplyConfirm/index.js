// pages/EnterpriseAccountOpen/ApplyConfirm/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tempData: {},
    selectedCity: {},
    selectedNet: {},
  },

  toConfirm() {
    app.service.EnterpriseAccountOPen.wxApplyOpenAct(this.data.tempData)
      .then((res) => {
        if (res) {
          wx.reLaunch({
            url:
              "/pages/EnterpriseAccountOpen/ApplyResult/index?applyNo=" +
              res.applyNo,
          });
        }
      })
      .catch((err) => {
        this.setData({
          countDownFlag: true,
          countDownNum: 60,
        });
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const pages = getCurrentPages();
    const firstPage = pages[pages.length - 4];
    this.setData({
      tempData: JSON.parse(options.enterpriseInfo),
      selectedCity: firstPage.data.selectedCity,
      selectedNet: firstPage.data.selectedNet,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
