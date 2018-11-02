export default {
  IsExp: [
    {
      label: '不限',
      value: '',
      checked: false
    }, {
      label: '过期',
      value: '0',
      checked: false
    }, {
      label: '有效',
      value: '1',
      checked: false
    }
  ],
  order: [
    {
      label: '不限',
      value: ''
    }, {
      label: '最新报备',
      value: 'DeclareDate-desc'
    }, {
      label: '最新到访',
      value: 'VisitDate-desc'
    }
  ]
}