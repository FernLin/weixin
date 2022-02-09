// pages/User/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bankPng: "/assets/bankicon.png",
    cardInfo: "",
    beginTime: "起始时间",
    endTime: "结束时间",
    startTime: "",
    nowTime: "",
    bankCardPopup: false,
    transInfoList: "",
    transInfoList0: "",
    cardIdEnd: "",
    timeSlot: "查询时间段",
    timeDote: "0",
    value1: 0,
    value2: 0,
    value3: 0,
    option1: [
      { text: "全部", value: 0 },
      { text: "收入", value: 1 },
      { text: "支出", value: 2 },
    ],
    option2: [
      { text: "尾号0323", value: 0 },
      { text: "尾号5698", value: 1 },
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let myDate = new Date();
    let y = myDate.getFullYear();
    let m = myDate.getMonth() + 1;
    let d = myDate.getDate();
    let obj = JSON.parse(decodeURIComponent(options.obj));
    let cardList = [];
    if (wx.getStorageSync("bankCardList")) {
      wx.getStorageSync("bankCardList").forEach((ele) => {
        let params = {
          text: ele.acNoHidden,
          value: ele.acNo,
        };
        cardList.push(params);
      });
    }
    if (m < 10) {
      m = "0" + m;
    }
    this.setData({
      cardInfo: obj.acNo,
      option2: cardList,
      startTime: y - 3 + "-" + m + "-" + d,
      nowTime: y + "-" + m + "-" + d,
      value2: obj.acNo,
      cardIdEnd: "尾号" + obj.acNo.substring(obj.acNo.length - 4),
    });
    this.getBankCardTransInfo();
  },
  // 时间段查询
  doTimeSearch(item) {
    this.setData({
      timeDote: item.target.dataset.time,
    });
    let t = item.target.dataset.time;
    let timeSlotN = app.util.dates();
    if (t == "1") {
      this.setData({
        beginTime: timeSlotN.w.start,
        endTime: timeSlotN.w.end,
        timeSlot: "近一周",
      });
    } else if (t == "2") {
      this.setData({
        beginTime: timeSlotN.m.start,
        endTime: timeSlotN.m.end,
        timeSlot: "近一月",
      });
    } else if (t == "3") {
      this.setData({
        beginTime: timeSlotN.tm.start,
        endTime: timeSlotN.tm.end,
        timeSlot: "近三月",
      });
    } else if (t == "4") {
      this.setData({
        timeSlot: "自定义",
      });
    }
  },
  // 查询
  goSearch() {
    this.selectComponent("#dropdown1").toggle();
    this.getBankCardTransInfo();
  },
  // 重置
  restSearch() {
    this.setData({
      beginTime: "",
      endTime: "",
      timeDote: "0",
      timeSlot: "查询时间段",
    });
    this.selectComponent("#dropdown1").toggle();
    this.getBankCardTransInfo();
  },
  // 选择查询起始时间
  onConfirmBT(e) {
    this.setData({
      beginTime: e.detail.value,
    });
  },
  // 选择查询终止时间
  onConfirmET(e) {
    this.setData({
      endTime: e.detail.value,
    });
  },
  // 查询银行卡交易记录
  getBankCardTransInfo() {
    let data = {
      acNo: this.data.cardInfo,
      beginDate: this.data.beginTime == "起始时间" ? "" : this.data.beginTime,
      endDate: this.data.endTime == "结束时间" ? "" : this.data.endTime,
      searchTransType: "DAY",
    };
    app.api.post("pweb/perWxAcctDetailQry.do", data).then((res) => {
      if (res.respCode == "00000000") {
        if (res.data.list.length > 0) {
          res.data.list.sort(function (a, b) {
            return b.transTime - a.transTime;
          });
          res.data.list.forEach((ele) => {
            let l1 = ele.cardNo.length;
            let l2 = ele.oppositeAcct.length;
            ele.endCardNo = ele.cardNo.slice(l1 - 4);
            ele.endOppositeAcct = ele.oppositeAcct.slice(l2 - 4);
            let y = ele.transTime.slice(0, 4);
            let m = ele.transTime.slice(4, 6);
            let d = ele.transTime.slice(6, 8);
            let h = ele.transTime.slice(8, 10);
            let hm = ele.transTime.slice(10, 12);
            let hs = ele.transTime.slice(12, 14);
            ele.transTime =
              y + "-" + m + "-" + d + " " + h + ":" + hm + ":" + hs;
          });
          this.setData({
            transInfoList: res.data.list,
            transInfoList0: res.data.list,
          });
        }
      }
    });
  },
  //切换查询类型
  filterType(e) {
    if (this.data.transInfoList0.length > 0) {
      if (e.detail == 0) {
        this.setData({
          transInfoList: this.data.transInfoList0,
        });
      } else if (e.detail == 1) {
        let data = this.data.transInfoList0.filter((item) => {
          return item.transAmt > 0;
        });
        this.setData({
          transInfoList: data,
        });
      } else if (e.detail == 2) {
        let data = this.data.transInfoList0.filter((item) => {
          return item.transAmt < 0;
        });
        this.setData({
          transInfoList: data,
        });
      }
    }
  },
  //切换银行卡查询
  changeCard(e) {
    this.setData({
      cardInfo: e.detail,
      cardIdEnd: "尾号" + e.detail.substring(e.detail.length - 4),
    });
    this.getBankCardTransInfo();
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
