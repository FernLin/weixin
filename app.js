// app.js
var util = require("./utils/util");
var api = require("./utils/http");
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
    get: api.get,
    post: api.post,
    put: api.put,
  },
  util: util,
  service: service,

  // 判断用户是否注册
  judgeRegister(openId) {
    service.Global.wxGetUserInfo({
      openid: openId,
    }).then((result) => {
      if (!result.signFlag) {
        // 未注册用户跳转至注册页面
        wx.reLaunch({
          url: "/pages/Register/index",
        });
      }
      if (result.mobilePhone) {
        wx.setStorageSync("mobilePhone", result.mobilePhone);
      }
    });
  },

  // 获取微信openId
  getOpenId() {
    const openId = wx.getStorageSync("openid");
    if (openId == "" || openId == undefined) {
      wx.login({
        success: (res) => {
          service.Global.wxGetOpenIdByCode({
            code: res.code,
          }).then((result) => {
            wx.setStorageSync("openid", result.openId);
            wx.setStorageSync("unionId", result.unionId);
            this.judgeRegister(result.openId);
          });
        },
      });
    } else {
      this.judgeRegister(openId);
    }
  },
  onLaunch() {
    // 小程序加载时获取用户openid
    this.getOpenId();
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
