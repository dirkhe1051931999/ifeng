<template>
  <div>
    <div :id="cid" style="width: 100%; height: 260px"></div>
  </div>
</template>

<script lang="ts">
import { numberFormat } from '@/filters';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'ganggu_fenshi',
})
export default class extends Vue {
  @Prop({ default: '' }) public cid!: string;
  @Prop({ default: '0' }) public min!: string;
  @Prop({ default: [] }) public data!: any[];
  @Prop({ default: [] }) public date!: any[];
  mounted() {
    let myChart = window['echarts'].init(document.getElementById(this.cid));
    myChart.setOption(this.option);
  }
  public option: any = {
    tooltip: {
      trigger: 'axis',
      position: function (pt: any) {
        return [pt[0], '10%'];
      },
      formatter: function (param: any) {
        console.log(param);
        return `<div>
          <p>${param[0].axisValue}</p>
          <p>价格：${param[0].data.value}</p>
          <p>成交量：${numberFormat(param[0].data.amount)}</p>
        </div>`;
      },
      textStyle: {
        fontSize: 12,
      },
    },
    grid: {
      left: '15%',
      right: '13%',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: this.date,
      axisLine: {
        //y轴
        show: false,
      },
      axisTick: {
        //y轴刻度线
        show: false,
      },
      splitLine: {
        //网格线
        show: false,
      },
      axisLabel: {
        interval: 120,
      },
    },
    yAxis: [
      {
        type: 'value',
        position: 'left',
        min: this.min,
        axisLine: {
          //y轴
          show: false,
        },
        axisTick: {
          //y轴刻度线
          show: false,
        },
        splitLine: {
          //网格线
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: function (value: any) {
              return value >= 0 ? '#f54343' : '#1aae52';
            },
          },
        },
      },
    ],
    series: [
      {
        name: '价格',
        id: 'price',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          normal: {
            lineStyle: {
              color: '#4B99FB',
            },
          },
        },
        areaStyle: {
          color: new window['echarts'].graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#4B99FB',
            },
            {
              offset: 1,
              color: '#ffffff',
            },
          ]),
        },
        data: this.data,
      },
    ],
  };
}
</script>

<style lang="scss" scoped></style>