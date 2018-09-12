import request from '@/config/httpConfig'

export function index() {
  return request({
    url: '/station/index',
    method: 'post'
  })
}

export function getWeek() {
  return request({
    url: '/station/getWeek',
    method: 'post'
  })
}

export function getGender() {
  return request({
    url: 'station/getGender',
    method: 'post'
  })
}

export function getDay() {
  return request({
    url: '/station/getDay',
    method: 'post'
  })
}

export function getMouth() {
  return request({
    url: '/station/getMouth',
    method: 'post'
  })
}

export function getPersonList() {
  return request({
    url: '/station/getAllResidentList',
    method: 'post'
  })
}
