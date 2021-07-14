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
        @keyup.enter.native="getSearchList"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <span class="back" @click="handlerClickBack"> 取消 </span>
    </div>
    <div class="tab-slide-page-search-wrapper" ref="tab-slide-page-search-wrapper">
      <div class="recomend" v-if="!inSearch">
        <ul class="search-history" v-for="(item, index) in searchHistory" :key="item + String(Math.random() + index)"></ul>
        <p class="loading" v-show="loadRecommend">加载中...</p>
        <ul class="hotList">
          <li v-for="(item, index) in hotList" :key="index">
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
        <ul class="result"></ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { TabHomeModule } from 'src/store/modules/tab_home';
import { Component, Vue } from 'vue-property-decorator';

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
  private searchHistory = [];
  private hotList = [];
  private exclusiveList = [];
  private exclusiveListTitle = '';
  private loadRecommend = true;
  private inSearch = false;
  private inGuess = false;
  private searchResult = [];
  private searchResultLoading = false;
  private searchResultNoData = '';
  private searchResultTabs = ['综合', '视频', '图集', '用户'];
  private searchResultActiveIndex = 0;
  private guessKey = [];
  private guessKeyLoading = false;
  private guessKeyNoData = '';

  /*event*/
  private handlerClickBack() {
    TabHomeModule.SET_showSlidePage({ status: false, name: '' });
  }
  private handlerClickHotListMore() {
    TabHomeModule.SET_showSlidePage({ status: true, name: 'hot', index: 0 });
  }
  private handlerClickSerachResultTab(index: number) {
    this.searchResultActiveIndex = index;
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
  }
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
  }
}
</script>
<style lang="scss" scoped>
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
      .result {
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