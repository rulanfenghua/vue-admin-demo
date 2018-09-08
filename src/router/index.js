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
                path: '',
                component: () => import(''),
                name: '',
                meta: {
                    name: '居民列表',
                    icon: ''
                }
            },
            {
                path: '',
                component: () => import(''),
                name: '',
                meta: {
                    name: '统计分析',
                    icon: ''
                }
            },
            {
                path: '',
                component: () => import(''),
                name: '',
                meta: {
                    name: '系统管理',
                    icon: ''
                }
            }
        ]
    },
    {
        path: '/403',
        component: () => import('@/pages/error/403')
    },
    {
        path: '*',
        component: () => import('@/pages/error/404')
    }
]
