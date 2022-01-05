// pages/User/index.js
const app = getApp();
const openId = wx.getStorageSync("openid");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bankPng: "/assets/bankicon.png",
    startDate: "",
    endDate: "",
    transInfoList: [],
    showPicker: false,
    showDatePicker: false,
    columns: [],
    selectedAccount: {},
    selectedDate: new Date().getTime(),
    dateKey: "",
  },
  onAcClick() {
    this.setData({
      showPicker: true,
    });
  },
  onDateClick(event) {
    this.setData({
      showDatePicker: true,
      dateKey: event.currentTarget.dataset.type,
      selectedDate: new Date(
        this.data[event.currentTarget.dataset.type]
      ).getTime(),
    });
  },
  // 选择器取消
  onPickerCancel() {
    this.setData({
      showPicker: false,
    });
  },
  // 选择器确认
  onPickerConfirm(event) {
    this.setData({
      showPicker: false,
    });
    this.setData({
      selectedAccount: event.detail.value,
    });
  },
  // 日期选择器取消
  onDatePickerCancel() {
    this.setData({
      showDatePicker: false,
    });
  },
  // 日期选择器确认
  onDatePickerConfirm(event) {
    this.setData({
      showDatePicker: false,
    });
    this.setData({
      [event.detail.dateKey]: app.util.times(event.detail.value),
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const timeSlotN = app.util.dates();
    this.setData({
      startDate: timeSlotN.m.start,
      endDate: timeSlotN.m.end,
    });
    app.service.Transaction.wxAcctDetailQry({
      acNo: options.acNo,
      startDate: timeSlotN.m.start.replace(/-/g, ""),
      endDate: timeSlotN.m.end.replace(/-/g, ""),
    }).then((res) => {
      if (res.data.list) {
        this.setData({
          transInfoList: res.data.list,
        });
      }
    });
    app.service.Global.wxAcListQry({
      openid: openId,
      unionId: "csunionid",
    }).then((res) => {
      if (res.data.userAccount) {
        const acList = res.data.userAccount.map((el) => {
          return {
            ...el,
            text: el.acNo,
          };
        });
        const currentAccount = acList.find((item) => {
          return item.acNo === options.acNo;
        });
        this.setData({
          columns: acList,
          selectedAccount: currentAccount,
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
