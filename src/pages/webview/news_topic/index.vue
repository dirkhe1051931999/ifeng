<template>
  <div class="news-topic-container">
    <ul class="tabs" ref="tabs" :class="activeShow ? 'active-show' : ''">
      <q-icon class="back" name="arrow_back_ios" @click="hanlderClickTabBack" :class="activeShow ? 'active-show' : ''"></q-icon>
      <div class="tab-name" ref="tab-name">
        <li
          v-for="(item, index) in tabs"
          :key="index"
          :class="[index === activeTabIndex ? 'active' : '', activeShow ? 'active-show' : '']"
          @click="handlerClickTabItem(index)"
        >
          {{ item.name }}
        </li>
      </div>
      <span class="follow" v-if="pageLoaded" v-show="!activeShow">关注</span>
    </ul>
    <div ref="news-topic-wrap" class="news-topic-wrap" @scroll="monitorScrollEvent">
      <div class="banner" ref="banner" :style="`background-image: url(${this.banner.newBannerImg})`"></div>
      <div class="header" v-if="pageLoaded">
        <p class="one">{{ this.banner.title }}</p>
        <p class="two" v-if="this.banner.introduction">{{ this.banner.introduction }}</p>
      </div>
      <div class="load-more-loading" v-if="!pageLoaded"><q-spinner color="primary" size="22px" :thickness="2" class="m-r-10"/>努力加载中...</div>
      <div class="swiper-container bg-white newsTopicSwiperList-container" style="height: 240px" v-if="newsTopicSwiperList.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide newsTopicSwiperList-slide" v-for="(news, index) in newsTopicSwiperList" :key="index" style="width: 100%">
            <p class="title">{{ news.title }}</p>
            <p class="dateDiff">{{ news.updateTime | getDateDiff }}</p>
            <van-image class="thumbnail" :src="news.thumbnail" lazy-load />
          </div>
        </div>
      </div>
      <div class="tabs-item-wrap" v-for="(_tab, _) in tabs" :key="_" :class="_tab.id" :ref="_tab.id">
        <div class="tabs-item">
          <div class="tabs-item-title">
            <span class="index" v-if="_ < 10">0{{ _ + 1 }}</span>
            <span class="index" v-else>{{ _ + 1 }}</span>
            {{ _tab.name }}
          </div>
          <div v-for="(news, __) in _tab.list" :key="__">
            <li :class="[_tab.type]" v-if="_tab.type === 'column'">
              <!-- doc -->
              <div v-if="news.type === 'doc' || news.type === 'slide' || (news.type === 'topic2' && !news.newslist)" class="doc">
                <div class="top">
                  <div class="left">
                    <p class="title">
                      <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.pos">{{ news.style.recomTag.text }}</span>
                      {{ news.title }}
                    </p>
                  </div>
                  <div class="right">
                    <van-image class="thumbnail" :src="news.thumbnail" lazy-load radius="6" />
                  </div>
                </div>
                <div class="text-red topLabel" v-if="news.topLabel" @click="handlerClickToutiaoHotSpotMore">
                  <span class="iconfont icon-hot text-red m-r-5"></span>{{ news.topLabel.desp }} <q-icon name="arrow_right" class="fs-16"></q-icon>
                </div>
                <div v-if="news.summary && news.summary.tag && news.summary.desp" class="hot-comment">
                  <span class="label">{{ news.summary.tag }}</span>
                  {{ news.summary.desp }}
                </div>
                <div class="vote" v-if="news.vote">
                  <div v-for="(item, index) in news.vote.result" :key="index" class="question">
                    <p class="title">{{ index + 1 }}. {{ item.resultArray.question }}</p>
                    <ul>
                      <li v-for="(option, index) in item.resultArray.option" :key="index">
                        <div class="vote-result" v-if="news.vote.expire !== '1'" :style="`width:${option.nump}%`"></div>
                        <span class="text">{{ option.title }}</span>
                        <span class="vote-result-num">{{ `${option.nump}% (${option.num}人)` }}</span>
                      </li>
                    </ul>
                  </div>
                  <p class="joinCount">
                    {{ news.vote.joinCount | numberFormat }}人参与投票，当前{{ news.vote.expire === '1' ? '投票进行中' : '投票已结束' }}
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
                  </div>
                </div>
                <div class="intro p-b-10 fs-18">
                  <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.pos">{{ news.style.recomTag.text }}</span>
                  {{ news.intro ? news.intro : news.title }}
                </div>
                <div class="video-placeholder">
                  <img
                    v-if="news.seriesTag"
                    src="https://x0.ifengimg.com/cmpp/2021/0401/ced142b6f5d6dc0size6_w144_h60.png"
                    alt=""
                    class="seriesTag"
                  />
                  <van-image :src="news.imageList[0].url" alt="" class="placeholder" radius="6" />
                  <img src="~assets/play-video-button.png" alt="" class="play-video-button" />
                  <p class="video-total-time">
                    {{ news.phvideo.length | getVideoTotalTime }}
                  </p>
                </div>
                <div class="text-red topLabel" v-if="news.topLabel" @click="handlerClickToutiaoHotSpotMore">
                  <span class="iconfont icon-hot text-red"></span>
                  {{ news.topLabel.desp }} <q-icon name="arrow_right" class="fs-16"></q-icon>
                </div>
                <div v-if="news.videoSeries" class="videoSeries">
                  <q-icon name="video_library"></q-icon>
                  {{ news.videoSeries.name }}
                </div>
                <div v-if="news.summary" class="hot-comment">
                  <span class="label">{{ news.summary.tag }}</span>
                  {{ news.summary.desp }}
                </div>
                <div v-if="!news.subscribe.logo || !news.subscribe.honorImg" class="no-action-bottom">
                  <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
                  <span v-if="news.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ news.style.recomTag.text }}</span>
                  <span class="source" v-if="news.source">{{ news.source }}</span>
                  <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
                  <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
                  <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
                  <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
                </div>
                <div v-if="news.subscribe.logo || news.subscribe.honorImg" class="action-bottom">
                  <div class="like">
                    <span class="iconfont icon-Group-"></span>
                    <span class="count">{{ news.like ? news.like : '赞' }}</span>
                  </div>
                  <div class="comment">
                    <span class="iconfont icon-duanxin"></span>
                    <span class="count">{{ news.commentsall ? news.commentsall : '评论' }}</span>
                  </div>
                  <div class="share" @click="handlerClickPhvideoShare(news)">
                    <span class="iconfont icon-fenxiang3"></span>
                    <span class="count">{{ news.share ? news.share : '分享' }}</span>
                  </div>
                </div>
              </div>
            </li>
            <li :class="[_tab.type]" v-if="_tab.type === 'comment'">
              {{ news.comment_contents }}
            </li>
          </div>
        </div>
      </div>
    </div>
    <div class="page-fixed-bottom">
      <div class="input"></div>
      <div class="comment">
        <i class="iconfont icon-duanxin"></i>
      </div>
      <div class="share">
        <i class="iconfont icon-fenxiang3"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { NewsTopicModule } from 'src/store/modules/news_topic';
