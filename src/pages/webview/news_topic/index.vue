<template>
  <div class="news-topic-container">
    <ul class="tabs" ref="tabs" :class="activeShow ? 'active-show' : ''">
      <q-icon class="back" name="arrow_back_ios" @click.stop.prevent="hanlderClickTabBack" :class="activeShow ? 'active-show' : ''"></q-icon>
      <div class="tab-name" ref="tab-name" :style="activeShow ? 'width:100%' : ''">
        <li v-for="(item, index) in tabsList" :key="index" :class="[index === activeTabIndex ? 'active' : '', activeShow ? 'active-show' : '']" @click.stop.prevent="handlerClickTabItem(index)">
          {{ item.name }}
        </li>
      </div>
      <span class="follow" v-if="pageLoaded" v-show="!activeShow">关注</span>
    </ul>
    <div ref="news-topic-wrap" class="news-topic-wrap" @scroll="monitorScrollEvent">
      <div
        class="banner"
        ref="banner"
        :style="`background-image: url(${bannerMap.bannerImg ? bannerMap.bannerImg : bannerMap.newBannerImg ? bannerMap.newBannerImg : 'https://z3.ax1x.com/2021/07/26/WRhRns.png'});padding-top:${
          bannerMap.newBannerImg ? '360px' : '150px'
        }`"
      ></div>
      <div class="header" v-if="pageLoaded">
        <p class="one">{{ bannerMap.title }}</p>
        <p class="two" v-if="bannerMap.introduction">{{ bannerMap.introduction }}</p>
      </div>
      <div class="load-more-loading" v-if="!pageLoaded"><q-spinner color="primary" size="22px" :thickness="2" class="m-r-10" />努力加载中...</div>
      <div class="newsTopicSwiperList-container-wrap" v-if="pageLoaded && newsTopicSwiperList.length">
        <van-swipe class="newsTopicSwiperList-container" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(news, index) in newsTopicSwiperList" :key="index" class="newsTopicSwiperList-slide">
            <p class="title">{{ news.title }}</p>
            <p class="info">
              <span v-if="news.source">{{ news.source }}</span>
              <span>{{ news.updateTime | getDateDiff }}</span>
              <span>{{ news.commentsall }} 评</span>
            </p>
            <van-image class="thumbnail" :src="news.thumbnail" lazy-load />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="newsTopicSecondnavList" v-if="newsTopicSecondnavList.length">
        <li v-for="(item, index) in newsTopicSecondnavList" :key="index">
          <img :src="item.thumbnail" alt="" />
          <p class="title">{{ item.title }}</p>
        </li>
      </div>
      <div class="tabs-item-wrap" v-for="(_tab, _) in tabsList" :key="_" :class="_tab.id" :ref="_tab.id">
        <div class="tabs-item">
          <div class="tabs-item-title">
            <span class="index" v-if="_ < 9">0{{ _ + 1 }}</span>
            <span class="index" v-else>{{ _ + 1 }}</span>
            {{ _tab.name }}
            <div class="comment-sort" v-if="_tab.type === 'comment' && _tab.list && _tab.list.length" @click.stop.prevent="handlerClickCommentsSort(commentsSort.sortMethod)">
              <q-icon name="sort" class="icon"></q-icon>
              <span class="method"> {{ commentsSort.sortMethod }}</span>
              <q-spinner color="#afafaf" size="12px" :thickness="2" class="m-l-10" v-show="commentSorting" />
            </div>
          </div>
          <div v-for="(news, __) in _tab.list" :key="__">
            <li :class="[_tab.type]" v-if="_tab.type === 'column'" @click.stop.prevent="handleClickNewsItem(news)">
              <!-- doc -->
              <div v-if="(news.title && news.type === 'doc') || news.type === 'slide' || (news.type === 'topic2' && !news.newslist)" class="doc">
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
                <div class="text-red topLabel" v-if="news.topLabel" @click.stop.prevent="handlerClickToutiaoHotSpotMore">
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
                  <p class="joinCount">{{ news.vote.joinCount | numberFormat }}人参与投票，当前{{ news.vote.expire === '1' ? '投票进行中' : '投票已结束' }}</p>
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
                  <div class="right hide">
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
                  <div class="right hide">
                    <span class="follow">关注</span>
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
                <div class="text-red topLabel" v-if="news.topLabel" @click.stop.prevent="handlerClickToutiaoHotSpotMore">
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
                  <div class="share" @click.stop.prevent="handlerClickPhvideoShare(news)">
                    <span class="iconfont icon-fenxiang3"></span>
                    <span class="count">{{ news.share ? news.share : '分享' }}</span>
                  </div>
                </div>
              </div>
            </li>
            <li :class="[_tab.type]" v-if="_tab.type === 'comment'">
              <div class="comment-container">
                <div class="owner">
                  <div class="one">
                    <div class="l">
                      <img :src="news.faceurl" alt="" class="avatar" />
                      <img src="~assets/icon_hot.png" alt="" class="hot" v-if="news.isHot" />
                    </div>
                    <div class="m">
                      <div class="t">
                        <span class="uname"> {{ news.uname }}</span>
                        <span v-if="news.reply_uname">回复</span>
                        <span class="reply_uname" v-if="news.reply_uname">{{ news.reply_uname }}</span>
                      </div>
                      <div class="c">
                        {{ news.comment_contents }}
                        <div class="emojo" v-if="news.pics && news.pics.length">
                          <img :src="pic.url" alt="" v-for="(pic, picIndex) in news.pics" :key="picIndex" />
                        </div>
                      </div>
                      <div class="b">
                        <span class="time" v-if="news.comment_date">{{ news.comment_date | getDateDiff }}</span>
                        <span class="split"></span>
                        <span class="reply">回复</span>
                      </div>
                    </div>
                    <div class="r">
                      <span class="like">{{ news.uptimes }}</span>
                      <q-icon name="favorite_border" class="icon"></q-icon>
                      <q-icon name="close" class="close"></q-icon>
                    </div>
                  </div>
                  <div v-if="news.children.comments.length" class="two">
                    <div class="child" v-for="(child, ___) in news.children.comments" :key="___">
                      <div class="l">
                        <img :src="child.faceurl" alt="" class="avatar" />
                        <img src="~assets/icon_hot.png" alt="" class="hot" v-if="child.isHot" />
                      </div>
                      <div class="m">
                        <div class="t">
                          <span class="uname"> {{ child.uname }}</span>
                          <br />
                          <span v-if="child.reply_uname">回复</span>
                          <span class="reply_uname" v-if="child.reply_uname">{{ child.reply_uname }}</span>
                        </div>
                        <div class="c">
                          {{ child.comment_contents }}
                          <div class="emojo" v-if="child.pics && child.pics.length">
                            <img :src="pic.url" alt="" v-for="(pic, picIndex) in child.pics" :key="picIndex" />
                          </div>
                        </div>
                        <div class="b">
                          <span class="time" v-if="child.comment_date">{{ child.comment_date | getDateDiff }}</span>
                          <span class="split"></span>
                          <span class="reply">回复</span>
                        </div>
                      </div>
                      <div class="r">
                        <span class="like">{{ child.uptimes }}</span>
                        <q-icon name="favorite_border" class="icon"></q-icon>
                        <q-icon name="close" class="close"></q-icon>
                      </div>
                    </div>
                    <div class="more" @click.stop.prevent="handlerClickComentsChildMore(news)" v-if="news.children.comments.length < Number(news.children.count)">
                      查看更多
                      <q-icon name="expand_circle_down" class="arrow"></q-icon>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </div>
        </div>
      </div>
      <div class="load-more-loading" v-show="load_more_no_data">暂无数据</div>
      <div class="load-more-loading" v-show="load_more_loading">
        <q-spinner color="#969799" size="20px" :thickness="2" />
        加载中...
      </div>
    </div>
    <div class="page-fixed-bottom" v-if="pageLoaded">
      <div class="input">我来说两句</div>
      <div class="comment">
        <van-badge :content="commentsMap.join_count">
          <i class="iconfont icon-duanxin"></i>
        </van-badge>
      </div>
      <div class="share">
        <i class="iconfont icon-fenxiang3"></i>
      </div>
    </div>
    <van-popup v-model="showCommentsChildrenMore" position="bottom" :style="{ height: '90%' }" round ref="van-popup-for-comments-children">
      <div class="comment-children-more-container">
        <div class="header">评论详情</div>
        <div class="comments" ref="comment-children-more">
          <div class="load-more-loading" v-show="commentsChildrenMoreLoading">
            <q-spinner color="#969799" size="20px" :thickness="2" />
            加载中...
          </div>
          <li v-if="commentsOwnerMap.faceurl">
            <div class="l">
              <img :src="commentsOwnerMap.faceurl" alt="" class="avatar" />
              <img src="~assets/icon_hot.png" alt="" class="hot" v-if="commentsOwnerMap.isHot" />
            </div>
            <div class="m">
              <div class="t">
                <span class="uname"> {{ commentsOwnerMap.uname }}</span>
                <span v-if="commentsOwnerMap.reply_uname">回复</span>
                <span class="reply_uname" v-if="commentsOwnerMap.reply_uname">{{ commentsOwnerMap.reply_uname }}</span>
              </div>
              <div class="c">{{ commentsOwnerMap.comment_contents }}</div>
              <div class="b">
                <span class="time" v-if="commentsOwnerMap.comment_date">{{ commentsOwnerMap.comment_date | getDateDiff }}</span>
                <span class="split"></span>
                <span class="reply">回复</span>
              </div>
            </div>
            <div class="r">
              <span class="like">{{ commentsOwnerMap.uptimes }}</span>
              <q-icon name="favorite_border" class="icon"></q-icon>
              <q-icon name="close" class="close"></q-icon>
            </div>
          </li>
          <li v-for="(child, index) in commentsChildrenMoreList" :key="index">
            <div class="l">
              <img :src="child.faceurl" alt="" class="avatar" />
              <img src="~assets/icon_hot.png" alt="" class="hot" v-if="child.isHot" />
            </div>
            <div class="m">
              <div class="t">
                <span class="uname"> {{ child.uname }}</span>
                <span v-if="child.reply_uname">回复</span>
                <span class="reply_uname" v-if="child.reply_uname">{{ child.reply_uname }}</span>
              </div>
              <div class="c">{{ child.comment_contents }}</div>
              <div class="b">
                <span class="time" v-if="child.comment_date">{{ child.comment_date | getDateDiff }}</span>
                <span class="split"></span>
                <span class="reply">回复</span>
              </div>
            </div>
            <div class="r">
              <span class="like">{{ child.uptimes }}</span>
              <q-icon name="favorite_border" class="icon"></q-icon>
              <q-icon name="close" class="close"></q-icon>
            </div>
          </li>
        </div>
        <div class="footer">
          <div class="input">我来说两句</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { NewsTopicModule } from 'src/store/modules/news_topic';
import { handlerQuasarShare } from 'src/utils/share';
import { ImagePreview } from 'vant';
import { AppModule } from 'src/store/modules/app';
import { CommentsModule } from 'src/store/modules/comment';
import { getUrlParams, json2Url } from '@/utils';
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
    await this.$nextTick(async () => {
      this.$refs['news-topic-wrap'].style['height'] = `${window.innerHeight - 46}px`;
      for (let item of this.tabsList) {
        const $dom: any = this.$refs[item.id][0];
        this.tabsOffsetTopInterregional.push($dom.offsetTop - 40);
      }
      this.tabsOffsetTopInterregional.push(this.$refs['news-topic-wrap'].scrollHeight);
      this.$dom = this.$refs['news-topic-wrap'];
      this.$tabs = this.$refs['tab-name'];
      this.$tabsChildren = this.$refs['tab-name'].children;
    });
    this.pageLoaded = true;
  }
  /*data*/
  private pageLoaded = false;
  private activeShow = false;
  private activeTabIndex = 0;
  private $dom: any;
  private $tabs: any;
  private $tabsChildren: any;
  private tabsOffsetTopInterregional: number[] = [0];
  private tabsList: any[] = [];
  private newsTopicSwiperList: any[] = [];
  private newsTopicSecondnavList: any[] = [];
  private commentsChildrenMoreList: any[] = [];
  private commentsOwnerMap: any = {};
  private bannerMap: any = {};
  private commentsPaginationParams = {
    num: 1,
    orderby: 'integral',
    pagesize: '10',
  };
  private commentsSort = {
    sortMethod: '按时间',
  };
  private commentsMap = {
    count: 0,
    join_count: 0,
    comments: [],
    allow_comment: 1,
  };
  private commentSorting = false;
  private load_more_loading_lock = false;
  private load_more_loading = false;
  private load_more_no_data = '';
  private showCommentsChildrenMore = false;
  private commentsChildrenMoreLoading = false;
  /*event */
  private async monitorScrollEvent() {
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
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - 46 >= this.$refs['news-topic-wrap'].scrollHeight) {
      if (!this.load_more_loading_lock && this.tabsList[this.tabsList.length - 1] && this.tabsList[this.tabsList.length - 1].type === 'comment') {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.commentsPaginationParams.num++;
        await this._getCommentsMore();
        this.load_more_loading_lock = false;
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
  private handleClickNewsItem(news: any) {
    let params;
    let urlStr: string;
    switch (news.type) {
      case 'doc':
        params = getUrlParams(news.link.url);
        urlStr = json2Url(params);
        this.$router.push(`/news_detail/doc?${urlStr}`);
        break;
      case 'short':
        params = getUrlParams(news.link.url);
        urlStr = json2Url(params);
        this.$router.push(`/news_detail/imglist?${urlStr}`);
        break;
      case 'phvideo':
        params = {
          guid: news.link.url,
          title: news.title,
          doc_url: news.commentsUrl,
          type: 'video',
        };
        params = Object.assign(params, getUrlParams(news.link.weburl));
        urlStr = `${json2Url(params)}&${news.link.queryString}`;
        this.$router.push(`/news_detail/video?${urlStr}`);
        break;
      default:
        break;
    }
  }
  /*http */
  private handlerClickComentsChildMore(news: any) {
    this.commentsOwnerMap = {};
    this.commentsChildrenMoreList = [];
    this.commentsChildrenMoreLoading = true;
    this.showCommentsChildrenMore = true;
    this.$nextTick(async () => {
      this.$refs['comment-children-more'].style['height'] = `${this.$refs['van-popup-for-comments-children'].$el.clientHeight - 50 - 38}px`;
      const params = {
        doc_url: news.doc_url,
        comment_id: news.comment_id,
        p: '1',
        pagesize: news.children.count,
      };
      const result = await CommentsModule.getCommentsChildren({ params });
      this.commentsOwnerMap = news;
      this.commentsChildrenMoreList = result.comments;
      this.commentsChildrenMoreLoading = false;
    });
  }
  private async handlerClickCommentsSort(method: string) {
    if (this.commentSorting) {
      return;
    }
    this.commentSorting = true;
    this.commentsSort.sortMethod = method === '按热度' ? '按时间' : '按热度';
    this.commentsPaginationParams.num = 1;
    this.commentsPaginationParams.orderby = method === '按热度' ? 'integral' : 'create_time';
    let commentParams: any = {
      doc_url: this.$route.query.topicid.indexOf('ucms_') !== -1 ? this.$route.query.topicid : `ucms_${this.$route.query.topicid}`,
      p: this.commentsPaginationParams.num,
      orderby: this.commentsPaginationParams.orderby,
      pagesize: this.commentsPaginationParams.pagesize,
    };
    const commentResult = await CommentsModule.getComments({ params: commentParams });
    this.tabsList[this.tabsList.length - 1].list = commentResult.comments;
    this.commentsMap = commentResult;
    this.commentSorting = false;
  }
  private async _getNewTopic() {
    try {
      let params = {
        topicid: this.$route.query.topicid,
      };
      let commentParams: any = {
        doc_url: this.$route.query.topicid.indexOf('ucms_') !== -1 ? this.$route.query.topicid : `ucms_${this.$route.query.topicid}`,
        p: this.commentsPaginationParams.num,
        orderby: this.commentsPaginationParams.orderby,
        pagesize: this.commentsPaginationParams.pagesize,
      };
      const result = await NewsTopicModule.getNewsTopic({ params });
      const commentResult = await CommentsModule.getComments({ params: commentParams });
      const { meta, body } = result.data;
      this.bannerMap = meta;
      if (meta.slide) {
        this.newsTopicSwiperList = meta.slide;
      }
      for (let item of body) {
        if (item.type === 'column') {
          for (let data of item.data) {
            this.tabsList.push({
              name: data.title,
              id: window.escape(data.title),
              list: data.items,
              type: 'column',
            });
          }
        } else if (item.type === 'secondnav') {
          this.newsTopicSecondnavList = item.data;
        }
      }
      this.commentsMap = commentResult;
      this.tabsList.push({ name: '热门评论', id: window.escape('热门评论'), list: commentResult.comments, type: 'comment' });
      return Promise.resolve(true);
    } catch (err) {
      console.log('err', err);
      return Promise.reject();
    }
  }
  private async _getCommentsMore() {
    let commentParams: any = {
      doc_url: this.$route.query.topicid.indexOf('ucms_') !== -1 ? this.$route.query.topicid : `ucms_${this.$route.query.topicid}`,
      p: this.commentsPaginationParams.num,
      orderby: this.commentsPaginationParams.orderby,
      pagesize: this.commentsPaginationParams.pagesize,
    };
    try {
      const commentResult = await CommentsModule.getComments({ params: commentParams });
      if (!commentResult.comments.length) {
        this.load_more_no_data = '没有更多数据了';
        this.load_more_loading_lock = true;
        this.load_more_loading = false;
        return Promise.reject();
      } else {
        this.tabsList[this.tabsList.length - 1].list = this.tabsList[this.tabsList.length - 1].list.concat(commentResult.comments);
        this.commentsMap = commentResult;
      }
      return Promise.resolve(true);
    } catch (error) {
      console.log('err', error);
      return Promise.reject();
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
