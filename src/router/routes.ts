import { RouteConfig } from 'vue-router';
import App from 'pages/app/index.vue';
import Tab_home from 'pages/tabs/home/index.vue';
import Tab_mine from 'pages/tabs/mine/index.vue';
import Tab_plaza from 'pages/tabs/plaza/index.vue';
import Tab_shortVideo from 'pages/tabs/shortVideo/index.vue';
/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:
  meta: {
    pagePermissionId              页面权限的id, -1就是管理员才有的权限
  }
*/

export const constantRoutes: RouteConfig[] = [
  {
    path: '*',
    redirect: '/404',
    meta: {},
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ 'pages/iframe/404/index.vue'),
    meta: {},
  },
  {
    path: '/welcome',
    component: () => import(/* webpackChunkName: "welcome" */ 'pages/iframe/welcome/index.vue'),
    meta: {},
  },
  {
    path: '/more_categories',
    component: () => import(/* webpackChunkName: "more_categories" */ 'pages/iframe/more_categories/index.vue'),
    meta: {},
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ 'pages/iframe/login/index.vue'),
    meta: {},
  },
  {
    path: '/user_perference',
    component: () => import(/* webpackChunkName: "user_perference" */ 'pages/iframe/user_perference/index.vue'),
    meta: {},
  },
  {
    path: '/region',
    component: () => import(/* webpackChunkName: "region" */ 'pages/iframe/region/index.vue'),
    meta: {},
  },
  {
    path: '/app',
    meta: {},
    component: App,
    children: [
      {
        path: 'home',
        meta: {},
        component: Tab_home,
      },
      {
        path: 'mine',
        meta: {},
        component: Tab_mine,
      },
      {
        path: 'plaza',
        meta: {},
        component: Tab_plaza,
      },
      {
        path: 'shortVideo',
        meta: {},
        component: Tab_shortVideo,
      },
    ],
  },
];
/**
 * 有权限限制
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes: RouteConfig[] = [
  {
    path: '/auth',
    meta: {
      title: 'auth',
      icon: 'remove_from_queue',
      pagePermissionId: ['-1', '1', '2'],
      opened: false,
    },
    children: [
      {
        path: 'a',
        name: 'label',
        meta: {
          title: 'authA',
          icon: 'label',
          pagePermissionId: ['-1', '1'],
        },
        component: () => import(/* webpackChunkName: "authA" */ 'pages/iframe/auth/a.vue'),
      },
      {
        path: 'b',
        name: 'AuthB',
        meta: {
          title: 'authB',
          icon: 'label',
          pagePermissionId: ['-1', '2'],
        },
        component: () => import(/* webpackChunkName: "authB" */ 'pages/iframe/auth/b.vue'),
      },
    ],
  },
];
