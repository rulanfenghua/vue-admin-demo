import request from '@/config/httpConfig'

export function login(account, password) {
  const data = {
    userName: account,
    password: password
  }
  return request({
    url: '/login',
    method: 'post',
    data
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
