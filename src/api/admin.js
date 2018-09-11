import request from '@/config/httpConfig'

export function index() {
  return request({
    url: '/manager/index',
    method: 'post'
  })
}

export function getWeek() {
  return request({
    url: '/manager/getWeek',
    method: 'post'
  })
}

export function getGender() {
  return request({
    url: 'manager/getGender',
    method: 'post'
  })
}

export function getDay() {
  return request({
    url: '/manager/getDay',
    method: 'post'
  })
}

export function getLast() {
  return request({
    url: '/manager/getLast',
    method: 'post'
  })
}

export function getPersonList() {
  return request({
    url: '/manager/getPersonList',
    method: 'post'
  })
}
