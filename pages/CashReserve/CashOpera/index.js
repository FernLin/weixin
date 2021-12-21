// pages/CashReserve/CashOpera/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reserveType: 'large',
    showPicker: false,
    title: '',
    pickerType: '',
    columns: [],
    columnsAccount: ['632145698754126', '632145685214569'],
    columnsDate: ['2021-12-21 10:00-16:00', '2021-12-22 10:00-16:00'],
    selectedAccount: '632145698754126',
    selectedDate: '',
    cashTotal: 0,
    cashPoolStep: {
      cny20: 0,
      cny10: 0,
      cny5: 0,
      cny1: 0,
      cny05: 0,
      cny01: 0,
    },
    cashPool: {
      cny20: 0,
      cny10: 0,
      cny5: 0,
      cny1: 0,
      cny05: 0,
      cny01: 0,
    },
  },

  changeValue(event) {
    switch (event.detail.base) {
      case 20:
        this.setData({
          'cashPoolStep.cny20': event.detail.count,
          'cashPool.cny20': event.detail.amount,
        });
        break;
      case 10:
        this.setData({
          'cashPoolStep.cny10': event.detail.count,
          'cashPool.cny10': event.detail.amount,
        });
        break;
      case 5:
        this.setData({
          'cashPoolStep.cny5': event.detail.count,
          'cashPool.cny5': event.detail.amount,
        });
        break;
      case 1:
        this.setData({
          'cashPoolStep.cny1': event.detail.count,
          'cashPool.cny1': event.detail.amount,
        });
        break;
      case 0.5:
        this.setData({
          'cashPoolStep.cny05': event.detail.count,
          'cashPool.cny05': event.detail.amount,
        });
        break;
      case 0.1:
        this.setData({
          'cashPoolStep.cny01': event.detail.count,
          'cashPool.cny01': event.detail.amount,
        });
        break;
    }
    this.getCashTotal();
  },

  getCashTotal() {
    const total = Object.values(this.data.cashPool).reduce((prev, cur, index, arr) => {
      return prev + cur;
    });
    this.setData({
      cashTotal: total
    });
  },

  onTypeChange(event) {
    this.setData({
      reserveType: event.detail,
    });
  },

  onAcClick() {
    this.setData({
      pickerType: 'account',
      showPicker: true,
      title: '选择账户',
      columns: this.data.columnsAccount
    });
  },
  onDateClick() {
    this.setData({
      pickerType: 'date',
      showPicker: true,
      title: '选择日期',
      columns: this.data.columnsDate
    });
  },

  // 选择账户
  handlePicker(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
  },
  // 选择器取消
  onPickerCancel() {
    this.setData({
      showPicker: false
    });
  },
  // 选择器确认
  onPickerConfirm(event) {
    this.setData({
      showPicker: false
    });
    const {
      picker,
      value,
      index
    } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
    this.data.pickerType === 'account' ?
      this.setData({
        selectedAccount: value
      }) : this.setData({
        selectedDate: value
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      reserveType: option.type
    });
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