// pages/accMan/accDetail/index.js
import Dialog from "@vant/weapp/dialog/dialog";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    accountDetail: {
      acNoHidden: "673123123123123",
      bankAcTypeName: "1类卡",
      openBank: "赣州银行总部",
      majorCardFlag: "1",
      balance: "200",
    },
    showDialog: false,
    mobilePhone: "",
    disabled: true,
    userInfo: {},
    hasUserInfo: false,
  },
  onAdd() {
    if (!this.data.hasUserInfo) {
      wx.getUserProfile({
        desc: "用于被共享人识别用户", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          wx.setStorageSync("userInfo", res.userInfo);
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            showDialog: true,
            disabled: true,
            mobilePhone: "",
          });
        },
      });
    } else {
      this.setData({
        showDialog: true,
        disabled: true,
        mobilePhone: "",
      });
    }
  },
  onClose() {
    this.setData({
      showDialog: false,
    });
  },
  bindPhoneNum(event) {
    if (app.util.validatePhone(event.detail.value)) {
      this.setData({
        mobilePhone: event.detail.value,
        disabled: false,
      });
    }
  },

  onShow: function () {
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo.nickName) {
      this.setData({
        userInfo,
        hasUserInfo: true,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      type: option.type,
    });
    wx.setNavigationBarTitle({
      title: `${option.type === "mine" ? "我的" : "接收"}共享管理`,
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
  onShareAppMessage: function (option) {
    const currentAccount = wx.getStorageSync("currentAccount");
    this.setData({
      showDialog: false,
    });
    return {
      title: "添加共享人",
      path:
        "/pages/accMan/operaNotice/index?mobilePhone=" +
        this.data.mobilePhone +
        "&name=" +
        this.data.userInfo.nickName +
        "&account=" +
        currentAccount.acNo +
        "&avatarUrl=" +
        encodeURIComponent(this.data.userInfo.avatarUrl),
      imageUrl: "/assets/mainPage/head.png",
      success: function (res) {
        console.log("转发成功", res);
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败", res);
      },
    };
  },
});
