// pages/Loan/applyResult/index.js
Page({

  /**
   * 所有状态公用页面，跳入时传参控制，参数见resultList，身份认证未通过时需要传入原因说明使用参数reason
   * 重新申请和网点列表的跳转还没做
   */
  data: {
    tips: '温馨提示：多使用我行产品，增加守约行为等都可以增加受邀机会哦！    ',
    result: {},
    resultList: [
      {
        status: 0,
        iconUrl: '../../../assets/LoanApplyResult/success.png',
        title: '',
        content: ''
      },
      {
        status: 1,
        iconUrl: '../../../assets/LoanApplyResult/success.png',
        title: '恭喜您顺利提交借款申请',
        content: '您的申请正在加急审批中，审批完成将给您发送短信提醒，请注意查看。'
      },
      {
        status: 2,
        iconUrl: '../../../assets/LoanApplyResult/warning.png',
        title: '您有借款未结清\n请结清后再试'
      },
      {
        status: 3,
        iconUrl: '../../../assets/LoanApplyResult/warning.png',
        title: '身份认证未通过',
        content: '原因：'
      },
      {
        status: 4,
        iconUrl: '../../../assets/LoanApplyResult/warning.png',
        title: '身份证已过期，请更换有效身份证重试。'
      },
      {
        status: 5,
        iconUrl: '../../../assets/LoanApplyResult/warning.png',
        title: '产品上线初期仅向部分用户开放，敬请期待！'
      },
      {
        status: 6,
        iconUrl: '../../../assets/LoanApplyResult/warning.png',
        title: '系统开小差了，请重新申请'
      },
      {
        status: 7,
        iconUrl: '../../../assets/LoanApplyResult/warning.png',
        title: '您未在我行留存身份证信息\n请至我行任意网点办理后再试'
      },
      {
        status: 8,
        iconUrl: '../../../assets/LoanApplyResult/waiting.png',
        title: '审批中',
        content: '您的申请正在加急审批中，审批完成将给您发送短信提醒，请注意查看。'
      },
      {
        status: 9,
        iconUrl: '../../../assets/LoanApplyResult/error.png',
        title: '审批失败',
        content: '您于2019年1月3日提交的申请未通过，请于2019年2月30日后再次申请，谢谢！'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(decodeURIComponent(options.prama)))
    const { resultFlag, reason } = JSON.parse(decodeURIComponent(options.prama))
    let result = this.data.resultList[ resultFlag || 6 ]
    if (reason) {
      result.content += reason
    }
    this.setData({ result })
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

  handleBack: function () {
    if (this.data.result.status === 5 || this.data.result.status === 6) {
      // 重新申请
    } else {
      // 返回
      let count = getCurrentPages().length
      wx.navigateBack({
        delta: count - 1
      })
    }
  }
})