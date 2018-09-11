import request from '@/config/httpConfig'

export function login() {
  return request({
    url: '/manager/login',
    method: 'post'
  })
}

export function changePass() {
  return request({
    url: '/manager/changePass',
    method: 'post'
  })
}
