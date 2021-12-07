// pages/fund/fundMarket/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{
        name: '全部',
        value: ''
      },
      {
        name: '货币',
        value: '货币型'
      },
      {
        name: '债券',
        value: '债权型'
      },
      {
        name: '混合',
        value: '混合型'
      },
      {
        name: '股票',
        value: '股票型'
      },
      {
        name: '其他',
        value: '其他型'
      },

    ],
    fundList: []
  },
  onChange(e) {
    if (e.detail.title == '全部') {
      this.getFundList()
    } else {
      this.getFundList(e.detail.title + '型')
    }

  },
  //跳转基金详情页面
  goDetail(e) {
    let prdCode = e.currentTarget.dataset.prdcode
    wx.navigateTo({
      url: `/pages/fund/productDetail/index?prodCode=${prdCode}`
    })
  },
  // 基金列表查询
  getFundList(prdSort) {
    app.api.post('pweb/perWxFundPrdListQuery.do', {
      prdSort
    }).then(res => {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFundList()
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