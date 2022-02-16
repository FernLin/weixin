// pages/User/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showService: true,
    userName: "",
    bankCardList: [],
    recordList: [],
    bindMobile: "",
    // loanInfo: {
    //   loanName: "牛牛贷",
    //   loanStatus: "已放款",
    //   loanAmount: "32663",
    // },
    // depoistList: [],
  },
  // 下载或唤醒app
  downloadApp() {
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
    const unionId = wx.getStorageSync("unionId");
    wx.showLoading({
      title: "请求中...",
      mask: true,
    });
    app.service.Global.wxAcListQry(
      {
        openid: openId,
        unionId,
      },
      false
    )
      .then((res) => {
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
          wx.setStorageSync("currentDate", res.currDate);
          this.setData({
            bankCardList: finalList,
          });
          if (res.userAccount.length > 0) {
            this.getRecordList();
          } else {
            wx.hideLoading();
          }
        } else {
          wx.hideLoading();
        }
      })
      .catch((err) => {
        wx.hideLoading();
      });
  },
  // 获取预约记录
  getRecordList() {
    const openId = wx.getStorageSync("openid");
    app.service.CashReserve.wxLargeCashBookQry(
      {
        FromUserName: openId,
      },
      false
    )
      .then((res) => {
        if (res) {
          const { largeCashlist, smallChangeExchangelist } = res;
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
        wx.hideLoading();
      })
      .catch((err) => {
        wx.hideLoading();
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
    wx.navigateTo({
      url: "/pages/accMan/accDetail/index?acNo=" + e.currentTarget.dataset.item.acNo,
    });
  },
  // 关闭在线客服
  closeService() {
    this.setData({
      showService: false,
    });
  },
  // 跳转至设置界面
  toSetting() {
    wx.navigateTo({
      url: "/pages/User/userSetting/index",
    });
  },
  onShow: function () {
    const userInfo = wx.getStorageSync("USERINFO");
    if (!userInfo.signFlag) {
      // 未注册用户跳转至注册页面
      wx.reLaunch({
        url: "/pages/Register/index",
      });
    } else {
      setTimeout(() => {
        this.getUserBankCardInfo();
        this.setData({
          showService: true,
        });
      }, 10);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      bindMobile: wx.getStorageSync("mobilePhone"),
      userInfo: wx.getStorageSync("USERINFO"),
    });
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
