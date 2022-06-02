<template>
  <div class="zhuizong-container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <div class="title">热点追踪</div>
    </div>
    <div class="zhuizong-wrap" ref="zhuizong-wrap" @scroll="monitorScrollEvent">
      <div class="text-center p-t-10 p-b-10" v-show="getDataLoading">
        <van-loading size="12px" color="#969799">加载中...</van-loading>
      </div>
      <img src="~assets/mine/zhuizong.png" alt="" class="banner" v-if="!getDataLoading" />
      <ul class="bannerData shadow-5" v-if="!getDataLoading">
        <li v-for="(item, index) in bannerData" :key="index" @click="handleClickItem(item)">
          <div class="index">{{ index + 1 }}</div>
          <div class="title">{{ item.title }}</div>
        </li>
      </ul>
      <div class="progress" v-if="!getDataLoading">
        <div class="top-title">最新进展</div>
        <ul>
          <li v-for="(item, index) in listData" :key="index" @click="handleClickItemChild(item)">
            <div class="title">{{ item.title }}</div>
            <div class="date">{{ new Date(item.updateTime * 1000).toLocaleString() }}</div>
          </li>
        </ul>
        <div class="load-more-loading" v-show="load_more_no_data.length">暂无数据</div>
        <div class="load-more-loading" v-show="load_more_loading">
          <q-spinner color="#969799" size="20px" :thickness="2" />
          加载中...
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MineModule } from '@/store/modules/mine';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'mine-zhuizong',
})
export default class extends Vue {
  $refs: any;
  @Watch('$route')
  onchange(newVal: any) {
    if (newVal.path === '/mine_child_page/zhuizong') {
      this.$refs['zhuizong-wrap'].scrollTop = this.containerPositionY;
    }
  }
  async mounted() {
    this.getDataLoading = true;
    await this.getBannerData();
    await this.getZhuiZongList();
    this.$refs['zhuizong-wrap']['style']['height'] = window.innerHeight - 50 + 'px';
    this.getDataLoading = false;
  }
  private getDataLoading = false;
  private bannerData = [];
  private listData = [];
  public containerPositionY = 0;
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private load_more_no_data = '';
  private pagination_params = {
    size: 10,
    num: 1,
  };
  /* event */
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['zhuizong-wrap'].scrollHeight;
    const scrollTop = this.$refs['zhuizong-wrap'].scrollTop;
    this.containerPositionY = scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - 50 >= scrollHeight) {
      if (!this.load_more_loading_lock) {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.pagination_params.num++;
        await this._upCallback();
        this.load_more_loading_lock = false;
      }
    }
  }
  private handleClickItem(item: any) {
    this.$router.push('/mine_child_page/zhuizong_detail?id=' + item.id);
  }
  private handleClickItemChild(item: any) {
    this.$router.push('/mine_child_page/zhuizong_detail?node=true&id=' + item.timelineId + '&nodeId=' + item.nodeId);
  }
  /* http */
  private async getBannerData() {
    const result = await MineModule.getZhuiZongTop({});
    this.bannerData = result;
    return Promise.resolve();
  }
  private async getZhuiZongList() {
    const { list } = await MineModule.getZhuiZongList({
      page: 1,
      size: this.pagination_params.size,
    });
    this.listData = list;
    return Promise.resolve();
  }
  private async _upCallback() {
    const { list } = await MineModule.getZhuiZongList({
      page: this.pagination_params.num,
      size: this.pagination_params.size,
    });
    if (list.length === 0) {
      this.load_more_no_data = '没有更多数据了';
      this.load_more_loading_lock = true;
      this.load_more_loading = false;
      return Promise.reject();
    } else {
      this.listData = this.listData.concat(list);
      return Promise.resolve();
    }
  }
}
</script>


<style lang="scss" scoped>
@import './index.scss';
</style>