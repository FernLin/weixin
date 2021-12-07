// index.js
// 获取应用实例
const app = getApp()

// pages/loan/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleName: '', // 姓名
    certType: "P02", // 证件类型
    certTypeName: '第二代居民身份证',
    certNo: '', // 证件号码
    isShowCertPiker: false,
    certTypeList: [
      { text: '第一代居民身份证', value: "P01" },
      { text: '第二代居民身份证', value: "P02" },
      { text: '临时居民身份证', value: "P03" },
      { text: '(中国)护照', value: "P04" },
      { text: '户口簿', value: "P05" }
    ],
    mobilePhone: "",
    smsCode: "",
    isHideCertPiker: true,
    isCanSend: true,
    waitSec: 60,
    countTask: null,
    loanInfo: "",
    messageIndex: "",
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loan = JSON.parse(decodeURIComponent(options.prama))
    this.setData({
      loanInfo: loan.currentTarget.dataset.item
    })
  },
  handlePeopleNameChange(e) {
    this.setData({
      peopleName: e.detail
    })
  },
  handleCertNoChange(e) {
    this.setData({
      certNo: e.detail
    })
  },
  handleMobilePhoneChange(e) {
    this.setData({
      mobilePhone: e.detail
    })
  },
  handleSmsCodeChange(e) {
    this.setData({
      smsCode: e.detail
    })
  },
  // 获取验证码
  handleGetSms() {
    if(this.data.mobilePhone.length == 11) {
      this.countDownF()
      let data = {
        mobilePhone: this.data.mobilePhone,
        transactionId: "perWxGetCredits"
      }
      app.api.post("pweb/perSendSms.do", data).then(res => {
        this.setData({
          messageIndex: res.data.index
        })
      })
    }else {
      wx.showToast({
        title: '请输入正确位数的手机号！',
        icon: 'none', //icon
        duration: 3000 //停留时间
      })
    }
  },
  countDownF() {
    let _this = this
    this.setData({
      isCanSend: false,
      waitSec: 60
    })
    let timer = setInterval(function() {
      if(_this.data.waitSec != 0) {
        _this.setData({
          waitSec: _this.data.waitSec - 1
        })
      }else {
        clearInterval(timer)
        _this.setData({
          isCanSend: true
        })
      }
    }, 1000) 
  },
  // 校验验证码
  confirmSms() {
    this.setData({
      loading: true
    })
    let data = {
      transactionId: "perWxGetCredits",
      index: this.data.messageIndex,
      code: this.data.smsCode
    }
    app.api.post("pweb/perAuthSms.do", data).then(res => {
      if(res.respCode == "00000000" && res.data.authRes == true) {
        this.handleNext()
      }else {
        this.setData({
          loading: false
        })
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }
    }).catch(err => {
      wx.showToast({
        title: err.respMessage,
        icon: 'none', //icon
        duration: 5000 //停留时间
      })
    })
  },
  handleNext () {
    if(this.data.peopleName && this.data.certType && this.data.mobilePhone && this.data.certNo) {
      let prama = {
        userName: this.data.peopleName,
        certType: this.data.certType,
        certTypeName: this.data.certTypeName,
        idNo: this.data.certNo,
        mobilePhone: this.data.mobilePhone,
        loanInfo: this.data.loanInfo
      }
      this.setData({
        loading: false
      })
      wx.navigateTo({
        url: "/pages/Loan/branch/index" + "?prama=" + encodeURIComponent(JSON.stringify(prama))
      })
    }else {
      this.setData({
        loading: false
      })
      wx.showToast({
        title: "请输入完整信息~！",
        icon: 'none', //icon
        duration: 5000 //停留时间
      })
    }
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
    if (this.data.countTask) {
      clearInterval(this.data.countTask)
    }
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

  toggleCertTypePicker: function () {
    // this.data.isShowCertPiker
    this.setData({ isShowCertPiker: !this.data.isShowCertPiker })
  },
  handleCertTypeConfirm: function (e) {
    const { value } = e.detail
    console.log(value)
    // const idx = this.data.certTypeList.findIndex(cert => cert === value)
    this.setData({
      certType: value.value,
      isShowCertPiker: false,
      certTypeName: this.data.certTypeList.find((cert) => cert.value === value.value).text
    })
  },
})