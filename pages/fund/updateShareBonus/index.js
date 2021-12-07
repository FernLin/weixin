// pages/foud/updateShareBonus/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dividendMode: '',
  },

  changeRadio(event){
    this.setData({
     
      dividendMode:event.detail
    })
    console.log(this.data)
    this.changeMode(this.data.fundInfo.prdCodeSeq,event.detail)
  },
   //获取详情
   changeMode(prdCodeSeq,divMode) {
    let params={
      prdCodeSeq,
      divMode
    }
    app.api.post('pweb/perDividendModeModify.do',params).then(res => {
      wx.showToast({
        title: '修改成功',
        icon: 'none', //icon
        duration: 2000 //停留时间
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        console.log(JSON.parse(options.fundInfo),'fundInfo')
    this.setData({
      fundInfo: JSON.parse(options.fundInfo),
      dividendMode:JSON.parse(options.fundInfo).dividendMode
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
  onChange(event) {
    this.setData({
      isConfirm: event.detail,
    });
  },
})