import Dialog from "@vant/weapp/dialog/dialog";
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
const openId = wx.getStorageSync("openid");
const unionId = wx.getStorageSync("unionId");
let timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indexCode: "",
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
    noticePopup: false,
    shareListLen: 0,
    noticeMsg: "",
    subAcccountList: [],
    selectSubAccount: {},
    showPicker: false,
  },

  // 查看卡号
  checkAcNo(e) {
    this.setData({
      unbindPopup: true,
      checkCurrentAcNo: this.data.accountDetail.acNo,
      currTransactionId: "wxLookBankCardNum",
    });
  },

  // 交易明细
  toTranDetail() {
    wx.navigateTo({
      url:
        "/pages/TransactionDetail/index?acNo=" +
        this.data.accountDetail.acNo +
        "&subAcNo=" +
        this.data.selectSubAccount.sonAccNo,
    });
  },

  closeNotice() {
    this.setData({
      noticePopup: false,
    });
  },

  onChange(data) {
    if (data.detail) {
      this.setData({
        unbindPopup: true,
        status: data.detail ? "1" : "0",
        currTransactionId: "wxMovingAccountNoticeOpenAndClose",
      });
    } else {
      app.service.AccountMan.wxNoticeClassShareQry({
        openId,
        unionId,
      }).then((res) => {
        const currentMyShareList = res.myShareList.filter(
          (el) => el.acNo === this.data.accountDetail.acNo
        );
        this.setData({
          shareListLen: currentMyShareList.length,
          noticePopup: true,
          noticeMsg:
            currentMyShareList.length > 0
              ? `当前账户已共享 ${currentMyShareList.length} 位好友，`
              : "",
        });
      });
    }
  },
  bindCheck() {
    if (this.data.shareListLen > 0) {
      var currentData = JSON.stringify(this.data.accountDetail);
      wx.navigateTo({
        url:
          "/pages/accMan/noticeShareManage/index?type=mine" +
          "&currentData=" +
          currentData,
      });
    } else {
      this.closeNotice();
    }
  },
  bindConfirm() {
    this.setData({
      unbindPopup: true,
      noticePopup: false,
      status: this.data.status === "0" ? "1" : "0",
      currTransactionId: "wxMovingAccountNoticeOpenAndClose",
      indexCode: "",
      verifyCode: "",
      hasGetVerifyCode: false,
    });
    this.getVercode();
  },

  handleNoatice() {
    app.service.AccountMan.wxMovingAccountNoticeOpenAndClose({
      cardNo: this.data.accountDetail.acNo,
      phoneNo: this.data.accountDetail.openMobilephone,
      status: this.data.status,
      openId,
      unionId,
    })
      .then((res) => {
        this.setData({
          noticeSwitch: this.data.status === "1",
          ["accountDetail.optionFlag"]: this.data.status,
        });
      })
      .catch((err) => {
        console.log("失败");
      });
  },

  onPopupConfirm() {
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
      transactionId: this.data.currTransactionId,
      mobilePhone: this.data.accountDetail.openMobilephone,
    }).then((result) => {
      // 操作完成后需要清空验证码数据
      this.setData({
        unbindPopup: false,
        indexCode: "",
        verifyCode: "",
        hasGetVerifyCode: false,
        countDownFlag: true,
        countDownNum: 60,
      });
      if (this.data.currTransactionId === "wxMovingAccountNoticeOpenAndClose") {
        this.handleNoatice();
      } else {
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
    // 关闭弹窗时清空当前数据
    this.setData({
      unbindPopup: false,
      indexCode: "",
      verifyCode: "",
      hasGetVerifyCode: false,
      countDownFlag: true,
      countDownNum: 60,
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

  selectSubAccount() {
    this.setData({
      showPicker: true,
    });
  },

  onShow: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openid = wx.getStorageSync("openid");
    app.service.Global.wxSubListQry({
      openid,
    }).then((res) => {
      if (res.userAccount && res.userAccount.length > 0) {
        const currentAccount = res.userAccount.find(
          (el) => el.acNo === options.acNo
        );
        let arr = [],
          arr1 = [],
          arr2 = [],
          arr3 = [],
          arr4 = [],
          arr5 = [],
          arr6 = [],
          arr7 = [];
        currentAccount.subAcctlist.forEach((el) => {
          let element = {
            ...el,
            text:
              app.util.hiddenBankCard(el.sonAccNo) +
              "/" +
              app.util.transCurryType(el.curryType),
          };
          if (element.curryType === "CNY") {
            arr.push(element);
          } else if (element.curryType === "USD") {
            arr1.push(element);
          } else if (element.curryType === "HKD") {
            arr2.push(element);
          } else if (element.curryType === "GBP") {
            arr3.push(element);
          } else if (element.curryType === "AUD") {
            arr4.push(element);
          } else if (element.curryType === "CAD") {
            arr5.push(element);
          } else if (element.curryType === "EUR") {
            arr6.push(element);
          } else if (element.curryType === "JPY") {
            arr7.push(element);
          }
        });
        const subAcList = arr.concat(arr1, arr2, arr3, arr4, arr5, arr6, arr7);
        const currentSubAccount = subAcList[0];
        this.setData({
          subAcccountList: subAcList,
          selectSubAccount: currentSubAccount,
          accountDetail: currentAccount,
          noticeSwitch: currentAccount.optionFlag === "1",
        });
      }
    });
  },
  // 选择账户
  handlePicker(event) {
    const { value } = event.detail;
    console.log("选择", value);
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
    const { value } = event.detail;
    this.setData({
      selectSubAccount: value,
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
