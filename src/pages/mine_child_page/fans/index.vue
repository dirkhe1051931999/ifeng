<template>
  <div class="fans-container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <div class="title">粉丝</div>
    </div>
    <div class="p-t-50">
      <div class="text-center p-t-10 p-b-10" v-if="getDataLoading">
        <van-loading size="12px" color="#969799">加载中...</van-loading>
      </div>
      <div v-if="!getDataLoading && !fansData.length">
        <van-empty image="error" description="暂无数据" />
      </div>
      <ul v-if="!getDataLoading && fansData.length" class="fans">
        <li v-for="(item, index) in fansData" :key="index">
          <q-img :src="item.logo" class="logo"></q-img>
          <div class="name">{{ item.name }}</div>
          <div class="follow">关注</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { MineModule } from '@/store/modules/mine';
import { UserModule } from '@/store/modules/user';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'mine-fans',
})
export default class extends Vue {
  mounted() {
    this.getData();
  }
  public getDataLoading = false;
  public fansData = [];
  /* event */
  /* http */
  public async getData() {
    this.getDataLoading = true;
    const { data } = await MineModule.getFans({ params: { followid: `user_${UserModule.guid}`, page: '1', pagesize: 20 } });
    const { list } = data;
    this.fansData = list;
    this.getDataLoading = false;
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>