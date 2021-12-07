// pages/foud/fundBuy/index.js
const app = getApp()
import Dialog from "@vant/weapp/dialog/dialog"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isConfirm: 0,
    showPayPwdInput: false, //是否展示密码输入层
    pwdVal: '', //输入的密码
    payFocus: true, //文本框焦点
    prdInfo: {},
    perchasingAmount: '',
    tradeAccount: '',
    showAccList: false,
    actions: [],
    isChecked: false, //阅读协议
    acDetail: {},
    passwordKeyboard:{},
    keyboardData:{}
  },
  //切换卡片
  changeBankCard() {
    this.setData({
      showAccList: true
    })
  },
  //选择银行卡
  onSelect(e) {
    this.setData({
      tradeAccount: e.detail.value,
      showAccount: e.detail.name,
      acSeq: e.detail.acSeq
    })
    this.getAccountInfo()
  },
  //关闭银行卡选择框
  onClose() {
    this.setData({
      showAccList: false
    })
  },
  // 获取用户银行卡信息
  getAccountList() {

    app.api.post("pweb/perAcListQry.do").then(res => {
      if (res.respCode === '00000000') {
        let actions = []
        res.data.accountList.forEach(item => {
          actions.push({
            name: app.util.formatAccountNo(item.acNo),
            value: item.acNo,
            acSeq: item.acSeq
          })
        })
        this.setData({
          showAccount: app.util.formatAccountNo(res.data.accountList[0].acNo),
          tradeAccount: res.data.accountList[0].acNo,
          acSeq: res.data.accountList[0].acSeq,
          actions: actions
        })
        this.getAccountInfo()
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }

    })
  },
  //查询账户详情
  getAccountInfo() {

    app.api.post('pweb/perWxAcctInfoQuery.do', {
      acNo: this.data.tradeAccount,
      acSeq: this.data.acSeq,
      idNo: this.data.userInfo.identity.idNo,
      idType: 'P02'

    }).then(res => {
      if (res.respCode == "00000000") {

        this.setData({
          acDetail: res.data.acDetail
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
  //购买
  buyFund(step) {
    //第一步成功之后校验密码，校验密码完成之后再调一遍
    let header
    if (step == '1') {
      header = {
        trsType: "confirm"
      }
    }
    if (step == '2') {
      header = {
        transAuthType: "multi_step_auth"
      }
    }


    let params = {
      prdCodeSeq: this.data.prdInfo.prdCode,
      perchasingAmount: this.data.perchasingAmount,
      tradeAccount: this.data.tradeAccount,
      acNo: this.data.tradeAccount,
      acSeq: this.data.acSeq,
      idNo: this.data.userInfo.identity.idNo,
      idType: "P02"
    }
    app.api.post("pweb/perWxFundProductOrder.do", params, header).then(res => {
      if (res.respCode === '00000000') {
        if (step == '1') {
          this.checkPassword()
        } else {
          let prdInfo = this.data.prdInfo
          prdInfo.perchasingAmount = this.data.perchasingAmount
          wx.navigateTo({
            url: `/pages/fund/fundBuyResult/index?prdInfo=${JSON.stringify(prdInfo)}`
          })
        }

      } else {
        if (res.respCode === '41102075') {
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
        if (res.respCode === '41102013') {
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

        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }
    })
  },
  checkPassword() {
    var scret = app.globalData.rsa.encrypt(this.data.passwordKeyboard.actualInput.join(','));
    let params = {
      "passWord": scret,
      "transactionId": "perWxFundProductOrder"
    }
    app.api.post("pweb/perTTransAuthenticStep.do", params).then(res => {
      if (res.respCode === '00000000') {
        this.buyFund('2')
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }
    })
  },
  //点击确定
  sureBuy() {
    this.hidePayLayer();
    // if (this.data.pwdVal.length < 6) {
    //   wx.showToast({
    //     title: '请输入正确的交易密码',
    //     icon: 'none', //icon
    //     duration: 1500 //停留时间
    //   })
    // } else {
    //   this.hidePayLayer();
    // }
  },
  handleConfirm: function (e) {
    if (e.detail === this.data.isConfirm) {
      this.setData({
        isConfirm: '0'
      })
    } else {
      this.setData({
        isConfirm: e.detail
      })

    }
  },
  /**
   * 显示支付密码输入层
   */
  showInputLayer: function () {
    if (!(Number(this.data.perchasingAmount) > 0)) {
      wx.showToast({
        title: '请输入购买金额',
        icon: 'none', //icon
        duration: 1500 //停留时间
      })
      return
    }
    if ((Number(this.data.perchasingAmount) > Number(this.data.acDetail.acctBalance))) {
      wx.showToast({
        title: '余额不足',
        icon: 'none', //icon
        duration: 1500 //停留时间
      })
      return
    }
    if (this.data.isConfirm == '0') {
      wx.showToast({
        title: '请勾选阅读协议',
        icon: 'none', //icon
        duration: 1500 //停留时间
      })
      return
    }
    this.passwordKeyboard.openKeyboard(this.data.passwordKeyboard, 'password');
    this.setData({
      showPayPwdInput: true,
      // payFocus: true
    });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function () {

    var val = this.data.pwdVal;
    console.log(val, '121212')

    this.setData({
      showPayPwdInput: false,
      payFocus: false,
      pwdVal: this.data.pwdVal
    }, function () {
    
      this.buyFund('1')
    });

  },
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({
      payFocus: true
    });
  },

  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    this.setData({
      pwdVal: e.detail.value
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    let prdInfo = JSON.parse(options.prdInfo)
    if (!prdInfo.prdCode) {
      prdInfo.prdCode = prdInfo.prdCodeSeq
    }
    this.setData({
      prdInfo: prdInfo,
      userInfo: userInfo
    })
    // this.showInputLayer();
    this.getAccountList()

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
    console.log(app.tiny,'app')
    this.passwordKeyboard = new app.tiny.passwordKeyboard('passwordKeyboard');   
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

  },

})