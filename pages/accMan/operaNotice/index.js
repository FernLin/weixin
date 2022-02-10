// pages/accMan/operaNotice/index.js
import Dialog from "@vant/weapp/dialog/dialog";
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
let timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: "",
    unionId: "",
    signeeMobile: "",
    signeeName: "",
    signeeNameFirst: "",
    signeeNameLast: "",
    shareName: "",
    shareAccount: "",
    shareDate: "",
    shareOpenId: "",
    shareAvatar: "",
    verifyCode: "",
    countDownNum: 60,
    countDownFlag: true,
    indexCode: "",
    hasUserInfo: false,
    userInfo: {},
    showDialog: false,
    lastName: "",
    nameVerified: false,
    resultPopup: false,
    shareUrlId: "",
    hasSigned: false,
    shareUrlIdList: [],
    hasGetVerifyCode: false,
    isSamePerson: false,
  },
  onConfirm() {
    if (!this.data.nameVerified) {
      Toast("姓名验证失败，请核验！");
      return;
    }
    if (!this.data.hasGetVerifyCode) {
      Toast("请先获取短信验证码！");
      return;
    }
    if (!this.data.verifyCode) {
      Toast("请正确输入短信验证码！");
      return;
    }
    if (!this.data.hasUserInfo) {
      wx.getUserProfile({
        desc: "用于共享人识别用户", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.doSign(res.userInfo.avatarUrl);
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
        },
      });
    } else {
      this.doSign(this.data.userInfo.avatarUrl);
    }
  },
  // 签约操作
  doSign(avatarUrl) {
    let params = {
      openId: this.data.openId,
      unionId: this.data.unionId,
      acNo: this.data.shareAccount,
      shareOpenId: this.data.shareOpenId,
      shareDate: this.data.shareDate,
      nickname: this.data.signeeName,
      headimgurl: avatarUrl,
      shareHeadimgurl: this.data.shareAvatar,
    };
    app.service.Global.wxAuthSmsNoLogin({
      index: this.data.indexCode,
      code: this.data.verifyCode,
      transactionId: "wxNoticeClassShareSignIn",
      mobilePhone: this.data.signeeMobile,
    }).then((result) => {
      app.service.AccountMan.wxNoticeClassShareSignIn(params)
        .then((res) => {
          const temp = this.data.shareUrlIdList;
          temp.push(this.data.shareUrlId);
          wx.setStorageSync("shareUrlIdList", JSON.stringify(temp));
          this.setData({
            resultPopup: true,
          });
        })
        .catch((err) => {
          this.setData({
            verifyCode: "",
            countDownNum: 60,
            countDownFlag: true,
          });
        });
    });
  },
  verifyName() {
    this.setData({
      showDialog: true,
    });
  },
  bindName(e) {
    this.setData({
      lastName: e.detail.value,
    });
  },
  onDialogClose() {
    this.setData({
      showDialog: false,
    });
  },
  onDialogConfirm() {
    if (this.data.lastName === this.data.signeeNameLast) {
      this.setData({
        showDialog: false,
        nameVerified: true,
      });
    } else {
      Toast("姓名验证失败，请核验！");
    }
  },
  // 输入验证码
  bindPassword(e) {
    this.setData({
      verifyCode: e.detail.value,
    });
  },
  // 获取验证码
  getVercode() {
    if (app.util.validatePhone(this.data.signeeMobile)) {
      app.service.Global.wxCommonConfirm({
        transactionId: "wxNoticeClassShareSignIn",
      }).then((result) => {
        let params = {
          mobilePhone: this.data.signeeMobile,
          transactionId: "wxNoticeClassShareSignIn",
          templateId: "wxNoticeClassShareSignInTemplate",
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
  // 倒计时
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const shareUrlIdList = !!wx.getStorageSync("shareUrlIdList")
      ? JSON.parse(wx.getStorageSync("shareUrlIdList"))
      : [];
    if (shareUrlIdList.includes(options.shareUrlId)) {
      this.setData({
        hasSigned: true,
        resultPopup: true,
      });
      return;
    }
    let len = options.signeeName.length;
    this.setData({
      signeeMobile: options.signeeMobile,
      signeeName: options.signeeName,
      shareName: options.shareName,
      shareAccount: options.shareAccount,
      shareDate: options.shareDate,
      shareOpenId: options.shareOpenId,
      shareAvatar: decodeURIComponent(options.shareAvatar),
      signeeNameFirst: options.signeeName.substr(0, len - 1),
      signeeNameLast: options.signeeName.substr(-1),
      shareUrlId: options.shareUrlId,
      shareUrlIdList: shareUrlIdList,
    });
    wx.login({
      success: (res) => {
        app.service.Global.wxGetOpenIdByCode({
          code: res.code,
        }).then((result) => {
          if (options.shareOpenId == result.openId) {
            this.setData({
              isSamePerson: true,
              resultPopup: true,
            });
          }
          this.setData({
            openId: result.openId,
            unionId: result.unionId,
          });
        });
      },
    });
  },

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
