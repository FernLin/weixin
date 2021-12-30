// components/myPicker/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: "请选择",
    },
    columns: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onChange: function (event) {
      this.triggerEvent("change", event.detail);
    },
    onCancel: function (event) {
      this.triggerEvent("cancel", event.detail);
    },
    onConfirm: function (event) {
      this.triggerEvent("confirm", event.detail);
    },
  },
});
