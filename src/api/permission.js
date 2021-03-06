import request from '@/config/httpConfig'

export function login(account, password, captcha) {
  const data = {
    userName: account,
    password: password,
    captcha: captcha
  }
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function changePass(account, password, newPassword) {
  const data = {
    loginName: account,
    password: password,
    newPassword: newPassword
  }
  return request({
    url: '/changePass',
    method: 'post',
    data
  })
}
