<template>
  <div class="app-home-container">
    <div class="app-home-header">
      <img src="~assets/logo.png" alt="" class="logo" />
      <div class="hot-key-wrap" @click="handlerClickSearch">
        <span class="iconfont icon-sousuo sousuo"></span>
        <ul class="hot-key" ref="hot-key" v-if="verticalScrollrollIndexData.length"></ul>
        <!-- <span class="iconfont icon-saoma saoma" @click.prevent.stop="handleClickSaoma"></span> -->
      </div>
      <div class="hot-list-link-button" @click.stop="handlerClickHotList">
        <span class="iconfont icon-hot text-red"></span>
        热榜
      </div>
    </div>
    <div class="app-home-tab-more" @click.stop="handlerClickMoreCategories">
      <span class="iconfont icon-21"></span>
    </div>
    <ul class="app-home-tab" ref="app-home-tab">
      <li
        class="item"
        v-for="(item, $index) in categories"
        :key="$index"
        @click="toggleTabName($index)"
        :class="{ 'active-tab': $index === activeTabIndex, 'fs-12': item.name.length > 3 }"
      >
        {{ item.name }}
        <span class="bar" :class="{ hide: $index !== activeTabIndex }"></span>
      </li>
    </ul>
    <div id="app-home-page" class="app-home-page" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" ref="app-home-page">
      <div :class="['page', 'page' + (index + 1)]" v-for="(item, index) in categories" :key="index">
        <GuanzhuPage v-if="item.id === 'guanzhu'" ref="GuanzhuPage" />
        <ToutiaoPage v-if="item.id === 'toutiao'" ref="ToutiaoPage" />
        <ShipinPage v-if="item.id === 'shipin'" ref="ShipinPage" />
        <KangyiPage v-if="item.id === 'kangyi'" ref="KangyiPage" />
        <ChengshiPage v-if="item.id === 'chengshi'" ref="ChengshiPage" />
        <CaijingPage v-if="item.id === 'caijing'" ref="CaijingPage" />
        <YulePage v-if="item.id === 'yule'" ref="YulePage" />
        <JunshiPage v-if="item.id === 'junshi'" ref="JunshiPage" />
        <JunpintanPage v-if="item.id === 'junpintan'" ref="JunpintanPage" />
        <StandardPage v-else />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { TabHomeModule } from 'src/store/modules/tab_home';
