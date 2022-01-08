const { get, post, put } = require("../utils/http");
export default {
  /**
   * 获取账户交易明细
   * @param {
   * acNo: 账户号
   * startDate: 开始时间
   * endDate: 结束时间
   * }
   */
  wxAcctDetailQry(params) {
    return post("wxAcctDetailQry.do", params);
  },
};
