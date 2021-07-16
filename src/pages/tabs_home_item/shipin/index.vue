<template>
  <div class="standard-container" @scroll="monitorScrollEvent" ref="standard-container">
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
            <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
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
import { TabHomeShipinModule } from 'src/store/modules/tab_home_shipin';
import { TabHomeModule } from 'src/store/modules/tab_home';
import { get_user_current_categories } from 'src/utils/db';
import { cloneDeep } from 'lodash';
@Component({
  name: 'tabs_home_item_standard',
})
export default class extends Vue {
  $refs: any;
  get currentTabName() {
    return '视频';
  }
  get activeTabIndex() {
    return TabHomeModule.activeTabIndex;
  }
  get currentIndex() {
    const categories: any = get_user_current_categories() ? cloneDeep(get_user_current_categories()) : [];
    const cur = categories.find((d: any) => d.name === this.currentTabName);
    return Number(cur.index);
  }
  get defaultbackreason() {
    const result: any = AppModule.config_backreason;
    if (result) return result['defaultbackreason'];
    else return [];
  }
  get currentPageIsLoaded() {
    const loadedCurrentCategoriesData: any = TabHomeModule.loadedCurrentCategoriesData;
    const cur = loadedCurrentCategoriesData.find((d: any) => d.name === this.currentTabName);
    if (cur) {
      return cur.loaded;
    } else {
      return false;
    }
  }
  @Watch('activeTabIndex')
  async getFollowList(newVal: number, oldVal: number) {
    console.log(this.currentIndex, newVal);
    if (newVal === this.currentIndex) {
      if (!this.currentPageIsLoaded) {
        this.pageLoading = true;
        this.firstLoadData = true;
        this.videoNewsList = [];
        await this._downCallback();
        TabHomeModule.SET_activeTabIndex_single_loaded('shipin');
        this.firstLoadData = false;
        this.pageLoading = false;
      }
    }
  }
  // 数据
  private firstLoadData = true;
  private pageLoading = false;
  private videoNewsList: any = [];
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
    this.load_more_no_data = '';

    await this._downCallback();
    this.refreshSuccessText = this.videoNewsList.length ? `已为您推荐 ${this.videoNewsList.length} 条新内容` : '已更新到最新';
    this.isDownRefresh = false;
  }
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['standard-container'].scrollHeight;
    const scrollTop = this.$refs['standard-container'].scrollTop;
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
  private handlerClickVideoMore(news: any) {
    this.$q
      .bottomSheet({
        message: '分享是一种快乐',
        grid: true,
        actions: [
          {
            label: '微信',
            img: 'https://img01.yzcdn.cn/vant/share-sheet-wechat.png',
          },
          {
            label: '朋友圈',
            img: 'https://img01.yzcdn.cn/vant/share-sheet-wechat-moments.png',
          },
          {
            label: '微博',
            img: 'https://img01.yzcdn.cn/vant/share-sheet-weibo.png',
          },
          {
            label: 'QQ',
            img: 'https://img01.yzcdn.cn/vant/share-sheet-qq.png',
          },
          {
            label: '复制链接',
            img: 'https://z3.ax1x.com/2021/07/16/WMr0K0.png',
          },
        ],
      })
      .onOk((action: any) => {
        console.log('Action chosen:', action);
      });
  }
  /*http*/
  private async _downCallback() {
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
  private async _upCallback() {
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
.standard-container {
  overflow: scroll;
  height: 100%;
  .video-list {
    min-height: 320px;
    li {
      background: $white;
      position: relative;
      .video-placeholder {
        width: 100%;
        height: 190px;
        box-sizing: border-box;
        position: relative;
        .video-title {
          color: $white;
          font-size: 18px;
          padding: 0 16px;
          position: absolute;
          width: 100%;
          top: 10px;
          left: 0;
          box-sizing: border-box;
          z-index: 100;
        }
        .seriesTag {
          position: absolute;
          width: 48px;
          height: 20px;
          left: -1px;
          bottom: 0;
          z-index: 100;
        }
        .placeholder {
          position: absolute;
          width: 100%;
          height: 192px;
          left: 0;
          top: 0;
          filter: brightness(50%);
        }
        .play-video-button {
          width: 49px;
          height: 49px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 100;
        }
        .video-total-time {
          color: $white;
          position: absolute;
          bottom: 5px;
          right: 5px;
          font-size: 12px;
          background: rgba($color: #000000, $alpha: 0.3);
          padding: 4px;
          border-radius: 8px;
        }
      }
      .bottom {
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
        position: relative;
        span {
          display: inline-block;
          margin-right: 8px;
          font-size: 12px;
          color: #9e9e9e;
        }
        i {
          font-size: 12px;
          color: #9e9e9e;
          margin-right: 2px;
        }
        .label {
          vertical-align: 2px;
          transform: scale(0.9);
          display: inline-block;
          font-size: 12px;
          background: #fee3e3;
          text-align: center;
          padding: 2px 3px;
          color: $red;
          border-radius: 4px;
        }
        .label-blue {
          vertical-align: 2px;
          transform: scale(0.9);
          display: inline-block;
          font-size: 12px;
          background: $white;
          text-align: center;
          padding: 2px 3px;
          color: $blue;
          border: solid 1px $blue;
          border-radius: 4px;
        }
        .more {
          font-size: 22px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 10px;
        }
      }
    }
  }
  .load-more-loading {
    width: 100%;
    height: 50px;
    color: #969799;
    font-size: 14px;
    line-height: 50px;
    text-align: center;
  }
}
</style>
