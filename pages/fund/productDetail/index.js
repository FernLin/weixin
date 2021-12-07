// pages/fund/fundMarket/index.js

import * as echarts from '../../../ec-canvas/echarts';
import Dialog from "@vant/weapp/dialog/dialog"
let Chart = null;


const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountList: [],
    tabList: [{
        name: '全部',
        value: 0
      },
      {
        name: '货币',
        value: 0
      },
      {
        name: '债券',
        value: 0
      },
      {
        name: '混合',
        value: 0
      },
      {
        name: '股票',
        value: 0
      },
      {
        name: '其他',
        value: 0
      },

    ],
    prdInfo: {}, //基金详情
    prdCode: '', //基金代码
    ec: {
      lazyLoad: true // 延迟加载
    },
    xAxis: [],
    yAxis: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getFundList(options.prdCode)
    this.getAccountList()
    this.getStatus()
    this.getDailyRecord()


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
  //获取签约状态以及风险状态
  getStatus() {
    let fundStatus = wx.getStorageSync('fundStatus')
    this.setData({
      fundStatus: fundStatus
    })

  },
  // 基金详情查询查询
  getFundList(prdCode) {
    let params = {
      prdCodeSeq: prdCode
    }
    app.api.post('pweb/perWxFundPrdInfoQuery.do', params).then(res => {
      if (res.respCode == "00000000") {
        this.setData({
          prdInfo: res.data
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
  //获取折线图
  getDailyRecord() {
    let params = {
      type: 'incomeDaily'
    }
    app.api.post("pweb/perFundWxStatisticalReportQuery.do", params).then(res => {
      if (res.respCode === '00000000') {
    this.setData({
      xAxis: res.data.XAxis.split(',') ,
      yAxis:res.data.YAxis.split(',')

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
  //定投
  guAutoMatic() {
    if (this.data.accountList.length < 1) {
      Dialog.confirm({
          message: '您名下没有查询到卡信息，请先绑卡',
        })
        .then(() => {
          wx.navigateTo({
            url: '/pages/accMan/bindCard/index',
          })
        })
        .catch(() => {
          // on cancel
        });
      return
    }
    if (this.data.fundStatus.status != '1') {
      Dialog.confirm({
          message: '您还没进行基金签约，请签约后购买',
        })
        .then(() => {
          wx.navigateTo({
            url: `/pages/fund/fundSign/index`,
          })
        })
        .catch(() => {
          // on cancel
        });
      return
    }
    if ((this.getDateDiff(this.data.fundStatus.riskDate) < 0) || !this.data.fundStatus.riskDate) {
      Dialog.confirm({
          message: '风险测评已失效，请重新测评',
        })
        .then(() => {
          wx.navigateTo({
            url: '/pages/fund/riskAssessment/index',
          })
        })
        .catch(() => {
          // on cancel
        });
      return
    }
    let prdInfo = JSON.stringify(this.data.prdInfo)
    wx.navigateTo({
      url: `/pages/fund/fundAutoMatic/index?prdInfo=${prdInfo}`
    })


  },
  //购买
  goBuy() {
    if (this.data.accountList.length < 1) {
      Dialog.confirm({
          message: '您名下没有查询到卡信息，请先绑卡',
        })
        .then(() => {
          wx.navigateTo({
            url: '/pages/accMan/bindCard/index',
          })
        })
        .catch(() => {
          // on cancel
        });
      return
    }
    if (this.data.fundStatus.status != '1') {
      Dialog.confirm({
          message: '您还没进行基金签约，请签约后购买',
        })
        .then(() => {
          wx.navigateTo({
            url: `/pages/fund/fundSign/index`,
          })
        })
        .catch(() => {
          // on cancel
        });
      return
    }
    if ((this.getDateDiff(this.data.fundStatus.riskDate) < 0) || !this.data.fundStatus.riskDate) {
      Dialog.confirm({
          message: '风险测评已失效，请重新测评',
        })
        .then(() => {
          wx.navigateTo({
            url: '/pages/fund/riskAssessment/index',
          })
        })
        .catch(() => {
          // on cancel
        });
      return
    }
    let prdInfo = JSON.stringify(this.data.prdInfo)
    wx.navigateTo({
      url: `/pages/fund/fundBuy/index?prdInfo=${prdInfo}`
    })


  },
  //获取日期差
  getDateDiff(time) {
    let startTime = new Date(time); // 截止时间
    let endTime = new Date(); // 当前时间
    return (startTime - endTime)
  },
  // 获取用户银行卡信息
  getAccountList() {

    app.api.post("pweb/perAcListQry.do").then(res => {
      if (res.respCode === '00000000') {
        this.setData({
          accountList: res.data.accountList,
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