// 下面两个package要单独安装
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function (id, title, img1, url1) {
      console.log(1)
      var img = new Image()
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      var src = url1 // insert image url here
      var dataURL = ''

      img.crossOrigin = 'Anonymous'
      img.src = src

      img.onload = function () {
        console.log(2)
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        // localStorage.setItem('savedImageData', canvas.toDataURL('image/png'))
        dataURL = canvas.toDataURL('image/png')
        console.log(dataURL)

        document.querySelector(`#${img1}`).setAttribute('src', dataURL)

        html2Canvas(document.querySelector(`#${id}`), {
          // allowTaint: true,
          // useCORS: true, // 看情况选用上面还是下面的
          logging: false
        }).then(function (canvas) {
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = contentWidth / 592.28 * 841.89
          let leftHeight = contentHeight
          let position = 0
          let imgWidth = 595.28
          let imgHeight = 592.28 / contentWidth * contentHeight
          let pageData = canvas.toDataURL('image/jpeg', 1.0)
          let PDF = new JsPDF('', 'pt', 'a4')
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          PDF.save(title + '.pdf')
        })
      }
    }
  }
}
