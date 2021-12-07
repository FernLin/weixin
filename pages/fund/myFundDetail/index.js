// pages/fund/fundMarket/index.js
import * as echarts from '../../../ec-canvas/echarts';
let Chart = null;

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fundInfo: {


    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'options')
    this.prdCode = options.prdCode
    this.getFundDetail(options.prdCode)
    this.getDailyRecord()

  },
  //获取折线图
  getDailyRecord() {
    let params = {
      type: 'incomeDaily'
    }
    app.api.post("pweb/perFundWxStatisticalReportQuery.do", params).then(res => {
      if (res.respCode === '00000000') {
        this.setData({
          xAxis: res.data.XAxis.split(','),
          yAxis: res.data.YAxis.split(',')

        })
        this.init_echarts()
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }

    })
  },
  //初始化图表
  init_echarts: function () {
    let that = this;
    that.echartsComponnet = that.selectComponent('#mychart-dom-graph');
    that.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      that.setOption(Chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function (Chart) {
    Chart.clear(); // 清除
    Chart.setOption(this.getOption()); //获取新数据
  },
  getOption: function () {
    let that = this;
    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '业绩走势'
      },
      xAxis: {
        type: 'category',
        data: this.data.xAxis
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: this.data.yAxis,
        type: 'line',
        smooth: true
      }],
      backgroudColor: '#fff'
    };

    return option;
  },
  //定投
  guAutoMatic() {

    let prdInfo = JSON.stringify(this.data.fundInfo)
    wx.navigateTo({
      url: `/pages/fund/fundAutoMatic/index?prdInfo=${prdInfo}`
    })


  },
  //购买
  goBuy() {

    let prdInfo = JSON.stringify(this.data.fundInfo)
    wx.navigateTo({
      url: `/pages/fund/fundBuy/index?prdInfo=${prdInfo}`
    })


  },
  //赎回
  sellFund() {
    let fundInfo = JSON.stringify(this.data.fundInfo)
    wx.navigateTo({
      url: `/pages/fund/fundRedemption/index?fundInfo=${fundInfo}`
    })
  },
  //转换
  exchange() {
    let fundInfo = JSON.stringify(this.data.fundInfo)
    wx.navigateTo({
      url: `/pages/fund/fundTransfer/index?fundInfo=${fundInfo}`
    })
  },
  goRecord() {
    wx.navigateTo({
      url: `/pages/fund/oneTransactionRecord/index?prdCode=${this.prdCode}`
    })
  },
  goDividend() {
    let fundInfo = JSON.stringify(this.data.fundInfo)
    wx.navigateTo({
      url: `/pages/fund/updateShareBonus/index?fundInfo=${fundInfo}`
    })
  },
  //获取详情
  getFundDetail(prdCodeSeq) {
    let params = {
      prdCodeSeq
    }
    app.api.post('pweb/perMyFundQuery.do', params).then(res => {
      console.log(res)
      if (res.respCode == "00000000") {
        this.setData({
          fundInfo: res.data
        })

      }
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

  }
})