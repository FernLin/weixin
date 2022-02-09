// pages/User/index.js
import Toast from "@vant/weapp/toast/toast";
import Dialog from "@vant/weapp/dialog/dialog";
const app = getApp();
const openId = wx.getStorageSync("openid");
const unionId = wx.getStorageSync("unionId");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indexCode: "",
    bankPng: "/assets/bankicon.png",
    bankCardList: [],
    bankCardArr: [],
    unbindPopup: false,
    verifyCode: "",
    countDownFlag: true,
    countDownNum: 60,
    unbindCardNo: "",
    openMobile: "",
    hasGetVerifyCode: false,
  },
  //跳转绑卡
  goBindCard() {
    wx.navigateTo({
      url: "/pages/accMan/bindCard/index",
    });
  },
  // 跳转动账通知管理
  goNoticeManage() {
    wx.navigateTo({
      url: "/pages/accMan/noticeManage/index",
    });
  },

  //开户
  // openAccount() {
  //   wx.navigateTo({
  //     url: "/pages/accMan/openAccount/index",
  //   });
  // },
  // 解绑银行卡校验
  unBindBankCard(e) {
    Dialog.confirm({
      title: "提示",
      message: `是否确认解绑账户\n${app.util.hiddenBankCard(
        e.currentTarget.dataset.item.acNo
      )}？`,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    })
      .then(() => {
        this.setData({
          unbindPopup: true,
          unbindCardNo: e.currentTarget.dataset.item.acNo,
          openMobile: e.currentTarget.dataset.item.openMobilephone,
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
        transactionId: "wxDeleteAccount",
      }).then((result) => {
        let params = {
          mobilePhone: this.data.openMobile,
          transactionId: "wxDeleteAccount",
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
  onPopupConfirm(e) {
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
      transactionId: "wxDeleteAccount",
      mobilePhone: this.data.openMobile,
    }).then((result) => {
      this.setData({
        unbindPopup: false,
      });
      app.service.Global.wxDeleteAccount({
        acNo: this.data.unbindCardNo,
        openid: openId,
      })
        .then((res) => {
          if (res) {
            Toast("解绑成功~");
            this.setData({
              indexCode: "",
              verifyCode: "",
            });
            this.getUserBankCardInfo();
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

  // 账户详情
  toAccountDetail(e) {
    var obj = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: "/pages/accMan/accDetail/index?obj=" + encodeURIComponent(obj),
    });
  },

  // 交易明细
  toTranDetail(e) {
    wx.navigateTo({
      url: "/pages/tranDetail/index?acNo=" + e.currentTarget.dataset.item.acNo,
    });
  },

  // 获取用户银行卡信息
  getUserBankCardInfo() {
    app.service.Global.wxAcListQry({
      openid: openId,
      unionId,
    }).then((res) => {
      if (res.userAccount) {
        let arrMain = [],
          arrPSAV = [],
          arrPSA2 = [],
          arrPEA2 = [],
          arrPEA3 = [],
          arrPCRC = [],
          arrPDPB = [],
          arrOther = [];
        res.userAccount.forEach((account) => {
          if (account.majorCardFlag === "1") {
            arrMain.push(account);
          } else if (account.bankAcType === "PSAV") {
            arrPSAV.push(account);
          } else if (account.bankAcType === "PSA2") {
            arrPSA2.push(account);
          } else if (account.bankAcType === "PEA2") {
            arrPEA2.push(account);
          } else if (account.bankAcType === "PEA3") {
            arrPEA3.push(account);
          } else if (account.bankAcType === "PCRC") {
            arrPCRC.push(account);
          } else if (account.bankAcType === "PDPB") {
            arrPDPB.push(account);
          } else {
            arrOther.push(account);
          }
        });
        const finalList = arrMain.concat(
          arrPSAV,
          arrPSA2,
          arrPEA2,
          arrPEA3,
          arrPCRC,
          arrPDPB,
          arrOther
        );
        wx.setStorageSync("bankCardList", finalList);
        this.setData({
          bankCardList: finalList,
        });
      }
    });
  },
  onShow: function () {
    this.getUserBankCardInfo();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},
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
