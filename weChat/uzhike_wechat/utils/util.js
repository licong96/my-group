const _fgj = {
  // 格式化日期
  formatTimeDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    return [year, month, day].map(this.formatNumber).join('-');
  },
  // 格式化时间
  formatTime(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':');
  },
  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  },
  beFormatTimeDate(date) {  //上一个月
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate() + 1;

    return [year, month, day].map(this.formatNumber).join('-');
  },
  /**
   * 记录用户上传之后，修改的数据
   * @params { Object } oldObj  修改前的数据
   * @params { Object } newObj  修改后的数据
   * @return { Object } diffObj 返回一个新的对象，老数据和新数据之间用`&`拼接：{ key: 'old&new' }
   */
  postJson(oldObj, newObj) {
    let diffObj = {};

    for (let key of Object.keys(newObj)) {
      // 处理数据类型
      if (typeof newObj[key] === 'number') {
        newObj[key] = String(newObj[key]);
      }

      if (oldObj[key] !== newObj[key]) {
        diffObj[key] = oldObj[key] + '&' + newObj[key]
      }
    }
    return diffObj;
  },
  // 把对象拼接成url参数
  param(data) {
    let url = ''
    for (let k in data) {
      let value = data[k] !== undefined ? data[k] : ''
      url += '&' + k + '=' + value
    };
    return url ? url.substring(1) : ''
  },
  // 字段验证
  verify (strings, type) {
    if (!strings) {
      return false
    };
    let value = strings;
    if(typeof strings === 'string'){
      value.replace(/\s/g, '');   // 去掉空白字符
    }
    // 非空验证
    if (type === 'require') {
      return !!value
    }
    // 单词字符和数字
    if (type === 'word') {
      return /^[\w]+$/.test(value);
    }
    // 只能是数字
    if (type === 'number') {
      return /^\d+$/.test(value);
    }
    // 数字或有小数位
    if (type === 'number-dot') {
      return /^\d+[\.]?[\d]*$/.test(value)
    }
    // 手机号验证前五后二位
    if (type === 'phone-mark') {
      return /^1[3-9]{4}\*{4}\d{2}$/.test(value);
    }
    // 手机号验证
    if (type === 'phone') {
      return /^1[3-9]\d{9}$/.test(value);
    }
    // 邮箱号验证
    if (type === 'email') {
      return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
    }
    // 身份证号码验证
    if (type === 'IDCard') {
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
    }
  },
};

export default _fgj;