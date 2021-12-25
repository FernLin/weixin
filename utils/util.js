// const baseUrl = "http://115.150.104.9:8091/xiaxinyang/wxmini/"; //夏新阳
// const baseUrl = "http://115.150.104.9:8091/chentianlong/wxmini/"; //陈天龙
const baseUrl = "http://115.150.104.9:8091/jidenghui/wxmini/"; //吉登辉
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
  });
  let cifSeq = wx.getStorageSync("cifSeq");
  let userSeq = wx.getStorageSync("userSeq");
  let openid = wx.getStorageSync("openid");
  let publicdata = {
    openId: openid,
    requestGlobalJnlNo: "123123123123123",
    requestGlobalTrackNo: "track123123",
    requestJnlNo: "123123123123123",
    requestChannelCode: "WP",
    requestChannelId: "WP",
    requestIp: "192.168.1.100",
    terminalType: "ANDROID",
    terminalId: "DJDJDJDJ",
    authType: "MESSAGE",
    authData: "123456",
    requestDate: "2020-02-13 12:00:00",
    requestCifSeq: cifSeq,
    requestUserSeq: userSeq,
    requestDeptSeq: 10000,
    markingId: "100000",
    bankId: "10000",
  };
  return new Promise((resolve, reject) => {
    let cookieKey = wx.getStorageSync("cookieKey");
    // console.log(cookieKey)
    let cookie;
    if (cookieKey != "") {
      cookie = getCookieByArray(cookieKey);
    }
    wx.request({
      url: baseUrl + url,
      data: {
        ...param,
        // ...publicdata
      },
      header: {
        //两种  ，一种json 一种 from
        "content-type": "application/json",
        cookie: cookie,
        mchannelId: "PWBS",
        ...header,
      },
      ...other,
      complete: (res) => {
        wx.hideLoading(); //同上 ，可以不加
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.respCode == "invalid.user") {
            wx.clearStorage();
            wx.switchTab({
              url: "/pages/Microservice/index",
            });
            wx.showToast({
              title: "登录超时，请重新登录！",
              icon: "none", //icon
              duration: 5000, //停留时间
            });
            return;
          }
          resolve(res.data);
          var coo = res.header["Set-Cookie"];
          if (coo != undefined && coo != "") {
            let arr = res.header["Set-Cookie"].split(",");
            wx.setStorageSync("cookieKey", arr);
          }
        } else {
          reject(res);
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
        console.log("----" + res);
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
// 获取时间
const getDay = (day) => {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth =
    doHandleMonth(tMonth + 1) < 10
      ? "0" + doHandleMonth(tMonth + 1)
      : doHandleMonth(tMonth + 1);
  tDate =
    doHandleMonth(tDate) < 10
      ? "0" + doHandleMonth(tDate)
      : doHandleMonth(tDate);
  return tYear + "-" + tMonth + "-" + tDate;
};
const doHandleMonth = (month) => {
  var m = month;
  if (month.toString().length == 1) {
    m = month;
  }
  return m;
};
// 时间戳转换
const times = (data) => {
  var date = new Date(data);
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return Y + M + D;
};
// 当前日期
const dates = () => {
  let date = {
    w: w(),
    m: m(),
    tm: tm(),
  };
  return date;
};
const jia = (date) => {
  var date = date < 10 ? "0" + date : date;
  return date;
};
const w = () => {
  var end = new Date();
  var year = end.getFullYear();
  var month = end.getMonth() + 1; //0-11表示1-12月
  var day = end.getDate();
  var dateObj = {};
  dateObj.end = year + "-" + jia(month) + "-" + jia(day);
  if (day - 7 <= 0) {
    //如果在当月7日之前
    var startMonthDay = new Date(year, parseInt(month) - 1, 0).getDate(); //1周前所在月的总天数
    if (month - 1 <= 0) {
      //如果在当年的1月份
      dateObj.start = year - 1 + "-" + 12 + "-" + jia(31 - (7 - day));
    } else {
      dateObj.start =
        year + "-" + jia(month - 1) + "-" + jia(startMonthDay - (7 - day));
    }
  } else {
    dateObj.start = year + "-" + jia(month) + "-" + jia(day - 7);
  }
  return dateObj;
};
const m = () => {
  var end = new Date();
  var year = end.getFullYear();
  var month = end.getMonth() + 1; //0-11表示1-12月
  var day = end.getDate();
  var dateObj = {};
  dateObj.end = year + "-" + jia(month) + "-" + jia(day);
  var endMonthDay = new Date(year, month, 0).getDate(); //当前月的总天数
  if (month - 1 <= 0) {
    //如果是1月，年数往前推一年<br>
    dateObj.start = year - 1 + "-" + 12 + "-" + jia(day);
  } else {
    var startMonthDay = new Date(year, parseInt(month) - 1, 0).getDate();
    if (startMonthDay < day) {
      //1个月前所在月的总天数小于现在的天日期
      if (day < endMonthDay) {
        //当前天日期小于当前月总天数
        dateObj.start =
          year +
          "-" +
          jia(month - 1) +
          "-" +
          jia(startMonthDay - (endMonthDay - day));
      } else {
        dateObj.start = year + "-" + jia(month - 1) + "-" + jia(startMonthDay);
      }
    } else {
      dateObj.start = year + "-" + jia(month - 1) + "-" + jia(day);
    }
  }
  return dateObj;
};
const tm = () => {
  var end = new Date();
  var year = end.getFullYear();
  var month = end.getMonth() + 1; //0-11表示1-12月
  var day = end.getDate();
  var dateObj = {};
  dateObj.end = year + "-" + jia(month) + "-" + jia(day);
  var endMonthDay = new Date(year, month, 0).getDate(); //当前月的总天数
  if (month - 3 <= 0) {
    //如果是1、2、3月，年数往前推一年
    var start3MonthDay = new Date(
      year - 1,
      12 - (3 - parseInt(month)),
      0
    ).getDate(); //3个月前所在月的总天数
    if (start3MonthDay < day) {
      //3个月前所在月的总天数小于现在的天日期
      dateObj.start =
        year - 1 + "-" + jia(12 - (3 - month)) + "-" + jia(start3MonthDay);
    } else {
      dateObj.start = year - 1 + "-" + jia(12 - (3 - month)) + "-" + jia(day);
    }
  } else {
    var start3MonthDay = new Date(year, parseInt(month) - 3, 0).getDate(); //3个月前所在月的总天数
    if (start3MonthDay < day) {
      //3个月前所在月的总天数小于现在的天日期
      if (day < endMonthDay) {
        //当前天日期小于当前月总天数,2月份比较特殊的月份
        dateObj.start =
          year +
          "-" +
          jia(month - 3) +
          "-" +
          jia(start3MonthDay - (endMonthDay - day));
      } else {
        dateObj.start = year + "-" + jia(month - 3) + "-" + jia(start3MonthDay);
      }
    } else {
      dateObj.start = year + "-" + jia(month - 3) + "-" + jia(day);
    }
  }
  return dateObj;
};
// 登录状态
const gologin = () => {
  let token_key = wx.getStorageSync("token_key");
  let info = wx.getStorageSync("wxUserInfo");
  if (info == "" || info == undefined) {
    wx.getUserProfile({
      desc: "正在获取", //不写不弹提示框
      success: function (res) {
        wx.setStorageSync("wxUserInfo", res.userInfo);
        //console.log(1)
      },
      fail: function (err) {
        //console.log("获取失败: ", err)
      },
    });
  }
  if (!token_key) {
    wx.navigateTo({
      url: "/pages/login/index",
    });
    wx.showToast({
      title: "请先登录",
      icon: "none", //icon
      duration: 1500, //停留时间
    });
    return false;
  } else {
    return true;
  }
};
// 验证规则 UI显示
const panduan = (res) => {
  if (res.bankAcType == "PDBC") res.bankAcTypeName = "核心一类户";
  if (res.bankAcType == "PEBC") res.bankAcTypeName = "互金二类户";
  if (res.bankAcType == "PFBC") res.bankAcTypeName = "核心二类户";
  if (res.bankAcType == "ESAV") res.bankAcTypeName = "企业基本户";
  if (res.bankAcType == "ERMY") res.bankAcTypeName = "企业一般户";
  if (res.bankAcType == "ESPL") res.bankAcTypeName = "企业专用账户";
  if (res.bankAcType == "ETMP") res.bankAcTypeName = "企业临时户";
  if (res.bankAcType == "EWBH") res.bankAcTypeName = "企业外币活期账户";
  if (res.bankAcType == "EINS") res.bankAcTypeName = "内部户";
  if (res.bankAcType == "ETIM") res.bankAcTypeName = "单位定期账户";
  if (res.bankAcType == "ENDA") res.bankAcTypeName = "企业通知存款账户";
  if (res.bankAcType == "EAGE") res.bankAcTypeName = "企业协议存款";
  if (res.bankAcType == "ESDC") res.bankAcTypeName = "公司借记卡";
  if (res.bankAcType == "ECAV") res.bankAcTypeName = "同业活期账户";
  if (res.bankAcType == "EFAV") res.bankAcTypeName = "财付通账户";
  if (res.bankAcType == "EZBA") res.bankAcTypeName = "零余额账户";
  if (res.bankAcType == "ECDA") res.bankAcTypeName = "单位大额存单";
  if (res.bankAcType == "ESDA") res.bankAcTypeName = "单位结构性存款";
  if (res.bankAcType == "PCRC") res.bankAcTypeName = "信用卡";
  if (res.bankAcType == "PSAV") res.bankAcTypeName = "个人单币种活期账户";
  if (res.bankAcType == "PEA2") res.bankAcTypeName = "电子账户Ⅱ类";
  if (res.bankAcType == "PEA3") res.bankAcTypeName = "电子账户Ⅲ类";
  if (res.accountStatus == "NORMAL") res.accountStatusName = "正常";
  if (res.accountStatus == "CANCEL") res.accountStatusName = "注销";
  if (res.accountStatus == "LOCK") res.accountStatusName = "锁定";
  if (res.accountStatus == "LOST") res.accountStatusName = "挂失";
  if (res.accountStatus == "FREEZE") res.accountStatusName = "冻结";
  res.acNoHidden = hiddenBankCard(res.acNo);
};
const userComputed = (list) => {
  if (Array.isArray(list)) {
    list.forEach((res) => {
      panduan(res);
    });
  } else {
    panduan(list);
  }
  return list;
};

// 银行卡显示规则
const hiddenBankCard = (bankNumber) => {
  let l1 = bankNumber.length;
  let s1 = bankNumber.substring(0, 6);
  let s2 = bankNumber.substring(l1 - 4);
  let s3 = bankNumber.substring(l1 - 10).replace(/[0-9]/gi, "*");
  let hiddenNum = s1 + s3 + s2;
  hiddenNum = hiddenNum.replace(/(.{4})/g, "$1 ");
  return hiddenNum;
};

// 银行卡显示规则2
const formatAccountNo = (str) => {
  if (typeof str !== "string") {
    return "";
  }

  if (str.length < 8) {
    return str;
  }

  let reg = /^(\d{4})[\s\S]+(\w{4})$/;
  let value = str.toString().replace(reg, "$1 **** **** $2");
  return value;
};
// 手机号码脱敏
const formatPhoneNo = (phoneNo) => {
  var pat = /(\d{3})\d*(\d{4})/;
  var value = phoneNo.replace(pat, "$1****$2");
  return value;
};

// 金额大写
const cnMoneyFormat = (money) => {
  var cnMoney = "零元整";
  var strOutput = "";
  var strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
  money += "00";
  var intPos = money.indexOf(".");
  if (intPos >= 0) {
    money = money.substring(0, intPos) + money.substr(intPos + 1, 2);
  }
  strUnit = strUnit.substr(strUnit.length - money.length);
  for (var i = 0; i < money.length; i++) {
    strOutput +=
      "零壹贰叁肆伍陆柒捌玖".substr(money.substr(i, 1), 1) +
      strUnit.substr(i, 1);
  }
  cnMoney = strOutput
    .replace(/零角零分$/, "整")
    .replace(/零[仟佰拾]/g, "零")
    .replace(/零{2,}/g, "零")
    .replace(/零([亿|万])/g, "$1")
    .replace(/零+元/, "元")
    .replace(/亿零{0,3}万/, "亿")
    .replace(/^元/, "零元");
  return cnMoney;
};
module.exports = {
  get,
  post,
  put,
  times,
  gologin,
  getDay,
  userComputed,
  cnMoneyFormat,
  dates,
  hiddenBankCard,
  formatAccountNo,
  formatPhoneNo,
};
