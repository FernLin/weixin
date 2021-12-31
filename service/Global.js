const { get, post, put } = require("../utils/util");
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
   * 用户账户信息列表查询
   * @param {
   * openid: 用户openid
   * }
   */
  wxAcListQry(params) {
    return post("wxAcListQry.do", params);
  },
};
