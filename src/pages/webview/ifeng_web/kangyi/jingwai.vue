<template>
  <div class="kangyi-jingwai-container" ref="kangyi-jingwai-container">
    <div class="header">
      <img src="https://x0.ifengimg.com/ucms/2020_40/14AB6254B3A282DE76A5809DA80A72BF039749BD_w1125_h483.png" alt="" />
      <q-icon name="arrow_back" class="cancel" @click="$router.back()"></q-icon>
    </div>
    <div class="content">
      <div class="summary-charts">
        <div class="summary">
          <div class="top">境外输入病例</div>
          <div class="middle">
            <div class="l">
              新增
              <span v-if="summaryData.child">{{
                summaryData.child[0].quezhen_jingwaishuru || summaryData.child[0].quezhen_jingwaishuru === 0 ? summaryData.child[0].quezhen_jingwaishuru : '--'
              }}</span>
              例
            </div>
            <div class="r">
              累计
              <span>{{ summaryData.quezhen_jingwaishuru || summaryData.quezhen_jingwaishuru === 0 ? summaryData.quezhen_jingwaishuru : '--' }}</span>
              例
            </div>
          </div>
          <div class="bottom">截止{{ endDate || '--' }}</div>
        </div>
        <div class="charts">
          <div class="kangyi-jingwai-map m-b-10 bg-white text-center" id="kangyi-jingwai-map" style="width: 100%; height: 250px">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
          <div>
            <div class="block-title">
              <img src="~assets/kangyi/area-index.png" alt="" />
              <span>境外输入确诊病例来源</span>
            </div>
            <div class="kangyi-jingwai-sankey bg-white" id="kangyi-jingwai-sankey" style="width: 100%; height: 2200px"></div>
          </div>
          <div>
            <div class="block-title">
              <img src="~assets/kangyi/area-index.png" alt="" />
              <span>境外输入疫情趋势</span>
            </div>
            <div class="kangyi-jingwai-line1" id="kangyi-jingwai-line1" style="width: 100%; height: 200px"></div>
            <div class="kangyi-jingwai-line2" id="kangyi-jingwai-line2" style="width: 100%; height: 200px"></div>
          </div>
        </div>
      </div>
      <div class="table">
        <div class="block-title">
          <img src="~assets/kangyi/area-index.png" alt="" />
          <span>境外输入确诊病例</span>
        </div>
        <q-table class="list" :data="tableData" :columns="tableColumns" row-key="name" hide-pagination flat dense :pagination="{ rowsPerPage: tableData.length }" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { isEqual, uniqWith } from 'lodash';
import { TabHomeKangyiModule } from '@/store/modules/home_tab/kangyi';
import { Component, Vue } from 'vue-property-decorator';
import { worldNameMap } from '../data/worldNameMap';

