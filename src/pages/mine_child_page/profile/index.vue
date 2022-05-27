<template>
  <div class="profile-container">
    <div class="navbar-container">
      <div class="left">
        <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      </div>
      <div class="right">
        <div class="l">
          <q-icon name="arrow_drop_down_circle" class="arrow" @click="handleClickMessages"></q-icon>
        </div>
        <div class="r">
          <q-icon name="more_horiz" class="more" @click="handleClickMore"></q-icon>
        </div>
      </div>
    </div>
    <div class="p-t-50">
      <div class="text-center p-t-10 p-b-10" v-if="profileData.loading">
        <van-loading size="12px" color="#969799">加载中...</van-loading>
      </div>
      <div v-else>
        <div class="userinfo-container">
          <q-img :src="userInfo.userimg" class="img"></q-img>
          <div class="info">
            <div class="name">
              {{ userInfo.nickname }}
            </div>
            <div class="title">
              <span class="label" @click="handleClickLabel">{{ userInfo.title_1 }}</span>
              <span class="medal" @click="handleClickMedal">勋章墙</span>
            </div>
          </div>
          <div class="edit">
            <span>编辑信息</span>
            <q-icon name="chevron_right"></q-icon>
          </div>
        </div>
        <div class="introduction">
          {{ userInfo.introduction || '加点介绍吧~' }}
        </div>
        <div class="follow-fans">
          <div class="follow">关注 {{ userInfo.follow_num }}</div>
          <div class="fans">关注 {{ userInfo.fans_num }}</div>
        </div>
      </div>
      <div class="feeds">
        <ul>
          <li v-for="(item, index) in feeds.list" :key="index">
            <div class="top flex">
              <q-img :src="userInfo.userimg" class="avatar"></q-img>
              <div class="flex flex-column">
                <div>{{ userInfo.nickname }}</div>
                <div>{{ item.createTime }}</div>
              </div>
              <div class="like"><q-icon name="favorite_border"></q-icon>{{ item.like }}</div>
            </div>
            <div class="content">
              {{ item.comment_contents }}
            </div>
            <div class="bottom" @click="handleClickDocDetails(item)">
              <q-img :src="item.thumbnail" class="img"></q-img>
              <div class="title">
                {{ item.title }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { MineModule } from '@/store/modules/mine';
import { UserModule } from '@/store/modules/user';
import { handlerQuasarShare } from '@/utils/share';
import { getUrlParams, json2Url } from '@/utils';
@Component({
  name: 'mine-profile',
})
export default class extends Vue {
  $refs: any;
  private profileData = {
    loading: false,
  };
  private feeds = {};
  private userInfo = {};
  mounted() {
    this.getMyList();
  }
  /* event */
  private handleClickMore() {
    handlerQuasarShare('profile', {});
  }
  private handleClickLabel() {
    this.$router.push('/mine_child_page/level');
  }
  private handleClickMedal() {
    this.$router.push('/mine_child_page/medal');
  }
  private handleClickMessages() {
    this.$router.push('/mine_child_page/messages');
  }
  private handleClickDocDetails(item: any) {
    let params;
    let urlStr: string;
    switch (item.link.type) {
      case 'doc':
        params = getUrlParams(item.link.url);
        urlStr = json2Url(params);
        this.$router.push('/news_detail/doc?' + urlStr);
        break;
      case 'short':
        params = getUrlParams(item.link.url);
        urlStr = json2Url(params);
        this.$router.push('/news_detail/imglist?' + urlStr);
        break;
      // case 'phvideo':
      //   params = {
      //     guid: item.link.url,
      //     title: item.doc_name,
      //     doc_url: news.commentsUrl,
      //     type: 'video',
      //   };
      //   params = Object.assign(params, getUrlParams(news.link.weburl));
      //   urlStr = json2Url(params) + '&' + news.link.queryString;
      //   this.$router.push('/news_detail/video?' + urlStr);
      //   break;
      default:
        break;
    }
  }
  /* http */
  private async getMyList() {
    this.profileData.loading = true;
    const { data } = await MineModule.myList({ guid_feeds: UserModule.guid });
    const { userinfo, feeds } = data;
    this.userInfo = userinfo;
    this.feeds = feeds;
    this.profileData.loading = false;
  }
}
</script>


<style lang="scss" scoped>
@import './index.scss';
</style>