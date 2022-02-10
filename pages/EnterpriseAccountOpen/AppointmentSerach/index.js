// pages/EnterpriseAccountOpen/AppointmentSerach/index.js
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
let timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobilePhone: "",
    verifyCode: "",
    countDownNum: 60,
    countDownFlag: true,
    indexCode: "",
    hasGetVerifyCode: false,
  },
  // 下一步
  goNext() {
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
      transactionId: "wxApplyOpenActQry",
      mobilePhone: this.data.mobilePhone,
    }).then((result) => {
      wx.navigateTo({
        url:
          "/pages/EnterpriseAccountOpen/AppointmentInquiry/index?mobilePhone=" +
          this.data.mobilePhone,
      });
    });
  },
  // 输入手机号
  bindPhoneNum(e) {
    this.setData({
      mobilePhone: e.detail.value,
    });
  },
  // 输入验证码
  bindPassword(e) {
    this.setData({
      verifyCode: e.detail.value,
    });
  },
  // 获取验证码
  getVercode() {
    if (app.util.validatePhone(this.data.mobilePhone)) {
      app.service.Global.wxCommonConfirm({
        transactionId: "wxApplyOpenActQry",
      }).then((result) => {
        let params = {
          mobilePhone: this.data.mobilePhone,
          transactionId: "wxApplyOpenActQry",
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
  // 倒计时
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
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      mobilePhone: "",
      verifyCode: "",
      countDownNum: 60,
      countDownFlag: true,
      indexCode: "",
      hasGetVerifyCode: false,
    });
  },

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
