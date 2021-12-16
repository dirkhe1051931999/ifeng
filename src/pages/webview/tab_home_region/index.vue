<template>
  <div class="region-list-container">
    <div class="header">
      <q-icon name="close" class="fs-22" @click="$router.back()"></q-icon>
      <span> <q-icon name="location_on" class="text-blue"></q-icon> 当前城市 {{ currentRegion }}</span>
    </div>
    <div class="list" ref="list">
      <van-index-bar :index-list="vanIndexBarIndex">
        <div v-for="(value, key) in regionList" :key="key">
          <van-index-anchor :index="key" class="index"> </van-index-anchor>
          <div v-for="(item, index) in value" :key="index" class="item" @click="handlerClickSlectRegion(item.name)">{{ item.name }}</div>
        </div>
      </van-index-bar>
    </div>
  </div>
</template>

<script lang="ts">
import {
  get_user_bak_categories,
  get_user_current_categories,
  set_user_bak_categories,
  set_user_current_categories,
  set_user_current_region,
} from 'src/utils/db';
import { cloneDeep } from 'lodash';
import { TabHomeChengshiModule } from '@/store/modules/home_tab/chengshi';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'region-list',
})
export default class extends Vue {
  $refs: any;
  get currentRegion() {
    return TabHomeChengshiModule.currentRegion;
  }
  get regionList() {
    return TabHomeChengshiModule.regionList;
  }
  private handlerClickSlectRegion(name: string) {
    TabHomeChengshiModule.SET_currentRegion(name);
    const _defaultCategories: any = cloneDeep(get_user_current_categories());
    for (let item of _defaultCategories) {
      if (item.id === 'chengshi') {
        const currentRegion: any = TabHomeChengshiModule.currentRegion;
        item['name'] = currentRegion;
      }
    }
    const _bakCategories: any = cloneDeep(get_user_bak_categories());
    for (let item of _bakCategories) {
      if (item.id === 'chengshi') {
        const currentRegion: any = TabHomeChengshiModule.currentRegion;
        item['name'] = currentRegion;
      }
    }
    set_user_current_categories(_defaultCategories);
    set_user_bak_categories(_bakCategories);
    set_user_current_region(name);
    this.$router.back();
  }
  private vanIndexBarIndex: string[] = [];
  created() {
    for (let key in this.regionList) {
      this.vanIndexBarIndex.push(key);
    }
  }
  mounted() {
    this.$nextTick(() => {
      this.$refs.list.style['height'] = window.innerHeight - 32 + 'px';
    });
  }
}
</script>


<style lang="scss" scoped>
.region-list-container {
  .header {
    width: 100%;
    box-sizing: border-box;
    height: 32px;
    line-height: 32px;
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    background: $white;
    z-index: 100;
  }
  .list {
    position: fixed;
    top: 32px;
    left: 0;
    width: 100%;
    overflow: scroll;
    background: $white;
    box-sizing: border-box;
    .index {
      background: #f7f7f7;
    }
    .item {
      padding: 0 16px;
      height: 32px;
      line-height: 32px;
      border-bottom: solid 1px #eeeeee;
    }
  }
}
</style>