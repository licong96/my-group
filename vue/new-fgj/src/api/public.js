import fetch from '@/utils/fetch'
import qs from "qs"
import axios from 'axios'

// 区域数据
export function SelectByCity() {
  const params = {
    todo: "District",
    type: "SelectByCity",
    needpurview: true,
    valiurl: document.URL
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 楼盘数据
export function estate() {
  const params = {
    todo: 'Estate',
    type: 'GetOnlineEstate',
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 部门数据
export function GetDepartmentJson(External = 0) {
  const params = {
    todo: 'Department',
    type: 'GetDepartmentJson',
    valiurl: document.URL,
    needpurview: true,  
    External: External    // 1：不显示房管家的详细组织架构   0：显示所有组织架构
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 根据部门id获取人员
export function GetEmployeeJson(DeptID) {
  const params = {
    todo: 'Employee',
    type: 'GetEmployeeJson',
    valiurl: document.URL,
    needpurview: true,
    DeptID: DeptID,
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 照片上传
export function ImgUpLoad(pic, sm_pic) {
  return axios
  .post(
    "/Handler/Handler.ashx",
    qs.stringify({
      todo: "ImgUpLoad",
      type: "SaveImgFile",
      needpurview: false,
      valiurl: document.URL,
      pic: pic,
      sm_pic: sm_pic,
    })
  )
}
// 获取楼盘标签数据
export function SelectByName(RefName = 'EstateTag') {
  const params = {
    todo: "Reference",
    type: "SelectByName",
    needpurview: true,
    valiurl: document.URL,
    RefName: RefName        // PropertyUsage:返回用途数据    ContractStatus:返回合同状态
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 获取用途条件
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

// 微信SDK
export function initjsapi() {
  const params = {
    todo: 'initjsapi',
    valiurl: document.URL
  }
  return fetch({
    url: '/Handler/Exec.aspx',
    method: 'get',
    params
  })
}

// 微信上传图片，给后端ID
export function SaveWxImgFile(serverId) {
  const params = {
    todo: 'ImgUpLoad',
    type: 'SaveWxImgFile',
    needpurview: false,
    valiurl: document.URL,
    serverid: serverId
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}