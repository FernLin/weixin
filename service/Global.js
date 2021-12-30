const { get, post, put } = require("../utils/util");
export default {
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
