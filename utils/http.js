// const baseUrl = "https://upecwxdevtest.bankgz.com/wxmini/"; //生产地址
// const baseUrl = {
//   name: "DEV",
//   // value: "http://115.150.104.9:8091/chentianlong/wxmini/", // 陈天龙
//   // value: "http://115.150.104.9:8091/lukuiyuan/wxmini/", // 禄魁圆
//   value: "http://115.150.104.9:8091/xiaolele/wxmini/", // 白泰旭
// }; //dev地址

// name: 服务器名称（DEV、SIT、UAT、EXC、PRD）
const baseUrl = {
  name: "SIT",
  value: "http://115.150.104.8:8091/wxmini/",
}; //sit地址

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
  // TODO: 将后面的值转为PRD地址
  const currentUrl = baseUrl.value || "http://115.150.104.8:8091/wxmini/";
  if (isShowLoading) {
    wx.showLoading({
      title: "请求中...",
      mask: true,
    });
  }
  return new Promise((resolve, reject) => {
    let cookieKey = wx.getStorageSync("cookieKey");
    let cookie;
    if (cookieKey != "") {
      cookie = getCookieByArray(cookieKey);
    }
    wx.request({
      url: currentUrl + url,
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
        console.log("----------分隔线-----------------");
        console.log("-------------分割线--------------");
        if (isShowLoading) wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log("**********接口地址：：", currentUrl + url);
          console.log("**********接口请求参数：：", param);
          console.log("###########接口返回结果：：", res);
          if (res.data.respCode === "00000000") {
            console.log("###########接口调用成功！！！");
            resolve(res.data.data);
            var coo = res.header["Set-Cookie"];
            if (coo != undefined && coo != "") {
              let arr = res.header["Set-Cookie"].split(",");
              wx.setStorageSync("cookieKey", arr);
            }
          } else {
            console.log("###########接口调用失败！！！");
            reject(res.data);
            let errorMsg = res.data.respMessage;
            if (res.data.respCode === "30101960") {
              errorMsg = "用户信息输入有误！";
            }
            if (res.data.respCode === "30101958") {
              wx.showToast({
                title: "长按关注赣州银行公众号",
                icon: "none",
                duration: 3000,
              });
              setTimeout(() => {
                wx.previewImage({
                  urls: [
                    "http://115.150.104.8:8091/download/image/gzBankwyh.jpg",
                  ], // 需要预览的图片http链接列表
                });
              }, 2000);
              return;
            }
            wx.showToast({
              title: errorMsg,
              icon: "none",
              duration: 3000,
            });
          }
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
  baseUrl,
};
