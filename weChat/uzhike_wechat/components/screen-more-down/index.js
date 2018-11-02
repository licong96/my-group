
Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    screenData: {
      type: Array,
      value: []
    }
  },
  data: {
    params: {}
  },
  created() {
  },
  methods: {
    bindRadioChange(e) {
      console.log(e)
      let { params } = this.data;
      let { type } = e.currentTarget.dataset;
      let { value } = e.detail;

      params[type] = value;
      console.log(type)
      console.log(value)
      this.setData({
        params,
        value,
        type
      });
      console.log(params)
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
          list.checked = false
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