// pages/Deposit/myProducts/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    act: false,
    act1: false,
    act2: false,
    list: {},
    totalNumber: '0', //总条数
    totalPosition: '0', // 总持仓
    totalRevenue: '0', //总收益
    accountBalanceList: [], //活期
    depositBalanceList: [], //存款持仓列表
    largeDepositBalanceList: [] //大额存单持仓列表

  },
  activte() {
    this.setData({
      act: !this.data.act
    })
  },
  activte1() {
    this.setData({
      act1: !this.data.act1
    })
  },
  activte2() {
    this.setData({
      act2: !this.data.act2
    })
  },
  //身份信息查询
  getCifIdentity() {
    let data = {
      cifSeq: wx.getStorageSync("cifSeq")
    }
    app.api.post('250:8022/api/cif/identity/getCifIdentity', data).then(res => {
      //console.log(res)
      this.myDepositListAllQuery(res.idNo)
    })
  },
  // 资产负债查询 
  myDepositListAllQuery(idNo) {
    let data = {
      idNo, // 证件号码
      idType: 'P01'
    }
    app.api.post('250:8019/api/user/account/getAccountOverview', data).then(res => {
      if (res.respCode == '00000000') {
        let accountBalanceList = app.util.userComputed(res.accountBalanceList)
        let depositBalanceList = app.util.userComputed(res.depositBalanceList)
        let largeDepositBalanceList = app.util.userComputed(res.largeDepositBalanceList)
        console.log(res)
        this.setData({
          list: res,
          totalNumber: res.totalNumber,
          totalPosition: res.totalPosition,
          totalRevenue: res.totalRevenue,
          accountBalanceList,
          depositBalanceList,
          largeDepositBalanceList
        })
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 1500 //停留时间
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCifIdentity()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})