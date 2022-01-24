var http = require("./http");

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
// 时间戳转换
const getFullTimes = (data) => {
  var date = new Date(data);
  var year = date.getFullYear() + "-";
  var month =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minute =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var second =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  var time = hour + ":" + minute + ":" + second;
  return year + month + day + " " + time;
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
  if (day - 6 <= 0) {
    //如果在当月7日之前
    var startMonthDay = new Date(year, parseInt(month) - 1, 0).getDate(); //1周前所在月的总天数
    if (month - 1 <= 0) {
      //如果在当年的1月份
      dateObj.start = year - 1 + "-" + 12 + "-" + jia(31 - (6 - day));
    } else {
      dateObj.start =
        year + "-" + jia(month - 1) + "-" + jia(startMonthDay - (6 - day));
    }
  } else {
    dateObj.start = year + "-" + jia(month) + "-" + jia(day - 6);
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
  let len = bankNumber.length;
  let strStart = bankNumber.substring(0, 6);
  let strCenter = bankNumber.substring(6, len - 4).replace(/[0-9]/gi, "*");
  let strEnd = bankNumber.substring(len - 4);
  let hiddenNum = strStart + strCenter + strEnd;
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

const validatePhone = (phone) => {
  //校验手机号，号段主要有(不包括上网卡)：130~139、150~153，155~159，180~189、170~171、176~178。14号段为上网卡专属号段
  const reg = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
  if (phone.length !== 11) return false;
  return reg.test(phone);
};

const randomString = (length) => {
  const len = length || 32;
  let str = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    strLen = str.length,
    res = "";
  for (let i = 0; i < len; i++) {
    res += str.charAt(Math.floor(Math.random() * strLen));
  }
  return res;
};

const isRightName = (name) => {
  var reg = /^[a-zA-Z\u4E00-\u9FA5\uF900-\uFA2D\u00B7\u2022\u0095\u0387]+$/;
  var strRe = /[\u4E00-\u9FA5]/g;
  var str = name.match(strRe);
  var strlength;
  if (str == null) {
    strlength = name.length;
  } else {
    strlength = name.length + str.length * 2; // 汉字按三个字节
  }
  if (strlength <= 3 || strlength > 48) {
    return false;
  }
  if (!name.match(reg)) {
    return false;
  } else {
    var headExp = /^[\u00B7\u2022\u0095\u0387]+/;
    var tailExp = /[\u00B7\u2022\u0095\u0387]+$/;
    var zhExp = /[\u4E00-\u9FA5\uF900-\uFA2D]+[\s]+/;
    var zhcharExp = /[\u4E00-\u9FA5\uF900-\uFA2D]+[u00B7\u2022\u0095\u0387]?[a-zA-Z]+/;
    var charzhExp = /[a-zA-Z]+[u00B7\u2022\u0095\u0387]?[\u4E00-\u9FA5\uF900-\uFA2D]+/;
    var emptyExp = /\s/g;
    if (headExp.test(name)) {
      return false;
    }
    if (tailExp.test(name)) {
      return false;
    }
    if (zhExp.test(name)) {
      return false;
    }
    if (zhcharExp.test(name)) {
      return false;
    }
    if (charzhExp.test(name)) {
      return false;
    }
    if (!!name.match(emptyExp) && name.match(emptyExp).length > 1) {
      return false;
    }
    return true;
  }
};

const isNum = (str) => {
  return /^\d+$/.test(str);
};

const judgeAgreePath = () => {
  const agreePath = [
    { name: "DEV", value: "http://115.150.104.8:8091" },
    { name: "SIT", value: "http://115.150.104.8:8091" },
    { name: "UAT", value: "http://115.150.104.7:8091" },
    { name: "EXC", value: "https://upectest.bankgz.com:8091" },
    { name: "PRD", value: "https://upec.bankgz.com" },
  ];
  return agreePath.find((res) => res.name === http.baseUrl.name);
};

module.exports = {
  times,
  gologin,
  getDay,
  userComputed,
  cnMoneyFormat,
  dates,
  hiddenBankCard,
  formatAccountNo,
  formatPhoneNo,
  validatePhone,
  getFullTimes,
  randomString,
  isRightName,
  isNum,
  judgeAgreePath,
};
