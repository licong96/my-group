import fetch from '@/utils/fetch'

// 获取个人接待相关信息
export function GetReceptionInfoByID(ReceptionID) {
  const params = {
    todo: 'Filing',
    type: 'GetReceptionInfoByID',
    needpurview: true,
    valiurl: document.URL,
    ReceptionID: ReceptionID
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 获取今日个人其他已接待客户信息
export function GetTodayOrderReception(DeclareID) {
  const params = {
    todo: 'Filing',
    type: 'GetTodayOrderReception',
    needpurview: true,
    valiurl: document.URL,
    DeclareID: DeclareID
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}