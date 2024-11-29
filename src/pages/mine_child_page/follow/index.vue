<template>
  <div class="follow-container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <div class="title">关注</div>
    </div>
    <div class="p-t-50">
      <q-card flat>
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator @input="tabChange">
          <q-tab name="author" label="关注的人" />
          <q-tab name="column" label="栏目" />
          <q-tab name="topic" label="专题" />
          <q-tab name="hotspot" label="热点" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="author">
            <div class="text-center p-t-10 p-b-10" v-if="authorLoading">
              <van-loading size="12px" color="#969799">加载中...</van-loading>
            </div>
            <ul v-if="!authorLoading" class="author">
              <li v-for="(item, index) in authorData" :key="index">
                <q-img :src="item.logo" class="logo"></q-img>
                <div>
                  <div class="name">{{ item.name }}</div>
                  <div class="desc">{{ item.desc }}</div>
                </div>
              </li>
            </ul>
          </q-tab-panel>
          <q-tab-panel name="column">
            <div class="text-center p-t-10 p-b-10" v-if="columnLoading">
              <van-loading size="12px" color="#969799">加载中...</van-loading>
            </div>
            <ul v-if="!columnLoading" class="column">
              <li v-for="(item, index) in columnData" :key="index">
                <q-img :src="item.logo" class="logo"></q-img>
                <div>
                  <div class="name">{{ item.name }}</div>
                  <div class="desc">
                    <span class="label">原创</span>
                  </div>
                </div>
              </li>
            </ul>
          </q-tab-panel>
          <q-tab-panel name="topic">
            <div class="text-center p-t-10 p-b-10" v-if="topicLoading">
              <van-loading size="12px" color="#969799">加载中...</van-loading>
            </div>
            <ul v-if="!topicLoading" class="topic">
              <li v-for="(item, index) in topicData" :key="index">
                <div class="desc"><span class="label">专题</span> {{ item.desc }}</div>
                <q-img :src="item.logo" class="logo"></q-img>
              </li>
            </ul>
          </q-tab-panel>
          <q-tab-panel name="hotspot">
            <div class="text-center p-t-10 p-b-10" v-if="hotspotLoading">
              <van-loading size="12px" color="#969799">加载中...</van-loading>
            </div>
            <ul v-if="!hotspotLoading" class="hotspot">
              <li v-for="(item, index) in hotSpotData" :key="index">
                <div class="name"># {{ item.name }} #</div>
                <q-img :src="item.logo" class="logo"></q-img>
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
  name: 'mine-follow',
})
export default class extends Vue {
  mounted() {
    this.getAuthorData();
  }
  public tab = 'author';
  public authorLoading = false;
  public columnLoading = false;
  public topicLoading = false;
  public hotspotLoading = false;
  public authorLock = false;
  public columnLock = false;
  public topicLock = false;
  public hotSpotLock = false;
  public authorData = [];
  public columnData = [];
  public topicData = [];
  public hotSpotData = [];
  /* event */
  public tabChange() {
    if (this.tab === 'author') {
      this.getAuthorData();
    } else if (this.tab === 'column') {
      this.getColumnData();
    } else if (this.tab === 'topic') {
      this.getTopicData();
    } else {
      this.getHotSpotData();
    }
  }

  /* http */
  public async getAuthorData() {
    if (this.authorLock) return;
    this.authorLoading = true;
    const { data } = await MineModule.getFollowList({ params: { page: 1, pagesize: 20, tabtype: 'author' } });
    const { list } = data;
    this.authorData = list.data;
    this.authorLoading = false;
    this.authorLock = true;
  }
  public async getColumnData() {
    if (this.columnLock) return;
    this.columnLoading = true;
    const { data } = await MineModule.getFollowList({ params: { page: 1, pagesize: 20, tabtype: 'column' } });
    const { list } = data;
    this.columnData = list.data;
    this.columnLoading = false;
    this.columnLock = true;
  }
  public async getTopicData() {
    if (this.topicLock) return;
    this.topicLoading = true;
    const { data } = await MineModule.getFollowList({ params: { page: 1, pagesize: 20, tabtype: 'topic' } });
    const { list } = data;
    this.topicData = list.data;
    this.topicLoading = false;
    this.topicLock = true;
  }
  public async getHotSpotData() {
    if (this.hotSpotLock) return;
    this.hotspotLoading = true;
    const { data } = await MineModule.getFollowList({ params: { page: 1, pagesize: 20, tabtype: 'hotspot' } });
    const { list } = data;
    this.hotSpotData = list.data;
    this.hotspotLoading = false;
    this.hotSpotLock = true;
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>