<template>
  <div class="xiaoshuo-container" ref="xiaoshuo-container" @scroll="monitorScrollEvent">
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
      <ul class="xiaoshuo-list" v-if="!pageLoading">
        <!-- banner -->
        <div style="padding: 0 16px; margin-top: 10px">
          <div class="swiper-container bg-white bannerList-container" style="height: 180px" v-if="bannerList.length">
            <div class="swiper-wrapper">
              <div class="swiper-slide bannerList-slide" v-for="(item, index) in bannerList" :key="index" style="width: 100%">
                <van-image class="thumbnail" :src="item.imageUrl" lazy-load />
                <p class="title">{{ item.title }}</p>
              </div>
            </div>
            <div class="swiper-pagination swiper-pagination-white"></div>
          </div>
        </div>
        <div class="list" v-if="xiaoshuoList.length">
          <div class="title">热门小说</div>
          <li v-for="(item, index) in xiaoshuoList" :key="index">
            <img :src="item.imageUrl" alt="" class="l" />
            <div class="r">
              <div class="t">{{ item.title }}</div>
              <div class="m">作者：{{ item.author }}</div>
              <div class="b dotdotdot4">{{ item.desc }}</div>
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
import { TabHomeXiaoshuoModule } from '@/store/modules/home_tab/xiaoshuo';
@Component({
  name: 'home_tab_item_xiaoshuo',
})
export default class extends Vue {
  $refs: any;
  get currentTabId() {
    return 'xiaoshuo';
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
        this.xiaoshuoList = [];
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
  private bannerList: any[] = [];
  private xiaoshuoList: any[] = [];
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
    const scrollHeight = this.$refs['xiaoshuo-container'].scrollHeight;
    const scrollTop = this.$refs['xiaoshuo-container'].scrollTop;
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
  /*http*/
  private async _downCallback() {
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
      const { data } = await TabHomeXiaoshuoModule.getXiaoshuoList({ params, formData });
      let arr: any[] = [];
      this.bannerList = data[0].list;
      for (let item of data) {
        if (item.list && item.list.length && item.list[0].bookId && item.list[0].author) {
          arr = arr.concat(item.list);
        }
      }
      this.xiaoshuoList = arr;
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
  private async _upCallback() {
    let params: any = {
      page: this.pagination_params.num,
    };
    let form = {};
    let formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }
    try {
      const { data } = await TabHomeXiaoshuoModule.getXiaoshuoList({ params, formData });
      let arr: any[] = [];
      for (let item of data) {
        if (item.list && item.list.length && item.list[0].bookId && item.list[0].author) {
          arr = arr.concat(item.list);
        }
      }
      if (!arr.length) {
        this.load_more_no_data = '没有更多数据了';
        this.load_more_loading_lock = true;
        return Promise.reject();
      }
      this.xiaoshuoList = this.xiaoshuoList.concat(arr);
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
