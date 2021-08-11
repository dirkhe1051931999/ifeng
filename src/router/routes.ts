import { RouteConfig } from 'vue-router';
/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:
  meta: {
    pagePermissionId              页面权限的id, -1就是管理员才有的权限
  }
*/

export const constantRoutes: RouteConfig[] = [
  /* webview */
  {
    path: '/tab_home_more_categories',
    component: () => import(/* webpackChunkName: "tab_home_more_categories" */ 'pages/webview/tab_home_more_categories/index.vue'),
    meta: {},
  },
  {
    path: '/tab_home_region',
    component: () => import(/* webpackChunkName: "tab_home_region" */ 'pages/webview/tab_home_region/index.vue'),
    meta: {},
  },
  {
    path: '/tab_home_user_perference',
    component: () => import(/* webpackChunkName: "tab_home_user_perference" */ 'pages/webview/tab_home_user_perference/index.vue'),
    meta: {},
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ 'pages/webview/login/index.vue'),
    meta: {},
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "welcome" */ 'pages/webview/welcome/index.vue'),
  },
  {
    path: '/news_detail/:id',
    component: () => import(/* webpackChunkName: "news_detail" */ 'pages/webview/news_detail/index.vue'),
  },
  {
    path: '/tab_home_hot/:index',
    component: () => import(/* webpackChunkName: "tab_home_hot" */ 'pages/webview/tab_home_hot/index.vue'),
    meta: {},
  },
  {
    path: '/tab_home_qualityReading',
    component: () => import(/* webpackChunkName: "tab_home_qualityReading" */ 'pages/webview/tab_home_qualityReading/index.vue'),
    meta: {},
  },
  {
    path: '/tab_home_search',
    component: () => import(/* webpackChunkName: "tab_home_search" */ 'pages/webview/tab_home_search/index.vue'),
    meta: {},
  },
  {
    path: '/yule_theme',
    component: () => import(/* webpackChunkName: "yule_theme" */ 'pages/webview/yule_theme/index.vue'),
    meta: {},
  },
  {
    path: '/news_topic',
    component: () => import(/* webpackChunkName: "news_topic" */ 'pages/webview/news_topic/index.vue'),
    meta: {},
  },
  {
    path: '/news_theme',
    component: () => import(/* webpackChunkName: "news_theme" */ 'pages/webview/news_theme/index.vue'),
    meta: {},
  },
  // 抗疫的子页面
  {
    path: '/ifeng_web_kangyi_yimiao_progress',
    component: () => import(/* webpackChunkName: "share_kangyi_yimiao_process" */ 'pages/webview/ifeng_web/kangyi/progress.vue'),
    meta: {},
  },
  {
    path: '/ifeng_web_kangyi_area',
    component: () => import(/* webpackChunkName: "share_kangyi_area_kangyi" */ 'pages/webview/ifeng_web/kangyi/area.vue'),
    meta: {},
  },
  {
    path: '/ifeng_web_kangyi_summary',
    component: () => import(/* webpackChunkName: "ifeng_web_kangyi_summary" */ 'pages/webview/ifeng_web/kangyi/summary.vue'),
    meta: {},
  },
  {
    path: '/ifeng_web_kangyi_jingwai',
    component: () => import(/* webpackChunkName: "ifeng_web_kangyi_jingwai" */ 'pages/webview/ifeng_web/kangyi/jingwai.vue'),
    meta: {},
  },
  {
    path: '/ifeng_web_kangyi_quanqiu',
    component: () => import(/* webpackChunkName: "ifeng_web_kangyi_quanqiu" */ 'pages/webview/ifeng_web/kangyi/quanqiu.vue'),
    meta: {},
  },
  {
    path: '/ifeng_web_kangyi_other_guojia',
    component: () => import(/* webpackChunkName: "ifeng_web_kangyi_other_guojia" */ 'pages/webview/ifeng_web/kangyi/other_guojia.vue'),
    meta: {},
  },
  // 财经的子页面
  {
    path: '/ifeng_web_caijing_zhiboshi',
    component: () => import(/* webpackChunkName: "ifeng_web_caijing_zhiboshi" */ 'pages/webview/ifeng_web/caijing/zhiboshi.vue'),
    meta: {},
  },
  {
    path: '/ifeng_web_caijing_pindao',
    component: () => import(/* webpackChunkName: "ifeng_web_caijing_pindao" */ 'pages/webview/ifeng_web/caijing/pindao.vue'),
    meta: {},
  },
  {
    path: '/ifeng_web_caijing_pindao/stock_up_down_list',
    component: () =>
      import(/* webpackChunkName: "ifeng_web_caijing_pindao_stock_up_down_list" */ 'pages/webview/ifeng_web/caijing/stock_up_down.vue'),
    meta: {},
  },
  {
    path: '/ifeng_web_caijing_pindao/search',
    component: () => import(/* webpackChunkName: "ifeng_web_caijing_pindao_search" */ 'pages/webview/ifeng_web/caijing/search.vue'),
    meta: {},
  },
  {
    path: '/ifeng_web_caijing_pindao/stock_detail',
    component: () => import(/* webpackChunkName: "ifeng_web_caijing_pindao_stock_detail" */ 'pages/webview/ifeng_web/caijing/stock_detail.vue'),
    meta: {},
  },
  /* app */
  { path: '/app/:tab', component: () => import(/* webpackChunkName: "App" */ 'pages/app/index.vue') },
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
        component: () => import(/* webpackChunkName: "authA" */ 'pages/webview/auth/a.vue'),
      },
      {
        path: 'b',
        name: 'AuthB',
        meta: {
          title: 'authB',
          icon: 'label',
          pagePermissionId: ['-1', '2'],
        },
        component: () => import(/* webpackChunkName: "authB" */ 'pages/webview/auth/b.vue'),
      },
    ],
  },
];
