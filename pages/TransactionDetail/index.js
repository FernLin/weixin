const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    transInfoList: [], // 交易明细列表
    showDatePicker: false, // 是否展示日期选择器
    accountList: [], // 账户列表
    selectedAccount: {}, // 已选账户
    selectedDate: new Date().getTime(), // 已选时间
    dateKey: "", // 时间类型（开始、结束）
    startDate: "", // 开始时间
    endDate: "", // 结束时间
    timeSlot: "近一周", // 筛选时间文字显示
    timeDote: "1", // 筛选时间值
    typeList: [
      { text: "全部", value: 0 },
      { text: "收入", value: 1 },
      { text: "支出", value: 2 },
    ], // 收入支出类型列表
    selectedType: 0, // 已选类型
    total: 0,
  },
  // 获取明细列表
  getTransInfoList(paramsIn = {}) {
    let params = {
      recordNumber: this.data.total, // 总条数（第二页开始上送）
      pageNo: "1", // 页码
      pageSize: "10", // 每页数量
      sonAcNo: this.data.selectedAccount.subAcNo, // 子账户
      curryType: this.data.selectedAccount.currency, // 币种
      payOrIncome: this.data.selectedType, // 收支类型（0：全部；1：收入；2：支出）
      defaultTime: this.data.timeDote, // 默认时间（1：一周；2：一月；3：三月；4：自定义）
      acNo: this.data.selectedAccount.acNo, // 账户号
      startDate: this.data.timeDote === "4" ? this.data.startDate : "", // 开始时间
      endDate: this.data.timeDote === "4" ? this.data.endDate : "", // 结束时间
      ...paramsIn,
    };
    app.service.Transaction.wxAcctDetailQry(params).then((res) => {
      this.setData({
        transInfoList: res.list,
      });
      // if (res.list) {
      //   if (ctx.getList().length > 0) {
      //     ctx.splice(0, ctx.getList().length, res.list);
      //   } else {
      //     ctx.append(res.list);
      //   }
      //   ctx.forceUpdate();
      //   this.setData({
      //     transInfoList: res.list,
      //   });
      // } else {
      //   ctx.splice(0, ctx.getList().length, []);
      //   ctx.forceUpdate();
      //   this.setData({
      //     transInfoList: res.list,
      //   });
      // }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const currAccountList = wx.getStorageSync("bankCardList");
    const acList = currAccountList.map((el) => {
      return {
        ...el,
        text: "尾号" + el.acNo.substr(-4),
        value: el.acNo,
      };
    });
    const currentAccount = acList.find((item) => {
      // TODO：记得打开
      // return item.acNo === options.acNo;
      return item.acNo === "6231276091000053497";
    });
    this.setData({
      accountList: acList,
      selectedAccount: currentAccount,
    });
    let params = {
      recordNumber: "", // 总条数（第二页开始上送）
      pageNo: "1", // 页码
    };
    this.getTransInfoList(params);
  },
  // 时间段选择
  doTimeSelect(item) {
    this.setData({
      timeDote: item.target.dataset.time,
    });
    // let t = item.target.dataset.time;
    // let timeSlotN = app.util.dates();
    if (t == "1") {
      this.setData({
        // startDate: timeSlotN.w.start,
        // endDate: timeSlotN.w.end,
        timeSlot: "近一周",
      });
    } else if (t == "2") {
      this.setData({
        // startDate: timeSlotN.m.start,
        // endDate: timeSlotN.m.end,
        timeSlot: "近一月",
      });
    } else if (t == "3") {
      this.setData({
        // startDate: timeSlotN.tm.start,
        // endDate: timeSlotN.tm.end,
        timeSlot: "近三月",
      });
    } else if (t == "4") {
      this.setData({
        timeSlot: "自定义",
      });
    }
  },
  // 开始时间查询
  goSearch() {
    this.selectComponent("#dropdown1").toggle();
    this.getTransInfoList();
  },
  // 重置
  restSearch() {
    this.setData({
      startDate: "",
      endDate: "",
      timeDote: "1",
      timeSlot: "近一周",
    });
    this.selectComponent("#dropdown1").toggle();
    this.getTransInfoList();
  },
  // 打开时间选择器
  onDateClick(event) {
    let currentSelectedDate = !!this.data[event.currentTarget.dataset.type]
      ? new Date(this.data[event.currentTarget.dataset.type]).getTime()
      : this.data.selectedDate;
    this.setData({
      showDatePicker: true,
      dateKey: event.currentTarget.dataset.type,
      selectedDate: currentSelectedDate,
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
  //切换查询类型
  changeType(e) {
    this.setData({
      selectedType: e.detail,
    });
    this.getTransInfoList();
  },
  //切换银行卡查询
  changeCard(e) {
    const currentAccount = this.data.accountList.find((item) => {
      return item.acNo === e.detail;
    });
    this.setData({
      selectedAccount: currentAccount,
    });
    this.getTransInfoList();
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
