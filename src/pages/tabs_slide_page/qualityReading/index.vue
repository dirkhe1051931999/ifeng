<template>
  <div class="tabs-slide-page-qualityReading-container">
    <van-share-sheet v-model="showShare" :options="shareOptions" @select="handlerClickSelctItem" />
    <div class="header">
      <span class="iconfont icon-youjiantou1 back" @click="handlerClickBack"></span>
      <img src="~assets/qualityReading-banner.png" alt="" class="banner" />
      <img src="~assets/qualityReading-banner-text.png" alt="" class="banner-text" />
      <img src="~assets/qualityReading-banner-shadow.png" alt="" class="banner-shadow" />
      <span class="iconfont icon-fenxiang3 share" @click="handlerClickShare"></span>
    </div>
    <div class="tabs-slide-page-qualityReading-wrapper" ref="tabs-slide-page-qualityReading-wrapper">
      <div class="scroll-content">
        <ul>
          <li v-for="news in newsList" :key="news.id + String(Math.random())">
            <div class="top">
              <van-image class="thumbnail" :src="news.thumbnail" lazy-load radius="6" :key="news.thumbnail" height="180" width="100%" />
            </div>
            <div class="bottom">
              <div class="t text-dot-2">{{ news.title }}</div>
              <div class="b text-dot-3">{{ news.intro }}</div>
            </div>
          </li>
        </ul>
        <div class="pullup-tips" v-show="isPullUpLoad">
          <div class="after-trigger">
            <span class="pullup-txt">{{ loadingTip }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BScroll from '@better-scroll/core';
import Pullup from '@better-scroll/pull-up';
BScroll.use(Pullup);
import { TabHomeModule } from 'src/store/modules/tab_home';
import { TabHomeToutiaoModule } from 'src/store/modules/tab_home_toutiao';
import { copy } from 'iclipboard';
import { AppModule } from 'src/store/modules/app';

@Component({
  name: 'tabs_slide_page_qualityReading',
})
export default class extends Vue {
  $refs: any;
  get shareOptions() {
    return AppModule.shareOptions;
  }
  get shareInfo() {
    return AppModule.shareInfo;
  }
  async created() {}
  async mounted() {
    await this._getQualityReadingList();
    const $scroll: any = this.$refs['tabs-slide-page-qualityReading-wrapper'];
    $scroll.style['height'] = window.innerHeight - 158 + 'px';
    this.bscroll = new BScroll('.tabs-slide-page-qualityReading-wrapper', { pullUpLoad: true });
    this.bscroll.on('pullingUp', this._pullingUpHandler);
  }
  private bscroll: any;
  private pagination = {
    page: 1,
    pageSize: 10,
  };
  private isPullUpLoad = false;
  private showShare = false;
  private newsList = [];
  private loadingTip = '加载中...';

  // event
  private handlerClickBack() {
    TabHomeModule.SET_showSlidePage({ status: false, name: '' });
  }
  private handlerClickShare() {
    this.showShare = true;
  }
  private async handlerClickSelctItem(option: any) {
    await AppModule.handlerClickShareItem(option);
    this.showShare = false;
  }
  // http
  private async _getQualityReadingList() {
    const { data } = await TabHomeToutiaoModule.getQualityReadingList({ page: this.pagination.page });
    const { shareInfo, list } = data;
    this.newsList = list;
    AppModule.SET_ShareInfo(shareInfo);
    return Promise.resolve(true);
  }
  private async _pullingUpHandler() {
    try {
      if (!this.isPullUpLoad) {
        this.pagination.page++;
        this.isPullUpLoad = true;
        const { data } = await TabHomeToutiaoModule.getQualityReadingList({ page: this.pagination.page });
        const { list } = data;
        this.newsList = this.newsList.concat(list);
        this.bscroll.finishPullUp();
        this.bscroll.refresh();
        this.isPullUpLoad = false;
      }
    } catch (error) {
      this.bscroll.finishPullUp();
      this.bscroll.refresh();
      this.loadingTip = '已无更多数据';
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs-slide-page-qualityReading-container {
  .header {
    width: 100%;
    height: 291px;
    position: relative;
    .back {
      color: $white;
      position: absolute;
      z-index: 100;
      top: 12px;
      left: 12px;
      font-size: 24px;
    }
    .banner {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .banner-text {
      position: absolute;
      width: 272px;
      height: 162px;
      left: 55%;
      top: 35%;
      transform: translate(-50%, -50%);
      z-index: 100;
    }
    .banner-shadow {
      position: absolute;
      width: 100%;
      height: 135px;
      z-index: 100;
      bottom: 0;
      left: 0;
    }
    .share {
      font-size: 24px;
      transform-origin: top center;
      transform: scale(0.8);
      color: $white;
      position: absolute;
      z-index: 100;
      top: 17px;
      right: 12px;
    }
  }
  .tabs-slide-page-qualityReading-wrapper {
    background: #f7f7f7;
    position: fixed;
    top: 158px;
    left: 0;
    width: 92%;
    box-sizing: border-box;
    margin: 0 4%;
    overflow: hidden;
    z-index: 300;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    .scroll-content {
      li {
        box-shadow: 0 0 8px 0 rgb(33 34 35 / 10%);
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 32px;
        .bottom {
          padding: 18px 8px 16px;
          .t {
            font-size: 18px;
            color: #212223;
          }
          .b {
            font-size: 14px;
            color: #9e9e9e;
            margin-top: 5px;
          }
        }
      }
      .pullup-tips {
        font-size: 14px;
        text-align: center;
        color: #9e9e9e;
      }
    }
  }
}
</style>