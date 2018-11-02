/**
 * Created by jiachenpan on 16/11/18.
 */

  import axios from 'axios'
  import qs from "qs"

  // post请求
  export function post(params) {
    return axios.post("/Handler/Handler.ashx", qs.stringify(params))
  }

 export function parseTime(time, cFormat) {
   if (arguments.length === 0) {
     return null
   }
   const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
   let date
   if (typeof time === 'object') {
     date = time
   } else {
     if (('' + time).length === 10) time = parseInt(time) * 1000
     date = new Date(time)
   }
   const formatObj = {
     y: date.getFullYear(),
     m: date.getMonth() + 1,
     d: date.getDate(),
     h: date.getHours(),
     i: date.getMinutes(),
     s: date.getSeconds(),
     a: date.getDay()
   }
   const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
     let value = formatObj[key]
     if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
     if (result.length > 0 && value < 10) {
       value = '0' + value
     }
     return value || 0
   })
   return time_str
 }

 export function formatTime(time, option) {
   time = +time * 1000
   const d = new Date(time)
   const now = Date.now()

   const diff = (now - d) / 1000

   if (diff < 30) {
     return '刚刚'
   } else if (diff < 3600) { // less 1 hour
     return Math.ceil(diff / 60) + '分钟前'
   } else if (diff < 3600 * 24) {
     return Math.ceil(diff / 3600) + '小时前'
   } else if (diff < 3600 * 24 * 2) {
     return '1天前'
   }
   if (option) {
     return parseTime(time, option)
   } else {
     return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
   }
 }

// 格式化时间
 export function getQueryObject(url) {
   url = url == null ? window.location.href : url
   const search = url.substring(url.lastIndexOf('?') + 1)
   const obj = {}
   const reg = /([^?&=]+)=([^?&=]*)/g
   search.replace(reg, (rs, $1, $2) => {
     const name = decodeURIComponent($1)
     let val = decodeURIComponent($2)
     val = String(val)
     obj[name] = val
     return rs
   })
   return obj
 }

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
 export function getByteLen(val) {
   let len = 0
   for (let i = 0; i < val.length; i++) {
     if (val[i].match(/[^\x00-\xff]/ig) != null) {
       len += 1
     } else { len += 0.5 }
   }
   return Math.floor(len)
 }

 export function cleanArray(actual) {
   const newArray = []
   for (let i = 0; i < actual.length; i++) {
     if (actual[i]) {
       newArray.push(actual[i])
     }
   }
   return newArray
 }

 export function param(json) {
   if (!json) return ''
   return cleanArray(Object.keys(json).map(key => {
     if (json[key] === undefined) return ''
     return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key])
   })).join('&')
 }

 export function param2Obj(url) {
   const search = url.split('?')[1]
   if (!search) {
     return {}
   }
   return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
 }

 export function html2Text(val) {
   const div = document.createElement('div')
   div.innerHTML = val
   return div.textContent || div.innerText
 }

 export function objectMerge(target, source) {
    /* Merges two  objects,
     giving the last one precedence */

   if (typeof target !== 'object') {
     target = {}
   }
   if (Array.isArray(source)) {
     return source.slice()
   }
   for (const property in source) {
     if (source.hasOwnProperty(property)) {
       const sourceProperty = source[property]
       if (typeof sourceProperty === 'object') {
         target[property] = objectMerge(target[property], sourceProperty)
         continue
       }
       target[property] = sourceProperty
     }
   }
   return target
 }

 export function scrollTo(element, to, duration) {
   if (duration <= 0) return
   const difference = to - element.scrollTop
   const perTick = difference / duration * 10
   setTimeout(() => {
     console.log(new Date())
     element.scrollTop = element.scrollTop + perTick
     if (element.scrollTop === to) return
     scrollTo(element, to, duration - 10)
   }, 10)
 }

 export function toggleClass(element, className) {
   if (!element || !className) {
     return
   }
   let classString = element.className
   const nameIndex = classString.indexOf(className)
   if (nameIndex === -1) {
     classString += '' + className
   } else {
     classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
   }
   element.className = classString
 }

 export const pickerOptions = [
   {
     text: '今天',
     onClick(picker) {
       const end = new Date()
       const start = new Date(new Date().toDateString())
       end.setTime(start.getTime())
       picker.$emit('pick', [start, end])
     }
   }, {
     text: '最近一周',
     onClick(picker) {
       const end = new Date(new Date().toDateString())
       const start = new Date()
       start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
       picker.$emit('pick', [start, end])
     }
   }, {
     text: '最近一个月',
     onClick(picker) {
       const end = new Date(new Date().toDateString())
       const start = new Date()
       start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
       picker.$emit('pick', [start, end])
     }
   }, {
     text: '最近三个月',
     onClick(picker) {
       const end = new Date(new Date().toDateString())
       const start = new Date()
       start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
       picker.$emit('pick', [start, end])
     }
   }]

 export function getTime(type) {
   if (type === 'start') {
     return new Date().getTime() - 3600 * 1000 * 24 * 90
   } else {
     return new Date(new Date().toDateString())
   }
 }

 export function debounce(func, wait, immediate) {
   let timeout, args, context, timestamp, result

   const later = function() {
    // 据上一次触发时间间隔
     const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
     if (last < wait && last > 0) {
       timeout = setTimeout(later, wait - last)
     } else {
       timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
       if (!immediate) {
         result = func.apply(context, args)
         if (!timeout) context = args = null
       }
     }
   }

   return function(...args) {
     context = this
     timestamp = +new Date()
     const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
     if (!timeout) timeout = setTimeout(later, wait)
     if (callNow) {
       result = func.apply(context, args)
       context = args = null
     }

     return result
   }
 }

 export function deepClone(source) {
   if (!source && typeof source !== 'object') {
     throw new Error('error arguments', 'shallowClone')
   }
   const targetObj = source.constructor === Array ? [] : {}
   for (const keys in source) {
     if (source.hasOwnProperty(keys)) {
       if (source[keys] && typeof source[keys] === 'object') {
         targetObj[keys] = source[keys].constructor === Array ? [] : {}
         targetObj[keys] = deepClone(source[keys])
       } else {
         targetObj[keys] = source[keys]
       }
     }
   }
   return targetObj
 }
  // 正则手机判断
 export function isCheckMobile(text) {
  // let reg = /^(13[0-9]|147|15[0-9]|18[0-9]|17[0-9])([0-9]{8})$/;
  let reg = /^(13[0-9]|147|15[0-9]|18[0-9]|17[0-9]|19[0-9]|16[0-9])([0-9]{8})$/;
  let a = reg.test(text);
  let reg2 = /^([0-9]{4})$/;
  let b = reg2.test(text);
  if (a) {
    return a;
  } else if (b) {
    return b;
  } else {
    return false;
  }
}

