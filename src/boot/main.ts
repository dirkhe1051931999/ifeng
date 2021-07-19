// import '@/utils/permission';
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

// 注册全局指令
Object.keys(directives).forEach((key) => {
  Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key]);
});

// 注册全局过滤器功能
Object.keys(filters).forEach((key) => {
  Vue.filter(key, (filters as { [key: string]: Function })[key]);
});
