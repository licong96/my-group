
function functionName(obj, fn) {
  let arr = obj
  return fn(arr)
}

let c = functionName(11, function (data) {
  console.log(data)
})
