import fetch from '@/utils/fetch'

// 列表数据
export function getBuilding(page, obj = {}) {
  const params = {
    todo: "Estate",
    type: "getpagedata",
    needpurview: true,
    valiurl: document.URL,
    page: page,
    likestr: obj.likestr,
    DistrictName: obj.DistrictName,
    Price: obj.Price,
    PropertyUsage: obj.PropertyUsage,
    Tag: obj.Tag
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取区域条件
export function getDistrict() {
  const params = {
    todo: "District",
    type: "SelectByCity",
    needpurview: true,
    valiurl: document.URL
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 获取类型条件
export function getProperty() {
  const params = {
    todo: "Reference",
    type: "SelectByName",
    needpurview: true,
    valiurl: document.URL,
    RefName: 'PropertyUsage'
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取标签条件
export function getTaG() {
  const params = {
    todo: "Reference",
    type: "SelectByName",
    needpurview: true,
    valiurl: document.URL,
    RefName: 'EstateTag'
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取楼盘优惠券
export function getOffer() {
  const params = {
    todo: "Reference",
    type: "SelectByName",
    needpurview: true,
    valiurl: document.URL,
    RefName: 'EstateOffer'
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取置顶、取消置顶操作
export function getUpIsTop(EstateID, opType) {
  const params = {
    todo: "Estate",
    type: "upIsTop",
    needpurview: true,
    valiurl: document.URL,
    EstateID: EstateID,
    opType: opType
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
