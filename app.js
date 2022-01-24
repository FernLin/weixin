// app.js
var util = require("./utils/util");
var http = require("./utils/http");
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
  http: http,
  util: util,
  service: service,

  // 判断用户是否注册
  judgeRegister(openId) {
    service.Global.wxGetUserInfo(
      {
        openid: openId,
      },
      false
    ).then((result) => {
      if (!result.signFlag) {
        // 未注册用户跳转至注册页面
        wx.reLaunch({
          url: "/pages/Register/index",
        });
      } else {
        if (this.globalData.enterOptions.path.includes("operaNotice")) {
          wx.switchTab({
            url: "/pages/Microservice/index",
          });
        }
      }
      if (result.mobilePhone) {
        wx.setStorageSync("mobilePhone", result.mobilePhone);
      }
    });
  },

  // 获取微信openId
  getOpenId() {
    // TODO: console调试代码，注意发布时删除
    const openId = wx.getStorageSync("openid");
    console.log("****storage", openId);
    if (openId == "" || openId == undefined) {
      wx.login({
        success: (res) => {
          service.Global.wxGetOpenIdByCode({
            code: res.code,
          }).then((result) => {
            wx.setStorageSync("openid", result.openId);
            wx.setStorageSync("unionId", result.unionId);
            this.judgeRegister(result.openId);
            console.log("****login", openId);
          });
        },
      });
    } else {
      this.judgeRegister(openId);
    }
  },
  onShow() {
    this.globalData.enterOptions = wx.getEnterOptionsSync();
    // 非单人会话场景，皆需要判断注册状态（TODO:群聊会话场景？）
    if (this.globalData.enterOptions.scene != 1007) {
      // 小程序加载时获取用户openid
      this.getOpenId();
    }
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
    enterOptions: {},
  },
});
