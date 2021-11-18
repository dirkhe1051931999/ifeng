<template>
  <div class="stock_detail_ganggu_container">
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
    <div class="caijing-stock-detail-ganggu-content" ref="caijing-stock-detail-ganggu-content" @scroll="monitorScrollEvent">
      <div class="banner" :class="basehq.chg < 0 ? 'bg-green' : 'bg-red'">
        <div class="top">
          <span class="price">{{ basehq.last || '--' }}</span>
          <span class="change">{{ basehq.chg || basehq.chg === 0 ? basehq.chg : '--' }}</span>
          <span class="rise">{{
            basehq.chg_pct || basehq.chg_pct === 0 ? (basehq.chg_pct > 0 ? '+' + basehq.chg_pct + '%' : basehq.chg_pct + '%') : '--'
          }}</span>
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
          <li
            v-for="(item, index) in ['分时', '日K', '周K', '月K']"
            :key="index"
            :class="[activeChartNavItemIndex === index ? 'active' : '']"
            @click="handleClickNavItem(index)"
          >
            {{ item }}
          </li>
        </ul>
        <div class="minutely-content" v-show="activeChartNavItemIndex === 0">
          <div class="text-center p-t-10 p-b-10" v-show="minutelyLoading">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
          <FenshiChart></FenshiChart>
        </div>
        <div class="daily-content" v-show="activeChartNavItemIndex === 1">
          <div class="text-center p-t-10 p-b-10" v-show="dailyLoading">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
        </div>
        <div class="weekly-content" v-show="activeChartNavItemIndex === 2">
          <div class="text-center p-t-10 p-b-10" v-show="weeklyLoading">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
        </div>
        <div class="monthly-content" v-show="activeChartNavItemIndex === 3">
          <div class="text-center p-t-10 p-b-10" v-show="monthlyLoading">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TabHomeCaijingModule } from '@/store/modules/tab_home_caijing';
import { Component, Vue } from 'vue-property-decorator';
import FenshiChart from './components/ganggu_fenshi.vue';
import kLineChart from './components/ganggu_k_line.vue';
@Component({
  name: 'stock_detail_ganggu',
  components: {
    FenshiChart,
    kLineChart,
  },
})
export default class extends Vue {
  $refs: any;
  mounted() {
    this.$refs['caijing-stock-detail-ganggu-content'].style['height'] = window.innerHeight - 48 + 'px';
    this._getCaijingStockGangGuDetail();
  }
  private lastUpdateTime: any = '';
  private stockName = {
    code: this.$route.query.code,
    name: '',
    code2: '',
  };
  private basehq: any = {};
  private newsList: any[] = [];
  private activeChartNavItemIndex = 0;
  // chart loading
  private minutelyLoading = false;
  private dailyLoading = false;
  private weeklyLoading = false;
  private monthlyLoading = false;
  // chart load lock
  private minutelyLock = false;
  private dailyLock = false;
  private weeklyLock = false;
  private monthlyLock = false;
  // chart data
  private minutelyData: any[] = [];
  private dailyData: any[] = [];
  private weeklyData: any[] = [];
  private monthlyData: any[] = [];
  private pageLoading = false;
  private containerPositionY = 0;
  private pageMoreLoading = false;
  private pageLoaded = false;
  private pageMoreLocking = false;
  private pageMorePaginationNum = 1;
  /**event */
  private async monitorScrollEvent() {
    const scrollHeight = this.$refs['caijing-stock-detail-ganggu-content'].scrollHeight;
    const scrollTop = this.$refs['caijing-stock-detail-ganggu-content'].scrollTop;
    this.containerPositionY = scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight >= scrollHeight) {
      if (!this.pageMoreLocking) {
        this.pageMoreLoading = true;
        this.pageMoreLocking = true;
        this.pageMorePaginationNum++;
        // await this._getCaijingMoreStockDetail();
        this.pageMoreLocking = false;
        this.pageMoreLoading = false;
      }
    }
  }
  private async handleClickNavItem(index: number) {
    this.activeChartNavItemIndex = index;
    switch (index) {
      case 1:
        if (this.dailyLock) return;
        this.dailyLoading = true;
        const result1: any = await this._getChartData(index);
        this.dailyData = result1;
        this.dailyLock = true;
        this.dailyLoading = false;
        break;
      case 2:
        if (this.weeklyLock) return;
        this.weeklyLoading = true;
        const result2: any = await this._getChartData(index);
        this.weeklyData = result2;
        this.weeklyLock = true;
        this.weeklyLoading = false;
        break;
      case 3:
        if (this.monthlyLock) return;
        this.monthlyLoading = true;
        const result3: any = await this._getChartData(index);
        this.monthlyData = result3;
        this.monthlyLock = true;
        this.monthlyLoading = false;
        break;
      default:
        break;
    }
  }

  /**http */
  private async _getCaijingStockGangGuDetail() {
    this.pageLoading = true;
    this.minutelyLoading = true;
    const result: any = await TabHomeCaijingModule.getCaijingStockDetailGangGu({
      params: {
        code: this.stockName.code,
        have_news: false,
        have_minutely: false,
        have_daily: false,
        have_weekly: false,
        have_monthly: false,
        firstLoad: true,
      },
    });
    if (result[0]) {
      this.lastUpdateTime = result[0].mkt_time;
      this.stockName.name = result[0].name;
      this.basehq = result[0];
    }
    if (result[1]) {
      this.minutelyLock = true;
      this.minutelyLoading = false;
      this.minutelyData = result[1];
    }
    if (result[2]) {
      this.newsList = result[2];
    }

    this.pageLoading = false;
    this.pageLoaded = true;
  }
  private async _getChartData(index: number) {
    if (index === 1) {
      const result: any = await TabHomeCaijingModule.getCaijingStockDetailGangGu({
        params: {
          code: this.stockName.code,
          have_news: false,
          have_minutely: false,
          have_daily: true,
          have_weekly: false,
          have_monthly: false,
          firstLoad: false,
        },
      });
      if (result[0]) {
        return Promise.resolve(result[0]);
      }
    } else if (index === 2) {
      const result: any = await TabHomeCaijingModule.getCaijingStockDetailGangGu({
        params: {
          code: this.stockName.code,
          have_news: false,
          have_minutely: false,
          have_daily: false,
          have_weekly: true,
          have_monthly: false,
          firstLoad: false,
        },
      });
      if (result[0]) {
        return Promise.resolve(result[0]);
      }
    } else if (index === 3) {
      const result: any = await TabHomeCaijingModule.getCaijingStockDetailGangGu({
        params: {
          code: this.stockName.code,
          have_news: false,
          have_minutely: false,
          have_daily: false,
          have_weekly: false,
          have_monthly: true,
          firstLoad: false,
        },
      });
      if (result[0]) {
        return Promise.resolve(result[0]);
      }
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../style/caijing_stock_detail_ganggu.scss';
</style>