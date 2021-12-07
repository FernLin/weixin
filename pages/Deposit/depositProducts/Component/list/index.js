// pages/Deposit/depositProducts/Component/bankRegular/index.js

Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 页面的初始数据
   */

  properties: {
    active: String,
    listData: Object
  },
  data: {
    productName: '', // 产品名称
    investPeriod: '', //	产品期限
    minAmount: '', //起投金额
    dueRate: '', //满期利率 年化4 .25 % ，值为: 0.0425
    paymentRule: '',
    // 000-到期
    // 001 - 周
    // 002 - 月
    // 003 - 季
    // 004 - 半年
    // 005 - 年 

  },
  methods: {
    golist(options) {
      let prama = {
        listData: options.currentTarget.dataset.list
      }
      //console.log(prama)
      const urls = [
        '/pages/Deposit/depositProducts/productDetails/index' + "?prama=" + encodeURIComponent(JSON.stringify(prama)),
        '/pages/Deposit/depositProducts/productDetails/index' + "?prama=" + encodeURIComponent(JSON.stringify(prama)),
      ]
      wx.navigateTo({
        url: urls[this.properties.active],
      })
    },
  },
})