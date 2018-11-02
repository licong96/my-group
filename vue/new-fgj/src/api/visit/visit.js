import fetch from '@/utils/fetch'

// 辩客楼盘数据
export function estate() {
  const params = {
    todo: 'Estate',
    type: 'GetSelectEstate',
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 辩客查询数据
export function SelectFilingByTel(EstateID,tel) {
  const params = {
    todo: 'Filing',
    type: 'SelectFilingByTel',
    EstateID: EstateID,
    valiurl: document.URL,
    needpurview: true,
    tel: tel
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 自来客到访
export function autofiling(CustMobile,EstateName,EstateID) {
  const params = {
    todo: 'Filing',
    type: 'in_autofiling',
    CustMobile: CustMobile,
    CustName: '自来客',
    valiurl: document.URL,
    EstateName: EstateName,
    EstateID: EstateID,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 到访
export function up_Visit(CustMobile, DeclareID, VisitType, VisitNo, EstateID) {
  const params = {
    todo: 'Filing',
    type: 'up_Visit',
    CustMobile: CustMobile,
    valiurl: document.URL,
    DeclareID: DeclareID,
    VisitType: VisitType,
    VisitNo: VisitNo,
    EstateID: EstateID,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
