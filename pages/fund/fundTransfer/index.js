// pages/foud/fundTransfer/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prdInfo: {},
    rate: '0.120%',
    shiftToFund: {},
    convertShare: 1,
    showFundList: false, //转出基金展示列表
    actions: []
  },
  //选择银行卡
  onSelect(e) {
    console.log(e, 'eeee')
    let shiftToFund = {}
    shiftToFund.prdName = e.detail.name;
    shiftToFund.prdCode = e.detail.subname;
    shiftToFund.newNetWorth = e.detail.netWorth
    this.setData({
      shiftToFund: shiftToFund,
      isSelectFund: true
    })
    console.log(e.detail, 'value', this.data.shiftToFund, '2222')
  },
  //关闭银行卡选择框
  onClose() {
    this.setData({
      showFundList: false
    })
  },
  //展示选择基金列表
  selectShiftFund() {
    this.setData({
      showFundList: true
    })
  },
  // 基金列表查询
  getFundList() {
    app.api.post('pweb/perWxFundPrdListQuery.do').then(res => {
      console.log(res)
      if (res.respCode == "00000000") {
        let actions = []
        res.data.dataList.forEach(item => {
          let obj = {}
          obj.name = item.prdName;
          obj.subname = item.prdCode;
          obj.wnewNetWorth = item.newNetWorth
          actions.push(obj)
        })
        this.setData({
          fundList: res.data.dataList,
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
  //转换
  exchange() {
    if (Object.keys(this.data.shiftToFund).length < 1) {
      wx.showToast({
        title: '请选择转入基金',
        icon: 'none', //icon
        duration: 2000 //停留时间
      })
      return
    }
    //购买
    let params = {
      fundCode: this.data.prdInfo.prdCodeSeq,
      fundName: this.data.prdInfo.prdName,
      netWorth: this.data.prdInfo.newNetWorth,
      shiftToFundName: this.data.shiftToFund.prdName,
      shiftToFundCode: this.data.shiftToFund.prdCode,
      rate: this.data.rate,
      convertShare: this.data.convertShare
    }
    app.api.post("pweb/perWxFundConversion.do", params).then(res => {

      if (res.respCode === '00000000') {
        let prdInfo = this.data.prdInfo
        prdInfo.perchasingAmount = this.data.perchasingAmount
        prdInfo.prdCode = prdInfo.prdCodeSeq
        prdInfo.shiftToFundName = shiftToFund.prdName
        prdInfo.shiftToFundCode = shiftToFund.prdCode
        wx.navigateTo({
          url: `/pages/fund/fundTransferResult/index?prdInfo=${JSON.stringify(prdInfo)}`
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
    this.setData({
      prdInfo: JSON.parse(options.fundInfo)
    })
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