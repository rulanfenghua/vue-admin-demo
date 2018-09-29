import request from '@/config/httpConfig'

export function treeList() {
  return request({
    url: '/treeList',
    method: 'post'
  })
}
