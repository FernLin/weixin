Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [{
        text: '步骤一',
        desc: '描述信息',
      },
      {
        text: '步骤二',
        desc: '描述信息',
      },
      {
        text: '步骤三',
        desc: '描述信息',
      },
      {
        text: '步骤四',
        desc: '描述信息',
      },
    ],
    option1: [{
        text: '全部',
        value: 0
      },
      {
        text: '全部',
        value: 1
      },
      {
        text: '全部',
        value: 2
      },
    ],
    option2: [{
        text: '近一月',
        value: 'a'
      },
      {
        text: '近三月',
        value: 'b'
      },
      {
        text: '近半年',
        value: 'c'
      },
    ],
    option3: [{
        text: '全部',
        value: 'a'
      },
      {
        text: '全部',
        value: 'b'
      },
      {
        text: '全部',
        value: 'c'
      },
    ],
    value1: 0,
    value2: 'a',
    value3: 'b',
    active: 0
  },
  onChange(e) {
    console.log(e.detail, 'eee')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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