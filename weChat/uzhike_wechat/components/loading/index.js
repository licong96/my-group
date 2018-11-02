
Component({
  properties: {
    hidden: {
      type: Boolean,
      value: false
    },
    text: {
      type: String,
      value: '加载中...'
    },
    type: {
      type: String,
      value: ''
    }
  },
  data: {
  },
  created() {
  },
  methods: {
    show() {
      this.setData({
        hidden: true
      });
      this.triggerEvent('loading', {
        value: true
      });
    },
    hide() {
      this.setData({
        hidden: false
      });
      this.triggerEvent('loading', {
        value: false
      });
    }
  },
});