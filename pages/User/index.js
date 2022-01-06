// pages/User/index.js
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showService: true,
    userName: "",
    bankCardList: [],
    recordList: [],
    // loanInfo: {
    //   loanName: "牛牛贷",
    //   loanStatus: "已放款",
    //   loanAmount: "32663",
    // },
    // depoistList: [],
  },
  // 下载或唤醒app
  downloadApp() {
    console.log("跳转至下载app页面");
    const url = "http://115.150.104.8:8092/#/openBankApp";
    const navtitle = "手机银行下载";
    wx.navigateTo({
      // 跳转到webview页面
      url: `/pages/Webview/index?url=${url}&nav=${navtitle}`,
    });
  },
  // 获取用户银行卡信息
  getUserBankCardInfo() {
    const openId = wx.getStorageSync("openid");
    app.service.Global.wxAcListQry({
      openid: openId,
      unionId: "csunionid",
    }).then((res) => {
      if (res.respCode === "00000000") {
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
  // 获取预约记录
  getRecordList() {
    const openId = wx.getStorageSync("openid");
    app.service.CashReserve.wxLargeCashBookQry({
      FromUserName: openId,
    }).then((res) => {
      if (res.respCode == "00000000") {
        if (res.data) {
          const { largeCashlist, smallChangeExchangelist } = res.data;
          const largeList = largeCashlist.map((el) => {
            return {
              type: 1,
              deptName: el.deptName,
              deptAddr: el.deptAddr,
              deptId: el.deptId,
              name: el.largeList.name,
              bankCardId: el.largeList.bankCardId,
              bookTime: el.largeList.bookTime,
              bookMoney: el.largeList.bookMoney,
              bookDate: el.largeList.bookDate,
            };
          });
          const smallList = smallChangeExchangelist.map((el) => {
            let amounts = [];
            el.list.forEach((li) => {
              amounts.push(li.cyun + "元*" + li.nubr + "张");
            });
            return {
              type: 2,
              deptName: el.deptName,
              deptAddr: el.bookAddr,
              deptId: el.deptId,
              name: el.name,
              bankCardId: el.cardId,
              bookTime: el.tradeTime,
              bookDate: el.tradeDate,
              amounts: amounts.join("; "),
              count: el.bookNum,
            };
          });
          this.setData({
            recordList: [...largeList, ...smallList],
          });
        }
      } else {
        Toast(res.respMessage);
      }
    });
  },
  // 获取用户贷款信息
  // getUserLoanInfo() {
  //   console.log("贷款信息");
  // },
  // 跳转至绑卡页面
  goBindBankCard() {
    wx.navigateTo({
      url: "/pages/accMan/bindCard/index",
    });
  },
  // 跳转至账户列表页面
  goBankCardList() {
    wx.navigateTo({
      url: "/pages/accMan/index",
    });
  },
  // 跳转至账户详细页面
  goAccountDetail(e) {
    var obj = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: "/pages/accMan/accDetail/index?obj=" + encodeURIComponent(obj),
    });
  },
  // 关闭在线客服
  closeService() {
    this.setData({
      showService: false,
    });
  },
  // 判断登录
  onShow: function () {
    this.getUserBankCardInfo();
    this.getRecordList();
    this.setData({
      showService: true,
    });
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
