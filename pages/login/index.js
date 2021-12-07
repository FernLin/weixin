// pages/login/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobilePhone: "",
    password: '',
    messageindex: "",
    countDownNum: 60,
    countDownFlag: true,
    isRegister: -1,
    loading: false
  },
  bindModel(e) {
    if (e.detail.value.length == 11) {
      let data = {
        mobile: e.detail.value, //手机号
      }
      app.api.post('pweb/perPhoneCheck.do', data).then(res => {
        if (res.respCode == '00000000') {
          if (res.data.result == '1') {
            this.setData({
              isRegister: 1
            })
            return
          }else if(res.data.result == '0') {
            this.setData({
              isRegister: 0
            })
          } else {
            wx.showToast({
              title: '该手机号未注册，请注册',
              icon: 'none', //icon
              duration: 3000 //停留时间
            })
          }
        }
      })
    }else {
      this.setData({
        isRegister: -1
      })
    }
    this.setData({
      mobilePhone: e.detail.value
    })
  },
  bindPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  getVercode() {
    if(this.data.mobilePhone.length == 11) {
      this.countDownF()
      let data = {
        mobilePhone: this.data.mobilePhone,
        transactionId: "perLoginticWx"
      }
      app.api.post("pweb/perSendSmsNoLogin.do", data).then(res => {
        this.setData({
          messageindex: res.data.index
        })
      })
    }else {
      wx.showToast({
        title: '请输入正确位数的手机号！',
        icon: 'none', //icon
        duration: 3000 //停留时间
      })
    }
  },
  countDownF() {
    let _this = this
    this.setData({
      countDownFlag: false,
      countDownNum: 60
    })
    let timer = setInterval(function() {
      if(_this.data.countDownNum != 0) {
        _this.setData({
          countDownNum: _this.data.countDownNum - 1
        })
      }else {
        clearInterval(timer)
        _this.setData({
          countDownFlag: true
        })
      }
    }, 1000) 
  },
  onLoad() {
    this.binQuery()
    this.getPhoneInfo()
    this.getOpenId()
  },
  // 判断是否绑卡
  binQuery() {
    return
    let data = {
      mobilePhone: this.data.mobilePhone, //手机号
    }
    app.api.post('250:8019/api/user/account/binQuery', data).then(res => {
      if (res.respCode == '00000000') {
        if (res.bindNum == 0 || res.bindNum == undefined) { //未绑卡||未注册
          this.toRegister()
        } else {
          this.toSsmm()
        }
      }
    })
  },
  // 获取用户手机信息
  getPhoneInfo() {
    wx.getSystemInfo({
      success: res => {
        wx.setStorageSync(
          'phoneInfo', res
        )
      }
    })
  },
  // 登录、注册
  goLoginRegister() {
    this.gesture()
    this.setData({
      loading: true
    })
    if(this.data.isRegister != -1 && this.data.mobilePhone.length == 11 && this.data.password.length == 6) {
      let phone = wx.getStorageSync("phoneInfo")
      let header = { mchannelId: "PWBS" }
      let data = {
        loginIdType: "S",
        mobilePhone: this.data.mobilePhone,
        passWord: this.data.password,
        deviceId: "123456",
        loginType: "R",
        index: this.data.messageindex,
        openId: wx.getStorageSync("openid"),
        deviceType: phone.brand,
        thirdType: "weixin",
        transactionId: "perLoginticWx"
      }
      app.api.post("pweb/perLoginticWx.do", data, header).then(res => {
        if (res.respCode == '00000000') {
          wx.setStorageSync(
            'token_key', true
          )
          wx.setStorageSync(
            'userInfo', res.data
          )
          this.setData({
            loading: false
          })
          this.toFinanceSupermarket()
        } else {
          this.setData({
            loading: false
          })
          wx.showToast({
            title: res.respMessage,
            icon: 'none', //icon
            duration: 1500 //停留时间
          })
        }
      }).catch(err => {
        this.setData({
          loading: false
        })
        wx.showToast({
          title: "登录失败，请联系客服~！",
          icon: 'none', //icon
          duration: 5000 //停留时间
        })
      })
    }else {
      this.setData({
        loading: false
      })
      wx.showToast({
        title: "请输入完整的手机号及验证码~！",
        icon: 'none', //icon
        duration: 1500 //停留时间
      })
      return
    }
  },
  // 跳转首页
  toFinanceSupermarket() {
    wx.switchTab({
      url: '/pages/financeSupermarket/index',
    })
  },
  // 忘记密码
  forgetPassword() {
    wx.navigateTo({
      url: "/pages/login/forgetPassword/index"
    })
  },
  // 跳转注册
  toRegister() {
    wx.navigateTo({
      url: "/pages/login/register/index"
    })
  },
  // 跳转手势密码
  toSsmm() {
    wx.navigateTo({
      url: "/pages/ssmm/index"
    })
  },
  gesture() {
    let info = wx.getStorageSync('wxUserInfo')
    //console.log(info)
    if (info == '' || info == undefined) {
      //console.log(1)
      wx.getUserProfile({
        desc: '正在获取', //不写不弹提示框
        success: function (res) {
          wx.setStorageSync(
            'wxUserInfo', res.userInfo
          )
          //console.log(1)
        },
        fail: function (err) {
          //console.log("获取失败: ", err)
        }
      })
    }
  },
  getOpenId() {
    let info = wx.getStorageSync('openid')
    if (info == '' || info == undefined) {
      wx.login({
        success: res => {
          app.api.post("pweb/perWxGetOpenId.do", { code: res.code }).then(res => {
            // app.api.post("pweb/perWxGetOpenId.do", { code:  '7275292e25d6351ef27c0b9c2b7cdfa2'}).then(res => {
            if(res.respCode=="00000000" && res.data.openId) {
              wx.setStorageSync(
                'openid', res.data.openId
              )
            }
          })
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
      })
    }
  },
})