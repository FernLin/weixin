// pages/User/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selfBankCardList: [],
    myShareList: [],
    loading: false,
    otherShareList: []
  },
  goBindCard() {
    wx.navigateTo({
        url: '/pages/accMan/bindCard/index',
    })
  },
  // 动账通知分享查询
  getAccNoticeList() {
    let _this = this
    app.api.post("pweb/perWxMovingAcctNoticeStatusQry.do").then(res => {
      if(res.respCode=="00000000" && res.data.list.length>0) {
        let myShareList = []
        let otherShareList = []
        res.data.list.forEach(item => {
          if(_this.data.selfBankCardList.indexOf(item.signAcNo) != -1) {
            myShareList.push(item)
          }else {
            otherShareList.push(item)
          }
        })
        _this.setData({
          myShareList: myShareList,
          otherShareList: otherShareList,
          loading: false
        })
      }else {
        this.setData({
          loading: false
        })
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }
    }).catch(err => {
      this.setData({
        loading: false
      })
      wx.showToast({
        title: err.respMessage,
        icon: 'none', //icon
        duration: 5000 //停留时间
      })
    })
  },
  onShow: function () {
    this.setData({
      loading: true
    })
    let list = wx.getStorageSync('bankCardList')
    let cardNoList = []
    if(list.length>0){
      list.forEach(item => {
        cardNoList.push(item.acNo)
      })
      this.setData({selfBankCardList: cardNoList})
    }
    this.getAccNoticeList()
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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