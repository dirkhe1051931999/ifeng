<template>
  <div class="caijing-stock-detail-container">
    <div class="header">
      <div class="l">
        <q-icon name="arrow_back_ios" @click="$router.back()"></q-icon>
      </div>
      <div class="c">
        <p class="name-code">
          <span class="name">{{ stockName.name || '--' }}</span>
          <span class="code">（{{ stockName.code || '--' }}）</span>
        </p>
        <p class="time">更新于 {{ lastUpdateTime || '--' }}</p>
      </div>
      <q-icon name="add" class="add"></q-icon>
    </div>
    <div class="caijing-stock-detail-content" ref="caijing-stock-detail-content" @scroll="monitorScrollEvent">
      <div class="banner" :class="basehq.rise < 0 ? 'bg-green' : 'bg-red'">
        <div class="top">
          <span class="price">{{ basehq.price || '--' }}</span>
          <span class="change">{{ basehq.change || basehq.change === 0 ? basehq.change : '--' }}</span>
          <span class="rise">{{ basehq.rise || basehq.rise === 0 ? (basehq.rise > 0 ? '+' + basehq.rise + '%' : basehq.rise + '%') : '--' }}</span>
        </div>
        <div class="bottom">
          <span class="start">今开：{{ otherhq.start || '--' }}</span>
          <span class="high">最高：{{ otherhq.high || '--' }}</span>
          <span class="count">量：{{ otherhq.count || '--' }}</span>
          <span class="end">昨收：{{ otherhq.end || '--' }}</span>
          <span class="low">最低：{{ otherhq.low || '--' }}</span>
          <span class="money" v-if="otherhq.money || otherhq.money === 0">额：{{ otherhq.money | numberFormat }}</span>
          <span class="money" v-else>额：--</span>
        </div>
      </div>
      <div class="chart">
        <div class="block-title">大盘走势</div>
        <div class="text-center p-t-10 p-b-10" v-show="pageLoading">
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
        <van-swipe :autoplay="3000" indicator-color="white" class="swipe">
          <van-swipe-item v-for="(item, index) in chartsimg" :key="index" @click="handlerClickChartImg(chartsimg, index)">
            <img :src="item" alt="" />
            <span v-if="index === 0" class="name">分时</span>
            <span v-if="index === 1" class="name">日K</span>
            <span v-if="index === 2" class="name">周K</span>
            <span v-if="index === 3" class="name">月K</span>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="news">
        <div class="block-title">大盘评述</div>
        <div class="text-center p-t-10 p-b-10" v-show="pageLoading">
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
        <ul>
          <li v-for="(item, index) in newsList" :key="index">
            <div class="t">{{ item.title }}</div>
            <div class="b">{{ item.createTime }}</div>
          </li>
        </ul>
        <van-empty image="error" description="暂无数据" v-if="pageLoaded && !newsList.length" />
        <div class="text-center p-t-10 p-b-10" v-show="pageMoreLoading">
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TabHomeCaijingModule } from 'src/store/modules/tab_home_caijing';
import { ImagePreview } from 'vant';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'caijing-stock-detail',
})
export default class extends Vue {
  $refs: any;
  mounted() {
    this._getCaijingStockDetail();
    this.$refs['caijing-stock-detail-content'].style['height'] = window.innerHeight - 48 + 'px';
  }
  private lastUpdateTime: any = '';
  private stockName = {
    code: this.$route.query.code,
    name: '',
    code2: '',
  };
  private basehq: any = {};
  private otherhq: any = {};
  private chartsimg: any[] = [];
  private newsList: any[] = [];
  private pageLoading = false;
  private containerPositionY = 0;
  private pageMoreLoading = false;
  private pageLoaded = false;
  private pageMoreLocking = false;
  private pageMorePaginationNum = 1;
  private noMoreNews = false;
  /**event */
  private handlerClickChartImg(arr: any, index: number) {
    ImagePreview({
      images: arr,
      startPosition: index,
      closeable: true,
    });
  }
  private async monitorScrollEvent() {
    const scrollHeight = this.$refs['caijing-stock-detail-content'].scrollHeight;
    const scrollTop = this.$refs['caijing-stock-detail-content'].scrollTop;
    this.containerPositionY = scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight >= scrollHeight) {
      if (this.noMoreNews) return;
      if (!this.pageMoreLocking) {
        this.pageMoreLoading = true;
        this.pageMoreLocking = true;
        this.pageMorePaginationNum++;
        await this._getCaijingMoreStockDetail();
        this.pageMoreLocking = false;
        this.pageMoreLoading = false;
      }
    }
  }
  /**http */
  private async _getCaijingStockDetail() {
    this.pageLoading = true;
    const result: any = await TabHomeCaijingModule.getCaijingStockDetail({ params: { code: this.stockName.code } });
    if (result[0]) {
      const item = result[0][this.stockName.code as string];
      const obj = {
        price: item[0],
        rise: item[3],
        change: item[2],
      };
      this.basehq = obj;
      const obj2 = {
        start: item[4],
        high: item[5],
        count: item[9],
        end: item[1],
        low: item[6],
        money: item[10],
      };
      this.otherhq = obj2;
      this.lastUpdateTime = new Date(item[34] * 1000).toLocaleString();
    }
    if (result[3]) {
      this.chartsimg = result[3];
    }
    if (result[1]) {
      this.stockName.name = result[1].name;
      this.stockName.code2 = result[1].stack;
    }
    if (result[2]) {
      this.newsList = result[2];
    }
    this.pageLoading = false;
    this.pageLoaded = true;
  }
  private async _getCaijingMoreStockDetail() {
    const result: any = await TabHomeCaijingModule.getCaijingStockDetail({
      params: { code: this.stockName.code, onlynews: true, page: this.pageMorePaginationNum, stockname: this.stockName.name },
    });
    if (result[0]) {
      this.newsList = this.newsList.concat(result[0]);
      if (!result[0].length) {
        this.noMoreNews = true;
      }
    }
    return Promise.resolve();
  }
}
</script>


<style lang="scss" scoped>
@import '../style/caijing_stock_detail.scss';
</style>