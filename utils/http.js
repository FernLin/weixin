// const baseUrl = "http://115.150.104.9:8091/xiaxinyang/wxmini/"; //夏新阳
const baseUrl = "http://115.150.104.9:8091/chentianlong/wxmini/"; //陈天龙
// const baseUrl = "http://115.150.104.9:8091/jidenghui/wxmini/"; //吉登辉
// const baseUrl = "http://115.150.104.9:8091/dangkui/wxmini/"; //党魁
// const baseUrl = "http://115.150.104.9:8091/wangkangtao/wxmini/"; //王康桃
// const baseUrl = "https://upecwxdevtest.bankgz.com/wxmini/"; //生产地址

const app = getApp();
const http = (
  { url = "", param = {}, header = {}, type = "json", ...other } = {
    url,
    param,
    header,
    type,
  }
) => {
  wx.showLoading({
    //可以不加
    title: "请求中...",
    // mask: true,
  });
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
      complete: (res) => {
        wx.hideLoading(); //同上 ，可以不加
        if (res.statusCode >= 200 && res.statusCode < 300) {
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
        } else {
          reject(res);
          wx.showToast({
            title: "获取数据失败！",
            icon: "none",
            duration: 3000,
          });
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
const get = (url, param, type) => {
  return http({
    url,
    param,
    type,
  });
};

// 2.带参数请求并且为post
const post = (url, param, header, type) => {
  return http({
    url,
    param,
    type,
    header,
    method: "post",
  });
};

// 3.带参数请求post，header为json
const put = (url, param) => {
  return http({
    url,
    param,
    type: "json",
    method: "post",
  });
};

module.exports = {
  get,
  post,
  put,
};
