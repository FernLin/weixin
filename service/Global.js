const { get, post, put } = require("../utils/http");
export default {
  /**
   * 获取用户是否注册
   * @param {
   * openid: 用户openid
   * }
   */
  wxGetUserInfo(params) {
    return post("wxGetUserInfo.do", params);
  },
  /**
   * 用户注册
   * @param {
   * mobilePhone: 手机号码
   * openid: 用户openid
   * unionId: 用户unionId
   * }
   */
  wxCifSign(params) {
    return post("wxCifSign.do", params);
  },
  /**
   * 用户账户信息列表查询
   * @param {
   * openid: 用户openid
   * }
   */
  wxAcListQry(params) {
    return post("wxAcListQry.do", params);
  },
  /**
   * 添加银行卡
   * @param {
   * openid: 用户openid
   * mobilePhone: 手机号
   * cifName: 用户名
   * idType: 证件类型
   * idNo: 证件号码
   * acNo: 银行卡账号
   * }
   */
  wxAddAccount(params) {
    return post("wxAddAccount.do", params);
  },
  /**
   * 解绑银行卡（删除账户）
   * @param {
   * openid: 用户openid
   * acNo: 银行卡号
   * }
   */
  wxDeleteAccount(params) {
    return post("wxDeleteAccount.do", params);
  },
  /**
   * 获取用户openid
   * @param {
   * code: 微信小程序提供的code
   * }
   */
  wxGetOpenIdByCode(params) {
    return post("wxGetOpenIdByCode.do", params);
  },
  /**
   * 获取短信验证码
   * @param {
   * templateId: 微信小程序提供的code
   * transactionId: 微信小程序提供的code
   * mobilePhone: 微信小程序提供的code
   * }
   */
  wxSendSms(params) {
    return post("wxSendSms.do", params);
  },
};
