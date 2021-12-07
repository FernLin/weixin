// pages/foud/riskAssessment/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isConfirm: 0,
    acNo: '',
    actions: [],
    accountList: [],
    bankCardPopup: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getAccountList()
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

  },
  handleConfirm: function (e) {
    if (e.detail === this.data.isConfirm) {
      this.setData({
        isConfirm: 0
      })
    } else {
      this.setData({
        isConfirm: e.detail
      })
    }
  },
  //点击切换卡片
  changeBankCard() {
    this.setData({
      bankCardPopup: true
    })
  },
  //点击取消
  onClose(e) {
    this.setData({
      bankCardPopup: false
    })
  },
  //点击确定
  onConfirm(e) {
    this.setData({
      acNo: e.detail.value,
      showAcNo: e.detail.text,
      bankCardPopup: false
    })
  },

  //下一步
  goNext() {
    if (this.data.isConfirm == '0') {
      wx.showToast({
        title: '请勾选并同意上述选项',
        icon: 'none', //icon
        duration: 1500 //停留时间
      })
      return
    }
    wx.navigateTo({
      url: `/pages/fund/riskTest/index`
    })
  },
  // 获取用户银行卡信息
  getAccountList() {
    app.api.post("pweb/perAcListQry.do").then(res => {
      if (res.respCode === '00000000') {
        let actions = []
        res.data.accountList.forEach(item => {
          actions.push({
            text: app.util.formatAccountNo(item.acNo),
            value: item.acNo
          })
        })
        this.setData({
          acNo: res.data.accountList[0].acNo,
          showAcNo: app.util.formatAccountNo(res.data.accountList[0].acNo),
          actions: actions
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
})