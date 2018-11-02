import * as types from './mutations-type'

export const acscreen = function ({
  commit
}, data) {
  commit(types.SET_SCREEN_DATA, data)
}

export const setEchartScreen = function ({
  commit
}, data) {
  commit(types.SET_ECHART_SCREEN, data)
}

export const setEchartCurrent = function ({
  commit
}, data) {
  commit(types.SET_ECHART_SCREEN_CLEAR)   // 添加之前先清除 echartScreen
  commit(types.SET_ECHART_SCREEN_CHURRENT, data)
}

export const setIsShowScreen = function ({
  commit
}, data) {
  commit(types.SET_IS_SHOW_SCREEN, data)
}

export const setLoaderCenter = function ({
  commit
}, data) {
  commit(types.SET_LOADER_CENTER, data)
}

export const setMailReply = function ({
  commit
}, data) {
  commit(types.SET_MAIL_REPLY, data)
}

export const setMailLikestr = function ({
  commit
}, data) {
  commit(types.SET_MAIL_LIKESTR, data)
}

export const setContractOneData = function ({
  commit
}, data) {
  commit(types.SET_CONTRACT_ONE_DATA, data)
}
