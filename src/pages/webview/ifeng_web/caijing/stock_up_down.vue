<template>
  <div class="caijing-pindao-stock-up-down-list-container">
    <div class="header">
      <div class="l" @click="$router.back()">
        <q-icon name="arrow_back_ios"></q-icon>
      </div>
      <ul class="m">
        <li v-for="(item, index) in tabs" :key="index" :class="activeTabIndex === index ? 'active' : ''" @click="handlerClickTabsItem(index)">
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="caijing-pindao-stock-up-down-list-content">
      <div class="increase" ref="caijing-pindao-stock-up-down-list-content-increase" v-show="activeTabIndex === 0" @scroll="monitorScrollEvent1">
        <div class="text-center p-t-10 p-b-10" v-show="upListLoading">
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
        <ul class="table-header" v-show="!upListLoading">
          <li class="name">股票名称</li>
          <li class="price">最新价</li>
          <li class="rise">涨跌幅</li>
        </ul>
        <ul class="table-content" v-show="!upListLoading">
          <li v-for="(item, index) in increaseList" :key="index" @click="handlerClickStock(item)">
            <div class="name">
              <span>{{ item.name }}</span>
              <span class="code">{{ item.code }}</span>
            </div>
            <div class="price" :class="item.rise > 0 ? 'text-red' : 'text-green'">{{ item.price }}</div>
            <div class="rise" :class="item.rise > 0 ? 'text-red' : 'text-green'">{{ item.rise > 0 ? '+' + item.rise + '%' : item.rise + '%' }}</div>
          </li>
        </ul>
        <div class="text-center p-t-10 p-b-10" v-show="upListMoreLoading">
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
      </div>
      <div class="declining" ref="caijing-pindao-stock-up-down-list-content-declining" v-show="activeTabIndex === 1" @scroll="monitorScrollEvent2">
        <div class="text-center p-t-10 p-b-10" v-show="downListLoading">
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
        <ul class="table-header" v-show="!downListLoading">
          <li class="name">股票名称</li>
          <li class="price">最新价</li>
          <li class="rise">涨跌幅</li>
        </ul>
        <ul class="table-content" v-show="!downListLoading">
          <li v-for="(item, index) in decliningList" :key="index" @click="handlerClickStock(item)">
            <div class="name">
              <span>{{ item.name }}</span>
              <span class="code">{{ item.code }}</span>
            </div>
            <div class="price" :class="item.rise > 0 ? 'text-red' : 'text-green'">{{ item.price }}</div>
            <div class="rise" :class="item.rise > 0 ? 'text-red' : 'text-green'">{{ item.rise > 0 ? '+' + item.rise + '%' : item.rise + '%' }}</div>
          </li>
        </ul>
        <div class="text-center p-t-10 p-b-10" v-show="downListMoreLoading">
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
      </div>
      <div class="science" ref="caijing-pindao-stock-up-down-list-content-science" v-show="activeTabIndex === 2" @scroll="monitorScrollEvent3">
        <ul class="table-header">
          <li class="name">股票名称</li>
          <li class="price">最新价</li>
          <li class="rise" @click="handlerClickScienceSort">
            涨跌幅
            <q-icon name="arrow_upward" v-show="scienceListPaginationSort === 'asc'"></q-icon>
            <q-icon name="arrow_downward" v-show="scienceListPaginationSort === 'desc'"></q-icon>
          </li>
        </ul>
        <div class="text-center p-t-10 p-b-10" v-show="scienceListLoading">
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
        <ul class="table-content" v-show="!scienceListLoading">
          <li v-for="(item, index) in scienceList" :key="index" @click="handlerClickStock(item)">
            <div class="name">
              <span>{{ item.name }}</span>
              <span class="code">{{ item.code }}</span>
            </div>
            <div class="price" :class="item.rise > 0 ? 'text-red' : 'text-green'">{{ item.price }}</div>
            <div class="rise" :class="item.rise > 0 ? 'text-red' : 'text-green'">{{ item.rise > 0 ? '+' + item.rise + '%' : item.rise + '%' }}</div>
          </li>
        </ul>
        <div class="text-center p-t-10 p-b-10" v-show="scienceListMoreLoading">
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TabHomeCaijingModule } from '@/store/modules/home_tab/caijing';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'caijing-pindao-stock-up-down-list',
})
export default class extends Vue {
  $refs: any;
  @Watch('$route')
  onchange(newVal: any) {
    if (this.$route.path === '/ifeng_web_caijing_pindao/stock_up_down_list') {
      console.log(this.containerPositionY1);
      console.log(this.containerPositionY2);
      console.log(this.containerPositionY3);
      if (this.activeTabIndex === 0) {
        this.$refs['caijing-pindao-stock-up-down-list-content-increase'].scrollTop = this.containerPositionY1;
      } else if (this.activeTabIndex === 1) {
        this.$refs['caijing-pindao-stock-up-down-list-content-declining'].scrollTop = this.containerPositionY2;
      } else if (this.activeTabIndex === 2) {
        this.$refs['caijing-pindao-stock-up-down-list-content-science'].scrollTop = this.containerPositionY3;
      }
    }
  }
  async mounted() {
    if (this.$route.query.to === 'increase') {
      this.activeTabIndex = 0;
      this.upListLoading = true;
      await this._getCaijingStockUp();
      this.upListLoading = false;
      this.upListLoaded = true;
    } else if (this.$route.query.to === 'declining') {
      this.activeTabIndex = 1;
      this.downListLoading = true;
      await this._getCaijingStockDown();
      this.downListLoading = false;
      this.downListLoaded = true;
    } else if (this.$route.query.to === 'science') {
      this.activeTabIndex = 2;
      this.scienceListLoading = true;
      await this._getCaijingStockScience();
      this.scienceListLoading = false;
      this.scienceListLoaded = true;
    }
    this.$refs['caijing-pindao-stock-up-down-list-content-increase'].style['height'] = `${window.innerHeight - 48}px`;
    this.$refs['caijing-pindao-stock-up-down-list-content-declining'].style['height'] = `${window.innerHeight - 48}px`;
    this.$refs['caijing-pindao-stock-up-down-list-content-science'].style['height'] = `${window.innerHeight - 48}px`;
  }
  private tabs = ['涨幅榜', '跌幅榜', '科创板'];
  private activeTabIndex = 0;
  private upListLoaded = false;
  private downListLoaded = false;
  private scienceListLoaded = false;
  private upListPaginationNum = 1;
  private downListPaginationNum = 1;
  private scienceListPaginationNum = 1;
  private scienceListPaginationSort = 'desc';
  private upListLoading = false;
  private downListLoading = false;
  private scienceListLoading = false;
  private upListMoreLoading = false;
  private downListMoreLoading = false;
  private scienceListMoreLoading = false;
  private upListLoadingLock = false;
  private downListLoadingLock = false;
  private scienceListLoadingLock = false;
  private increaseList: any[] = [];
  private decliningList: any[] = [];
  private scienceList: any[] = [];
  private containerPositionY1 = 0;
  private containerPositionY2 = 0;
  private containerPositionY3 = 0;
  /**event */
  private async handlerClickTabsItem(index: number) {
    this.activeTabIndex = index;
    this.upListLoading = false;
    this.downListLoading = false;
    this.scienceListLoading = false;
    this.upListMoreLoading = false;
    this.downListMoreLoading = false;
    this.scienceListMoreLoading = false;
    this.upListLoadingLock = false;
    this.downListLoadingLock = false;
    this.scienceListLoadingLock = false;
    if (!this.upListLoaded && index === 0) {
      this.upListLoading = true;
      await this._getCaijingStockUp();
      this.upListLoading = false;
      this.upListLoaded = true;
    } else if (this.upListLoaded && index === 0) {
      this.$nextTick(() => {
        this.$refs['caijing-pindao-stock-up-down-list-content-increase'].scrollTop = this.containerPositionY1;
      });
    }
    if (!this.downListLoaded && index === 1) {
      this.downListLoading = true;
      await this._getCaijingStockDown();
      this.downListLoading = false;
      this.downListLoaded = true;
    } else if (this.downListLoaded && index === 1) {
      this.$nextTick(() => {
        this.$refs['caijing-pindao-stock-up-down-list-content-declining'].scrollTop = this.containerPositionY2;
      });
    }
    if (!this.scienceListLoaded && index === 2) {
      this.scienceListLoading = true;
      await this._getCaijingStockScience();
      this.scienceListLoading = false;
      this.scienceListLoaded = true;
    } else if (this.scienceListLoaded && index === 2) {
      this.$nextTick(() => {
        this.$refs['caijing-pindao-stock-up-down-list-content-science'].scrollTop = this.containerPositionY3;
      });
    }
  }
  private async monitorScrollEvent1() {
    const scrollHeight = this.$refs['caijing-pindao-stock-up-down-list-content-increase'].scrollHeight;
    const scrollTop = this.$refs['caijing-pindao-stock-up-down-list-content-increase'].scrollTop;
    this.containerPositionY1 = scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight >= scrollHeight) {
      if (!this.upListLoadingLock) {
        this.upListMoreLoading = true;
        this.upListLoadingLock = true;
        this.upListPaginationNum++;
        await this._getCaijingMoreStockUp();
        this.upListLoadingLock = false;
        this.upListMoreLoading = false;
      }
    }
  }
  private async monitorScrollEvent2() {
    const scrollHeight = this.$refs['caijing-pindao-stock-up-down-list-content-declining'].scrollHeight;
    const scrollTop = this.$refs['caijing-pindao-stock-up-down-list-content-declining'].scrollTop;
    this.containerPositionY2 = scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight >= scrollHeight) {
      if (!this.downListLoadingLock) {
        this.downListMoreLoading = true;
        this.downListLoadingLock = true;
        this.downListPaginationNum++;
        await this._getCaijingMoreStockDown();
        this.downListLoadingLock = false;
        this.downListMoreLoading = false;
      }
    }
  }
  private async monitorScrollEvent3() {
    const scrollHeight = this.$refs['caijing-pindao-stock-up-down-list-content-science'].scrollHeight;
    const scrollTop = this.$refs['caijing-pindao-stock-up-down-list-content-science'].scrollTop;
    this.containerPositionY3 = scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight >= scrollHeight) {
      if (!this.scienceListLoadingLock) {
        this.scienceListMoreLoading = true;
        this.scienceListLoadingLock = true;
        this.scienceListPaginationNum++;
        await this._getCaijingMoreStockScience();
        this.scienceListLoadingLock = false;
        this.scienceListMoreLoading = false;
      }
    }
  }
  private async handlerClickScienceSort() {
    if (this.scienceListLoading) {
      return;
    }
    this.scienceListPaginationNum = 1;
    this.scienceListPaginationSort = this.scienceListPaginationSort === 'desc' ? 'asc' : 'desc';
    this.scienceListLoading = true;
    await this._getCaijingStockScience();
    this.scienceListLoading = false;
  }
  private handlerClickStock(item: any) {
    this.$router.push(`/ifeng_web_caijing_pindao/stock_detail?code=${item.code}`);
  }
  /**http */
  private async _getCaijingStockUp() {
    const result = await TabHomeCaijingModule.getCaijingStockUpOrDown({ params: { sort: 'desc', page: 1 } });
    const arr = [];
    for (let item of result[0]) {
      arr.push({
        name: item.name,
        code: item.code,
        price: item.price,
        rise: parseFloat(item.chg_pct),
      });
    }
    this.increaseList = arr;
    return Promise.resolve();
  }
  private async _getCaijingStockDown() {
    const result = await TabHomeCaijingModule.getCaijingStockUpOrDown({ params: { sort: 'asc', page: 1 } });
    const arr = [];
    for (let item of result[0]) {
      arr.push({
        name: item.name,
        code: item.code,
        price: item.price,
        rise: parseFloat(item.chg_pct),
      });
    }
    this.decliningList = arr;
    return Promise.resolve();
  }
  private async _getCaijingStockScience() {
    const result = await TabHomeCaijingModule.getCaijingStockKCB({ params: { sort: this.scienceListPaginationSort, page: 1 } });
    const arr = [];
    for (let item of result[0]) {
      arr.push({
        name: item.name,
        code: item.code,
        price: item.price,
        rise: parseFloat(item.chg_pct),
      });
    }
    this.scienceList = arr;
    return Promise.resolve();
  }
  private async _getCaijingMoreStockUp() {
    const result = await TabHomeCaijingModule.getCaijingStockUpOrDown({ params: { sort: 'desc', page: this.upListPaginationNum } });
    const arr = [];
    for (let item of result[0]) {
      arr.push({
        name: item.name,
        code: item.code,
        price: item.price,
        rise: parseFloat(item.chg_pct),
      });
    }
    this.increaseList = this.increaseList.concat(arr);
    return Promise.resolve();
  }
  private async _getCaijingMoreStockDown() {
    const result = await TabHomeCaijingModule.getCaijingStockUpOrDown({ params: { sort: 'asc', page: this.downListPaginationNum } });
    const arr = [];
    for (let item of result[0]) {
      arr.push({
        name: item.name,
        code: item.code,
        price: item.price,
        rise: parseFloat(item.chg_pct),
      });
    }
    this.decliningList = this.decliningList.concat(arr);
    return Promise.resolve();
  }
  private async _getCaijingMoreStockScience() {
    const result = await TabHomeCaijingModule.getCaijingStockKCB({
      params: { sort: this.scienceListPaginationSort, page: this.scienceListPaginationNum },
    });
    const arr = [];
    for (let item of result[0]) {
      arr.push({
        name: item.name,
        code: item.code,
        price: item.price,
        rise: parseFloat(item.chg_pct),
      });
    }
    this.scienceList = this.scienceList.concat(arr);
    return Promise.resolve();
  }
}
</script>

<style lang="scss" scoped>
@import '../style/caijing_stock_up_down.scss';
</style>
