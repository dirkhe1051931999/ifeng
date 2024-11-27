<template>
  <div class="news-detail-shortlist">
    <div class="loading-page" v-if="!pageLoaded">
      <div class="p-t-30">
        <q-spinner color="primary" size="22px" :thickness="2" class="m-r-10" />
        努力加载中...
      </div>
    </div>
    <div class="nav">
      <q-icon class="back" name="arrow_back_ios" @click="$router.back()"></q-icon>
      <div class="title">
        <span>图文并茂</span>
      </div>
    </div>
    <div class="news-detail-shortlist-wrap" ref="news-detail-shortlist-wrap" @scroll="monitorScrollEvent" v-if="pageLoaded">
      <ul v-if="shortList.length" class="shortList-wrap">
        <li v-for="(news, _) in shortList" :key="_" class="short w-full" @click.stop.prevent="handlerClickNewsItem(news)">
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
              @click.stop.prevent="previewImage(news.imageList, index)"
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
        </li>
        <div class="load-more-loading" v-show="load_more_no_data">暂无数据</div>
        <div class="load-more-loading" v-show="load_more_loading">
          <q-spinner color="#969799" size="20px" :thickness="2" />
          加载中...
        </div>
      </ul>
      <div v-else class="text-center">
        <van-empty description="暂无数据" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { NewsImglistModule } from '@/store/modules/news_imglist';
import { ImagePreview } from 'vant';
import { AppModule } from '@/store/modules/app';
import { getUrlParams, json2Url } from '@/utils';
@Component({
  name: 'news-detail-shortlist',
})
export default class extends Vue {
  $refs: any;
  @Watch('$route')
  onchange(to: any, from: any) {
    if (to.path === '/news_detail/imglist') {
      if (from.query.reload === 'true') {
        location.reload();
      } else {
        const scrollTop: number = this.containerPositionY;
        if (scrollTop !== 0) {
          this.$dom.scrollTop = scrollTop;
        }
      }
    }
  }
  get defaultbackreason() {
    const result: any = AppModule.config_backreason;
    if (result) return result['defaultbackreason'];
    else return [];
  }
  private $dom: any;
  private containerPositionY = 0;
  private pageLoaded = false;
  private shortList: any[] = [];
  private pagationParams: any = {
    page: 1,
    dailyOpenNum: 1,
    id: '',
  };
  private load_more_loading_lock = false;
  private load_more_loading = false;
  private load_more_no_data = '';
  async mounted() {
    this.pagationParams.id = this.$route.query.id;
    this.pageLoaded = false;
    await this.getShortList();
    this.pageLoaded = true;
    await this.$nextTick(() => {
      this.$refs['news-detail-shortlist-wrap'].style['height'] = `${window.innerHeight - 38}px`;
      this.$dom = this.$refs['news-detail-shortlist-wrap'];
    });
  }
  /**event */
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
  private handlerClickNewsItem(news: any) {
    if (news.type === 'short') {
      const params = getUrlParams(news.link.url);
      const urlStr = json2Url(params);
      switch (news.type) {
        case 'short':
          this.$router.push(`/news_detail/doc?${urlStr}`);
          break;
        default:
          break;
      }
    }
  }
  private async monitorScrollEvent() {
    const scrollTop = this.$dom.scrollTop;
    this.containerPositionY = scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - 38 >= this.$dom.scrollHeight) {
      if (!this.load_more_loading_lock) {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.pagationParams.page++;
        await this.getMoreShortList();
        this.load_more_loading_lock = false;
      }
    }
  }
  /**http */
  private async getShortList() {
    const result = await NewsImglistModule.getNewsImglist({ params: this.pagationParams });
    if (result && result[0]) {
      this.shortList = result[0].item;
    }
    return Promise.resolve();
  }
  private async getMoreShortList() {
    try {
      const result = await NewsImglistModule.getNewsImglist({ params: this.pagationParams });
      if (result && result[0]) {
        if (!result[0].item.length) {
          this.load_more_no_data = '没有更多数据了';
          this.load_more_loading_lock = true;
          this.load_more_loading = false;
          return Promise.reject();
        } else {
          this.shortList = this.shortList.concat(result[0].item);
        }
      }

      return Promise.resolve(true);
    } catch (error) {
      console.log('err', error);
      return Promise.reject();
    }
  }
}
</script>

<style lang="scss">
@import './_global.scss';
</style>
<style lang="scss" scoped>
@import './index.scss';
</style>
