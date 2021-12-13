// pages/User/index.js
const app = getApp()
import Toast from "@vant/weapp/toast/toast"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankPng: "/assets/bankicon.png",
    // bindPopup: false,
    bindCardId: "",
    bindCardType: "",
    idCard: "",
    userName: "",
    phoneNum: "",
    codeNum: "",
    messagePass: "",
    messageIndex: "",
    columns: [{values:['身份证', "港澳通行证"], defaultIndex: 0}],
    idcardPopup: false,
    bindFlag: false,
    countDownNum: 60,
    countDownFlag: true,
  },
  // 下一步
  goNext() {
    if(this.data.bindCardId && this.data.userName && this.data.idCard && this.data.bindCardType && this.data.phoneNum && this.data.codeNum && this.data.messagePass) {
      // this.bindBankCard()
      // this.setData({
      //   bindPopup: true,
      // })
      this.bindBankCardF()
    }else {
      wx.showToast({
        title: "请输入完整信息~！",
        icon: 'none', //icon
        duration: 5000 //停留时间
      })
    }
  },
  // TODO:更新图形验证码
  getCaptchaImg() {
    console.log('刷新图形验证码');
  },
  // 获取验证码
  getVercode() {
    if(this.data.phoneNum.length!=11){
      wx.showToast({
        title: '请输入手机号~！',
        icon: 'none', //icon
        duration: 3000 //停留时间
      })
      return
    }
    let data = {
      mobilePhone: this.data.phoneNum,
      transactionId: "perAddAccount"
    }
    app.api.post("pweb/perSendSms.do", data).then(res => {
      this.countDownF()
      this.setData({
        messageIndex: res.data.index
      })
      wx.showToast({
        title: '验证码已发送~！',
        icon: 'none', //icon
        duration: 3000 //停留时间
      })
    })
  },
  // 倒计时
  countDownF() {
    let _this = this
    this.setData({
      countDownFlag: false,
      countDownNum: 60
    })
    let timer = setInterval(function() {
      if(_this.data.countDownNum != 0) {
        _this.setData({
          countDownNum: _this.data.countDownNum - 1
        })
      }else {
        clearInterval(timer)
        _this.setData({
          countDownFlag: true
        })
      }
    }, 1000) 
  },
  // 校验验证码
  // checkVercode() {
  //   let data = {
  //     index: this.data.messageIndex,
  //     transactionId: "perAddAccount",
  //     code: this.data.messagePass
  //   }
  //   // perSAuthSmsStep
  //   app.api.post("pweb/perAuthSms.do", data).then(res => {
  //     if(res.respCode == "00000000") {
  //       this.bindBankCardF()
  //     }else {
  //       wx.showToast({
  //         title: res.respMessage,
  //         icon: 'none', //icon
  //         duration: 5000 //停留时间
  //       })
  //     }
  //   })
  // },
  // 输入验证码
  bindPassword(e) {
    if (e.detail.value.length == 6) {
      this.setData({
        messagePass: e.detail.value
      })
      // this.checkVercode()
      // this.bindBankCardF(1)
    }
  },
  bindBankCardF(flag) {
    let data = {
      acNo: this.data.bindCardId,
      idName: this.data.userName,
      idNo: this.data.idCard
    }
    let header = {
      trsType: "confirm"
    }
    // multi_step_auth
    if(flag==1) {
      header = {
        transAuthType: "unite_data_auth"
      }
      data = {
        acNo: this.data.bindCardId,
        idName: this.data.userName,
        idNo: this.data.idCard,
        index: this.data.messageIndex,
        code: this.data.messagePass,
        transactionId: "perAddAccount"
      }
    }
    app.api.post("pweb/perAddAccount.do", data, header).then(res => {
      if(res.respCode == "00000000" && res.data.authenticateTypeList && res.data.authenticateTypeList[0] == "S") {
        this.bindBankCardF(1)
        // this.setData({
        //   bindFlag: true
        // })
      }else if(res.respCode == "00000000" && flag==1) {
        wx.showToast({
          title: "绑卡成功~！",
          icon: 'none', //icon
          duration: 3000 //停留时间
        })
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/User/index',
          })
        }, 3000)
        
      }else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }
    }).catch(res => {
      wx.showToast({
        title: res.respMessage,
        icon: 'none', //icon
        duration: 5000 //停留时间
      })
    }) 
  },
  // 银行卡账号
  bindBankCardId(e) {
    this.setData({
      bindCardId: e.detail.value
    })
  },
  // 证件类型
  bindCardType() {
    this.setData({
      idcardPopup: true
    })
  },
  // 身份Id
  bindIdCard(e) {
    this.setData({
      idCard: e.detail.value
    })
  },
  // 用户姓名
  bindUserName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  // 图形验证码
  bindCodeNum(e) {
    this.setData({
      codeNum: e.detail.value
    })
  },
  // 用户手机号
  bindPhoneNum(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  onConfirm(e) {
    this.setData({
      bindCardType: e.detail.value,
      idcardPopup: false
    })
  },
  onClose(e) {
    this.setData({
      idcardPopup: false
    })
  },
  // 关闭弹框
  // closePopup() {
  //   this.setData({
  //     bindPopup: false
  //   })
  // },
  // 识别身份证
  success(res) {
    if(res.detail && res.detail.length>0) {
      let data =  res.detail
      this.setData({
        userName: data.name.text,
        idCard: data.id.text,
        bindCardType: "身份证"
      })
    }else {
      wx.showToast({
        title: "请重新上传~！",
        icon: 'none', //icon
        duration: 5000 //停留时间
      })
    }
  },
  // 银行卡识别
  bankSuccess(res) {
    if(res.detail && res.detail.length>0) {
      let data =  res.detail
      this.setData({
        bindCardId: data.number.text,
      })
    }else {
      wx.showToast({
        title: "请重新上传~！",
        icon: 'none', //icon
        duration: 5000 //停留时间
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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