// pages/User/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    applyList: [],
  },
  goEnterAccOpen() {
    wx.navigateTo({
      url: "/pages/EnterpriseAccountOpen/EnterpriseInformation/index",
    });
  },
  getStatus(code) {
    if (code === "0") {
      return "审核通过";
    }
    if (code === "1") {
      return "审核不通过";
    }
    if (code === "9") {
      return "待审核";
    }
  },
  getFlag(flag) {
    switch (flag) {
      case "0":
        return "基本账户";
      case "1":
        return "一般账户";
      case "2":
        return "专用账户";
      case "3":
        return "临时账户";
      case "4":
        return "NRA账户";
      case "5":
        return "验资户";
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    app.service.EnterpriseAccountOPen.wxApplyOpenActQry({
      telNum: option.mobilePhone,
    }).then((res) => {
      if (res.list && res.list.length > 0) {
        const list = res.list.map((el) => {
          return {
            ...el,
            status: this.getStatus(el.stateCode),
            flag: this.getFlag(el.bankAcctFlag),
          };
        });
        this.setData({
          applyList: list,
        });
      }
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
