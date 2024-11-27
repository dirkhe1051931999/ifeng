<template>
  <div class="xianggang-container" @scroll="monitorScrollEvent" ref="xianggang-container">
    <van-pull-refresh v-model="isDownRefresh" :success-text="refreshSuccessText" @refresh="onRefresh" :success-duration="1000">
      <!-- 骨架屏 -->
      <div v-if="pageLoading">
        <div class="ph-item" v-for="n in 10" :key="n" style="border: 0; padding: 10px 0 10px; margin: 0">
          <div>
            <div class="ph-row">
              <div class="ph-col-12" style="border-radius: 0; background-color: #eeeeee"></div>
              <div class="ph-col-2" style="border-radius: 0; background-color: #eeeeee"></div>
              <div class="ph-col-10 empty"></div>
              <div class="ph-col-8" style="border-radius: 0; background-color: #eeeeee"></div>
              <div class="ph-col-4 empty"></div>
            </div>
          </div>
          <div class="ph-col-2">
            <div class="ph-avatar" style="border-radius: 0; background-color: #eeeeee"></div>
          </div>
        </div>
      </div>
      <ul class="xianggang-list" v-if="!pageLoading">
        <div class="swiper-container bg-white xianggangSwiperList-container" style="height: 240px" v-if="xianggangSwiperList.length">
          <div class="swiper-wrapper">
            <div class="swiper-slide xianggangSwiperList-slide" v-for="(news, index) in xianggangSwiperList" :key="index" style="width: 100%">
              <p class="title">{{ news.title }}</p>
              <p class="dateDiff">{{ news.updateTime | getDateDiff }}</p>
              <van-image class="thumbnail" :src="news.thumbnail" lazy-load />
            </div>
          </div>
        </div>
        <div class="xianggangGridList" v-if="xianggangGridList.length">
          <li v-for="(item, index) in xianggangGridList" :key="index" @click="handlerClickGridItem(item, index)">
            <img :src="item.thumbnail" alt="" />
            <p class="title">{{ item.title }}</p>
          </li>
        </div>
        <van-notice-bar left-icon="volume-o" :scrollable="false" color="#1989fa" background="#ecf9ff" v-if="fastmessagescrollList.length">
          <van-swipe vertical class="yaowen-notice-swipe" :HKplay="3000" :show-indicators="false">
            <van-swipe-item v-for="(item, index) in fastmessagescrollList" :key="index" class="text-dot-1">{{ item.title }}</van-swipe-item>
          </van-swipe>
        </van-notice-bar>
        <div class="xianggangNewsList" v-if="xianggangNewsList.length">
          <li v-for="news in xianggangNewsList" :key="news.id + Math.random().toString()">
            <!-- topic2 -->
            <div v-if="news.type === 'topic2' && news.newslist" class="have-newList-topic2">
              <van-image class="thumbnail w-full" :src="news.advertmsg.adverPic" lazy-load :height="news.advertmsg.height" />
              <ul>
                <li v-for="(item, index) in news.newslist" :key="index">
                  <div class="top">
                    <div class="left">
                      <p class="title">
                        <span class="text-red title-label" v-if="item.style.recomTag && news.style.recomTag.pos">{{ item.style.recomTag.text }}</span>
                        {{ item.title }}
                      </p>
                    </div>
                    <div class="right">
                      <van-image class="thumbnail" :src="item.thumbnail" lazy-load radius="6" />
                    </div>
                  </div>
                  <div class="bottom">
                    <span v-if="item.style.recomTag && item.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
                    <span v-if="item.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ item.style.recomTag.text }}</span>
                    <span class="source" v-if="item.source">{{ item.source }}</span>
                    <i class="iconfont icon-duanxin" v-if="item.commentsall"></i>
                    <span class="count" v-if="item.commentsall"> {{ item.commentsall }}</span>
                    <i class="iconfont icon-lishi" v-if="item.updateTime"></i>
                    <span class="count" v-if="item.updateTime">{{ item.updateTime | getDateDiff }}</span>
                  </div>
                  <div v-if="item.summary" class="hot-comment">
                    <span class="label">{{ item.summary.tag }}</span>
                    {{ item.summary.desp }}
                  </div>
                </li>
              </ul>
            </div>
            <!-- doc -->
            <div v-if="news.type === 'doc' || (news.type === 'topic2' && !news.newslist)" class="doc">
              <div class="top">
                <div class="left">
                  <p class="title">
                    <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.pos">{{ news.style.recomTag.text }}</span>
                    {{ news.title }}
                  </p>
                </div>
                <div class="right" v-if="news.thumbnail">
                  <van-image class="thumbnail" :src="news.thumbnail" lazy-load radius="6" />
                </div>
              </div>
              <div v-if="news.summary" class="hot-comment">
                <span class="label">{{ news.summary.tag }}</span>
                {{ news.summary.desp }}
              </div>
              <div class="bottom">
                <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
                <span v-if="news.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ news.style.recomTag.text }}</span>
                <span class="source" v-if="news.source">{{ news.source }}</span>
                <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
                <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
                <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
                <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
                <span class="iconfont icon-close1 close">
                  <q-popup-proxy>
                    <q-card class="w-full backreason">
                      <p class="p-t-10 p-b-10 p-l-16 p-r-16 fs-14 text-_6b6a6a">选择原因，为您优化</p>
                      <ul class="p-l-16 p-r-16">
                        <li v-for="(item, index) in news.style.feedbackreason" :key="index" :class="index === 0 ? 'text-red' : ''">
                          <q-icon name="mood_bad" v-if="index === 0" class="fs-20" />
                          {{ item.title }}
                        </li>
                      </ul>
                      <q-expansion-item expand-separator :label="defaultbackreason.title" header-class="fs-14 text-_6b6a6a">
                        <ul class="p-l-16 p-r-16">
                          <li v-for="(item, index) in defaultbackreason.backreason" :key="index">{{ item.title }}</li>
                        </ul>
                      </q-expansion-item>
                    </q-card>
                  </q-popup-proxy>
                </span>
              </div>
            </div>
            <!-- picture -->
            <div v-if="news.type === 'short'" class="short w-full">
              <div class="top flex j-between a-top">
                <div class="left flex j-between a-center">
                  <div class="l" v-if="news.subscribe.logo && news.subscribe.honorImg">
                    <img class="w-32 h-32 relative avatar" :src="news.subscribe.logo" />
                    <img :src="news.subscribe.honorImg" alt="" class="honor" />
                  </div>
                  <div class="l" v-else>
                    <img class="w-32 h-32 relative avatar" src="~assets/default-blogger-avatar.png" />
                  </div>
                  <div class="r">
                    <div class="t">{{ news.subscribe.catename }}</div>
                    <div class="b">{{ news.updateTime | getDateDiff }}</div>
                  </div>
                </div>
                <div class="right">
                  <span class="follow">关注</span>
                  <span class="iconfont icon-close1 close">
                    <q-popup-proxy>
                      <q-card class="w-full backreason">
                        <p class="p-t-10 p-b-10 p-l-16 p-r-16 fs-14 text-_6b6a6a">选择原因，为您优化</p>
                        <ul class="p-l-16 p-r-16">
                          <li v-for="(item, index) in news.style.feedbackreason" :key="index" :class="index === 0 ? 'text-red' : ''">
                            <q-icon name="mood_bad" v-if="index === 0" class="fs-20" />
                            {{ item.title }}
                          </li>
                        </ul>
                        <q-expansion-item expand-separator :label="defaultbackreason.title" header-class="fs-14 text-_6b6a6a">
                          <ul class="p-l-16 p-r-16">
                            <li v-for="(item, index) in defaultbackreason.backreason" :key="index">{{ item.title }}</li>
                          </ul>
                        </q-expansion-item>
                      </q-card>
                    </q-popup-proxy>
                  </span>
                </div>
              </div>
              <div class="intro p-b-10 fs-18" v-if="news.intro">
                <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.pos">{{ news.style.recomTag.text }}</span>
                {{ news.intro }}
              </div>
              <ul class="images" v-if="news.imageList && news.imageList.length">
                <van-image
                  class="thumbnail relative"
                  :style="news.imageList.length === 1 ? 'width: 50%;' : 'width: 32.5%;'"
                  :src="item.url"
                  lazy-load
                  v-for="(item, index) in news.imageList"
                  :key="index"
                  fit="cover"
                  v-show="index < 10"
                  @click="previewImage(news.imageList, index)"
                />
              </ul>
              <div v-if="news.summary" class="hot-comment">
                <span class="label">{{ news.summary.tag }}</span>
                {{ news.summary.desp }}
              </div>
              <div class="no-action-bottom">
                <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
                <span v-if="news.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ news.style.recomTag.text }}</span>
                <span class="source" v-if="news.source">{{ news.source }}</span>
                <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
                <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
                <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
                <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
                <span class="iconfont icon-close1 close">
                  <q-popup-proxy>
                    <q-card class="w-full backreason">
                      <p class="p-t-10 p-b-10 p-l-16 p-r-16 fs-14 text-_6b6a6a">选择原因，为您优化</p>
                      <ul class="p-l-16 p-r-16">
                        <li v-for="(item, index) in news.style.feedbackreason" :key="index" :class="index === 0 ? 'text-red' : ''">
                          <q-icon name="mood_bad" v-if="index === 0" class="fs-20" />
                          {{ item.title }}
                        </li>
                      </ul>
                      <q-expansion-item expand-separator :label="defaultbackreason.title" header-class="fs-14 text-_6b6a6a">
                        <ul class="p-l-16 p-r-16">
                          <li v-for="(item, index) in defaultbackreason.backreason" :key="index">{{ item.title }}</li>
                        </ul>
                      </q-expansion-item>
                    </q-card>
                  </q-popup-proxy>
                </span>
              </div>
            </div>
            <!-- video -->
            <div v-if="news.type === 'phvideo'" class="phvideo w-full">
              <div class="top flex j-between a-top">
                <div class="left flex j-between a-center">
                  <div class="l" v-if="news.subscribe.logo && news.subscribe.honorImg">
                    <img class="w-32 h-32 relative avatar" :src="news.subscribe.logo" />
                    <img :src="news.subscribe.honorImg" alt="" class="honor" />
                  </div>
                  <div class="l" v-else>
                    <img class="w-32 h-32 relative avatar" src="~assets/default-blogger-avatar.png" />
                  </div>
                  <div class="r">
                    <div class="t">{{ news.subscribe.catename }}</div>
                    <div class="b">{{ news.updateTime | getDateDiff }}</div>
                  </div>
                </div>
                <div class="right">
                  <span class="follow">关注</span>
                  <span class="iconfont icon-close1 close">
                    <q-popup-proxy>
                      <q-card class="w-full backreason">
                        <p class="p-t-10 p-b-10 p-l-16 p-r-16 fs-14 text-_6b6a6a">选择原因，为您优化</p>
                        <ul class="p-l-16 p-r-16">
                          <li v-for="(item, index) in news.style.feedbackreason" :key="index" :class="index === 0 ? 'text-red' : ''">
                            <q-icon name="mood_bad" v-if="index === 0" class="fs-20" />
                            {{ item.title }}
                          </li>
                        </ul>
                        <q-expansion-item expand-separator :label="defaultbackreason.title" header-class="fs-14 text-_6b6a6a">
                          <ul class="p-l-16 p-r-16">
                            <li v-for="(item, index) in defaultbackreason.backreason" :key="index">{{ item.title }}</li>
                          </ul>
                        </q-expansion-item>
                      </q-card>
                    </q-popup-proxy>
                  </span>
                </div>
              </div>
              <div class="intro p-b-10 fs-18">
                <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.pos">{{ news.style.recomTag.text }}</span>
                {{ news.intro ? news.intro : news.title }}
              </div>
              <div class="video-placeholder">
                <img v-if="news.seriesTag" src="https://x0.ifengimg.com/cmpp/2021/0401/ced142b6f5d6dc0size6_w144_h60.png" alt="" class="seriesTag" />
                <van-image :src="news.imageList[0].url" alt="" class="placeholder" radius="6" />
                <img src="~assets/play-video-button.png" alt="" class="play-video-button" />
                <p class="video-total-time">
                  {{ news.phvideo.length | getVideoTotalTime }}
                </p>
              </div>
              <div v-if="news.videoSeries" class="videoSeries">
                <q-icon name="video_library"></q-icon>
                {{ news.videoSeries.name }}
              </div>
              <div v-if="news.summary" class="hot-comment">
                <span class="label">{{ news.summary.tag }}</span>
                {{ news.summary.desp }}
              </div>
              <div class="no-action-bottom">
                <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
                <span v-if="news.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ news.style.recomTag.text }}</span>
                <span class="source" v-if="news.source">{{ news.source }}</span>
                <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
                <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
                <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
                <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
              </div>
            </div>
          </li>
        </div>
      </ul>
      <div class="load-more-loading" v-show="load_more_no_data">暂无数据</div>
      <div class="load-more-loading" v-show="load_more_loading" v-if="!pageLoading">
        <q-spinner color="#969799" size="20px" :thickness="2" />
        加载中...
      </div>
    </van-pull-refresh>
  </div>
