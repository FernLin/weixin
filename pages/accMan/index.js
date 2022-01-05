// pages/User/index.js
import Toast from "@vant/weapp/toast/toast";
import Dialog from "@vant/weapp/dialog/dialog";
const app = getApp();
const openId = wx.getStorageSync("openid");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bankPng: "/assets/bankicon.png",
    bankCardList: [],
    bankCardArr: [],
    unbindPopup: false,
    unbindCardInfo: "",
    messagePass: "",
    messageIndex: "",
    loading: false,
    unbindHiddenCard: "",
    verCodeChecked: false,
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
    this.setData({
      unbindPopup: true,
    });
    // Dialog.confirm({
    //   title: "提示",
    //   message: "您是否确认解绑当前账号？",
    //   confirmButtonText: "确定",
    //   cancelButtonText: "暂不解绑",
    // })
    //   .then(() => {
    //     app.service.Global.wxDeleteAccount({
    //       acNo: e.currentTarget.dataset.item.acNo,
    //       openid: openId,
    //     }).then((res) => {
    //       if (res.respCode == "00000000") {
    //         Toast("解绑成功~");
    //       } else {
    //         Toast(res.respMessage);
    //       }
    //     });
    //   })
    //   .catch(() => {
    //     console.log("暂不解绑");
    //   });
  },
  // 发送解绑验证码
  getVercode() {
    let data = {
      mobilePhone: this.data.unbindCardInfo.openMobilephone,
      transactionId: "perAcctDel",
    };
    app.api.post("pweb/perSendSms.do", data).then((res) => {
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
  // 校验短信验证码
  checkVercode() {
    let data = {
      index: this.data.messageIndex,
      transactionId: "perAcctDel",
      code: this.data.messagePass,
    };
    app.api.post("pweb/perSAuthSmsStep.do", data).then((res) => {
      if (res.respCode == "00000000" && res.data.authRes == "true") {
        this.setData({
          verCodeChecked: true,
        });
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: "none", //icon
          duration: 5000, //停留时间
        });
      }
    });
  },
  // 输入验证码
  bindPassword(e) {
    if (e.detail.value.length == 6) {
      this.setData({
        messagePass: e.detail.value,
      });
      this.checkVercode();
    }
  },
  // 关闭弹框
  closePopup() {
    this.setData({
      unbindPopup: false,
    });
  },
  // 银行卡转账查询
  goTransDetail(e) {
    var obj = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: "/pages/tranDetail/index?obj=" + encodeURIComponent(obj),
    });
  },

  // 获取用户银行卡信息
  getUserBankCardInfo() {
    app.service.Global.wxAcListQry({
      openid: openId,
      unionId: "csunionid",
    }).then((res) => {
      if (res.data.userAccount) {
        wx.setStorageSync("bankCardList", res.data.userAccount);
        this.setData({
          bankCardList: res.data.userAccount,
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
