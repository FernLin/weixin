// app.js
var util = require("./utils/util");
var tiny = require("./tiny/tiny.js");
var Rsa = require("./lib/rsa.js");
var service = require("./service/index");
//       {
//   "pagePath": "pages/Loan/index",
//   "text": "贷款",
//   "iconPath": "./assets/tabbar2.png",
//   "selectedIconPath": "./assets/tabbar2.png"
// }, {
//   "pagePath": "pages/creditCard/index",
//   "text": "信用卡",
//   "iconPath": "./assets/tabbar3.png",
//   "selectedIconPath": "./assets/tabbar3.png"
// },
App({
  tiny: tiny,
  //配置方法
  api: {
    get: util.get,
    post: util.post,
    put: util.put,
  },
  util: {
    times: util.times,
    gologin: util.gologin,
    getDay: util.getDay,
    userComputed: util.userComputed,
    cnMoneyFormat: util.cnMoneyFormat,
    dates: util.dates,
    hiddenBankCard: util.hiddenBankCard,
    formatAccountNo: util.formatAccountNo,
    formatPhoneNo: util.formatPhoneNo,
  },
  service: service,

  // 判断用户是否注册
  judgeRegister(openId) {
    service.Global.wxGetUserInfo({
      openid: openId,
    }).then((result) => {
      if (result.respCode !== "00000000") {
        // 未注册用户跳转至注册页面
        wx.reLaunch({
          url: "/pages/Register/index",
        });
      }
    });
  },

  // 获取微信openId
  getOpenId() {
    let openId = wx.getStorageSync("openid");
    if (openId == "" || openId == undefined) {
      wx.login({
        success: (res) => {
          // TODO: 根据后端接口获取openId
          // csopenid: 已注册，csopenid1: 未注册
          wx.setStorageSync("openid", "csopenid");
          this.judgeRegister("csopenid");
        },
      });
    } else {
      this.judgeRegister(openId);
    }
  },
  onLaunch() {
    console.log("小程序加载");
    // 小程序加载时获取用户openid
    this.getOpenId();
    // 获取用户信息
    // wx.getSetting({
    //   success: (res) => {
    //     if (res.authSetting["scope.userInfo"]) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserProfile({
    //         desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //         success: (res) => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo;
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res);
    //           }
    //           this.setData({
    //             userInfo: res.userInfo,
    //             hasUserInfo: true,
    //           });
    //         },
    //       });
    //       // wx.getUserInfo({
    //       //   success: res => {

    //       //   }
    //       // })
    //     }
    //   },
    // });
    // this.initRsa();
  },
  //初始化rsa加密对象
  initRsa: function () {
    var rsa = new Rsa();
    rsa.setPublic(this.globalData.publicRsa, this.globalData.hexPublic);
    this.globalData.rsa = rsa;
  },
  globalData: {
    userInfo: null,
    publicRsa:
      "C4DFF3C3372E7DD217E22E6A44406E46760F58180440012CF819E25DEDADBEA48FF037D30E61E829BA0F36892D041DA64D320E3AE094C7D3DAF6AAB22B37DDC7",
    hexPublic: "10001",
    rsa: "",
  },
});
