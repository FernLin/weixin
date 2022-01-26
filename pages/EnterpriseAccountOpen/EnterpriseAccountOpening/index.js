// pages/User/index.js
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    verifyCode: "",
    countDownNum: 60,
    countDownFlag: true,
    indexCode: "",
    tempData: {},
    currentData: {
      bankCode: "000", // 银行编号*固定值
      openCity: "", // 开户城市*为空
      openBranch: "", // 开户网点*
      openDate: "", // 预约开户日期*
      applyTrans: "微信", // 申请渠道*
      bankAcctFlag: "0", // 固定值*
      linkName: "", // 联系人姓名*
      linkTel: "", // 联系人电话*
      prov: "", // 省*
      city: "", // 市*
      dist: "", // 区*
    },
    showPicker: false,
    title: "",
    pickerType: "",
    columns: [],
    columnsProv: [],
    columnsCity: [],
    columnsDist: [],
    columnsDate: [],
    selectedProv: {},
    selectedCity: {},
    selectedDist: {},
    selectedDate: "",
    selectedNet: {
      addr: "",
      depId: "",
      deptName: "",
    },
    deptList: [],
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
      pickerType: "date",
      showPicker: true,
      title: "选择预约时间",
      columns: this.data.columnsDate,
    });
  },
  onNetClick() {
    wx.navigateTo({
      url: "/pages/EnterpriseAccountOpen/SelectNet/index",
    });
  },
  // 下一步
  toNext() {
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
        let params = {
          ...this.data.tempData,
          ...this.data.currentData,
        };
        app.service.EnterpriseAccountOPen.wxApplyOpenAct(params)
          .then((res) => {
            if (res) {
              wx.removeStorageSync("deptList");
              wx.reLaunch({
                url: "/pages/EnterpriseAccountOpen/ApplyResult/index",
              });
            }
          })
          .catch((err) => {
            this.setData({
              countDownFlag: true,
              countDownNum: 60,
            });
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
    let _this = this;
    this.setData({
      countDownFlag: false,
      countDownNum: 60,
    });
    let timer = setInterval(function () {
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
    if (this.data.pickerType === "date") {
      this.setData({
        selectedDate: value,
        "currentData.openDate": value.replace(/-/g, ""),
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
    // TODO: 正式测试时打开
    this.setData({
      // tempData: JSON.parse(options.enterpriseInfo),
      tempData: {
        licenseNum: "666666666666668", // 第一步获取
        companyName: "陕西青丘麦可超声电", // 第一步获取
        address: "赣江源大道84号XXX", // 第一步获取
        legalName: "从雁", // 第一步获取
        legalTel: "18970797082", // 第一步获取
        financeName: "从雁", // 第一步获取
        financeTel: "18970797082", // 第一步获取
        imageNo: "20220124_1643013060517", // 第二步获取
      },
      columnsDate: [
        app.util.getDay(1),
        app.util.getDay(2),
        app.util.getDay(3),
        app.util.getDay(4),
      ],
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
