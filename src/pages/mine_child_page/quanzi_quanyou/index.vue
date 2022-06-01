<template>
  <div class="quanzi_quanyou-container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <div class="title">圈友列表</div>
    </div>
    <div class="quanzi_quanyou-wrap" ref="quanzi_quanyou-wrap" @scroll="monitorScrollEvent">
      <div class="text-center p-t-10 p-b-10" v-show="getDataLoading">
        <van-loading size="12px" color="#969799">加载中...</van-loading>
      </div>
      <ul class="list" v-if="!getDataLoading">
        <li v-for="(item, index) in ownerData" :key="index">
          <q-img :src="item.userinfo.avatar" class="img"></q-img>
          <div class="nickName">{{ item.userinfo.nickName }}</div>
          <div class="label" v-if="item.user.roleList.includes('OWNER')">圈主</div>
          <div class="label" v-if="item.user.roleList.includes('PARTNER')">合伙人</div>
        </li>
        <li v-for="(item,index) in memberData" :key="item.userinfo.avatar+index">
          <q-img :src="item.userinfo.avatar" class="img"></q-img>
          <div class="nickName">{{ item.userinfo.nickName }}</div>
        </li>
      </ul>
      <div class="load-more-loading" v-show="load_more_no_data.length">暂无数据</div>
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
  name: 'mine-quanzi_quanyou',
})
export default class extends Vue {
  $refs: any;
  async mounted() {
    this.getDataLoading = true;
    await this.getOrgUserList();
    this.$refs['quanzi_quanyou-wrap']['style']['height'] = window.innerHeight - 50 + 'px';
    this.getDataLoading = false;
  }
  private getDataLoading = false;
  private ownerData = [];
  private memberData = [];
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
    const scrollHeight = this.$refs['quanzi_quanyou-wrap'].scrollHeight;
    const scrollTop = this.$refs['quanzi_quanyou-wrap'].scrollTop;
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
  /* http */
  private async getOrgUserList() {
    const owner = await MineModule.getOrgUserList({
      pages: {
        current: 1,
        hitCount: false,
        optimizeCountSql: true,
        records: [],
        searchCount: true,
        size: 3,
        orders: [{ column: 'ctime', asc: true }],
      },
      where: { orgId: this.$route.query.orgId, selectOwner: 1 },
    });
    const member = await MineModule.getOrgUserList({
      pages: {
        current: 1,
        hitCount: false,
        optimizeCountSql: true,
        records: [],
        searchCount: true,
        size: this.pagination_params.size,
        orders: [{ column: 'ctime', asc: false }],
      },
      where: { orgId: this.$route.query.orgId, selectOwner: -1 },
    });
    this.ownerData = owner.data.records;
    this.memberData = member.data.records;
    return Promise.resolve();
  }
  private async _upCallback() {
    const member = await MineModule.getOrgUserList({
      pages: {
        current: this.pagination_params.num,
        hitCount: false,
        optimizeCountSql: true,
        records: [],
        searchCount: true,
        size: this.pagination_params.size,
        orders: [{ column: 'ctime', asc: false }],
      },
      where: { orgId: this.$route.query.orgId, selectOwner: -1 },
    });
    if (member.data.records.length === 0) {
      this.load_more_no_data = '没有更多数据了';
      this.load_more_loading_lock = true;
      this.load_more_loading = false;
      return Promise.reject();
    } else {
      this.memberData = this.memberData.concat(member.data.records);
      return Promise.resolve();
    }
  }
}
</script>


<style lang="scss" scoped>
@import './index.scss';
</style>