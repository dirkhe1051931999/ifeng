// import '@/utils/permission';
// vue page stack

import router from 'src/router/index';
import vueg from 'vueg';
const options = {
  duration: '0.3', //转场动画时长，默认为0.3，单位秒
  firstEntryDisable: true, //值为true时禁用首次进入应用时的渐现动画，默认为false
  firstEntryDuration: '.6', //首次进入应用时的渐现动画时长，默认为.6
  forwardAnim: 'fedeInLeft', //前进动画，默认为fadeInRight
  backAnim: 'fadeInRight', //后退动画，默认为fedeInLeft
  sameDepthDisable: false, //url深度相同时禁用动画，默认为false
  tabs: [
    {
      name: 'home',
    },
    {
      name: 'my',
    },
  ], //默认为[]，'name'对应路由的name,以实现类似app中点击tab页面水平转场效果，如tabs[1]到tabs[0]，会使用backAnim动画，tabs[1]到tabs[2]，会使用forwardAnim动画
  tabsDisable: false, //值为true时，tabs间的转场没有动画，默认为false
  shadow: true, //值为false，转场时没有阴影的层次效果
  disable: false, //禁用转场动画，默认为false，嵌套路由默认为true
};
Vue.use(vueg, router, options);
import VuePageStack from 'vue-page-stack';
Vue.use(VuePageStack, { router });

// mobile dom事件
import jeftDirective from 'jeft-vue-directive';
Vue.use(jeftDirective);
// 指令过滤器
import * as directives from '@/directives/';
import * as filters from '@/filters';
import Vue, { DirectiveOptions } from 'vue';
// vue lazyload
import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload);
// or with options
const loadimage = require('../assets/nwes-loading-placeholder.png');
const errorimage = require('../assets/nwes-loading-placeholder.png');
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: errorimage,
  loading: loadimage,
  attempt: 1,
});
import 'vant/lib/index.css';
import {
  Image as VanImage,
  Lazyload,
  Popover as VanPopover,
  Collapse as VanCollapse,
  CollapseItem as VanCollapseItem,
  Swipe as VanSwipe,
  SwipeItem as VanSwipeItem,
  PullRefresh as VanPullRefresh,
  ImagePreview,
  ShareSheet as VanShareSheet,
  IndexBar as VanIndexBar,
  IndexAnchor as VanIndexAnchor,
  Empty as VanEmpty,
  NoticeBar as VanNoticeBar,
  Tabbar as VanTabbar,
  TabbarItem as VanTabbarItem,
} from 'vant';
Vue.use(VanPopover);
Vue.use(VanImage);
Vue.use(Lazyload);
Vue.use(VanCollapse);
Vue.use(VanCollapseItem);
Vue.use(VanSwipe);
Vue.use(VanSwipeItem);
Vue.use(VanPullRefresh);
Vue.use(ImagePreview);
Vue.use(VanShareSheet);
Vue.use(VanIndexBar);
Vue.use(VanIndexAnchor);
Vue.use(VanEmpty);
Vue.use(VanNoticeBar);
Vue.use(VanTabbar);
Vue.use(VanTabbarItem);

// 注册全局指令
Object.keys(directives).forEach((key) => {
  Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key]);
});

// 注册全局过滤器功能
Object.keys(filters).forEach((key) => {
  Vue.filter(key, (filters as { [key: string]: Function })[key]);
});
