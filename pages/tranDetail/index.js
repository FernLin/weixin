// pages/User/index.js
const app = getApp();
const openId = wx.getStorageSync("openid");
const unionId = wx.getStorageSync("unionId");
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
  getTransInfoList(acNo, startDate, endDate) {
    app.service.Transaction.wxAcctDetailQry({
      acNo,
      startDate,
      endDate,
    }).then((res) => {
      if (res.list) {
        // TODO:虚拟列表
        this.setData({
          transInfoList: res.list,
        });
      }
    });
  },
  onSearch() {
    const acNo = this.data.selectedAccount.acNo,
      startDate = this.data.startDate.replace(/-/g, ""),
      endDate = this.data.endDate.replace(/-/g, "");
    this.getTransInfoList(acNo, startDate, endDate);
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
      startDate: timeSlotN.w.start,
      endDate: timeSlotN.w.end,
    });
    this.getTransInfoList(
      options.acNo,
      timeSlotN.w.start.replace(/-/g, ""),
      timeSlotN.w.end.replace(/-/g, "")
    );
    app.service.Global.wxAcListQry({
      openid: openId,
      unionId,
    }).then((res) => {
      if (res.userAccount) {
        const acList = res.userAccount.map((el) => {
          return {
            ...el,
            text: app.util.hiddenBankCard(el.acNo),
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
