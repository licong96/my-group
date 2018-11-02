import EXIF from 'exif-js'

// 缩略图片
// export function DrawImageToBase(ImgD, widthS, heightS) {
//   var image = new Image()
//   image.src = ImgD.src
//   if (widthS > 0 && heightS > 0) {
//     if (image.width > 0 && image.height > 0) {
//       if (image.width / image.height >= widthS / heightS) {
//         if (image.width > widthS) {
//           ImgD.width = widthS
//           ImgD.height = (image.height * widthS) / image.width
//         } else {
//           ImgD.width = image.width
//           ImgD.height = image.height
//         }
//       } else {
//         if (image.height > heightS) {
//           ImgD.height = heightS
//           ImgD.width = (image.width * heightS) / image.height
//         } else {
//           ImgD.width = image.width
//           ImgD.height = image.height
//         }
//       }
//     }
//   } else {
//     ImgD.width = image.width
//     ImgD.height = image.height
//   }
//   console.log(ImgD)
//   return getBase64Image(ImgD)
// }
// export function getBase64Image(img){
//   var canvas = document.createElement('canvas')
//   canvas.width = img.width
//   canvas.height = img.height
//   var ctx = canvas.getContext('2d')
//   ctx.drawImage(img, 0, 0, img.width, img.height)
//   var dataURL = canvas.toDataURL('image/png')
//   return dataURL // return dataURL.replace("data:image/png;base64,", "");
// }
// 缩略图片
export function DrawImageToBase(ImgD, widthS, heightS) {
  var image = new Image()
  image.src = ImgD.src
  if (widthS > 0 && heightS > 0) {
    if (image.width > 0 && image.height > 0) {
      if (image.width / image.height >= widthS / heightS) {
        if (image.width > widthS) {
          ImgD.width = widthS
          ImgD.height = (image.height * widthS) / image.width
        } else {
          ImgD.width = image.width
          ImgD.height = image.height
        }
      } else {
        if (image.height > heightS) {
          ImgD.height = heightS
          ImgD.width = (image.width * heightS) / image.height
        } else {
          ImgD.width = image.width
          ImgD.height = image.height
        }
      }
    }
  } else {
    ImgD.width = image.width
    ImgD.height = image.height
  }
  // console.log(ImgD)
  return getBase64Image(ImgD)
}
export function getBase64Image(img) {
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  var ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  var dataURL = canvas.toDataURL('image/png')
  return dataURL // return dataURL.replace("data:image/png;base64,", "");
}


// 下面是黎聪添加的方法
/**
 * 图片压缩，旋转
 * @export
 * @param {any} img 图片
 * @param {number} [ratio=0.8]  压缩质量 0 ~ 1 之间
 * @param {any} width 选填
 * @param {any} height  选填
 * @returns 
 */
export function imageCompress(img, ratio, width, height) {
  var canvas, ctx, img64, obj = {}

  //获取图片方向
  obj = getPhotoOrientation(img)

  width = width || obj.ImageWidth
  height = height || obj.ImageHeight

  console.log(width, height)
  console.log(obj.orient)

  canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  ctx = canvas.getContext("2d")

  //如果图片方向等于6 ，则旋转矫正，反之则不做处理
  // if (obj.orient === 6) {
  //   ctx.save()
  //   ctx.translate(width / 2, height / 2)
  //   ctx.rotate(90 * Math.PI / 180)
  //   ctx.drawImage(img, -height / 2, -width / 2, height, width)
  //   ctx.restore()
  // } else {
  //   ctx.drawImage(img, 0, 0, width, height)
  // }
  ctx.drawImage(img, 0, 0, width, height)

  // ctx.drawImage(img, 0, 0, width, height, 0, 0, width, width);

  // img64 = canvas.toDataURL("image/jpeg", ratio)
  img64 = canvas.toDataURL("image/jpeg", ratio)
  return img64
}

/**
 * 获取图片方向
 * @param {any} img 图片
 * @returns 角度、宽度、高度
 */
function getPhotoOrientation (img) {
  var orient, ImageWidth, ImageHeight
  EXIF.getData(img, function () {
    orient = EXIF.getTag(this, 'Orientation')
    var allMetaData = EXIF.getAllTags(this)
    console.log('allMetaData', allMetaData)
    console.log('natural', img.naturalWidth, img.naturalHeight)
    ImageWidth = allMetaData.ImageWidth || img.naturalWidth
    ImageHeight = allMetaData.ImageHeight || img.naturalHeight
  })
  return {
    orient,
    ImageWidth,
    ImageHeight
  }
}
