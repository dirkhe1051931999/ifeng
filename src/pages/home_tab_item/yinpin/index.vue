<template>
  <div class="yinpin-container" @scroll="monitorScrollEvent" ref="yinpin-container">
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
      <ul class="yinpin-list" v-if="!pageLoading">
        <!-- banner -->
        <div style="padding: 0 16px; margin-top: 10px">
          <div class="swiper-container bg-white yinpinSwiperList-container" style="height: 180px" v-if="yinpinSwiperList.length">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide yinpinSwiperList-slide"
                v-for="(item, index) in yinpinSwiperList"
                :key="index"
                style="width: 100%"
                @click="toDirectory(item, index)"
              >
                <van-image class="thumbnail" :src="item.thumbnail" lazy-load />
              </div>
            </div>
            <div class="swiper-pagination swiper-pagination-white"></div>
          </div>
        </div>
        <!-- 宫格 -->
        <div class="yinpinGirdList" v-if="yinpinGirdList.length">
          <li v-for="(item, index) in yinpinGirdList" :key="index" @click="handlerClickGridItem(item, index)">
            <img :src="item.thumbnail" alt="" />
            <p class="title">{{ item.title }}</p>
          </li>
        </div>
        <!-- 猜你喜欢 -->
        <div class="yinpinGuesslikeList" v-if="yinpinGuesslikeList.length">
          <div class="top">
            <div class="l">猜你喜欢</div>
            <div class="r" @click="handleClickRefreshGuesslike" v-if="!yinpinGuesslikeListLoading">
              <q-icon name="autorenew"></q-icon>
              <span>换一批</span>
            </div>
            <div class="r" v-else>
              <span>刷新中...</span>
            </div>
          </div>
          <div class="list">
            <li v-for="(item, index) in yinpinGuesslikeList" :key="index" @click="toDirectory(item, index)">
              <img :src="item.thumbnail" alt="" />
              <p class="dotdotdot2">{{ item.title }}</p>
            </li>
          </div>
        </div>
        <!-- 排行榜 -->
        <div
          class="swiper-container bg-white yinpinRankList-container"
          style="margin-bottom: 10px; padding-top: 10px; padding-bottom: 10px"
          v-if="yinpinRankList.length"
        >
          <div class="swiper-wrapper p-r-16" style="margin-left: 10px">
            <div class="swiper-slide yinpinRankList-slide shadow-3" v-for="(father, i) in yinpinRankList" :key="i" style="width: 90%">
              <div class="top">
                <img :src="father.titleIcon" alt="" class="l" />
                <q-icon name="arrow_circle_right" class="r"></q-icon>
              </div>
              <ul>
                <li v-for="(item, j) in father.item" :key="j" @click="toDirectory(item, j)">
                  <img :src="item.thumbnail" alt="" class="l" />
                  <div class="r">
                    <div class="t dotdotdot2">
                      {{ item.title }}
                    </div>
                    <div class="b">
                      <div class="play">
                        <q-icon name="play_arrow" class="fs-16 m-r-5"></q-icon>
                        <span>{{ item.playTimeStr }}</span>
                      </div>
                      <div class="episodes">
                        <q-icon name="library_books" class="fs-16 m-r-5"></q-icon>
                        <span>{{ item.trackCountStr }}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 精品推荐 -->
        <div class="yinpinRecommendList" v-if="yinpinRecommendList.length">
          <div class="top">精品推荐</div>
          <li v-for="(item, index) in yinpinRecommendList" :key="index" @click="toDirectory(item, index)">
            <img :src="item.thumbnail" alt="" class="l" />
            <div class="r">
              <div class="t dotdotdot2">
                {{ item.title }}
              </div>
              <div class="m dotdotdot2">
                {{ item.intro }}
              </div>
              <div class="b">
                <div class="play">
                  <q-icon name="play_arrow" class="fs-16 m-r-5"></q-icon>
                  <span>{{ item.playTimeStr }}</span>
                </div>
                <div class="episodes">
                  <q-icon name="library_books" class="fs-16 m-r-5"></q-icon>
                  <span>{{ item.trackCountStr }}</span>
                </div>
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
import { TabHomeYinpinModule } from '@/store/modules/home_tab/yinpin';

