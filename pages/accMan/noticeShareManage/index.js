// pages/accMan/accDetail/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    accountDetail: {
      acNoHidden: '673123123123123',
      bankAcTypeName: '1类卡',
      openBank: '赣州银行总部',
      majorCardFlag: '1',
      balance: '200'
    }
  },

  onShow: function () {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      type: option.type
    });
    wx.setNavigationBarTitle({
      title: `${option.type === "mine" ? "我的" : "接收"}共享管理`,
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
  onShareAppMessage: function (option) {
    console.log('添加分享人', option);
    return {
      title: '测试',
      path: '/pages/Microservice/index',
      imageUrl: '/assets/mainPage/head.png',
      success: function (res) {
        console.log('转发成功', res);
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败', res);
      }
    }
  }
})