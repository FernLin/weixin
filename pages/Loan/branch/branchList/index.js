// index.js
// 获取应用实例
const app = getApp()

// pages/Loan/branch/branchList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    branchList: [],
    longitude: "28.429675",
    latitude: "117.901434",
    deptType: "DEPT",
    distance: "5000"
  },

  // 获取网点信息
  getBranchList() {
    if(wx.getStorageSync("branchList")){
      this.setData({
        branchList: wx.getStorageSync("branchList")
      })
      return
    }
    let data = {
      deptType: this.data.deptType,
      longitude: this.data.longitude + "",
      latitude: this.data.latitude + "",
      distance: this.data.distance
    }
    app.api.post("pweb/perWxDeptNetNodeListQry.do", data).then(res => {
      if(res.respCode=="00000000" && res.data.list.length){
        wx.setStorageSync("branchList", res.data.list)
        this.setData({
          branchList: res.data.list
        })
      }else{
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }
    })
  },
  // 获取经纬度
	getLocation() {
    let _this = this
    wx.getLocation({
      success(res) {
        if (res.latitude && res.longitude) {
          _this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          _this.getBranchList()
        }
      },
      fail(err) {
        wx.showToast({
          title: err.respMessage,
          icon: 'none', //icon
          duration: 1500 //停留时间
        })
      }
    })
	},
  chooseBranch(item) {
    wx.setStorageSync(
      'branch', item.currentTarget.dataset.item
    )
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getLocation()
    this.getBranchList()
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
  handleSearch: function (e) {
    console.log(e)
  }
})