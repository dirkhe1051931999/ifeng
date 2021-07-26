<template>
  <div class="tab-slide-page-search">
    <div class="header">
      <q-input
        color="grey"
        v-model="searchText"
        label="搜索新闻、视频、图集和用户"
        dense
        class="w-p-86"
        outlined
        clearable
        debounce="300"
        @input="getSearchRecWord"
        @keyup.enter.native="handlerEnterKeyboard"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <span class="back" @click="handlerClickBack"> 取消 </span>
    </div>
    <div class="tab-slide-page-search-wrapper" ref="tab-slide-page-search-wrapper" @scroll="monitorScrollEvent">
      <div class="recomend" v-if="!inSearch">
        <ul class="search-history" v-if="searchHistory.length">
          <div class="title">
            <span>搜索历史</span>
            <q-icon name="delete_forever" class="icon" @click="handlerClickRemoveAllSearchHistory"></q-icon>
          </div>
          <li v-for="(item, index) in searchHistory" :key="item + String(Math.random() + index)">
            {{ item }}
            <q-icon name="cancel" class="icon" @click="handlerClickRemoveSearchHistory(index)"></q-icon>
          </li>
        </ul>
        <p class="loading" v-show="loadRecommend">加载中...</p>
        <ul class="hotList">
          <li v-for="(item, index) in hotList" :key="index" @click="handlerCLickHotListItem(item)">
            <span class="index" :class="{ 'text-red': index === 0, 'text-orange-10': index === 1, 'text-orange-8': index === 2 }">{{
              index + 1
            }}</span>
            <span class="tag" v-if="item.style.recomTag">{{ item.style.recomTag.text }}</span>
            <span class="title">{{ item.title }}</span>
            <q-icon name="arrow_downward" v-if="item.hotTrend === '0'" class="text-blue fs-16 arrow"></q-icon>
            <q-icon name="arrow_upward" v-if="item.hotTrend === '1'" class="text-red fs-16 arrow"></q-icon>
          </li>
          <li class="more" @click="handlerClickHotListMore" v-if="hotList.length">
            查看完整榜单
            <span class="iconfont icon-more1"></span>
          </li>
        </ul>
        <p class="exclusiveListTitle" v-if="exclusiveList.length">{{ exclusiveListTitle }}</p>
        <ul class="exclusiveList">
          <li v-for="(item, index) in exclusiveList" :key="index">
            <van-image class="thumbnail" :src="item.thumbnail" lazy-load radius="6" />
            <p class="title text-dot-1 m-b-10">
              <q-icon name="grid_3x3" class="text-red"></q-icon>
              {{ item.title }}
            </p>
          </li>
        </ul>
      </div>
      <ul class="guess-key" v-if="inSearch && inGuess">
        <p class="loading" v-show="guessKeyLoading">加载中...</p>
        <p class="no-data" v-show="guessKeyNoData">{{ guessKeyNoData }}</p>
        <li v-for="(item, index) in guessKey" :key="index">
          <span class="tag" v-if="item.style && item.style.recomTag && item.style.recomTag.text">{{ item.style.recomTag.text }}</span>
          <img class="topic-icon" v-if="item.style && item.style.recomTag && !item.style.recomTag.text" src="~assets/icon-topic.png" />
          <img v-if="item.logo" :src="item.logo" class="logo" />
          <span class="text">{{ item.cateName }}</span>
          <img src="~assets/icon-new.png" alt="" v-if="item.newIcon" class="new-icon" />
          <q-icon name="arrow_forward_ios" class="arrow" v-if="!item.logo"></q-icon>
        </li>
      </ul>
      <div class="search-result" v-if="inSearch && !inGuess">
        <ul class="tabs">
          <li
            v-for="(item, index) in searchResultTabs"
            :key="index"
            @click="handlerClickSerachResultTab(index)"
            :class="{ active: index === searchResultActiveIndex }"
          >
            {{ item }}
          </li>
        </ul>
        <div v-if="searchResultLoading" class="loading">加载中...</div>
        <div v-else>
          <ul class="result" v-for="news in searchResult" :key="news.id">
            <!-- user -->
            <div class="sub" v-if="news.type === 'sub'">
              <div class="left">
                <van-image class="thumbnail" :src="news.logo" lazy-load width="32" height="32" radius="32"></van-image>
              </div>
              <div class="middle">
                <p class="name">{{ news.Catename }}</p>
                <p class="desc">{{ news.Description }}</p>
              </div>
              <div class="right">订阅</div>
            </div>
            <!-- theme -->
            <div v-if="news.type === 'theme'" class="theme shadow-5">
              <div class="top">
                <div class="info">
                  <q-icon name="grid_3x3" class="icon"></q-icon>
                  <p class="title">{{ news.title }}</p>
                </div>
                <van-image class="thumbnail" :src="news.thumbnail" lazy-load></van-image>
              </div>
              <div class="middle p-l-16 p-r-16" v-if="news.newslist">
                <li v-for="(item, index) in news.newslist" :key="index" class="doc">
                  <div class="top">
                    <div class="left">
                      <p class="title">
                        <span class="text-red title-label" v-if="item.style.recomTag && item.style.recomTag.pos">{{ item.style.recomTag.text }}</span>
                        <span v-html="item.title" class="text-dot-2"></span>
                      </p>
                    </div>
                    <div class="right" v-if="item.thumbnail">
                      <van-image class="thumbnail" :src="item.thumbnail" lazy-load radius="6" />
                    </div>
                  </div>
                  <div class="text-red topLabel" v-if="item.topLabel" @click="handlerClickToutiaoHotSpotMore">
                    <span class="iconfont icon-hot text-red m-r-5"></span>{{ item.topLabel.desp }}
                    <q-icon name="arrow_right" class="fs-16"></q-icon>
                  </div>
                  <div v-if="item.summary" class="hot-comment">
                    <span class="label">{{ item.summary.tag }}</span>
                    {{ item.summary.desp }}
                  </div>
                  <div class="vote" v-if="item.vote">
                    <div v-for="(item, index) in item.vote.result" :key="index" class="question">
                      <p class="title">{{ index + 1 }}. {{ item.resultArray.question }}</p>
                      <ul>
                        <li v-for="(option, index) in item.resultArray.option" :key="index">
                          <span v-html="option.title"></span>
                        </li>
                      </ul>
                    </div>
                    <p class="joinCount">
                      {{ item.vote.joinCount | numberFormat }}人参与投票，当前{{ item.vote.expire === '1' ? '投票进行中' : '投票已结束' }}
                    </p>
                  </div>
                  <div class="bottom">
                    <span v-if="item.style.recomTag && item.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
                    <span v-if="item.style.recomTag && !item.style.recomTag.pos" class="label-blue">{{ item.style.recomTag.text }}</span>
                    <span class="source" v-if="item.source">{{ item.source }}</span>
                    <i class="iconfont icon-duanxin" v-if="item.commentsall"></i>
                    <span class="count" v-if="item.commentsall"> {{ item.commentsall }}</span>
                    <i class="iconfont icon-lishi" v-if="item.updateTime"></i>
                    <span class="count" v-if="item.updateTime">{{ item.updateTime | getDateDiff }}</span>
                  </div>
                </li>
              </div>
              <div class="b">
                <span class="more">查看更多内容</span>
                <span class="iconfont icon-more1 icon"></span>
              </div>
            </div>
            <!-- videolink -->
            <div v-if="news.type === 'videoLink'" class="videolink">
              <div class="top" v-html="news.title"></div>
              <van-image class="thumbnail" :src="news.thumbnail" lazy-load radius="6"></van-image>
              <div class="summary" v-if="news.summary" v-html="news.summary.desp"></div>
            </div>
            <!-- searchrelate -->
            <div class="searchrelate" v-if="news.type === 'searchrelate' || news.type === 'hotspot'">
              <div class="top">
                <q-icon name="grid_3x3" class="icon text-red fs-24"></q-icon>
                <span class="title fs-18">{{ news.title }}</span>
              </div>
              <div class="list">
                <ul>
                  <li v-for="(item, index) in news.newslist" :key="index" class="doc">
                    <div class="top">
                      <div class="left">
                        <p class="title">
                          <span class="text-red title-label" v-if="item.style.recomTag && item.style.recomTag.pos">{{
                            item.style.recomTag.text
                          }}</span>
                          <span v-html="item.title"></span>
                        </p>
                      </div>
                      <div class="right" v-if="item.thumbnail">
                        <van-image class="thumbnail" :src="item.thumbnail" lazy-load radius="6" />
                      </div>
                    </div>
                    <div class="text-red topLabel" v-if="item.topLabel" @click="handlerClickToutiaoHotSpotMore">
                      <span class="iconfont icon-hot text-red m-r-5"></span>{{ item.topLabel.desp }}
                      <q-icon name="arrow_right" class="fs-16"></q-icon>
                    </div>
                    <div v-if="item.summary" class="hot-comment">
                      <span class="label">{{ item.summary.tag }}</span>
                      {{ item.summary.desp }}
                    </div>
                    <div class="vote" v-if="item.vote">
                      <div v-for="(item, index) in item.vote.result" :key="index" class="question">
                        <p class="title">{{ index + 1 }}. {{ item.resultArray.question }}</p>
                        <ul>
                          <li v-for="(option, index) in item.resultArray.option" :key="index">
                            <span v-html="option.title"></span>
                          </li>
                        </ul>
                      </div>
                      <p class="joinCount">
                        {{ item.vote.joinCount | numberFormat }}人参与投票，当前{{ item.vote.expire === '1' ? '投票进行中' : '投票已结束' }}
                      </p>
                    </div>
                    <div class="bottom">
                      <span v-if="item.style.recomTag && item.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
                      <span v-if="item.style.recomTag && !item.style.recomTag.pos" class="label-blue">{{ item.style.recomTag.text }}</span>
                      <span class="source" v-if="item.source">{{ item.source }}</span>
                      <i class="iconfont icon-duanxin" v-if="item.commentsall"></i>
                      <span class="count" v-if="item.commentsall"> {{ item.commentsall }}</span>
                      <i class="iconfont icon-lishi" v-if="item.updateTime"></i>
                      <span class="count" v-if="item.updateTime">{{ item.updateTime | getDateDiff }}</span>
                    </div>
                  </li>
                  <div class="more">
                    <span class="text">查看更多内容</span>
                    <span class="iconfont icon-more1 icon"></span>
                  </div>
                </ul>
              </div>
            </div>
            <!-- doc -->
            <div v-if="news.type === 'doc' || (news.type === 'topic2' && !news.newslist)" class="doc">
              <div class="top">
                <div class="left">
                  <p class="title">
                    <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.pos">{{ news.style.recomTag.text }}</span>
                    <span v-html="news.title"></span>
                  </p>
                </div>
                <div class="right" v-if="news.thumbnail">
                  <van-image class="thumbnail" :src="news.thumbnail" lazy-load radius="6" />
                </div>
              </div>
              <div class="text-red topLabel" v-if="news.topLabel">
                <span class="iconfont icon-hot text-red m-r-5"></span>{{ news.topLabel.desp }} <q-icon name="arrow_right" class="fs-16"></q-icon>
              </div>
              <div v-if="news.summary" class="hot-comment">
                <span class="label">{{ news.summary.tag }}</span>
                {{ news.summary.desp }}
              </div>
              <div class="vote" v-if="news.vote">
                <div v-for="(item, index) in news.vote.result" :key="index" class="question">
                  <p class="title">{{ index + 1 }}. {{ item.resultArray.question }}</p>
                  <ul>
                    <li v-for="(option, index) in item.resultArray.option" :key="index">
                      <span v-html="option.title"></span>
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
            <div v-if="news.type === 'short' || news.type === 'slide'" class="short w-full">
              <div class="top flex j-between a-top hide">
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
              <div class="intro p-b-10 fs-18" v-if="news.intro || news.title">
                <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.pos">{{ news.style.recomTag.text }}</span>
                <span v-html="news.intro ? news.intro : news.title" class="text-dot-3"></span>
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
              <div class="top flex j-between a-top hide">
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
                <span v-html="news.intro ? news.intro : news.title"></span>
              </div>
              <div class="video-placeholder">
                <img v-if="news.seriesTag" src="https://x0.ifengimg.com/cmpp/2021/0401/ced142b6f5d6dc0size6_w144_h60.png" alt="" class="seriesTag" />
                <van-image :src="news.imageList[0].url" alt="" class="placeholder" radius="6" />
                <img src="~assets/play-video-button.png" alt="" class="play-video-button" />
                <p class="video-total-time" v-if="news.phvideo.length - news.phvideo.preview - news.phvideo.previewlength === news.phvideo.length">
                  {{ news.phvideo.length | getVideoTotalTime }}
                </p>
                <p class="video-total-time" v-else>
                  {{ (news.phvideo.length - news.phvideo.preview - news.phvideo.previewlength) | getVideoTotalTime }}
                </p>
              </div>
              <div class="text-red topLabel" v-if="news.topLabel">
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
          </ul>
          <p class="loading" v-show="loadMoreLoading" style="padding-top: 10px">加载中...</p>
          <p class="no-data" v-show="loadMoreNoData" style="padding-top: 10px">没有更多了</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { get_user_search_history, remove_user_search_history, set_user_search_history } from 'src/utils/db';
