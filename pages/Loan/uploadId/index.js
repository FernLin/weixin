// pages/Loan/uploadId/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    faceUrl: '../../../assets/Loan/idcard-face.png',
    backUrl: '../../../assets/Loan/idcard-back.png'
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
  handleNext () {
    wx.navigateTo({
      url: "/pages/Loan/submit/index"
    })
  },
  handleUploadFace () {
    wx.chooseImage({
      count: 1,
      success: ({ tempFilePaths }) => {
        if (tempFilePaths && tempFilePaths[0]) {
          this.setData({ faceUrl: tempFilePaths[0] })
        }
      }
    })
  },
  handleUploadBack () {
    wx.chooseImage({
      count: 1,
      success: ({ tempFilePaths }) => {
        if (tempFilePaths && tempFilePaths[0]) {
          this.setData({ backUrl: tempFilePaths[0] })
        }
      }
    })
  }
})