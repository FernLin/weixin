// pages/CashReserve/index.js
const citys = {
  江西省: ['赣州市', '吉安市', '宜春市', '抚州市', '九江市', '萍乡市', '上饶市', '景德镇市', '南昌市', '新余市'],
  福建省: ['厦门市'],
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedCity: '赣州市',
    active: 0,
    searchVal: '',
    showPicker: false,
    columns: [{
        values: Object.keys(citys),
      },
      {
        values: citys['江西省'],
        defaultIndex: 0,
      },
    ],
    recordType: 1,
  },
  onChange(event) {
    console.log(this.data.columns);
    console.log('标签切换成功至', event.detail.name);
  },
  openPicker() {
    this.setData({
      showPicker: true
    });
  },
  handlePicker(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    console.log(value);
    picker.setColumnValues(1, citys[value[0]]);
  },
  onPickerCancel() {
    this.setData({
      showPicker: false
    });
  },
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
    this.setData({
      selectedCity: value[1]
    });
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