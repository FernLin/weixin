// pages/Sign/index.js
Page({
  data: {

  },
  goVerified(){
    wx.navigateTo({
      url: './Verified/index',
    })
  },
  goBankCardInfo(){
    wx.navigateTo({
      url: './bankCardInfo/index',
    })
  },

})