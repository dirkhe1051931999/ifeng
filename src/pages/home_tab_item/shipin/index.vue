<template>
  <div class="shipin-container" @scroll="monitorScrollEvent" ref="shipin-container">
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
      <ul class="video-list" v-if="!pageLoading">
        <li v-for="news in videoNewsList" :key="news.id + Math.random().toString()" track-by="id">
          <div class="video-placeholder">
            <p class="video-title">{{ news.title }}</p>
            <img v-if="news.seriesTag" src="https://x0.ifengimg.com/cmpp/2021/0401/ced142b6f5d6dc0size6_w144_h60.png" alt="" class="seriesTag" />
            <van-image :src="news.imageList[0].url" alt="" class="placeholder" />
            <img src="~assets/play-video-button.png" alt="" class="play-video-button" />
            <p class="video-total-time" v-if="news.phvideo.length - news.phvideo.preview - news.phvideo.previewlength >= news.phvideo.length">
              {{ news.phvideo.length | getVideoTotalTime }}
            </p>
            <p class="video-total-time" v-else>
              {{ news.phvideo.previewlength | getVideoTotalTime }}
            </p>
          </div>
          <div class="bottom">
            <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
            <span v-if="news.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ news.style.recomTag.text }}</span>
            <span class="source" v-if="news.source">{{ news.source }}</span>
            <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
            <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
            <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
            <span class="count" v-if="news.updateTime">{{ news.updateTime | relativeTime }}</span>
            <q-icon name="more_horiz" class="more" @click="handlerClickVideoMore(news)"></q-icon>
          </div>
        </li>
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
import { AppModule } from 'src/store/modules/app';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { TabHomeShipinModule } from '@/store/modules/home_tab/shipin';
import { TabHomeModule } from 'src/store/modules/home';
import { get_user_current_categories } from 'src/utils/db';
import { cloneDeep } from 'lodash';
import { handlerQuasarShare } from 'src/utils/share';
@Component({
  name: 'home_tab_item_shipin',
})
export default class extends Vue {
  $refs: any;
  get currentTabId() {
    return 'shipin';
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
        this.videoNewsList = [];
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
  public videoNewsList: any = [];
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
    this.refreshSuccessText = this.videoNewsList.length ? `已为您推荐 ${this.videoNewsList.length} 条新内容` : '已更新到最新';
    this.isDownRefresh = false;
  }
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['shipin-container'].scrollHeight;
    const scrollTop = this.$refs['shipin-container'].scrollTop;
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
  public handlerClickVideoMore(news: any) {
    handlerQuasarShare('app', news);
  }
  /*http*/
  public async _downCallback() {
    let params: any = {
      id: 'RECOMVIDEO',
      ch: 'sp',
      action: 'down',
      pullNum: '1',
      pullTotal: '2',
      dailyOpenNum: '2',
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
        params = { id: 'RECOMVIDEO', ch: 'sp', action: 'default', pullTotal: '1', dailyOpenNum: '1' };
      }
      const result = await TabHomeShipinModule.getRecomlist({ params, formData });
      const arr = [];
      for (let item of result[0].item) {
        if (item.type !== 'advert') {
          arr.push(item);
        }
      }
      if (!arr.length) {
        this.load_more_no_data = '没有更多数据了';
      }
      this.videoNewsList = arr;
      return Promise.resolve(true);
    } catch (error) {
      console.log('err', error);
      return Promise.reject(error);
    }
  }
  public async _upCallback() {
    let params: any = {
      id: 'RECOMVIDEO',
      ch: 'sp',
      action: 'down',
      pullNum: this.pagination_params.num,
      pullTotal: '2',
      dailyOpenNum: '2',
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
      const result = await TabHomeShipinModule.getRecomlist({ params, formData });
      const arr = [];
      for (let item of result[0].item) {
        if (item.type !== 'advert') {
          arr.push(item);
        }
      }
      if (!arr.length) {
        this.load_more_no_data = '没有更多数据了';
        this.load_more_loading_lock = true;
        return Promise.reject();
      }
      this.videoNewsList = this.videoNewsList.concat(arr);
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