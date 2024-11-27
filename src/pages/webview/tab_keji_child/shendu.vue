<template>
  <div class="tab_keji_child_shendu" ref="tab_keji_child_shendu" @scroll="monitorScrollEvent">
    <div class="back">
      <q-icon name="arrow_back_ios_new" @click="$router.back()" class="arrow"></q-icon>
      <span>科技深度</span>
    </div>
    <div class="text-center p-t-10 p-b-10" v-show="getDataLoading">
      <van-loading size="12px" color="#969799">加载中...</van-loading>
    </div>
    <ul class="list" v-if="shenduList.length">
      <li v-for="(news, index) in shenduList" :key="index">
        <!-- doc -->
        <div v-if="news.type === 'doc' || (news.type === 'topic2' && !news.newslist)" class="doc">
          <div class="top">
            <div class="left">
              <p class="title">
                <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.pos">{{ news.style.recomTag.text }}</span>
                {{ news.title }}
              </p>
            </div>
            <div class="right" v-if="news.thumbnail">
              <van-image class="thumbnail" :src="news.thumbnail" lazy-load radius="6" />
            </div>
          </div>
          <div v-if="news.summary" class="hot-comment">
            <span class="label">{{ news.summary.tag }}</span>
            {{ news.summary.desp }}
          </div>
          <div class="bottom">
            <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
            <span v-if="news.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ news.style.recomTag.text }}</span>
            <span class="source" v-if="news.source">{{ news.source }}</span>
            <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
            <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
            <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
            <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
          </div>
        </div>
      </li>
      <div class="load-more-loading" v-show="load_more_no_data">暂无数据</div>
      <div class="load-more-loading" v-show="load_more_loading">
        <q-spinner color="#969799" size="20px" :thickness="2" />
        加载中...
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import { TabHomeKejiModule } from '@/store/modules/home_tab/keji';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'tab_keji_child_shendu',
})
export default class extends Vue {
  $refs: any;
  mounted() {
    this.getList();
  }
  private shenduList: any[] = [];
  private getDataLoading = false;
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private load_more_no_data = '';
  private pagination_params = {
    size: 10,
    num: 1,
  };
  /*event*/
  /*event */
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['tab_keji_child_shendu'].scrollHeight;
    const scrollTop = this.$refs['tab_keji_child_shendu'].scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight >= scrollHeight) {
      if (!this.load_more_loading_lock) {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.pagination_params.num++;
        await this.getMoreList();
        this.load_more_loading_lock = false;
      }
    }
  }
  /*http*/
  private async getList() {
    try {
      this.getDataLoading = true;
      let params: any = {
        id: 'KJDEEP',
        ch: 'tech_sd_nav',
        page: this.pagination_params.num,
      };
      let form = {
        openNum: 3,
        lastDoc: ',,,',
        pushStatus: 1,
        installTime: 1626232810,
        closeWinType: '',
        closeWinCount: 0,
        closeWinTime: 0,
      };
      let formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }
      const result = await TabHomeKejiModule.getKejiNewsShenduList({ params, formData });
      this.shenduList = result[0].item;
      this.getDataLoading = false;
    } catch (error) {
      console.log(error);
    }
  }
  private async getMoreList() {
    try {
      let params: any = {
        id: 'KJDEEP',
        ch: 'tech_sd_nav',
        page: this.pagination_params.num,
      };
      let form = {
        openNum: 3,
        lastDoc: ',,,',
        pushStatus: 1,
        installTime: 1626232810,
        closeWinType: '',
        closeWinCount: 0,
        closeWinTime: 0,
      };
      let formData = new FormData();
      for (let key in form) {
        formData.append(key, form[key]);
      }
      const result = await TabHomeKejiModule.getKejiNewsShenduList({ params, formData });
      if (!result[0] || !result[0].item.length) {
        this.load_more_no_data = '没有更多数据了';
        this.load_more_loading_lock = true;
        return Promise.reject();
      }
      this.shenduList = this.shenduList.concat(result[0].item);
      this.$nextTick(() => {
        return Promise.resolve();
      });
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style/shendu.scss';
</style>
