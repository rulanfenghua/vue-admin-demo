import request from '@/config/httpConfig'

export function loginResident(name, idCard, captcha) {
  const data = {
    name: name,
    idCard: idCard,
    captcha: captcha
  }
  return request({
    url: '/resident/login',
    method: 'post',
    data
  })
}

export function getPersonalMess(id) {
  const url = '/resident/getPersonalDateList' + '/' + id
  return request({
    url,
    method: 'get'
  })
}

export function getPersonalData(idCard) {
  const url = '/resident/getPersonalMess' + '/' + idCard
  return request({
    url,
    method: 'get'
  })
}

export function printing(id, checkDate) {
  const data = {
    id: id,
    checkDate: checkDate
  }
  return request({
    url: '/resident/printing',
    method: 'post',
    data
  })
}
