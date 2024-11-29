<template>
  <div class="see-container">
    <q-card flat>
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator @input="tabChange">
        <q-tab name="recommend" label="推荐" />
        <q-tab name="ifengSay" label="凤凰说" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="recommend">
          <div class="recommend-container" ref="recommend-container" @scroll="monitorRecommendScrollEvent">
            <van-pull-refresh v-model="recommendLoading" @refresh="recommendRefresh" :success-duration="1000">
              <div class="text-center p-t-10 p-b-10" v-if="getDataLoading">
                <van-loading size="12px" color="#969799">加载中...</van-loading>
              </div>
              <ul class="recommend-list" v-if="recommendList.length && !getDataLoading">
                <li v-for="(item, index) in recommendList" :key="index">
                  <div class="top">
                    <div class="left">
                      <img :src="item.subscribe.logo" class="avatar" />
                    </div>
                    <div class="right">
                      <div class="catename">{{ item.subscribe.catename }}</div>
                      <div class="description">{{ item.subscribe.description }}</div>
                    </div>
                  </div>
                  <div class="middle">
                    <div class="content">
                      {{ item.intro }}
                    </div>
                    <!-- 图片 -->
                    <div class="imgs" v-if="!item.link.mp4">
                      <q-img class="img" :src="img.url" v-for="(img, i) in item.imageList" :key="i" @click="previewImage(item.imageList, i)"></q-img>
                    </div>
                    <!-- 视频 -->
                    <div v-else class="full-img">
                      <q-icon class="icon" name="play_circle_filled"></q-icon>
                      <q-img :src="item.imageList[0].url" class="img"></q-img>
                    </div>
                  </div>
                  <div class="bottom">
                    <div class="left">
                      <q-icon name="favorite_border" class="icon"></q-icon>
                      <span class="count">{{ item.like || 0 }}</span>
                    </div>
                    <div class="right">
                      <q-icon name="chat_bubble_outline" class="icon"></q-icon>
                      <span class="count">{{ item.commentsall || 0 }}</span>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-if="!getDataLoading">
                <div class="load-more-loading" v-show="load_more_no_data_recommend">暂无数据</div>
                <div class="load-more-loading" v-show="load_more_loading_recommend">
                  <q-spinner color="#969799" size="20px" :thickness="2" />
                  加载中...
                </div>
              </div>
            </van-pull-refresh>
          </div>
        </q-tab-panel>
        <q-tab-panel name="ifengSay">
          <div class="ifengSay-container" ref="ifengSay-container" @scroll="monitoriFengSayScrollEvent">
            <van-pull-refresh v-model="ifengSayLoading" @refresh="ifengSayRefresh" :success-duration="1000">
              <div class="text-center p-t-10 p-b-10" v-if="getDataLoading2">
                <van-loading size="12px" color="#969799">加载中...</van-loading>
              </div>
              <ul class="ifengSay-banner" v-if="!getDataLoading2 && ifengSayBannerList.length">
                <li v-for="(item, index) in ifengSayBannerList" :key="index">
                  <img :src="item.thumbnail" alt="" class="img" />
                  <div class="title">{{ item.title }}</div>
                </li>
              </ul>
              <ul class="ifengSay-list" v-if="!getDataLoading2 && ifengSayList.length">
                <li v-for="(item, index) in ifengSayList" :key="index">
                  <div class="top">
                    <div class="left">
                      <img :src="item.columnLabel.titleIcon" alt="" />
                    </div>
                    <div class="center">
                      {{ item.columnLabel.title }}
                    </div>
                    <div class="right">{{ item.columnLabel.desp }} <q-icon name="chevron_right" class="icon"> </q-icon></div>
                  </div>
                  <div class="bottom">
                    <div class="left">
                      <div class="t">{{ item.title }}</div>
                      <div class="b">
                        <span class="catename">{{ item.subscribe.catename }}</span>
                        <span class="updateTime">{{ item.updateTime | relativeTime }}</span>
                      </div>
                    </div>
                    <div class="right">
                      <q-img :src="item.thumbnail" class="img"></q-img>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-if="!getDataLoading2">
                <div class="load-more-loading" v-show="load_more_no_data_ifengSay">暂无数据</div>
                <div class="load-more-loading" v-show="load_more_loading_ifengSay">
                  <q-spinner color="#969799" size="20px" :thickness="2" />
                  加载中...
                </div>
              </div>
            </van-pull-refresh>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlazaModule } from '@/store/modules/plaza';
