// pages/Deposit/buyProduct/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    demandTransactionAmount: '', //购买金额
    show: false,
    columns: [], //卡列表
    accountBalance: '', //当前余额
    moneyFormat: '', //大写金额
    checked: true,
    accountNo: '',
    list: {
      idNo: "", // 证件号码
    },
    totalTaxAmount: '', //到期收益
  },
  onLoad: function (options) {
    let list = JSON.parse(decodeURIComponent(options.prama));
    //console.log(list)
    this.setData({
      list,
    })
    this.getCifIdentity() //身份信息查询
  },
  //身份信息查询
  getCifIdentity() {
    let data = {
      cifSeq: wx.getStorageSync("cifSeq")
    }
    app.api.post('250:8022/api/cif/identity/getCifIdentity', data).then(res => {
      this.getAccountList(res)
    })
  },
  // 加挂账户查询
  getAccountList(res) {
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
          arr.push(obj)
        })
        //console.log(arr)
        this.setData({
          columns: arr,
          accountName: res.accountList[0].text,
          accountNo: res.accountList[0].accountNo,
          accountBalance: res.accountList[0].accountBalance
        })
      }
    })
  },
  cnMoneyFormat(event) {
    this.setData({
      moneyFormat: app.util.cnMoneyFormat(event.detail.value)
    })
  },
  //到期收益
  getMoney(event) {
    let demandTransactionAmount = event.detail.value
    this.setData({
      demandTransactionAmount: this.data.demandTransactionAmount
    })
    let data = {
      demandTransactionAmount, // 本金
      termNumber: this.data.list.dueRate, //  利率
      demandProductNo: this.data.list.productCode,
      matureDate: '20200202',
      capitalizeStartDate: '20200202'
    }
    app.api.get('250:8019/api/product/deposit/getMoney', data).then(res => {
      //console.log(res)
      this.setData({
        totalTaxAmount: res.totalTaxAmount
      })
    })
    // 
  },
  // 充值
  topup() {
    let prama = {
      accountNo: this.data.accountNo
    };
    //console.log(prama)
    wx.navigateTo({
      url: '/pages/accountManage/electronicAccountTop-up/index' + "?prama=" + encodeURIComponent(JSON.stringify(prama)),
    })
  },
  depositBuy() {
    //console.log(this.data.demandTransactionAmount)
    let data = {
      accountNo: this.data.accountNo, // 用户电子户卡
      productCode: this.data.list.productCode, // 产品代码
      orderNo: '20200202', // 渠道订单号
      orderDate: '20200202', //订单日期
      transAmount: this.data.demandTransactionAmount, // 购买金额
      bankUserId: '20200202', //银行用户ID
    };
    app.api.post('250:8019/api/product/deposit/depositBuy', data).then(res => {
      if (res.respCode == '00000000') {
        this.goNext()
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 1500 //停留时间
        })
      }

    })


  },
  goNext() {
    let prama = {
      productName: this.data.list.productName, //产品名称
      accountNo: this.data.accountNo, // 用户电子户卡
      transAmount: this.data.demandTransactionAmount, // 购买金额
    }
    wx.navigateTo({
      url: '/pages/Deposit/depositProducts/buyProduct/Success/index' + "?prama=" + encodeURIComponent(JSON.stringify(prama)),
    })
  },
  checkedOnChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    //console.log(`当前值：${value}, 当前索引：${index}`)
  },
  onConfirm(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    //console.log(`当前值：${value}, 当前索引：${index}`);
    this.setData({
      accountName: this.data.columns[index].text,
      accountNo: this.data.columns[index].accountNo,
      accountBalance: this.data.columns[index].accountBalance
    })
    this.onClose()
  },
  onCancel() {
    //console.log('取消');
  },
})