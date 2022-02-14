// pages/User/userSetting/index.js
import Toast from "@vant/weapp/toast/toast";
import Dialog from "@vant/weapp/dialog/dialog";
const app = getApp();
const unionId = wx.getStorageSync("unionId");
let timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    unbindPopup: false,
    verifyCode: "",
    countDownFlag: true,
    countDownNum: 60,
    openMobile: "",
    indexCode: "",
    hasGetVerifyCode: false,
    resultPopup: false,
  },
  // 解绑
  onClick(e) {
    Dialog.confirm({
      title: "提示",
      message: "是否确认解绑微信？",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    })
      .then(() => {
        this.setData({
          unbindPopup: true,
        });
        this.getVercode();
      })
      .catch(() => {
        console.log("暂不解绑");
      });
  },
  // 发送解绑验证码
  getVercode() {
    if (app.util.validatePhone(this.data.openMobile)) {
      app.service.Global.wxCommonConfirm({
        transactionId: "wxRelBindUser",
      }).then((result) => {
        let params = {
          mobilePhone: this.data.openMobile,
          transactionId: "wxRelBindUser",
          templateId: "wxRelBindUserTemplate",
        };
        app.service.Global.wxSendSms(params).then((res) => {
          this.setData({
            indexCode: res.index,
            verifyCode: "",
            hasGetVerifyCode: true,
          });
          this.countDownF();
          Toast("验证码已发送~！");
        });
      });
    } else {
      Toast("请输入正确格式的手机号！");
    }
  },
  // 输入验证码
  verifyInput(event) {
    this.setData({
      verifyCode: event.detail.value,
    });
  },
  // 关闭弹框
  closePopup() {
    this.setData({
      unbindPopup: false,
    });
  },
  onPopupConfirm() {
    const openId = wx.getStorageSync("openid");
    if (!this.data.hasGetVerifyCode) {
      Toast("请先获取短信验证码！");
      return;
    }
    if (!this.data.verifyCode) {
      Toast("请正确输入短信验证码！");
      return;
    }
    app.service.Global.wxAuthSmsNoLogin({
      index: this.data.indexCode,
      code: this.data.verifyCode,
      transactionId: "wxRelBindUser",
      mobilePhone: this.data.openMobile,
    }).then((result) => {
      this.setData({
        unbindPopup: false,
      });
      app.service.Global.wxRelBindUser({
        openid: openId,
        thirdType: "gzwxapplet",
      })
        .then((res) => {
          if (res) {
            app.service.Global.wxMsgTradingToRemindWx({
              unionId,
              type: "2",
            });
            wx.clearStorageSync();
            this.setData({
              resultPopup: true,
            });
          }
        })
        .catch((err) => {
          this.setData({
            countDownFlag: true,
            countDownNum: 60,
          });
        });
    });
  },
  countDownF() {
    if (!!timer) clearInterval(timer);
    let _this = this;
    this.setData({
      countDownFlag: false,
      countDownNum: 60,
    });
    timer = setInterval(function () {
      if (_this.data.countDownNum != 0) {
        _this.setData({
          countDownNum: _this.data.countDownNum - 1,
        });
      } else {
        clearInterval(timer);
        _this.setData({
          countDownFlag: true,
        });
      }
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openMobile: wx.getStorageSync("mobilePhone"),
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
