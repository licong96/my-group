// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App'
import VueLazyload from 'vue-lazyload'
import iView from 'iview'
import {
  Button,
  Select,
  Progress,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Dialog,
  Cascader,
  Option,
  OptionGroup,
  Collapse,
  CollapseItem,
  Tabs,
  TabPane,
  Tree,
  Carousel,
  CarouselItem,
  Input,
  InputNumber,
  Steps,
  Step,
  Upload,
  Loading,
  MessageBox,
  Message,
  Icon,
  Card,
  Switch,
} from 'element-ui'

// iView-ui
Vue.use(iView)

// element-ui
Vue.use(Button)
Vue.use(Select)
Vue.use(Progress)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Dialog)
Vue.use(Cascader)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tabs)
Vue.use(Tree)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Upload)
Vue.use(Loading.directive)
Vue.use(Icon)
Vue.use(Card)
Vue.use(Switch)
Vue.prototype.$loading = Loading.service
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

// mint-ui
import Loadmore from 'mint-ui/lib/loadmore'
import Spinner from 'mint-ui/lib/Spinner'
import DatetimePicker from 'mint-ui/lib/datetime-picker'
Vue.component(Spinner.name, Spinner)
Vue.component(Loadmore.name, Loadmore)
Vue.component(DatetimePicker.name, DatetimePicker)

// 这里要注意，这三个ui库的css因为体积问题不打包，单独下载压缩版放到服务器，路径和index.html是同级，css文件夹里面
// import 'element-ui/lib/theme-chalk/index.css'
// import 'iview/dist/styles/iview.css'
// import 'mint-ui/lib/style.css'

import '@/common/sass/resetui.scss'    // 黎聪添加的全局css，用来修改ui样式

Vue.use(VueLazyload, {    // 图片懒加载
  preLoad: 1.3,
  error: require('@/common/img/loader.png'),
  loading: require('@/common/img/loader.png')
})

document.getElementById('loaderFooter').innerHTML = 'main.js开始new一个vue实例'

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

/**
 * "webpack-dev-server": "^2.7.1" 要在2.7.1及以下，否则ios10以下要出问题
 */