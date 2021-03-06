const { get, post, put } = require("../utils/http");
export default {
  /**
   * 获取用户是否注册
   * @param {
   * openid: 用户openid
   * unionId: 用户unionId
   * }
   */
  wxGetUserInfo(params, isShowLoading = true) {
    return post("wxGetUserInfo.do", params, isShowLoading);
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
  wxAcListQry(params, isShowLoading = true) {
    return post("wxAcListQry.do", params, isShowLoading);
  },
  /**
   * 获取带下挂子账户的账号列表
   * @param {
    * openid: 用户openId
    * }
    */
   wxSubListQry(params) {
     return post("wxSubListQry.do", params);
   },
  /**
   * 添加银行卡
   * @param {
   * openId: 用户openId
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
   * 获取认证方式
   * @param {
   * transactionId: 接口名称id
   * }
   */
  wxCommonConfirm(params) {
    return post("wxCommonConfirm.do", params);
  },
  /**
   * 获取短信验证码
   * @param {
   * transactionId: 接口名称id
   * mobilePhone: 手机号码
   * templateId: 短信模版Id
   * }
   */
  wxSendSms(params) {
    return post("wxSendSms.do", params);
  },
  /**
   * 验证短信验证码
   * @param {
   * index: 获取短信验证码接口发送的索引值
   * code: 短信验证码
   * transactionId: 接口名称id
   * mobilePhone: 输入的手机号
   * }
   */
  wxAuthSmsNoLogin(params) {
    return post("wxAuthSmsNoLogin.do", params);
  },
  /**
   * 解绑用户
   * @param {
   * openid: 用户openid
   * unionId: 用户unionId
   * }
   */
  wxRelBindUser(params) {
    return post("wxRelBindUser.do", params);
  },
  /**
   * 验证用户信息
   * @param {
   * openid: 用户openid
   * unionId: 用户unionId
   * idType: "110001",
   * cifName: 用户姓名,
   * idNo: 用户身份证号,
   * mobilePhone: 用户手机号,
   * acNo: 用户卡号,
   * thirdType: "gzwxapplet",
   * }
   */
  wxBindRelationship(params) {
    return post("wxBindRelationship.do", params);
  },
  /**
   * 银行卡ocr
   * @param {
   * bankCardImage: 银行卡正面
   * }
   */
  wxBankCardOcr(params) {
    return post("wxBankCardOcr.do", params);
  },
  /**
   * 身份证ocr
   * @param {
   * frontImge: 身份证正面
   * backImge: 身份证背面
   * }
   */
  wxIdCardOcr(params) {
    return post("wxIdCardOcr.do", params);
  },
  /**
   * 获取协议路径
   * @param {
   * protocolType: 协议id
   * }
   */
  wxProtocolExhibition(params) {
    return post("wxProtocolExhibition.do", params);
  },
  /**
   * 发送通知
   * @param {
   * unionId: 用户unionId
   * }
   */
  wxMsgTradingToRemindWx(params) {
    return post("wxMsgTradingToRemindWx.do", params, false);
  },
};
