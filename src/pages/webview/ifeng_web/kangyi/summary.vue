<template>
  <div class="kangyi-summary-container" ref="kangyi-summary-container" @scroll="minitorScrollEvent">
    <div class="header">
      <img src="https://x0.ifengimg.com/ucms/2020_40/476094BD3C08666F1F2016D73443BCE6392ACB23_w1125_h483.png" alt="" />
    </div>
    <div class="content">
      <div class="bingli">
        <div class="summary">
          <div class="top">
            <div class="l">全国疫情</div>
            <div class="r hide" @click="handlerClickToKangyiShuru">点击查看输入疫情</div>
          </div>
          <div class="middle" v-if="mapData.child">
            <div class="xiancun item">
              <p class="up">
                昨日
                <span>{{ mapData.child[0].quezhen_xianyou }}</span>
              </p>
              <p class="num">{{ mapData.quezhen_xianyou || mapData.quezhen_xianyou === 0 ? mapData.quezhen_xianyou : '--' }}</p>
              <p class="text">现存确诊</p>
            </div>
            <div class="wuzhengzhuang item">
              <p class="up">
                昨日
                <span>{{ mapData.child[0].quezhen_wzz }}</span>
              </p>
              <p class="num">{{ mapData.quezhen_wzz || mapData.quezhen_wzz === 0 ? mapData.quezhen_wzz : '--' }}</p>
              <p class="text">无症状感染</p>
            </div>
            <div class="jingwai-shuru item">
              <p class="up">
                昨日
                <span>{{ mapData.child[0].quezhen_jingwaishuru }}</span>
              </p>
              <p class="num">{{ mapData.quezhen_jingwaishuru || mapData.quezhen_jingwaishuru === 0 ? mapData.quezhen_jingwaishuru : '--' }}</p>
              <p class="text">境外输入</p>
            </div>
            <div class="leiji-quezhen item">
              <p class="up">
                昨日
                <span>{{ mapData.child[0].quezhen }}</span>
              </p>
              <p class="num">{{ mapData.quezhen || mapData.quezhen === 0 ? mapData.quezhen : '--' }}</p>
              <p class="text">累计确诊</p>
            </div>
            <div class="leiji-zhiyu item">
              <p class="up">
                昨日
                <span>{{ mapData.child[0].zhiyu }}</span>
              </p>
              <p class="num">{{ mapData.zhiyu || mapData.zhiyu === 0 ? mapData.zhiyu : '--' }}</p>
              <p class="text">累计治愈</p>
            </div>
            <div class="leiji-siwang item">
              <p class="up">
                昨日
                <span>{{ mapData.child[0].siwang }}</span>
              </p>
              <p class="num">{{ mapData.siwang || mapData.siwang === 0 ? mapData.siwang : '--' }}</p>
              <p class="text">累计死亡</p>
            </div>
          </div>
          <div class="bottom">截止 {{ endDate || '--' }}</div>
        </div>
        <div class="map">
          <div id="kangyi-summary-map1" class="map1 text-center" style="width: 100%; height: 350px" :class="activeMapIndex === 0 ? 'active-map' : ''">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
          <div id="kangyi-summary-map2" class="map2 text-center" style="width: 100%; height: 350px" :class="activeMapIndex === 1 ? 'active-map' : ''">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
          <div class="switch">
            <span :class="activeMapIndex === 0 ? 'active' : ''" @click="activeMapIndex = 0">现存确诊</span>
            <span :class="activeMapIndex === 1 ? 'active' : ''" @click="activeMapIndex = 1">累计确诊</span>
          </div>
        </div>
        <div class="line">
          <div id="kangyi-summary-line1" class="line1" style="width: 100%; height: 250px" :class="activeLineIndex === 0 ? 'active-line' : ''"></div>
          <div id="kangyi-summary-line2" class="line2" style="width: 100%; height: 250px" :class="activeLineIndex === 1 ? 'active-line' : ''"></div>
          <div id="kangyi-summary-line3" class="line3" style="width: 100%; height: 250px" :class="activeLineIndex === 2 ? 'active-line' : ''"></div>
          <div class="switch">
            <span :class="activeLineIndex === 0 ? 'active' : ''" @click="activeLineIndex = 0">全国新增</span>
            <span :class="activeLineIndex === 1 ? 'active' : ''" @click="activeLineIndex = 1">全国累计</span>
            <span :class="activeLineIndex === 2 ? 'active' : ''" @click="activeLineIndex = 2">病死率/治愈率</span>
          </div>
        </div>
        <div class="quanguo-data">
          <div class="quanguo-data-title">地区病例</div>
          <ul class="quanguo-data-table-header">
            <li class="diqu">省市</li>
            <li class="xinzeng">昨日新增</li>
            <li class="quezhen">累计确诊</li>
            <li class="zhiyu">治愈</li>
            <li class="siwang">死亡</li>
            <li class="yiqing">疫情</li>
          </ul>
          <ul class="quanguo-data-table-content">
            <li v-for="(item, index) in provinceYiQingList" :key="index">
              <div class="diqu">{{ item.name1 }}</div>
              <div class="xinzeng">{{ item.quezhen_add }}</div>
              <div class="quezhen">{{ item.quezhen_add }}</div>
              <div class="zhiyu">{{ item.zhiyu }}</div>
              <div class="siwang">{{ item.siwang }}</div>
              <div class="yiqing">
                <span v-if="!['香港', '澳门', '台湾'].includes(item.name1)" @click="handlerClickQuanguoTableDetail(item.name1)">详情</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="guowai-data">
          <div class="guowai-data-title">
            <span class="l">国外病例</span>
            <span class="r hide">点击查看全球疫情</span>
          </div>
          <ul class="guowai-data-table-header">
            <li class="diqu">国家</li>
            <li class="xinzeng">昨日新增</li>
            <li class="quezhen">累计确诊</li>
            <li class="zhiyu">治愈</li>
            <li class="siwang">死亡</li>
            <li class="yiqing">疫情</li>
          </ul>
          <ul class="guowai-data-table-content">
            <li v-for="(item, index) in guowaiYiQingList" :key="index">
              <div class="diqu">{{ item.name1 }}</div>
              <div class="xinzeng">{{ item.quezhen_add }}</div>
              <div class="quezhen">{{ item.quezhen_add }}</div>
              <div class="zhiyu">{{ item.zhiyu }}</div>
              <div class="siwang">{{ item.siwang }}</div>
              <div class="yiqing">
                <span v-if="['美国', '英国', '日本'].includes(item.name1)" @click="handlerClickGuowaiTableDetail(item.name1)">详情</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="dongtai">
        <div class="dongtai-title">
          <img src="~assets/kangyi/area-index.png" alt="" />
          <span>实时动态</span>
        </div>
        <q-timeline color="primary" class="timeline">
          <q-timeline-entry :subtitle="item.moment" v-for="(item, index) in timeLineList" :key="index">
            <div class="content">
              {{ item.summary }}
            </div>
          </q-timeline-entry>
        </q-timeline>
      </div>
      <div class="news">
        <div class="news-title">
          <img src="~assets/kangyi/area-index.png" alt="" />
          <span>报道矩阵</span>
        </div>
        <ul>
          <li v-for="(news, index) in newsDataList" :key="index">
            <div class="l">
              {{ news.title }}
            </div>
            <div class="r" v-if="news.thumbnail">
              <van-image class="thumbnail" :src="news.thumbnail" lazy-load />
              <q-icon name="ondemand_video" class="icon" v-if="news.type === 'video'"></q-icon>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TabHomeKangyiModule } from 'src/store/modules/tab_home_kangyi';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { provs } from '../data/chinaProvince';

