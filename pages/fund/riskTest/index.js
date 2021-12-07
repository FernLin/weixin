// pages/foud/riskAssessment/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isConfirm: 0,
    bankCardPopup: false,
    selectList: [], //选中题目列表
    list: [],
  },
  //获取详情
  getQuestion() {
    app.api.post('pweb/perWxFundRiskQuestionQuery.do').then(res => {
      console.log(res)
      if (res.respCode == "00000000") {
        this.setData({
          list: res.data.list
        })
        this.dealList(res.data.list)

      } else {
        wx.showToast({
          title: res.respMessage,
          icon: 'none', //icon
          duration: 3000 //停留时间
        })
      }
    })
  },

  //下一步
  nextStep() {

    console.log(this.data.selectList, 'selectList')
    let questionList = [],
      scoreList = [],
      optionList = []
    this.data.selectList.forEach(item => {
      questionList.push(item.questionNo)
      scoreList.push(item.score)
      optionList.push(item.riskOption)
    })
    console.log(questionList, scoreList, optionList)
    let params = {
      acNo: this.data.acNo,
      questionList: questionList.join(),
      scoreList: scoreList.join(),
      optionList: optionList.join()
    }
    app.api.post('pweb/perWxRiskAssessment.do', params).then(res => {
      console.log(res)
      if (res.respCode == "00000000") {
        wx.navigateTo({
          url: `/pages/fund/riskResult/index?result=${JSON.stringify(res.data)}`
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
  //选择选项
  onChange(e) {
    let temp = e.currentTarget.dataset
    var obj = "selectList[" + temp.index + "]";
    this.setData({
      [obj]: temp.obj
    })
  },
  //处理返回的列表
  dealList(list) {
    let quesionList = {}
    list.forEach((item, index) => {
      let {
        questionNo
      } = item;
      let questionTitle;
      if (item.riskOption == '0') {
        questionTitle = item.subject
      }
      if (!quesionList[questionNo]) {
        quesionList[questionNo] = {
          questionNo,
          questionTitle,
          options: []
        }
      }
      //题目不push到数组里
      if (item.riskOption != '0') {
        quesionList[questionNo].options.push(item);
      }

    })
    let list1 = Object.values(quesionList); // list 转换成功的数据
    let selectList = []
    list1.forEach(item => {
      selectList.push({})
    })

    this.setData({
      quesionList: list1,
      selectList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('1111222')
    this.getQuestion()

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
})