import Toast from "@vant/weapp/toast/toast";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inSumBal: 0, // 收入总金额
    outSumBal: 0, // 支出总金额
    dateList: [], // 交易月份列表
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
    currentPage: 1, // 当前页数
    pageSize: 20, // 每次获取的数据条数
    noMore: false, // 没有更多
    pageList: [],
  },
  // 获取更多数据
  getMoreTransInfo() {
    // 分页加载数据
    const listData = this.data.transInfoList.filter((el, index) => {
      return (
        index < this.data.currentPage * this.data.pageSize &&
        index >= (this.data.currentPage - 1) * this.data.pageSize
      );
    });
    let tempParam = {};
    // 1.每次获取的数据跟设定的数据大小比较，如果小于设定大小说明后续没有数据了
    if (listData.length < this.data.pageSize) {
      tempParam = {
        currentPage: this.data.currentPage + 1, // 当前页数
        noMore: true, // 无更多数据
      };
    } else {
      // 仍有剩余数据待获取
      tempParam = {
        noMore: false, // 无更多数据
        currentPage: this.data.currentPage + 1, // 当前页数
      };
    }
    // 判断当前新获取数据是否为空，不为空时赋值
    if (listData.length > 0) {
      let pageList = this.data.pageList;
      tempParam.pageList = pageList.concat(listData);
    }
    this.setData(tempParam);
  },
  // 获取明细列表
  getTransInfoList() {
    this.reset();
    const openId = wx.getStorageSync("openid");
    let params = {
      openId,
      acNo: this.data.selectedAccount.acNo, // 账户号
      sonAcNo: this.data.selectedAccount.subAcNo, // 子账户
      curryType: this.data.selectedAccount.currency, // 币种
      payOrIncome: String(this.data.selectedType), // 收支类型（0：全部；1：收入；2：支出）
      defaultTime: String(this.data.timeDote), // 默认时间（1：一周；2：一月；3：三月；4：自定义）
      startDate:
        this.data.timeDote === "4" ? this.data.startDate.replace(/-/g, "") : "", // 开始时间
      endDate:
        this.data.timeDote === "4" ? this.data.endDate.replace(/-/g, "") : "", // 结束时间
    };
    app.service.Transaction.wxAcctDetailQry(params).then((res) => {
      this.setData({
        transInfoList: res.list,
        inSumBal: res.inSumBal,
        outSumBal: res.outSumBal,
        dateList: res.dateList,
      });
      this.getMoreTransInfo();
    });
  },
  // 滚动触底
  bindscrolltolower() {
    if (!this.data.noMore) {
      this.getMoreTransInfo();
    }
  },
  // 重置数据
  reset() {
    this.setData({
      currentPage: 1,
      noMore: false,
      pageList: [],
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
      return item.acNo === options.acNo;
    });
    this.setData({
      accountList: acList,
      selectedAccount: currentAccount,
    });
    if (!!currentAccount) {
      this.getTransInfoList();
    }
  },
  // 时间段选择
  doTimeSelect(item) {
    this.setData({
      timeDote: item.target.dataset.time,
    });
    let t = item.target.dataset.time;
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
    if (t !== "4") {
      this.goSearch();
    }
  },
  // 开始时间查询
  goSearch() {
    if (
      this.data.timeDote === "4" &&
      (!this.data.startDate || !this.data.startDate)
    ) {
      Toast("请选择正确的时间区间！");
      return;
    }
    const startTime = new Date(this.data.startDate).getTime();
    const endTime = new Date(this.data.endDate).getTime();
    if (startTime > endTime) {
      Toast("开始时间不能大于结束时间");
      return;
    }
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
  toDetail(e) {
    wx.navigateTo({
      url:
        "/pages/TransactionDetail/Details/index?details=" +
        JSON.stringify(e.currentTarget.dataset.info),
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
