import request from '@/config/httpConfig'

export function index() {
  return request({
    url: '/station/index',
    method: 'post'
  })
}

export function getWeek() {
  return request({
    url: '/station/getSevenDay',
    method: 'post'
  })
}

export function getGender() {
  return request({
    url: '/station/getByManWomanNum',
    method: 'post'
  })
}

export function getDay() {
  return request({
    url: '/station/getDayData',
    method: 'post'
  })
}

export function getLast() {
  return request({
    url: '/station/getYearEveryMonth',
    method: 'post'
  })
}

export function getPersonList(page, limit, name, idcard, station, date) {
  // const data = {
  //   pageNum: page,
  //   pageSize: limit,
  //   name: name,
  //   idCard: idcard,
  //   stationId: station,
  //   startDate: date[0],
  //   endDate: date[1]
  // }
  const data = {
    pageNum: page,
    pageSize: limit,
    condition: {
      name: name,
      idCard: idcard,
      stationId: station,
      startDate: date[0],
      endDate: date[1]
    }
  }
  return request({
    url: '/station/getAllResidentList',
    method: 'post',
    data
  })
}
