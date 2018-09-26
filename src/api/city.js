import request from '@/config/httpConfig'

export function getMap() {
  return request({
    url: '/superConservator/getMap',
    method: 'post'
  })
}

export function index() {
  return request({
    url: '/superConservator/index',
    method: 'post'
  })
}

export function getGender() {
  return request({
    url: '/superConservator/getByManWomanNum',
    method: 'post'
  })
}

export function getWeek() {
  return request({
    url: '/superConservator/getSevenDay',
    method: 'post'
  })
}

export function getLast() {
  return request({
    url: '/superConservator/getCountAllStation',
    method: 'post'
  })
}
