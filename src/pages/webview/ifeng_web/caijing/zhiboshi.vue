<template>
  <div class="caijing-zhioboshi-container">
    <div class="header relative">
      <q-icon name="arrow_back" class="arrow_back" @click="$router.back()"></q-icon>
      <img src="~assets/caijing/banner.png" alt="" />
    </div>
    <van-tabs v-model="activeTabIndex" class="tabs">
      <van-tab title="全部">
        <div class="all" ref="caijing-zhioboshi-all" @scroll="monitorAllScrollEvent">
          <div class="text-center p-t-10 p-b-10" v-show="allListLoading">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
          <van-pull-refresh v-model="allListRefreshLoading" @refresh="allListRefresh" style="overflow: visible">
            <q-timeline color="primary">
              <q-timeline-entry v-for="(item, index) in allList" :key="index" avatar="~assets/caijing/caijing_logo.png">
                <template v-slot:subtitle>
                  <span style="opacity: 0.4">{{ item.ctime | parseTimeFromDateString2 }}</span>
                  <span class="m-l-10 text-red bold">{{ item.ctime | parseTimeFromDateString3 }}</span>
                </template>
                <div class="content">
                  {{ item.brief }}
                </div>
              </q-timeline-entry>
            </q-timeline>
          </van-pull-refresh>
          <div class="text-center p-t-10 p-b-10" v-show="allListMoreLoading">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
        </div>
      </van-tab>
      <van-tab title="财经精选">
        <div class="chosen" ref="caijing-zhioboshi-chosen" @scroll="monitorChosenScrollEvent">
          <div class="text-center p-t-10 p-b-10" v-show="chosenListLoading">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
          <van-pull-refresh v-model="chosenListRefreshLoading" @refresh="chosenListRefresh" style="overflow: visible">
            <q-timeline color="primary">
              <q-timeline-entry v-for="(item, index) in chosenList" :key="index" avatar="~assets/caijing/caijing_logo.png">
                <template v-slot:subtitle>
                  <span style="opacity: 0.4">{{ item.newsTime.split(' ')[0] }}</span>
                  <span class="m-l-10 text-red bold">{{ item.newsTime.split(' ')[1] }}</span>
                </template>
                <div class="content">
                  {{ item.title }}
                </div>
              </q-timeline-entry>
            </q-timeline>
          </van-pull-refresh>
          <div class="text-center p-t-10 p-b-10" v-show="chosenListMoreLoading">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { result } from 'lodash';
import { TabHomeCaijingModule } from '@/store/modules/home_tab/caijing';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'caijing-zhioboshi',
})
export default class extends Vue {
  $refs: any;
  @Watch('activeTabIndex')
  onchange() {
    setTimeout(() => {
      if (!this.$refs['caijing-zhioboshi-chosen'].style['height'])
        this.$refs['caijing-zhioboshi-chosen'].style['height'] = window.innerHeight - 60 - 156 + 'px';
    }, 200);
  }
  mounted() {
    this._getCaijingZhiboshi();
    setTimeout(() => {
      this.$refs['caijing-zhioboshi-all'].style['height'] = window.innerHeight - 60 - 156 + 'px';
    }, 200);
  }
  private activeTabIndex = 0;
  private vanIndexBarIndex = [];
  private allList: any[] = [];
  private chosenList: any[] = [];
  private allListLoading = false;
  private chosenListLoading = false;
  private allListMoreLoading = false;
  private chosenListMoreLoading = false;
  private allListRefreshLoading = false;
  private chosenListRefreshLoading = false;
  private allListMoreLocking = false;
  private chosenListMoreLocking = false;
  private containerPositionY1 = 0;
  private containerPositionY2 = 0;
  private allListPagination = {
    pageSize: 20,
    num: 0,
  };
  private chosenListPagination = {
    pageSize: 20,
    num: 0,
  };

  /**event */
  private async monitorAllScrollEvent() {
    const scrollHeight = this.$refs['caijing-zhioboshi-all'].scrollHeight;
    const scrollTop = this.$refs['caijing-zhioboshi-all'].scrollTop;
    this.containerPositionY1 = scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight >= scrollHeight) {
      if (!this.allListMoreLocking) {
        this.allListMoreLoading = true;
        this.allListMoreLocking = true;
        await this._getMoreAllList();
        this.allListMoreLocking = false;
      }
    }
  }

  private async monitorChosenScrollEvent() {
    const scrollHeight = this.$refs['caijing-zhioboshi-chosen'].scrollHeight;
    const scrollTop = this.$refs['caijing-zhioboshi-chosen'].scrollTop;
    this.containerPositionY1 = scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight >= scrollHeight) {
      if (!this.chosenListMoreLocking) {
        this.chosenListMoreLoading = true;
        this.chosenListMoreLocking = true;
        this.chosenListPagination.num += 20;
        await this._getMoreChosenList();
        this.chosenListMoreLocking = false;
      }
    }
  }
  /**http */
  private async _getCaijingZhiboshi() {
    this.allListLoading = true;
    this.chosenListLoading = true;
    const result1 = await TabHomeCaijingModule.getCaijingZhiboshi1({ params: { id: '' } });
    const result2 = await TabHomeCaijingModule.getCaijingZhiboshi2({ params: { count: 0 } });
    if (result1[0]) {
      this.allList = result1[0];
    }
    if (result2[0]) {
      this.chosenList = result2[0];
    }
    this.allListLoading = false;
    this.chosenListLoading = false;
  }
  private async _getMoreAllList() {
    const last = this.allList[this.allList.length - 1];
    const result1 = await TabHomeCaijingModule.getCaijingZhiboshi1({ params: { id: last.id } });
    if (result1[0]) {
      this.allList = this.allList.concat(result1[0]);
    }
    return Promise.resolve();
  }
  private async _getMoreChosenList() {
    const result2 = await TabHomeCaijingModule.getCaijingZhiboshi2({ params: { count: this.chosenListPagination.num } });
    if (result2[0]) {
      this.chosenList = this.chosenList.concat(result2[0]);
    }
    return Promise.resolve();
  }
  private async allListRefresh() {
    this.allListMoreLocking = false;
    this.allListMoreLoading = false;
    this.allListLoading = false;
    const result1 = await TabHomeCaijingModule.getCaijingZhiboshi1({ params: { id: '' } });
    if (result1[0]) {
      this.allList = result1[0];
    }
    this.allListRefreshLoading = false;
  }
  private async chosenListRefresh() {
    this.chosenListMoreLocking = false;
    this.chosenListMoreLoading = false;
    this.chosenListLoading = false;
    this.chosenListPagination.num = 0;
    const result2 = await TabHomeCaijingModule.getCaijingZhiboshi2({ params: { count: this.chosenListPagination.num } });
    if (result2[0]) {
      this.chosenList = result2[0];
    }
    this.chosenListRefreshLoading = false;
  }
}
</script>
<style lang="scss">
.caijing-zhioboshi-container {
  .q-timeline__subtitle {
    opacity: 1;
  }
}
</style>
<style lang="scss" scoped>
@import '../style/caijing_zhiboshi.scss';
</style>