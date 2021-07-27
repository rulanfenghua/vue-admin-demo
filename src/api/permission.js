import request from '@/config/httpConfig'
import axios from 'axios'
import useMock from './store.js'

export function login(account, password, captcha) {
  const data = {
    userName: account,
    password: password,
    captcha: captcha
  }

  if (useMock) {
    return axios.post('/login', data)
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
