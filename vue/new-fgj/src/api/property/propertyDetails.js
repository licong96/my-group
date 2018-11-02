import fetch from '@/utils/fetch'

// 根据ID获取数据
export function GetPropertyByID(PropertyID) {
  const params = {
    todo: 'Property',
    type: 'GetPropertyByID',
    needpurview: true,
    valiurl: document.URL,
    PropertyID
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 根据ID获取图片
export function GetPhotoByPropertyID(PropertyID) {
  const params = {
    todo: 'Property',
    type: 'GetPhotoByPropertyID',
    needpurview: true,
    valiurl: document.URL,
    PropertyID
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}