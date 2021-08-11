<template>
  <div class="caijing-stock-detail-container">
    <div class="header">
      <div class="l"></div>
      <div class="c">
        <p class="name-code">
          <span class="name"></span>
          <span class="code"></span>
        </p>
        <p>更新于 {{ lastUpdateTime || '--' }}</p>
      </div>
      <q-icon name="add" class="add"></q-icon>
    </div>
    <div class="caijing-stock-detail-content" ref="caijing-stock-detail-content"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'caijing-stock-detail',
})
export default class extends Vue {
  $refs: any;
  mounted() {}
  private lastUpdateTime: any = '';
  /**event */
  /**http */
}
</script>


<style lang="scss" scoped>
@import '../style/caijing_stock_detail.scss';
</style>