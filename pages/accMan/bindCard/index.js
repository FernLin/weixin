// pages/User/index.js
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
const openId = wx.getStorageSync("openid");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fromRegister: false,
    bankPng: "/assets/bankicon.png",
    bindCardId: "",
    bindCardType: {},
    idCard: "",
    userName: "",
    phoneNum: "",
    // codeNum: "",
    messagePass: "",
    messageIndex: "",
    columns: [
      {
        values: [
          { text: "居民身份证", value: "110001" },
          { text: "户口本", value: "110005" },
          { text: "护照", value: "110023" },
          { text: "港澳居民通行证", value: "110019" },
          { text: "台湾居民通行证", value: "110021" },
          { text: "港澳居民居住证", value: "110050" },
          { text: "台湾居民居住证", value: "110051" },
          { text: "边民出入境通行证", value: "110049" },
          { text: "外国护照", value: "110027" },
          { text: "外国人永久居留证", value: "110029" },
          { text: "军官证", value: "110031" },
          { text: "士兵证", value: "110037" },
          { text: "离休干部荣誉证", value: "110043" },
          { text: "其他证件", value: "119999" },
        ],
        defaultIndex: 0,
      },
    ],
    idcardPopup: false,
    countDownNum: 60,
    countDownFlag: true,
  },
  // 下一步
  goNext() {
    console.log(this.data);
    if (
      this.data.bindCardId &&
      this.data.bindCardType.value &&
      this.data.idCard &&
      this.data.userName &&
      this.data.phoneNum &&
      this.data.messagePass
    ) {
      this.bindBankCard();
    } else {
      Toast("请输入完整信息~");
    }
  },
  // 校验验证码
  checkVercode() {
    // TODO: 校验短信验证码
    return;
  },
  bindBankCard() {
    // TODO: 校验证件号码格式
    // TODO: 校验短信验证码
    let params = {
      openid: openId,
      mobilePhone: this.data.phoneNum,
      cifName: this.data.userName,
      idType: this.data.bindCardType.value,
      idNo: this.data.idCard,
      acNo: this.data.bindCardId,
    };
    app.service.Global.wxAddAccount(params).then((res) => {
      if (res.respCode == "00000000") {
        Toast("绑卡成功~！");
        if (this.data.fromRegister) {
          setTimeout(function () {
            wx.switchTab({
              url: "/pages/User/index",
            });
          }, 3000);
        } else {
          wx.navigateBack();
        }
      } else {
        Toast(res.respMessage);
      }
    });
  },
  // 银行卡账号
  bindBankCardId(e) {
    this.setData({
      bindCardId: e.detail.value,
    });
  },
  // 证件类型
  onBindCardType() {
    this.setData({
      idcardPopup: true,
    });
  },
  // 身份Id
  bindIdCard(e) {
    this.setData({
      idCard: e.detail.value,
    });
  },
  // 用户姓名
  bindUserName(e) {
    this.setData({
      userName: e.detail.value,
    });
  },
  // 更新图形验证码
  // getCaptchaImg() {
  //   console.log("刷新图形验证码");
  // },
  // 图形验证码
  // bindCodeNum(e) {
  //   this.setData({
  //     codeNum: e.detail.value,
  //   });
  // },
  // 用户手机号
  bindPhoneNum(e) {
    this.setData({
      phoneNum: e.detail.value,
    });
  },
  // 选择器确认
  onConfirm(e) {
    this.setData({
      bindCardType: e.detail.value[0],
      idcardPopup: false,
    });
  },
  // 选择器取消
  onClose(e) {
    this.setData({
      idcardPopup: false,
    });
  },
  // 输入验证码
  bindPassword(e) {
    if (e.detail.value.length == 6) {
      this.setData({
        messagePass: e.detail.value,
      });
    }
  },
  // 获取验证码
  getVercode() {
    if (this.data.phoneNum.length != 11) {
      Toast("请输入手机号~！");
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
      Toast("验证码已发送~！");
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
  // 识别身份证
  success(res) {
    if (res.detail && res.detail.length > 0) {
      let data = res.detail;
      this.setData({
        userName: data.name.text,
        idCard: data.id.text,
        bindCardType: { text: "居民身份证", value: "101" },
      });
    } else {
      Toast("请重新上传~！");
    }
  },
  // 银行卡识别
  bankSuccess(res) {
    if (res.detail && res.detail.length > 0) {
      let data = res.detail;
      this.setData({
        bindCardId: data.number.text,
      });
    } else {
      Toast("请重新上传~！");
    }
  },
  // 跳过绑定
  onJump() {
    wx.switchTab({
      url: "/pages/Microservice/index",
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.fromRegister) {
      this.setData({
        fromRegister: true,
      });
    }
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
