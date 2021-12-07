// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    accManInfo: {
        headPng: "../../assets/mainPage/head.png",
        name: "陈彬彬",
        department: "综合管理部",
        position: "理财经理",
        Outlets: "赣州银行XX支行",
        phone: "0797-3738237",
        address: "赣州市章贡区赣江源大道27号",
        introduce: "客户经理简介客户经理简介客户经理简介客户经理简介客户经理简介客户经理简介客户经理简介客户经理简介客户经理简介客户经理简介客户经理简介客户经理简介客户经。"
    }
  },
  onLoad(options) {
    let pramas = JSON.parse(decodeURIComponent(options.prama))
    this.getMagenerInfo(pramas.managerId)

  },
  getMagenerInfo(id) {
    let data = {managerId: id}
    app.api.post("pweb/perWxManagerInfoQry.do", data).then(res => {
      if (res.respCode == "00000000") {
        this.setData({
          accManInfo: res.data
        })
      }
    })					
  },
  // 联系客户经理
  callManager() {
    // wx.showActionSheet({
    //   itemList: ['18701786373'],
    //   success: function (res) {
        wx.makePhoneCall({
          phoneNumber: this.data.accManInfo.managerMobilePhone, //此号码并非真实电话号码，仅用于测试  
        })
        // if (!res.cancel) {
        //   console.log(res.tapIndex)//console出了下标
        // }
    //   }
    // });
  },

})