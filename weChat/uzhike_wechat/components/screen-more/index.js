
/**
 * 侧边栏更多筛选组件
 */

Component({
  properties: {
    isShow: {             //  是否显示
      type: Boolean,
      value: false
    },
    screenData: {         // 数据源，一个二维数组
      type: Array,
      value: []
    }
  },
  data: {
    option: {}
  },
  created() {
  },
  methods: {
    bindRadioChange(e) {
      let { option, screenData } = this.data;
      let { type, index } = e.currentTarget.dataset;
      let { value } = e.detail;

      option[type] = value;

      // 当前选中的项
      screenData[index].data.forEach((item, idx) => {
        if (item.value === value) {
          item.checked = true;
          item.currentIndex = idx;         // 记录当前点击的元素下标，添加class选中状态
        } else {
          item.checked = false;
          item.currentIndex = -1;
        }
      });

      this.setData({
        screenData,
      });

      this.triggerEvent('change', {
        option,
      });
    },
    // 重置
    bindReset() {
      let { screenData } = this.data;

      this.setData({
        option: {}
      });
      this.triggerEvent('reset', {
        option: {}
      });
      this.hide();

      // 去掉选中状态
      screenData.forEach(item => {
        item.data.forEach(list => {
          list.checked = false;
          list.currentIndex = -1;
        });
      });
      this.setData({
        screenData
      });
    },
    // 确定
    bindConfirm() {
      this.triggerEvent('confirm', {
        option: this.data.option
      });
      this.hide();
    },
    // 显示
    show() {
      this.setData({
        isShow: true
      })
    },
    // 隐藏
    hide() {
      this.setData({
        isShow: false
      })
    }
  },
});