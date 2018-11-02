import fetch from '@/utils/fetch'

// 获取楼盘图片数据
export function getEstatePhoto(id) {
  const params = {
    todo: "EstatePhoto",
    type: "SelectByEstate",
    needpurview: true,
    valiurl: document.URL,
    EstateID: id
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取楼盘信息数据
export function getestatebyid(id) {
  const params = {
    todo: "Estate",
    type: "getestatebyid",
    needpurview: true,
    valiurl: document.URL,
    EstateID: id
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取楼盘户型数据
export function getByEstate(id) {
  const params = {
    todo: "EstateRoom",
    type: "SelectByEstate",
    needpurview: true,
    valiurl: document.URL,
    EstateID: id
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