import { handlerQuasarShare } from 'src/utils/share';
import { ImagePreview } from 'vant';
import { AppModule } from 'src/store/modules/app';
@Component
export default class extends Vue {
  $refs: any;
  get defaultbackreason() {
    const result: any = AppModule.config_backreason;
    if (result) return result['defaultbackreason'];
    else return [];
  }
  async created() {}
  async mounted() {
    await this._getNewTopic();
    this.$nextTick(() => {
      this.$refs['news-topic-wrap'].style['height'] = window.innerHeight - 46 + 'px';
      for (let item of this.tabs) {
        const $dom: any = this.$refs[item.id][0];
        this.tabsOffsetTopInterregional.push($dom.offsetTop - 40);
      }
      this.tabsOffsetTopInterregional.push(this.$refs['news-topic-wrap'].scrollHeight);
      this.$dom = this.$refs['news-topic-wrap'];
      this.$tabs = this.$refs['tab-name'];
      this.$tabsChildren = this.$refs['tab-name'].children;
      this.pageLoaded = true;
    });
  }
  /*data*/
  private pageLoaded = false;
  private activeShow = false;
  private activeTabIndex = 0;
  private $dom: any;
  private $tabs: any;
  private $tabsChildren: any;
  private tabsOffsetTopInterregional: number[] = [0];
  private tabs: any[] = [];
  private newsTopicSwiperList: any[] = [];
  private banner: any = {};
  /*event */
  private monitorScrollEvent() {
    const scrollTop = this.$dom.scrollTop;
    if (scrollTop >= 115) {
      this.activeShow = true;
    } else {
      this.activeShow = false;
    }
    for (let i = 0; i < this.tabsOffsetTopInterregional.length; i++) {
      if (i === 0) {
        if (scrollTop >= this.tabsOffsetTopInterregional[i] && scrollTop < this.tabsOffsetTopInterregional[i + 2]) {
          this.activeTabIndex = 0;
          this.$tabs.scrollLeft = 0;
        }
      } else if (i > 0 && i < this.tabsOffsetTopInterregional.length - 2) {
        if (scrollTop >= this.tabsOffsetTopInterregional[i + 1] && scrollTop < this.tabsOffsetTopInterregional[i + 2]) {
          this.activeTabIndex = i;
          this.$tabs.scrollLeft = this.$tabsChildren[i].offsetLeft - this.$tabsChildren[i].offsetWidth;
        }
      }
    }
  }
  private handlerClickTabItem(index: number) {
    if (!this.activeShow) return;
    this.$refs['news-topic-wrap'].scrollTop = this.tabsOffsetTopInterregional[index + 1];
  }
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
  private async _getNewTopic() {
    try {
      let params = {
        topicid: this.$route.query.topicid,
      };
      const result = await NewsTopicModule.getNewsTopic({ params });
      const { meta, body } = result.data;
      this.banner = meta;
      if (meta.slide) {
        this.newsTopicSwiperList = meta.slide;
      }
      for (let item of body) {
        if (item.type === 'comment') {
          this.tabs.push({
            name: item.title,
            id: window.escape(item.title),
            list: item.comments,
            type: 'comment',
          });
        } else if (item.type === 'column') {
          for (let data of item.data) {
            this.tabs.push({
              name: data.title,
              id: window.escape(data.title),
              list: data.items,
              type: 'column',
            });
          }
        }
      }
      setTimeout(() => {
        if (this.newsTopicSwiperList.length) {
          new window['Swiper']('.newsTopicSwiperList-container', {
            loop: this.newsTopicSwiperList.length > 1 ? true : false,
          });
        }
        return Promise.resolve(true);
      });
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