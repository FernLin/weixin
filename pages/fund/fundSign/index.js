// pages/foud/fundsign/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isConfirm: 0,
    manager: '', //客户经理
    email: '', //邮箱
    postNo: '', //邮政编码
    mailAddr: '', //通讯地址
    mobileNo: '', //手机号码
    certificateNo: '', //证件号码
    certificateType: '', //证件类型
    cifName: '' //姓名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo,'userInfo')
    this.setData({
      cifName: userInfo.userName,
      certificateType: userInfo.identity.idType,
      certificateNo: userInfo.identity.idNo,
      mobileNo: userInfo.mobilePhone,
      mailAddr: userInfo.address,
      postNo: userInfo.postCode,
      email: userInfo.email
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

  },
  handleConfirm: function (e) {
    if (e.detail === this.data.isConfirm) {
      this.setData({
        isConfirm: 0
      })
    } else {
      this.setData({
        isConfirm: e.detail
      })
    }
  },
  goNext() {
    let params = {
      manager: this.data.manager, //客户经理
      email: this.data.email, //邮箱
      postNo: this.data.postNo, //邮政编码
      mailAddr: this.data.mailAddr, //通讯地址
      mobileNo: this.data.mobileNo, //手机号码
      certificateNo: this.data.certificateNo, //证件号码
      certificateType: this.data.certificateType, //证件类型
      cifName: this.data.cifName //姓名
    }
    app.api.post("pweb/perFundContract.do", params).then(res => {
      if (res.respCode === '00000000') {
        wx.showToast({
          title: '签约成功',
          icon: 'none', //icon
          duration: 3000 //停留时间
        })
        setTimeout(() => {
          wx.navigateBack({ //返回
            delta: 2
          })
        }, 3000);
      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      }

    })
  }

})