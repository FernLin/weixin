// pages/EnterpriseAccountOpen/SelectNet/index.js
const app = getApp();
const createRecycleContext = require("miniprogram-recycle-view");
var ctx;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewHeight: 0,
    deptList: [],
    searchVal: "",
    cityCode: "",
  },
  // 获取输入的值
  getSearchVal(event) {
    this.setData({
      searchVal: event.detail,
    });
  },
  // 关键字搜索
  onSearch() {
    const list = this.data.deptList.filter(
      (el) =>
        el.addr.includes(this.data.searchVal) ||
        el.deptName.includes(this.data.searchVal)
    );
    ctx.splice(0, ctx.getList().length, list);
    ctx.forceUpdate();
  },
  // 关键字输入框清空
  onClear() {
    ctx.splice(0, ctx.getList().length, this.data.deptList);
    ctx.forceUpdate();
  },
  // 点击选择网点
  onSelect(e) {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      selectedNet: e.currentTarget.dataset.item,
      "currentData.openBranch": e.currentTarget.dataset.item.depId,
    });
    wx.navigateBack();
  },
  // 获取银行网点
  getBankList() {
    app.service.EnterpriseAccountOPen.wxOutletsDeptQry({
      deptType: "2",
      cityCode: this.data.cityCode
    }).then((res) => {
      if (ctx.getList().length > 0) {
        ctx.splice(0, ctx.getList().length, res.list);
      } else {
        ctx.append(res.list);
      }
      ctx.forceUpdate();
      this.setData({
        deptList: res.list,
      });
    });
  },
  itemSizeFunc: function (item, idx) {
    return {
      width: ctx.transformRpx(750),
      height: ctx.transformRpx(150),
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cityCode: this.options.cityCode,
    });
    ctx = createRecycleContext({
      id: "netRecycleId",
      dataKey: "deptList",
      page: this,
      itemSize: this.itemSizeFunc,
    });
    this.setData({
      viewHeight: wx.getSystemInfoSync().windowHeight - 65,
    });
    this.getBankList();
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
