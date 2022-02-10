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
    whetherVerifyCard: true,
    bindCardId: "",
    idCard: "",
    userName: "",
    phoneNum: "",
  },
  // 下一步
  goNext() {
    if (!app.util.isRightName(this.data.userName)) {
      Toast("请输入有效的姓名！");
      return;
    }
    let params = {
      idType: "110001",
      cifName: this.data.userName,
      idNo: this.data.idCard,
      mobilePhone: this.data.phoneNum,
      thirdType: "gzwxapplet",
      openid: openId,
      unionId,
    };
    if (this.data.whetherVerifyCard) {
      if (!app.util.isNum(this.data.bindCardId)) {
        Toast("请输入有效的银行卡号！");
        return;
      }
      if (this.data.bindCardId && this.data.idCard && this.data.userName) {
        params = {
          ...params,
          acNo: this.data.bindCardId,
        };
        this.verifyCard(params);
      } else {
        Toast("请输入完整信息~");
      }
    } else {
      if (this.data.idCard && this.data.userName) {
        this.verifyCard(params);
      } else {
        Toast("请输入完整信息~");
      }
    }
  },
  verifyCard(params) {
    app.service.Global.wxBindRelationship(params).then((res) => {
      // 用户校验卡片信息后，获取用户信息
      app.service.Global.wxGetUserInfo(
        {
          openid: openId,
          unionId,
        },
        false
      ).then((result) => {
        wx.setStorageSync("USERINFO", result);
        wx.switchTab({
          url: "/pages/User/index",
        });
      });
    });
  },
  // 银行卡账号
  bindBankCardId(e) {
    this.setData({
      bindCardId: e.detail.value,
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
  // 识别身份证
  success(res) {
    if (res.detail) {
      let data = res.detail;
      this.setData({
        userName: data.name.text,
        idCard: data.id.text,
      });
    } else {
      Toast("请重新上传~！");
    }
  },
  // 银行卡识别
  bankSuccess(res) {
    if (res.detail) {
      let data = res.detail;
      this.setData({
        bindCardId: data.number.text,
      });
    } else {
      Toast("请重新上传~！");
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      whetherVerifyCard: options.whetherVerifyCard === "true",
      phoneNum: options.mobilePhone,
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
