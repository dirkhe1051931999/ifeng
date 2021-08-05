<template>
  <div class="kangyi-quanqiu-container" ref="kangyi-quanqiu-container">
    <div class="header">
      <img src="https://x0.ifengimg.com/ucms/2020_40/476094BD3C08666F1F2016D73443BCE6392ACB23_w1125_h483.png" alt="" />
    </div>
    <div class="content">
      <div class="summary">
        <div class="top">全球疫情（中国以外）</div>
        <div class="middle">
          <div class="xinzeng">
            <p class="count" v-if="summaryData.quanqiu_add">{{ summaryData.quanqiu_add | numberFormat }}</p>
            <p class="count" v-else>--</p>
            <p class="text">新增病例</p>
          </div>
          <div class="leiji">
            <p class="count" v-if="summaryData.quanqiu_sum">{{ summaryData.quanqiu_sum | numberFormat }}</p>
            <p class="count" v-else>--</p>
            <p class="text">累计确诊</p>
          </div>
          <div class="zhiyu">
            <p class="count" v-if="summaryData.quanqiu_zhiyu">{{ summaryData.quanqiu_zhiyu | numberFormat }}</p>
            <p class="count" v-else>--</p>
            <p class="text">累计治愈</p>
          </div>
          <div class="siwang">
            <p class="count" v-if="summaryData.quanqiu_siwang">{{ summaryData.quanqiu_siwang | numberFormat }}</p>
            <p class="count" v-else>--</p>
            <p class="text">累计死亡</p>
          </div>
        </div>
        <div class="bottom">截止{{ endDate || '--' }}</div>
      </div>
      <div class="map">
        <div class="country">
          <span v-for="(item, index) in guowaiCountryCanSee" :key="index">{{ item }}</span>
        </div>
        <div
          class="kangyi-quanqiu-map1 text-center"
          id="kangyi-quanqiu-map1"
          style="width: 100%; height: 250px"
          :class="[activeMapIndex === 0 ? 'active-map' : '']"
        >
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
        <div
          class="kangyi-quanqiu-map2 text-center"
          id="kangyi-quanqiu-map2"
          style="width: 100%; height: 250px"
          :class="[activeMapIndex === 1 ? 'active-map' : '']"
        >
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
        <div class="switch">
          <span :class="activeMapIndex === 0 ? 'active' : ''" @click="activeMapIndex = 0">现存确诊</span>
          <span :class="activeMapIndex === 1 ? 'active' : ''" @click="activeMapIndex = 1">累计确诊</span>
        </div>
      </div>
      <div class="line">
        <div
          class="kangyi-quanqiu-line1"
          id="kangyi-quanqiu-line1"
          style="width: 100%; height: 250px"
          :class="[activeLineIndex === 0 ? 'active-line' : '']"
        ></div>
        <div
          class="kangyi-quanqiu-line2"
          id="kangyi-quanqiu-line2"
          style="width: 100%; height: 250px"
          :class="[activeLineIndex === 1 ? 'active-line' : '']"
        ></div>
        <div
          class="kangyi-quanqiu-line3"
          id="kangyi-quanqiu-line3"
          style="width: 100%; height: 250px"
          :class="[activeLineIndex === 2 ? 'active-line' : '']"
        ></div>
        <div class="switch">
          <span :class="activeLineIndex === 0 ? 'active' : ''" @click="activeLineIndex = 0">累计/现存确诊</span>
          <span :class="activeLineIndex === 1 ? 'active' : ''" @click="activeLineIndex = 1">治愈/死亡</span>
          <span :class="activeLineIndex === 2 ? 'active' : ''" @click="activeLineIndex = 2">中国/海外新增</span>
        </div>
      </div>
      <div class="table">
        <div class="block-title">
          <img src="~assets/kangyi/area-index.png" alt="" />
          <span>海外病例</span>
        </div>
        <ul class="table-header">
          <li class="diqu">国家(地区)</li>
          <li class="xinzeng">新增病例</li>
          <li class="leiji">累计确诊</li>
          <li class="zhiyu">治愈</li>
          <li class="siwang">死亡</li>
        </ul>
        <ul class="table-content">
          <li v-for="(item, index) in tableList" :key="index">
            <div class="diqu">{{ item.name2 }}</div>
            <div class="xinzeng">{{ item.quezhen_add }}</div>
            <div class="leiji">{{ item.quezhen }}</div>
            <div class="zhiyu">{{ item.zhiyu }}</div>
            <div class="siwang">{{ item.siwang }}</div>
          </li>
        </ul>
      </div>
      <div class="news">
        <div class="block-title">
          <img src="~assets/kangyi/area-index.png" alt="" />
          <span>全球报道</span>
        </div>
        <ul>
          <li v-for="(news, index) in newsList" :key="index">
            <div class="l">
              {{ news.title }}
            </div>
            <div class="r" v-if="news.thumbnails.image && news.thumbnails.image.value.length">
              <van-image class="thumbnail" :src="news.thumbnails.image.value[0].url" lazy-load />
              <q-icon name="ondemand_video" class="icon" v-if="news.type === 'video'"></q-icon>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { numberFormat } from 'src/filters';
