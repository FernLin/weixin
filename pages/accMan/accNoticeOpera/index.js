// pages/User/index.js
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
const openId = wx.getStorageSync("openid");
const unionId = wx.getStorageSync("unionId");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    columnsAccount: [],
    selectedAccount: {},
    // mobilePhone: "",
    verifyCode: "",
    countDownNum: 60,
    countDownFlag: true,
    indexCode: "",
    currTransactionId: "",
  },
  goNext() {
    // 签约
    if (this.data.currTransactionId === "wxDycAcNoticeSign") {
      app.service.AccountMan.wxDycAcNoticeSign({
        openId,
        unionId,
        acNo: this.data.selectedAccount.acNo,
      }).then((res) => {
        // TODO: 操作之后的交互
        console.log(res);
      });
    } else {
      // 解约
      app.service.AccountMan.wxDycAcNoticeRelSign({
        openId,
        unionId,
        acNo: this.data.selectedAccount.acNo,
      }).then((res) => {
        // TODO: 操作之后的交互
        console.log(res);
      });
    }
  },
  onAcClick() {
    this.setData({
      showPicker: true,
    });
  },
  // 选择器取消
  onPickerCancel() {
    this.setData({
      showPicker: false,
    });
  },
  // 选择器确认
  onPickerConfirm(event) {
    this.setData({
      showPicker: false,
    });
    const { picker, value, index } = event.detail;
    this.setData({
      selectedAccount: value,
    });
  },
  // 输入手机号
  // bindPhoneNum(e) {
  //   this.setData({
  //     mobilePhone: e.detail.value,
  //   });
  // },
  // 输入验证码
  bindPassword(e) {
    this.setData({
      verifyCode: e.detail.value,
    });
  },
  // 获取验证码
  getVercode() {
    if (app.util.validatePhone(this.data.selectedAccount.openMobilephone)) {
      app.service.Global.wxCommonConfirm({
        transactionId: this.data.currTransactionId,
      }).then((result) => {
        let params = {
          mobilePhone: this.data.selectedAccount.openMobilephone,
          transactionId: this.data.currTransactionId,
        };
        app.service.Global.wxSendSms(params).then((res) => {
          this.setData({
            indexCode: res.index,
            verifyCode: "",
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
  getUserBankCardInfo(type) {
    app.service.Global.wxAcListQry({
      openid: openId,
      unionId,
    }).then((res) => {
      if (res.userAccount) {
        let acList = res.userAccount.filter((item) => {
          if (type === "1") {
            return item.shareFlag === "C";
          } else {
            return item.shareFlag === "N";
          }
        });
        acList = acList.map((item) => {
          return {
            ...item,
            text: app.util.hiddenBankCard(item.acNo),
          };
        });
        this.setData({
          columnsAccount: acList,
          selectedAccount: acList[0],
        });
      }
    });
  },
  onShow: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      operaName: option.type === "1" ? "签约" : "解约",
      currTransactionId:
        option.type === "1" ? "wxDycAcNoticeSign" : "wxDycAcNoticeRelSign",
    });
    wx.setNavigationBarTitle({
      title: `动账通知分享${this.data.operaName}`,
    });
    this.getUserBankCardInfo(option.type);
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
