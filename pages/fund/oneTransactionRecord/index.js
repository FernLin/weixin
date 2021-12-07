const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [], //交易记录数组

  },
  onChange(e) {
    console.log(e.detail, 'eee')
  },
  //获取详情
  getRecord(prdCodeSeq) {
    let params={
      prdCodeSeq
    }
    app.api.post('pweb/perFundTradeRecord.do',params).then(res => {
      console.log(res)
      if (res.respCode == "00000000") {
        this.setData({
          recordList: res.data.dataList
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getRecord(options.prdCode)
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