// pages/User/index.js
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
let timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    minDate: new Date(app.util.getDay(3)).getTime(),
    verifyCode: "",
    countDownNum: 60,
    countDownFlag: true,
    indexCode: "",
    currentData: {
      bankCode: "000", // 银行编号*固定值
      openCity: "", // 开户城市*为空
      openBranch: "", // 开户网点*
      openDate: "", // 预约开户日期*
      applyTrans: "微信", // 申请渠道*
      linkName: "", // 联系人姓名*
      linkTel: "", // 联系人电话*
      prov: "", // 省*
      city: "", // 市*
      dist: "", // 区*
    },
    showDatePopup: false,
    showPicker: false,
    title: "",
    pickerType: "",
    columns: [],
    columnsProv: [],
    columnsCity: [],
    columnsDist: [],
    selectedProv: {},
    selectedCity: {},
    selectedDist: {},
    selectedDate: "",
    selectedNet: {
      addr: "",
      depId: "",
      deptName: "",
    },
    hasGetVerifyCode: false,
  },
  // 选择省份
  onProvClick() {
    this.setData({
      pickerType: "prov",
      showPicker: true,
      title: "选择省份",
      columns: this.data.columnsProv,
    });
  },
  // 选择城市
  onCityClick() {
    if (!this.data.selectedProv.text) {
      Toast("请先选择省份！");
      return;
    }
    this.setData({
      pickerType: "city",
      showPicker: true,
      title: "选择城市",
      columns: this.data.columnsCity,
    });
  },
  // 选择区县
  onDistClick() {
    if (!this.data.selectedProv.text) {
      Toast("请先选择省份！");
      return;
    }
    if (!this.data.selectedCity.text) {
      Toast("请先选择城市！");
      return;
    }
    this.setData({
      pickerType: "dist",
      showPicker: true,
      title: "选择区县",
      columns: this.data.columnsDist,
    });
  },
  // 选择预约开户时间
  onDateClick() {
    this.setData({
      showDatePopup: true,
    });
  },
  onDateClose() {
    this.setData({
      showDatePopup: false,
    });
  },
  onDateConfirm(event) {
    this.setData({
      showDatePopup: false,
      selectedDate: app.util.times(event.detail),
      "currentData.openDate": app.util.times(event.detail).replace(/-/g, ""),
    });
  },
  // 选择网点
  onNetClick() {
    if (!this.data.selectedProv.text) {
      Toast("请先选择省份！");
      return;
    }
    if (!this.data.selectedCity.text) {
      Toast("请先选择城市！");
      return;
    }
    wx.navigateTo({
      url:
        "/pages/EnterpriseAccountOpen/SelectNet/index?cityCode=" +
        this.data.selectedCity.cityCode,
    });
  },
  // 下一步
  toNext() {
    if (!this.data.currentData.linkName) {
      Toast("请先输入经办人信息！");
      return;
    }
    if (!this.data.currentData.linkTel) {
      Toast("请输入正确格式的手机号！");
      return;
    }
    if (!this.data.hasGetVerifyCode) {
      Toast("请先获取短信验证码！");
      return;
    }
    if (!this.data.verifyCode) {
      Toast("请正确输入短信验证码！");
      return;
    }
    app.service.Global.wxAuthSmsNoLogin({
      index: this.data.indexCode,
      code: this.data.verifyCode,
      transactionId: "wxApplyOpenAct",
      mobilePhone: this.data.currentData.linkTel,
    }).then((result) => {
      if (result.authRes) {
        wx.navigateTo({
          url:
            "/pages/EnterpriseAccountOpen/EnterpriseInformation/index?enterpriseInfo=" +
            JSON.stringify(this.data.currentData),
        });
      }
    });
  },
  // 联系人
  onLinkInput(e) {
    this.setData({
      "currentData.linkName": e.detail.value,
    });
  },
  // 手机号
  onMobileInput(e) {
    this.setData({
      "currentData.linkTel": e.detail.value,
    });
  },
  // 输入验证码
  bindPassword(e) {
    this.setData({
      verifyCode: e.detail.value,
    });
  },
  // 获取验证码
  getVercode() {
    if (app.util.validatePhone(this.data.currentData.linkTel)) {
      app.service.Global.wxCommonConfirm({
        transactionId: "wxApplyOpenAct",
      }).then((result) => {
        let params = {
          mobilePhone: this.data.currentData.linkTel,
          transactionId: "wxApplyOpenAct",
        };
        app.service.Global.wxSendSms(params).then((res) => {
          this.setData({
            indexCode: res.index,
            verifyCode: "",
            hasGetVerifyCode: true,
          });
          this.countDownF();
          Toast("验证码已发送~！");
        });
      });
    } else {
      Toast("请输入正确格式的手机号！");
    }
  },
  // 倒计时
  countDownF() {
    if (!!timer) clearInterval(timer);
    let _this = this;
    this.setData({
      countDownFlag: false,
      countDownNum: 60,
    });
    timer = setInterval(function () {
      if (_this.data.countDownNum != 0) {
        _this.setData({
          countDownNum: _this.data.countDownNum - 1,
        });
      } else {
        clearInterval(timer);
        _this.setData({
          countDownFlag: true,
        });
      }
    }, 1000);
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
    const { value } = event.detail;
    // 选择省份后请求接口获取城市数据
    if (this.data.pickerType === "prov") {
      this.getCityData("cityList", "cityName", "columnsCity", {
        provCode: value.provCd,
      });
      this.setData({
        selectedProv: value,
        "currentData.prov": value.provCd,
      });
    }
    // 选择城市后请求接口获取区县数据
    if (this.data.pickerType === "city") {
      this.getCityData("districtList", "areaName", "columnsDist", {
        cityCode: value.cityCode,
      });
      this.setData({
        selectedCity: value,
        "currentData.city": value.cityCode,
      });
    }
    if (this.data.pickerType === "dist") {
      this.setData({
        selectedDist: value,
        "currentData.dist": value.areaCode,
      });
    }
  },
  // 获取城市数据
  getCityData(
    listName = "provList",
    label = "provName",
    columsName = "columnsProv",
    params = {}
  ) {
    app.service.EnterpriseAccountOPen.wxDeptCityQry(params).then((res) => {
      if (res[listName] && res[listName].length > 0) {
        const list = res[listName].map((el) => {
          return {
            ...el,
            text: el[label],
          };
        });
        this.setData({
          [columsName]: list,
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCityData();
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
