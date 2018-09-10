import request from '@/config/httpConfig'

export function loginResident() {
  return request({
    url: '/resident/login',
    method: 'post'
  })
}

export function getPersonalMess() {
  return request({
    url: '/resident/getPersonalMess',
    method: 'post'
  })
}

export function printing() {
  return request({
    url: '/resident/printing',
    method: 'post'
  })
}
