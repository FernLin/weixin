// pages/User/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    columns: [
      {
        values: ["623112321452325345564", "623112321452325345562"],
        defaultIndex: 0,
      },
    ],
    accountNum: "",
    phoneNum: "",
    verifyCode: "",
    showPopup: false,
    countDownFlag: true,
    countDownNum: 60,
    operaName: "",
  },
  selectAccountNum() {
    this.setData({
      showPopup: true,
    });
  },
  onConfirm(e) {
    this.setData({
      accountNum: e.detail.value,
      showPopup: false,
    });
  },
  onClose(e) {
    this.setData({
      showPopup: false,
    });
  },
  bindPhoneNum(e) {
    this.setData({
      phoneNum: e.detail.value,
    });
  },
  BindVerifyCode(e) {
    this.setData({
      verifyCode: e.detail.value,
    });
  },
  // 获取验证码
  getVercode() {
    if (this.data.phoneNum.length != 11) {
      wx.showToast({
        title: "请输入手机号~！",
        icon: "none", //icon
        duration: 3000, //停留时间
      });
      return;
    }
    let data = {
      mobilePhone: this.data.phoneNum,
      transactionId: "perAddAccount",
    };
    app.api.post("pweb/perSendSms.do", data).then((res) => {
      this.countDownF();
      this.setData({
        messageIndex: res.data.index,
      });
      wx.showToast({
        title: "验证码已发送~！",
        icon: "none", //icon
        duration: 3000, //停留时间
      });
    });
  },
  // 倒计时
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
  goNext() {
    console.log("下一步");
  },
  onShow: function () {
    // this.setData({
    //   loading: true,
    // });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      operaName: option.type === "1" ? "签约" : "解约",
    });
    wx.setNavigationBarTitle({
      title: `动账通知分享${this.data.operaName}`,
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
