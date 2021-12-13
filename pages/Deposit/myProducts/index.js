// pages/Deposit/myProducts/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    totalNumber: "0", //总条数
    totalPosition: "0", // 总持仓
    totalRevenue: "0", //总收益
    depositBalanceList: [], //存款持仓列表
    largeDepositBalanceList: [], //大额存单持仓列表
  },
  //身份信息查询
  getCifIdentity() {
    let data = {
      cifSeq: wx.getStorageSync("cifSeq"),
    };
    app.api
      .post("250:8022/api/cif/identity/getCifIdentity", data)
      .then((res) => {
        //console.log(res)
        this.myDepositListAllQuery(res.idNo);
      });
  },
  // 已加挂列表存款持仓查询 总持仓
  myDepositListAllQuery(idNo) {
    let data = {
      idNo, // 证件号码
      idType: "P01",
    };
    app.api
      .post("250:8019/api/product/deposit/myDepositListAllQuery", data)
      .then((res) => {
        if (res.respCode == "00000000") {
          let depositBalanceList = app.util.userComputed(
            res.depositBalanceList
          );
          //console.log(depositBalanceList)
          let largeDepositBalanceList = app.util.userComputed(
            res.largeDepositBalanceList
          );
          this.setData({
            totalNumber: res.totalNumber,
            totalPosition: res.totalPosition,
            totalRevenue: res.totalRevenue,
            depositBalanceList,
            largeDepositBalanceList,
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
  goNext() {
    wx.navigateTo({
      url: "./tradingHistory/index",
    });
  },
  // 详情
  goNext1: function (options) {
    let prama = {
      list: options.currentTarget.dataset.list,
    };
    wx.navigateTo({
      url:
        "./depositDetails/index" +
        "?prama=" +
        encodeURIComponent(JSON.stringify(prama)),
    });
  },
  goNext2() {
    wx.navigateTo({
      url: "./depositDetails/index",
    });
  },
  goNext3() {
    wx.navigateTo({
      url: "111111", //大额存款-我的存单-持仓中-持有详情
    });
  },
  goNext4() {
    wx.switchTab({
      url: "/pages/Microservice/index",
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCifIdentity();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
