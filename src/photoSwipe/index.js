/* eslint-disable */
import previewComponent from './preview.vue'
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'

let $preview
var vuePhotoPreview = {
  install (Vue, opts) {
    const Preview = Vue.extend(previewComponent)
    opts = opts || {}
    if (!$preview) {
      $preview = new Preview({el: document.createElement('div')})
      document.body.appendChild($preview.$el)
    }

    let eventName,
      eventCallback
    Vue.prototype.$preview = {
      self: null,
      on: (name, callback) => {
        eventName = name
        eventCallback = callback
      }
    }

    Vue.mixin({
      data() {
        return {
          galleryElements: null
        }
      },
      methods: {
        parseThumbnailElements(thumbElements) {
          return new Promise(resolve => {
            var items = [],
              el,
              item,
              rw,
              rh
            var count = 0

            for (var i = 0; i < thumbElements.length; i++) {
              el = thumbElements[i]

              if (el.nodeType !== 1) {
                continue
              }

              if (typeof el.naturalWidth === 'undefined') { // IE 6/7/8
                var image = new Image()
                image.src = el.src
                rw = image.width
                rh = image.height
              } else { // HTML5 browsers
                rw = el.naturalWidth
                rh = el.naturalHeight
              }

              getImage(i)
              function getImage(index) {
                var image = new Image()
                image.msrc = el.getAttribute('src')
                image.src = el.getAttribute('large') ? el.getAttribute('large') : el.getAttribute('src')
                image.text = el.getAttribute('preview-text')
                image.author = el.getAttribute('data-author')
                image.onload = function () {
                  item = {
                    title: image.text,
                    src: image.src,
                    msrc: image.msrc,
                    w: rw,
                    h: rh,
                    author: image.author,
                    large: {
                      w: this.width,
                      h: this.height
                    }
                  }
                  items[index] = item
                  count++
                  if (count === thumbElements.length) {
                    resolve(items)
                  }
                }
              }
            }
          })
        },
        onThumbnailsClick(e) {
          e = e || window.event
          e.preventDefault ? e.preventDefault() : e.returnValue = false

          var eTarget = e.target || e.srcElement
          var thumbElements
          var group = eTarget.getAttribute('preview')
          if (group) {
            thumbElements = document.querySelectorAll(`img[preview="${group}"]`)
          } else {
            thumbElements = document.querySelectorAll(`img[preview]`)
          }

          var index = 0
          for (index; index < thumbElements.length; index++) {
            if (thumbElements[index] === eTarget) {
              break
            }
          }
          if (index >= 0) {
            this.openPhotoSwipe(index, thumbElements)
          }
          return false
        },
        async openPhotoSwipe(index, thumbElements, disableAnimation, fromURL) {
          var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items
          items = await this.parseThumbnailElements(thumbElements)

          options = {
            galleryUID: thumbElements[index].getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function () {
              var thumbnail = thumbElements[index],
                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                rect = thumbnail.getBoundingClientRect()
              return {
                x: rect.left,
                y: rect.top + pageYScroll,
                w: rect.width
              }
            }
          }

          if (fromURL) {
            if (options.galleryPIDs) {
              // parse real index when custom PIDs are used
              // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
              for (var j = 0; j < items.length; j++) {
                if (items[j].pid === index) {
                  options.index = j
                  break
                }
              }
            } else {
              options.index = parseInt(index, 10) - 1
            }
          } else {
            options.index = parseInt(index, 10)
          }

          // exit if index not found
          if (isNaN(options.index)) {
            return
          }

          // options=this.extend(options,opts)

          if (disableAnimation) {
            options.showAnimationDuration = 0
          }

          // Pass data to PhotoSwipe and initialize it
          gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
          Vue.prototype.$preview.self = gallery

          // see: http://photoswipe.com/documentation/responsive-images.html
          var realViewportWidth,
            useLargeImages = false,
            firstResize = true,
            imageSrcWillChange

          gallery.listen('beforeResize', function () {
            var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1
            dpiRatio = Math.min(dpiRatio, 2.5)
            realViewportWidth = gallery.viewportSize.x * dpiRatio

            if (realViewportWidth >= 1200 || (!gallery.likelyTouchDevice && realViewportWidth > 800) || screen.width > 1200) {
              if (!useLargeImages) {
                useLargeImages = true
                imageSrcWillChange = true
              }
            } else {
              if (useLargeImages) {
                useLargeImages = false
                imageSrcWillChange = true
              }
            }

            if (imageSrcWillChange && !firstResize) {
              gallery.invalidateCurrItems()
            }

            if (firstResize) {
              firstResize = false
            }

            imageSrcWillChange = false
          })

          gallery.listen('gettingData', function (index, item) {
            if (thumbElements[index].getAttribute('large')) {
              item.src = item.src
              item.msrc = item.msrc
              item.w = item.large.w
              item.h = item.large.h
            } else {
              item.src = item.src
              item.msrc = item.msrc
              item.w = item.w
              item.h = item.h
            }
          })

          gallery.listen(eventName, eventCallback)
          gallery.init()
        },
        init(gallerySelector) {
          var galleryElements = document.querySelectorAll(gallerySelector)
          for (var i = 0; i < galleryElements.length; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i + 1)
            galleryElements[i].onclick = this.onThumbnailsClick
          }
        }
      },
      mounted() {
        this.init('img[preview]')
      }
    })
  }
}

export default vuePhotoPreview

if (typeof window !== 'undefined' && !window.vuePhotoPreview) {
  window.vuePhotoPreview = vuePhotoPreview
}
