<template>
  <div class="standard-container" @scroll="monitorScrollEvent" ref="standard-container">
    <van-pull-refresh v-model="isDownRefresh" :success-text="refreshSuccessText" @refresh="onRefresh" :success-duration="1000">
      <!-- 骨架屏 -->
      <div v-if="firstLoadData">
        <div class="ph-item" v-for="n in 10" :key="n" style="border: 0; padding: 10px 0 10px; margin: 0">
          <div>
            <div class="ph-row">
              <div class="ph-col-12" style="border-radius: 0; background-color: #eeeeee"></div>
              <div class="ph-col-2" style="border-radius: 0; background-color: #eeeeee"></div>
              <div class="ph-col-10 empty"></div>
              <div class="ph-col-8" style="border-radius: 0; background-color: #eeeeee"></div>
              <div class="ph-col-4 empty"></div>
            </div>
          </div>
          <div class="ph-col-2">
            <div class="ph-avatar" style="border-radius: 0; background-color: #eeeeee"></div>
          </div>
        </div>
      </div>
      <ul class="news-list">
        <p v-for="n in 100" :key="n">tabs_home_item_standard</p>
      </ul>
    </van-pull-refresh>
  </div>
</template>
<script lang="ts">
import { AppModule } from '@/store/modules/app';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'tabs_home_item_standard',
})
export default class extends Vue {
  $refs: any;
  async created() {
    await this._downCallback();
    this.firstLoadData = false;
  }
  // 数据
  private firstLoadData = true;
  // 下拉刷新，上拉加载的数据
  private isDownRefresh = false;
  private refreshSuccessText = '';
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private pagination_params = {
    size: 10,
    num: 1,
  };
  async onRefresh() {
    await this._downCallback();
    this.refreshSuccessText = `已为您推荐 1 条新内容`;
    this.isDownRefresh = false;
  }
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['standard-container'].scrollHeight;
    const scrollTop = this.$refs['standard-container'].scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - AppModule.bottomNavigationAndHomeHeaderHeight >= scrollHeight) {
      if (!this.load_more_loading_lock) {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.pagination_params.num++;
        await this._upCallback();
        this.load_more_loading_lock = false;
      }
    }
  }
  private async _downCallback() {
    try {
      if (this.firstLoadData) {
        console.log('loading');
      }
      await setTimeout(() => {}, 1000);
      this.$nextTick(() => {
        console.log('ok');
        return Promise.resolve(true);
      });
    } catch (error) {
      console.log('err');
    }
  }
  private async _upCallback() {
    return Promise.resolve(true);
  }
}
</script>
<style lang="scss" scoped>
.standard-container {
  overflow: scroll;
  height: 100%;
}
</style>
