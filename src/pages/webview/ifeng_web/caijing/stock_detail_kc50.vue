<template>
  <div class="stock_detail_kc50_container">
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
    <div class="caijing-stock-detail-kc50-content" ref="caijing-stock-detail-kc50-content" @scroll="monitorScrollEvent">
      <div class="banner" :class="basehq.chg < 0 ? 'bg-green' : 'bg-red'">
        <div class="top">
          <span class="price">{{ basehq.last || '--' }}</span>
          <span class="change">{{ basehq.chg || basehq.chg === 0 ? basehq.chg : '--' }}</span>
          <span class="rise">{{ basehq.chg_pct || basehq.chg_pct === 0 ? (basehq.chg_pct > 0 ? '+' + basehq.chg_pct + '%' : basehq.chg_pct + '%') : '--' }}</span>
        </div>
        <div class="bottom">
          <span class="start">今开：{{ basehq.open || '--' }}</span>
          <span class="high">最高：{{ basehq.high || '--' }}</span>
          <span class="count">量：{{ basehq.volume || '--' }}</span>
          <span class="end">昨收：{{ basehq.hst_close || '--' }}</span>
          <span class="low">最低：{{ basehq.low || '--' }}</span>
          <span class="money" v-if="basehq.amount || basehq.amount === 0">额：{{ basehq.amount | numberFormat }}</span>
          <span class="money" v-else>额：--</span>
        </div>
      </div>
      <div class="chart">
        <ul>
          <li v-for="(item, index) in ['分时', '日K', '周K', '月K']" :key="index" :class="[activeChartNavItemIndex === index ? 'active' : '']" @click="handleClickNavItem(index)">
            {{ item }}
          </li>
        </ul>
        <div class="minutely-content" v-show="activeChartNavItemIndex === 0">
          <img :src="stockImgList[0]" alt="" />
        </div>
        <div class="daily-content" v-show="activeChartNavItemIndex === 1">
          <img :src="stockImgList[1]" alt="" />
        </div>
        <div class="weekly-content" v-show="activeChartNavItemIndex === 2">
          <img :src="stockImgList[2]" alt="" />
        </div>
        <div class="monthly-content" v-show="activeChartNavItemIndex === 3">
          <img :src="stockImgList[3]" alt="" />
        </div>
      </div>
      <div class="news-list">
        <div class="text-center p-t-10 p-b-10" v-show="pageLoading">
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
        <ul v-if="newsList.length">
          <li v-for="(item, index) in newsList" :key="index">
            <p class="title">{{ item.title }}</p>
            <p class="updateTime">{{ item.updateTime }}</p>
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
import { TabHomeCaijingModule } from '@/store/modules/home_tab/caijing';
import { date } from 'quasar';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'stock_detail_kc50',
})
export default class extends Vue {
  $refs: any;
  mounted() {
    this.$refs['caijing-stock-detail-kc50-content'].style['height'] = `${window.innerHeight - 48}px`;
    this._getCaijingStockKc50Detail();
  }
  private lastUpdateTime: any = '';
  private stockName = {
    code: this.$route.query.code,
    name: '',
    code2: '',
  };
  private basehq: any = {};
  private newsList: any[] = [];
  private stockImgList: any[] = [];
  private activeChartNavItemIndex = 0;
  private pageLoading = false;
  private containerPositionY = 0;
  private pageMoreLoading = false;
  private pageLoaded = false;
  private pageMoreLocking = false;
  private pageMorePaginationNum = 1;
  private noMoreNews = false;
  /**event */
  private async monitorScrollEvent() {
    const scrollHeight = this.$refs['caijing-stock-detail-kc50-content'].scrollHeight;
    const scrollTop = this.$refs['caijing-stock-detail-kc50-content'].scrollTop;
    this.containerPositionY = scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
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
  private async handleClickNavItem(index: number) {
    this.activeChartNavItemIndex = index;
  }
  /**http */
  private async _getCaijingStockKc50Detail() {
    this.pageLoading = true;
    const result: any = await TabHomeCaijingModule.getCaijingStockDetailKc50({
      params: {
        have_news: false,
        firstLoad: true,
      },
    });
    if (result[0]) {
      this.lastUpdateTime = date.formatDate(Number(result[0][35] * 1000), 'YYYY-MM-DD HH:mm:ss');
      this.stockName.name = '科创50';
      this.basehq = {
        last: result[0][0],
        chg: result[0][2],
        chg_pct: result[0][3],
        open: result[0][4],
        high: result[0][5],
        volume: result[0][9],
        hst_close: result[0][1],
        low: result[0][6],
        amount: result[0][10],
      };
    }
    if (result[1]) {
      this.stockImgList = result[1];
    }
    if (result[2]) {
      this.newsList = result[2];
    }
    this.pageLoading = false;
    this.pageLoaded = true;
  }
  private async _getCaijingMoreStockDetail() {
    const result: any = await TabHomeCaijingModule.getCaijingStockDetailKc50({
      params: {
        have_news: true,
        firstLoad: false,
        page: this.pageMorePaginationNum,
      },
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
@import '../style/caijing_stock_detail_kc50.scss';
</style>
