const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [], //交易记录数组
    option1: [{
        text: '全部',
        value: 0
      },
      {
        text: '收入',
        value: 1
      },
      {
        text: '支出',
        value: 2
      },
    ],
    option2: [{
        text: '近一月',
        value: 'a'
      },
      {
        text: '近三月',
        value: 'b'
      },
      {
        text: '近半年',
        value: 'c'
      },
    ],
    option3: [{
        text: '全部',
        value: 'a'
      }
    ],
    value1: 0,
    value2: 'a',
    value3: 'a',
    active: 0
  },
  onChange(e) {
    console.log(e.detail, 'eee')
  },
  goTransactionDetail() {
    wx.navigateTo({
      url: `/pages/fund/transactionDetail/index`
    })
  },
  //获取列表
  getRecordList() {
    app.api.post('pweb/perFundTradeRecord.do').then(res => {
      console.log(res)
      if (res.respCode == "00000000") {
        this.setData({
          recordList: res.data.dataList
        })
        console.log(this.data.recordList)

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecordList()
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