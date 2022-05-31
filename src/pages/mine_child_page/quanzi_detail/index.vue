<template>
  <div class="quanzi_detail_container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <div class="title">圈子详情</div>
    </div>
    <div class="quanzi-wrap" ref="quanzi-wrap" @scroll="monitorScrollEvent">
      <div class="text-center p-t-10 p-b-10" v-show="getDataLoading">
        <van-loading size="12px" color="#969799">加载中...</van-loading>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'mine-quanzi_detail',
})
export default class extends Vue {
  $refs: any;
  private getDataLoading = false;
  /* event */
  /* http */
}
</script>


<style lang="scss" scoped>
@import './index.scss';
</style>