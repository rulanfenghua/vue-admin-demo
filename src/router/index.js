import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/pages/layout'

Vue.use(Router)

/* 初始路由 */
export default new Router({
  routes: [
    {
      path: '/login',
      component: () => import('@/pages/login')
    },
    {
      path: '/seach',
      component: () =>
        import('@/pages/seach')
    }
  ]
})

/* 准备动态添加的路由 */
export const DynamicRoutes = [
  {
    path: '',
    component: Layout,
    name: 'container',
    redirect: '/home',
    meta: {
      requiresAuth: true,
      name: '首页'
    },
    children: [
      {
        path: '/home',
        component: () => import('@/pages/home'),
        name: 'home',
        meta: {
          name: '首页',
          icon: 'icon-home'
        }
      },
      {
        path: '/residents',
        component: () => import('@/pages/residents'),
        name: 'residents',
        meta: {
          name: '居民列表',
          icon: ''
        }
      },
      {
        path: '/logging',
        component: () => import('@/pages/acci-logging'),
        name: 'logging',
        meta: {
          name: '日志管理',
          icon: ''
        }
      },
      {
        path: '/systemSetting',
        name: 'systemSetting',
        component: () => import('@/pages/acci-systemSetting'),
        meta: {
          name: '系统管理',
          icon: ''
        },
        children: [
          {
            path: '/systemSetting/users',
            component: () => import('@/pages/acci-systemSetting/users'),
            name: 'users',
            meta: {
              name: '用户管理'
            }
          },
          {
            path: '/systemSetting/roles',
            component: () => import('@/pages/acci-systemSetting/roles'),
            name: 'roles',
            meta: {
              name: '角色管理'
            }
          },
          {
            path: '/systemSetting/dict',
            component: () => import('@/pages/acci-systemSetting/dict'),
            name: 'dict',
            meta: {
              name: '字典管理'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/403',
    component: () => import('@/pages/errorPages/403')
  },
  {
    path: '*',
    component: () => import('@/pages/errorPages/404')
  }
]
