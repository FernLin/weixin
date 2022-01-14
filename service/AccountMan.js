const { get, post, put } = require("../utils/http");
export default {
  /**
   * 微信动账通知分享签约
   * @param {
   * openId: 用户微信openid
   * unionId: 用户微信unionId
   * acNo: 待签约账号
   * }
   */
  wxDycAcNoticeSign(params) {
    return post("wxDycAcNoticeSign.do", params);
  },
  /**
   * 微信动账通知分享解约
   * @param {
   * openId: 用户微信openid
   * unionId: 用户微信unionId
   * acNo: 待解约账号
   * }
   */
  wxDycAcNoticeRelSign(params) {
    return post("wxDycAcNoticeRelSign.do", params);
  },
  /**
   * 微信动账通知分享签收
   * @param {
   * openId: 签收人微信openid
   * unionId: 签收人微信unionId
   * acNo: 分享账号
   * shareOpenId: 分享人微信openid
   * shareDate: 签收日期
   * nickname: 签收人姓名
   * headimgurl: 签收人微信头像
   * shareHeadimgurl: 分享人微信头像
   * }
   */
  wxNoticeClassShareSignIn(params) {
    return post("wxNoticeClassShareSignIn.do", params);
  },
  /**
   * 微信动账通知分享解除
   * @param {
   * openId: 用户微信openid
   * acNo: 已签约账号
   * shareOpenId: 待签收用户微信openid
   * unBindFlag: 接触状态
   * }
   */
  wxNoticeClassShareRelieve(params) {
    return post("wxNoticeClassShareRelieve.do", params);
  },
  /**
   * 微信动账通知接收人列表查询
   * @param {
   * openId: 用户微信openid
   * unionId: 用户微信unionId
   * }
   */
  wxNoticeClassShareQry(params) {
    return post("wxNoticeClassShareQry.do", params);
  },
};
