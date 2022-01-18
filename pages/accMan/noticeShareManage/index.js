// pages/accMan/accDetail/index.js
import Toast from "@vant/weapp/toast/toast";
import Dialog from "@vant/weapp/dialog/dialog";
const app = getApp();
const openId = wx.getStorageSync("openid");
const unionId = wx.getStorageSync("unionId");
const currentDate = wx.getStorageSync("currentDate");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentAccount: wx.getStorageSync("currentAccount"),
    type: "",
    showDialog: false,
    signeeName: "",
    signeeMobile: "",
    disabled: true,
    userInfo: {},
    hasUserInfo: false,
    myShareList: [],
    shareMyList: [],
  },
  onUnbind(e) {
    Dialog.confirm({
      title: "提示",
      message: "是否确认解除当前签约用户？",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    })
      .then(() => {
        app.service.AccountMan.wxNoticeClassShareRelieve({
          openId,
          acNo: e.currentTarget.dataset.item.acNo,
          shareOpenId: e.currentTarget.dataset.item.openid,
          unBindFlag: this.data.type === "mine" ? "0" : "1",
        }).then((res) => {
          // TODO: 操作成功之后的跳转
          console.log(res);
        });
      })
      .catch(() => {
        console.log("暂不解绑");
      });
  },
  onAdd() {
    if (this.data.currentAccount.optionFlag === "0") {
      Toast("该账户尚未开通动账通知功能！");
      return;
    }
    if (this.data.currentAccount.shareFlag === "C") {
      Toast("该账户尚未开通签约功能！");
      return;
    }
    if (!this.data.hasUserInfo) {
      wx.getUserProfile({
        desc: "用于被共享人识别用户", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          wx.setStorageSync("userInfo", res.userInfo);
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            showDialog: true,
            disabled: true,
            signeeMobile: "",
            signeeName: "",
          });
        },
      });
    } else {
      this.setData({
        showDialog: true,
        disabled: true,
        signeeMobile: "",
        signeeName: "",
      });
    }
  },
  onClose() {
    this.setData({
      showDialog: false,
    });
  },
  bindShareName(event) {
    if (event.detail.value) {
      this.setData({
        signeeName: event.detail.value,
      });
      if (app.util.validatePhone(this.data.signeeMobile)) {
        this.setData({
          disabled: false,
        });
      }
    } else {
      this.setData({
        disabled: true,
      });
    }
  },
  bindPhoneNum(event) {
    if (app.util.validatePhone(event.detail.value)) {
      this.setData({
        signeeMobile: event.detail.value,
      });
      if (this.data.signeeName) {
        this.setData({
          disabled: false,
        });
      }
    } else {
      this.setData({
        disabled: true,
      });
    }
  },

  getUserList() {
    app.service.AccountMan.wxNoticeClassShareQry({
      openId,
      unionId,
    }).then((res) => {
      // TODO: 数据为空时的显示
      this.setData({
        myShareList: res.myShareList,
        shareMyList: res.shareMyList,
      });
    });
  },

  onShow: function () {
    const userInfo = wx.getStorageSync("userInfo");
    if (userInfo.nickName) {
      this.setData({
        userInfo,
        hasUserInfo: true,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      type: option.type,
    });
    wx.setNavigationBarTitle({
      title: `${option.type === "mine" ? "我的" : "接收"}共享管理`,
    });
    this.getUserList();
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
    this.setData({
      showDialog: false,
    });
    return {
      title: "添加共享人",
      path:
        "/pages/accMan/operaNotice/index?signeeMobile=" +
        this.data.signeeMobile +
        "&signeeName=" +
        this.data.signeeName +
        "&shareAccount=" +
        this.data.currentAccount.acNo +
        "&shareDate=" +
        currentDate +
        "&shareOpenId=" +
        openId +
        "&shareName=" +
        this.data.userInfo.nickName +
        "&shareAvatar=" +
        encodeURIComponent(this.data.userInfo.avatarUrl),
      imageUrl: "/pages/accMan/assets/share.png",
      success: function (res) {
        console.log("转发成功", res);
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败", res);
      },
    };
  },
});
