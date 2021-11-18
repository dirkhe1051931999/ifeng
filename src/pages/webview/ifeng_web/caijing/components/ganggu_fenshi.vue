<template>
  <div>
    <div id="fenshi1" style="width: 100%; height: 260px"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
let base = +new Date(1968, 9, 3);
let oneDay = 24 * 3600 * 1000;
let date: any[] = [];

let data = [Math.random() * 300];

for (let i = 1; i < 20000; i++) {
  var now = new Date((base += oneDay));
  date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
  data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
}
@Component({
  name: 'ganggu_fenshi',
})
export default class extends Vue {
  mounted() {
    var myChart = window['echarts'].init(document.getElementById('fenshi1'));
    myChart.setOption(this.option);
  }
  private option: any = {
    tooltip: {
      trigger: 'axis',
      position: function (pt: any) {
        return [pt[0], '10%'];
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date,
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: false,
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 10,
      },
      {
        start: 0,
        end: 10,
      },
    ],
    series: [
      {
        name: '分时',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(255, 70, 131)',
        },
        areaStyle: {
          color: new window['echarts'].graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#4B99FB',
            },
            {
              offset: 1,
              color: '#E9F3FE',
            },
          ]),
        },
        data: data,
      },
    ],
  };
}
</script>


<style lang="scss" scoped>
</style>