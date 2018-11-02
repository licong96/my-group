
/**
 * 下拉筛选组件
 * screenData是一个二维数组
 */

Component({
  properties: {
    screenData: {         // 筛选数据
      type: Array,
      value: []
    },
    isMore: {             // 最后一个筛选项是不是可以点击触发更多选项
      type: Boolean,
      value: false
    }
  },
  data: {
    params: {},           // 选中的筛选项
    screenOpen: '',       // 是否打开筛选，class名称
    screenIndex: -1,      // 当前打开的筛选下标
  },
  created() {
    setTimeout(() => {
      console.log('screenData', this.data.screenData)
    }, 1000)
  },
  methods: {
    // 打开筛选项切换
    bindScreenClick(e) {
      let index = Number(e.currentTarget.dataset.index);

      // 判断是否需要打开更多筛选项
      if (this.data.isMore && index === this.data.screenData.length - 1) {
        this.setData({
          screenOpen: '',
          screenIndex: -1
        });
        this.triggerEvent('more', {
          value: '打开更多筛选',
        });
        return;
      };

      if (index === this.data.screenIndex) {
        this.bindShade();
        return;
      }

      this.setData({
        screenOpen: 'show',
        screenIndex: index
      });
    },
    // 筛选radio改变事件
    bindRadioChange(e) {
      let { params, screenData, screenIndex } = this.data;
      let { type } = e.currentTarget.dataset;
      let { value } = e.detail;

      console.log(e)

      params[type] = value;

      // 当前选中的项
      screenData[screenIndex].data.forEach((item, index) => {
        if (item.value === value) {
          item.checked = true;
          item.currentIndex = index;         // 记录当前点击的元素下标，添加class选中状态
          screenData[screenIndex].current = (item.label === '不限' ? '' : item.label);     // 选中之后，把label显示在列表上
        } else {
          item.checked = false;
          item.currentIndex = -1;
        }
      });

      this.setData({
        screenOpen: 'hide',
        screenIndex: -1,
        screenData,
      });
      
      this.triggerEvent('change', {
        value: params,
      });
      this.delayScreenOpen();
    },
    // 点击遮罩关闭筛选
    bindShade() {
      this.setData({
        screenOpen: 'hide',
        screenIndex: -1
      });
      this.delayScreenOpen();
    },
    // 动画结束后，设置screenOpen为空字符串，可以解决两个页面之间显示隐藏的bug
    delayScreenOpen() {
      setTimeout(() => {
        this.setData({
          screenOpen: ''
        });
      }, 300);
    }
  },
});