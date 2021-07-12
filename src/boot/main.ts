// import '@/utils/permission';
// mobile dom事件
import jeftDirective from 'jeft-vue-directive';
Vue.use(jeftDirective);
// 指令过滤器
import * as directives from '@/directives/';
import * as filters from '@/filters';
import Vue, { DirectiveOptions } from 'vue';
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

// 注册全局指令
Object.keys(directives).forEach((key) => {
  Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key]);
});

// 注册全局过滤器功能
Object.keys(filters).forEach((key) => {
  Vue.filter(key, (filters as { [key: string]: Function })[key]);
});
