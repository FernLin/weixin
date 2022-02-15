const { get, post, put } = require("../utils/http");
export default {
  /**
   * 获取账户交易明细
   * @param {
   * recordNumber: 总条数（第二页开始上送）
   * pageNo: 页码
   * pageSize: 每页数量
   * sonAcNo: 子账户
   * curryType: 币种
   * payOrIncome: 收支类型（0：全部；1：收入；2：支出）
   * defaultTime: 默认时间（1：一周；2：一月；3：三月；4：自定义）
   * acNo: 账户号
   * startDate: 开始时间
   * endDate: 结束时间
   * }
   */
  wxAcctDetailQry(params) {
    return post("wxAcctDetailQry.do", params);
  },
  /**
   * 获取带下挂子账户的账号列表
   * @param {
   * openid: 用户openId
   * } params 
   */
  wxSubListQry(params) {
    return post("wxSubListQry.do", params);
  },
};