import { TabHomeModule } from 'src/store/modules/tab_home';
import { Component, Vue } from 'vue-property-decorator';
import { cloneDeep } from 'lodash';

@Component({
  name: 'tabs_slide_page_search',
})
export default class extends Vue {
  $refs: any;
  async created() {
    await this._getSearchHotwordsReact();
    this.loadRecommend = false;
  }
  mounted() {
    const $wrapper = this.$refs['tab-slide-page-search-wrapper'];
    $wrapper.style['height'] = window.innerHeight - 56 + 'px';
  }
  private searchText = '';
  private hotList = [];
  private exclusiveList = [];
  private exclusiveListTitle = '';
  private loadRecommend = true;
  private inSearch = false;
  private inGuess = false;
  private searchResult = [];
  private searchResultLoading = false;
  private searchResultNoData = '';
  private loadMoreLoadingLock = false;
  private loadMoreLoading = false;
  private loadMoreNoData = false;
  private searchResultTabs = ['综合', '视频', '图集', '用户'];
  private searchResultActiveIndex = 0;
  private searchResultPagination = {
    page: 1,
  };
  private guessKey = [];
  private guessKeyLoading = false;
  private guessKeyNoData = '';
  private searchHistory: any = get_user_search_history() ? cloneDeep(get_user_search_history()) : [];
  /*event*/
  private handlerClickBack() {
    this.$router.back();
  }
  private handlerClickHotListMore() {
    this.$router.push('/tab_home_hot/0');
  }
  private handlerCLickHotListItem(item: any) {
    this.$router.push(`/news_topic?topicid=${item.staticId.split('_')[2]}`);
  }
  private async handlerClickSerachResultTab(index: number) {
    if (this.searchResultLoading) return;
    if (this.searchResultActiveIndex === index) return;
    this.searchResultActiveIndex = index;
    this.searchResultPagination.page = 1;
    switch (index) {
      case 0:
        await this.getSearchList();
        break;
      case 1:
        await this.getSearchTagList('video');
        break;
      case 2:
        await this.getSearchTagList('slide');
        break;
      case 3:
        await this.getSearchsubscribe();
        break;
      default:
        break;
    }
  }
  private handlerClickRemoveAllSearchHistory() {
    this.searchHistory = [];
    remove_user_search_history();
  }
  private handlerClickRemoveSearchHistory(index: number) {
    this.searchHistory.splice(index, 1);
    set_user_search_history(this.searchHistory);
  }
  private async handlerEnterKeyboard() {
    this.searchText = this.searchText.replace(/\s/gi, '');
    if (this.searchText === '' || this.searchText === null) return;
    if (this.searchHistory.length > 5) {
      this.searchHistory.pop();
    }
    this.searchHistory.unshift(this.searchText);
    set_user_search_history(this.searchHistory);
    switch (this.searchResultActiveIndex) {
      case 0:
        await this.getSearchList();
        break;
      case 1:
        await this.getSearchTagList('video');
        break;
      case 2:
        await this.getSearchTagList('slide');
        break;
      case 3:
        await this.getSearchsubscribe();
        break;
      default:
        break;
    }
  }
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['tab-slide-page-search-wrapper'].scrollHeight;
    const scrollTop = this.$refs['tab-slide-page-search-wrapper'].scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - 56 >= scrollHeight) {
      if (!this.loadMoreLoadingLock) {
        this.loadMoreLoading = true;
        this.loadMoreLoadingLock = true;
        this.searchResultPagination.page++;
        switch (this.searchResultActiveIndex) {
          case 0:
            await this.getSearchListMore();
            break;
          case 1:
            await this.getSearchTagListMore('video');
            break;
          case 2:
            await this.getSearchTagListMore('slide');
            break;
          case 3:
            await this.getSearchsubscribeMore();
            break;
          default:
            break;
        }
        this.loadMoreLoadingLock = false;
        this.loadMoreLoading = false;
      }
    }
  }
  /*http*/
  private async _getSearchHotwordsReact() {
    const result = await TabHomeModule.getSearchHotwordsReact({});
    this.hotList = result[0].item;
    this.exclusiveList = result[0].exclusiveList;
    this.exclusiveListTitle = result[0].exclusiveConfig.title;
    return Promise.resolve();
  }
  private async getSearchRecWord() {
    if (this.searchText === '' || this.searchText === null) {
      this.inSearch = false;
      this.guessKey = [];
      this.inGuess = false;
      this.searchResultActiveIndex = 0;
      this.searchResultPagination.page = 1;
      return;
    }
    this.inSearch = true;
    this.inGuess = true;
    this.guessKey = [];
    this.guessKeyLoading = true;
    this.guessKeyNoData = '';
    const result = await TabHomeModule.getSearchRecWord({ key: this.searchText });
    this.guessKey = result;
    if (!result || !result.length) {
      this.guessKeyNoData = '没有更多了';
    }
    this.guessKeyLoading = false;
    return Promise.resolve();
  }
  // 搜索综合
  private async getSearchList() {
    if (this.searchText === '' || this.searchText === null) {
      this.inSearch = false;
      this.inGuess = false;
      this.guessKey = [];
      this.searchResult = [];
      return;
    }
    this.inSearch = true;
    this.inGuess = false;
    this.guessKey = [];
    this.searchResult = [];
    this.guessKeyLoading = false;
    this.searchResultLoading = true;
    this.searchResultNoData = '';
    this.guessKeyNoData = '';
    const result = await TabHomeModule.getSearchList({ key: this.searchText, page: this.searchResultPagination.page });
    if (!result || !result.length || !result[0].item || !result[0].item.length) {
      this.loadMoreNoData = true;
      this.searchResult = [];
      this.searchResultLoading = false;
      return;
    }
    this.searchResult = result[0].item;
    this.searchResultLoading = false;
  }
  private async getSearchListMore() {
    const result = await TabHomeModule.getSearchList({ key: this.searchText, page: this.searchResultPagination.page });
    if (!result || !result.length || !result[0].item || !result[0].item.length) {
      this.loadMoreLoading = false;
      this.loadMoreNoData = true;
      return Promise.reject();
    } else {
      this.searchResult = this.searchResult.concat(result[0].item);
      return Promise.resolve();
    }
  }
  // 搜索视频和图片
  private async getSearchTagList(type: string) {
    if (this.searchText === '' || this.searchText === null) {
      this.inSearch = false;
      this.inGuess = false;
      this.guessKey = [];
      this.searchResult = [];
      return;
    }
    this.inSearch = true;
    this.inGuess = false;
    this.guessKey = [];
    this.searchResult = [];
    this.guessKeyLoading = false;
    this.searchResultLoading = true;
    this.searchResultNoData = '';
    this.guessKeyNoData = '';
    const result = await TabHomeModule.getSearchTagList({ key: this.searchText, page: this.searchResultPagination.page, type: type });
    if (!result || !result.length || !result[0].item || !result[0].item.length) {
      this.loadMoreNoData = true;
      this.searchResult = [];
      this.searchResultLoading = false;
      return;
    }
    this.searchResult = result[0].item;
    this.searchResultLoading = false;
  }
  private async getSearchTagListMore(type: string) {
    const result = await TabHomeModule.getSearchTagList({ key: this.searchText, page: this.searchResultPagination.page, type: type });
    if (!result || !result.length || !result[0].item || !result[0].item.length) {
      this.loadMoreLoading = false;
      this.loadMoreNoData = true;
      return Promise.reject();
    } else {
      this.searchResult = this.searchResult.concat(result[0].item);
      return Promise.resolve();
    }
  }
  // 搜索用户
  private async getSearchsubscribe() {
    if (this.searchText === '' || this.searchText === null) {
      this.inSearch = false;
      this.inGuess = false;
      this.guessKey = [];
      this.searchResult = [];
      return;
    }
    this.inSearch = true;
    this.inGuess = false;
    this.guessKey = [];
    this.searchResult = [];
    this.guessKeyLoading = false;
    this.searchResultLoading = true;
    this.searchResultNoData = '';
    this.guessKeyNoData = '';
    const result = await TabHomeModule.getSearchsubscribe({ key: this.searchText, page: this.searchResultPagination.page });
    if (!result || !result.data || !result.data.length) {
      this.loadMoreNoData = true;
      this.searchResult = [];
      this.searchResultLoading = false;
      return;
    }
    this.searchResult = result.data;
    this.searchResultLoading = false;
  }
  private async getSearchsubscribeMore() {
    const result = await TabHomeModule.getSearchsubscribe({ key: this.searchText, page: this.searchResultPagination.page });
    if (!result || !result.data || !result.data.length) {
      this.loadMoreLoading = false;
      this.loadMoreNoData = true;
      return Promise.reject();
    } else {
      this.searchResult = this.searchResult.concat(result.data);
      return Promise.resolve();
    }
  }
}
</script>
<style lang="scss">
.tab-slide-page-search {
  .tab-slide-page-search-wrapper {
    .search-result .result {
      em {
        color: $red;
        font-style: normal;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import './style/index.scss';
.tab-slide-page-search {
  .header {
    background: #ffffff;
    position: fixed;
    width: 100%;
    padding: 10px 16px;
    box-sizing: border-box;
    box-sizing: border-box;
    left: 0;
    top: 0;
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tab-slide-page-search-wrapper {
    width: 100%;
    position: fixed;
    top: 56px;
    left: 0;
    overflow: scroll;
    .recomend {
      .loading {
        text-align: center;
        padding-top: 20px;
        padding-bottom: 10px;
        font-size: 12px;
        color: #9a9696;
      }
      .search-history {
        padding: 0 16px;
        background: $white;
        margin-bottom: 10px;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        overflow-x: scroll;
        .title {
          width: 100%;
          margin-bottom: 10px;
          display: flex;
          height: 32px;
          align-items: center;
          justify-content: space-between;
          span {
            font-weight: bold;
          }
          .icon {
            color: #b8b5b5;
            font-size: 22px;
          }
        }
        li {
          padding: 4px 8px;
          padding-right: 24px;
          color: #9a9696;
          border: solid 1px #eeeeee;
          position: relative;
          border-radius: 12px;
          margin-bottom: 10px;
          min-width: 32px;
          margin-right: 10px;
          .icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 4px;
            color: #b8b5b5;
          }
        }
      }
      .hotList {
        padding: 0 16px;
        width: 100%;
        background: $white;
        margin-bottom: 10px;
        li {
          height: 48px;
          line-height: 48px;
          border-bottom: solid 1px #eeeeee;
          position: relative;
          &:last-child {
            border: 0;
          }
          &.more {
            text-align: center;
            font-size: 14px;
          }
          .index {
            font-size: 16px;
            margin-right: 10px;
          }
          .title {
            font-size: 16px;
          }
          .arrow {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
          }
          .tag {
            transform-origin: left top;
            font-size: 12px;
            background: #fee3e3;
            text-align: center;
            padding: 2px 3px;
            color: $red;
            border-radius: 4px;
            height: 16px;
            margin-right: 5px;
          }
        }
      }
      .exclusiveListTitle {
        padding: 0 16px;
        width: 100%;
        background: $white;
        height: 48px;
        line-height: 48px;
      }
      .exclusiveList {
        padding: 0 16px;
        width: 100%;
        background: $white;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        li {
          width: 48%;
          font-size: 14px;
          .thumbnail {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .search-result {
      background: $white;
      padding: 0 16px;
      .no-data {
        text-align: center;
        padding-top: 20px;
        padding-bottom: 10px;
        font-size: 12px;
        color: #9a9696;
      }
      .loading {
        text-align: center;
        padding-top: 20px;
        padding-bottom: 10px;
        font-size: 12px;
        color: #9a9696;
      }
      .tabs {
        display: flex;
        align-items: center;
        justify-content: center;
        li {
          width: 10%;
          text-align: center;
          height: 32px;
          margin-left: 5%;
          margin-right: 5%;
          line-height: 32px;
          &.active {
            font-weight: bold;
            border-bottom: solid 2px $red;
          }
        }
      }
    }
    .guess-key {
      background: $white;
      padding: 0 16px;
      .no-data {
        text-align: center;
        padding-top: 20px;
        padding-bottom: 10px;
        font-size: 12px;
        color: #9a9696;
      }
      .loading {
        text-align: center;
        padding-top: 20px;
        padding-bottom: 10px;
        font-size: 12px;
        color: #9a9696;
      }
      li {
        border-bottom: solid 1px #eeeeee;
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        padding-top: 10px;
        padding-bottom: 10px;
        &:last-child {
          border: 0;
        }
        .tag {
          transform-origin: left top;
          font-size: 12px;
          background: #fee3e3;
          text-align: center;
          padding: 2px 3px;
          color: $red;
          border-radius: 4px;
          height: 16px;
          margin-right: 5px;
        }
        .arrow {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        }
        .text {
          display: inline-block;
          margin-left: 5px;
          width: 70%;
        }
        .new-icon,
        .topic-icon {
          width: 16px;
          height: 16px;
          display: inline-block;
        }
        .topic-icon {
          margin-right: 15px;
        }
        .logo {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>