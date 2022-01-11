// pages/CashReserve/CashOpera/index.js
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
const openId = wx.getStorageSync("openid");
const unionId = wx.getStorageSync("unionId");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addr: "",
    deptName: "",
    deptId: "",
    bankName: "",
    reserveType: "1",
    showPicker: false,
    title: "",
    pickerType: "",
    columns: [],
    columnsAccount: [],
    columnsDate: [],
    selectedAccount: {},
    selectedDate: {},
    amount: "",
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
          "cashPoolStep.cny20": event.detail.count,
          "cashPool.cny20": event.detail.amount,
        });
        break;
      case 10:
        this.setData({
          "cashPoolStep.cny10": event.detail.count,
          "cashPool.cny10": event.detail.amount,
        });
        break;
      case 5:
        this.setData({
          "cashPoolStep.cny5": event.detail.count,
          "cashPool.cny5": event.detail.amount,
        });
        break;
      case 1:
        this.setData({
          "cashPoolStep.cny1": event.detail.count,
          "cashPool.cny1": event.detail.amount,
        });
        break;
      case 0.5:
        this.setData({
          "cashPoolStep.cny05": event.detail.count,
          "cashPool.cny05": event.detail.amount,
        });
        break;
      case 0.1:
        this.setData({
          "cashPoolStep.cny01": event.detail.count,
          "cashPool.cny01": event.detail.amount,
        });
        break;
    }
    this.getCashTotal();
  },

  getCashTotal() {
    const total = Object.values(this.data.cashPool).reduce(
      (prev, cur, index, arr) => {
        return prev + cur;
      }
    );
    this.setData({
      cashTotal: total,
    });
  },

  onTypeChange(event) {
    this.setData({
      reserveType: event.detail,
    });
  },

  onAcClick() {
    this.setData({
      pickerType: "account",
      showPicker: true,
      title: "选择账户",
      columns: this.data.columnsAccount,
    });
  },
  onDateClick() {
    this.setData({
      pickerType: "date",
      showPicker: true,
      title: "选择日期",
      columns: this.data.columnsDate,
    });
  },

  // 选择账户
  handlePicker(event) {
    const { picker, value, index } = event.detail;
    console.log("选择", value);
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
    const { picker, value, index } = event.detail;
    this.data.pickerType === "account"
      ? this.setData({
          selectedAccount: value,
        })
      : this.setData({
          selectedDate: value,
        });
  },
  // 输入取款金额
  changeAmount(event) {
    this.setData({
      amount: event.detail.value,
    });
  },
  // 预约
  onReserve() {
    if (!this.data.selectedDate) {
      Toast("请选择取款日期");
      return;
    }
    let params = {
      addr: this.data.addr,
      deptName: this.data.deptName,
      bsTy: this.data.reserveType,
      wddt: this.data.selectedDate.value.replace(/-/g, ""),
      wdtm: "150000",
      amcr: this.data.selectedAccount.acNo,
      wdsn: this.data.deptId,
      FromUserName: openId,
    };
    // 大额预约
    if (this.data.reserveType === "1") {
      if (Number(this.data.amount) < 50000) {
        Toast(
          "抱歉该业务仅支持预约金额≥5万的大额取款，请您直接前往柜面办理业务"
        );
        return;
      }
      if (this.data.amount % 1 !== 0) {
        Toast("预约金额必须为整数");
        return;
      }
      if (Number(this.data.amount) > Number(this.data.selectedAccount.accBal)) {
        Toast("可用余额不足");
        return;
      }
      params = {
        ...params,
        wdAm: this.data.amount,
      };
    } else {
      // 零钱兑换
      let loop = Object.entries(this.data.cashPool).filter((pt) => pt[1]);
      if (loop.length === 0) {
        Toast("请选择零钞");
        return;
      }
      let ptA = {
        cny20: 20,
        cny10: 10,
        cny5: 5,
        cny1: 1,
        cny05: 0.5,
        cny01: 0.1,
      };
      params = {
        ...params,
        wdAm: this.data.cashTotal,
        loopSize: String(loop.length),
        list: loop.map((pt) => ({
          cyun: ptA[pt[0]],
          nubr: pt[1] / ptA[pt[0]],
          amot: pt[1],
        })),
      };
    }
    app.service.CashReserve.wxLargeCashBook(params).then((res) => {
      if (res) {
        Toast.success(
          `${this.data.reserveType === "1" ? "大额取款" : "零钱兑换"}预约成功！`
        );
        wx.navigateBack();
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      reserveType: option.type,
      bankName: option.name,
      deptId: option.deptId,
      addr: option.addr,
      deptName: option.deptName,
    });
    app.service.CashReserve.wxLargeCashBookDateQry({
      FromUserName: openId,
    }).then((res) => {
      if (res.list) {
        const dateList = res.list.map((date) => {
          return {
            text: date + " 10:00-16:00",
            value: date,
          };
        });
        this.setData({
          columnsDate: dateList,
        });
      }
    });
    app.service.Global.wxAcListQry({
      openid: openId,
      unionId,
    }).then((res) => {
      if (res.userAccount) {
        const acList = res.userAccount.map((el) => {
          return {
            ...el,
            text: el.acNo,
          };
        });
        this.setData({
          columnsAccount: acList,
          selectedAccount: acList[0],
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