@Component({
  name: 'kangyi-summary',
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
  @Watch('$route')
  onchange3(to: any, from: any) {
    if (this.$route.path === '/ifeng_web_kangyi_summary') {
      this.$refs['kangyi-summary-container'].scrollTop = this.containerPositionY;
    }
  }
  mounted() {
    this._getKangyiSummary();
    this.$refs['kangyi-summary-container'].style['height'] = window.innerHeight + 'px';
  }
  private activeMapIndex = 0;
  private activeLineIndex = 0;
  private mapData: any = {};
  private endDate: any = '';
  private map1: any;
  private map2: any;
  private line1: any;
  private line2: any;
  private line3: any;
  private provinceYiQingList: any[] = [];
  private guowaiYiQingList: any[] = [];
  private timeLineList: any[] = [];
  private newsDataList: any[] = [];
  private containerPositionY = 0;
  /**event */
  private _initMap1(data: any) {
    //初始化echarts实例
    this.map1 = window['echarts'].init(document.getElementById('kangyi-summary-map1'));
    // 指定图表的配置项和数据
    let option = {
      tooltip: {
        trigger: 'item',
      },
      visualMap: {
        type: 'piecewise',
        pieces: [
          { min: 1000, max: 1000000, label: '大于等于1000人', color: '#372a28' },
          { min: 500, max: 999, label: '确诊500-999人', color: '#4e160f' },
          { min: 100, max: 499, label: '确诊100-499人', color: '#974236' },
          { min: 10, max: 99, label: '确诊10-99人', color: '#ee7263' },
          { min: 1, max: 9, label: '确诊1-9人', color: '#f5bba7' },
        ],
        color: ['#E0022B', '#E09107', '#A3E00B'],
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
          aspectScale: 0.75, //长宽比
          showLegendSymbol: false, // 存在legend时显示
          selectedMode: 'single',
          name: '确诊数',
          type: 'map',
          left: 0,
          right: 0,
          top: 0,

          mapType: 'china',
          roam: false,
          label: {
            show: true,
            color: '#000',
            fontSize: '12px',
          },
          data,
        },
      ],
    };
    //使用指定的配置项和数据显示图表
    this.map1.setOption(option);
  }
  private _initMap2(data: any) {
    //初始化echarts实例
    this.map2 = window['echarts'].init(document.getElementById('kangyi-summary-map2'));
    // 指定图表的配置项和数据
    let option = {
      tooltip: {
        trigger: 'item',
      },
      visualMap: {
        type: 'piecewise',
        pieces: [
          { min: 1000, max: 1000000, label: '大于等于1000人', color: '#372a28' },
          { min: 500, max: 999, label: '确诊500-999人', color: '#4e160f' },
          { min: 100, max: 499, label: '确诊100-499人', color: '#974236' },
          { min: 10, max: 99, label: '确诊10-99人', color: '#ee7263' },
          { min: 1, max: 9, label: '确诊1-9人', color: '#f5bba7' },
        ],
        color: ['#E0022B', '#E09107', '#A3E00B'],
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
          aspectScale: 0.75, //长宽比
          showLegendSymbol: false, // 存在legend时显示
          selectedMode: 'single',
          name: '确诊数',
          type: 'map',
          left: 0,
          right: 0,
          top: 0,
          mapType: 'china',
          roam: false,
          label: {
            show: true,
            color: '#000',
          },
          data,
        },
      ],
    };
    //使用指定的配置项和数据显示图表
    this.map2.setOption(option);
  }
  private _initLine1(data: any) {
    this.line1 = window['echarts'].init(document.getElementById('kangyi-summary-line1'));
    let option;
    option = {
      tooltip: {
        trigger: 'axis',
      },
      title: {
        text: '全国疫情新增趋势图',
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
    this.line2 = window['echarts'].init(document.getElementById('kangyi-summary-line2'));
    let option;
    option = {
      tooltip: {
        trigger: 'axis',
      },
      title: {
        text: '全国疫情累计趋势图',
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
    this.line3 = window['echarts'].init(document.getElementById('kangyi-summary-line3'));
    let option;
    option = {
      tooltip: {
        trigger: 'axis',
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
      title: {
        text: '全国疫情病死/治愈率趋势图（%）',
        textStyle: {
          fontSize: 14,
          color: '#323232',
          fontWeight: 'normal',
        },
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
  private handlerClickToKangyiShuru() {
    this.$router.push('/ifeng_web_kangyi_jingwai');
  }
  private handlerClickQuanguoTableDetail(name: any) {
    let code = '';
    for (let key in provs) {
      if (name === provs[key].areaName) {
        code = key;
      }
    }
    this.$router.push('/ifeng_web_kangyi_area?code=' + code);
  }
  private handlerClickGuowaiTableDetail() {}
  private minitorScrollEvent() {
    const scrollTop = this.$refs['kangyi-summary-container'].scrollTop;
    this.containerPositionY = scrollTop;
  }
  /**http */
  private async _getKangyiSummary() {
    const result = await TabHomeKangyiModule.getKangyiSummary({});
    const arr1: any[] = [];
    const arr2: any[] = [];
    const data1: any = {
      date: [],
      legend: ['确诊', '疑似', '治愈', '死亡'],
      series: [
        {
          name: '确诊',
          type: 'line',
          stack: '总量',
          data: [],
        },
        {
          name: '疑似',
          type: 'line',
          stack: '总量',
          data: [],
        },
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
    const data2: any = {
      date: [],
      legend: ['确诊', '治愈', '死亡'],
      series: [
        {
          name: '确诊',
          type: 'line',
          stack: '总量',
          data: [],
        },
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
      legend: ['病死率', '治愈率'],
      series: [
        {
          name: '病死率',
          type: 'line',
          stack: '总量',
          data: [],
        },
        {
          name: '治愈率',
          type: 'line',
          stack: '总量',
          data: [],
        },
      ],
    };
    if (result[0]) {
      let { yiqing_v2, xinzeng, modules } = result[0];
      let { dataList, timestamp } = yiqing_v2;
      this.endDate = new Date(timestamp).toLocaleString();
      let dataList2: any[] = [];
      const dataList3: any[] = [];
      for (let item of dataList) {
        if (item.name1 === '全国') {
          this.mapData = item;
        } else if (item.name1 !== '国外' && item.name1 !== '港澳台') {
          dataList2.push({
            name1: item.name1,
            quezhen: item.quezhen,
            quezhen_add: item.quezhen_add,
            siwang: item.siwang,
            zhiyu: item.zhiyu,
          });
        } else if (item.name1 === '港澳台') {
          for (let child of item.child) {
            dataList3.push({ name1: child.name2, quezhen: child.quezhen, quezhen_add: child.quezhen_add, siwang: child.siwang, zhiyu: child.zhiyu });
          }
        } else if (item.name1 === '国外') {
          for (let child of item.child) {
            this.guowaiYiQingList.push({
              name1: child.name2,
              quezhen: child.quezhen,
              quezhen_add: child.quezhen_add,
              siwang: child.siwang,
              zhiyu: child.zhiyu,
            });
          }
        }
        arr1.push({
          name: item.name1,
          value: item.quezhen_xianyou,
          value2: item.quezhen,
          value3: item.siwang,
        });
        arr2.push({
          name: item.name1,
          value: item.quezhen,
          value2: item.quezhen_xianyou,
          value3: item.siwang,
        });
      }
      for (let item of xinzeng.dataList) {
        data1.date.unshift(item['date']);
        data2.date.unshift(item['date']);
        data3.date.unshift(item['date']);
        // 1
        data1.series[0].data.unshift(item.quezhen_add);
        data1.series[1].data.unshift(item.yisi_add);
        data1.series[2].data.unshift(item.zhiyu_add);
        data1.series[3].data.unshift(item.siwang_add);
        // 2
        data2.series[0].data.unshift(item.quezhen);
        data2.series[1].data.unshift(item.zhiyu);
        data2.series[2].data.unshift(item.siwang);
        // 3
        data3.series[0].data.unshift(((item.siwang / item.quezhen) * 100).toFixed(2));
        data3.series[1].data.unshift(((item.zhiyu / item.quezhen) * 100).toFixed(2));
      }
      this._initMap1(arr1);
      this._initMap2(arr2);
      this._initLine1(data1);
      this._initLine2(data2);
      this._initLine3(data3);
      dataList2 = dataList2.concat(dataList3);
      this.provinceYiQingList = dataList2;
      this.timeLineList = modules[1].data.slice(0, 100);
      this.newsDataList = modules[6].data.articleList;
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../style/kangyi_summary.scss';
</style>