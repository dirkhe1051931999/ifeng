<template>
  <div class="news-detail-video">
    <div class="loading-page" v-if="!pageLoaded">
      <div class="p-t-30">
        <q-spinner color="primary" size="22px" :thickness="2" class="m-r-10" />
        努力加载中...
      </div>
    </div>
    <div class="video-player" v-if="pageLoaded">
      <InlineVideo :src="singleVideoInfo.videoURL" :poster="singleVideoInfo.trimImgURL" class="player"></InlineVideo>
      <q-icon class="back" name="arrow_back_ios" @click="$router.back()"></q-icon>
    </div>
    <div class="news-detail-video-wrap" ref="news-detail-video-wrap" @scroll="monitorScrollEvent" v-if="pageLoaded">
      <div class="related-video">
        <div class="author" v-if="singleVideoInfo.weMedia">
          <div class="l">
            <div class="ll">
              <img :src="singleVideoInfo.weMedia.headPic" alt="" srcset="" class="headPic" />
              <img :src="singleVideoInfo.weMedia.honorImg" alt="" srcset="" v-if="singleVideoInfo.weMedia.honorImg" class="honorImg" />
            </div>
            <div class="rr">
              <div class="t">{{ singleVideoInfo.weMedia.name }}</div>
              <div class="b">{{ singleVideoInfo.weMedia.desc }}</div>
            </div>
          </div>
          <div class="r">关注</div>
        </div>
        <div class="news-title">
          {{ singleVideoInfo.title }}
        </div>
        <ul class="related-list">
          <li v-for="(item, index) in relatedVideos" :key="index" @click.stop.prevent="handlerClickNewsItem(item)">
            <div class="l">
              <div class="t dotdotdot2">
                {{ item.title }}
              </div>
              <div class="b">
                <div class="ll">
                  {{ item.phvideo.channelName }}
                </div>
                <div class="rr">
                  {{ item.phvideo.playTimeStr }}
                </div>
              </div>
            </div>
            <div class="r">
              <img :src="item.thumbnail" alt="" />
            </div>
          </li>
        </ul>
      </div>
      <div class="news-comment">
        <div class="title">评论</div>
        <div class="sort-wrap" v-if="commentsMap.comments.length">
          <div class="l">
            {{ commentsSort.sortTitle }}
          </div>
          <div class="r" @click="handlerClickCommentsSort(commentsSort.sortMethod)">
            <q-icon name="sort" class="icon"></q-icon>
            <span class="method"> {{ commentsSort.sortMethod }}</span>
            <q-spinner color="#afafaf" size="12px" :thickness="2" class="m-l-10" v-show="commentSorting" />
          </div>
        </div>
        <div v-else class="text-center">
          <van-empty description="暂无评论" />
        </div>
        <div v-for="(father, _) in commentsMap.comments" :key="_">
          <div class="comment-container">
            <div class="owner">
              <div class="one">
                <div class="l">
                  <img :src="father.faceurl" alt="" class="avatar" />
                  <img src="~assets/icon_hot.png" alt="" class="hot" v-if="father.isHot" />
                </div>
                <div class="m">
                  <div class="t">
                    <span class="uname"> {{ father.uname }}</span>
                    <span v-if="father.reply_uname">回复</span>
                    <span class="reply_uname" v-if="father.reply_uname">{{ father.reply_uname }}</span>
                  </div>
                  <div class="c">
                    {{ father.comment_contents }}
                    <div class="emojo" v-if="father.pics && father.pics.length">
                      <img :src="pic.url" alt="" v-for="(pic, picIndex) in father.pics" :key="picIndex" />
                    </div>
                  </div>
                  <div class="b">
                    <span class="time" v-if="father.comment_date">{{ father.comment_date | getDateDiff }}</span>
                    <span class="split"></span>
                    <span class="reply">回复</span>
                  </div>
                </div>
                <div class="r">
                  <span class="like">{{ father.uptimes }}</span>
                  <q-icon name="favorite_border" class="icon"></q-icon>
                  <q-icon name="close" class="close"></q-icon>
                </div>
              </div>
              <div v-if="father.children.comments.length" class="two">
                <div class="child" v-for="(child, __) in father.children.comments" :key="__">
                  <div class="l">
                    <img :src="child.faceurl" alt="" class="avatar" />
                    <img src="~assets/icon_hot.png" alt="" class="hot" v-if="child.isHot" />
                  </div>
                  <div class="m">
                    <div class="t">
                      <span class="uname"> {{ child.uname }}</span>
                      <br />
                      <span v-if="child.reply_uname">回复</span>
                      <span class="reply_uname" v-if="child.reply_uname">{{ child.reply_uname }}</span>
                    </div>
                    <div class="c">
                      {{ child.comment_contents }}
                      <div class="emojo" v-if="child.pics && child.pics.length">
                        <img :src="pic.url" alt="" v-for="(pic, picIndex) in child.pics" :key="picIndex" />
                      </div>
                    </div>
                    <div class="b">
                      <span class="time" v-if="child.comment_date">{{ child.comment_date | getDateDiff }}</span>
                      <span class="split"></span>
                      <span class="reply">回复</span>
                    </div>
                  </div>
                  <div class="r">
                    <span class="like">{{ child.uptimes }}</span>
                    <q-icon name="favorite_border" class="icon"></q-icon>
                    <q-icon name="close" class="close"></q-icon>
                  </div>
                </div>
                <div class="more" @click="handlerClickComentsChildMore(father)" v-if="father.children.comments.length < Number(father.children.count)">
                  查看全部{{ father.children.count }}条
                  <q-icon name="expand_circle_down" class="arrow"></q-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="load-more-loading" v-show="load_more_no_data">暂无数据</div>
        <div class="load-more-loading" v-show="load_more_loading">
          <q-spinner color="#969799" size="20px" :thickness="2" />
          加载中...
        </div>
      </div>
    </div>
    <van-popup v-model="showCommentsChildrenMore" position="bottom" :style="{ height: '90%' }" round ref="van-popup-for-comments-children">
      <div class="comment-children-more-container">
        <div class="header">评论详情</div>
        <div class="comments" ref="comment-children-more">
          <div class="load-more-loading" v-show="commentsChildrenMoreLoading">
            <q-spinner color="#969799" size="20px" :thickness="2" />
            加载中...
          </div>
          <li v-if="commentsOwnerMap.faceurl">
            <div class="l">
              <img :src="commentsOwnerMap.faceurl" alt="" class="avatar" />
              <img src="~assets/icon_hot.png" alt="" class="hot" v-if="commentsOwnerMap.isHot" />
            </div>
            <div class="m">
              <div class="t">
                <span class="uname"> {{ commentsOwnerMap.uname }}</span>
                <span v-if="commentsOwnerMap.reply_uname">回复</span>
                <span class="reply_uname" v-if="commentsOwnerMap.reply_uname">{{ commentsOwnerMap.reply_uname }}</span>
              </div>
              <div class="c">{{ commentsOwnerMap.comment_contents }}</div>
              <div class="b">
                <span class="time" v-if="commentsOwnerMap.comment_date">{{ commentsOwnerMap.comment_date | getDateDiff }}</span>
                <span class="split"></span>
                <span class="reply">回复</span>
              </div>
            </div>
            <div class="r">
              <span class="like">{{ commentsOwnerMap.uptimes }}</span>
              <q-icon name="favorite_border" class="icon"></q-icon>
              <q-icon name="close" class="close"></q-icon>
            </div>
          </li>
          <li v-for="(child, index) in commentsChildrenMoreList" :key="index">
            <div class="l">
              <img :src="child.faceurl" alt="" class="avatar" />
              <img src="~assets/icon_hot.png" alt="" class="hot" v-if="child.isHot" />
            </div>
            <div class="m">
              <div class="t">
                <span class="uname"> {{ child.uname }}</span>
                <span v-if="child.reply_uname">回复</span>
                <span class="reply_uname" v-if="child.reply_uname">{{ child.reply_uname }}</span>
              </div>
              <div class="c">{{ child.comment_contents }}</div>
              <div class="b">
                <span class="time" v-if="child.comment_date">{{ child.comment_date | getDateDiff }}</span>
                <span class="split"></span>
                <span class="reply">回复</span>
              </div>
            </div>
            <div class="r">
              <span class="like">{{ child.uptimes }}</span>
              <q-icon name="favorite_border" class="icon"></q-icon>
              <q-icon name="close" class="close"></q-icon>
            </div>
          </li>
        </div>
        <div class="footer hide">
          <div class="input">我来说两句</div>
        </div>
      </div>
    </van-popup>
    <div class="comment-input" v-if="pageLoaded">
      <div class="input">我来说两句</div>
      <div class="comment">
        <van-badge :content="commentsMap.join_count">
          <i class="iconfont icon-duanxin"></i>
        </van-badge>
      </div>
      <div class="share">
        <i class="iconfont icon-fenxiang3" @click.stop.prevent="handleClickShare"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CommentsModule } from '@/store/modules/comment';
