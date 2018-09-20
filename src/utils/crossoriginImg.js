export function crossorigin(url) {
  var img = new Image()
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  var src = url // insert image url here
  var dataURL = ''

  img.crossOrigin = 'Anonymous'
  img.src = src

  img.onload = function() {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    dataURL = canvas.toDataURL('image/png')
  }

  return dataURL
  // make sure the load event fires for cached images too
  // if (img.complete || img.complete === undefined) {
  //   img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  //   img.src = src;
  // }
}
