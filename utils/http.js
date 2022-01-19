// const baseUrl = "http://115.150.104.9:8091/xiaxinyang/wxmini/"; //夏新阳
// const baseUrl = "http://115.150.104.9:8091/chentianlong/wxmini/"; //陈天龙
// const baseUrl = "http://115.150.104.9:8091/jidenghui/wxmini/"; //吉登辉
// const baseUrl = "http://115.150.104.9:8091/dangkui/wxmini/"; //党魁
// const baseUrl = "http://115.150.104.9:8091/wangkangtao/wxmini/"; //王康桃
// const baseUrl = "http://115.150.104.9:8091/lukuiyuan/wxmini/"; //禄魁圆
// const baseUrl = "https://upecwxdevtest.bankgz.com/wxmini/"; //生产地址
const baseUrl = "http://115.150.104.8:8091/wxmini/"; //sit地址

const app = getApp();
let requestTime = 0;
const http = (
  {
    url = "",
    param = {},
    header = {},
    type = "json",
    isShowLoading = true,
    ...other
  } = {
    url,
    param,
    header,
    type,
    isShowLoading,
  }
) => {
  if (isShowLoading) {
    wx.showLoading({
      title: "请求中...",
      mask: true,
    });
  }
  requestTime++;
  return new Promise((resolve, reject) => {
    let cookieKey = wx.getStorageSync("cookieKey");
    let cookie;
    if (cookieKey != "") {
      cookie = getCookieByArray(cookieKey);
    }
    wx.request({
      url: baseUrl + url,
      data: {
        ...param,
      },
      header: {
        //两种  ，一种json 一种 from
        "content-type": "application/json",
        cookie: cookie,
        mchannelId: "PWES",
        ...header,
      },
      ...other,
      success: (res) => {
        if (res.data.respCode === "00000000") {
          resolve(res.data.data);
          var coo = res.header["Set-Cookie"];
          if (coo != undefined && coo != "") {
            let arr = res.header["Set-Cookie"].split(",");
            wx.setStorageSync("cookieKey", arr);
          }
        } else {
          reject(res.data);
          wx.showToast({
            title: res.data.respMessage,
            icon: "none",
            duration: 3000,
          });
        }
      },
      fail: (err) => {
        reject(err);
        wx.showToast({
          title: "获取数据失败！",
          icon: "none",
          duration: 3000,
        });
      },
      complete: (res) => {
        requestTime--;
        if (requestTime === 0) {
          if (isShowLoading) wx.hideLoading();
        }
      },
    });
  });
};
const getCookieByArray = (name) => {
  var m = [];
  name.forEach((se) => {
    var cookies = se.split(";");
    cookies.forEach((res) => {
      // console.log(res)
      var _d = res.split("=");
      if (_d.length == 2 && _d[1] != "") {
        m.push(res);
      }
    });
  });
  return m.join(";");
};

// 1.无需传参数请求(默认get请求,header为from)
const get = (url, param, isShowLoading, type) => {
  return http({
    url,
    param,
    type,
    isShowLoading,
  });
};

// 2.带参数请求并且为post
const post = (url, param, isShowLoading, header, type) => {
  return http({
    url,
    param,
    type,
    header,
    method: "post",
    isShowLoading,
  });
};

// 3.带参数请求post，header为json
const put = (url, param, isShowLoading) => {
  return http({
    url,
    param,
    type: "json",
    method: "post",
    isShowLoading,
  });
};

module.exports = {
  get,
  post,
  put,
};