import { NewsDetailsModule } from '@/store/modules/news_details';
import { Component, Vue, Watch } from 'vue-property-decorator';
import InlineVideo from '@/components/inlineVideo/index.vue';
import { getUrlParams, json2Url } from '@/utils';
import { handlerQuasarShare } from '@/utils/share';
@Component({
  name: 'news-detail-video',
  components: {
    InlineVideo,
  },
})
export default class extends Vue {
  $refs: any;
  @Watch('$route')
  onchange(to: any, from: any) {
    if (to.path === '/news_detail/video') {
      if (from.query.reload === 'true') {
        location.reload();
      } else {
        const scrollTop: number = this.containerPositionY;
        if (scrollTop !== 0) {
          this.$dom.scrollTop = scrollTop;
        }
      }
    }
  }
  private $dom: any;
  private pageLoaded = false;
  private containerPositionY = 0;
  private commentResult = {};
  private relatedVideos: any[] = [];
  private singleVideoInfo = {};
  // 评论排序，分页相关
  private commentsPaginationParams = {
    num: 1,
    orderby: 'integral',
    pagesize: 10,
  };
  private commentsSort = {
    sortMethod: '按时间',
    sortTitle: '热门评论',
  };
  private commentsMap = {
    count: 0,
    join_count: 0,
    comments: [],
    allow_comment: 1,
    newComments: [],
  };
  private commentsChildrenMoreList: any[] = [];
  private commentsOwnerMap: any = {};
  private commentSorting = false;
  private load_more_loading_lock = false;
  private load_more_loading = false;
  private load_more_no_data = '';
  private showCommentsChildrenMore = false;
  private commentsChildrenMoreLoading = false;
  async mounted() {
    await this.getNewsDetail(this.$route.query);
    this.pageLoaded = true;
    await this.$nextTick(() => {
      this.$refs['news-detail-video-wrap'].style['height'] = `${window.innerHeight - 46 - 220}px`;
      this.$dom = this.$refs['news-detail-video-wrap'];
    });
  }
  /**event */
  private handleClickShare() {
    handlerQuasarShare('app', {});
  }
  private handlerClickNewsItem(news: any) {
    if (news.type === 'phvideo') {
      let params = {
        guid: news.link.url,
        title: news.title,
        doc_url: news.commentsUrl,
        type: 'video',
      };
      params = Object.assign(params, getUrlParams(news.link.weburl));
      let urlStr = `${json2Url(params)}&${news.link.queryString}`;
      this.$router.push(`/news_detail/video?${urlStr}`);
    }
  }
  private async monitorScrollEvent() {
    const scrollTop = this.$dom.scrollTop;
    this.containerPositionY = scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - 46 - 220 >= this.$dom.scrollHeight) {
      if (this.commentsMap.newComments.length < this.commentsPaginationParams.pagesize) {
        this.load_more_no_data = '没有更多数据了';
        this.load_more_loading_lock = true;
        this.load_more_loading = false;
        return;
      }
      if (!this.load_more_loading_lock) {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.commentsPaginationParams.num++;
        await this._getCommentsMore();
        this.load_more_loading_lock = false;
      }
    }
  }
  /**http */
  private async getNewsDetail(params: any) {
    let commentParams: any = {
      doc_url: params.doc_url,
      p: this.commentsPaginationParams.num,
      orderby: this.commentsPaginationParams.orderby,
      pagesize: this.commentsPaginationParams.pagesize,
    };
    const { singleVideoInfo } = await NewsDetailsModule.apiPhoenixtvDetails({
      params: {
        guid: this.$route.query.guid,
        secret: this.$route.query.secret,
      },
    });
    let commentResult = await CommentsModule.getComments({ params: commentParams });
    let relatedVideos = await NewsDetailsModule.relatedVideos({
      params: {
        type: this.$route.query.type,
        guid: this.$route.query.guid,
        channelid: this.$route.query.channelid,
        title: this.$route.query.title,
      },
    });
    const arr = [];
    if (relatedVideos && relatedVideos.items) {
      for (let item of relatedVideos.items) {
        if (item.type === 'phvideo') {
          arr.push(item);
        }
      }
    }
    this.relatedVideos = arr;
    this.singleVideoInfo = singleVideoInfo[0];
    this.commentsMap = commentResult;
    this.commentsMap.newComments = commentResult.comments;
    return Promise.resolve();
  }
  private handlerClickComentsChildMore(news: any) {
    this.commentsOwnerMap = {};
    this.commentsChildrenMoreList = [];
    this.commentsChildrenMoreLoading = true;
    this.showCommentsChildrenMore = true;
    this.$nextTick(async () => {
      this.$refs['comment-children-more'].style['height'] = `${this.$refs['van-popup-for-comments-children'].$el.clientHeight - 46}px`;
      const params = {
        doc_url: news.doc_url,
        comment_id: news.comment_id,
        p: '1',
        pagesize: news.children.count,
      };
      const result = await CommentsModule.getCommentsChildren({ params });
      this.commentsOwnerMap = news;
      this.commentsChildrenMoreList = result.comments;
      this.commentsChildrenMoreLoading = false;
    });
  }
  private async handlerClickCommentsSort(method: string) {
    if (this.commentSorting) {
      return;
    }
    this.commentSorting = true;
    this.commentsSort.sortMethod = method === '按热度' ? '按时间' : '按热度';
    this.commentsSort.sortTitle = method === '按热度' ? '热门评论' : '最新评论';
    this.commentsPaginationParams.num = 1;
    this.commentsPaginationParams.orderby = method === '按热度' ? 'integral' : 'create_time';
    let commentParams: any = {
      doc_url: this.$route.query.doc_url,
      p: this.commentsPaginationParams.num,
      orderby: this.commentsPaginationParams.orderby,
      pagesize: this.commentsPaginationParams.pagesize,
    };
    const commentResult = await CommentsModule.getComments({ params: commentParams });
    this.commentsMap = commentResult;
    this.commentsMap.newComments = commentResult.comments;
    this.commentSorting = false;
  }
  private async _getCommentsMore() {
    let commentParams: any = {
      doc_url: this.$route.query.doc_url,
      p: this.commentsPaginationParams.num,
      orderby: this.commentsPaginationParams.orderby,
      pagesize: this.commentsPaginationParams.pagesize,
    };
    try {
      const commentResult = await CommentsModule.getComments({ params: commentParams });
      if (!commentResult.comments.length) {
        this.load_more_no_data = '没有更多数据了';
        this.load_more_loading_lock = true;
        this.load_more_loading = false;
        return Promise.reject();
      } else {
        this.commentsMap.count = commentResult.count;
        this.commentsMap.join_count = commentResult.join_count;
        this.commentsMap.allow_comment = commentResult.allow_comment;
        this.commentsMap.comments = this.commentsMap.comments.concat(commentResult.comments);
        this.commentsMap.newComments = commentResult.comments;
      }
      return Promise.resolve(true);
    } catch (error) {
      console.log('err', error);
      return Promise.reject();
    }
  }
}
</script>

<style lang="scss" scoped>
@import './video.scss';
</style>
