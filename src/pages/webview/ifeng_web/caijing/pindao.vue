<template>
  <div class="caijing-pindao-container">
    <div class="header">
      <div class="l" @click="$router.back()">
        <q-icon name="arrow_back_ios"></q-icon>
      </div>
      <ul class="m">
        <li
          v-for="(item, index) in pindaoTabs"
          :key="index"
          :class="pindaoActiveTabIndex === index ? 'active' : ''"
          @click="handlerClickPindaoTabsItem(index)"
        >
          {{ item }}
        </li>
      </ul>
      <div class="r" @click="$router.push('/ifeng_web_caijing_pindao/search')">
        <q-icon name="search"></q-icon>
      </div>
    </div>
    <div class="caijing-pindao-content">
      <div class="hangqing" v-show="pindaoActiveTabIndex === 1" ref="caijing-pindao-content-hangqing" @scroll="monitorScrollEvent2">
        <div class="market">
          <li v-for="(item, index) in marketList" :key="index" @click="handlerClickStock(item)">
            <p>{{ item.name }}</p>
            <div :class="item.rise > 0 ? 'text-red' : 'text-green'">
              <p class="price">{{ item.price }}</p>
              <div>
                <span class="change">{{ item.rise > 0 ? '+' + item.change : item.change }}</span>
                <span class="rise">{{ item.rise > 0 ? '+' + item.rise + '%' : item.rise + '%' }}</span>
              </div>
            </div>
          </li>
        </div>
        <div class="plate">
          <div class="block-title">
            <span class="l"> 热门板块 </span>
          </div>
          <ul>
            <li v-for="(item, index) in plateList" :key="index">
              <p class="name">{{ item.name }}</p>
              <p class="name" :class="item.chg_pct > 0 ? 'text-red' : 'text-green'">
                {{ item.chg_pct > 0 ? '+' + item.chg_pct.toFixed(2) + '%' : item.chg_pct.toFixed(2) + '%' }}
              </p>
            </li>
          </ul>
        </div>
        <div class="increase">
          <div class="block-title" @click="handlerClickIncreaseOrDecliningBlockTitle('increase')">
            <span class="l"> 涨幅榜 </span>
            <q-icon name="arrow_forward_ios" class="icon"></q-icon>
          </div>
          <ul class="table-header">
            <li class="name">股票名称</li>
            <li class="price">最新价</li>
            <li class="rise">涨跌幅</li>
          </ul>
          <div class="text-center p-t-10 p-b-10" v-show="dataLoading">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
          <ul class="table-content" v-if="!dataLoading">
            <li v-for="(item, index) in increaseList" :key="index" @click="handlerClickStock(item)">
              <div class="name">
                <span>{{ item.name }}</span>
                <span class="code">{{ item.code }}</span>
              </div>
              <div class="price" :class="item.rise > 0 ? 'text-red' : 'text-green'">{{ item.price }}</div>
              <div class="rise" :class="item.rise > 0 ? 'text-red' : 'text-green'">{{ item.rise > 0 ? '+' + item.rise + '%' : item.rise + '%' }}</div>
            </li>
          </ul>
        </div>
        <div class="declining">
          <div class="block-title" @click="handlerClickIncreaseOrDecliningBlockTitle('declining')">
            <span class="l"> 跌幅榜 </span>
            <q-icon name="arrow_forward_ios" class="icon"></q-icon>
          </div>
          <ul class="table-header">
            <li class="name">股票名称</li>
            <li class="price">最新价</li>
            <li class="rise">涨跌幅</li>
          </ul>
          <div class="text-center p-t-10 p-b-10" v-show="dataLoading">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
          <ul class="table-content" v-if="!dataLoading">
            <li v-for="(item, index) in decliningList" :key="index" @click="handlerClickStock(item)">
              <div class="name">
                <span>{{ item.name }}</span>
                <span class="code">{{ item.code }}</span>
              </div>
              <div class="price" :class="item.rise > 0 ? 'text-red' : 'text-green'">{{ item.price }}</div>
              <div class="rise" :class="item.rise > 0 ? 'text-red' : 'text-green'">{{ item.rise > 0 ? '+' + item.rise + '%' : item.rise + '%' }}</div>
            </li>
          </ul>
        </div>
        <div class="science">
          <div class="block-title" @click="handlerClickIncreaseOrDecliningBlockTitle('science')">
            <span class="l"> 科创板 </span>
            <q-icon name="arrow_forward_ios" class="icon"></q-icon>
          </div>
          <ul class="table-header">
            <li class="name">股票名称</li>
            <li class="price">最新价</li>
            <li class="rise">涨跌幅</li>
          </ul>
          <div class="text-center p-t-10 p-b-10" v-show="dataLoading">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
          <ul class="table-content" v-if="!dataLoading">
            <li v-for="(item, index) in scienceList" :key="index" @click="handlerClickStock(item)">
              <div class="name">
                <span>{{ item.name }}</span>
                <span class="code">{{ item.code }}</span>
              </div>
              <div class="price" :class="item.rise > 0 ? 'text-red' : 'text-green'">{{ item.price }}</div>
              <div class="rise" :class="item.rise > 0 ? 'text-red' : 'text-green'">{{ item.rise > 0 ? '+' + item.rise + '%' : item.rise + '%' }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { orderBy } from 'lodash';
import { TabHomeCaijingModule } from 'src/store/modules/tab_home_caijing';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'caijing-pindao',
})
export default class extends Vue {
  $refs: any;
  @Watch('$route')
  onchange(newVal: any) {
    if (this.$route.path === '/ifeng_web_caijing_pindao') {
      // this.$refs['caijing-pindao-content-hangqing'].scrollTop = this.containerPositionY1;
      this.$refs['caijing-pindao-content-hangqing'].scrollTop = this.containerPositionY2;
      // this.$refs['caijing-pindao-content-hangqing'].scrollTop = this.containerPositionY2;
      // this.$refs['caijing-pindao-content-hangqing'].scrollTop = this.containerPositionY2;
    }
  }
  mounted() {
    this._getCaijingHangqing();
    this.$refs['caijing-pindao-content-hangqing'].style['height'] = window.innerHeight - 48 + 'px';
  }
  private pindaoTabs = ['港股行情', '行情', '自选', '炒股大赛'];
  private pindaoActiveTabIndex = 1;
  private marketList: any[] = [];
  private plateList: any[] = [];
  private increaseList: any[] = [];
  private decliningList: any[] = [];
  private scienceList: any[] = [];
  private containerPositionY1 = 0;
  private containerPositionY2 = 0;
  private containerPositionY3 = 0;
  private containerPositionY4 = 0;
  private dataLoading = false;
  /**event */
  private handlerClickPindaoTabsItem(index: number) {
    this.pindaoActiveTabIndex = index;
  }
  private _setMarketData(data: any) {
    const marketList = [];
    for (let key in data) {
      const item = data[key];
      switch (key) {
        case 'sh000001':
          marketList[0] = {
            name: '上证指数',
            code: key,
            price: item[0],
            rise: item[3],
            change: item[2],
          };
          break;
        case 'sz399001':
          marketList[1] = {
            name: '深证成指',
            code: key,
            price: item[0],
            rise: item[3],
            change: item[2],
          };
          break;
        case 'sz399006':
          marketList[2] = {
            name: '创业板指',
            code: key,
            price: item[0],
            rise: item[3],
            change: item[2],
          };
          break;
        case 'hk0000100':
          marketList[3] = {
            name: '恒生指数',
            code: key,
            price: item[0],
            rise: item[3],
            change: item[2],
          };
          break;
        case 'sh000300':
          marketList[4] = {
            name: '沪深300',
            code: key,
            price: item[0],
            rise: item[3],
            change: item[2],
          };
          break;
        case 'sh000688':
          marketList[5] = {
            name: '科创50',
            code: key,
            price: item[0],
            rise: item[3],
            change: item[2],
          };
          break;
        default:
          break;
      }
    }
    return marketList;
  }
  private monitorScrollEvent1() {}
  private monitorScrollEvent2() {
    const scrollHeight = this.$refs['caijing-pindao-content-hangqing'].scrollHeight;
    const scrollTop = this.$refs['caijing-pindao-content-hangqing'].scrollTop;
    this.containerPositionY2 = scrollTop;
  }
  private monitorScrollEvent3() {}
  private monitorScrollEvent4() {}
  private handlerClickIncreaseOrDecliningBlockTitle(from: string) {
    this.$router.push('/ifeng_web_caijing_pindao/stock_up_down_list?to=' + from);
  }
  private handlerClickStock(item: any) {
    switch (item.code) {
      case 'hk0000100':
        this.$router.push('/ifeng_web_caijing_pindao/stock_detail_ganggu?code=' + item.code);
        break;
      case 'sh000688':
        this.$router.push('/ifeng_web_caijing_pindao/stock_detail_kc50?code=' + item.code);
        break;
      default:
        this.$router.push('/ifeng_web_caijing_pindao/stock_detail?code=' + item.code);
        break;
    }
    return;
  }
  /**http */
  private async _getCaijingHangqing() {
    this.dataLoading = true;
    const result = await TabHomeCaijingModule.getCaijingHangqing({});
    if (result[0]) {
      this.marketList = this._setMarketData(result[0]);
    }
    if (result[1]) {
      this.plateList = result[1];
    }
    if (result[3]) {
      let arr = [];
      for (let key in result[3]) {
        const obj = result[3][key];
        arr.push({
          code: key,
          name: obj[0],
          price: obj[1],
          rise: parseFloat(obj[2]),
        });
      }
      this.increaseList = orderBy(arr, ['rise'], ['desc']).slice(0, 5);
      this.decliningList = orderBy(arr, ['rise'], ['asc']).slice(0, 5);
    }
    if (result[2]) {
      let arr = [];
      for (let item of result[2]) {
        arr.push({
          name: item.name,
          code: item.code,
          price: item.price,
          rise: parseFloat(item.chg_pct),
        });
      }
      this.scienceList = orderBy(arr, ['rise'], ['desc']);
    }
    this.dataLoading = false;
  }
}
</script>


<style lang="scss" scoped>
@import '../style/caijing_pindao.scss';
</style>