<template>
  <div class="yule-theme-container">
    <div class="header">
      <q-icon name="arrow_back_ios" class="icon" @click="handlerClickHeaderBack"></q-icon>
      <span>{{ themeTitle }}</span>
    </div>
    <div class="load-more-loading" v-show="firstLoadData">加载中...</div>
    <div class="yule-theme-wrap" ref="yule-theme-wrap" @scroll="monitorScroll" v-if="!pageLoading"></div>
    <div class="load-more-loading" v-show="load_more_no_data">暂无数据</div>
    <div class="load-more-loading" v-show="load_more_loading" v-if="!pageLoading">
      <q-spinner color="#969799" size="20px" :thickness="2" />
      加载中...
    </div>
  </div>
</template>

<script lang="ts">
import { TabHomeYuleModule } from 'src/store/modules/tab_home_yule';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  $refs: any;
  created() {
    this.themeTitle = this.$route.query.theme_title;
    this.themeIndex = this.$route.query.index;
    this.getDataByThemeIndex(this.themeIndex);
  }
  mounted() {
    this.$refs['yule-theme-wrap'].style['height'] = window.innerHeight - 50 + 'px';
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
  private monitorScroll(e: any) {
    const scrollHeight = this.$refs['yule-theme--container'].scrollHeight;
    const scrollTop = this.$refs['yule-theme--container'].scrollTop;
    this.containerPositionY = scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight >= scrollHeight) {
      if (!this.load_more_loading_lock) {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.pageNum++;
        this.getMoreDataByThemeIndex(this.themeIndex);
        this.load_more_loading_lock = false;
      }
    }
  }
  private async getDataByThemeIndex(index: any) {
    this.pageLoading = true;
    this.firstLoadData = true;
    this.themeNewsList = [];
    switch (index) {
      case 0:
        await this._getChasingHotSpot();
        break;
      case 1:
        await this._getVeryMuchDao();
        break;
      case 2:
        await this._getUpConstellation();
        break;
      case 3:
        await this._getPublicScreeningCeremony();
        break;
      default:
        break;
    }
    this.firstLoadData = false;
    this.pageLoading = false;
  }
  private async getMoreDataByThemeIndex(index: any) {
    switch (index) {
      case 0:
        await this._getChasingHotSpotMore();
        break;
      case 1:
        await this._getVeryMuchDaoMore();
        break;
      case 2:
        await this._getUpConstellationMore();
        break;
      case 3:
        await this._getPublicScreeningCeremonyMore();
        break;
      default:
        break;
    }
  }
  private handlerClickHeaderBack() {
    this.$router.back();
  }
  /*http*/
  private async _getChasingHotSpot() {
    const result = TabHomeYuleModule.getChasingHotSpot({ page: this.pageNum });
  }
  private async _getVeryMuchDao() {}
  private async _getUpConstellation() {}
  private async _getPublicScreeningCeremony() {}

  private async _getChasingHotSpotMore() {
    const result = TabHomeYuleModule.getChasingHotSpot({ page: this.pageNum });
  }
  private async _getVeryMuchDaoMore() {}
  private async _getUpConstellationMore() {}
  private async _getPublicScreeningCeremonyMore() {}
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