// function formatNumber(n) {
//   const str = n.toString()
//   return str[1] ? str : `0${str}`
// }

// export function formatTime(date) {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()

//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   const t1 = [year, month, day].map(formatNumber).join('/')
//   const t2 = [hour, minute, second].map(formatNumber).join(':')

//   return `${t1} ${t2}`
// }

export function formatTime (date) {
  var re = /-?\d+/
  var m = re.exec(date)
  var d = new Date(parseInt(m[0]))
  var o = {
    'M+': d.getMonth() + 1, // month
    'd+': d.getDate(), // day
    'h+': d.getHours(), // hour
    'm+': d.getMinutes(), // minute
    's+': d.getSeconds(), // second
    'q+': Math.floor((d.getMonth() + 3) / 3), // quarter
    'S': d.getMilliseconds() // millisecond
  }
  var format = 'yyyy-MM-dd'
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}
