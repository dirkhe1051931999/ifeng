<template>
  <div class="favorite-container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <div class="title">收藏</div>
    </div>
    <div class="p-t-50">
      <q-card flat>
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator @input="tabChange">
          <q-tab name="all" label="全部" />
          <q-tab name="doc" label="文章" />
          <q-tab name="videoPage" label="视频" />
          <q-tab name="slide" label="图集" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="all">
            <div class="text-center p-t-10 p-b-10" v-if="allLoading">
              <van-loading size="12px" color="#969799">加载中...</van-loading>
            </div>
            <div v-if="!allLoading && !allData.length">
              <van-empty image="error" description="暂无数据" />
            </div>
            <ul v-if="!allLoading && allData.length" class="news">
              <li v-for="(item, index) in allData" :key="index">
                <div class="left">
                  <div class="title">{{ item.title }}</div>
                  <div class="p-t-5">
                    <span class="source">{{ item.source }}</span>
                    <span class="time">{{ item.publish_time }}</span>
                  </div>
                </div>
                <q-img :src="item.thumbnail" class="thumbnail"></q-img>
              </li>
            </ul>
          </q-tab-panel>
          <q-tab-panel name="doc">
            <div class="text-center p-t-10 p-b-10" v-if="docLoading">
              <van-loading size="12px" color="#969799">加载中...</van-loading>
            </div>
            <div v-if="!docLoading && !docData.length">
              <van-empty image="error" description="暂无数据" />
            </div>
            <ul v-if="!docLoading && docData.length" class="news">
              <li v-for="(item, index) in docData" :key="index">
                <div class="left">
                  <div class="title">{{ item.title }}</div>
                  <div class="p-t-5">
                    <span class="source">{{ item.source }}</span>
                    <span class="time">{{ item.publish_time }}</span>
                  </div>
                </div>
                <q-img :src="item.thumbnail" class="thumbnail"></q-img>
              </li>
            </ul>
          </q-tab-panel>
          <q-tab-panel name="videoPage">
            <div class="text-center p-t-10 p-b-10" v-if="videoPageLoading">
              <van-loading size="12px" color="#969799">加载中...</van-loading>
            </div>
            <div v-if="!videoPageLoading && !videoPageData.length">
              <van-empty image="error" description="暂无数据" />
            </div>
            <ul v-if="!videoPageLoading && videoPageData.length" class="news">
              <li v-for="(item, index) in videoPageData" :key="index">
                <div class="left">
                  <div class="title">{{ item.title }}</div>
                  <div class="p-t-5">
                    <span class="source">{{ item.source }}</span>
                    <span class="time">{{ item.publish_time }}</span>
                  </div>
                </div>
                <q-img :src="item.thumbnail" class="thumbnail"></q-img>
              </li>
            </ul>
          </q-tab-panel>
          <q-tab-panel name="slide">
            <div class="text-center p-t-10 p-b-10" v-if="slideLoading">
              <van-loading size="12px" color="#969799">加载中...</van-loading>
            </div>
            <div v-if="!slideLoading && !slideData.length">
              <van-empty image="error" description="暂无数据" />
            </div>
            <ul v-if="!slideLoading && slideData.length" class="news">
              <li v-for="(item, index) in slideData" :key="index">
                <div class="left">
                  <div class="title">{{ item.title }}</div>
                  <div class="p-t-5">
                    <span class="source">{{ item.source }}</span>
                    <span class="time">{{ item.publish_time }}</span>
                  </div>
                </div>
                <q-img :src="item.thumbnail" class="thumbnail"></q-img>
              </li>
            </ul>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { MineModule } from '@/store/modules/mine';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'mine-favorite',
})
export default class extends Vue {
  mounted() {
    this.getAllData();
  }
  public tab = 'all';
  public allData = [];
  public docData = [];
  public videoPageData = [];
  public slideData = [];
  public allLock = false;
  public docLock = false;
  public videoPageLock = false;
  public slideLock = false;
  public allLoading = false;
  public docLoading = false;
  public videoPageLoading = false;
  public slideLoading = false;
  /* event */
  public tabChange() {
    if (this.tab === 'all') {
      this.getAllData();
    } else if (this.tab === 'doc') {
      this.getDocData();
    } else if (this.tab === 'videoPage') {
      this.getVideoPageData();
    } else {
      this.getSlideData();
    }
  }
  /* http */
  public async getAllData() {
    if (this.allLock) return;
    this.allLoading = true;
    const { list } = await MineModule.getFavoriteList({ params: { page: 1 } });
    this.allData = list;
    this.allLoading = false;
    this.allLock = true;
  }
  public async getDocData() {
    if (this.docLock) return;
    this.docLoading = true;
    const { list } = await MineModule.getFavoriteList({ params: { page: 1, type: 'doc' } });
    this.docData = list;
    this.docLoading = false;
    this.docLock = true;
  }
  public async getVideoPageData() {
    if (this.videoPageLock) return;
    this.videoPageLoading = true;
    const { list } = await MineModule.getFavoriteList({ params: { page: 1, type: 'videoPage' } });
    this.videoPageData = list;
    this.videoPageLoading = false;
    this.videoPageLock = true;
  }
  public async getSlideData() {
    if (this.slideLock) return;
    this.slideLoading = true;
    const { list } = await MineModule.getFavoriteList({ params: { page: 1, type: 'slide' } });
    this.slideData = list;
    this.slideLoading = false;
    this.slideLock = true;
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>