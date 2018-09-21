// 可能废置的图片路径转为base64格式的方法
export function crossorigin(url) {
  var img = new Image()
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  var src = url // insert image url here
  var dataURL = ''

  img.crossOrigin = 'Anonymous'
  img.src = src

  img.onload = function() {
    console.log(2)
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    // localStorage.setItem('savedImageData', canvas.toDataURL('image/png'))
    dataURL = canvas.toDataURL('image/png')
    console.log(dataURL)
  }

  // make sure the load event fires for cached images too
  // if (img.complete || img.complete === undefined) {
  //   console(3)
  //   img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
  //   img.src = src
  // }
}
