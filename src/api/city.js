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

export function getGender(state) {
  const data = {
    state: state
  }
  return request({
    url: '/superConservator/getByManWomanNum',
    method: 'post',
    data
  })
}

export function getWeek(state) {
  const data = {
    state: state
  }
  return request({
    url: '/superConservator/getSevenDay',
    method: 'post',
    data
  })
}

export function getLast() {
  return request({
    url: '/superConservator/getCountAllStation',
    method: 'post'
  })
}
