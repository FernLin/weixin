// index.js
// 获取应用实例
import Dialog from "@vant/weapp/dialog/dialog";
const app = getApp();

Page({
  data: {
    list: [],
    morePng: "../../assets/mainPage/more.png",
    userInfo: "",
    isShow: false,
  },
  onLoad() {},
  onShow() {
    const userInfo = wx.getStorageSync("USERINFO");
    if (!userInfo.signFlag) {
      // 未注册用户跳转至注册页面
      wx.reLaunch({
        url: "/pages/Register/index",
      });
    }
    this.setData({
      isShow: userInfo.signFlag,
    });
  },
  //跳转基金H5页面
  goFoud() {
    const url = "https://dt9pvuv0g.lightyy.com/index.html?p=hsjy_1227";
    const navtitle = "基金推荐";
    wx.navigateTo({
      // 跳转到webview页面
      url: `/pages/Webview/index?url=${url}&nav=${navtitle}`,
    });
  },
  // 企业开户
  goEnterpriseAccountOpen() {
    wx.navigateTo({
      url: "/pages/EnterpriseAccountOpen/index",
    });
  },
  // 网点预约
  goCashReserve() {
    const openId = wx.getStorageSync("openid");
    const unionId = wx.getStorageSync("unionId");
    app.service.Global.wxAcListQry({
      openid: openId,
      unionId,
    }).then((res) => {
      if (res.userAccount && res.userAccount.length > 0) {
        wx.navigateTo({
          url: "/pages/CashReserve/index",
        });
      } else {
        Dialog.confirm({
          title: "温馨提示",
          message: "当前操作需要先进行绑卡操作！",
          confirmButtonText: "立刻绑卡",
          cancelButtonText: "暂不绑卡",
        })
          .then(() => {
            wx.navigateTo({
              url: "/pages/accMan/bindCard/index",
            });
          })
          .catch(() => {
            console.log("暂不取消");
          });
      }
    });
  },
  // 联系客户经理
  callManager() {
    // wx.showActionSheet({
    //   itemList: ['18701786373'],
    //   success: function (res) {
    // wx.makePhoneCall({
    //   phoneNumber: this.data.userInfo.managerMobilephone, //此号码并非真实电话号码，仅用于测试
    // });
    // if (!res.cancel) {
    //   console.log(res.tapIndex)//console出了下标
    // }
    //   }
    // });
  },
});
