// pages/Sign/Verified/index.js
Page({
  data: {
    value: '',
    show: false,
    columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    checked: true,
  },
  goBankCardSupport(){
    wx.navigateTo({
      url: './bankCardSupport/index',
    })
  },
  onChangeChecked(event) {
    this.setData({
      checked: event.detail,
    });
  },
  //input 点击
  clickinput: function () {
    //console.log("sex");
  },
  // Picker 选择器
  onConfirm(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    //console.log(`当前值：${value}, 当前索引：${index}`);
  },
  onCancel() {
    //console.log(`取消`);
  },
  // 弹出层
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
})