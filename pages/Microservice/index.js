// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    list: [],
    token_key: false,
    productList: [],
    productList1: [],
    morePng: "../../assets/mainPage/more.png",
    accManPng: "",
    userInfo: "",
    wxUserInfo: "",
    loanList: "",
  },
  onLoad() {
    // this.queryHotsaleAndFollow()
    // this.getDepositList()
    // this.adda()
    // this.getLoanList();
  },
  // adda() {
  //   app.api.post('250:8020/pweb/perSendSms.do', {
  //     templateId: "123",
  //     transactionId: "123"
  //   }).then(res => {
  //     console.log(res)
  //   })
  // },
  // 精选产品
  queryHotsaleAndFollow() {
    app.api
      .post("250:8019/api/product/deposit/queryHotsaleAndFollow", {})
      .then((res) => {
        this.setData({
          list: res.productList,
        });
        //console.log(this.data.list)
      });
  },
  // 产品跳转
  onAndFollow: function (options) {
    //console.log(options)
    let prama = {
      listData: options.currentTarget.dataset.list,
    };
    wx.navigateTo({
      url: "/pages/Deposit/depositProducts/productDetails/index" +
        "?prama=" +
        encodeURIComponent(JSON.stringify(prama)),
    });
  },
  //基金
  goFoud() {
    wx.navigateTo({
      url: "/pages/fund/index/index",
    });
  },
  // goDeposit() {
  //   wx.navigateTo({
  //     url: "/pages/Deposit/depositProducts/index/index",
  //   });
  // },
  // 存款产品查询
  getDepositList() {
    app.api
      .post("250:8019/api/product/deposit/getDepositList", {
        queryType: 1, //产品大类
        sort: 0, //排序规则
      })
      .then((res) => {
        if (res.respCode == "00000000") {
          this.setData({
            productList: res.list,
          });
        }
      });
    // app.api.post('250:8019/api/product/deposit/getDepositList', {
    //   queryType: 0, //产品大类
    //   sort: 0, //排序规则
    // }).then(res => {
    //   if (res.respCode == "00000000") {
    //     this.setData({
    //       productList1: res.productList
    //     })
    //   }
    // })
  },
  // 贷款产品查询
  getLoanList() {
    app.api.post("pweb/perWxLoanPrdQry.do").then((res) => {
      if (res.respCode == "00000000") {
        if (res.data.btInf != []) {
          res.data.btInf.forEach((ele) => {
            ele.typeTags = this.splitTypeTag(ele.typeTags);
          });
          this.setData({
            loanList: res.data.btInf,
          });
        }
      }
    });
  },
  splitTypeTag(typeTags) {
    let arrList = typeTags.split(",");
    return arrList;
  },
  // 存款产品查询
  // 未登录
  // onLoad: function () {
  //   // 页面创建时执行
  //   // app.api.get('',{},(res)=>{//console.log(1)})
  //   app.api.get('8021/api/base/bank/getAllBank', {}).then(res => {
  //     //console.log(res);
  //   }).catch(err => {
  //     //console.log(err);
  //   })
  // },
  onShow: function () {
    let token_key = wx.getStorageSync("token_key");
    let userInfo = wx.getStorageSync("userInfo");
    let wxUserInfo = wx.getStorageSync("wxUserInfo");
    this.setData({
      token_key,
      userInfo,
      wxUserInfo,
    });
    this.clearAll();
  },
  // 清除账号信息
  clearAll() {
    this.setData({
      productList: [],
      productList1: [],
      morePng: "../../assets/mainPage/more.png",
      accManPng: "",
      userInfo: "",
      wxUserInfo: "",
    });
  },
  // 账户
  goAccountManage() {
    if (app.util.gologin()) {
      wx.navigateTo({
        url: "/pages/accountManage/index",
      });
    }
  },
  // goAccManager() {
  //   if (app.util.gologin()) {
  //     let prama = {
  //       managerId: this.data.userInfo.managerId,
  //     };
  //     wx.navigateTo({
  //       url:
  //         "/pages/accountManager/index" +
  //         "?prama=" +
  //         encodeURIComponent(JSON.stringify(prama)),
  //     });
  //   }
  // },
  success(e) {
    wx.showToast({
      title: "111",
      icon: "none", //icon
      duration: 1500, //停留时间
    });
  },
  // 存款
  // goDepositProducts() {
  //   wx.navigateTo({
  //     url: "/pages/Deposit/depositProducts/index",
  //   });
  // },
  // 我的产品
  // goMyProducts() {
  //   wx.navigateTo({
  //     url: "/pages/Deposit/myProducts/index",
  //   });
  // },
  // 企业开户
  goEnterpriseAccountOpen() {
    wx.navigateTo({
      url: "/pages/EnterpriseAccountOpen/index",
    });
  },
  // 网点预约
  goCashReserve() {
    wx.navigateTo({
      url: "/pages/CashReserve/index",
    });
  },
  // 联系客户经理
  callManager() {
    // wx.showActionSheet({
    //   itemList: ['18701786373'],
    //   success: function (res) {
    wx.makePhoneCall({
      phoneNumber: this.data.userInfo.managerMobilephone, //此号码并非真实电话号码，仅用于测试
    });
    // if (!res.cancel) {
    //   console.log(res.tapIndex)//console出了下标
    // }
    //   }
    // });
  },
  goLoan(item) {
    if (!app.util.gologin()) {
      return;
    }
    wx.navigateTo({
      url: "/pages/Loan/apply/index" +
        "?prama=" +
        encodeURIComponent(JSON.stringify(item)),
    });
  },
  // 跳转至贷款产品页
  goLoanPage() {
    let prama = {
      listData: this.data.loanList,
    };
    wx.navigateTo({
      url: "/pages/Loan/index" +
        "?prama=" +
        encodeURIComponent(JSON.stringify(prama)),
    });
  },
  goToOther: function () {
    wx.navigateTo({
      url: "../other/index",
    });
  },
});