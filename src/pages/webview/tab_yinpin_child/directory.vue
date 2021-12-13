<template>
  <div class="tab_yinpin_child_directory">
    <div class="banner">
      <q-icon name="arrow_back_ios_new" @click="$router.back()" class="arrow"></q-icon>
      <div class="title">
        <div class="l">
          <div class="t">{{ bannerData.title }}</div>
          <div class="b">{{ bannerData.source }}</div>
        </div>
        <img :src="bannerData.thumbnail" alt="" />
      </div>
    </div>
    <div class="header">
      <div class="nav">
        <li :class="[activeNavIndex === 0 ? 'active' : '']" @click="handleClickNav(0)">目录</li>
        <li :class="[activeNavIndex === 1 ? 'active' : '']" @click="handleClickNav(1)">简介</li>
      </div>
      <div class="total" v-show="activeNavIndex === 0 && bannerData.total_count > 20" v-if="hasLoadedData" @click="handleClickSelectCount">
        <span>共{{ bannerData.total_count }}集</span>
        <q-icon name="keyboard_arrow_down" class="arrow"></q-icon>
      </div>
    </div>
    <div class="list" v-show="activeNavIndex === 0" ref="list" @scroll="monitorScrollEvent">
      <div class="load-more-loading" v-show="getDataLoading" v-if="!hasLoadedData">
        <q-spinner color="#969799" size="20px" :thickness="2" />
        加载中...
      </div>
      <li v-for="(item, index) in directoryList" :key="index" @click="handleClickItem(item, index)">
        <div class="l">{{ index + 1 }}</div>
        <div class="r">
          <div class="t">{{ item.title }}</div>
          <div class="b">
            <div class="play">
              <q-icon name="play_arrow" class="fs-16 m-r-5"></q-icon>
              <span>{{ item.playTimeStr }}</span>
            </div>
            <div class="episodes">
              <q-icon name="query_builder" class="fs-16 m-r-5"></q-icon>
              <span>{{ item.link.duration | getVideoTotalTime }}</span>
            </div>
          </div>
        </div>
      </li>
      <div class="load-more-loading" v-show="load_more_no_data">暂无数据</div>
      <div class="load-more-loading" v-show="load_more_loading">
        <q-spinner color="#969799" size="20px" :thickness="2" />
        加载中...
      </div>
    </div>
    <div class="introduce" v-show="activeNavIndex === 1" ref="introduce">{{ bannerData.intro }}</div>
    <van-popup v-model="showSelectCount" position="bottom" :style="{ height: '30%' }">
      <van-picker
        title="选择集数"
        show-toolbar
        :columns="selectCountColumns"
        @confirm="handleClickSelectCountConfirm"
        @cancel="handleClickSelectCountCancel"
      />
    </van-popup>
    <van-popup v-model="showSelectResult" position="bottom" :style="{ height: '80%' }">
      <div class="list2" style="height: 100%">
        <div class="title">{{ selectReultTitle }}</div>
        <div class="load-more-loading" v-show="showSelectResultLoading">
          <q-spinner color="#969799" size="20px" :thickness="2" />
          加载中...
        </div>
        <li v-for="(item, index) in selectResultList" :key="index" @click="handleClickItem2(item)">
          <div class="l">{{ index + 1 }}</div>
          <div class="r">
            <div class="t">{{ item.title }}</div>
            <div class="b">
              <div class="play">
                <q-icon name="play_arrow" class="fs-16 m-r-5"></q-icon>
                <span>{{ item.playTimeStr }}</span>
              </div>
              <div class="episodes">
                <q-icon name="query_builder" class="fs-16 m-r-5"></q-icon>
                <span>{{ item.link.duration | getVideoTotalTime }}</span>
              </div>
            </div>
          </div>
        </li>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { TabHomeYinpinModule } from '@/store/modules/tab_home_yinpin';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'tab_yinpin_child_directory',
})
export default class extends Vue {
  $refs: any;
  async mounted() {
    await this.getDirectory();
    await this.$nextTick(async () => {
      this.$refs['list'].style['height'] = window.innerHeight - 278 + 10 + 'px';
      this.$refs['introduce'].style['height'] = window.innerHeight - 278 + 10 + 'px';
      this.$list = this.$refs['list'];
    });
  }
  private bannerData = {
    title: '',
    thumbnail: '',
    source: '来源：喜马拉雅',
    total_count: 0,
    intro: '',
  };
  private $list: any;
  private activeNavIndex = 0;
  private directoryList: any[] = [];
  private getDataLoading = false;
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private load_more_no_data = '';
  private hasLoadedData = false;
  private paginationPage = 1;
  private popupPaginationPgae = 1;
  private showSelectCount = false;
  private selectCountColumns: string[] = [];
  private showSelectResult = false;
  private selectResultList: any[] = [];
  private showSelectResultLoading = false;
  private selectReultTitle = '';
  /*event */
  private handleClickNav(index: number) {
    this.activeNavIndex = index;
  }
  private async monitorScrollEvent() {
    const scrollTop = this.$list.scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - 278 + 10 >= this.$refs['list'].scrollHeight) {
      if (!this.load_more_loading_lock) {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.paginationPage++;
        await this._getMoreDirectory();
        this.load_more_loading_lock = false;
      }
    }
  }
  private handleClickSelectCount() {
    this.showSelectCount = true;
  }
  private async handleClickSelectCountConfirm(item: any) {
    this.selectResultList = [];
    this.selectReultTitle = item;
    const index = this.selectCountColumns.indexOf(item) + 1;
    this.showSelectCount = false;
    await this.$nextTick(() => {
      this.showSelectResult = true;
    });
    try {
      this.showSelectResultLoading = true;
      this.popupPaginationPgae = index;
      const { data } = await TabHomeYinpinModule.getDirectory({ params: { aid: this.$route.query.aid, page: index } });
      const { list } = data;
      this.selectResultList = list;
      this.showSelectResultLoading = false;
      return Promise.resolve(true);
    } catch (error) {
      console.log(error);
      this.showSelectResultLoading = false;
      return Promise.reject(error);
    }
  }
  private async handleClickSelectCountCancel() {
    this.showSelectCount = false;
  }
  private handleClickItem(item: any, index: number) {
    TabHomeYinpinModule.SET_PLAY_PAGE_LIST(this.directoryList);
    this.$router.push(`/tab_yinpin_child/play?aid=${this.$route.query.aid}&lastPage=${this.paginationPage}&tid=${item.link.tid}`);
  }
  private handleClickItem2(item: any) {
    TabHomeYinpinModule.SET_PLAY_PAGE_LIST(this.directoryList);
    this.$router.push(`/tab_yinpin_child/play?aid=${this.$route.query.aid}&lastPage=${this.popupPaginationPgae}&tid=${item.link.tid}`);
  }
  /*http */
  private async getDirectory() {
    try {
      this.getDataLoading = true;
      const { data } = await TabHomeYinpinModule.getDirectory({ params: { aid: this.$route.query.aid, page: 1 } });
      const { info, total_count, list } = data;
      this.bannerData.title = info.title;
      this.bannerData.thumbnail = info.thumbnail;
      this.bannerData.total_count = total_count;
      this.bannerData.intro = info.intro;
      this.directoryList = list;
      for (var i = 0; i < Math.ceil(total_count / 20); i++) {
        this.selectCountColumns.push(`${i * 20 + 1}~${(i + 1) * 20 > total_count ? total_count : (i + 1) * 20}`);
      }
      this.hasLoadedData = true;
      this.getDataLoading = false;
      return Promise.resolve(true);
    } catch (error) {
      console.log(error);
      this.hasLoadedData = true;
      this.getDataLoading = false;
      return Promise.reject(error);
    }
  }
  private async _getMoreDirectory() {
    try {
      const { data } = await TabHomeYinpinModule.getDirectory({ params: { aid: this.$route.query.aid, page: this.paginationPage } });
      const { list } = data;
      if (!list.length) {
        this.load_more_no_data = '没有更多数据了';
        this.load_more_loading_lock = true;
        return Promise.reject();
      }
      this.directoryList = this.directoryList.concat(list);
      return Promise.resolve(true);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    } finally {
      this.load_more_loading = false;
    }
  }
}
</script>


<style lang="scss" scoped>
@import './style/directory.scss';
</style>