import { bakCategories, defaultCategories } from 'src/utils/categories';
import StandardPage from 'src/pages/tabs_home_item/standard/index.vue';
import ChengshiPage from 'src/pages/tabs_home_item/chengshi/index.vue';
import ToutiaoPage from 'src/pages/tabs_home_item/toutiao/index.vue';
import GuanzhuPage from 'src/pages/tabs_home_item/guanzhu/index.vue';
import ShipinPage from 'src/pages/tabs_home_item/shipin/index.vue';
import KangyiPage from 'src/pages/tabs_home_item/kangyi/index.vue';
import CaijingPage from 'src/pages/tabs_home_item/caijing/index.vue';
import YulePage from 'src/pages/tabs_home_item/yule/index.vue';
import JunshiPage from 'src/pages/tabs_home_item/junshi/index.vue';
import JunpintanPage from 'src/pages/tabs_home_item/junpintan/index.vue';
import { AppModule } from 'src/store/modules/app';
import {
  get_user_bak_categories,
  get_user_current_categories,
  get_user_current_region,
  set_user_bak_categories,
  set_user_current_categories,
  set_user_current_region,
} from 'src/utils/db';
import { cloneDeep } from 'lodash';
import { TabHomeChengshiModule } from 'src/store/modules/tab_home_chengshi';
import { tabPageClassNameList, tabPageRefNameList } from './container_arr';
@Component({
  name: 'tab_home',
  components: {
    StandardPage,
    ToutiaoPage,
    ShipinPage,
    GuanzhuPage,
    KangyiPage,
    ChengshiPage,
    CaijingPage,
    YulePage,
    JunshiPage,
    JunpintanPage,
  },
})
export default class extends Vue {
  $refs: any;
  get activeTabIndex() {
    return TabHomeModule.activeTabIndex;
  }
  get activeTabName() {
    return TabHomeModule.activeTabName;
  }
  get categories(): any {
    const _defaultCategories = cloneDeep(defaultCategories);
    for (let item of _defaultCategories) {
      if (item.id === 'chengshi') {
        const currentRegion: any = TabHomeChengshiModule.currentRegion;
        item['name'] = currentRegion;
      }
    }
    return get_user_current_categories() ? cloneDeep(get_user_current_categories()) : cloneDeep(_defaultCategories);
  }
  get bak_categories(): any {
    const _bakCategories = cloneDeep(bakCategories);
    for (let item of _bakCategories) {
      if (item.id === 'chengshi') {
        const currentRegion: any = TabHomeChengshiModule.currentRegion;
        item['name'] = currentRegion;
      }
    }
    return get_user_bak_categories() ? cloneDeep(get_user_bak_categories()) : cloneDeep(_bakCategories);
  }
  get INITIAL_TAB_INDEX() {
    return TabHomeModule.INITIAL_TAB_INDEX;
  }
  @Watch('$route')
  onchange(to: any, from: any) {
    if (this.$route.path === '/app/0') {
      if (from.query.reload === 'true') {
        location.reload();
      } else {
        for (let i = 0; i < tabPageClassNameList.length; i++) {
          const _class: any = tabPageClassNameList[i];
          const _dom: any = document.querySelector('.' + _class);
          const _ref: any = tabPageRefNameList[i];
          const scrollTop: number = this.$refs[_ref][0].containerPositionY;
          if (scrollTop !== 0) {
            _dom.scrollTop = scrollTop;
          }
        }
      }
    }
  }
  created() {
    this._searchHotwordSroll();
  }
  mounted() {
    const loadedArr = [];
    for (let item of this.categories) {
      const temp = cloneDeep(item);
      temp.loaded = false;
      loadedArr.push(temp);
    }
    TabHomeModule.SET_activeTabIndex_loaded(loadedArr);
    this._initialTab();
  }
  beforeDestroy() {
    clearInterval(this.verticalScrollIntervalIds[0]);
    clearInterval(this.verticalScrollIntervalIds[1]);
  }
  private swipeDistanceToScreenPercent = 0;
  private touchCache: any = {};
  private stopMovePage = false;
  private windowInnerHeight = window.innerHeight;
  /*跑马灯 */
  private verticalScrollrollIndexData: any = [];
  private verticalScrollrollIndex = 0; //当前滚动的索引
  private verticalScrollIntervalIds: any[] = [];
  private verticalScrollHeight = 34;
  /*左右滑动切换页面 */
  private toggleTabName(index: number) {
    TabHomeModule.SET_activeTabName(this.categories[index].name);
    let offsetWidth = -window.innerWidth * index;
    TabHomeModule.SET_activeTabIndex(index);
    //这里的transform是针对最开始的位置而言，而不是移动过程中的位置
    this.$refs['app-home-page'].style['transform'] = `translate3d(${offsetWidth}px,0,0)`;
  }
  private touchStart(e: any) {
    const touch = e.touches[0];
    this.touchCache.startX = touch.pageX;
    this.touchCache.startY = touch.pageY;
  }
  private touchMove(e: any) {
    const touch = e.touches[0];
    //横向和纵向偏离位置
    const deltaX = touch.pageX - this.touchCache.startX;
    const deltaY = touch.pageY - this.touchCache.startY;
    let left = 0;
    let offsetWidth = 0;
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      this.stopMovePage = true;
      offsetWidth = -window.innerWidth * this.activeTabIndex;
      //动画中滑块的移动
      this.$refs['app-home-page'].style['transform'] = `translate3d(${offsetWidth}px,0,0)`;
      //设置动画时间
      this.$refs['app-home-page'].style['transitionDuration'] = 1000;
      return;
    }
    AppModule.SET_STICKY_NAVIGATION(true);
    this.stopMovePage = false;
    if (this.activeTabIndex === 0) {
      // 第一个
      left = -window.innerWidth * this.activeTabIndex;
      offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
    } else if (this.activeTabIndex === this.categories.length - 1) {
      // 最后一个
      left = -window.innerWidth * this.activeTabIndex;
      offsetWidth = Math.min(-window.innerWidth, Math.max(-window.innerWidth * this.activeTabIndex, left + deltaX));
    } else {
      // 中间的
      left = -window.innerWidth * this.activeTabIndex;
      if (deltaX > 0) {
        //判断动作 是左滑还是右滑
        offsetWidth = Math.min(0, Math.max(-window.innerWidth * this.activeTabIndex, left + deltaX));
      } else {
        offsetWidth = Math.min(-window.innerWidth, Math.max(-window.innerWidth * (this.activeTabIndex + 1), left + deltaX));
      }
    }
    //记录滑动的距离占屏幕宽度的百分比，如果滑动太少则不切换
    this.swipeDistanceToScreenPercent = deltaX / window.innerWidth;
    //动画中滑块的移动
    this.$refs['app-home-page'].style['transform'] = `translate3d(${offsetWidth}px,0,0)`;
    //设置动画时间
    this.$refs['app-home-page'].style['transitionDuration'] = 1000;
  }
  private touchEnd(e: any) {
    let offsetWidth;
    if (this.activeTabIndex === 0) {
      // 第一个只能向左滑动
      if (this.swipeDistanceToScreenPercent < -0.15) {
        let _index = this.activeTabIndex + 1;
        TabHomeModule.SET_activeTabName(this.categories[_index].name);
        TabHomeModule.SET_activeTabIndex(_index);
        offsetWidth = -window.innerWidth * _index;
      } else {
        offsetWidth = 0;
      }
    } else if (this.activeTabIndex === this.categories.length - 1) {
      // 最后一个只能向右滑动
      if (this.swipeDistanceToScreenPercent > 0.15) {
        let _index = this.activeTabIndex - 1;
        // this.activeTabName = this.categories[_index].name;
        // this.activeTabIndex = _index;
        TabHomeModule.SET_activeTabName(this.categories[_index].name);
        TabHomeModule.SET_activeTabIndex(_index);
        offsetWidth = -window.innerWidth * _index;
      } else {
        offsetWidth = -window.innerWidth * this.activeTabIndex;
      }
    } else {
      if (this.stopMovePage) {
        offsetWidth = -window.innerWidth * this.activeTabIndex;
        this.$refs['app-home-page'].style['transform'] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs['app-home-page'].style['transitionDuration'] = 1000;
        return;
      }
      if (this.swipeDistanceToScreenPercent > 0.15) {
        // 向右滑动
        let _index = this.activeTabIndex - 1;
        TabHomeModule.SET_activeTabName(this.categories[_index].name);
        TabHomeModule.SET_activeTabIndex(_index);
        offsetWidth = -window.innerWidth * _index;
      } else if (this.swipeDistanceToScreenPercent < -0.15) {
        // 向左滑动
        let _index = this.activeTabIndex + 1;
        TabHomeModule.SET_activeTabName(this.categories[_index].name);
        TabHomeModule.SET_activeTabIndex(_index);
        offsetWidth = -window.innerWidth * _index;
      } else {
        // 不动
        offsetWidth = -window.innerWidth * this.activeTabIndex;
      }
    }
    //这里的transform是针对最开始的位置而言，而不是移动过程中的位置
    this.$refs['app-home-page'].style['transform'] = `translate3d(${offsetWidth}px,0,0)`;
    this.$refs['app-home-page'].style['transitionDuration'] = 1000;
    this._scrollTab();
  }
  private _scrollTab() {
    const index = this.activeTabIndex;
    const $appHomeTabChildren = Array.from(this.$refs['app-home-tab'].children);
    const $appHomeTab = this.$refs['app-home-tab'];
    let sum = 0;
    for (var i = 0; i < index; i++) {
      const item: any = $appHomeTabChildren[i];
      sum += item.clientWidth;
    }
    if (this.activeTabIndex > 4) {
      $appHomeTab.scrollLeft = sum;
    } else {
      $appHomeTab.scrollLeft = 0;
    }
  }
  /*event*/
  private handlerClickMoreCategories() {
    this.$router.push('/tab_home_more_categories?reload=true');
  }
  private handlerClickHotList() {
    this.$router.push('/tab_home_hot/0');
  }
  private handlerClickSearch() {
    this.$router.push('/tab_home_search');
  }
  /*跑马灯 */
  private _verticalScrollAddItem() {
    const $hotKey = this.$refs['hot-key'];
    var content = this.verticalScrollrollIndexData[this.verticalScrollrollIndex];
    if ($hotKey.childNodes.length <= 1) {
      var div = document.createElement('li');
      div.innerHTML = content;
      $hotKey.appendChild(div);
    } else {
      $hotKey.childNodes[0].innerHTML = content;
      $hotKey.appendChild($hotKey.childNodes[0]);
      $hotKey.scrollTop = 0;
    }
    this.verticalScrollrollIndex++;
    this.verticalScrollrollIndex = this.verticalScrollrollIndex < this.verticalScrollrollIndexData.length ? this.verticalScrollrollIndex : 0;
    if ($hotKey.childNodes.length > 1) {
      clearInterval(this.verticalScrollIntervalIds[1]);
      this.verticalScrollIntervalIds[1] = setInterval(this._setVerticalScroll, 20);
    }
  }
  private _setVerticalScroll() {
    this.$refs['hot-key'].scrollTop++;
    if (this.$refs['hot-key'].scrollTop >= this.verticalScrollHeight) clearInterval(this.verticalScrollIntervalIds[1]);
  }
  private handleClickSaoma() {}
  private onScan() {}
  /*初始化数据 */
  private _initialTab() {
    this.toggleTabName(this.INITIAL_TAB_INDEX);
    this._scrollTab();
    this.$refs['app-home-page'].style['height'] = this.windowInnerHeight - AppModule.bottomNavigationAndHomeHeaderHeight + 'px';
    if (!get_user_current_categories()) {
      set_user_current_categories(this.categories);
    }
    if (!get_user_bak_categories()) {
      set_user_bak_categories(this.bak_categories);
    }
    if (!get_user_current_region()) {
      set_user_current_region('西安');
    }
  }
  /*http */
  private async _searchHotwordSroll() {
    const result: any = await TabHomeModule.searchHotwordSroll({});
    const arr = [];
    for (let item of result) {
      arr.push(item.item);
    }
    this.verticalScrollrollIndexData = arr;
    this.$nextTick(() => {
      this.$refs['hot-key'].style.height = this.verticalScrollHeight + 'px';
      this._verticalScrollAddItem();
      this.verticalScrollIntervalIds[0] = setInterval(this._verticalScrollAddItem, 2000);
    });
  }
}
</script>
<style lang="scss">
.app-home-container {
  .app-home-header {
    .hot-key {
      li {
        width: 100%;
        height: 100%;
        text-align: left;
        font-size: 14px;
        line-height: 34px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import './home.scss';
</style>