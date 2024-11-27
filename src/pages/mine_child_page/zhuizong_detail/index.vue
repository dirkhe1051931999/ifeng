<template>
  <div class="zhuizong_detail-container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <van-notice-bar :scrollable="false" color="#000000" background="#ffffff" class="m-t-10 m-b-10" style="width: 100%">
        <van-swipe vertical class="notice-swipe" :autoplay="2000" :show-indicators="false">
          <van-swipe-item v-for="(item, index) in commentData" :key="index" class="swipe">
            <q-img :src="item.avatar" class="img"></q-img>
            <div>{{ item.content }}</div>
          </van-swipe-item>
        </van-swipe>
      </van-notice-bar>
      <q-icon name="local_fire_department" class="hot" @click="handleClickNotice"></q-icon>
    </div>
    <div class="zhuizong_detail-wrap" ref="zhuizong_detail-wrap" @scroll="monitorScrollEvent">
      <div class="text-center p-t-10 p-b-10" v-show="getDataLoading">
        <van-loading size="12px" color="#969799">加载中...</van-loading>
      </div>
      <div class="bannerData" v-if="!getDataLoading">
        <div class="title"><q-icon name="tag" class="icon"></q-icon>{{ bannerData.title }}</div>
        <ul class="tag">
          <li v-for="(item, index) in bannerData.tag" :key="index" @click="handleClickParty(item)" :class="{ active: pagination_params.party === item.id }">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="sort" v-if="!getDataLoading">
        <div class="left">
          <div class="tag" @click="handleClickHighlight" :class="{ active: pagination_params.highlights === 1 }">
            <q-icon name="gps_fixed" class="icon"></q-icon>
            看重点
          </div>
        </div>
        <div class="right">
          <div class="tag" @click="handleClickSort('asc')" :class="{ active: pagination_params.order === 'asc' }">正序</div>
          <div class="tag" @click="handleClickSort('desc')" :class="{ active: pagination_params.order === 'desc' }">倒序</div>
        </div>
      </div>
      <div class="content">
        <div class="text-center p-t-10 p-b-10" v-show="getDataLoading2">
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
        <q-timeline color="secondary" v-if="!getDataLoading2">
          <q-timeline-entry :subtitle="new Date(item.nodeTime * 1000).toLocaleString()" color="primary" v-for="(item, index) in nodesList" :key="index" ref="timelineDomArr">
            <div class="card">
              <div class="description">
                {{ item.description || item.title }}
              </div>
              <div class="img-wrap" v-if="item.img && item.img.length">
                <q-img v-for="(img, i) in item.img" :key="i" :src="img.url" class="img" @click="previewImage(item.img, i)"></q-img>
              </div>
              <div class="video-wrap" v-if="item.video && item.video.poster">
                <q-img :src="item.video.poster" class="img"></q-img>
                <q-icon name="play_circle_filled" class="icon"></q-icon>
              </div>
              <div class="action">
                <div class="left">
                  <q-icon name="favorite_border" class="icon"></q-icon>
                  <div class="count">{{ item.interaction.like.count }}</div>
                </div>
                <div class="right" @click="handleClickCardComment(item)">
                  <q-icon name="chat_bubble_outline" class="icon"></q-icon>
                  <div class="count">{{ item.interaction.comment }}</div>
                </div>
              </div>
            </div>
          </q-timeline-entry>
          <div v-if="!getDataLoading2">
            <div class="load-more-loading" v-show="load_more_no_data.length">暂无数据</div>
            <div class="load-more-loading" v-show="load_more_loading">
              <q-spinner color="#969799" size="20px" :thickness="2" />
              加载中...
            </div>
          </div>
        </q-timeline>
      </div>
    </div>
    <van-popup v-model="showDetailComment" closeable position="bottom" :style="{ height: '85%' }" round class="detailComment">
      <div class="load-more-loading" v-show="detailCommentLoading">
        <q-spinner color="#969799" size="20px" :thickness="2" />
        加载中...
      </div>
      <div class="comment-list" v-if="!detailCommentLoading">
        <ul>
          <li v-for="(item, index) in detailCommentData" :key="index">
            <img :src="item.commentUserImgSrc" alt="" class="img" />
            <div class="right">
              <div class="nickname">{{ item.commentUserName }}</div>
              <div class="comment">{{ item.comment }}</div>
              <div class="createTime">{{ item.createTime | getDateDiff }}</div>
            </div>
          </li>
        </ul>
      </div>
    </van-popup>
    <van-popup v-model="showCardComment" closeable position="bottom" :style="{ height: '85%' }" round class="detailComment">
      <div class="load-more-loading" v-show="detailCardCommentLoading">
        <q-spinner color="#969799" size="20px" :thickness="2" />
        加载中...
      </div>
      <div class="comment-list" v-if="!detailCardCommentLoading">
        <ul>
          <li v-for="(item, index) in detailCardCommentData" :key="index">
            <img :src="item.commentUserImgSrc" alt="" class="img" />
            <div class="right">
              <div class="nickname">{{ item.commentUserName }}</div>
              <div class="comment">{{ item.comment }}</div>
              <div class="createTime">{{ item.createTime | getDateDiff }}</div>
            </div>
          </li>
        </ul>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { MineModule } from '@/store/modules/mine';
