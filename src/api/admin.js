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
    url: '/station/getGender',
    method: 'post'
  })
}

export function getDay() {
  return request({
    url: '/station/getDayData',
    method: 'post'
  })
}

export function getLast() {
  return request({
    url: '/station/getLast',
    method: 'post'
  })
}

export function getPersonList() {
  return request({
    url: '/station/getAllResidentList',
    method: 'post'
  })
}
