// pages/accMan/accDetail/index.js
import Dialog from "@vant/weapp/dialog/dialog";
const app = getApp();
const openId = wx.getStorageSync("openid");
const unionId = wx.getStorageSync("unionId");
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
    let status = data.detail ? "1" : "0";
    if (data.detail) {
      this.handleNoatice(status);
    } else {
      Dialog.confirm({
        title: "提示",
        message: "是否确认关闭动账通知功能？",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.handleNoatice(status);
        })
        .catch(() => {
          console.log("暂不关闭");
        });
    }
  },

  handleNoatice(status) {
    app.service.AccountMan.wxMovingAccountNoticeOpenAndClose({
      cardNo: this.data.accountDetail.acNo,
      phoneNo: this.data.accountDetail.openMobilephone,
      status,
      openId,
      unionId,
    }).then((res) => {
      this.setData({
        noticeSwitch: status === "1",
      });
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
    const currentAccount = JSON.parse(decodeURIComponent(options.obj));
    this.setData({
      loading: false,
      accountDetail: currentAccount,
      noticeSwitch: currentAccount.optionFlag === "1",
    });
    wx.setStorageSync("currentAccount", currentAccount);
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
