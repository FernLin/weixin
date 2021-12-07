// index.js
// 获取应用实例
const app = getApp()

// pages/Loan/branch/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: "",
    branchAddress: '',
    branchInfo: {
      deptName: "请选择",
      addr: ""
    },
    peopleName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: JSON.parse(decodeURIComponent(options.prama))
    })
  },

  handlePeopleNameChange:function (e) {
    const value = e.detail
    this.setData({ peopleName: value })
  },
  handleAddressChange:function (e) {
    const value = e.detail
    this.setData({ branchAddress: value })
  },
  handleChooseBranch: function () {
    wx.navigateTo({
      url: "./branchList/index"
    })
  },
  handleNext:function () {
    let prama = {
      userInfo: this.data.userInfo,
      branchAddress: this.data.branchAddress,
      branchInfo: this.data.branchInfo,
      peopleName: this.data.peopleName
    }
    wx.navigateTo({
      url: "/pages/Loan/submit/index" + "?prama=" + encodeURIComponent(JSON.stringify(prama))
    })
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
    let branch = wx.getStorageSync("branch")
    if(branch) {
      this.setData({ 
        branchInfo: branch
      })
    }
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