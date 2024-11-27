<template>
  <div class="push_history-container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <div class="title">推送历史</div>
    </div>
    <div class="push_history-wrap" ref="push_history-wrap" @scroll="monitorScrollEvent">
      <div class="news" v-for="(a, i) in pushData" :key="i">
        <div class="count">{{ a.date }} 推送 {{ a.count }} 条</div>
        <ul>
          <li v-for="(b, j) in a.item" :key="j">
            <q-img :src="b.thumbnail" class="thumbnail"></q-img>
            <div class="right">
              <div class="title">{{ b.title }}</div>
              <div class="p-t-5">
                <span class="source">{{ b.source }}</span>
                <span class="time">{{ b.updateTime }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="load-more-loading" v-show="load_more_no_data">暂无数据</div>
      <div class="load-more-loading" v-show="load_more_loading">
        <q-spinner color="#969799" size="20px" :thickness="2" />
        加载中...
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MineModule } from '@/store/modules/mine';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'mine-push_history',
})
export default class extends Vue {
  $refs: any;
  mounted() {
    this.$nextTick(() => {
      this.$refs['push_history-wrap'].style['height'] = `${window.innerHeight - 50}px`;
      this.getData();
    });
  }
  public containerPositionY = 0;
  private pushData = [];
  private getDataLoading = false;
  private isDownRefresh = false;
  private refreshSuccessText = '';
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private load_more_no_data = '';
  private pagination_params = {
    size: 50,
    num: 1,
  };
  /* event */
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['push_history-wrap'].scrollHeight;
    const scrollTop = this.$refs['push_history-wrap'].scrollTop;
    this.containerPositionY = scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
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
  /* http */
  private async getData() {
    this.getDataLoading = true;
    const { data } = await MineModule.getPushHistory({ params: { page: 1, pagesize: this.pagination_params.size } });
    this.getDataLoading = false;
    this.pushData = data;
    if (!data.length) {
      this.load_more_no_data = '没有更多数据了';
    }
  }
  private async _upCallback() {
    const { data } = await MineModule.getPushHistory({ params: { page: this.pagination_params.num, pagesize: this.pagination_params.size } });
    if (!data.length) {
      this.load_more_no_data = '没有更多数据了';
      this.load_more_loading_lock = true;
      return Promise.reject();
    }
    this.pushData = this.pushData.concat(data);
    return Promise.resolve();
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
