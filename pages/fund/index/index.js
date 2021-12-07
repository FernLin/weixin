// index.js
// 获取应用实例
const app = getApp()
import Dialog from "@vant/weapp/dialog/dialog"


// pages/loan/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: {
      indicatorDots: true, //指示点
      autoplay: false, //自动播放
      interval: 3000,
      duration: 500,
      fundList: [], //基金列表
      accountList: [],
      fundStatus: {

      }
    },
  },
  //跳转菜单
  goMenu(e) {
    let menu = e.currentTarget.dataset.menu
    if (menu == 'riskAssessment') {
      if (this.data.accountList.length < 1) {
        Dialog.confirm({
            message: '您名下没有查询到卡信息，请先绑卡',
          })
          .then(() => {
            wx.navigateTo({
              url: '/pages/accMan/bindCard/index',
            })
          })
          .catch(() => {
            // on cancel
          });
        return
      }

    }


    wx.navigateTo({
      url: `/pages/fund/${menu}/index`
    })
  },
  clickWay() {
    Dialog.alert({
        message: '功能尚未开放',
      })
      .then(() => {

      })

  },
  //跳转持有详情
  goHoldDetail(e) {
    let prdCode = e.currentTarget.dataset.prdcode
    wx.navigateTo({
      url: `/pages/fund/myFundDetail/index?prdCode=${prdCode}`
    })
  },
  onChange(e) {
    if (e.detail.index == 0) {
      this.getFundList()
    }
    if (e.detail.index == 1) {
      this.getMyFund()
    }
  },
  // 基金列表查询
  getFundList() {
    app.api.post('pweb/perWxFundPrdListQuery.do').then(res => {
      if (res.respCode == "00000000") {
        this.setData({
          fundList: res.data.dataList
        })

      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }
    })
  },
  // 获取用户银行卡信息
  getAccountList() {
    app.api.post("pweb/perAcListQry.do").then(res => {
      if (res.respCode === '00000000') {
        this.setData({
          accountList: res.data.accountList,
        })
        wx.setStorageSync('accountList', res.data.accountList)

      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }

    })
  },
  // 获取基金状态
  getFundStatus() {
    app.api.post("pweb/perFundWxUserInfoQuery.do").then(res => {
      if (res.respCode === '00000000') {
        wx.setStorageSync('fundStatus', res.data)

      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }

    })
  },
  //跳转基金详情
  goDetail(e) {
    let prdCode = e.currentTarget.dataset.prdcode
    wx.navigateTo({
      url: `/pages/fund/productDetail/index?prdCode=${prdCode}`
    })
  },
  // 我的基金查询
  getMyFund() {
    app.api.post('pweb/perFundPositionQuery.do').then(res => {
      if (res.respCode == "00000000") {
        this.setData({
          myFundInfo: res.data
        })

      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }
    })
  },
  // splitTypeTag(typeTags) {
  //   let arrList = typeTags.split(",")
  //   return arrList
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token_key = wx.getStorageSync('token_key')
    this.getFundList()
    //登录请求卡列表，不登陆不请求
    if (token_key) {
      this.getAccountList()
      this.getFundStatus()
    }
    


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