import fetch from '@/utils/fetch'

// 加载标签选项
export function InquiryTag() {
  const params = {
    todo: 'Reference',
    type: 'SelectByNameToJson',
    needpurview: true,
    valiurl: document.URL,
    RefName: 'InquiryTag'
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 加载分类选项
export function CustGrade() {
  const params = {
    todo: 'Reference',
    type: 'SelectByNameToJson',
    needpurview: true,
    valiurl: document.URL,
    RefName: 'CustGrade'
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

