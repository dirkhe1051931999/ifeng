<template>
  <div class="app-home-container">
    <div class="app-home-header">
      <img src="~assets/logo.png" alt="" class="logo" />
      <div class="hot-key-wrap" @click="handlerClickSearch">
        <span class="iconfont icon-sousuo sousuo"></span>
        <ul class="hot-key" ref="hot-key" v-if="verticalScrollrollIndexData.length"></ul>
      </div>
      <div class="hot-list-link-button" @click.stop="handlerClickHotList">
        <span class="iconfont icon-hot text-red"></span>
        热榜
      </div>
    </div>
    <ul class="app-home-tab" ref="app-home-tab" v-scroll>
      <div class="more" @click.stop="handlerClickMoreCategories">
        <span class="iconfont icon-21"></span>
      </div>
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
        <GuanzhuPage v-if="item.id === 'guanzhu'" />
        <ToutiaoPage v-if="item.id === 'toutiao'" />
        <StandardPage v-else />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TabHomeModule } from 'src/store/modules/tab_home';
import { defaultCategories } from 'src/utils/categories';
import StandardPage from 'src/pages/tabs_home_item/standard/index.vue';
import ToutiaoPage from 'src/pages/tabs_home_item/toutiao/index.vue';
import GuanzhuPage from 'src/pages/tabs_home_item/guanzhu/index.vue';
import { AppModule } from 'src/store/modules/app';
import { get_user_current_categories } from 'src/utils/db';
import { cloneDeep } from 'lodash';

@Component({
  name: 'tab_home',
  components: {
    StandardPage,
    ToutiaoPage,
    GuanzhuPage,
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
    return get_user_current_categories() ? cloneDeep(get_user_current_categories()) : cloneDeep(defaultCategories);
  }
  get INITIAL_TAB_INDEX() {
    return TabHomeModule.INITIAL_TAB_INDEX;
  }
  created() {
    this._searchHotwordSroll();
  }
  mounted() {
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
    this.$router.push('/more_categories');
  }
  private handlerClickHotList() {
    TabHomeModule.SET_showSlidePage({ status: true, name: 'hot', index: 0 });
  }
  private handlerClickSearch() {
    TabHomeModule.SET_showSlidePage({ status: true, name: 'search' });
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
  /*初始化数据 */
  private _initialTab() {
    this.toggleTabName(this.INITIAL_TAB_INDEX);
    this._scrollTab();
    this.$refs['app-home-page'].style['height'] = this.windowInnerHeight - AppModule.bottomNavigationAndHomeHeaderHeight + 'px';
  }

  /*网络请求 */
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
.app-home-container {
  .app-home-header {
    background: $white;
    z-index: 5000;
    height: 50px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    transition: top 0.2s;
    box-sizing: border-box;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
      width: 32px;
      height: 32px;
    }
    .hot-key-wrap {
      width: 60%;
      position: relative;
      .sousuo {
        font-size: 20px;
        position: absolute;
        color: #333333;
        top: 50%;
        transform: translateY(-50%);
        left: 16px;
      }
      .hot-key {
        width: 100%;
        height: 34px;
        line-height: 34px;
        border-radius: 34px;
        background: #eee;
        overflow: hidden;
        color: #333333;
        padding-left: 42px;
        padding-right: 16px;
      }
    }

    .hot-list-link-button {
      border-radius: 34px;
      background: #eee;
      font-size: 14px;
      text-align: right;
      box-sizing: border-box;
      height: 34px;
      line-height: 34px;
      text-align: center;
      padding: 0 12px;
    }
  }
  .app-home-tab {
    -webkit-overflow-scrolling: touch;
    overflow: auto;
    display: flex;
    align-items: center;
    z-index: 5000;
    position: fixed;
    top: 50px;
    left: 0;
    width: 90%;
    height: 40px;
    min-height: 40px;
    background-color: white;
    font-size: 16px;
    transition: top 0.2s;
    box-sizing: border-box;
    .more {
      background: $white;
      position: fixed;
      right: 0;
      text-align: center;
      top: 50px;
      width: 10%;
      height: 40px;
      line-height: 40px;
      z-index: 9999;
      span {
        font-size: 22px;
      }
    }
    &::-webkit-scrollbar {
      display: none;
    }
    .item {
      text-align: center;
      min-width: 60px;
      position: relative;
      color: $black;
      transition: all 0.2s;
      &.active-tab {
        color: $red;
      }
      .bar {
        transition: all 0.2s;
        display: inline-block;
        width: 14px;
        height: 4px;
        background-image: linear-gradient(#f95859, $red);
        background-blend-mode: normal, normal, normal;
        box-shadow: 0px 6px 20px 0px rgba(249, 88, 89, 0.3);
        border-radius: 4px;
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .app-home-page {
    width: 100%;
    position: fixed;
    top: 90px;
    height: auto;
    white-space: nowrap;
    .page {
      position: relative;
      vertical-align: top;
      display: inline-block;
      width: 100%;
      height: 100%;
      white-space: normal;
      background-color: #f7f7f7;
    }
  }
}
</style>