import request from '@/config/httpConfig'

export function list(pageNum, pageSize, name) {
  const data = {
    pageNum,
    pageSize,
    name
  }
  return request({
    url: '/sysUser/list',
    method: 'post',
    data
  })
}

export function add(userName, loginName, password, status, phone, email) {
  const data = {
    userName,
    loginName,
    password,
    status,
    phone,
    email
  }
  return request({
    url: '/sysUser/list',
    method: 'post',
    data
  })
}
