// pages/User/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token_key: false,
    eyeshow: false,
    totalNumber: "0", //总条数
    totalPosition: "0", // 总持仓
    totalRevenue: "0", //总收益
    user: {
      headImageUrl: "/assets/mine/head.png",
      userName: "",
    },
    bankCardList: "",
    loanInfo: "",
    depoistList: [],
  },
  // 登录
  toLogin() {
    let info = wx.getStorageSync("wxUserInfo");
    if (info == "" || info == undefined) {
      wx.getUserProfile({
        desc: "正在获取", //不写不弹提示框
        success: function (res) {
          wx.setStorageSync("wxUserInfo", res.userInfo);
        },
        fail: function (err) {
          //console.log("获取失败: ", err)
        },
      });
    }

    wx.navigateTo({
      url: "/pages/login/index",
    });
  },
  toSetting() {
    if (app.util.gologin()) {
      wx.navigateTo({
        url: "/pages/User/setting/index",
      });
    }
  },

  toFinance() {
    if (app.util.gologin()) {
      wx.navigateTo({
        url: "/pages/User/finance/index",
      });
    }
  },
  eyeclick() {
    this.setData({
      eyeshow: !this.data.eyeshow,
    });
  },
  // 判断登录
  onShow: function () {
    this.loginselect();
  },
  loginselect() {
    let token_key = wx.getStorageSync("token_key");
    this.setData({
      token_key
    });
    if (token_key) {
      let userInfo = wx.getStorageSync("userInfo");
      let wxUserInfo = wx.getStorageSync("wxUserInfo");
      this.setData({
        "user.headImageUrl": userInfo.pic || wxUserInfo.avatarUrl || "/assets/mine/head.png",
        "user.userName": userInfo.userName || wxUserInfo.nickName,
      });
      this.getUserBankCardInfo();
      this.getUserLoanInfo();
      this.getUserDepoist();
    } else {
      this.clearAll();
    }
  },
  // 清除所有数据
  clearAll() {
    this.setData({
      "user.headImageUrl": "/assets/mine/head.png",
      "user.userName": "",
      bankCardList: [{acNoHidden: '123123123123123',bankAcTypeName: '1类卡', openBank: '赣州银行总部'},{acNoHidden: '123123123123123',bankAcTypeName: '1类卡', openBank: '赣州银行总部'}],
      loanInfo: {loanName: '牛牛贷', loanStatus: '已放款', loanAmount: '32663'},
    });
  },
  // 获取用户银行卡信息
  getUserBankCardInfo() {
    app.api.post("pweb/perAcListQry.do").then((res) => {
      if (res.respCode == "00000000") {
        if (res.data.accountList && res.data.accountList.length != 0) {
          let list = app.util.userComputed(res.data.accountList);
          this.setData({
            bankCardList: list,
          });
          wx.setStorageSync("bankCardList", res.data.accountList);
        }
      } else {
        // wx.showToast({
        //   title: res.respMessage,
        //   icon: 'none', //icon
        //   duration: 1500 //停留时间
        // })
      }
    });
  },
  // 获取用户贷款信息
  getUserDepoist() {
    let data = {
      acct: "1212",
      productCategory: "12121",
    };
    app.api.post("pweb/perLumpSumTimeDepositOwnQry.do", data).then((res) => {
      if (res.respCode == "00000000") {
        this.setData({
          depoistList: res.data.list,
        });
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: "none", //icon
          duration: 1500, //停留时间
        });
      }
    });
  },
  // 获取用户贷款信息
  getUserLoanInfo() {
    let userInfo = wx.getStorageSync("userInfo");
    let data = {
      cifNo: userInfo.userId,
      queryType: "未结清",
      pageSize: "1",
      pageNo: "1",
    };
    app.api.post("pweb/perQueryMyselfLoanList.do", data).then((res) => {
      if (res.respCode == "00000000") {
        this.setData({
          loanInfo: res.data.list[0],
        });
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: "none", //icon
          duration: 1500, //停留时间
        });
      }
    });
  },
  goBindBankCard() {
    wx.navigateTo({
      url: "/pages/accMan/bindCard/index",
    });
  },
  goBankCardList() {
    wx.navigateTo({
      url: "/pages/accMan/index",
    });
  },
  // 银行卡转账查询
  goTransDetail(e) {
    var obj = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: "/pages/tranDetail/index?obj=" + encodeURIComponent(obj),
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.loginselect()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */

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