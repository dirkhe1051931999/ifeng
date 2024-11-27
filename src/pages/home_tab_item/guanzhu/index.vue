<template>
  <div class="guanzhu-container" @scroll="monitorScrollEvent" ref="guanzhu-container">
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
      <ul class="follow-list" v-if="!pageLoading">
        <div class="recommend" v-if="shuffxArr6.length">
          <div class="top">
            <span>推荐关注</span>
            <p class="reload" @click="handlerClickRecommendReload">
              <q-icon name="autorenew"></q-icon>
              换一批
            </p>
          </div>
          <ul class="bottom">
            <li v-for="news in shuffxArr6" :key="news.id + Math.random().toString()">
              <div class="avatar">
                <img :src="news.thumbnail" alt="" class="thumbnail" />
                <img :src="news.honorImg" alt="" class="honor" />
              </div>
              <q-icon name="check_circle" class="check" :class="news.follow ? 'text-red' : ''" @click="news.follow = !news.follow"></q-icon>
              <p class="title text-dot-1">{{ news.title }}</p>
              <p class="description text-dot-1">{{ news.description }}</p>
            </li>
          </ul>
          <div class="followAll" :class="shuffxArr6.length ? '' : 'disabled'">一键关注</div>
        </div>
        <div v-for="news in otherFollowList" :key="news.id + Math.random().toString()" class="other">
          <li v-if="news.type === 'doc'" class="doc">
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
            <van-image class="thumbnail" :src="news.thumbnail" lazy-load />
            <div class="title">{{ news.title }}</div>
            <div class="bottom">
              <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
              <span v-if="news.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ news.style.recomTag.text }}</span>
              <span class="source" v-if="news.source">{{ news.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
              <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
              <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
              <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
            </div>
          </li>
          <li v-if="news.type === 'short'" class="short">
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
            <div class="title">{{ news.intro ? news.intro : news.title }}</div>
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
            <div class="bottom">
              <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
              <span v-if="news.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ news.style.recomTag.text }}</span>
              <span class="source" v-if="news.source">{{ news.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
              <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
              <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
              <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
            </div>
          </li>
          <li v-if="news.type === 'phvideo'" class="videoshortimg">
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
            <div class="video-placeholder">
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
            <div class="title">{{ news.intro ? news.intro : news.title }}</div>
            <div class="bottom">
              <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
              <span v-if="news.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ news.style.recomTag.text }}</span>
              <span class="source" v-if="news.source">{{ news.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
              <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
              <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
              <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
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
import { AppModule } from 'src/store/modules/app';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { get_user_current_categories } from 'src/utils/db';
import { cloneDeep } from 'lodash';
import { TabHomeGuanzhuModule } from '@/store/modules/home_tab/guanzhu';
import { ImagePreview } from 'vant';
import { sampleSize } from 'lodash';
@Component({
  name: 'home_tab_item_guanzhu',
})
export default class extends Vue {
  $refs: any;
  get currentTabId() {
    return 'guanzhu';
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
        this.otherFollowList = [];
        await this._downCallback();
        TabHomeModule.SET_activeTabIndex_single_loaded(this.currentTabId);
        this.firstLoadData = false;
        this.pageLoading = false;
      }
    }
  }
  async mounted() {}
  // 数据
  public containerPositionY = 0;
  private firstLoadData = true;
  private pageLoading = false;
  private recomendFollowList = [];
  private shuffxArr6 = [];
  private otherFollowList = [];
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
  /*event */
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
  async onRefresh() {
    this.load_more_no_data = '';
    this.pagination_params.num = 1;
    await this._downCallback();
    this.refreshSuccessText = this.otherFollowList.length ? `已为您推荐 ${this.otherFollowList.length} 条新内容` : '已更新到最新';
    this.isDownRefresh = false;
  }
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['guanzhu-container'].scrollHeight;
    const scrollTop = this.$refs['guanzhu-container'].scrollTop;
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
  private handlerClickRecommendReload() {
    this.shuffxArr6 = sampleSize(this.recomendFollowList, 6);
  }

  /* http */
  private async _downCallback() {
    let params: any = {
      action: 'down',
      pullNum: '1',
      pullTotal: '2',
      dailyOpenNum: '1',
    };
    let form = {
      openNum: 3,
      lastDoc: '<usim_87uzpDccXNh,87uy1n8jF9H,0.164,splb,sy,>',
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
      const result = await TabHomeGuanzhuModule.getGuanzhuList({ params, formData });
      const recommend = result[0] ? result[0].item : [];
      const other = result[1] ? result[1].item : [];
      for (let item of recommend) {
        item['follow'] = true;
      }
      this.recomendFollowList = recommend;
      this.shuffxArr6 = sampleSize(this.recomendFollowList, 6);
      const arr: any = [];
      for (let item of other) {
        if (item.type !== 'advert') {
          arr.push(item);
        }
      }
      this.otherFollowList = arr;
      if (!arr.length) {
        this.load_more_no_data = '没有更多数据了';
      }
      return Promise.resolve(true);
    } catch (error) {
      console.log('err', error);
      return Promise.reject(error);
    }
  }
  private async _upCallback() {
    let params: any = {
      action: 'down',
      pullNum: this.pagination_params.num,
      pullTotal: '2',
      dailyOpenNum: '1',
    };
    let form = {
      openNum: 3,
      lastDoc: '<usim_87uzpDccXNh,87uy1n8jF9H,0.164,splb,sy,>',
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
      const result = await TabHomeGuanzhuModule.getGuanzhuList({ params, formData });
      const other = result[1] ? result[1].item : [];
      const arr: any = [];
      for (let item of other) {
        if (item.type !== 'advert') {
          arr.push(item);
        }
      }
      if (!arr.length) {
        this.load_more_no_data = '没有更多数据了';
        this.load_more_loading_lock = true;
        return Promise.reject();
      }
      this.otherFollowList = this.otherFollowList.concat(arr);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject();
    } finally {
      this.load_more_loading = false;
    }
  }
}
</script>
<style lang="scss" scoped>
@import './style/index.scss';
.guanzhu-container {
  overflow: scroll;
  height: 100%;
  .follow-list {
    min-height: 320px;
    padding: 10px 16px;
    .recommend {
      @include recommend;
    }
    .other {
      background: $white;
      .doc {
        @include doc;
      }
      .short {
        @include short;
      }
      .videoshortimg {
        @include videoshortimg;
      }
    }
  }
  .load-more-loading {
    @include load-more-loading;
  }
}
</style>
