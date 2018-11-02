
/**
 * 底部弹起的滚动selector选择器
 */

Component({
  properties: {
    label: {          // 选项标题
      type: String,
      value: '标题'
    },
    type: {           // 选项类型
      type: String,
      value: ''
    },
    range: {         // 选项数据
      type: Array,
      value: []
    },
    rangeIndex: {     // 表示选择了 range 中的第几个
      type: Number,
      value: 0
    },
    height: {         // 高度
      type: Number,
      value: 130
    },
    required: {       // 是否必填项
      type: Boolean,
      value: false
    }
  },
  data: {
  },
  created() {
  },
  methods: {
    // 监听picker改变
    bindPickerChange(e) {
      let index = Number(e.detail.value);

      this.setData({
        rangeIndex: index
      });

      // 发送数据
      this.triggerEvent('pickerChange', {
        value: this.data.range[index],
        index: this.data.rangeIndex,
        type: this.data.type
      });
    }
  },
});