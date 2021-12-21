// components/myField/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hideBorder: {
      type: Boolean,
      value: false,
    },
    label: {
      type: String,
      value: '',
    },
    value: {
      type: String,
      value: '',
    },
    useSlot: {
      type: Boolean,
      value: false,
    },
    arrow: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange: function (event) {
      this.triggerEvent('change', event.detail)
    },
    onClick: function () {
      this.triggerEvent('click')
    },
  }
})