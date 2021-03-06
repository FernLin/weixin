import Toast from "@vant/weapp/toast/toast";
import Dialog from "@vant/weapp/dialog/dialog";
const app = getApp();
const openId = wx.getStorageSync("openid");
const unionId = wx.getStorageSync("unionId");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentAccount: {},
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
          Toast("解除用户成功！");
          this.getUserList();
        });
      })
      .catch(() => {
        console.log("暂不解绑");
      });
  },
  onAdd() {
    if (this.data.myShareList.length === 5) {
      Toast("账户通知最多允许分享5位好友！");
      return;
    }
    if (this.data.currentAccount.optionFlag === "0") {
      Toast("该账户尚未开通动账通知功能！");
      return;
    }
    if (this.data.currentAccount.shareFlag === "C") {
      Toast("该账户尚未开通动账通知分享签约！");
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
      const currentMyShareList = res.myShareList.filter(
        (el) => el.acNo === this.data.currentAccount.acNo
      );
      this.setData({
        myShareList: currentMyShareList,
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
    if (option.currentData) {
      this.setData({
        currentAccount: JSON.parse(option.currentData),
      });
    }
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
    const shareUrlId = app.util.randomString();
    const currentDate = wx.getStorageSync("currentDate");
    let defaultData = {
      signeeMobile: this.data.signeeMobile,
      signeeName: this.data.signeeName,
      shareAccount: this.data.currentAccount.acNo,
      shareDate: currentDate,
      shareOpenId: openId,
      shareName: this.data.userInfo.nickName,
      shareAvatar: encodeURIComponent(this.data.userInfo.avatarUrl),
      shareUrlId: shareUrlId,
    };
    return {
      title: "添加共享人",
      path:
        "/pages/accMan/operaNotice/index?defaultData=" +
        JSON.stringify(defaultData),
      imageUrl: "/pages/accMan/assets/share.png",
      success: function (res) {
        console.log(
          "转发成功",
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
            encodeURIComponent(this.data.userInfo.avatarUrl) +
            "&shareUrlId=" +
            shareUrlId
        );
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败", res);
      },
    };
  },
});
