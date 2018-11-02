import * as types from './mutations-type'

const matutaions = {
  [types.SET_SCREEN_DATA](state, screenData) {
    state.screenData = screenData
  },
  [types.SET_B_MAP](state, BMap) {
    state.BMap = BMap
  },
  [types.SET_ESTATE_EDIT](state, estateEdit) {
    state.estateEdit = estateEdit
  },
  [types.SET_ECHART_SCREEN_CLEAR](state) {
    state.echartScreen = {}
  },
  [types.SET_ECHART_SCREEN](state, echartScreen) {
    state.echartScreen = echartScreen
  },
  [types.SET_ECHART_SCREEN_CHURRENT](state, echartScreenChurrent) {
    state.echartScreenChurrent = echartScreenChurrent
  },
  [types.SET_IS_SHOW_SCREEN](state, IsShowScreen) {
    state.IsShowScreen = IsShowScreen
  },
  [types.SET_LOADER_CENTER](state, loaderCenter) {
    state.loaderCenter = loaderCenter
  },
  [types.SET_MAIL_REPLY](state, mailReply) {
    state.mailReply = mailReply
  },
  [types.SET_MAIL_LIKESTR](state, mailLikestr) {
    state.mailLikestr = mailLikestr
  },
  [types.SET_CONTRACT_ONE_DATA](state, contractOneData) {
    state.contractOneData = contractOneData
  },
}

export default matutaions
