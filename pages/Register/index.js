// pages/Register/index.js
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    countDownFlag: true,
    countDownNum: 60,
    checked: false,
    mobile: "",
    verifyCode: "",
    indexCode: "",
    showOfficial: false,
  },
  // 获取输入的手机号
  mobileInput(event) {
    this.setData({
      mobile: event.detail.value,
    });
  },
  // 获取输入的验证码
  verifyInput(event) {
    this.setData({
      verifyCode: event.detail.value,
    });
  },
  // 获取协议状态
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },

  toNext() {
    const openId = wx.getStorageSync("openid");
    const unionId = wx.getStorageSync("unionId");
    app.service.Global.wxAuthSmsNoLogin({
      index: this.data.indexCode,
      code: this.data.verifyCode,
      transactionId: "wxCifSign",
      mobilePhone: this.data.mobile,
    }).then((result) => {
      if (result.authRes) {
        const params = {
          mobilePhone: this.data.mobile,
          openid: openId,
          unionId,
        };
        app.service.Global.wxCifSign(params)
          .then((res) => {
            // openFlag为true，新用户注册成功，跳转至绑卡页面，TODO:返回操作时跳转微服务页面
            if (res.openFlag) {
              wx.reLaunch({
                url: "/pages/accMan/bindCard/index?fromRegister=true",
              });
            } else {
              // openFlag为false，跳转至用户信息验证页面，返回操作时跳转注册页面
              wx.navigateTo({
                url:
                  "/pages/accMan/verifyCard/index?whetherVerifyCard=" +
                  res.whetherVerifyCard +
                  "&mobilePhone=" +
                  this.data.mobile,
              });
            }
          })
          .catch((err) => {
            this.setData({
              countDownFlag: true,
              countDownNum: 60,
            });
          });
      } else {
        this.setData({
          showOfficial: true,
        });
      }
    });
  },
  // 获取验证码
  getVercode() {
    if (app.util.validatePhone(this.data.mobile)) {
      app.service.Global.wxCommonConfirm({ transactionId: "wxCifSign" }).then(
        (result) => {
          let params = {
            mobilePhone: this.data.mobile,
            transactionId: "wxCifSign",
          };
          app.service.Global.wxSendSms(params).then((res) => {
            this.setData({
              indexCode: res.index,
              verifyCode: "",
            });
            this.countDownF();
            Toast("验证码已发送~！");
          });
        }
      );
    } else {
      Toast("请输入正确格式的手机号！");
    }
  },
  // 开始倒计时
  countDownF() {
    let _this = this;
    this.setData({
      countDownFlag: false,
      countDownNum: 60,
    });
    let timer = setInterval(function () {
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
    wx.hideHomeButton();
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
