<template>
  <div class="news-theme-container">
    <div class="header" v-if="bannerMap.pageinfo">
      <div class="nav">
        <q-icon class="back" name="arrow_back_ios" @click="hanlderClickTabBack" :class="activeShow ? 'active-show' : ''"></q-icon>
        <div class="follow-button">关注</div>
      </div>
      <img :src="bannerMap.pageinfo.banner.threelines.backgroundImg" alt="" class="bgimg" />
      <div class="title">
        <p class="text">{{ bannerMap.pageinfo.banner.threelines.title }}</p>
        <p class="follow-count">{{ bannerMap.pageinfo.banner.threelines.desc.first }}</p>
      </div>
      <p class="desc" v-if="bannerMap.pageinfo.banner.threelines.desc.second">{{ bannerMap.pageinfo.banner.threelines.desc.second }}</p>
    </div>
    <div class="text-center p-t-10 p-b-10" v-if="!pageLoaded">
      <van-loading size="12px" color="#969799">加载中...</van-loading>
    </div>
    <div class="news-theme-wrap" ref="news-theme-wrap" v-if="pageLoaded">
      <ul v-for="(list, listIndex) in newsThemeList" :key="listIndex" class="news-item">
        <li v-for="(news, index) in list.items" :key="index">
          <!-- doc -->
          <div
            v-if="news.content.type === 'doc' || news.content.type === 'slide' || (news.content.type === 'topic2' && !news.content.newslist)"
            class="doc"
          >
            <div class="top">
              <div class="left">
                <p class="title">
                  <span class="text-red title-label" v-if="news.content.style.recomTag && news.content.style.recomTag.pos">{{
                    news.content.style.recomTag.text
                  }}</span>
                  {{ news.content.title }}
                </p>
              </div>
              <div class="right">
                <van-image class="thumbnail" :src="news.content.thumbnail" lazy-load radius="6" />
              </div>
            </div>
            <div class="text-red topLabel" v-if="news.content.topLabel" @click="handlerClickToutiaoHotSpotMore">
              <span class="iconfont icon-hot text-red m-r-5"></span>{{ news.content.topLabel.desp }}
              <q-icon name="arrow_right" class="fs-16"></q-icon>
            </div>
            <div v-if="news.content.summary && news.content.summary.tag && news.content.summary.desp" class="hot-comment">
              <span class="label">{{ news.content.summary.tag }}</span>
              {{ news.content.summary.desp }}
            </div>
            <div class="vote" v-if="news.content.vote">
              <div v-for="(item, index) in news.content.vote.result" :key="index" class="question">
                <p class="title">{{ index + 1 }}. {{ item.resultArray.question }}</p>
                <ul>
                  <li v-for="(option, index) in item.resultArray.option" :key="index">
                    <div class="vote-result" v-if="news.content.vote.expire !== '1'" :style="`width:${option.nump}%`"></div>
                    <span class="text">{{ option.title }}</span>
                    <span class="vote-result-num">{{ `${option.nump}% (${option.num}人)` }}</span>
                  </li>
                </ul>
              </div>
              <p class="joinCount">
                {{ news.content.vote.joinCount | numberFormat }}人参与投票，当前{{ news.content.vote.expire === '1' ? '投票进行中' : '投票已结束' }}
              </p>
            </div>
            <div class="bottom">
              <span v-if="news.content.style.recomTag && news.content.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
              <span v-if="news.content.style.recomTag && !news.content.style.recomTag.pos" class="label-blue">{{
                news.content.style.recomTag.text
              }}</span>
              <span class="source" v-if="news.content.source">{{ news.content.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.content.commentsall"></i>
              <span class="count" v-if="news.content.commentsall"> {{ news.content.commentsall }}</span>
              <i class="iconfont icon-lishi" v-if="news.content.updateTime"></i>
              <span class="count" v-if="news.content.updateTime">{{ news.content.updateTime | getDateDiff }}</span>
            </div>
          </div>
          <!-- picture -->
          <div v-if="news.content.type === 'short'" class="short w-full">
            <div class="top flex j-between a-top">
              <div class="left flex j-between a-center">
                <div class="l" v-if="news.content.subscribe.logo && news.content.subscribe.honorImg">
                  <img class="w-32 h-32 relative avatar" :src="news.content.subscribe.logo" />
                  <img :src="news.content.subscribe.honorImg" alt="" class="honor" />
                </div>
                <div class="l" v-else>
                  <img class="w-32 h-32 relative avatar" src="~assets/default-blogger-avatar.png" />
                </div>
                <div class="r">
                  <div class="t">{{ news.content.subscribe.catename }}</div>
                  <div class="b">{{ news.content.updateTime | getDateDiff }}</div>
                </div>
              </div>
              <div class="right hide">
                <span class="follow">关注</span>
              </div>
            </div>
            <div class="intro p-b-10 fs-18" v-if="news.content.intro">
              <span class="text-red title-label" v-if="news.content.style.recomTag && news.content.style.recomTag.pos">{{
                news.content.style.recomTag.text
              }}</span>
              {{ news.content.intro }}
            </div>
            <ul class="images" v-if="news.content.imageList && news.content.imageList.length">
              <van-image
                class="thumbnail relative"
                :style="news.content.imageList.length === 1 ? 'width: 50%;' : 'width: 32.5%;'"
                :src="item.url"
                lazy-load
                v-for="(item, index) in news.content.imageList"
                :key="index"
                fit="cover"
                v-show="index < 10"
                @click="previewImage(news.content.imageList, index)"
              />
            </ul>
            <div v-if="news.content.summary" class="hot-comment">
              <span class="label">{{ news.content.summary.tag }}</span>
              {{ news.content.summary.desp }}
            </div>
            <div class="no-action-bottom">
              <span v-if="news.content.style.recomTag && news.content.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
              <span v-if="news.content.style.recomTag && !news.content.style.recomTag.pos" class="label-blue">{{
                news.content.style.recomTag.text
              }}</span>
              <span class="source" v-if="news.content.source">{{ news.content.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.content.commentsall"></i>
              <span class="count" v-if="news.content.commentsall"> {{ news.content.commentsall }}</span>
              <i class="iconfont icon-lishi" v-if="news.content.updateTime"></i>
              <span class="count" v-if="news.content.updateTime">{{ news.content.updateTime | getDateDiff }}</span>
            </div>
          </div>
          <!-- video -->
          <div v-if="news.content.type === 'phvideo'" class="phvideo w-full">
            <div class="top flex j-between a-top">
              <div class="left flex j-between a-center">
                <div class="l" v-if="news.content.subscribe.logo && news.content.subscribe.honorImg">
                  <img class="w-32 h-32 relative avatar" :src="news.content.subscribe.logo" />
                  <img :src="news.content.subscribe.honorImg" alt="" class="honor" />
                </div>
                <div class="l" v-else>
                  <img class="w-32 h-32 relative avatar" src="~assets/default-blogger-avatar.png" />
                </div>
                <div class="r">
                  <div class="t">{{ news.content.subscribe.catename }}</div>
                  <div class="b">{{ news.content.updateTime | getDateDiff }}</div>
                </div>
              </div>
              <div class="right hide">
                <span class="follow">关注</span>
              </div>
            </div>
            <div class="intro p-b-10 fs-18">
              <span class="text-red title-label" v-if="news.content.style.recomTag && news.content.style.recomTag.pos">{{
                news.content.style.recomTag.text
              }}</span>
              {{ news.content.intro ? news.content.intro : news.content.title }}
            </div>
            <div class="video-placeholder">
              <img
                v-if="news.content.seriesTag"
                src="https://x0.ifengimg.com/cmpp/2021/0401/ced142b6f5d6dc0size6_w144_h60.png"
                alt=""
                class="seriesTag"
              />
              <van-image :src="news.content.imageList[0].url" alt="" class="placeholder" radius="6" />
              <img src="~assets/play-video-button.png" alt="" class="play-video-button" />
              <p class="video-total-time">
                {{ news.content.phvideo.length | getVideoTotalTime }}
              </p>
            </div>
            <div class="text-red topLabel" v-if="news.content.topLabel" @click="handlerClickToutiaoHotSpotMore">
              <span class="iconfont icon-hot text-red"></span>
              {{ news.content.topLabel.desp }} <q-icon name="arrow_right" class="fs-16"></q-icon>
            </div>
            <div v-if="news.content.videoSeries" class="videoSeries">
              <q-icon name="video_library"></q-icon>
              {{ news.content.videoSeries.name }}
            </div>
            <div v-if="news.content.summary" class="hot-comment">
              <span class="label">{{ news.content.summary.tag }}</span>
              {{ news.content.summary.desp }}
            </div>
            <div v-if="!news.content.subscribe.logo || !news.content.subscribe.honorImg" class="no-action-bottom">
              <span v-if="news.content.style.recomTag && news.content.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
              <span v-if="news.content.style.recomTag && !news.content.style.recomTag.pos" class="label-blue">{{
                news.content.style.recomTag.text
              }}</span>
              <span class="source" v-if="news.content.source">{{ news.content.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.content.commentsall"></i>
              <span class="count" v-if="news.content.commentsall"> {{ news.content.commentsall }}</span>
              <i class="iconfont icon-lishi" v-if="news.content.updateTime"></i>
              <span class="count" v-if="news.content.updateTime">{{ news.content.updateTime | getDateDiff }}</span>
            </div>
            <div v-if="news.content.subscribe.logo || news.content.subscribe.honorImg" class="action-bottom">
              <div class="like">
                <span class="iconfont icon-Group-"></span>
                <span class="count">{{ news.content.like ? news.content.like : '赞' }}</span>
              </div>
              <div class="comment">
                <span class="iconfont icon-duanxin"></span>
                <span class="count">{{ news.content.commentsall ? news.content.commentsall : '评论' }}</span>
              </div>
              <div class="share" @click="handlerClickPhvideoShare(news)">
                <span class="iconfont icon-fenxiang3"></span>
                <span class="count">{{ news.content.share ? news.content.share : '分享' }}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { NewsThemeModule } from 'src/store/modules/news_theme';
import { ImagePreview } from 'vant';
import { handlerQuasarShare } from 'src/utils/share';
@Component
export default class extends Vue {
  $refs: any;
  private activeShow = false;
  private pageLoaded = false;
  private bannerMap: any = {};
  private newsThemeList: any[] = [];
  async mounted() {
    this.pageLoaded = false;
    await this._getNewTheme();
    this.pageLoaded = true;
    this.$nextTick(() => {
      this.$refs['news-theme-wrap'].style['height'] = window.innerHeight - 150 + 'px';
    });
  }
  /*event */
  private hanlderClickTabBack() {
    this.$router.back();
  }
  private handlerClickPhvideoShare(news: any) {
    handlerQuasarShare('news_topic', news);
  }
  private handlerClickToutiaoHotSpotMore() {
    this.$router.push('/tab_home_hot/0');
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
  /*http */
  private async _getNewTheme() {
    try {
      let params: any = {
        groupid: this.$route.query.groupid || '',
        aid: '',
        type: '',
      };
      if (this.$route.query.eventName) {
        params = this.$route.query;
        const result = await NewsThemeModule.hotSpotDetailListV2({ params });
        const { config, lists } = result.data;
        this.bannerMap = config;
        this.newsThemeList = lists;
      } else {
        const result = await NewsThemeModule.hotSpotCrowdV2({ params });
        const { config, lists } = result.data;
        this.bannerMap = config;
        this.newsThemeList = lists;
      }

      return Promise.resolve(true);
    } catch (err) {
      console.log('err', err);
      return Promise.reject();
    }
  }
}
</script>


<style lang="scss" scoped>
@import './style.scss';
</style>