@Component({
  name: 'home_tab_item_yinpin',
})
export default class extends Vue {
  $refs: any;
  get currentTabId() {
    return 'yinpin';
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
  async getFollowList(newVal: number, oldVal: number) {
    if (newVal === this.currentIndex) {
      if (!this.currentPageIsLoaded) {
        this.pageLoading = true;
        this.firstLoadData = true;
        this.yinpinRecommendList = [];
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
  private yinpinRecommendList: any[] = [];
  private yinpinSwiperList: any[] = [];
  private yinpinGirdList: any[] = [];
  private yinpinGuesslikeListLoading = false;
  private yinpinGuesslikeList: any[] = [];
  private yinpinRankList: any[] = [];
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
    this.refreshSuccessText = '已更新到最新';
    this.isDownRefresh = false;
  }
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['yinpin-container'].scrollHeight;
    const scrollTop = this.$refs['yinpin-container'].scrollTop;
    this.containerPositionY = scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
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
  private handlerClickGridItem(item: any, index: number) {
    if (item.id !== 'audiomy') {
      this.$router.push('/tab_yinpin_child/categories?cateid=' + item.link.cateid);
    }
    console.log(item, index);
  }
  private toDirectory(item: any, index: number) {
    this.$router.push('/tab_yinpin_child/directory?aid=' + item.link.aid);
  }
  /*http*/
  private async _downCallback() {
    let params: any = {
      id: 'AUDIO',
      ch: 'ximalaya',
      action: 'down',
      page: '1',
      pullTotal: '2',
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
        params = { id: 'AUDIO', ch: 'ximalaya', action: 'default', pullTotal: '1', dailyOpenNum: '1', page: '1' };
      }
      const { data } = await TabHomeYinpinModule.getRecomlistForYinpin({ params, formData });
      const { banner, nav, guesslike, rank, recommend } = data;
      const yinpinRecommendList = [];
      const yinpinGirdList = [];
      const yinpinGuesslikeList = [];
      const yinpinSwiperList = [];
      for (let item of recommend.item) {
        if (item.type !== 'advert') {
          yinpinRecommendList.push(item);
        }
      }
      for (let item of banner.item) {
        if (item.type !== 'advert') {
          yinpinSwiperList.push(item);
        }
      }
      for (let item of nav.item) {
        if (item.type !== 'advert') {
          yinpinGirdList.push(item);
        }
      }
      for (let item of guesslike.item) {
        if (item.type !== 'advert') {
          yinpinGuesslikeList.push(item);
        }
      }
      if (!yinpinRecommendList.length) {
        this.load_more_no_data = '没有更多数据了';
      }
      this.yinpinRecommendList = yinpinRecommendList;
      this.yinpinSwiperList = banner.item;
      this.yinpinGirdList = yinpinGirdList;
      this.yinpinGuesslikeList = yinpinGuesslikeList;
      this.yinpinRankList = rank;
      this.$nextTick(() => {
        if (this.firstLoadData) {
          setTimeout(() => {
            new window['Swiper']('.yinpinSwiperList-container', {
              loop: true,
              pagination: {
                el: '.swiper-pagination',
                clickable: true,
              },
            });
            new window['Swiper']('.yinpinRankList-container', {
              slidesPerView: 'auto',
              spaceBetween: 10,
            });
          }, 500);
        }
      });
      return Promise.resolve(true);
    } catch (error) {
      console.log('err');
      console.log(error);
    }
  }
  private async _upCallback() {
    let params: any = {
      id: 'AUDIO',
      ch: 'ximalaya',
      action: 'up',
      page: this.pagination_params.num,
      pullTotal: '3',
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
      const { data } = await TabHomeYinpinModule.getRecomlistForYinpin({ params, formData });
      const { recommend } = data;
      const arr = [];
      for (let item of recommend.item) {
        if (item.type !== 'advert' && item.type !== 'fastmessagescroll') {
          arr.push(item);
        }
      }
      if (!arr.length) {
        this.load_more_no_data = '没有更多数据了';
        this.load_more_loading_lock = true;
        return Promise.reject();
      }
      this.yinpinRecommendList = this.yinpinRecommendList.concat(arr);
      return Promise.resolve(true);
    } catch (error) {
      console.log('err', error);
      return Promise.reject(error);
    } finally {
      this.load_more_loading = false;
    }
  }
  private async handleClickRefreshGuesslike() {
    if (this.yinpinGuesslikeListLoading) return;
    try {
      let params: any = {};
      this.yinpinGuesslikeListLoading = true;
      const { data } = await TabHomeYinpinModule.getGuesslikeRefreshForYinpin({ params });
      const yinpinGuesslikeList = [];
      for (let item of data.item) {
        if (item.type !== 'advert') {
          yinpinGuesslikeList.push(item);
        }
      }
      this.yinpinGuesslikeList = yinpinGuesslikeList;
      this.yinpinGuesslikeListLoading = false;
    } catch (error) {
      console.log('error', error);
      this.yinpinGuesslikeListLoading = false;
    }
  }
}
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>