@Component({
  name: 'kangyi-jingwai',
})
export default class extends Vue {
  $refs: any;
  mounted() {
    this._getKangyiJingwai();
    this.$refs['kangyi-jingwai-container'].style['height'] = `${window.innerHeight}px`;
  }
  public endDate: any = '';
  public summaryData: any = {};
  public tableData: any = [];
  public tableColumns: any = [
    {
      name: 'area',
      label: '省市',
      align: 'left',
      field: 'area',
    },
    {
      name: 'count',
      label: '累计输入',
      align: 'center',
      field: 'count',
      sortable: true,
    },
  ];
  /**event */
  public _initMap(data: any) {
    let { geoCoordMap, outputList_sorted } = data;
    let outputData: any[] = [];
    for (let item of outputList_sorted) {
      outputData.push([{ name: '中国' }, { name: item.outputName, value: item.totla }]);
    }
    let onLineIconSvgPath =
      'path://M554.048 128l0.032 65.6a317.952 317.952 0 0 1 99.456 26.56l32.8-56.704 55.424 32-32.8 56.768c28.032 20.224 52.64 44.832 72.864 72.864l56.768-32.8 32 55.424-56.736 32.8c13.952 30.848 23.136 64.32 26.624 99.488h65.568v64l-65.6 0.032a317.952 317.952 0 0 1-26.56 99.456l56.704 32.8-32 55.424-56.768-32.8c-20.224 28.032-44.832 52.64-72.864 72.864l32.8 56.768-55.424 32-32.8-56.736a317.952 317.952 0 0 1-99.456 26.624L554.048 896h-64v-65.6a317.952 317.952 0 0 1-99.52-26.56l-32.768 56.704-55.424-32 32.8-56.768a321.824 321.824 0 0 1-72.864-72.864l-56.768 32.8-32-55.424 56.736-32.8a317.952 317.952 0 0 1-26.624-99.456L138.048 544v-64h65.6a317.952 317.952 0 0 1 26.56-99.52l-56.704-32.768 32-55.424 56.768 32.8c20.224-28.032 44.832-52.64 72.864-72.864L302.336 195.456l55.424-32 32.8 56.736a317.952 317.952 0 0 1 99.488-26.624V128h64z m-32 125.152a258.848 258.848 0 1 0 0 517.696 258.848 258.848 0 0 0 0-517.696z m64 322.848a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-160 64a32 32 0 1 1 0 64 32 32 0 0 1 0-64z m0-256a96 96 0 1 1 0 192 96 96 0 0 1 0-192z m224 32a64 64 0 1 1 0 128 64 64 0 0 1 0-128z m-64-96a32 32 0 1 1 0 64 32 32 0 0 1 0-64z';
    let convertData = function (data: any) {
      let res = [];
      for (let i = 0; i < data.length; i++) {
        let dataItem = data[i];
        let fromCoord = geoCoordMap[dataItem[1].name];
        let toCoord = geoCoordMap[dataItem[0].name];
        if (fromCoord && toCoord) {
          res.push([
            {
              coord: fromCoord, // 起点坐标
            },
            {
              coord: toCoord, // 终点坐标
            },
          ]);
        }
      }
      return res;
    };
    let series = [];
    [['中国', outputData]].forEach((item, i) => {
      series.push(
        {
          type: 'lines',
          zlevel: 1, // 用于分层，z-index的效果
          effect: {
            show: true, // 动效是否显示
            period: 6, // 特效动画时间
            trailLength: 0.7, // 特效尾迹的长度
            color: '#fff', // 特效颜色
            symbolSize: 3, // 特效大小
          },
          lineStyle: {
            normal: {
              // 正常情况下的线条样式
              color: '#AF202C',
              width: 0, // 因为是叠加效果，要是有宽度，线条会变粗，白色航线特效不明显
              curveness: -0.2, // 线条曲度
            },
          },
          data: convertData(item[1]), // 特效的起始、终点位置
        },
        {
          type: 'lines',
          zlevel: 2,
          symbolSize: 10,
          effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: onLineIconSvgPath,
            symbolSize: 15,
          },
          lineStyle: {
            normal: {
              color: '#AF202C',
              width: 1,
              opacity: 0.6,
              curveness: -0.2,
            },
          },
          data: convertData(item[1]), // 特效的起始、终点位置，一个二维数组，相当于coords: convertData(item[1])
        }
      );
    });
    // 显示终点位置,类似于上面最后一个效果，放在外面写，是为了防止被循环执行多次
    series.push({
      type: 'effectScatter',
      coordinateSystem: 'geo',
      zlevel: 3,
      rippleEffect: {
        brushType: 'stroke',
      },
      symbolSize: function (val: any) {
        return val[2] / 8;
      },
      itemStyle: {
        normal: {
          color: '#AF202C',
        },
      },
      data: [
        {
          name: '中国',
          value: [116.584556, 40.080111],
          label: {
            normal: {
              position: 'top',
            },
          },
        },
      ],
    });

