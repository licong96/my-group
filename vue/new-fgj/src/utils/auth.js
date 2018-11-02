import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getCookie(key) {
  return Cookies.get(key)
}
// Cookies.get() 方法居然会获取不到人员名

// 获取cookies
export function getCookies(c_name) {
  var c_start = null
  var c_end = null
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
      return decodeURI(document.cookie.substring(c_start, c_end));
    }
  };
  return null;
};