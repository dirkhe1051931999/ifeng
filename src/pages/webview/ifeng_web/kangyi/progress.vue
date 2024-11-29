<template>
  <div class="kangyi-dayimiao-progress" ref="kangyi-dayimiao-progress">
    <div class="header">
      <img :src="headerImg" alt="" v-show="headerImg" />
      <q-icon name="arrow_back" class="cancel" @click="$router.back()"></q-icon>
    </div>
    <div class="data-container">
      <div class="runtime-data" v-if="runtimeData['全球']">
        <p class="title">实时接种数据</p>
        <div class="item-wrap">
          <div class="item item1">
            <div class="count">{{ runtimeData['全球']['total'] | numberFormat }}</div>
            <div class="text">全球累计接种</div>
          </div>
          <div class="item item2">
            <div class="count">{{ runtimeData['中国']['add'] | numberFormat }}</div>
            <div class="text">全球较上日新增</div>
          </div>
          <div class="item item3">
            <div class="count">{{ runtimeData['中国']['per_hundred'] | numberFormat }}</div>
            <div class="text">全球每百人接种</div>
          </div>
          <div class="item item1">
            <div class="count">{{ runtimeData['中国']['total'] | numberFormat }}</div>
            <div class="text">中国累计接种</div>
          </div>
          <div class="item item2">
            <div class="count">{{ runtimeData['中国']['add'] | numberFormat }}</div>
            <div class="text">中国较上日新增</div>
          </div>
          <div class="item item3">
            <div class="count">{{ runtimeData['中国']['per_hundred'] | numberFormat }}</div>
            <div class="text">中国每百人接种</div>
          </div>
        </div>
        <div class="info"></div>
      </div>
      <div id="kangyi-dayimiao-progress-map" style="width: 100%; height: 270px" class="m-b-10 text-center">
        <van-loading size="12px" color="#969799">加载中...</van-loading>
      </div>
      <div id="kangyi-dayimiao-progress-line-chart-sum" style="width: 100%; height: 224px" class="m-b-10"></div>
      <div id="kangyi-dayimiao-progress-line-chart-per" style="width: 100%; height: 224px" class="m-b-10"></div>
      <div class="all-country-data">
        <div class="title">全球各国(地区)新冠肺炎疫苗接种情况</div>
        <ul class="table-title">
          <li class="country">国家(地区)</li>
          <li class="total">累计接种</li>
          <li class="per">每百人</li>
          <li class="vaccinebrands">疫苗研制单位</li>
          <li class="date">更新时间</li>
        </ul>
        <ul class="table-data">
          <li v-for="(item, index) in areaData" :key="index">
            <div class="country">
              {{ item.name }}
            </div>
            <div class="total">
              {{ item.total | numberFormat }}
            </div>
            <div class="per">{{ item.per_hundred }}</div>
            <div class="vaccinebrands">
              {{ item.vaccinebrands }}
            </div>
            <div class="date">{{ item.date }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { numberFormat } from 'src/filters';
import { TabHomeKangyiModule } from '@/store/modules/home_tab/kangyi';
import { Component, Vue } from 'vue-property-decorator';
import { worldNameMap } from '../data/worldNameMap';
@Component({ name: 'kangyi-dayimiao-progress' })
export default class extends Vue {
  $refs: any;
  mounted() {
    this._getVaccinationProgress();
  }
  public headerImg = '';
  public runtimeData: any = {};
  public runtimeDataInfo: any = {};
  public areaData: any[] = [];
  /**event */
  public _initMap(data: any) {
    let chart = window['echarts'].init(document.getElementById('kangyi-dayimiao-progress-map'));
    chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (a: any) => {
          return `${a.name}<br\>${a.data ? (a.data.date ? a.data.date : '') : ''}<br\>累计接种：${numberFormat(a.data ? (a.data.total ? a.data.total : 0) : 0)}<br/>每百人接种：${
            a.data ? (a.data.per_hundred ? a.data.per_hundred : '') : ''
          }`;
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
          itemStyle: {
            //没有选中的border色和背景色
            normal: {
              borderWidth: 0.5, //区域边框宽度
              borderColor: '#FEFFFF', //区域边框颜色
              areaColor: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: '#1C3F7D', // 0% 处的颜色
                  },
                  {
                    offset: 0,
                    color: '#2070CD', // 100% 处的颜色
                  },
                ],
                globalCoord: false,
              }, //区域颜色
            },
            // 选中的背景色和border色
            emphasis: {
              borderWidth: 0.5,
              borderColor: '#333333',
              areaColor: '#FEFFFF',
            },
          },
        },
      ],
    });
  }
  public _initLineChart(date: any, arr2PerData: any, arr2SumData: any) {
    let myChart1 = window['echarts'].init(document.getElementById('kangyi-dayimiao-progress-line-chart-sum'));
    let myChart2 = window['echarts'].init(document.getElementById('kangyi-dayimiao-progress-line-chart-per'));
    myChart1.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: (d: any) => {
          return `${d[0].name}<br\>${numberFormat(d[0].data)}`;
        },
      },
      title: {
        text: '中国累计接种趋势',
      },
      xAxis: {
        type: 'category',
        data: date,
      },
      grid: {
        left: '3%',
        right: '2%',
        bottom: '3%',
        top: '20%',
        containLabel: true,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => {
            return numberFormat(value);
          },
        },
      },
      series: [
        {
          data: arr2SumData,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#1C3F7D',
              barBorderRadius: [8, 8, 0, 0],
            },
          },
        },
      ],
    });
    myChart2.setOption({
      title: {
        text: '中国每百人接种趋势',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: date,
      },
      grid: {
        left: '3%',
        right: '2%',
        bottom: '3%',
        top: '20%',
        containLabel: true,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => {
            return numberFormat(value);
          },
        },
      },
      series: [
        {
          data: arr2PerData,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#1C3F7D',
              barBorderRadius: [8, 8, 0, 0],
            },
          },
        },
      ],
    });
  }
  /**http */
  public async _getVaccinationProgress() {
    const result = await TabHomeKangyiModule.getVaccinationProgress({});
    if (result[0]) {
      const arr1 = [];
      const arr2Date = [];
      const arr2PerData: any[] = [];
      const arr2SumData: any[] = [];
      const areaData = result[0].area.data;
      const trendData = result[0].trend.data;

      for (let item of areaData) {
        arr1.push({
          name: item.country,
          total: item.total,
          per_hundred: item.per_hundred,
          date: item.date,
          vaccinebrands: item.vaccinebrands,
        });
      }
      for (let item of trendData) {
        arr2Date.push(item.date);
        arr2PerData.push(item.per_hundred);
        arr2SumData.push(item.total);
      }
      // map
      this._initMap(arr1);
      this.areaData = arr1;
      // line
      this._initLineChart(arr2Date, arr2PerData, arr2SumData);
      // header img
      this.headerImg = result[0].thumbnail;
      // runtime data
      this.runtimeData = result[0].sumData.data;
      // runtime data info
      this.runtimeDataInfo = result[0].sumData.updateTime;
      this.$nextTick(() => {
        this.$refs['kangyi-dayimiao-progress'].style['height'] = `${window.innerHeight}px`;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.kangyi-dayimiao-progress {
  width: 100%;
  height: 100%;
  background: $white;
  overflow: scroll;
  .header {
    min-height: 190px;
    left: 0;
    top: 0;
    img {
      width: 100%;
      height: 190px;
      display: block;
    }
  }
  .data-container {
    padding: 15px 16px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    position: relative;
    z-index: 100;
    margin-top: -15px;
    background: $white;
    .runtime-data {
      width: 100%;
      box-shadow: 0 0.08rem 0.266667rem 0 rgb(194 200 219 / 30%);
      padding: 10px;
      margin-bottom: 20px;
      .title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .item-wrap {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        .item {
          text-align: center;
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
          .text {
            padding: 4px 10px;
            font-size: 12px;
            text-align: center;
            border-radius: 16px;
          }
          .count {
            font-size: 22px;
            font-weight: bold;
            padding-bottom: 10px;
          }
          &.item1 {
            .count {
              color: #4785f4;
            }
            .text {
              background: rgba(71, 133, 244, 0.07);
            }
          }
          &.item2 {
            .count {
              color: #35c3c3;
            }
            .text {
              background: rgba(53, 195, 195, 0.06);
            }
          }
          &.item3 {
            .text {
              background: rgba(78, 90, 101, 0.06);
            }
          }
        }
      }
    }
    .all-country-data {
      width: 100%;
      .title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .table-title {
        width: 100%;
        display: flex;
        align-items: center;
        color: $blue;
        font-size: 12px;
        margin-bottom: 10px;
        li {
          width: 20%;
          text-align: center;
        }
      }
      .table-data {
        width: 100%;
        li {
          &:nth-of-type(2n) {
            background: rgba(246, 246, 246, 0.5);
          }
          margin-bottom: 10px;
          width: 100%;
          display: flex;
          align-items: center;
          text-align: center;
          div {
            width: 20%;
            font-size: 12px;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>