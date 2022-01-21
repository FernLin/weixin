// pages/accMan/accDetail/index.js
import Dialog from "@vant/weapp/dialog/dialog";
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
const openId = wx.getStorageSync("openid");
const unionId = wx.getStorageSync("unionId");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    accountDetail: "",
    noticeSwitch: false,
    unbindPopup: false,
    verifyCode: "",
    countDownFlag: true,
    countDownNum: 60,
    status: "",
    hasGetVerifyCode: false,
    checkCurrentAcNo: "",
    currTransactionId: "",
  },

  // 查看卡号
  checkAcNo(e) {
    this.setData({
      unbindPopup: true,
      checkCurrentAcNo: this.data.accountDetail.acNo,
      currTransactionId: "wxLookBankCardNum",
    });
    this.getVercode();
  },

  // 交易明细
  toTranDetail() {
    wx.navigateTo({
      url: "/pages/tranDetail/index?acNo=" + this.data.accountDetail.acNo,
    });
  },

  onChange(data) {
    if (data.detail) {
      this.setData({
        unbindPopup: true,
        status: data.detail ? "1" : "0",
        currTransactionId: "wxMovingAccountNoticeOpenAndClose",
      });
      this.getVercode();
    } else {
      Dialog.confirm({
        title: "提示",
        message: "是否确认关闭动账通知功能？",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        this.setData({
          unbindPopup: true,
          status: data.detail ? "1" : "0",
          currTransactionId: "wxMovingAccountNoticeOpenAndClose",
        });
        this.getVercode();
      });
    }
  },

  handleNoatice() {
    app.service.AccountMan.wxMovingAccountNoticeOpenAndClose({
      cardNo: this.data.accountDetail.acNo,
      phoneNo: this.data.accountDetail.openMobilephone,
      status: this.data.status,
      openId,
      unionId,
    }).then((res) => {
      this.setData({
        noticeSwitch: this.data.status === "1",
        ["accountDetail.optionFlag"]: this.data.status,
      });
    });
  },

  onPopupConfirm() {
    if (!this.data.hasGetVerifyCode) {
      Toast("请先获取短信验证码！");
      return;
    }
    app.service.Global.wxAuthSmsNoLogin({
      index: this.data.indexCode,
      code: this.data.verifyCode,
      transactionId: this.data.currTransactionId,
      mobilePhone: this.data.accountDetail.openMobilephone,
    }).then((result) => {
      if (this.data.currTransactionId === "wxMovingAccountNoticeOpenAndClose") {
        this.setData({
          unbindPopup: false,
        });
        this.handleNoatice();
      } else {
        this.setData({
          unbindPopup: false,
        });
        Dialog.confirm({
          title: "复制卡号",
          message: "您的卡号为：\n" + this.data.accountDetail.acNo,
          confirmButtonText: "复制卡号",
          cancelButtonText: "取消",
        })
          .then(() => {
            wx.setClipboardData({
              data: this.data.accountDetail.acNo,
              success: function (res) {
                wx.getClipboardData();
              },
            });
          })
          .catch(() => {
            console.log("取消");
          });
      }
    });
  },

  jumpTo(event) {
    var currentData = JSON.stringify(this.data.accountDetail);
    wx.navigateTo({
      url:
        "/pages/accMan/noticeShareManage/index?type=" +
        event.currentTarget.dataset.type +
        "&currentData=" +
        currentData,
    });
  },
  // 发送解绑验证码
  getVercode() {
    if (app.util.validatePhone(this.data.accountDetail.openMobilephone)) {
      app.service.Global.wxCommonConfirm({
        transactionId: this.data.currTransactionId,
      }).then((result) => {
        let params = {
          mobilePhone: this.data.accountDetail.openMobilephone,
          transactionId: this.data.currTransactionId,
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

  onShow: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const currentAccount = JSON.parse(decodeURIComponent(options.obj));
    this.setData({
      accountDetail: currentAccount,
      noticeSwitch: currentAccount.optionFlag === "1",
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
