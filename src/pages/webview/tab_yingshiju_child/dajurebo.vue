<template>
  <div class="tab_yingshiju_child_dajurebo" ref="tab_yingshiju_child_dajurebo" @scroll="monitorScrollEvent">
    <div class="back">
      <q-icon name="arrow_back_ios_new" @click="$router.back()" class="arrow"></q-icon>
      <span>大剧热播</span>
    </div>
    <div class="text-center p-t-10 p-b-10" v-show="getDataLoading">
      <van-loading size="12px" color="#969799">加载中...</van-loading>
    </div>
    <div class="list" v-if="dajureboList.length">
      <li v-for="(item, index) in dajureboList" :key="index">
        <div class="thumbnail">
          <img :src="item.thumbnail || item.posterUrl" alt="" class="thumbnail" />
          <span>{{ item.extData.score }}</span>
        </div>
        <p class="title ellipsis">{{ item.title }}</p>
        <p class="summary ellipsis">{{ item.summary }}</p>
      </li>
      <div class="load-more-loading" v-show="load_more_no_data">暂无数据</div>
      <div class="load-more-loading" v-show="load_more_loading">
        <q-spinner color="#969799" size="20px" :thickness="2" />
        加载中...
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TabHomeYingshijuModule } from '@/store/modules/home_tab/yingshiju';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'tab_yingshiju_child_dajurebo',
})
export default class extends Vue {
  $refs: any;
  mounted() {
    this.getList();
  }
  private dajureboList: any[] = [];
  private getDataLoading = false;
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private load_more_no_data = '';
  private pagination_params = {
    size: 10,
    num: 1,
  };
  /*event */
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['tab_yingshiju_child_dajurebo'].scrollHeight;
    const scrollTop = this.$refs['tab_yingshiju_child_dajurebo'].scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight >= scrollHeight) {
      if (!this.load_more_loading_lock) {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.pagination_params.num++;
        await this.getMoreList();
        this.load_more_loading_lock = false;
      }
    }
  }
  /*http */
  private async getList() {
    try {
      this.getDataLoading = true;
      const result = await TabHomeYingshijuModule.getYingshijuDajureboList({ params: { page: this.pagination_params.num } });
      this.dajureboList = result.data.list;
      this.getDataLoading = false;
    } catch (error) {
      console.log(error);
    }
  }
  private async getMoreList() {
    try {
      const result = await TabHomeYingshijuModule.getYingshijuDajureboList({ params: { page: this.pagination_params.num } });
      if (!result.data.list.length) {
        this.load_more_no_data = '没有更多数据了';
        this.load_more_loading_lock = true;
        return Promise.reject();
      }
      this.dajureboList = this.dajureboList.concat(result.data.list);
      return Promise.resolve();
    } catch (error) {
      console.log(error);
    }
  }
}
</script>


<style lang="scss" scoped>
@import './style/dajurebo.scss';
</style>