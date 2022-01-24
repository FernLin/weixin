// pages/User/index.js
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    businessLicense: "/assets/enteraccopen/open1.png",
    faceCard: "/assets/enteraccopen/idcard1.png",
    emblemCard: "/assets/enteraccopen/idcard2.png",
    tempPath: {
      license: "",
      face: "",
      emblem: "",
    },
    tempData: {},
  },
  uploadCard(event) {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      camera: "back",
      success(res) {
        that.setData({
          [`tempPath.${event.currentTarget.dataset.name}`]: res.tempFiles[0]
            .tempFilePath,
        });
      },
      faile(res) {
        console.log(res);
      },
    });
  },
  deleteImg(event) {
    this.setData({
      [`tempPath.${event.currentTarget.dataset.name}`]: "",
    });
  },
  toNext() {
    const res = { ...this.data.tempData, imageNo: "" };
    if (
      this.data.tempPath.license &&
      this.data.tempPath.face &&
      this.data.tempPath.emblem
    ) {
      app.service.EnterpriseAccountOPen.wxAuthIdentity({
        license: wx
          .getFileSystemManager()
          .readFileSync(this.data.tempPath.license, "base64"),
        frontImge: wx
          .getFileSystemManager()
          .readFileSync(this.data.tempPath.face, "base64"),
        backImge: wx
          .getFileSystemManager()
          .readFileSync(this.data.tempPath.emblem, "base64"),
      }).then((res) => {
        const result = { ...this.data.tempData, imageNo: res.contentId };
        wx.navigateTo({
          url:
            "/pages/EnterpriseAccountOpen/EnterpriseAccountOpening/index?enterpriseInfo=" +
            JSON.stringify(result),
        });
      });
    } else {
      Toast("请完整上传所需证件！");
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tempData: JSON.parse(options.enterpriseInfo),
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
