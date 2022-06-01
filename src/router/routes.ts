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
    path: '/',
    component: () => import(/* webpackChunkName: "welcome" */ 'pages/webview/welcome/index.vue'),
  },
  // 详情落地页
  {
    path: '/news_detail/doc',
    component: () => import(/* webpackChunkName: "news_detail_doc" */ 'pages/webview/news_detail/doc.vue'),
  },
  {
    path: '/news_detail/video',
    component: () => import(/* webpackChunkName: "news_detail_video" */ 'pages/webview/news_detail/video.vue'),
  },
  {
    path: '/news_detail/imglist',
    component: () => import(/* webpackChunkName: "news_detail_imglist" */ 'pages/webview/news_imglist/index.vue'),
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
  {
    path: '/ifeng_web_caijing_pindao/stock_detail_ganggu',
    component: () =>
      import(/* webpackChunkName: "ifeng_web_caijing_pindao_stock_detail_ganggu" */ 'pages/webview/ifeng_web/caijing/stock_detail_ganggu.vue'),
    meta: {},
  },
  {
    path: '/ifeng_web_caijing_pindao/stock_detail_kc50',
    component: () =>
      import(/* webpackChunkName: "ifeng_web_caijing_pindao_stock_detail_kc50" */ 'pages/webview/ifeng_web/caijing/stock_detail_kc50.vue'),
    meta: {},
  },
  // 音频的子页面
  {
    path: '/tab_yinpin_child/directory',
    component: () => import(/* webpackChunkName: "tab_yinpin_child_directory" */ 'pages/webview/tab_yinpin_child/directory.vue'),
    meta: {},
  },
  {
    path: '/tab_yinpin_child/categories',
    component: () => import(/* webpackChunkName: "tab_yinpin_child_categories" */ 'pages/webview/tab_yinpin_child/categories.vue'),
    meta: {},
  },
  {
    path: '/tab_yinpin_child/play',
    component: () => import(/* webpackChunkName: "tab_yinpin_child_play" */ 'pages/webview/tab_yinpin_child/play.vue'),
    meta: {},
  },
  // yingshiju的子页面
  {
    path: '/tab_yingshiju_child/dajurebo',
    component: () => import(/* webpackChunkName: "tab_yingshiju_child_dajurebo" */ 'pages/webview/tab_yingshiju_child/dajurebo.vue'),
    meta: {},
  },
  // 文创的子页面
  {
    path: '/tab_wenchuang_child/jingxuan',
    component: () => import(/* webpackChunkName: "tab_wenchuang_child_jingxuan" */ 'pages/webview/tab_wenchuang_child/jingxuan.vue'),
    meta: {},
  },
  // 科技的子页面
  {
    path: '/tab_keji_child/rebang',
    component: () => import(/* webpackChunkName: "tab_keji_child_rebang" */ 'pages/webview/tab_keji_child/rebang.vue'),
    meta: {},
  },
  {
    path: '/tab_keji_child/xinshijie',
    component: () => import(/* webpackChunkName: "tab_keji_child_xinshijie" */ 'pages/webview/tab_keji_child/xinshijie.vue'),
    meta: {},
  },
  {
    path: '/tab_keji_child/pingce',
    component: () => import(/* webpackChunkName: "tab_keji_child_pingce" */ 'pages/webview/tab_keji_child/pingce.vue'),
    meta: {},
  },
  {
    path: '/tab_keji_child/huaixiaoxi',
    component: () => import(/* webpackChunkName: "tab_keji_child_huaixiaoxi" */ 'pages/webview/tab_keji_child/huaixiaoxi.vue'),
    meta: {},
  },
  {
    path: '/tab_keji_child/yuanchuang',
    component: () => import(/* webpackChunkName: "tab_keji_child_yuanchuang" */ 'pages/webview/tab_keji_child/yuanchuang.vue'),
    meta: {},
  },
  {
    path: '/tab_keji_child/shendu',
    component: () => import(/* webpackChunkName: "tab_keji_child_shendu" */ 'pages/webview/tab_keji_child/shendu.vue'),
    meta: {},
  },
  /* app */
  { path: '/app/:tab', component: () => import(/* webpackChunkName: "App" */ 'pages/app/index.vue') },
  /* fullscreen login */
  { path: '/login', component: () => import(/* webpackChunkName: "login" */ 'pages/common/login/index.vue') },
  /* mine 的子页面 */
  {
    path: '/mine_child_page/profile',
    component: () => import(/* webpackChunkName: "mine_child_page_profile" */ 'pages/mine_child_page/profile/index.vue'),
    meta: {},
  },
  {
    path: '/mine_child_page/level',
    component: () => import(/* webpackChunkName: "mine_child_page_level" */ 'pages/mine_child_page/level/index.vue'),
    meta: {},
  },
  {
    path: '/mine_child_page/medal',
    component: () => import(/* webpackChunkName: "mine_child_page_medal" */ 'pages/mine_child_page/medal/index.vue'),
    meta: {},
  },
  {
    path: '/mine_child_page/messages',
    component: () => import(/* webpackChunkName: "mine_child_page_messages" */ 'pages/mine_child_page/messages/index.vue'),
    meta: {},
  },
  {
    path: '/mine_child_page/follow',
    component: () => import(/* webpackChunkName: "mine_child_page_follow" */ 'pages/mine_child_page/follow/index.vue'),
    meta: {},
  },
  {
    path: '/mine_child_page/fans',
    component: () => import(/* webpackChunkName: "mine_child_page_fans" */ 'pages/mine_child_page/fans/index.vue'),
    meta: {},
  },
  {
    path: '/mine_child_page/favorite',
    component: () => import(/* webpackChunkName: "mine_child_page_favorite" */ 'pages/mine_child_page/favorite/index.vue'),
    meta: {},
  },
  {
    path: '/mine_child_page/push_history',
    component: () => import(/* webpackChunkName: "mine_child_page_push_history" */ 'pages/mine_child_page/push_history/index.vue'),
    meta: {},
  },
  {
    path: '/mine_child_page/quanzi',
    component: () => import(/* webpackChunkName: "mine_child_page_quanzi" */ 'pages/mine_child_page/quanzi/index.vue'),
    meta: {},
  },
  {
    path: '/mine_child_page/quanzi_detail',
    component: () => import(/* webpackChunkName: "mine_child_page_quanzi_detail" */ 'pages/mine_child_page/quanzi_detail/index.vue'),
    meta: {},
  },
  {
    path: '/mine_child_page/quanzi_quanyou',
    component: () => import(/* webpackChunkName: "mine_child_page_quanzi_quanyou" */ 'pages/mine_child_page/quanzi_quanyou/index.vue'),
    meta: {},
  },
  {
    path: '/mine_child_page/zhuizong',
    component: () => import(/* webpackChunkName: "mine_child_page_zhuizong" */ 'pages/mine_child_page/zhuizong/index.vue'),
    meta: {},
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
