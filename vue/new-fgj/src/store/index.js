import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'     // 调试

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'   // 调试

document.getElementById('loaderFooter').innerHTML = 'Store开始执行'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  plugins: debug ? [createLogger()] : []
})
