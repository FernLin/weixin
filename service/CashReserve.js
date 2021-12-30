const { get, post, put } = require("../utils/util");
export default {
  /**
   * 网点信息查询
   * @param {
   * provCode: 省代码(不传查省，传值查当前省下面的市)
   * }
   */
  wxDeptProvAndCityQry(params) {
    return post("wxDeptProvAndCityQry.do", params);
  },
  /**
   * 最近预约机构查询
   * @param {
   * longitude: 经度
   * latitude: 纬度
   * }
   */
  wxLatelyBookDeptQry(params) {
    return post("wxLatelyBookDeptQry.do", params);
  },
  /**
   * 附近网点查询
   * @param {
   * distance: 距离单位，单位：米
   * longitude: 经度
   * latitude: 纬度
   * cityCode: 市代码
   * provCd: 省代码
   * deptName: 机构名称
   * tradeFlag: 1.现金预约；2.网点查询
   * }
   */
  wxQueryDeptListByDist(params) {
    return post("wxQueryDeptListByDist.do", params);
  },
  /**
   * 预约日期查询
   */
  wxLargeCashBookDateQry() {
    return post("wxLargeCashBookDateQry.do");
  },
  /**
   * 预约操作
   * @param {
   * bsTy: 业务类型
   * wddt: 取款日期
   * wdtm: 取款时间
   * amcr: 取款账户
   * wdAm: 预约金额
   * list: 零钞兑换
   * }
   */
  wxLargeCashBook(params) {
    return post("wxLargeCashBook.do", params);
  },
  /**
   * 预约记录查询
   */
  wxLargeCashBookQry() {
    return post("wxLargeCashBookQry.do");
  },
  /**
   * 取消预约操作
   * @param {
   * operationType:
   * businessType:
   * widtdrawDate:
   * cardId:
   * widtdrawTime:
   * deptId:
   * FromUserName:
   * }
   */
  wxLargeCashBookCancel(params) {
    return post("wxLargeCashBookCancel.do", params);
  },
};
