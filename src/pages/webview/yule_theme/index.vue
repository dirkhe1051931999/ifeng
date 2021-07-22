<template>
  <div class="yule-theme-container">
    <div class="header">
      <q-icon name="arrow_back_ios" class="icon" @click="handlerClickHeaderBack"></q-icon>
      <span class="theme-title">{{ themeTitle }}</span>
    </div>
    <div class="yule-theme-wrap" ref="yule-theme-wrap" @scroll="monitorScroll">
      <div class="load-more-loading" v-show="firstLoadData">加载中...</div>
      <ul>
        <li v-for="news in themeNewsList" :key="news.id">
          <van-image class="thumbnail" :src="news.thumbnails" lazy-load />
          <p class="news-title">{{ news.title }}</p>
        </li>
      </ul>
      <div class="load-more-loading" v-show="load_more_no_data">暂无数据</div>
      <div class="load-more-loading" v-show="load_more_loading && !load_more_no_data" v-if="!pageLoading">
        <q-spinner color="#969799" size="20px" :thickness="2" />
        加载中...
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TabHomeYuleModule } from 'src/store/modules/tab_home_yule';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  $refs: any;
  async mounted() {
    this.themeTitle = this.$route.query.theme_title;
    this.themeIndex = Number(this.$route.query.theme);
    this.pageLoading = true;
    this.firstLoadData = true;
    this.themeNewsList = [];
    await this._getData(this.themeIndex);
    this.firstLoadData = false;
    this.pageLoading = false;
    this.$nextTick(() => {
      this.$refs['yule-theme-wrap'].style['height'] = window.innerHeight - 50 + 'px';
    });
  }
  /*data */
  private themeTitle: any = '';
  private pageNum = 1;
  private themeIndex: any = 0;
  private containerPositionY = 0;
  private firstLoadData = false;
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private pageLoading = false;
  private load_more_no_data = '';
  private themeNewsList = [];
  /*event*/
  private async monitorScroll(e: any) {
    const scrollHeight = this.$refs['yule-theme-wrap'].scrollHeight;
    const scrollTop = this.$refs['yule-theme-wrap'].scrollTop;
    this.containerPositionY = scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - 50 >= scrollHeight) {
      if (!this.load_more_loading_lock) {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.pageNum++;
        await this._getDataMore(this.themeIndex);
        this.load_more_loading_lock = false;
      }
    }
  }
  private handlerClickHeaderBack() {
    this.$router.back();
  }
  /*http*/
  private async _getData(index: number) {
    try {
      let _result: any;
      if (index === 0) {
        _result = await TabHomeYuleModule.getChasingHotSpot({ page: this.pageNum });
      } else if (index === 1) {
        _result = await TabHomeYuleModule.getVeryMuchDao({ page: this.pageNum });
      } else if (index === 2) {
        _result = await TabHomeYuleModule.getUpConstellation({ page: this.pageNum });
      } else if (index === 3) {
        _result = await TabHomeYuleModule.getPublicScreeningCeremony({ page: this.pageNum });
      }
      _result = _result.slice(2, -1);
      _result = JSON.parse(_result);
      let { data, result } = _result.data;
      this.themeNewsList = data ? data : result;
      return Promise.resolve(true);
    } catch (e) {
      console.log(e, 'err');
      return Promise.reject();
    }
  }
  private async _getDataMore(index: number) {
    try {
      let _result: any;
      if (index === 0) {
        _result = await TabHomeYuleModule.getChasingHotSpot({ page: this.pageNum });
      } else if (index === 1) {
        _result = await TabHomeYuleModule.getVeryMuchDao({ page: this.pageNum });
      } else if (index === 2) {
        _result = await TabHomeYuleModule.getUpConstellation({ page: this.pageNum });
      } else if (index === 3) {
        _result = await TabHomeYuleModule.getPublicScreeningCeremony({ page: this.pageNum });
      }
      _result = _result.slice(2, -1);
      _result = JSON.parse(_result);
      let { data, result } = _result.data;
      if ((data && !data.length) || (result && !result.length)) {
        this.load_more_no_data = '没有更多数据了';
        this.load_more_loading_lock = true;
        return Promise.reject();
      }
      if (data) {
        this.themeNewsList = this.themeNewsList.concat(data);
      } else {
        this.themeNewsList = this.themeNewsList.concat(result);
      }
      return Promise.resolve(true);
    } catch (e) {
      console.log(e, 'err');
      return Promise.reject();
    }
  }
}
</script>


<style lang="scss" scoped>
.yule-theme-container {
  background: #f7f7f7;
  .header {
    display: flex;
    align-items: center;
    height: 50px;
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    top: 0;
    background: $white;
    .icon {
      display: block;
      width: 45%;
      font-size: 22px;
      text-align: left;
    }
    .theme-title {
      width: 55%;
      text-align: left;
    }
  }
  .yule-theme-wrap {
    overflow: scroll;
    position: fixed;
    left: 0;
    top: 50px;
    width: 100%;
    box-sizing: border-box;
    ul {
      width: 100%;
      padding: 0 16px;

      li {
        margin-top: 10px;
        margin-bottom: 10px;
        background: $white;
        .thumbnail {
          width: 100%;
          height: 195px;
        }
        .news-title {
          padding: 15px 10px;
          font-weight: bold;
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