// transform加前缀
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()
export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

// 去掉空字符
export function trim(str) {
  if (String.prototype.trim) {
    return str == null ? "" : String.prototype.trim.call(str);
  } else {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  }
}
// 去掉所有空格
export function removeTrim(str) {
  return str.replace(/\s+/g, '');
}
// 拿input的base64
export function filesBase64(file) {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader()

    reader.onload = function () {
      resolve(this.result)
    }

    reader.onerror = function () {
      reject('图片获取失败')
    }

    reader.readAsDataURL(file)
  })
}

// 通过base64，得到img对象
export function imageOnload(base64) {      // img对象
  return new Promise(function (resolve, reject) {
    let image = new Image()
    image.src = base64

    image.onload = function () {
      resolve(image)
    }
    image.onerror = function () {
      reject('图片处理失败')
    }
  })
}

// 一个延迟操作
export function timeBounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 合并tag数组，拼接成一个用|分割的字符串
export function jointTagStr(tag) {
  let tagStr = ''
  if (tag.length && tag !== '|') {    // 不能等于 |
    tag.forEach((item) => {     // 处理 tag
      if (item) {
        tagStr += '|' + item
      }
    })
  } else {     // 数组不能传空过去，因为会被过滤掉，至少也要一个 | 
    tagStr = '|'
  }
  return tagStr
}

// 输入验证
export function verifyData(value, type) {
  var value = trim(value)
  // 非空验证
  if (type === 'require') {
    return !!value
  }
  // 只验证数字
  if (type === 'number') {
    return /^[0-9]*$/.test(value)
  }
  // 验证数字和小数点验证
  if (type === 'number-dot') {
    return /^[0-9]+\.{0,1}[0-9]{0,5}$/.test(value)
  }
  // 手机号验证
  if (type === 'phone') {
    return /^(13[0-9]|147|15[0-9]|18[0-9]|17[0-9]|19[0-9]|16[0-9])([0-9]{8})$/.test(value)
  }
  // 邮箱号验证
  if (type === 'email') {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
  }
}

// 判断是否微信
export function isWeChat() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}