<template>
  <div class="messages-container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <div class="title">消息</div>
    </div>
    <div class="p-t-50">
      <q-card flat>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          @input="tabChange"
        >
          <q-tab name="reply" label="回复" />
          <q-tab name="like" label="点赞" />
          <q-tab name="systemReply" label="通知" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="reply">
            <div class="text-center p-t-10 p-b-10" v-if="replyLoading">
              <van-loading size="12px" color="#969799">加载中...</van-loading>
            </div>
            <ul v-if="!replyLoading" class="reply">
              <li v-for="(item, index) in replyData" :key="index">
                <div class="top">
                  <q-img :src="item.imgurl" class="img"></q-img>
                  <div class="r">
                    <div class="nickname">{{ item.nickname }}</div>
                    <div class="ctime">{{ item.ctime | parseTimeFromDateString }} {{ item.ctime | parseTimeFromDateString3 }}</div>
                  </div>
                </div>
                <div class="content">
                  {{ item.content }}
                </div>
                <div class="bottom" @click="handleClickDocDetails(item)">
                  <div class="t">{{ item.parent_contents }}</div>
                  <div class="b">
                    <q-img class="img" :src="item.artical_thumbnail"></q-img>
                    <div class="r">
                      {{ item.doc_name }}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </q-tab-panel>
          <q-tab-panel name="like">
            <div class="text-center p-t-10 p-b-10" v-if="likeLoading">
              <van-loading size="12px" color="#969799">加载中...</van-loading>
            </div>
            <ul v-if="!likeLoading" class="like">
              <li v-for="(item, index) in likeData" :key="index">
                <div class="top">
                  <div v-for="(voter, j) in [item.voters[0]]" :key="j" class="voters">
                    <q-img :src="voter.voter_imgs" class="img"></q-img>
                    <div class="r">
                      <div class="nickname">{{ voter.voter_names }}</div>
                      <div class="ctime">{{ item.createTime | parseTimeFromDateString }} {{ item.createTime | parseTimeFromDateString3 }}</div>
                    </div>
                  </div>
                  <div class="text">等人点赞了你的评论</div>
                  <q-icon name="chevron_right" class="arrow"></q-icon>
                </div>
                <div class="content">
                  {{ item.content }}
                </div>
                <div class="bottom" @click="handleClickDocDetails(item)">
                  <q-img class="img" :src="item.artical_thumbnail"></q-img>
                  <div class="r">
                    {{ item.doc_name }}
                  </div>
                </div>
              </li>
            </ul>
          </q-tab-panel>
          <q-tab-panel name="systemReply">
            <div class="text-center p-t-10 p-b-10" v-if="systemReplyLoading">
              <van-loading size="12px" color="#969799">加载中...</van-loading>
            </div>
            <ul v-if="!systemReplyLoading" class="systemReply">
              <li v-for="(item, index) in systemReplyData" :key="index">
                <div class="top">
                  <q-img :src="item.userimg" class="img"></q-img>
                  <div class="r">
                    <div class="nickname">{{ item.nickname }}</div>
                    <div class="ctime">{{ item.ctime | parseTimeFromDateString }} {{ item.ctime | parseTimeFromDateString3 }}</div>
                  </div>
                </div>
                <div class="content">
                  {{ item.content }}
                </div>
              </li>
            </ul>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { getUrlParams, json2Url } from '@/utils';
import { MineModule } from '@/store/modules/mine';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'mine-messages',
})
export default class extends Vue {
  mounted() {
    this.getReplyMessages();
  }
  private tab = 'reply';
  private replyLoading = false;
  private replyLock = false;
  private likeLoading = false;
  private likeLock = false;
  private systemReplyLoading = false;
  private systemReplyLock = false;
  private replyData = [];
  private likeData = [];
  private systemReplyData = [];
  /* event */
  private tabChange() {
    if (this.tab === 'reply') {
      this.getReplyMessages();
    } else if (this.tab === 'like') {
      this.getLikeMessages();
    } else {
      this.getSystemReplyMessages();
    }
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
  private async getReplyMessages() {
    if (this.replyLock) return;
    this.replyLoading = true;
    const { data } = await MineModule.getReplyMessages({ page: 1 });
    const { list } = data;
    this.replyData = list;
    this.replyLoading = false;
    this.replyLock = true;
  }
  private async getLikeMessages() {
    if (this.likeLock) return;
    this.likeLoading = true;
    const { data } = await MineModule.getLikeMessages({ page: 1 });
    const { list } = data;
    this.likeData = list;
    this.likeLoading = false;
    this.likeLock = true;
  }
  private async getSystemReplyMessages() {
    if (this.systemReplyLock) return;
    this.systemReplyLoading = true;
    const { data } = await MineModule.getSystemReplyMessages({ page: 1 });
    const { list } = data;
    this.systemReplyData = list;
    this.systemReplyLoading = false;
    this.systemReplyLock = true;
  }
}
</script>


<style lang="scss" scoped>
@import './index.scss';
</style>