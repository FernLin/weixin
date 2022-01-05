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
    value: {
      type: Date,
      value: new Date().getTime(),
    },
    maxDate: {
      type: Date,
      value: new Date().getTime(),
    },
    dateKey: {
      type: String,
      value: "",
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    minDate: new Date("2001-01-18").getTime(),
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange: function (event) {
      const data = { value: event.detail, dateKey: this.data.dateKey };
      this.triggerEvent("change", data);
    },
    onCancel: function (event) {
      const data = { value: event.detail, dateKey: this.data.dateKey };
      this.triggerEvent("cancel", data);
    },
    onConfirm: function (event) {
      const data = { value: event.detail, dateKey: this.data.dateKey };
      this.triggerEvent("confirm", data);
    },
    onInput: function (event) {
      const data = { value: event.detail, dateKey: this.data.dateKey };
      this.triggerEvent("input", data);
    },
  },
});
