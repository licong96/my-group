import fetch from '@/utils/fetch'

// 根据楼盘id获取楼栋ID和编号
export function GetBuildingByEstateID(EstateID) {
  const params = {
    todo: 'SalesControl',
    type: 'GetBuildingByEstateID',
    needpurview: true,
    valiurl: document.URL,
    EstateID: EstateID
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 根据楼盘id和楼栋编号获取房号信息
export function GetSalesDate(EstateID, BuildingName, FlagLocked) {
  const params = {
    todo: 'SalesControl',
    type: 'GetSalesDate',
    needpurview: true,
    valiurl: document.URL,
    EstateID: EstateID,
    BuildingName: BuildingName,
    FlagLocked: FlagLocked
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 添加楼栋反悔栋座ID
export function InsertBudlding(EstateID, BuildingName) {
  const params = {
    todo: 'SalesControl',
    type: 'InsertBudlding',
    needpurview: true,
    valiurl: document.URL,
    EstateID: EstateID,
    BuildingName: BuildingName
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 添加销控房号
export function InsertRoom(obj = {}) {
  const params = {
    todo: 'SalesControl',
    type: 'InsertRoom',
    needpurview: true,
    valiurl: document.URL,
    EstateID: obj.EstateID,
    BuildingID: obj.BuildingID,
    RoomNo: obj.RoomNo,
    Square: obj.Square,
    PriceUnit: obj.PriceUnit,
    Price: obj.Price,
    PropertyType: obj.PropertyType,
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

/**修改房源数据
 * @export UpRoom
 * @param {Object} obj
 */
export function UpRoom(obj) {
  const params = Object.assign({}, {
    todo: 'SalesControl',
    type: 'UpRoom',
    needpurview: true,
    valiurl: document.URL,
  }, obj);
  
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

