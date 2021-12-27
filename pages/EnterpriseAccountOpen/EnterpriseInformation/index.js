// pages/User/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isSame: false,
    canNext: false,
    errorMsg: {
      licenseNum: "", // 营业执照号码
      companyName: "", // 企业名称
      address: "", // 企业地址
      legalName: "", // 法人姓名
      legalTel: "", // 法人电话
      financeName: "", // 财务负责人姓名
      financeTel: "", // 财务负责人电话
    },
    accountInfo: {
      companyName: "", // 企业名称
      licenseNum: "", // 营业执照号码
      bankAcctFlag: "2", // 账户类型
      address: "", // 企业地址
      legalName: "", // 法人姓名
      legalTel: "", // 法人电话
      financeName: "", // 财务负责人姓名
      financeTel: "", // 财务负责人电话
    },
  },
  paramChange(event) {
    this.setData({
      [`accountInfo.${event.currentTarget.dataset.name}`]: event.detail,
    });
    if (this.data.isSame) {
      if (event.currentTarget.dataset.name === "legalName") {
        this.setData({
          "accountInfo.financeName": event.detail,
        });
      }
      if (event.currentTarget.dataset.name === "legalTel") {
        this.setData({
          "accountInfo.financeTel": event.detail,
        });
      }
    }
  },
  checkboxChange(event) {
    this.setData({
      isSame: event.detail,
    });
    if (event.detail) {
      this.setData({
        "accountInfo.financeName": this.data.accountInfo.legalName,
        "accountInfo.financeTel": this.data.accountInfo.legalTel,
      });
    }
  },
  toNext() {
    this.setData({
      errorMsg: {
        licenseNum: "",
        companyName: "",
        address: "",
        legalName: "",
        legalTel: "",
        financeName: "",
        financeTel: "",
      },
      canNext: true,
    });
    const reg_lic = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/;
    const reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

    for (let key in this.data.accountInfo) {
      if (!this.data.accountInfo[key]) {
        this.setData({
          [`errorMsg.${key}`]: "内容不能为空",
          canNext: false,
        });
      } else {
        // 有值，正则判断值格式
        if ("licenseNum" === key && !reg_lic.test(this.data.accountInfo[key])) {
          this.setData({
            [`errorMsg.${key}`]: "营业执照号码格式错误",
            canNext: false,
          });
        }
        if (
          ["legalTel", "financeTel"].includes(key) &&
          !reg_tel.test(this.data.accountInfo[key])
        ) {
          this.setData({
            [`errorMsg.${key}`]: "手机号码格式错误",
            canNext: false,
          });
        }
      }
    }
    if (this.data.canNext) {
      wx.navigateTo({
        url:
          "/pages/EnterpriseAccountOpen/DocumentUpload/index?enterpriseInfo=" +
          JSON.stringify(this.data.accountInfo),
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},
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
