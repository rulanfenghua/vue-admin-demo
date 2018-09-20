// 下面两个package要单独安装
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function(id, title) {
      // let originalWidth = document.querySelector(`#${id}`).offsetWidth
      // let originalHeight = document.querySelector(`#${id}`).offsetHeight

      // let canvas = document.createElement('canvas')
      // let context = canvas.getContext('2d')

      // let devicePixelRatio = window.devicePixelRatio || 2
      // let backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1

      // let ratio = devicePixelRatio / backingStoreRatio
      // canvas.width = originalWidth * ratio
      // canvas.height = originalHeight * ratio
      // canvas.style.width = originalWidth + 'px'
      // canvas.style.height = originalHeight + 'px'

      // let transTop = document.querySelector(`#${id}`).offsetTop
      // let transleft = document.querySelector(`#${id}`).offsetleft
      // context.scale(ratio, ratio)
      // context.translate(transleft, transTop)

      // 解决跨域，将跨域图片路径转为base64格式
      // var img = new Image();
      // var canvas = document.createElement('canvas');
      // var context = canvas.getContext('2d');
      // img.crossOrigin = 'Anonymous';
      // img.src = $('#ossImg').attr('src')
      // img.onload = function () {
      //   canvas.height = img.height;
      //   canvas.width = img.width;
      //   ctx.drawImage(img, 0, 0);
      //   var dataURL = canvas2.toDataURL('image/png');
      //   $('#ossImg').attr('src', dataURL);
      //   canvas2 = null;

      //   //重新给img赋值成功后，执行截图方法
      //   getCard()

      // }

      html2Canvas(document.querySelector(`#${id}`), {
        // allowTaint: true
        useCORS: true, // 看情况选用上面还是下面的
        logging: false
      }).then(function(canvas) {
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
