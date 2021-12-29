// pages/CashReserve/index.js

import Toast from "@vant/weapp/toast/toast";
const createRecycleContext = require("miniprogram-recycle-view");
var ctx;
// 获取应用实例
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewHeight: 0,
    citys: {},
    selectedCity: "",
    selectedProvCode: "",
    selectedCityCode: "",
    active: 0,
    searchVal: "",
    showPicker: false,
    columns: [],
    recordType: 1,
    bankList: [],
    locationData: {},
  },
  // 银行预约操作类型
  goCashOpera(event) {
    wx.navigateTo({
      url:
        "/pages/CashReserve/CashOpera/index?type=" +
        event.currentTarget.dataset.type,
    });
  },
  // tab切换
  onChange(event) {
    // TODO: tab切换至我的预约页面，请求数据
    if (event.detail.name === 1) {
      app.service.CashReserve.wxLargeCashBookQry().then((res) => {
        console.log(res);
      });
    }
  },
  // 关键字搜索
  onSearch(event) {
    if (this.data.locationData) {
      app.service.CashReserve.wxQueryDeptListByDist({
        // distance: "米",
        longitude: this.data.locationData.longitude,
        latitude: this.data.locationData.latitude,
        cityCode: this.data.selectedCityCode,
        provCd: this.data.selectedProvCode,
        deptName: event.detail,
        tradeFlag: 1,
      }).then((content) => {
        ctx.splice(0, this.data.bankList.length, content.data.list);
        this.setData({
          bankList: content.data.list,
        });
      });
    } else {
      Toast("获取当前位置失败，请重新授权！");
    }
  },
  // 关键字输入框清空
  onClear() {
    if (this.data.locationData) {
      app.service.CashReserve.wxQueryDeptListByDist({
        // distance: "米",
        longitude: this.data.locationData.longitude,
        latitude: this.data.locationData.latitude,
        cityCode: this.data.selectedCityCode,
        provCd: this.data.selectedProvCode,
        deptName: "",
        tradeFlag: 1,
      }).then((content) => {
        app.service.CashReserve.wxLatelyBookDeptQry({
          longitude: this.data.locationData.longitude,
          latitude: this.data.locationData.latitude,
        }).then((result) => {
          const list = content.data.list;
          if (result.data.deptId) {
            list.unshift({
              recent: true,
              addr: result.data.deptAddr,
              deptId: result.data.deptId,
              deptName: result.data.deptName,
              distance: result.data.distance,
              lat: result.data.lat,
              lon: result.data.lon,
              moneyChangeScheduleFlag: result.data.moneyChangeScheduleFlag,
              onlineLargeCashBookFlag: result.data.onlineLargeCashBookFlag,
            });
          }
          ctx.splice(0, this.data.bankList.length, list);
          this.setData({
            bankList: list,
          });
        });
      });
    } else {
      Toast("获取当前位置失败，请重新授权！");
    }
  },
  // 展示城市选择
  openPicker() {
    this.setData({
      showPicker: true,
    });
  },
  // 选择城市
  handlePicker(event) {
    const { picker, value } = event.detail;
    picker.setColumnValues(1, this.data.citys[value[0].text]);
  },
  // 选择器取消
  onPickerCancel() {
    this.setData({
      showPicker: false,
      searchVal: "",
    });
  },
  // 选择器确认
  onPickerConfirm(event) {
    this.setData({
      showPicker: false,
    });
    const { value } = event.detail;
    this.setData({
      selectedCity: value[1].text,
      selectedProvCode: value[0].value,
      selectedCityCode: value[1].value,
    });
    if (this.data.locationData) {
      app.service.CashReserve.wxQueryDeptListByDist({
        // distance: "米",
        longitude: this.data.locationData.longitude,
        latitude: this.data.locationData.latitude,
        cityCode: value[1].value,
        provCd: value[0].value,
        deptName: "",
        tradeFlag: 1,
      }).then((content) => {
        app.service.CashReserve.wxLatelyBookDeptQry({
          longitude: this.data.locationData.longitude,
          latitude: this.data.locationData.latitude,
        }).then((result) => {
          const list = content.data.list;
          if (result.data.deptId) {
            list.unshift({
              recent: true,
              addr: result.data.deptAddr,
              deptId: result.data.deptId,
              deptName: result.data.deptName,
              distance: result.data.distance,
              lat: result.data.lat,
              lon: result.data.lon,
              moneyChangeScheduleFlag: result.data.moneyChangeScheduleFlag,
              onlineLargeCashBookFlag: result.data.onlineLargeCashBookFlag,
            });
          }
          ctx.splice(0, this.data.bankList.length, list);
          this.setData({
            bankList: list,
          });
        });
      });
    } else {
      Toast("获取当前位置失败，请重新授权！");
    }
  },
  // 取消预约
  onCancel() {
    // TODO: 取消预约的点击事件
    console.log("取消预约");
  },
  // 获取城市数据
  getCityData() {
    let cityData = {};
    let columnData = [];
    let provList = [];
    let promiseList = [];
    // 获取省数据
    app.service.CashReserve.wxDeptProvAndCityQry().then((res) => {
      if (res.data.provList && res.data.provList.length > 0) {
        res.data.provList.forEach((prov) => {
          provList.push({
            text: prov.provName,
            value: prov.provCd,
          });
          // 获取市数据
          promiseList.push(
            new Promise((resolve, reject) => {
              app.service.CashReserve.wxDeptProvAndCityQry({
                provCode: prov.provCd,
              }).then((result) => {
                if (result.data.cityList) {
                  // 市数据格式化
                  const temp = result.data.cityList.map((city) => {
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
            columns: columnData,
            selectedCity: cityData[provList[0].text][0].text,
            selectedProvCode: provList[0].value,
            selectedCityCode: cityData[provList[0].text][0].value,
          });
        });
      }
    });
  },
  // 获取银行网点
  getBankList(provCode, cityCode, deptName = "") {
    const that = this;
    wx.getLocation({
      type: "wgs84",
      success(res) {
        that.setData({
          locationData: res,
        });
        app.service.CashReserve.wxQueryDeptListByDist({
          // distance: "米",
          longitude: res.longitude,
          latitude: res.latitude,
          cityCode: cityCode,
          provCd: provCode,
          deptName: deptName,
          tradeFlag: 1,
        }).then((content) => {
          app.service.CashReserve.wxLatelyBookDeptQry({
            longitude: res.longitude,
            latitude: res.latitude,
          }).then((result) => {
            const list = content.data.list;
            if (result.data.deptId) {
              list.unshift({
                recent: true,
                addr: result.data.deptAddr,
                deptId: result.data.deptId,
                deptName: result.data.deptName,
                distance: result.data.distance,
                lat: result.data.lat,
                lon: result.data.lon,
                moneyChangeScheduleFlag: result.data.moneyChangeScheduleFlag,
                onlineLargeCashBookFlag: result.data.onlineLargeCashBookFlag,
              });
            }
            ctx.append(list);
            that.setData({
              bankList: list,
            });
          });
        });
      },
      fail() {
        Toast("获取当前位置失败，请重新授权！");
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getCityData();
  },

  itemSizeFunc: function (item, idx) {
    return {
      width: ctx.transformRpx(750),
      height: ctx.transformRpx(240),
    };
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    ctx = createRecycleContext({
      id: "recycleId",
      dataKey: "bankList",
      page: this,
      itemSize: this.itemSizeFunc,
    });
    this.setData({
      viewHeight: wx.getSystemInfoSync().windowHeight - 98,
    });
  },

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