    // 最后初始化世界地图中的相关数据
    let option = {
      geo: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        map: 'world', // 与引用进来的地图js名字一致
        roam: false, // 禁止缩放平移
        nameMap: worldNameMap,
        itemStyle: {
          // 每个区域的样式
          normal: {
            areaColor: '#EEEEEE',
          },
          emphasis: {
            borderWidth: 0.5,
            borderColor: '#333333',
            areaColor: '#FFDF33',
          },
        },
      },
      series: series, // 将之前处理的数据放到这里
      textStyle: {
        fontSize: 12,
      },
    };
    let chart = window['echarts'].init(document.getElementById('kangyi-jingwai-map'));
    chart.setOption(option);
  }
  public _initSankey(data: any) {
    let { allData, allLink } = data;
    let myChart = window['echarts'].init(document.getElementById('kangyi-jingwai-sankey'));
    let option = {
      tooltip: {
        trigger: 'item',
      },
      series: {
        type: 'sankey',
        layout: 'none',
        top: 10,
        bottom: 10,
        right: 30,
        left: 10,
        draggable: false,
        emphasis: {
          focus: 'adjacency',
        },
        data: allData,
        links: allLink,
      },
    };
    option && myChart.setOption(option);
  }
  public _initLine1(data: any) {
    let echarts = window['echarts'].init(document.getElementById('kangyi-jingwai-line1'));
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
        data: ['累计输入'],
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
    option && echarts.setOption(option);
  }
  public _initLine2(data: any) {
    let echarts = window['echarts'].init(document.getElementById('kangyi-jingwai-line2'));
    let option;
    option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        textStyle: {
          fontSize: 12,
          color: '#FE9317',
        },
        color: 'green',
        icon: 'circle',
        data: ['新增输入'],
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
    option && echarts.setOption(option);
  }
  /**http */
  public async _getKangyiJingwai() {
    const result = await TabHomeKangyiModule.getKangyiJingwai({});
    if (result[0]) {
      let { timestamp, dataList } = result[0].yiqing_v2;
      let allData: any[] = [];
      let allLink: any[] = [];
      let tableColumns: any[] = [];
      let tableData: any[] = [];
      let column1: any[] = [];
      let column2: any[] = [];
      let lineDate: any[] = [];
      let lineData1: any[] = [
        {
          name: '累计输入',
          type: 'line',
          stack: '总量',
          data: [],
        },
      ];
      let lineData2: any[] = [
        {
          name: '新增输入',
          type: 'line',
          stack: '总量',
          itemStyle: {
            color: '#FE9317',
          },
          data: [],
        },
      ];
      for (let item of dataList) {
        if (item.name1 === '全国') {
          this.summaryData = item;
        }
      }
      for (let item of result[0].shuruData.dataList) {
        lineDate.push(item.date);
        lineData1[0].data.push(item.sum);
        lineData2[0].data.push(item.new_add);
      }
      for (let key1 in result[0].shuruData.dataMap) {
        allData.push({ name: key1 });
        column2.push(key1);
        for (let key2 in result[0].shuruData.dataMap[key1]) {
          allData.push({ name: key2 });
          allLink.push({ source: key2, target: key1, value: result[0].shuruData.dataMap[key1][key2] });
          column1.push(key2);
        }
      }
      allData = uniqWith(allData, isEqual);
      column1 = Array.from(new Set(column1));
      column2 = Array.from(new Set(column2));
      for (let item of column1) {
        tableColumns.push({
          name: item,
          align: 'center',
          label: item,
          field: item,
          format: (val: any) => `${val || val === 0 ? val : '--'}`,
        });
      }
      for (let item of column2) {
        tableData.push({
          area: item,
          count: 0,
        });
      }
      for (let key in result[0].shuruData.dataMap) {
        const count = 0;
        for (let item of tableData) {
          if (key === item.area) {
            item = Object.assign(item, result[0].shuruData.dataMap[key]);
          }
        }
      }
      for (let item of tableData) {
        item['count'] = 0;
        for (let key in item) {
          if (key !== 'area' && key !== 'count') {
            item['count'] += item[key];
          }
        }
      }
      this.tableColumns = this.tableColumns.concat(tableColumns);
      this.tableData = tableData;
      this.endDate = new Date(timestamp).toLocaleString();
      this._initMap({ geoCoordMap: result[0].customization.extraData, outputList_sorted: result[0].shuruData.outputList_sorted });
      this._initSankey({
        allData,
        allLink,
      });
      this._initLine1({
        date: lineDate,
        series: lineData1,
      });
      this._initLine2({
        date: lineDate,
        series: lineData2,
      });
    }
  }
}
</script>

<style lang="scss">
@import 'src/css/quasar.variables.scss';
.kangyi-jingwai-container {
  .content {
    .table {
      .list {
        th:first-child,
        td:first-child {
          position: sticky;
          background: $white;
          left: 0;
          z-index: 1;
          box-shadow: 0 0 8px -4px #000;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@import '../style/kangyi_jingwai.scss';
</style>