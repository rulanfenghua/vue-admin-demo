import Mock from 'mockjs'

Mock.mock('/login', 'post', {
  'code': 0,
  'data': {
    'userName': '小红',
    'levels': 0
  }
})
