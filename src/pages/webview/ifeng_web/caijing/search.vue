<template>
  <div class="caijing-pindao-search-container">
    <div class="header">
      <div class="l" @click="$router.back()">
        <q-icon name="arrow_back_ios"></q-icon>
      </div>
      <div class="m">
        <q-input color="grey" v-model="searchText" label="搜索输入股票代码/股票名称/首字母" dense borderless clearable debounce="300" @input="handlerSearch"> </q-input>
      </div>
    </div>
    <div class="caijing-pindao-search-content" ref="caijing-pindao-search-content" @scroll="monitorScrollEvent">
      <div class="text-center p-t-10 p-b-10" v-show="searchLoading">
        <van-loading size="12px" color="#969799">加载中...</van-loading>
      </div>
      <ul v-show="!searchLoading">
        <li v-for="(item, index) in searchList" :key="index" @click="handlerClickSearchItem(item)">
          <div class="l">
            <div class="name">{{ item.n }}</div>
            <div class="code">（{{ item.c }}）</div>
          </div>
          <q-icon name="add" class="add"></q-icon>
        </li>
      </ul>
      <van-empty image="search" description="暂无数据" v-show="!searchLoading && searchLoaded && !searchList.length && searchText" />
    </div>
  </div>
</template>

<script lang="ts">
import { TabHomeCaijingModule } from '@/store/modules/home_tab/caijing';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'caijing-pindao-search',
})
export default class extends Vue {
  $refs: any;
  mounted() {
    this.$refs['caijing-pindao-search-content'].style['height'] = `${window.innerHeight - 48}px`;
  }
  public searchText = '';
  public searchLoaded = false;
  public searchLoading = false;
  public searchList: any[] = [];
  /**event */
  public monitorScrollEvent() {}
  public handlerClickSearchItem(item: any) {
    this.$router.push(`/ifeng_web_caijing_pindao/stock_detail?code=${item.c}`);
  }
  /**http */
  public async handlerSearch() {
    if (!this.searchText) {
      this.searchList = [];
      return;
    }
    this.searchLoading = true;
    const result = await TabHomeCaijingModule.getCaijingStockSearch({ params: { q: this.searchText } });
    if (result[0]) {
      this.searchList = result[0];
    }
    this.searchLoaded = true;
    this.searchLoading = false;
  }
}
</script>

<style lang="scss" scoped>
@import '../style/caijing-pindao-search.scss';
</style>