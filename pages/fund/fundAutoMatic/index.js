// pages/foud/fundRedemption/index.js
const app = getApp()
const pickList = {
  '每月': ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日'],
  '每周': ['星期一', '星期二', '星期三', '星期四', '星期五'],
};
const dateList = ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fundInfo: {},
    prdInfo: {},
    accAction: [],
    intervalAction: [],
    terminatioAction: [{
      name: '按时间中止'
    }, {
      name: '按次数中止'
    }, {
      name: '无'
    }],
    showAccAction: false, //展示卡选项
    showIntervalAction: false, //展示间隔选项
    showTermination: false, //展示终止选项
    maticDesc: '', //定投描述
    showPicker: false,
    pickList: [{
        values: Object.keys(pickList),
        className: 'column1',
      },
      {
        values: pickList['每月'],
        className: 'column2',
        defaultIndex: 2,
      },
    ],
    fixedGap: '', //定投间隔
    fixedDate: '', //定投日期
    perchasingAmount: '', //支付金额
    payerAcNo: '', //卡号
    planStopType: '', //计划终止方式
    planStopDate: '', //计划终止日期
    planStopNum: '', //计划终止次数
    showDatePicker: false, //终止日期选择
    dateList: dateList,
    isChecked: '0',
    showPayPwdInput: false //展示密码框

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let prdInfo = JSON.parse(options.prdInfo)
    let userInfo = wx.getStorageSync('userInfo')
    if (!prdInfo.prdCode) {
      prdInfo.prdCode = prdInfo.prdCodeSeq
    }
    console.log(prdInfo, 'prdInfo')
    this.setData({
      prdInfo: prdInfo,
      userInfo:userInfo
    })
    this.getAccountList()
  },
  handleConfirm(e) {
    console.log(e.detail, 'eeee')
    if (e.detail === this.data.isChecked) {
      this.setData({
        isChecked: '0'
      })
    } else {
      this.setData({
        isChecked: e.detail
      })

    }
  },

  //调定投接口
  perFundWxFixedInput(step = '1') {
  
    let header;
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
      prdName: this.data.prdInfo.prdName,
      prdCode: this.data.prdInfo.prdCode,
      payerAcNo: this.data.payerAcNo,
      perchasingAmount: this.data.perchasingAmount,
      fixedGap: this.data.fixedGap,
      fixedDate: this.data.fixedDate,
      planStopType: this.data.planStopType,
      planStopDate: this.data.planStopDate,
      planStopNum: this.data.planStopNum,
      acNo: this.data.payerAcNo,
      acSeq: this.data.acSeq,
      idNo: this.data.userInfo.identity.idNo,
      idType: "P02"

    }
    app.api.post("pweb/perFundWxFixedInput.do", params, header).then(res => {
      if (res.respCode === '00000000') {
        if (step == '2') {
          let prdInfo = this.data.prdInfo
          prdInfo.perchasingAmount = this.data.perchasingAmount
          prdInfo.showAccount = this.data.showAccount
          prdInfo.gap = this.data.fixedGap + this.data.fixedDate
          prdInfo.stopNum = this.data.planStopNum ? this.data.planStopNum : this.data.planStopDate ? this.data.planStopDate : ''
          prdInfo.maticDesc = this.data.maticDesc
          wx.navigateTo({
            url: `/pages/fund/fundAutoMaticResult/index?prdInfo=${JSON.stringify(prdInfo)}`
          })
        } else {
          this.checkPassword()
        }

      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
        this.setData({
          pwdVal:''
        })
      }
    })
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
   * 获取焦点
   */
    getFocus: function () {
      this.setData({
        payFocus: true
      });
    },
  
  //点击下一步
  tapNextStep(){
    if (this.data.isChecked == '0') {
      wx.showToast({
        title: '请勾选并同意协议',
        icon: 'none', //icon
        duration: 1500 //停留时间
      })
      return
    }
    if (!this.data.perchasingAmount) {
      wx.showToast({
        title: '请输入定投金额',
        icon: 'none', //icon
        duration: 1500 //停留时间
      })
      return
    }
    if (!this.data.fixedGap) {
      wx.showToast({
        title: '请选择定投间隔区间',
        icon: 'none', //icon
        duration: 1500 //停留时间
      })
      return
    }
    if (!this.data.fixedDate) {
      wx.showToast({
        title: '请选择定投间隔日期',
        icon: 'none', //icon
        duration: 1500 //停留时间
      })
      return
    }
    this.setData({
      showPayPwdInput: true,
      payFocus: true
    });
  },
   //点击密码输入框确定
   sureBuy() {

    if (this.data.pwdVal.length < 6) {
      wx.showToast({
        title: '请输入正确的交易密码',
        icon: 'none', //icon
        duration: 1500 //停留时间
      })
    } else {
      this.hidePayLayer();
    }
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
      this.perFundWxFixedInput('1')
    });

  },
  //校验密码
  checkPassword() {
    let params = {
      "passWord": this.data.pwdVal,
      "transactionId": "perFundWxFixedInput"
    }
    app.api.post("pweb/perTTransAuthenticStep.do", params).then(res => {
      if (res.respCode === '00000000') {
        this.perFundWxFixedInput('2')
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }
    })
  },
  //点击取消
  onCancel() {
    this.setData({
      showPicker: false
    })
  },
  //点击确认
  onConfirm(e) {
    this.setData({
      fixedGap: e.detail.value[0],
      fixedDate: e.detail.value[1],
      showPicker: false
    })
  },
  //点击取消
  onCancelDate() {
    this.setData({
      showDatePicker: false
    })
  },
  //点击确认
  onConfirmDate(e) {
    this.setData({
      planStopDate: e.detail.value,
      showDatePicker: false
    })
  },
  //滑动列表
  onChangePicker(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    picker.setColumnValues(1, pickList[value[0]]);
  },
  //点击切换定投间隔
  clickInterval() {
    this.setData({
      showPicker: true
    })
  },
  //点击切换卡片
  clickAcc() {
    console.log('clickacc')
    this.setData({
      showAccAction: true
    })
  },
  //点击选择间隔时间
  clickTerminationDate() {
    this.setData({
      showDatePicker: true
    })
  },
  //点击选择间隔方式
  clickTermination() {
    this.setData({
      showTermination: true
    })
  },
  //选择银行卡
  onSelect(e) {
    this.setData({
      showAccount: e.detail.name,
      payerAcNo: e.detail.value,
      acSeq: e.detail.acSeq
    })
  },
  //关闭银行卡选择框
  onClose() {
    this.setData({
      showAccAction: false
    })
  },
  //关闭间隔选项
  onCloseTermination() {
    this.setData({
      showTermination: false
    })
  },
  //选择间隔
  onSelectTermination(e) {
    this.setData({
      planStopType: e.detail.name,
      planStopDate: '',
      planStopNum: ''
    })
  },
  // 获取用户银行卡信息
  getAccountList() {
    app.api.post("pweb/perAcListQry.do").then(res => {
      if (res.respCode === '00000000') {
        let accAction = []
        res.data.accountList.forEach(item => {
          accAction.push({
            name: app.util.formatAccountNo(item.acNo),
            value: item.acNo,
            acSeq: item.acSeq
          })
        })
        this.setData({
          showAccount: app.util.formatAccountNo(res.data.accountList[0].acNo),
          accAction: accAction,
          payerAcNo: accAction[0].value,
          acSeq: res.data.accountList[0].acSeq,
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