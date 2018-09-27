export function inserted(el) {
  el.querySelectorAll('img').forEach(i => {
    let src = i.attributes.getNamedItem('src').value

    let img = new window.Image()
    img.src = src
    img.style.position = 'fixed'
    img.style.top = '10%'
    img.style.left = '50%'
    img.style.transform = 'translateX(-50%)'
    img.style.maxWidth = img.style.maxHeight = '90%'
    img.style.zIndex = 9999

    img.addEventListener('click', () => {
      document.body.removeChild(img)
    })

    i.addEventListener('click', () => {
      document.body.appendChild(img)
    })
  })
}
