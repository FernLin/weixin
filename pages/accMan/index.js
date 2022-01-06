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
    messagePass: "",
    messageIndex: "",
    loading: false,
    verCodeChecked: false,
    countDownFlag: true,
    countDownNum: 60,
    unbindCardNo: "",
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
      message: "是否确认解绑账户？",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    })
      .then(() => {
        this.setData({
          unbindPopup: true,
          unbindCardNo: e.currentTarget.dataset.item.acNo,
        });
      })
      .catch(() => {
        console.log("暂不解绑");
      });
  },
  // 发送解绑验证码
  getVercode() {
    this.countDownF();
  },
  // 校验短信验证码
  checkVercode() {},
  // 输入验证码
  bindPassword(e) {},
  // 关闭弹框
  closePopup() {
    this.setData({
      unbindPopup: false,
    });
  },
  onPopupConfirm(e) {
    this.setData({
      unbindPopup: false,
    });
    app.service.Global.wxDeleteAccount({
      acNo: this.data.unbindCardNo,
      openid: openId,
    }).then((res) => {
      if (res.respCode == "00000000") {
        Toast("解绑成功~");
        this.getUserBankCardInfo();
      } else {
        Toast(res.respMessage);
      }
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
      if (res.respCode == "00000000") {
        if (res.data.userAccount) {
          wx.setStorageSync("bankCardList", res.data.userAccount);
          this.setData({
            bankCardList: res.data.userAccount,
          });
        }
      } else {
        Toast(res.respMessage);
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
