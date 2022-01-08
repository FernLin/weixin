const { get, post, put } = require("../utils/http");
export default {
  /**
   * 网点信息查询
   * @param {
   * deptType: 银行类型【2：网点；3：ATM】
   * bankName: 银行名称
   * }
   */
  wxOutletsDeptQry(params) {
    return post("wxOutletsDeptQry.do", params);
  },
  /**
   * 机构省市区查询
   * @param {
    * provCode: 省编码
    * cityCode: 市编码
    * }
    */
   wxdeptCityQry(params) {
     return post("wxdeptCityQry.do", params);
   },
   /**
   * 证件上传
   * @param {
    * license: 营业执照
    * frontImage: 身份证面部
    * backImage: 身份证国徽
    * }
    */
   wxAuthIdentity(params) {
     return post("wxAuthIdentity.do", params);
   },
    /**
   * 企业预开户申请
   * @param {
    * bankCode: 银行编号
    * openCity: 开户城市
    * openBranch: 开户网点
    * openDate: 预约开户日期
    * licenseNum: 营业执照号码
    * applyTrans: 申请渠道
    * linkName: 联系人姓名
    * linkTel: 联系人电话
    * companyName: 企业名称
    * bankAcctFlag: 账户类型
    * prov: 省
    * city: 市
    * dist: 区
    * address: 企业地址
    * legalName: 法人姓名
    * legalTel: 法人电话
    * financeName: 财务负责人姓名
    * financeTel: 财务负责人电话
    * imageNo: 影像编号
    * }
    */
   wxApplyOpenAct(params) {
     return post("pweb/wxApplyOpenAct.do", params);
   },
  /**
   * 企业预开户申请进度查询
   * @param {
   * applyNo: 申请码
   * startDate: 开始时间
   * endDate: 结束时间
   * stateCode: 状态码
   * flag: 标志
   * }
   */
  wxApplyOpenActQry(params) {
    return post("pweb/perWxLoanPrdQry.do", params);
  },
};
