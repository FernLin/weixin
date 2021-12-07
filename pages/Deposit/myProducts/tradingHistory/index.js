// pages/Deposit/myProducts/tradingHistory/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    date: {}, //日期查询器
    dateShow: false, //日期输入框显示
    action: 2, //近一个月
    accountNos: [], //账号
    accountNoList: [],
    accountNo: '',
    beginDate: '20200202', //开始日期
    endDate: '20200202', //截止日期
    isflags: ['银行定期', '大额存单'], //是否大额存单
    isflag: '',
    isflagIndex: 0,
    transTypes: ['所有', '到期赎回', '提前赎回', '购买'], //交易类型
    transType: '',
    transTypeIndex: 0,
    pageNo: false, //分页当前页码
    pageSize: false, //分页大小
    show: false,
  },
  onLoad() {
    let date = app.util.dates()
    this.idSelect() //身份查询
    this.setData({
      date,
      isflag: this.data.isflags[0],
      transType: this.data.transTypes[0],
      beginDate: date.m.start, //开始日期
      endDate: date.m.end //截止日期
    })

  },
  // 历史交易查询
  myDepositHistory(beginDate, endDate) {
    let data = {
      accountNo: this.data.accountNo,
      beginDate: beginDate ? beginDate : this.data.beginDate,
      endDate: endDate ? endDate : this.data.endDate,
      transType: this.data.transTypeIndex,
      pageNo: '1',
      pageSize: '20',
      isflag: this.data.isflagIndex,
    }
    //console.log(data.beginDate)
    //console.log(data.endDate)
    app.api.post('250:8019/api/product/deposit/myDepositHistory', data).then(res => {
      //console.log(res)
      this.setData({
        list: res.list
      })
    })
  },
  // 截止日期
  endDateChange: function (e) {
    let endDate = e.detail.value
    this.setData({
      endDate
    })
    this.myDepositHistory(this.data.beginDate, endDate)
  },
  // 开始时间
  beginDateChange: function (e) {
    let beginDate = e.detail.value
    this.setData({
      beginDate
    })
    this.myDepositHistory(beginDate)
  },
  // 日期选择
  actionBtn(e) {
    this.setData({
      action: e.target.dataset.index,
      dateShow: e.target.dataset.index == 4 ? true : false
    })
    let index = e.target.dataset.index
    if (index == 1) this.myDepositHistory(this.data.date.w.start)
    if (index == 2) this.myDepositHistory(this.data.date.m.start)
    if (index == 3) this.myDepositHistory(this.data.date.tm.start)
  },
  // 存款类型
  isflagPicker: function (e) {
    this.setData({
      isflag: this.data.isflags[e.detail.value],
      isflagIndex: e.detail.value
    })
  },
  //操作类型
  transTypePicker: function (e) {
    this.setData({
      transType: this.data.transTypes[e.detail.value],
      transTypeIndex: e.detail.value
    })
  },
  // 银行卡号
  accountNoPicker: function (e) {
    //console.log(e.detail.value)
    this.setData({
      accountNoName: this.data.accountNos[e.detail.value],
      accountNo: this.data.accountNoList[e.detail.value].accountNo,
    })
  },
  //身份认证
  idSelect() {
    let data = {
      cifSeq: wx.getStorageSync("cifSeq")
    }
    app.api.post('250:8022/api/cif/identity/getCifIdentity', data).then(res => {
      //console.log(res)
      this.getAccountList(res)
    })
  },
  // 加挂账户查询
  getAccountList(res) {
    // if (this.data.idNo == '' || this.data.idNo == undefined) return
    let data = {
      idType: res.idType, //证件类型 P01-身份证
      idNo: res.idNo, // 证件号码
      accountSignFlag: this.data.accountSignFlag, // 动账签约状态返回标识
      msgTypes: this.data.msgTypes, // 查询类型
    }
    app.api.post('250:8019/api/user/account/getAccountList', data).then(res => {
      if (res.respCode == '00000000') {
        let arrs = app.util.userComputed(res.accountList)
        let arr = []
        arrs.forEach(obj => {
          obj.text = obj.accountNoName
          arr.push(obj.text)
        })
        this.setData({
          accountNos: arr,
          accountNoName: arr[0],
          accountNoList: res.accountList,
          accountNo: res.accountList[0].accountNo,
        })
        this.myDepositHistory()
      }
    })
  },
  goNext(event) {
    wx.navigateTo({
      url: './Details/index' + "?prama=" + encodeURIComponent(JSON.stringify(event.currentTarget.dataset.item)),
    })
  },
})