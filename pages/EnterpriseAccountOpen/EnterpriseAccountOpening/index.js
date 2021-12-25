// pages/User/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobilePhone: "",
    messageindex: "",
    countDownNum: 60,
    countDownFlag: true,
  },
  // 手机号
  bindModel(e) {
    this.setData({
      mobilePhone: e.detail.value,
    });
  },
  getVercode() {
    console.log(this.data.mobilePhone);
    if (this.data.mobilePhone.length == 11) {
      this.countDownF();
      let data = {
        mobilePhone: this.data.mobilePhone,
        transactionId: "perLoginticWx",
      };
      app.api.post("pweb/perSendSmsNoLogin.do", data).then((res) => {
        console.log(999, res);
        this.setData({
          messageindex: res.data.index,
        });
      });
    } else {
      wx.showToast({
        title: "请输入正确位数的手机号！",
        icon: "none", //icon
        duration: 3000, //停留时间
      });
    }
  },
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
  onLoad: function () {
    app.service.CashReserve.wxOutletsDeptQry({
      deptType: "2",
      bankName: "赣州",
    }).then((res) => {
      console.log(res);
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
