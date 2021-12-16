<template>
  <div class="kangyi-other-guojia-container" ref="kangyi-other-guojia-container">
    <div class="header">
      <img src="https://x0.ifengimg.com/ucms/2020_40/476094BD3C08666F1F2016D73443BCE6392ACB23_w1125_h483.png" alt="" />
      <q-icon name="arrow_back" class="cancel" @click="$router.back()"></q-icon>
    </div>
    <div class="content">
      <div class="summary">
        <div class="top">{{ ohterGuojiaData.name || '--' }}疫情</div>
        <div class="middle">
          <div class="xinzeng">
            <p class="count" v-if="ohterGuojiaData.add">{{ ohterGuojiaData.add | numberFormat }}</p>
            <p class="count" v-else>--</p>
            <p class="text">新增病例</p>
          </div>
          <div class="quezhen">
            <p class="count" v-if="ohterGuojiaData.quezhen">{{ ohterGuojiaData.quezhen | numberFormat }}</p>
            <p class="count" v-else>--</p>
            <p class="text">累计确诊</p>
          </div>
          <div class="zhiyu">
            <p class="count" v-if="ohterGuojiaData.zhiyu">{{ ohterGuojiaData.zhiyu | numberFormat }}</p>
            <p class="count" v-else>--</p>
            <p class="text">累计治愈</p>
          </div>
          <div class="siwang">
            <p class="count" v-if="ohterGuojiaData.siwang">{{ ohterGuojiaData.siwang | numberFormat }}</p>
            <p class="count" v-else>--</p>
            <p class="text">累计死亡</p>
          </div>
        </div>
        <div class="bottom">截止{{ endDate || '--' }}</div>
      </div>
      <div class="map">
        <div class="kangyi-other-guojia-map1 hide" id="kangyi-other-guojia-map1" style="width: 100%; height: 300px"></div>
      </div>
      <div class="line">
        <div
          class="kangyi-other-guojia-line1"
          id="kangyi-other-guojia-line1"
          style="width: 100%; height: 250px"
          :class="[activeLineIndex === 0 ? 'active-line' : '']"
        >
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
        <div
          class="kangyi-other-guojia-line2"
          id="kangyi-other-guojia-line2"
          style="width: 100%; height: 250px"
          :class="[activeLineIndex === 1 ? 'active-line' : '']"
        >
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
        <div class="switch">
          <span :class="activeLineIndex === 0 ? 'active' : ''" @click="activeLineIndex = 0">{{ ohterGuojiaData.name }}新增</span>
          <span :class="activeLineIndex === 1 ? 'active' : ''" @click="activeLineIndex = 1">{{ ohterGuojiaData.name }}累计</span>
        </div>
      </div>
      <div class="table" v-if="tableList.length">
        <div class="block-title">
          <img src="~assets/kangyi/area-index.png" alt="" />
          <span>{{ ohterGuojiaData.name }}病例</span>
        </div>
        <ul class="table-header">
          <li class="diqu">地区</li>
          <li class="quezhen">确诊</li>
          <li class="zhiyu">治愈</li>
          <li class="siwang">死亡</li>
        </ul>
        <ul class="table-content">
          <li v-for="(item, index) in tableList" :key="index">
            <div class="diqu">{{ item.name3 }}</div>
            <div class="quezhen">{{ item.quezhen }}</div>
            <div class="zhiyu">{{ item.zhiyu }}</div>
            <div class="siwang">{{ item.siwang }}</div>
          </li>
        </ul>
      </div>
      <div class="news">
        <div class="block-title">
          <img src="~assets/kangyi/area-index.png" alt="" />
          <span>当地报道</span>
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
import { TabHomeKangyiModule } from '@/store/modules/home_tab/kangyi';
import { Component, Vue, Watch } from 'vue-property-decorator';
const guojiaData: any = {
  日本: '210358',
  美国: '240183',
  西班牙: '210359',
  德国: '210357',
  法国: '210356',
  伊朗: '210355',
  意大利: '210354',
  韩国: '210353',
  英国: '240187',
  印度: '180169',
};
const guojiaCode = {
  日本: 'Japan',
  美国: 'USA',
  西班牙: 'Spain',
  德国: 'Germany',
  法国: 'France',
  伊朗: 'Iran',
  意大利: 'Italy',
  韩国: 'Korea',
  英国: 'UK',
  印度: 'India',
};
@Component({
  name: 'kangyi-other-guojia',
})
export default class extends Vue {
  $refs: any;
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
  }
  mounted() {
    this.ohterGuojiaData.name = this.$route.query.name;
    this.$refs['kangyi-other-guojia-container'].style['height'] = window.innerHeight + 'px';
    this._getKangyiOtherGuojia();
  }
  private ohterGuojiaData: any = {
    name: '',
    add: '',
    quezhen: '',
    zhiyu: '',
    siwang: '',
  };
  private newsList: any[] = [];
  private tableList: any[] = [];
  private activeLineIndex = 0;
  private endDate: any = '';
  private line1: any;
  private line2: any;
  /**event */
  private _initLine1(data: any) {
    this.line1 = window['echarts'].init(document.getElementById('kangyi-other-guojia-line1'));
    let option;
    option = {
      tooltip: {
        trigger: 'axis',
      },
      title: {
        text: `${this.ohterGuojiaData.name}疫情新增趋势图`,
        textStyle: {
          fontSize: 14,
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
        data: ['新增确诊', '新增治愈', '新增死亡'],
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
        min: 0,
      },
      series: data.series,
    };
    option && this.line1.setOption(option);
  }
  private _initLine2(data: any) {
    this.line2 = window['echarts'].init(document.getElementById('kangyi-other-guojia-line2'));
    let option;
    option = {
      tooltip: {
        trigger: 'axis',
      },
      title: {
        text: `${this.ohterGuojiaData.name}疫情累计趋势图`,
        textStyle: {
          fontSize: 14,
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
        data: ['累计确诊', '累计治愈', '累计死亡'],
        right: 0,
        itemGap: 2,
        itemWidth: 8,
        itemHeight: 8,
      },
      grid: {
        top: '13%',
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
  /**http */
  private async _getKangyiOtherGuojia() {
    const countryName: any = this.$route.query.name;
    const result = await TabHomeKangyiModule.getKangyiOtherGuojia({
      params: {
        code: guojiaCode[countryName],
        data: guojiaData[countryName],
      },
    });
    if (result[0]) {
      let { yiqing_v2, worldAllDate } = result[0];
      let worldAllDate_guojia = worldAllDate[this.ohterGuojiaData.name];
      const data1: any = {
        date: [],
        series: [
          {
            name: '新增确诊',
            type: 'line',
            stack: '总量',
            data: [],
          },
          {
            name: '新增治愈',
            type: 'line',
            stack: '总量',
            data: [],
          },
          {
            name: '新增死亡',
            type: 'line',
            stack: '总量',
            data: [],
          },
        ],
      };
      const data2: any = {
        date: [],
        series: [
          {
            name: '累计确诊',
            type: 'line',
            stack: '总量',
            data: [],
          },
          {
            name: '累计治愈',
            type: 'line',
            stack: '总量',
            data: [],
          },
          {
            name: '累计死亡',
            type: 'line',
            stack: '总量',
            data: [],
          },
        ],
      };
      this.endDate = new Date(yiqing_v2.timestamp).toLocaleString();
      for (let item of yiqing_v2.dataList) {
        if (item.name1 === '国外') {
          for (let child of item.child) {
            if (child.name2 === this.ohterGuojiaData.name) {
              this.ohterGuojiaData.add = child.quezhen_add;
              this.ohterGuojiaData.quezhen = child.quezhen;
              this.ohterGuojiaData.zhiyu = child.zhiyu;
              this.ohterGuojiaData.siwang = child.siwang;
              this.tableList = child.child;
            }
          }
        }
      }

      for (let item of worldAllDate_guojia) {
        data1.date.push(item.date);
        data2.date.push(item.date);
        data1.series[0].data.push(item.quezhen_add);
        data1.series[1].data.push(item.zhiyu_add);
        data1.series[2].data.push(item.siwang_add);

        data2.series[0].data.push(item.quezhen);
        data2.series[1].data.push(item.zhiyu);
        data2.series[2].data.push(item.siwang);
      }
      data1.date = data1.date.reverse();
      data2.date = data2.date.reverse();
      data1.series[0].data = data1.series[0].data.reverse();
      data1.series[1].data = data1.series[1].data.reverse();
      data1.series[2].data = data1.series[2].data.reverse();
      data2.series[0].data = data2.series[0].data.reverse();
      data2.series[1].data = data2.series[1].data.reverse();
      data2.series[2].data = data2.series[2].data.reverse();
      this._initLine1(data1);
      this._initLine2(data2);
    }
    if (result[2]) {
      this.newsList = result[2];
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../style/kangyi_other_guojia.scss';
</style>