// pages/accountManage/electronicOpenAccount/index.js
const app = getApp()
Page({
  data: {
    image_path: ['/assets/hjmm1.jpg', '/assets/hjmm2.jpg'],
    checked: true,
    userName: '杜大虫', //用户名称 杜大虫
    idType: 'P01', //证件类型 P01-身份证
    idNo: "460004198803083650", //460004198803083650
    idNoValidDate: '2023-07-19', //证件有效期
    effDate:'2023-07-19',
    expDate:'2023-08-19',
    mobilePhone: '', //手机号
    profession: '', //职业
    birthday: '', //出生日期
    workUnit:'',
    nation: '汉', //名族
    idNoFailureDate: '2023-07-19', //证件到期日
    address: '', //联系地址
    trade: '', // 行业

    education: '', //最高学历
    //性别
    gender: '男',
    // 行业
    trade: '',
    trades: ['农林渔牧',
      '采矿业',
      '制造业',
      '水电气供应',
      '建筑业',
      '批发零售',
      '交通运输',
      '酒店餐饮',
      '计算机',
      '金融业',
      '房地产',
      '科学研究',
      '环境和公共设施',
      '居民服务',
      '教育',
      '卫生医疗',
      '文体娱乐',
      '社会保障和福利， 机关团队',
      '国际组织',
      '其他行业， 商业贸易',
    ],
    //职业
    profession: '',
    professions: [
      ' 国家机关， 党群组织， 企事业单位负责人',
      '专业技术人员',
      '办事人员和有关人员',
      '商业， 服务业人员',
      '农林， 牧， 渔。 水利业生产人员',
      '生产， 运输设备操作人员',
      'IT从业人员',
      '金融业',
      '制造业从业人员',
      '个人私营类职业员',
      '学生',
      '退休',
      '军人',
      '不便分类的其他从业人员',
      '其他',
    ],
    //学历
    education: '',
    educations: [
      '研究生',
      '大学本科',
      '大学专科和专科学校',
      '中等专业学校和中等技术学校',
      '技术学校',
      '高中',
      '初中',
      '小学',
      '未知',
    ],
  },
  // orc身份证
  idCard(e) {
    if (e.detail.type == 0) {
      let id = e.detail
      this.setData({
        userName: id.name.text,
        genderName: id.gender.text,
        gender: id.gender.text == '男' ? '0' : '1',
        address: id.address.text,
        idNo: id.id.text,
        nation: id.nationality.text,
        'image_path[0]': id.image_path
      })
    }
    if (e.detail.type == 1) {
      let date = e.detail.valid_date.text
      console.log(date)
      let dates = []
      dates = date.split('-');
      let idNoValidDate = dates[0].substring(0, 4) + '-' + dates[0].substring(4, 6) + '-' + dates[0].substring(6, 9)
      let idNoFailureDate = dates[1].substring(0, 4) + '-' + dates[1].substring(4, 6) + '-' + dates[1].substring(6, 9)
      this.setData({
        idNoValidDate,
        idNoFailureDate,
        'image_path[1]': e.detail.image_path
      })
    }
  },
  onLoad() {
    this.setData({
      // genderName: this.data.genders[0],
    })

  },
  // 行业
  tradePicker: function (e) {
    this.setData({
      trade: this.data.trades[e.detail.value],
    })
  },
  // 职业
  professionPicker: function (e) {
    this.setData({
      profession: this.data.professions[e.detail.value],
    })
  },
  // 最高学历
  educationPicker: function (e) {
    this.setData({
      education: this.data.educations[e.detail.value],
    })
  },
  // 跳转
  confirm: function () {
    wx.navigateTo({
      url: "/pages/Sign/Verified/bankCardSupport/index"
    })
  },

  // 阅读
  onChangeChecked(event) {
    this.setData({
      checked: event.detail,
    });
  },
})