import { ImagePreview } from 'vant';
@Component({
  name: 'tab_plaza',
})
export default class extends Vue {
  $refs: any;
  mounted() {
    this.getSquarerecommend();
    this.$nextTick(() => {
      this.$refs['recommend-container'].style.height = `${window.innerHeight - 36 - 60}px`;
    });
  }
  public tab = 'recommend';
  public getDataLoading = false;
  public getDataLoading2 = false;
  public recommendLoading = false;
  public ifengSayLoading = false;
  public recommendList: any[] = [];
  public ifengSayList: any[] = [];
  public ifengSayBannerList: any[] = [];
  public load_more_loading_recommend = false;
  public load_more_loading_lock_recommend = false;
  public load_more_no_data_recommend = '';
  public pagination_params_recommend = {
    size: 10,
    num: 1,
  };
  public load_more_loading_ifengSay = false;
  public load_more_loading_lock_ifengSay = false;
  public load_more_no_data_ifengSay = '';
  public pagination_params_ifengSay = {
    size: 10,
    num: 1,
  };
  public containerPositionY_recommend = 0;
  public containerPositionY_ifengSay = 0;
  /* event */
  public async monitorRecommendScrollEvent() {
    const scrollHeight = this.$refs['recommend-container'].scrollHeight;
    const scrollTop = this.$refs['recommend-container'].scrollTop;
    this.containerPositionY_recommend = scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - 60 - 36 >= scrollHeight) {
      if (!this.load_more_loading_lock_recommend) {
        this.load_more_loading_recommend = true;
        this.load_more_loading_lock_recommend = true;
        this.pagination_params_recommend.num++;
        await this._upCallback_Recommend();
        this.load_more_loading_lock_recommend = false;
      }
    }
  }
  public async monitoriFengSayScrollEvent() {
    const scrollHeight = this.$refs['ifengSay-container'].scrollHeight;
    const scrollTop = this.$refs['ifengSay-container'].scrollTop;
    this.containerPositionY_ifengSay = scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - 60 - 36 >= scrollHeight) {
      if (!this.load_more_loading_lock_ifengSay) {
        this.load_more_loading_ifengSay = true;
        this.load_more_loading_lock_ifengSay = true;
        this.pagination_params_ifengSay.num++;
        await this._upCallback_IfengSay();
        this.load_more_loading_lock_ifengSay = false;
      }
    }
  }
  public previewImage(images: any, index: number) {
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
  public tabChange() {
    this.$nextTick(() => {
      if (this.tab === 'ifengSay' && this.$refs['ifengSay-container'] && !this.$refs['ifengSay-container'].style.height) {
        this.getnNwsSquareColumn();
        this.$refs['ifengSay-container'].style.height = `${window.innerHeight - 36 - 60}px`;
      }
    });
  }
  /* http */
  public async getSquarerecommend() {
    this.getDataLoading = true;
    const result = await PlazaModule.getSquarerecommend({ params: { page: 1 } });
    const { item } = result[0];
    this.recommendList = item;
    this.getDataLoading = false;
  }
  public async getnNwsSquareColumn() {
    this.getDataLoading2 = true;
    const result = await PlazaModule.getnNwsSquareColumn({ params: { page: 1 } });
    this.ifengSayBannerList = result[0].item;
    this.ifengSayList = result[1].item;
    this.getDataLoading2 = false;
  }
  public async recommendRefresh() {
    this.getDataLoading = true;
    this.pagination_params_recommend.num = 1;
    const result = await PlazaModule.getSquarerecommend({ params: { page: 1 } });
    const { item } = result[0];
    this.recommendList = item;
    this.getDataLoading = false;
    this.recommendLoading = false;
    this.$toast('刷新成功');
  }
  public async ifengSayRefresh() {
    this.getDataLoading2 = true;
    this.pagination_params_ifengSay.num = 1;
    const result = await PlazaModule.getnNwsSquareColumn({ params: { page: 1 } });
    this.ifengSayBannerList = result[0].item;
    this.ifengSayList = result[1].item;
    this.getDataLoading2 = false;
    this.ifengSayLoading = false;
    this.$toast('刷新成功');
  }
  public async _upCallback_Recommend() {
    const result = await PlazaModule.getSquarerecommend({ params: { page: this.pagination_params_recommend.num } });
    const { item } = result[0];
    if (item.length === 0) {
      this.load_more_no_data_recommend = '没有更多数据了';
      this.load_more_loading_lock_recommend = true;
      this.load_more_loading_recommend = false;
      return Promise.reject();
    } else {
      this.recommendList = this.recommendList.concat(item);
      return Promise.resolve();
    }
  }
  public async _upCallback_IfengSay() {
    const result = await PlazaModule.getnNwsSquareColumn({ params: { page: this.pagination_params_ifengSay.num } });
    const { item } = result[0];
    if (item.length === 0) {
      this.load_more_no_data_ifengSay = '没有更多数据了';
      this.load_more_loading_lock_ifengSay = true;
      this.load_more_loading_ifengSay = false;
      return Promise.reject();
    } else {
      this.ifengSayList = this.ifengSayList.concat(item);
      return Promise.resolve();
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>