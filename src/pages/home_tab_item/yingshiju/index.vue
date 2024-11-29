<template>
  <div class="yingshiju-container" ref="yingshiju-container">
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
      <ul class="yingshiju-list" v-if="!pageLoading">
        <!-- banner -->
        <div style="padding: 0 16px; margin-top: 10px">
          <div class="swiper-container bg-white bannerList-container" style="height: 180px" v-if="bannerList.length">
            <div class="swiper-wrapper">
              <div class="swiper-slide bannerList-slide" v-for="(item, index) in bannerList" :key="index" style="width: 100%">
                <van-image class="thumbnail" :src="item.thumbnail" lazy-load />
                <p class="title">{{ item.title }}</p>
              </div>
            </div>
            <div class="swiper-pagination swiper-pagination-white"></div>
          </div>
        </div>
        <!-- 大剧热播 -->
        <ul class="dajureboList">
          <p class="list-title">大剧热播</p>
          <div class="list">
            <li v-for="(item, index) in dajureboList" :key="index">
              <div class="thumbnail">
                <img :src="item.thumbnail || item.posterUrl" alt="" class="thumbnail" />
                <span>{{ item.extData.score }}</span>
              </div>
              <p class="title ellipsis">{{ item.title }}</p>
              <p class="summary ellipsis">{{ item.summary }}</p>
            </li>
          </div>
          <div class="more" @click="handleClickDajureboMore">
            <q-icon name="play_circle_filled" class="m-r-5 fs-18 text-red"></q-icon>
            <span>更多大剧热播</span>
          </div>
        </ul>
        <!-- 院线经典 -->
        <ul class="yuanxianjingdianList">
          <p class="list-title">院线经典</p>
          <div class="list">
            <li v-for="(item, index) in yuanxianjingdianList" :key="index">
              <div class="thumbnail">
                <img :src="item.thumbnail || item.posterUrl" alt="" />
                <span>{{ item.extData.score }}</span>
              </div>
              <p class="title ellipsis">{{ item.title }}</p>
              <p class="summary ellipsis">{{ item.summary }}</p>
            </li>
          </div>
          <div class="more">
            <q-icon name="play_circle_filled" class="m-r-5 fs-18 text-red"></q-icon>
            <span>更多院线经典</span>
          </div>
        </ul>
        <!-- 精彩剧集 -->
        <ul class="jingcaijujiList">
          <p class="list-title">精彩剧集</p>
          <div class="list">
            <li v-for="(item, index) in jingcaijujiList" :key="index">
              <div class="thumbnail">
                <img :src="item.thumbnail || item.posterUrl" alt="" />
                <span>{{ item.extData.score }}</span>
              </div>
              <p class="title ellipsis">{{ item.title }}</p>
              <p class="summary ellipsis">{{ item.summary }}</p>
            </li>
          </div>
          <div class="more">
            <q-icon name="play_circle_filled" class="m-r-5 fs-18 text-red"></q-icon>
            <span>更多精彩剧集</span>
          </div>
        </ul>
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
import { TabHomeYingshijuModule } from '@/store/modules/home_tab/yingshiju';
@Component({
  name: 'home_tab_item_yingshiju',
})
export default class extends Vue {
  $refs: any;
  get currentTabId() {
    return 'yingshiju';
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
        this.bannerList = [];
        this.dajureboList = [];
        this.yuanxianjingdianList = [];
        this.jingcaijujiList = [];
        await this._downCallback();
        TabHomeModule.SET_activeTabIndex_single_loaded(this.currentTabId);
        this.firstLoadData = false;
        this.pageLoading = false;
      }
    }
  }
  // 数据
  public containerPositionY = 0;
  public firstLoadData = true;
  public pageLoading = false;
  public bannerList: any[] = [];
  public dajureboList: any[] = [];
  public yuanxianjingdianList: any[] = [];
  public jingcaijujiList: any[] = [];
  // 下拉刷新，上拉加载的数据
  public isDownRefresh = false;
  public refreshSuccessText = '';
  public load_more_loading = false;
  public load_more_loading_lock = false;
  public load_more_no_data = '';
  public pagination_params = {
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
  public handleClickDajureboMore() {
    this.$router.push('/tab_yingshiju_child/dajurebo');
  }
  /*http*/
  public async _downCallback() {
    let params: any = {};
    let form = {};
    let formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }
    try {
      if (this.firstLoadData) {
        params = {};
      }
      const result = await TabHomeYingshijuModule.getYingshijuList({ params, formData });
      this.bannerList = result[0].bannerData;
      this.dajureboList = result[0].hotVideoData;
      this.yuanxianjingdianList = result[1].data;
      this.jingcaijujiList = result[2].data;
      this.$nextTick(() => {
        setTimeout(() => {
          new window['Swiper']('.bannerList-container', {
            loop: true,
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
          });
        });
      });

      return Promise.resolve(true);
    } catch (error) {
      console.log('err');
    }
  }
}
</script>
<style lang="scss" scoped>
@import './style.scss';
</style>