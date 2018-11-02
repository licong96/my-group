import fetch from '@/utils/fetch'

// 新增房源、修改房源
export function InsertPropertyData(params) {      // 一股脑全部传进来了
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 新增房源图片，要等拿到房源id，再提交
export function InsertPropertyPhoto(PropertyID, PhotoPath) {
  const params = {
    todo: 'Property',
    type: 'InsertPropertyPhoto',
    needpurview: true,
    valiurl: document.URL,
    PropertyID: PropertyID,
    PhotoPath: PhotoPath
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 删除房源图片
export function DelPropertyPhoto(PhotoID) {
  const params = {
    todo: 'Property',
    type: 'DelPropertyPhoto',
    needpurview: true,
    valiurl: document.URL,
    PhotoID: PhotoID
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 获取类型条件
export function PropertyUsage() {
  const params = {
    todo: "Reference",
    type: "SelectByName",
    needpurview: true,
    valiurl: document.URL,
    RefName: 'PropertyUsage'
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 获取标签
export function EstateTag() {
  const params = {
    todo: "Reference",
    type: "SelectByName",
    needpurview: true,
    valiurl: document.URL,
    RefName: 'EstateTag'
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
