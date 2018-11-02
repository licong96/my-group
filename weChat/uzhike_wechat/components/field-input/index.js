
Component({
  externalClasses:['padLeft'],
  properties: {
    type: {             // 输入键盘的类型
      type: String,
      value: 'text'
    },
    value: {            // 值回填
      type: String,
      value: ''
    },
    label: {            // 标题
      type: String,
      value: ''
    },
    isField: {          // 是否浮动
      type: Boolean,
      value: false
    },
    required: {       // 是否必填项
      type: Boolean,
      value: false
    }
  },
  data: {
    focus: false,
  },
  ready() {
    // 回填
    if (this.data.value) {
      this.setData({
        isField: true
      })
    }
  },
  methods: {
    // 输入框聚焦
    bindTextFieldFocus(e) {
      let { isField, focus } = this.data;

      this.setData({
        isField: false,
        focus: true
      })
    },
    // 输入框失去焦点
    bindTextFieldBlur(e) {
      let newVal = e.detail.value;
      let { value, isField, focus } = this.data;

      this.setData({
        value: newVal,
        isField: newVal ? true : false,
        focus: false
      });

      this.triggerEvent('value', {
        value: newVal
      });
    }
  },
});