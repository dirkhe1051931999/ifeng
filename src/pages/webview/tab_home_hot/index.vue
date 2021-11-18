<template>
  <div class="tabs-slide-page-hot-container" ref="tabs-slide-page-hot-container">
    <div class="header">
      <span class="iconfont icon-youjiantou1 back" @click="handlerClickBack"></span>
      <img src="~assets/hot-page-banner.png" alt="" class="banner" />
      <img src="~assets/hot-page-banner-text.png" alt="" class="banner-text" />
      <span class="iconfont icon-fenxiang3 share" @click="handlerClickShare"></span>
    </div>
    <ul class="tabs">
      <li v-for="(item, index) in tabs" :key="index" @click="handlerClickTab(index)">
        <span :class="[index === activeIndex ? 'active' : '']">{{ item }}</span>
      </li>
    </ul>
    <div class="tabs-slide-page-hot-wrapper" ref="tabs-slide-page-hot-wrapper">
      <!-- 热点 -->
      <ul v-show="activeIndex === 0" class="spotlist" @scroll="monitorScroll1" ref="spotlist">
        <p class="loading" v-show="!loaded[0]">加载中...</p>
        <li v-for="(news, index) in loadedData1" :key="news.id + String(Math.random())" @click="handlerClickSpotListItem(news)">
          <div class="top">
            <div class="l" v-if="index < 6">
              <q-icon name="looks_one" v-if="index === 0" class="text-red"></q-icon>
              <q-icon name="looks_two" v-if="index === 1" class="text-orange-10"></q-icon>
              <q-icon name="looks_3" v-if="index === 2" class="text-orange-9"></q-icon>
              <q-icon name="looks_4" v-if="index === 3" class="text-yellow-10"></q-icon>
              <q-icon name="looks_5" v-if="index === 4" class="text-yellow-9"></q-icon>
              <q-icon name="looks_6" v-if="index === 5" class="text-yellow-8"></q-icon>
            </div>
            <div class="l" v-else>
              <i class="text-grey bold fs-24">{{ index + 1 }}</i>
            </div>
            <div class="r" v-if="news.hotLabel">
              {{ news.hotLabel.hotGrade }}
              <q-icon name="arrow_downward" v-if="news.hotLabel.hotTrend === '0'" class="text-blue fs-16"></q-icon>
              <q-icon name="arrow_upward" v-if="news.hotLabel.hotTrend === '1'" class="text-red fs-16"></q-icon>
            </div>
          </div>
          <div class="middle" v-if="news.hotLabel">
            <div class="l">
              <span class="label" v-if="news.hotLabel.titleTag">
                {{ news.hotLabel.titleTag }}
              </span>
              <span class="desp">
                {{ news.hotLabel.titleTag ? news.hotLabel.eventKeyword : news.hotLabel.desp }}
              </span>
            </div>
            <div class="r">
              <span>{{ news.hotLabel.totalDoc }}</span>
              <q-icon name="arrow_forward_ios"></q-icon>
            </div>
          </div>
          <div class="bottom">
            <div class="l">
              <div class="t">{{ news.title }}</div>
              <div class="b">
                <span class="source" v-if="news.source">{{ news.source }}</span>
                <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
                <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
              </div>
            </div>
            <div class="r">
              <van-image class="thumbnail" :src="news.thumbnail" lazy-load radius="6" />
            </div>
          </div>
        </li>
      </ul>
      <!-- 必刷 -->
      <ul v-show="activeIndex === 1" class="mustsee" @scroll="monitorScroll2" ref="mustsee">
        <p class="loading" v-show="!loaded[1]">加载中...</p>
        <li v-for="news in loadedData2" :key="news.id + String(Math.random())">
          <div class="top">
            <div class="icon">
              <q-icon name="auto_awesome" class="text-white"></q-icon>
              必刷
            </div>
            {{ news.intro }}
          </div>
          <div class="bottom">
            <div class="l">
              <van-image class="thumbnail" :src="news.thumbnail" lazy-load radius="6" />
              <div class="info">
                <q-icon name="ondemand_video" class="fs-20 icon"></q-icon>
                <p class="video-total-time" v-if="news.phvideo.length - news.phvideo.preview - news.phvideo.previewlength === news.phvideo.length">
                  {{ news.phvideo.length | getVideoTotalTime }}
                </p>
                <p class="video-total-time" v-else>
                  {{ (news.phvideo.length - news.phvideo.preview - news.phvideo.previewlength) | getVideoTotalTime }}
                </p>
              </div>
            </div>
            <div class="r">
              <div class="t text-dot-3">{{ news.title }}</div>
              <div class="b">{{ news.source }}</div>
            </div>
          </div>
        </li>
      </ul>
      <!-- 评论 -->
      <ul v-show="activeIndex === 2" class="comment" @scroll="monitorScroll3" ref="comment">
        <p class="loading" v-show="!loaded[2]">加载中...</p>
        <li v-for="(news, index) in loadedData3" :key="news.id + String(Math.random())">
          <div class="top">
            <div class="l" v-if="index < 3">
              <q-icon name="filter_1" v-if="index === 0" class="text-red fs-22"></q-icon>
              <q-icon name="filter_2" v-if="index === 1" class="text-orange-8 fs-22"></q-icon>
              <q-icon name="filter_3" v-if="index === 2" class="text-orange-6 fs-22"></q-icon>
            </div>
            <div class="l" v-else>
              <span class="index"> {{ index + 1 }}</span>
            </div>
            <div class="r">
              <span class="bold">{{ news.source }}：</span>
              <span>{{ news.intro }}</span>
            </div>
          </div>
          <div class="bottom">
            <van-image class="thumbnail" :src="news.thumbnail" lazy-load radius="6" />
            <div class="r">
              {{ news.title }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { TabHomeModule } from 'src/store/modules/tab_home';
import { AppModule } from 'src/store/modules/app';
import { handlerQuasarShare } from 'src/utils/share';

@Component({
  name: 'tabs_slide_page_hot',
})
export default class extends Vue {
  $refs: any;
  @Watch('$route')
  onchange(to: any, from: any) {
    if (this.$route.path.indexOf('/tab_home_hot') !== -1) {
      this.activeIndex = this.containerIndex;
      if (this.$refs['spotlist']) {
        this.$refs['spotlist'].scrollTop = this.containerPositionY1;
      }
      if (this.$refs['themustseeme']) {
        this.$refs['mustsee'].scrollTop = this.containerPositionY2;
      }
      if (this.$refs['comment']) {
        this.$refs['comment'].scrollTop = this.containerPositionY3;
      }
    }
  }
  get shareOptions() {
    return AppModule.shareOptions;
  }
  get shareInfo() {
    return AppModule.shareInfo;
  }
  async created() {
    this._getHotNewsRank();
  }
  async activated() {
    if (!this.clickItem) {
      this.activeIndex = Number(this.$route.params.index);
      this._clickTabGetData();
    }
  }
  private tabs = ['热点', '必刷', '评论'];
  private containerPositionY1 = 0;
  private containerPositionY2 = 0;
  private containerPositionY3 = 0;
  private containerIndex = 0;
  private clickItem = false;
  private loaded = [false, false, false];
  private loadedData1 = [];
  private loadedData2 = [];
  private loadedData3 = [];
  private activeIndex: any = 0;
  private activeName = this.tabs[this.activeIndex];
  // event
  private async handlerClickTab(index: number) {
    this.activeIndex = index;
    this._clickTabGetData();
  }
  private handlerClickBack() {
    this.$router.back();
  }
  private handlerClickShare() {
    handlerQuasarShare('sec', {});
  }
  private handlerClickSpotListItem(news: any) {
    if (news.hotLabel && news.hotLabel.link) {
      this.clickItem = true;
      this.$router.push(
        `/news_topic?topicid=${
          news.hotLabel.link.staticId.split('_')[2] ? news.hotLabel.link.staticId.split('_')[2] : news.hotLabel.link.staticId.split('_')[1]
        }`,
      );
    }
  }
  private handlerClickThemeItem(news: any) {
    this.clickItem = true;
    this.$router.push(`/news_theme?groupid=${news.id}`);
  }
  private async monitorScroll1(e: any) {
    const scrollTop = this.$refs['spotlist'].scrollTop;
    this.containerPositionY1 = scrollTop;
    this.containerIndex = 0;
  }
  private async monitorScroll2(e: any) {
    const scrollTop = this.$refs['mustsee'].scrollTop;
    this.containerPositionY2 = scrollTop;
    this.containerIndex = 1;
  }
  private async monitorScroll3(e: any) {
    const scrollTop = this.$refs['comment'].scrollTop;
    this.containerPositionY3 = scrollTop;
    this.containerIndex = 2;
  }
  // http
  private async _clickTabGetData() {
    try {
      switch (this.activeIndex) {
        case 0:
          if (this.loaded[this.activeIndex]) break;
          let spotlist = await TabHomeModule.getHotspotlistv2({});
          let list1 = spotlist.data.list;
          list1 = list1.filter((d: any) => d.type !== 'advert');
          this.loadedData1 = list1;
          break;
        case 1:
          if (this.loaded[this.activeIndex]) break;
          const mustsee = await TabHomeModule.getMustseelist({});
          let list2 = mustsee.data.list;
          list2 = list2.filter((d: any) => d.type !== 'advert');
          this.loadedData2 = list2;
          break;
        case 2:
          if (this.loaded[this.activeIndex]) break;
          const comment = await TabHomeModule.getCommentlist({});
          let list3 = comment.data.list;
          list3 = list3.filter((d: any) => d.type !== 'advert');
          this.loadedData3 = list3;
          break;
        default:
          break;
      }
    } catch (error) {}
    this.$nextTick(() => {
      this.$refs['tabs-slide-page-hot-wrapper'].style.height = window.innerHeight - 158 + 'px';
      this.$set(this.loaded, this.activeIndex, true);
    });
  }
  private async _getHotNewsRank() {
    const { data } = await TabHomeModule.getHotNewsRank({});
    const { shareInfo } = data;
    AppModule.SET_ShareInfo(shareInfo);
  }
}
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>