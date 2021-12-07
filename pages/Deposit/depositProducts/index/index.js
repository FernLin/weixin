// pages/Deposit/depositProducts/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    sort: 0, //排序规则
    des: 0,
    des1: 0,
    des2: 0,
    totalNumber: '0', //总条数
    totalPosition: '0', // 总持仓
    totalRevenue: '0', //总收益
    productList: [], // 列表
  },

  goNext() {
    if (app.util.gologin()) {
      wx.navigateTo({
        url: '../myProducts/index',
      })
    }
  },
  sortClick() {
    this.setData({
      sort: this.data.des == 0 ? 1 : 0,
      des: this.data.des == 0 ? 1 : 0
    })
    this.getDepositList()
  },
  sortClick1() {
    //console.log(this.data.des)
    this.setData({
      sort: this.data.des1 == 0 ? 3 : 2,
      des1: this.data.des1 == 0 ? 1 : 0
    })
    this.getDepositList()
  },
  sortClick2() {
    this.setData({
      sort: this.data.des2 == 0 ? 5 : 4,
      des2: this.data.des2 == 0 ? 1 : 0
    })
    this.getDepositList()
  },
  goNext1() {
    wx.navigateTo({
      url: '../myCertificatesDeposit/index',
    })
  },

  onChange(event) {
    let active = event.detail.index
    this.setData({
      active,
      sort: 0,
      des: 0,
      des1: 0,
      des2: 0,
    })
    this.getDepositList()
  },

  //身份信息查询
  getCifIdentity() {
    let data = {
      cifSeq: wx.getStorageSync("cifSeq")
    }
    app.api.post('250:8022/api/cif/identity/getCifIdentity', data).then(res => {
      //console.log(res)
      this.myDepositListAllQuery(res.idNo)
    })
  },
  // 已加挂列表存款持仓查询 总持仓
  myDepositListAllQuery(idNo) {
    let data = {
      idNo, // 证件号码
      idType: 'P01'
    }
    app.api.post('250:8019/api/product/deposit/myDepositListAllQuery', data).then(res => {
      if (res.respCode == '00000000') {
        //console.log(res)
        this.setData({
          totalNumber: res.totalNumber,
          totalPosition: res.totalPosition,
          totalRevenue: res.totalRevenue,
        })
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 1500 //停留时间
        })
      }
    })
  },
  // 存款产品查询
  getDepositList() {
   
    app.api.post('pweb/perFlexibleTreasureQry.do').then(res => {
      if (res.respCode == '00000000') {
        this.setData({
          productList: res.data.list
        })
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 1500 //停留时间
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDepositList() //列表
    // this.getCifIdentity() // 身份信息查询
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function (e) {
  //   if (1 == e) {
  //     this.setData({
  //       pageNumber: 1
  //     })
  //   }
  //   if (this.data.isMore && this.data.idNo !== '') { //如果存在更多则执行的接收列表的数组
  //     this.myDepositListAllQuery()
  //   }
  // },
  // myDepositListAllQuery() {
  //   let data = {
  //     idType: this.data.idType, //证件类型
  //     idNo: this.data.idNo, //证件号码
  //     pageNo: this.data.pageNumber,
  //     pageSize: this.data.pageSize,
  //   } //接口分页参数
  //   app.api.post('250:8019/api/product/deposit/myDepositListAllQuery', data).then(res => {
  //     if (this.data.index == 1) this.offset(res.callDepositList);
  //     if (this.data.index == 2) this.offset(res.depositBalanceList);
  //     if (this.data.index == 3) this.offset(res.largeDepositBalanceList);
  //   })
  // },
  // offset(listData) {
  //   let dataListTem = this.data.listData //定义一个数组使其等于data里定义
  //   if (listData.length != 0) { //如果请求到的数据长度不为0则执行
  //     if (this.data.pageNumber == 1) { //当页数为1时，使上面定义的数组为空
  //       dataListTem = []
  //     }
  //     let dataList = listData //再定义一个数组使其等于后台返回的数组
  //     let news = distinct(dataListTem, dataList) //数组合并
  //     //如果后台返回的数组长度小于我每页要取的数据的长度，说明已经是最后一页了。
  //     if (dataList.length < this.data.pageSize) {
  //       if (this.data.index == 1)
  //         this.setData({
  //           callDepositList: news,
  //         })
  //       if (this.data.index == 2)
  //         this.setData({
  //           depositBalanceList: news,
  //         })
  //       if (this.data.index == 3)
  //         this.setData({
  //           largeDepositBalanceList: news,
  //         })
  //       this.setData({
  //         isMore: false, //是否还有更多数据：没有
  //       })
  //     } else {
  //       this.setData({
  //         isMore: true, //是否还有更多数据：有
  //         pageNumber: this.data.pageNumber + 1 //页数加1
  //       })
  //       if (this.data.index == 1)
  //         this.setData({
  //           callDepositList: news,
  //         })
  //       if (this.data.index == 2)
  //         this.setData({
  //           depositBalanceList: news,
  //         })
  //       if (this.data.index == 3)
  //         this.setData({
  //           largeDepositBalanceList: news,
  //         })
  //     }
  //   } else { //请求到的数据长度为0则表示无更多数据

  //     this.setData({
  //       isMore: false
  //     })
  //   }

  //   function distinct(a, b) { //利用set特性去除重复值并且合并
  //     return Array.from(new Set([...a, ...b]))
  //   }
  // },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})