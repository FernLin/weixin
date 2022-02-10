// pages/CashReserve/index.js

import Toast from "@vant/weapp/toast/toast";
import Dialog from "@vant/weapp/dialog/dialog";
const createRecycleContext = require("miniprogram-recycle-view");
const openId = wx.getStorageSync("openid");
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
    recordList: [],
    canJumpMap: true,
    noLocation: true,
  },
  // 银行预约操作类型
  goCashOpera(event) {
    wx.navigateTo({
      url:
        "/pages/CashReserve/CashOpera/index?type=" +
        event.currentTarget.dataset.type +
        "&name=" +
        event.currentTarget.dataset.item.deptName +
        "&deptId=" +
        event.currentTarget.dataset.item.deptId +
        "&addr=" +
        event.currentTarget.dataset.item.addr +
        "&deptName=" +
        event.currentTarget.dataset.item.deptName,
    });
  },
  // tab切换
  onChange(event) {
    this.setData({
      active: event.detail.name,
    });
    if (event.detail.name === 1) {
      this.getRecordList();
    }
  },
  // 获取预约记录
  getRecordList() {
    app.service.CashReserve.wxLargeCashBookQry({
      FromUserName: openId,
    }).then((res) => {
      if (res) {
        const { largeCashlist, smallChangeExchangelist } = res;
        const largeList = largeCashlist.map((el) => {
          return {
            type: 1,
            deptName: el.deptName,
            deptAddr: el.deptAddr,
            deptId: el.deptId,
            name: el.largeList.name,
            bankCardId: el.largeList.bankCardId,
            bookTime: el.largeList.bookTime,
            bookMoney: el.largeList.bookMoney,
            bookDate: el.largeList.bookDate,
          };
        });
        const smallList = smallChangeExchangelist.map((el) => {
          let amounts = [];
          el.list.forEach((li) => {
            amounts.push(li.cyun + "元*" + li.nubr + "张");
          });
          return {
            type: 2,
            deptName: el.deptName,
            deptAddr: el.bookAddr,
            deptId: el.deptId,
            name: el.name,
            bankCardId: el.cardId,
            bookTime: el.tradeTime,
            bookDate: el.tradeDate,
            amounts: amounts.join("; "),
            count: el.bookNum,
          };
        });
        this.setData({
          recordList: [...largeList, ...smallList],
        });
      }
    });
  },
  getSearchVal(event) {
    this.setData({
      searchVal: event.detail,
    });
  },
  // 关键字搜索
  onSearch() {
    app.service.CashReserve.wxQueryDeptListByDist({
      // distance: "米",
      longitude: this.data.locationData.longitude,
      latitude: this.data.locationData.latitude,
      cityCode: this.data.selectedCityCode,
      provCd: this.data.selectedProvCode,
      deptName: this.data.searchVal,
      tradeFlag: 1,
    }).then((content) => {
      if (content.list) {
        ctx.splice(0, ctx.getList().length, content.list);
        ctx.forceUpdate();
        this.setData({
          bankList: content.list,
        });
      }
    });
  },
  // 关键字输入框清空
  onClear() {
    app.service.CashReserve.wxQueryDeptListByDist({
      // distance: "米",
      longitude: this.data.locationData.longitude,
      latitude: this.data.locationData.latitude,
      cityCode: this.data.selectedCityCode,
      provCd: this.data.selectedProvCode,
      deptName: "",
      tradeFlag: 1,
    }).then((content) => {
      if (content.list) {
        app.service.CashReserve.wxLatelyBookDeptQry({
          longitude: this.data.locationData.longitude,
          latitude: this.data.locationData.latitude,
          FromUserName: openId,
        }).then((result) => {
          if (result) {
            let list = content.list;
            if (result.deptId) {
              list = list.filter((el) => el.deptId != result.deptId);
              list.unshift({
                recent: true,
                addr: result.deptAddr,
                deptId: result.deptId,
                deptName: result.deptName,
                distance: result.distance,
                lat: result.lat,
                lon: result.lon,
                moneyChangeScheduleFlag: result.moneyChangeScheduleFlag,
                onlineLargeCashBookFlag: result.onlineLargeCashBookFlag,
              });
            }
            ctx.splice(0, ctx.getList().length, list);
            ctx.forceUpdate();
            this.setData({
              bankList: list,
            });
          }
        });
      }
    });
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
    app.service.CashReserve.wxQueryDeptListByDist({
      // distance: "米",
      longitude: this.data.locationData.longitude,
      latitude: this.data.locationData.latitude,
      cityCode: value[1].value,
      provCd: value[0].value,
      deptName: "",
      tradeFlag: 1,
    }).then((content) => {
      if (content.list) {
        app.service.CashReserve.wxLatelyBookDeptQry({
          longitude: this.data.locationData.longitude,
          latitude: this.data.locationData.latitude,
          FromUserName: openId,
        }).then((result) => {
          if (result) {
            let list = content.list;
            if (result.deptId) {
              list = list.filter((el) => el.deptId != result.deptId);
              list.unshift({
                recent: true,
                addr: result.deptAddr,
                deptId: result.deptId,
                deptName: result.deptName,
                distance: result.distance,
                lat: result.lat,
                lon: result.lon,
                moneyChangeScheduleFlag: result.moneyChangeScheduleFlag,
                onlineLargeCashBookFlag: result.onlineLargeCashBookFlag,
              });
            }
            ctx.splice(0, ctx.getList().length, list);
            ctx.forceUpdate();
            this.setData({
              bankList: list,
            });
          }
        });
      }
    });
  },
  jumpToMap(event) {
    const that = this;
    if (that.data.canJumpMap) {
      that.setData({
        canJumpMap: false,
      });
      wx.openLocation({
        latitude: parseFloat(event.currentTarget.dataset.item.lat),
        longitude: parseFloat(event.currentTarget.dataset.item.lon),
        complete: function () {
          setTimeout(() => {
            that.setData({
              canJumpMap: true,
            });
          }, 1500);
        },
      });
    }
  },
  // 取消预约
  onCancel(event) {
    Dialog.confirm({
      title: "提示",
      message: "您是否确认取消预约？",
      confirmButtonText: "确定",
      cancelButtonText: "暂不取消",
    })
      .then(() => {
        const { item } = event.currentTarget.dataset;
        app.service.CashReserve.wxLargeCashBookCancel({
          operationType: "2",
          businessType: String(item.type),
          widtdrawDate: item.bookDate,
          cardId: item.bankCardId,
          widtdrawTime: item.bookTime,
          deptId: item.deptId,
          FromUserName: openId,
        }).then((res) => {
          if (res) {
            Toast("取消预约成功！");
            this.getRecordList();
          }
        });
      })
      .catch(() => {
        console.log("暂不取消");
      });
  },
  // 获取城市数据
  getCityData() {
    let cityData = {};
    let columnData = [];
    let provList = [];
    let promiseList = [];
    // 获取省数据
    app.service.CashReserve.wxDeptProvAndCityQry().then((res) => {
      if (res.provList && res.provList.length > 0) {
        res.provList.forEach((prov) => {
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
    // 1.请求获取用户位置信息
    wx.getLocation({
      type: "wgs84",
      // 成功
      success(res) {
        that.setData({
          locationData: res,
          noLocation: false,
        });
      },
      // 失败
      fail() {
        that.setData({
          noLocation: true,
        });
        // 判断用户是否授权位置信息
        wx.getSetting({
          success(res) {
            // 如果已授权则可能是手机未打开定位功能
            if (res.authSetting.userLocation) {
              Toast(
                "地理位置获取失败，将影响功能使用，请打开手机定位功能后重新进入页面"
              );
            } else {
              // 如果未授权，则引导用户进入授权页面
              Dialog.confirm({
                title: "温馨提示",
                message: "地理位置获取失败，将影响功能使用，请前往设置",
                confirmButtonText: "设置",
                cancelButtonText: "取消",
              })
                .then(() => {
                  // 进入授权页面，无论用户是否重新授权都重新请求方法
                  wx.openSetting({
                    success() {
                      that.getBankList(provCode, cityCode, deptName);
                    },
                  });
                })
                .catch(() => {
                  console.log("暂不取消");
                });
            }
          },
        });
      },
      // 无论是否成功获取位置，都请求并数据
      complete() {
        app.service.CashReserve.wxQueryDeptListByDist({
          // distance: "米",
          longitude: that.data.locationData.longitude,
          latitude: that.data.locationData.latitude,
          cityCode: cityCode,
          provCd: provCode,
          deptName: deptName,
          tradeFlag: 1,
        }).then((content) => {
          if (content.list) {
            app.service.CashReserve.wxLatelyBookDeptQry({
              longitude: that.data.locationData.longitude,
              latitude: that.data.locationData.latitude,
              FromUserName: openId,
            }).then((result) => {
              if (result) {
                let list = content.list;
                if (result.deptId) {
                  list = list.filter((el) => el.deptId != result.deptId);
                  list.unshift({
                    recent: true,
                    addr: result.deptAddr,
                    deptId: result.deptId,
                    deptName: result.deptName,
                    distance: result.distance,
                    lat: result.lat,
                    lon: result.lon,
                    moneyChangeScheduleFlag: result.moneyChangeScheduleFlag,
                    onlineLargeCashBookFlag: result.onlineLargeCashBookFlag,
                  });
                }
                ctx.append(list);
                ctx.forceUpdate();
                that.setData({
                  bankList: list,
                });
              }
            });
          }
        });
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
