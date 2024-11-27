<template>
  <div class="app-home-container">
    <ul class="app-home-tab" ref="app-home-tab">
      <li class="item" v-for="(item, $index) in categories" :key="$index" @click="toggleTabName($index)" :class="{ 'active-tab': $index == activeTabIndex }">
        {{ item }}
      </li>
    </ul>
    <div id="app-home-page" class="app-home-page" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" ref="app-home-page">
      <div class="page page-1 text-center">
        <div id="mescroll" class="mescroll" ref="mescroll">
          <div v-for="n in 50" :key="n" class="q-py-xs">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
        </div>
      </div>
      <div class="page page-2"></div>
      <div class="page page-3"></div>
      <div class="page page-4"></div>
      <div class="page page-5"></div>
      <div class="page page-6"></div>
      <div class="page page-7"></div>
      <div class="page page-8"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
const INITIAL_TAB_INDEX = 0;
const CATEGORIES = ['red', 'blue', 'yellow', 'pink', 'green', 'grey', 'black', 'orange'];
const ACTIVE_TAB_INDEX = 0;
const ACTIVE_TAB_NAME = CATEGORIES[ACTIVE_TAB_INDEX];
@Component({
  name: 'tab_home',
})
export default class extends Vue {
  $refs: any;
  private activeTabIndex = ACTIVE_TAB_INDEX;
  private activeTabName = ACTIVE_TAB_NAME;
  private categories = CATEGORIES;
  private swipeDistanceToScreenPercent = 0;
  private touchCache: any = {};
  private stopMovePage = false;
  private windowInnerHeight = window.innerHeight;
  private mescroll: any;
  private toggleTabName(index: number) {
    this.activeTabName = this.categories[index];
    let offsetWidth = -window.innerWidth * index;
    this.activeTabIndex = index;
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
      this.$refs['app-home-page'].style['transitionDuration'] = 10;
      return;
    }
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
    this.$refs['app-home-page'].style['transitionDuration'] = 10;
  }
  private touchEnd(e: any) {
    let offsetWidth;
    if (this.activeTabIndex === 0) {
      // 第一个只能向左滑动
      if (this.swipeDistanceToScreenPercent < -0.15) {
        let _index = this.activeTabIndex + 1;
        this.activeTabName = this.categories[_index];
        this.activeTabIndex = _index;
        offsetWidth = -window.innerWidth * _index;
      } else {
        offsetWidth = 0;
      }
    } else if (this.activeTabIndex === this.categories.length - 1) {
      // 最后一个只能向右滑动
      if (this.swipeDistanceToScreenPercent > 0.15) {
        let _index = this.activeTabIndex - 1;
        this.activeTabName = this.categories[_index];
        this.activeTabIndex = _index;
        offsetWidth = -window.innerWidth * _index;
      } else {
        offsetWidth = -window.innerWidth * this.activeTabIndex;
      }
    } else {
      if (this.stopMovePage) {
        offsetWidth = -window.innerWidth * this.activeTabIndex;
        this.$refs['app-home-page'].style['transform'] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs['app-home-page'].style['transitionDuration'] = 10;
        return;
      }
      if (this.swipeDistanceToScreenPercent > 0.15) {
        // 向右滑动
        let _index = this.activeTabIndex - 1;
        this.activeTabName = this.categories[_index];
        this.activeTabIndex = _index;

        offsetWidth = -window.innerWidth * _index;
      } else if (this.swipeDistanceToScreenPercent < -0.15) {
        // 向左滑动
        let _index = this.activeTabIndex + 1;
        this.activeTabName = this.categories[_index];
        this.activeTabIndex = _index;
        offsetWidth = -window.innerWidth * _index;
      } else {
        // 不动
        offsetWidth = -window.innerWidth * this.activeTabIndex;
      }
    }

    //这里的transform是针对最开始的位置而言，而不是移动过程中的位置
    this.$refs['app-home-page'].style['transform'] = `translate3d(${offsetWidth}px,0,0)`;
    this.$refs['app-home-page'].style['transitionDuration'] = 10;
    // if (this.activeTabIndex > 3) this.scrollTab();
  }
  private scrollTab() {
    const index = this.activeTabIndex;
    const $appHomeTabChildren = Array.from(this.$refs['app-home-tab'].children);
    const $appHomeTab = this.$refs['app-home-tab'];
    let sum = 0;
    for (let i = 0; i < index; i++) {
      const item: any = $appHomeTabChildren[i];
      sum += item.clientWidth;
    }
    $appHomeTab.scrollLeft = sum;
  }
  private initialTab() {
    this.toggleTabName(INITIAL_TAB_INDEX);
    this.scrollTab();
    this.$refs['app-home-page'].style['height'] = `${this.windowInnerHeight - 100}px`;
    this.$refs['mescroll'].style['height'] = `${this.windowInnerHeight - 100}px`;
    this.mescroll = new window['MeScroll']('mescroll', {
      up: {
        callback: this.upCallback,
      },
      down: {
        callback: this.downCallback,
      },
    });
  }
  private downCallback(data: any) {
    setTimeout(() => {
      this.mescroll.endSuccess(10, true);
      console.log('downCallback');
      console.log(data);
    }, 1000);
  }
  private upCallback(data: any) {
    setTimeout(() => {
      console.log('upCallback');
      console.log(data);
      this.mescroll.endSuccess(10, true);
    }, 1000);
  }
  mounted() {
    this.initialTab();
  }
}
</script>
<style lang="scss" scoped>
.app-home-container {
  .app-home-tab {
    display: flex;
    align-items: middle;
    overflow: auto;
    z-index: 9990;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border-bottom: 1px solid #eee;
    background-color: white;
    &::-webkit-scrollbar {
      display: none;
    }
    .item {
      text-align: center;
      padding: 10px;
      box-sizing: border-box;
      &.active-tab {
        color: #ffff00;
        background-color: #000000;
      }
    }
  }
  .app-home-page {
    width: 100%;
    position: fixed;
    top: 44px;
    height: auto;
    white-space: nowrap;
    .page {
      position: relative;
      vertical-align: top;
      display: inline-block;
      width: 100%;
      height: 100%;
      white-space: normal;
    }
    .page-1 {
      background-color: white;
    }
    .page-2 {
      background-color: blue;
    }
    .page-3 {
      background-color: yellow;
    }
    .page-4 {
      background-color: pink;
    }
    .page-5 {
      background-color: green;
    }
    .page-6 {
      background-color: grey;
    }
    .page-7 {
      background-color: black;
    }
    .page-8 {
      background-color: orange;
    }
  }
}
</style>
