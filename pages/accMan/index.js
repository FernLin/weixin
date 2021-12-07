// pages/User/index.js
const app = getApp()
import Dialog from "@vant/weapp/dialog/dialog"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankPng: "/assets/bankicon.png",
    bankCardList: "",
    unbindPopup: false,
    unbindCardInfo: "",
    messagePass: "",
    messageIndex: "",
    loading: false,
    unbindHiddenCard: "",
    verCodeChecked: false
  },
  //跳转绑卡
  goBindCard() {
    wx.navigateTo({
      url: '/pages/accMan/bindCard/index',
    })
  },
  //开户
  openAccount() {
    wx.navigateTo({
      url: '/pages/accMan/openAccount/index',
    })
  },
  getSortCardList() {
    let cardList = wx.getStorageSync('bankCardList')
    if (cardList) {
      cardList.sort(function (a, b) {
        return b.majorCardFlag - a.majorCardFlag
      })
      this.setData({
        bankCardList: cardList
      })
    }
  },
  // 解绑银行卡校验
  unBindBankCard(e) {
    let data = {
      acNo: e.currentTarget.dataset.item.acNo
    }
    let header = {
      trsType: "confirm"
    }
    this.setData({
      loading: true,
      unbindHiddenCard: e.currentTarget.dataset.item.acNoHidden,
    
    })
    app.api.post("pweb/perAcctDel.do", data, header).then(res => {
      this.setData({
        loading: false
      })
      if (res.respCode == "00000000" && res.data.authenticateTypeList[0] == "S") {
        let unbindCardInfo = e.currentTarget.dataset.item
        unbindCardInfo.showPhoneNo= app.util.formatPhoneNo(unbindCardInfo.openMobilephone)
        this.setData({
          unbindPopup: true,
          unbindCardInfo: unbindCardInfo
        })
        this.getVercode()
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }
    })
  },
  // 解绑银行卡
  unBindBankCardF() {
    if (!this.data.verCodeChecked) {
      wx.showToast({
        title: "验证码错误~！",
        icon: 'none', //icon
        duration: 3000 //停留时间
      })
    }
    let data = {
      acNo: this.data.unbindCardInfo.acNo
    }
    let header = {
      transAuthType: "multi_step_auth"
    }
    app.api.post("pweb/perAcctDel.do", data, header).then(res => {
      if (res.respCode == "00000000") {
        this.setData({
          unbindPopup: false
        })
        this.data.bankCardList.forEach((ele, index) => {
          if (ele.acNo == this.data.unbindCardInfo.acNo) {
            this.data.bankCardList.splice(index, 1)
            this.setData({
              bankCardList: this.data.bankCardList
            })
            wx.setStorageSync('bankCardList', this.data.bankCardList)
            return
          }
        })
        wx.showToast({
          title: "解绑成功~！",
          icon: 'none', //icon
          duration: 3000 //停留时间
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
  // 发送解绑验证码
  getVercode() {
    let data = {
      mobilePhone: this.data.unbindCardInfo.openMobilephone,
      transactionId: "perAcctDel"
    }
    app.api.post("pweb/perSendSms.do", data).then(res => {
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
  // 校验短信验证码
  checkVercode() {
    let data = {
      index: this.data.messageIndex,
      transactionId: "perAcctDel",
      code: this.data.messagePass
    }
    app.api.post("pweb/perSAuthSmsStep.do", data).then(res => {
      if (res.respCode == "00000000" && res.data.authRes == "true") {
        this.setData({
          verCodeChecked: true
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
  // 输入验证码
  bindPassword(e) {
    if (e.detail.value.length == 6) {
      this.setData({
        messagePass: e.detail.value
      })
      this.checkVercode()
    }
  },
  // 动账通知分享查询
  goAccNotice() {
    wx.navigateTo({
      url: '/pages/accMan/accNotice/index',
    })
  },
  // 关闭弹框
  closePopup() {
    this.setData({
      unbindPopup: false
    })
  },
  // 银行卡转账查询
  goTransDetail(e) {
    var obj = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '/pages/tranDetail/index?obj=' + encodeURIComponent(obj)
    })
  },
  // 设为默认
  setDefault(e) {
    Dialog.confirm({
      title: '提示',
      message: `确认设置\n${e.currentTarget.dataset.item.acNoHidden}\n为默认账户？`,
    }).then(() => {
      // on confirm
      let data = {
        acNo: e.currentTarget.dataset.item.acNo
      }
      let header = {
        trsType: "confirm"
      }
      app.api.post("pweb/wxPublicMajorAcct.do", data, header).then(res => {
        if (res.respCode == "00000000") {
          wx.showToast({
            title: "设置成功~！",
            icon: 'none', //icon
            duration: 3000 //停留时间
          })
          this.getUserBankCardInfo()
        } else {
          wx.showToast({
            title: res.respMessage,
            icon: 'none', //icon
            duration: 5000 //停留时间
          })
        }
      }).catch((res) => {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 3000 //停留时间
        })
      });
    }).catch(() => {
      wx.showToast({
        title: "已取消~",
        icon: 'none', //icon
        duration: 3000 //停留时间
      })
    });
  },
  // 获取用户银行卡信息
  getUserBankCardInfo() {
    app.api.post("pweb/perAcListQry.do").then(res => {
      if (res.respCode == '00000000') {
        if (res.data.accountList && res.data.accountList.length != 0) {
          let list = app.util.userComputed(res.data.accountList)
          this.setData({
            bankCardList: list
          })
          wx.setStorageSync('bankCardList', res.data.accountList)
          this.getSortCardList()
        }
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
  onLoad: function () {
    this.getSortCardList()
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