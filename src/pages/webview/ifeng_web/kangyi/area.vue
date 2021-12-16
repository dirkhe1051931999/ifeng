<template>
  <div class="kangyi-area-container" ref="kangyi-area-container">
    <div class="header">
      <img src="~assets/kangyi/area-header.png" alt="" />
      <q-icon name="arrow_back" class="cancel" @click="$router.back()"></q-icon>
    </div>
    <div class="content">
      <div class="area">
        <div class="area-summary">
          <div class="top">
            <div class="l">
              {{ mapData.name1 || '--' }}疫情
              <q-icon name="sync_alt" class="icon" @click="handlerClickSelectProvince"></q-icon>
            </div>
            <div class="r hide" @click="handlerClickToKangyiSummary">点击查看全国疫情</div>
          </div>
          <div class="middle">
            <div class="xinzeng item">
              <p class="num">{{ mapData.quezhen_add || mapData.quezhen_add === 0 ? mapData.quezhen_add : '--' }}</p>
              <p class="text">昨日新增</p>
            </div>
            <div class="leijing item">
              <p class="num">{{ mapData.quezhen || mapData.quezhen === 0 ? mapData.quezhen : '--' }}</p>
              <p class="text">累计确诊</p>
            </div>
            <div class="zhiyu item">
              <p class="num">{{ mapData.zhiyu || mapData.zhiyu === 0 ? mapData.zhiyu : '--' }}</p>
              <p class="text">累计治愈</p>
            </div>
            <div class="siwang item">
              <p class="num">{{ mapData.siwang || mapData.siwang === 0 ? mapData.siwang : '--' }}</p>
              <p class="text">累计死亡</p>
            </div>
          </div>
          <div class="bottom">截止 {{ endDate || '--' }}</div>
        </div>
        <div class="area-map">
          <div class="area-map-1 text-center" id="area-map-1" style="width: 100%; height: 325px" :class="activeMapIndex === 0 ? 'active-map' : ''">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
          <div class="area-map-2 text-center" id="area-map-2" style="width: 100%; height: 325px" :class="activeMapIndex === 1 ? 'active-map' : ''">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
          <div class="switch">
            <span :class="activeMapIndex === 0 ? 'active' : ''" @click="activeMapIndex = 0">现存确诊</span>
            <span :class="activeMapIndex === 1 ? 'active' : ''" @click="activeMapIndex = 1">累计确诊</span>
          </div>
        </div>
        <div class="area-table">
          <div class="area-table-title">{{ mapData.name1 || '--' }}病例</div>
          <ul class="table-header">
            <li class="shengshi">省市</li>
            <li class="xinzeng">昨日新增</li>
            <li class="quezhen">累计确诊</li>
            <li class="zhiyu">治愈</li>
            <li class="siwang">死亡</li>
          </ul>
          <ul class="table-content">
            <li v-for="(item, index) in mapData.child" :key="index">
              <div class="shengshi">{{ item.name2 }}</div>
              <div class="xinzeng">{{ item.quezhen_add }}</div>
              <div class="quezhen">{{ item.quezhen }}</div>
              <div class="zhiyu">{{ item.zhiyu }}</div>
              <div class="siwang">{{ item.siwang }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="area-news">
        <div class="area-news-title">
          <img src="~assets/kangyi/area-index.png" alt="" />
          <span>本地报道</span>
        </div>
        <ul>
          <li v-for="(news, index) in newsDataList" :key="index">
            <div class="l">
              {{ news.title }}
            </div>
            <div class="r" v-if="news.thumbnails">
              <van-image class="thumbnail" :src="news.thumbnails.image.value[0].url" lazy-load />
            </div>
          </li>
        </ul>
      </div>
    </div>
    <van-popup v-model="showSelectProvince" position="bottom" :style="{ height: '30%' }">
      <van-picker title="选择省份/市" show-toolbar :columns="allProvinces" @confirm="onConfirm" @cancel="onCancel" />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { TabHomeKangyiModule } from '@/store/modules/home_tab/kangyi';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { provs } from '../data/chinaProvince';
import { chinaCountyNameMap } from '../data/chinaCountyNameMap';
@Component({
  name: 'kangyi-area-container',
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
  async mounted() {
    this._getAreaYiqing(this.$route.query.code);
    this.$refs['kangyi-area-container'].style['height'] = window.innerHeight + 'px';
  }
  private pageLoaded = false;
  private pageLoading = false;
  private mapData: any = {};
  private endDate: any = '';
  private newsDataList: any[] = [];
  private activeMapIndex = 0;
  private currentCity = 'shanxi1';
  private zhixiashi = ['北京', '天津', '上海', '重庆'];
  private isZhixiashi = false;
  private showSelectProvince = false;
  private allProvinces: any[] = [];
  private map1: any;
  private map2: any;
  /**event */
  private handlerClickSelectProvince() {
    this.showSelectProvince = true;
  }
  async onConfirm(value: any, index: any) {
    let code = '';
    for (let key in provs) {
      const obj = provs[key];
      if (obj.areaName === value) {
        code = key;
      }
    }
    this.showSelectProvince = false;
    this.activeMapIndex = 0;
    this.map1.dispose();
    this.map2.dispose();
    this.$q.loading.show({
      delay: 300,
    });
    await this._getAreaYiqing(code);
    this.$q.loading.hide();
  }
  onCancel() {
    this.showSelectProvince = false;
  }
  private handlerClickToKangyiSummary() {
    this.$router.push('/ifeng_web_kangyi_summary');
  }
  /**http */
  private async _initMap1(data: any, result: any) {
    //注册可用的地图,必须在包括 geo 组件或者 map 图表类型的时候才能使用。
    window['echarts'].registerMap(this.currentCity, result);
    //初始化
    this.map1 = window['echarts'].init(document.getElementById('area-map-1'));
    this.map1.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (a: any) => {
          try {
            return `${a.name}<br\>现存确诊：${a.data.value}<br/>累计确诊：${a.data.value1}<br/>累计治愈：${a.data.zhiyu}<br/>累计死亡：${a.data.siwang}<br/>`;
          } catch (error) {
            return '暂无数据';
          }
        },
      },
      visualMap: {
        type: 'piecewise',
        pieces: [
          { min: 100, max: 9999, label: '确诊500-999人', color: '#4e160f' },
          { min: 59, max: 99, label: '确诊100-499人', color: '#974236' },
          { min: 10, max: 49, label: '确诊10-99人', color: '#ee7263' },
          { min: 1, max: 9, label: '确诊1-9人', color: '#f5bba7' },
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
      // 一系列的配置参数
      series: [
        {
          type: 'map',
          map: this.currentCity,
          top: 0,
          bottom: 0,
          aspectScale: 0.75, //长宽比
          showLegendSymbol: false, // 存在legend时显示
          selectedMode: 'single',
          data,
          nameMap: chinaCountyNameMap,
        },
      ],
    });
  }
  private async _initMap2(data: any, result: any) {
    //注册可用的地图,必须在包括 geo 组件或者 map 图表类型的时候才能使用。
    window['echarts'].registerMap(this.currentCity, result);
    //初始化
    this.map2 = window['echarts'].init(document.getElementById('area-map-2'));
    this.map2.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (a: any) => {
          try {
            return `${a.name}<br\>现存确诊：${a.data.value1}<br/>累计确诊：${a.data.value}<br/>累计治愈：${a.data.zhiyu}<br/>累计死亡：${a.data.siwang}<br/>`;
          } catch (error) {
            return '暂无数据';
          }
        },
      },
      visualMap: {
        type: 'piecewise',
        pieces: [
          { min: 100, max: 9999, label: '确诊500-999人', color: '#4e160f' },
          { min: 59, max: 99, label: '确诊100-499人', color: '#974236' },
          { min: 10, max: 49, label: '确诊10-99人', color: '#ee7263' },
          { min: 1, max: 9, label: '确诊1-9人', color: '#f5bba7' },
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
      // 一系列的配置参数
      series: [
        {
          type: 'map',
          map: this.currentCity,
          top: 0,
          bottom: 0,
          aspectScale: 0.75, //长宽比
          showLegendSymbol: false, // 存在legend时显示
          selectedMode: 'single',
          data,
          nameMap: chinaCountyNameMap,
        },
      ],
    });
  }
  private async _getAreaYiqing(code: any) {
    code = code ? code : '029';
    let obj: any = {};
    for (let key in provs) {
      this.allProvinces.push(provs[key].areaName);
      if (key === String(code)) {
        obj = provs[key];
        this.currentCity = obj.prov;
        if (this.zhixiashi.includes(obj.areaName)) {
          this.isZhixiashi = true;
        }
      }
    }
    const result = await TabHomeKangyiModule.getAreaYiqing({
      params: { code, areaName: obj.areaName, data: obj.data, prov: obj.prov },
    });
    const result2 = await TabHomeKangyiModule.loadProvinceJson({ params: { name: this.currentCity } });
    if (result[0]) {
      let { yiqing_v2 } = result[0];
      let { dataList, timestamp } = yiqing_v2;
      this.endDate = new Date(timestamp).toLocaleString();
      for (let item of dataList) {
        if (item.name1 === obj.areaName) {
          this.mapData = item;
        }
      }
    }
    this.newsDataList = result[2] ? result[2] : [];
    const { child } = this.mapData;
    this.mapData.child.push({
      name2: this.mapData.name1,
      quezhen: this.mapData.quezhen,
      quezhen_add: this.mapData.quezhen_add,
      quezhen_xianyou: this.mapData.quezhen_xianyou,
      siwang: this.mapData.siwang,
      zhiyu: this.mapData.zhiyu,
    });
    this.mapData.child.reverse();
    const arr1 = [];
    const arr2 = [];
    for (let item of child) {
      arr1.push({
        name: !this.isZhixiashi ? item.name2 + '市' : item.name2,
        value: item.quezhen_xianyou,
        value1: item.quezhen,
        zhiyu: item.zhiyu,
        siwang: item.siwang,
      });
      arr2.push({
        name: !this.isZhixiashi ? item.name2 + '市' : item.name2,
        value1: item.quezhen_xianyou,
        value: item.quezhen,
        zhiyu: item.zhiyu,
        siwang: item.siwang,
      });
    }
    this._initMap1(arr1, result2);
    this._initMap2(arr2, result2);
    return Promise.resolve();
  }
}
</script>


<style lang="scss" scoped>
@import '../style/kangyi_area.scss';
</style>