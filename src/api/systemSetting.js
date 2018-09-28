import request from '@/config/httpConfig'

export function treeList() {
  return request({
    url: '/sysStation/treeList',
    method: 'post'
  })
}

export function treeListSys() {
  return request({
    url: '/sysStation/treeUserList',
    method: 'post'
  })
}

export function superTreeList() {
  return request({
    url: '/superConservator/treeList',
    method: 'post'
  })
}
