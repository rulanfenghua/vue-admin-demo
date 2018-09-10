import request from '@/config/httpConfig'

export function login() {
  return request({
    url: '/login',
    method: 'post'
  })
}
