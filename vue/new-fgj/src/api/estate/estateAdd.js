import fetch from '@/utils/fetch'
import qs from "qs"
import axios from 'axios'

// 新增和编辑
export function AddEstate(obj, type) {
  // const params = {
  //   todo: 'Estate',
  //   type: type,       // 决定是新增还是编辑
  //   needpurview: true,
  //   valiurl: document.URL,
  //   EstateName: obj.EstateName,
  //   DistrictName: obj.DistrictName,
  //   Address: obj.Address,
  //   PropertyUsage: obj.PropertyUsage,
  //   DevCompany: obj.DevCompany,
  //   EstateIntro: obj.EstateIntro,
  //   FloorAll: obj.FloorAll,
  //   ParkingSpace: obj.ParkingSpace,
  //   Environment: obj.Environment,
  //   Transportation: obj.Transportation,
  //   License: obj.License,
  //   Square: obj.Square,
  //   OwnYear: obj.OwnYear,
  //   MgtCompany: obj.MgtCompany,
  //   MgtPrice: obj.MgtPrice,
  //   BuildingDensity: obj.BuildingDensity,
  //   FAR: obj.FAR,
  //   BuildingAll: obj.BuildingAll,
  //   PropertyType: obj.PropertyType,
  //   Offer: obj.Offer,
  //   Tag: obj.Tag,
  //   Price: obj.Price,
  //   Lng: obj.Lng,
  //   Lat: obj.Lat,
  //   DevTel: obj.DevTel,
  //   picSrc: obj.picSrc,
  //   piclis: obj.piclis,
  //   roomvalue: obj.roomvalue,
  //   roompic: obj.roompic,
  //   Room: obj.Room,
  //   EstateID: obj.EstateID
  // }
  // return fetch({
  //   url: '/Handler/Handler.ashx',
  //   method: 'post',
  //   params
  // })

    return axios
    .post(
      "/Handler/Handler.ashx",
      qs.stringify({
        todo: "Estate",
        type: type,
        needpurview: true,
        valiurl: document.URL,
        EstateName: obj.EstateName,
        DistrictName: obj.DistrictName,
        Address: obj.Address,
        PropertyUsage: obj.PropertyUsage,
        DevCompany: obj.DevCompany,
        EstateIntro: obj.EstateIntro,
        FloorAll: obj.FloorAll,
        ParkingSpace: obj.ParkingSpace,
        Environment: obj.Environment,
        Transportation: obj.Transportation,
        License: obj.License,
        Square: obj.Square,
        OwnYear: obj.OwnYear,
        MgtCompany: obj.MgtCompany,
        MgtPrice: obj.MgtPrice,
        BuildingDensity: obj.BuildingDensity,
        FAR: obj.FAR,
        BuildingAll: obj.BuildingAll,
        PropertyType: obj.PropertyType,
        Offer: obj.Offer,
        Tag: obj.Tag,
        Price: obj.Price,
        Lng: obj.Lng,
        Lat: obj.Lat,
        DevTel: obj.DevTel,
        picSrc: obj.picSrc,
        piclis: obj.piclis,
        roomvalue: obj.roomvalue,
        roompic: obj.roompic,
        Room: obj.Room,
        EstateID: obj.EstateID
      })
    )
}

// 图片上传
export function ImgUpLoad(pic, sm_pic) {
  return axios
    .post(
    "/Handler/Handler.ashx",
    qs.stringify({
      todo: "ImgUpLoad",
      type: "SaveImgFile",
      needpurview: false,
      pic: pic,
      sm_pic: sm_pic,
      valiurl: document.URL
    })
  )
}

// 根据户型id删除户型
export function removeRoom(id) {
  const params = {
    todo: "EstateRoom",
    type: "delEstateRoom",
    needpurview: true,
    valiurl: document.URL,
    RoomID: id
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 根据图片id删除图片
export function removePhoto(id) {
  const params = {
    todo: "EstatePhoto",
    type: "delEstatePhoto",
    needpurview: true,
    valiurl: document.URL,
    PhotoID: id
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}