import { TabHomeKangyiModule } from 'src/store/modules/tab_home_kangyi';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { worldNameMap } from '../data/worldNameMap';

@Component({
  name: 'kangyi-quanqiu',
})
export default class extends Vue {
  $refs: any;
  @Watch('activeMapIndex')
  onchange() {
    this.map1 &&
      this.map1.dispatchAction({
        type: 'hideTip',
      });
    this.map2 &&
      this.map2.dispatchAction({
        type: 'hideTip',
      });
  }
  @Watch('activeLineIndex')
  onchange2() {
    this.line1 &&
      this.line1.dispatchAction({
        type: 'hideTip',
      });
    this.line2 &&
      this.line2.dispatchAction({
        type: 'hideTip',
      });
    this.line3 &&
      this.line3.dispatchAction({
        type: 'hideTip',
      });
  }
  mounted() {
    this._getKangyiQuanqiu();
    this.$refs['kangyi-quanqiu-container'].style['height'] = window.innerHeight + 'px';
  }
  private endDate: any = '';
  private activeMapIndex = 0;
  private activeLineIndex = 0;
  private guowaiCountryCanSee = ['美国', '英国', '意大利', '伊朗', '日本'];
  private tableList: any[] = [];
  private newsList: any[] = [];
  private summaryData: any = {};
  private map1: any;
  private map2: any;
  private line1: any;
  private line2: any;
  private line3: any;
  /**event */
  private _initMap1(data: any) {
    this.map1 = window['echarts'].init(document.getElementById('kangyi-quanqiu-map1'));
    this.map1.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (a: any) => {
          try {
            return `${a.data.name}<br\>现存确诊：${numberFormat(a.data.value)}<br/>累计确诊：${numberFormat(
              a.data.value1,
            )}<br/>累计治愈：${numberFormat(a.data.value2)}<br/>累计死亡：${numberFormat(a.data.value3)}<br/>`;
          } catch (error) {
            return '暂无数据';
          }
        },
      },
      visualMap: {
        type: 'piecewise',
        pieces: [
          { min: 1000000, max: 10000000000, label: '大于等于100万人', color: '#372a28' },
          { min: 100000, max: 1000000, label: '确诊10万-100万人', color: '#4e160f' },
          { min: 10000, max: 100000, label: '确诊1万-10万人', color: '#974236' },
          { min: 1000, max: 10000, label: '确诊1000-1万人', color: '#ee7263' },
          { min: 1, max: 1000, label: '确诊1-1000人', color: '#f5bba7' },
        ],
        color: ['#E0022B', '#E09107', '#A3E00B'],
        textStyle: {
          fontSize: 8,
        },
      },
      roamController: {
        show: true,
        left: 'right',
        mapTypeControl: {
          china: true,
        },
      },
      series: [
        {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          type: 'map',
          map: 'world',
          nameMap: worldNameMap,
          data,
          aspectScale: 0.75, //长宽比
          showLegendSymbol: false, // 存在legend时显示
          selectedMode: 'single',
        },
      ],
    });
  }
  private _initMap2(data: any) {
    this.map2 = window['echarts'].init(document.getElementById('kangyi-quanqiu-map2'));
    this.map2.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (a: any) => {
          try {
            return `${a.data.name}<br\>现存确诊：${numberFormat(a.data.value1)}<br/>累计确诊：${numberFormat(
              a.data.value,
            )}<br/>累计治愈：${numberFormat(a.data.value2)}<br/>累计死亡：${numberFormat(a.data.value3)}<br/>`;
          } catch (error) {
            return '暂无数据';
          }
        },
      },
      visualMap: {
        type: 'piecewise',
        pieces: [
          { min: 1000000, max: 10000000000, label: '大于等于100万人', color: '#372a28' },
          { min: 100000, max: 1000000, label: '确诊10万-100万人', color: '#4e160f' },
          { min: 10000, max: 100000, label: '确诊1万-10万人', color: '#974236' },
          { min: 1000, max: 10000, label: '确诊1000-1万人', color: '#ee7263' },
          { min: 1, max: 1000, label: '确诊1-1000人', color: '#f5bba7' },
        ],
        color: ['#E0022B', '#E09107', '#A3E00B'],
        textStyle: {
          fontSize: 8,
        },
      },
      roamController: {
        show: true,
        left: 'right',
        mapTypeControl: {
          china: true,
        },
      },
      series: [
        {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          type: 'map',
          map: 'world',
          nameMap: worldNameMap,
          data,
          aspectScale: 0.75, //长宽比
          showLegendSymbol: false, // 存在legend时显示
          selectedMode: 'single',
        },
      ],
    });
  }
  private _initLine1(data: any) {
    this.line1 = window['echarts'].init(document.getElementById('kangyi-quanqiu-line1'));
    let option;
    option = {
      tooltip: {
        trigger: 'axis',
      },
      title: {
        text: '累计/现存确诊趋势',
        textStyle: {
          fontSize: 16,
          color: '#323232',
          fontWeight: 'normal',
        },
      },
      legend: {
        textStyle: {
          fontSize: 12,
          color: '#323232',
        },
        icon: 'circle',
        data: data.legend,
        right: 0,
        itemGap: 2,
        itemWidth: 8,
        itemHeight: 8,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.date,
      },
      yAxis: {
        type: 'value',
      },
      series: data.series,
    };
    option && this.line1.setOption(option);
  }
  private _initLine2(data: any) {
    this.line2 = window['echarts'].init(document.getElementById('kangyi-quanqiu-line2'));
    let option;
    option = {
      tooltip: {
        trigger: 'axis',
      },
      title: {
        text: '治愈/死亡趋势',
        textStyle: {
          fontSize: 16,
          color: '#323232',
          fontWeight: 'normal',
        },
      },
      legend: {
        textStyle: {
          fontSize: 12,
          color: '#323232',
        },
        icon: 'circle',
        data: data.legend,
        right: 0,
        itemGap: 2,
        itemWidth: 8,
        itemHeight: 8,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.date,
      },
      yAxis: {
        type: 'value',
      },
      series: data.series,
    };
    option && this.line2.setOption(option);
  }
  private _initLine3(data: any) {
    this.line3 = window['echarts'].init(document.getElementById('kangyi-quanqiu-line3'));
    let option;
    option = {
      tooltip: {
        trigger: 'axis',
      },
      title: {
        text: '中国/海外新增趋势',
        textStyle: {
          fontSize: 16,
          color: '#323232',
          fontWeight: 'normal',
        },
      },
      legend: {
        textStyle: {
          fontSize: 12,
          color: '#323232',
        },
        icon: 'circle',
        data: data.legend,
        right: 0,
        itemGap: 2,
        itemWidth: 8,
        itemHeight: 8,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.date,
      },
      yAxis: {
        type: 'value',
      },
      series: data.series,
    };
    option && this.line3.setOption(option);
  }

  /**http */
  private async _getKangyiQuanqiu() {
    const result = await TabHomeKangyiModule.getKangyiQuanqiu({});
    if (result[0]) {
      let { yiqing_v2, leiji } = result[0];
      this.endDate = new Date(yiqing_v2.timestamp).toLocaleString();
      let quanqiu_add = 0;
      let quanqiu_sum = 0;
      let quanqiu_zhiyu = 0;
      let quanqiu_siwang = 0;
      let map1: any[] = [];
      let map2: any[] = [];
      const data1: any = {
        date: [],
        legend: ['累计确诊', '现存确诊'],
        series: [
          {
            name: '累计确诊',
            type: 'line',
            stack: '总量',
            data: [],
          },
          {
            name: '现存确诊',
            type: 'line',
            stack: '总量',
            data: [],
          },
        ],
      };
      const data2: any = {
        date: [],
        legend: ['治愈', '死亡'],
        series: [
          {
            name: '治愈',
            type: 'line',
            stack: '总量',
            data: [],
          },
          {
            name: '死亡',
            type: 'line',
            stack: '总量',
            data: [],
          },
        ],
      };
      const data3: any = {
        date: [],
        legend: ['中国', '海外'],
        series: [
          {
            name: '中国',
            type: 'line',
            stack: '总量',
            data: [],
          },
          {
            name: '海外',
            type: 'line',
            stack: '总量',
            data: [],
          },
        ],
      };
      for (let item of yiqing_v2.dataList) {
        if (item.name1 === '国外') {
          for (let child of item.child) {
            this.tableList = item.child;
            quanqiu_add += child.quezhen_add;
            quanqiu_sum += child.quezhen;
            quanqiu_zhiyu += child.zhiyu;
            quanqiu_siwang += child.siwang;
            map1.push({
              name: child.name2,
              value: child.quezhen_xianyou,
              value1: child.quezhen,
              value2: child.zhiyu,
              value3: child.siwang,
            });
            map2.push({
              name: child.name2,
              value1: child.quezhen_xianyou,
              value: child.quezhen,
              value2: child.zhiyu,
              value3: child.siwang,
            });
          }
        } else if (item.name1 === '全国') {
          map1.push({
            name: '中国',
            value: item.quezhen_xianyou,
            value1: item.quezhen,
            value2: item.zhiyu,
            value3: item.siwang,
          });
          map2.push({
            name: '中国',
            value1: item.quezhen_xianyou,
            value: item.quezhen,
            value2: item.zhiyu,
            value3: item.siwang,
          });
        }
      }
      for (let item of leiji.dataList) {
        //1
        data1.date.push(item.date);
        data2.date.push(item.date);
        data3.date.push(item.date);
        // 2
        data1.series[0].data.push(item.quezhen_guowai);
        data1.series[1].data.push(item.quezhen_guowai - item.zhiyu_guowai - item.siwang_guowai);
        // 3
        data2.series[0].data.push(item.zhiyu_guowai);
        data2.series[1].data.push(item.siwang_guowai);
        // 4
        data3.series[0].data.push(item.quezhen_add);
        data3.series[1].data.push(item.quezhen_add_guowai);
      }
      data1.date = data1.date.reverse();
      data2.date = data1.date.reverse();
      data3.date = data1.date.reverse();
      data1.series[0].data = data1.series[0].data.reverse();
      data1.series[1].data = data1.series[1].data.reverse();
      data2.series[0].data = data2.series[0].data.reverse();
      data2.series[1].data = data2.series[1].data.reverse();
      data3.series[0].data = data3.series[0].data.reverse();
      data3.series[1].data = data3.series[1].data.reverse();
      this.summaryData = { quanqiu_add, quanqiu_sum, quanqiu_zhiyu, quanqiu_siwang };
      this._initMap1(map1);
      this._initMap2(map2);
      this._initLine1(data1);
      this._initLine2(data2);
      this._initLine3(data3);
    }
    if (result[2]) {
      this.newsList = result[2];
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../style/kangyi_quanqiu.scss';
</style>