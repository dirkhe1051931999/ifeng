<template>
  <div class="tab_keji_child_rebang" ref="tab_keji_child_rebang" @scroll="monitorScrollEvent">
    <div class="back">
      <q-icon name="arrow_back_ios_new" @click="$router.back()" class="arrow"></q-icon>
      <span>科技热榜</span>
    </div>
    <div class="banner">
      <img src="~assets/keji/banner2.png" alt="" class="img" />
      <img src="~assets/keji/banner_text.png" alt="" class="text" />
    </div>
    <div class="list">
      <div class="wrap">
        <li v-for="(item, index) in rebangList" :key="index" @click="handleClickRebangItem(item, index)">
          <div class="top">
            <span class="index">#</span>
            <span class="title">{{ item.title }}</span>
            <q-icon name="chevron_right" class="arrow fs-18"></q-icon>
          </div>
          <div class="bottom">
            <div class="l">{{ item.child.title }}</div>
            <img :src="item.child.thumbnail" alt="" />
          </div>
        </li>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TabHomeKejiModule } from '@/store/modules/home_tab/keji';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'tab_keji_child_rebang',
})
export default class extends Vue {
  $refs: any;
  mounted() {
    this.getList();
  }
  activated() {
    this.$nextTick(() => {
      if (this.containerPositionY > window.innerHeight) {
        this.$refs['tab_keji_child_rebang'].scrollTop = this.containerPositionY;
        this.containerPositionY = 0;
      }
    });
  }
  public rebangList: any[] = [];
  public getDataLoading = false;
  public containerPositionY = 0;
  /*event */
  async monitorScrollEvent(e: any) {
    const scrollTop = this.$refs['tab_keji_child_rebang'].scrollTop;
    this.containerPositionY = scrollTop;
  }
  public handleClickRebangItem(item: any, index: number) {
    console.log(item);
    this.$router.push(`/news_theme?groupid=${item.id}`);
  }
  /*http*/
  public async getList() {
    try {
      this.getDataLoading = true;
      const result = await TabHomeKejiModule.getKejiNewsRebangList({ params: {} });
      if (result[0]) {
        this.rebangList = result[0].list.content;
      }

      this.getDataLoading = false;
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style/rebang.scss';
</style>