import request from '@/config/httpConfig'

export function loginResident(name, idCard) {
  const data = {
    name: name,
    idCard: idCard
  }
  return request({
    url: '/resident/login',
    method: 'post',
    data
  })
}

export function getPersonalMess() {
  return request({
    url: '/resident/getPersonalDateList',
    method: 'get'
  })
}

export function printing() {
  return request({
    url: '/resident/getPersonalDate',
    method: 'get'
  })
}
