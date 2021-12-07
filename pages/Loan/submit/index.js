// index.js
// 获取应用实例
const app = getApp()

// pages/Loan/submit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isConfirm: 0,
    loanApplyInfo: "",
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loanApplyInfo: JSON.parse(decodeURIComponent(options.prama))
    })
  },

  handleNext() {
    if(this.data.isConfirm){
      this.setData({
        loading: true
      })
      let data = {
        idType: this.data.loanApplyInfo.userInfo.certType,
        idNo: this.data.loanApplyInfo.userInfo.idNo,
        userName: this.data.loanApplyInfo.userInfo.userName,
        gender: "男",
        nation: "汉",
        address: "中国",
        expDate: "2100-10-1",
        signIssuName: "中国",
        referrerNo: this.data.loanApplyInfo.peopleName,
        loanPrdId: this.data.loanApplyInfo.userInfo.loanInfo.productName,
        companyAddress: this.data.loanApplyInfo.branchAddress,
        branchAddress: this.data.loanApplyInfo.branchInfo.addr
      }
      app.api.post("pweb/perWxGetCredits.do", data).then(res => {
        if(res.respCode == "00000000") {
          let prama = {
            resultFlag: res.data.resultState
          }
          this.setData({
            loading: false
          })
          wx.navigateTo({
            url: "/pages/Loan/applyResult/index" + "?prama=" + encodeURIComponent(JSON.stringify(prama))
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

  },
  handleConfirm: function (e) {
    if (e.detail === this.data.isConfirm) {
      this.setData({ isConfirm: 0 })
    } else {
      this.setData({ isConfirm: e.detail })
    }
  }
})