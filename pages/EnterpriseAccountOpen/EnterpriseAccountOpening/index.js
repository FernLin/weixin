// pages/User/index.js
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobilePhone: "",
    verifyCode: "",
    countDownNum: 60,
    countDownFlag: true,
    indexCode: "",
    tempData: {},
    currentData: {
      bankCode: "000", // 银行编号
      openCity: "", // 开户城市
      openBranch: "", // 开户网点
      openDate: "", // 预约开户日期*
      applyTrans: "微信", // 申请渠道
      linkName: "", // 联系人姓名*
      linkTel: "", // 联系人电话*
      prov: "", // 省
      city: "", // 市
      dist: "", // 区
    },
    showPicker: false,
    title: "",
    pickerType: "",
    columns: [],
    columnsCity: [],
    columnsNets: [],
    selectedCity: {},
    selectedNet: {},
    citys: {},
    hasGetVerifyCode: false,
  },
  onCityClick() {
    this.setData({
      pickerType: "city",
      showPicker: true,
      title: "选择城市",
      columns: this.data.columnsCity,
    });
  },
  onNetClick() {
    if (Object.keys(this.data.selectedCity).length === 0) {
      Toast("请先选择城市");
    } else {
      this.setData({
        pickerType: "net",
        showPicker: true,
        title: "选择网点",
        columns: this.data.columnsNets,
      });
    }
  },
  // 下一步
  toNext() {
    if (!this.data.hasGetVerifyCode) {
      Toast('请先获取短信验证码！');
      return;
    }
    if (!this.data.verifyCode) {
      Toast('请正确输入短信验证码！');
      return;
    }
    app.service.Global.wxAuthSmsNoLogin({
      index: this.data.indexCode,
      code: this.data.verifyCode,
      transactionId: "wxApplyOpenAct",
      mobilePhone: this.data.phoneNum,
    }).then((result) => {
      if (result.authRes) {
        let params = {
          ...this.data.tempData,
          ...this.data.currentData,
        };
        app.service.EnterpriseAccountOPen.wxApplyOpenAct(params)
          .then((res) => {
            if (res) {
              Toast("绑卡成功~！");
              wx.reLaunch({
                url: "/pages/EnterpriseAccountOpen/index",
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
    if (app.util.validatePhone(this.data.phoneNum)) {
      app.service.Global.wxCommonConfirm({
        transactionId: "wxApplyOpenAct",
      }).then((result) => {
        let params = {
          mobilePhone: this.data.phoneNum,
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
    const { picker, value, index } = event.detail;
    this.data.pickerType === "city"
      ? this.setData({
          selectedCity: value,
        })
      : this.setData({
          selectedNet: value,
        });
  },
  // 获取城市数据
  getCityData() {
    let cityData = {};
    let columnData = [];
    let provList = [];
    let promiseList = [];
    // 获取省数据
    app.service.EnterpriseAccountOPen.wxDeptCityQry().then((res) => {
      if (res.provList && res.provList.length > 0) {
        res.provList.forEach((prov) => {
          provList.push({
            text: prov.provName,
            value: prov.provCd,
          });
          // 获取市数据
          promiseList.push(
            new Promise((resolve, reject) => {
              app.service.EnterpriseAccountOPen.wxDeptCityQry({
                provCode: prov.provCd,
              }).then((result) => {
                if (result.cityList) {
                  // 市数据格式化
                  const temp = result.cityList.map((city) => {
                    return {
                      text: city.cityName,
                      value: city.cityCode,
                    };
                  });
                  resolve({
                    key: prov.provName,
                    value: temp,
                  });
                }
              });
            })
          );
        });
        Promise.all(promiseList).then((rspList) => {
          rspList.map((res) => {
            cityData[res.key] = res.value;
          });
          columnData = [
            {
              values: provList,
            },
            {
              values: cityData[provList[0].text],
              defaultIndex: 0,
            },
          ];
          this.getBankList(
            provList[0].value,
            cityData[provList[0].text][0].value
          );
          this.setData({
            citys: cityData,
            columnsCity: columnData,
            selectedCity: cityData[provList[0].text][0],
          });
        });
      }
    });
  },
  // 获取银行网点
  getBankList(provCode, cityCode) {
    app.service.EnterpriseAccountOPen.wxOutletsDeptQry({
      deptType: "2",
      bankName: "赣州",
    }).then((res) => {
      conmsole.log(res);
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCityData();
    // this.setData({
    //   tempData: JSON.parse(options.enterpriseInfo),
    // });
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