import { ImagePreview } from 'vant';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  name: 'mine-zhuizong_detail',
})
export default class extends Vue {
  async mounted() {
    this.getDataLoading = true;
    await this.getZhuiZongDetail();
    await this.getZhuiZongDetailComment();
    if (this.$route.query.node) {
      const position = await this.getZhuiZongDetailPosition();
      if (typeof position === 'number') {
        this.$nextTick(() => {
          const vueInstance = this.$refs['timelineDomArr'][position];
          const dom = vueInstance.$el;
          this.$refs['zhuizong_detail-wrap'].scrollTop = dom.offsetTop;
        });
      }
    }
    this.$refs['zhuizong_detail-wrap']['style']['height'] = `${window.innerHeight - 50}px`;
    this.getDataLoading = false;
  }
  $refs: any;
  private getDataLoading = false;
  private getDataLoading2 = false;
  private bannerData = { title: '', tag: [] };
  private nodesList = [];
  private commentData = [];
  private showDetailComment = false;
  private showCardComment = false;
  private detailCommentData = [];
  private detailCardCommentData = [];
  private detailCommentLoading = false;
  private detailCardCommentLoading = false;
  public containerPositionY = 0;
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private load_more_no_data = '';
  private pagination_params = {
    size: 10,
    num: 1,
    order: 'desc',
    highlights: 0,
    party: 0,
  };
  /* event */
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['zhuizong_detail-wrap'].scrollHeight;
    const scrollTop = this.$refs['zhuizong_detail-wrap'].scrollTop;
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
  private previewImage(images: any, index: number) {
    const arr = [];
    for (let item of images) {
      arr.push(item.url);
    }
    ImagePreview({
      images: arr,
      startPosition: index,
      closeable: true,
    });
  }
  private async handleClickParty(item: any) {
    this.pagination_params.party = item.id;
    this.pagination_params.num = 1;
    this.nodesList = [];
    this.getDataLoading2 = true;
    await this.getZhuiZongDetail();
    this.getDataLoading2 = false;
  }
  private async handleClickHighlight() {
    this.pagination_params.highlights = this.pagination_params.highlights === 1 ? 0 : 1;
    this.pagination_params.num = 1;
    this.nodesList = [];
    this.getDataLoading2 = true;
    await this.getZhuiZongDetail();
    this.getDataLoading2 = false;
  }
  private async handleClickSort(item: any) {
    this.pagination_params.order = item;
    this.pagination_params.num = 1;
    this.nodesList = [];
    this.getDataLoading2 = true;
    await this.getZhuiZongDetail();
    this.getDataLoading2 = false;
  }
  private async handleClickNotice() {
    this.showDetailComment = true;
    this.detailCommentData = [];
    this.detailCommentLoading = true;
    const result = await MineModule.getZhuiZongDetailComment2({
      body: {
        pagination: { current: 1, pageSize: 10000 },
        query: { subjectId: this.$route.query.id, rootId: '0', queryNextRankComment: true, pId: '', appId: '10' },
        sort: {},
      },
    });
    this.detailCommentLoading = false;
    this.detailCommentData = result.data.list;
  }
  private async handleClickCardComment(item: any) {
    this.showCardComment = true;
    this.detailCardCommentData = [];
    this.detailCardCommentLoading = true;
    const result = await MineModule.getZhuiZongDetailComment2({
      body: {
        pagination: { current: 1, pageSize: item.interaction.comment },
        query: { subjectId: item.id, rootId: '0', queryNextRankComment: true, pId: '', appId: '10' },
        sort: {},
      },
    });
    this.detailCardCommentLoading = false;
    this.detailCardCommentData = result.data.list;
  }
  /* http */
  private async getZhuiZongDetail() {
    const result = await MineModule.getZhuiZongDetail({
      page: 1,
      size: this.pagination_params.size,
      party: this.pagination_params.party,
      highlights: this.pagination_params.highlights,
      order: this.pagination_params.order,
      id: this.$route.query.id,
    });
    this.bannerData.title = result.timeline.title;
    this.bannerData.tag = result.parties;
    this.nodesList = result.nodes;
    return Promise.resolve();
  }
  private async getZhuiZongDetailComment() {
    const result = await MineModule.getZhuiZongDetailComment({
      size: 50,
      id: this.$route.query.id,
    });
    this.commentData = result;
    return Promise.resolve();
  }
  private async getZhuiZongDetailPosition() {
    const { position } = await MineModule.getZhuiZongDetailPosition({ id: this.$route.query.nodeId });
    return Promise.resolve(position);
  }
  private async _upCallback() {
    const result = await MineModule.getZhuiZongDetail({
      page: this.pagination_params.size,
      size: this.pagination_params.size,
      party: this.pagination_params.party,
      highlights: this.pagination_params.highlights,
      order: this.pagination_params.order,
      id: this.$route.query.id,
    });
    if (result.nodes.length === 0) {
      this.load_more_no_data = '没有更多数据了';
      this.load_more_loading_lock = true;
      this.load_more_loading = false;
      return Promise.reject();
    }
    this.nodesList = this.nodesList.concat(result.nodes);
    return Promise.resolve();
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
