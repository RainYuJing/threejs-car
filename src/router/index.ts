import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
// createWebHistory    history
// createWebHashHistory   hash
// import Layout from '../components/HelloWorld.vue'

const routes: Array<RouteRecordRaw> = [
  {
  //路由初始指向
    path: '/',
    name: 'Home',
    component: ()=>import('@/pages/Home/index.vue'),
  }
]
const isProd = process.env.NODE_ENV === 'production'; // 是否开发环境
const BASE_PREFIX = isProd ? '/threejs-car/' : '/'; // 根据环境设置base
const router = createRouter({
  // 根据是否qiankun环境设置base
  history: createWebHistory((window as any).__POWERED_BY_QIANKUN__ ? BASE_PREFIX : '/'),
  routes,
});

export default router