</template>
<script lang="ts">
import { TabHomeModule } from 'src/store/modules/home';
import { get_user_current_categories } from 'src/utils/db';
import { AppModule } from 'src/store/modules/app';
import { cloneDeep } from 'lodash';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ImagePreview } from 'vant';
import { TabHomeXianggangModule } from '@/store/modules/home_tab/xianggang';
import { TabHomeChengshiModule } from '@/store/modules/home_tab/chengshi';
@Component({
  name: 'home_tab_item_xianggang',
})
export default class extends Vue {
  $refs: any;
  get currentTabId() {
    return 'xianggang';
  }
  get activeTabIndex() {
    return TabHomeModule.activeTabIndex;
  }
  get currentIndex() {
    const categories: any = get_user_current_categories() ? cloneDeep(get_user_current_categories()) : [];
    const cur = categories.find((d: any) => d.id === this.currentTabId);
    const curIndex = categories.findIndex((d: any) => d.id === this.currentTabId);
    return curIndex;
  }
  get defaultbackreason() {
    const result: any = AppModule.config_backreason;
    if (result) return result['defaultbackreason'];
    else return [];
  }
  get currentPageIsLoaded() {
    const loadedCurrentCategoriesData: any = TabHomeModule.loadedCurrentCategoriesData;
    const cur = loadedCurrentCategoriesData.find((d: any) => d.id === this.currentTabId);
    if (cur) {
      return cur.loaded;
    } else {
      return false;
    }
  }
  @Watch('activeTabIndex')
  async watchActiveTabIndex(newVal: number, oldVal: number) {
    if (newVal === this.currentIndex) {
      if (!this.currentPageIsLoaded) {
        this.pageLoading = true;
        this.firstLoadData = true;
        this.xianggangNewsList = [];
        await this._downCallback();
        TabHomeModule.SET_activeTabIndex_single_loaded(this.currentTabId);
        this.firstLoadData = false;
        this.pageLoading = false;
      }
    }
  }
  // 数据
  public containerPositionY = 0;
  private firstLoadData = true;
  private pageLoading = false;
  private xianggangNewsList: any[] = [];
  private xianggangSwiperList: any[] = [];
  private xianggangGridList: any[] = [];
  private fastmessagescrollList = [];
  // 下拉刷新，上拉加载的数据
  private isDownRefresh = false;
  private refreshSuccessText = '';
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private load_more_no_data = '';
  private pagination_params = {
    size: 10,
    num: 1,
  };
  /*event*/
  async onRefresh() {
    this.pagination_params.num = 1;
    this.load_more_no_data = '';
    await this._downCallback();
    this.refreshSuccessText = this.xianggangNewsList.length ? `已为您推荐 ${this.xianggangNewsList.length} 条新内容` : '已更新到最新';
    this.isDownRefresh = false;
  }
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['xianggang-container'].scrollHeight;
    const scrollTop = this.$refs['xianggang-container'].scrollTop;
    this.containerPositionY = scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - AppModule.bottomNavigationAndHomeHeaderHeight >= scrollHeight) {
      if (!this.load_more_loading_lock) {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.pagination_params.num++;
        await this._upCallback();
        this.load_more_loading_lock = false;
      }
    }
  }
  private previewImage(images: any, index: number) {
    const arr = [];
    for (let item of images) {
      arr.push(item.url);
    }
    ImagePreview({
      images: arr,
      startPosition: index,
      closeable: true,
    });
  }
  private handlerClickGridItem(item: any, index: number) {
    console.log(item);
    // switch (item.title) {
    //   case '科技热榜':
    //     this.$router.push('/tab_xianggang_child/rebang');
    //     break;
    //   case '新视界':
    //     this.$router.push('/tab_xianggang_child/xinshijie');
    //     break;
    //   case '凰家评测':
    //     this.$router.push('/tab_xianggang_child/pingce');
    //     break;
    //   case '坏消息':
    //     this.$router.push('/tab_xianggang_child/huaixiaoxi');
    //     break;
    //   case '原创':
    //     this.$router.push('/tab_xianggang_child/yuanchuang');
    //     break;
    //   case '深度':
    //     this.$router.push('/tab_xianggang_child/shendu');
    //     break;
    //   default:
    //     break;
    // }
  }
  /*http*/
  private async _downCallback() {
    let params: any = {
      id: 'GA18',
      ch: 'HK',
      action: 'down',
      pullNum: '1',
      pullTotal: '1',
      dailyOpenNum: '1',
    };
    let form = {
      openNum: 3,
      lastDoc: ',,,',
      pushStatus: 1,
      installTime: 1626232810,
      closeWinType: '',
      closeWinCount: 0,
      closeWinTime: 0,
    };
    let formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }
    try {
      if (this.firstLoadData) {
        params = { id: 'GA18', ch: 'HK', action: 'default', pullTotal: '1', dailyOpenNum: '1' };
      }
      const result = await TabHomeXianggangModule.getXianggangNewsList({ params, formData });
      const arr = [];
      const arr2 = [];
      for (let item of result[0].item) {
        if (item.type !== 'advert') {
          arr.push(item);
        }
      }
      if (!arr.length) {
        this.load_more_no_data = '没有更多数据了';
      }
      this.xianggangNewsList = arr;
      if (result.length === 3) {
        this.$nextTick(() => {
          if (this.firstLoadData) {
            setTimeout(() => {
              new window['Swiper']('.xianggangSwiperList-container', {
                loop: true,
              });
            }, 500);
          }
        });
        this.xianggangSwiperList = result[1].item;
      } else {
        this.xianggangSwiperList = [];
      }
      return Promise.resolve(true);
    } catch (error) {
      console.log(error);
      console.log('err');
    }
  }
  private async _upCallback() {
    let params: any = {
      id: 'GA18',
      ch: 'HK',
      action: 'up',
      pullNum: this.pagination_params.num,
      pullTotal: '1',
      dailyOpenNum: '1',
      timestamp: '2021%2F07%2F14+14%3A49%3A19',
    };
    let form = {
      openNum: 3,
      lastDoc: ',,,',
      pushStatus: 1,
      installTime: 1626232810,
      closeWinType: '',
      closeWinCount: 0,
      closeWinTime: 0,
    };
    let formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }
    try {
      const result = await TabHomeXianggangModule.getXianggangNewsList({ params, formData });
      const arr = [];
      for (let item of result[0].item) {
        if (item.type !== 'advert' && item.type !== 'fastmessagescroll') {
          arr.push(item);
        }
      }
      if (!arr.length) {
        this.load_more_no_data = '没有更多数据了';
        this.load_more_loading_lock = true;
        return Promise.reject();
      }
      this.xianggangNewsList = this.xianggangNewsList.concat(arr);
      return Promise.resolve(true);
    } catch (error) {
      console.log('err', error);
      return Promise.reject(error);
    } finally {
      this.load_more_loading = false;
    }
  }
}
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
