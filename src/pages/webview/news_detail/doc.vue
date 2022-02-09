<template>
  <div class="news-detail-doc-container">
    <div class="loading-page" v-if="!pageLoaded">
      <div class="p-t-30">
        <q-spinner color="primary" size="22px" :thickness="2" class="m-r-10" />
        努力加载中...
      </div>
    </div>
    <div class="nav">
      <q-icon class="back" name="arrow_back_ios" @click="$router.back()"></q-icon>
      <div class="author" v-if="pageLoaded" v-show="activeShow">
        <div class="l">
          {{ news_details.subscribe ? news_details.subscribe.catename : '未知' }}
        </div>
        <div class="r" v-if="news_details.subscribe.logo">关注</div>
      </div>
      <q-icon class="more" name="more_horiz" v-if="pageLoaded" @click="toShare"></q-icon>
    </div>
    <div class="news-detail-doc-wrap" ref="news-detail-doc-wrap" @scroll="monitorScrollEvent" v-if="pageLoaded">
      <div class="news-header">
        <div class="news-title" ref="news-title">{{ news_details.title }}</div>
        <div class="news-author" ref="news-author">
          <div class="l">
            <div class="ll">
              <img :src="news_details.subscribe.logo" alt="" v-if="news_details.subscribe.logo" />
            </div>
            <div class="rr">
              <div class="t">
                {{ news_details.subscribe ? news_details.subscribe.catename : '未知' }}
              </div>
              <div class="b">
                {{ news_details.editTime }}
              </div>
            </div>
          </div>
          <div class="r" v-if="news_details.subscribe.logo">关注</div>
        </div>
      </div>
      <div class="news-link">
        <div class="topbanner" v-if="news_details.topbanner" @click="handleClickNewsDetailTheme(news_details.topbanner)">
          <div class="t">
            <div class="ll">
              {{ news_details.topbanner.source }}
            </div>
            <div class="rr">{{ news_details.topbanner.follow | numberFormat }}关注</div>
          </div>
          <div class="b">
            <div class="l">
              <img :src="news_details.topbanner.thumbnail" alt="" />
            </div>
            <div class="r">
              <div class="tt">{{ news_details.topbanner.title }}</div>
              <div class="bb dotdotdot2">{{ news_details.topbanner.desc }}</div>
            </div>
          </div>
        </div>
      </div>
      <InlineVideo
        :src="news_details.videos[0].video['Normal'].src"
        :poster="news_details.videos[0].thumbnail"
        v-if="news_details.videos && news_details.videos[0] && news_details.videos[0]"
      ></InlineVideo>
      <div class="news-content" v-html="news_details.text" ref="news-content" @click="clickRichText($event)"></div>
      <div class="news-others">
        <div class="editRecommend" v-if="news_details.editRecommend && news_details.editRecommend.item">
          <div class="title" @click="handleClickNewsDetailTheme(news_details.editRecommend)">
            <div class="l">
              <div class="ll">{{ news_details.editRecommend.icon }}</div>
              <div class="rr">{{ news_details.editRecommend.title }}</div>
            </div>
            <div class="r">
              <q-icon name="arrow_forward_ios" class="fs-16"></q-icon>
            </div>
          </div>
          <ul>
            <li v-for="(item, index) in news_details.editRecommend.item" :key="index" @click="handlerClickNewsItem(item)">
              <div class="l">
                <div class="t dotdotdot2">{{ item.title }}</div>
                <div class="b">
                  <div class="ll">{{ item.subscribe.catename }}</div>
                  <div class="rr" v-if="item.commentsall">{{ item.commentsall }} 评</div>
                </div>
              </div>
              <div class="r">
                <img :src="item.thumbnail" alt="" srcset="" />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="news-share">
        <div class="like">
          <q-icon name="favorite" class="fs-28 hide" color="red"></q-icon>
          <q-icon name="favorite_border" class="fs-28"></q-icon>
          <span class="m-l-5">{{ news_details.like_num }}</span>
        </div>
        <div class="wechat">
          <img src="~assets/meiti/wechat.png" alt="" srcset="" />
        </div>
        <div class="pyq">
          <img src="~assets/meiti/pyq.png" alt="" srcset="" />
        </div>
      </div>
      <div class="news-comment">
        <div class="title">评论</div>
        <div class="sort-wrap">
          <div class="l">
            {{ commentsSort.sortTitle }}
          </div>
          <div class="r" @click="handlerClickCommentsSort(commentsSort.sortMethod)">
            <q-icon name="sort" class="icon"></q-icon>
            <span class="method"> {{ commentsSort.sortMethod }}</span>
            <q-spinner color="#afafaf" size="12px" :thickness="2" class="m-l-10" v-show="commentSorting" />
          </div>
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
                <div
                  class="more"
                  @click="handlerClickComentsChildMore(father)"
                  v-if="father.children.comments.length < Number(father.children.count)"
                >
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
        <i class="iconfont icon-duanxin"></i>
      </div>
      <div class="share">
        <i class="iconfont icon-fenxiang3"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { NewsDetailsModule } from '@/store/modules/news_details';
import { CommentsModule } from '@/store/modules/comment';
import { findStrImgSrc, getUrlParams, json2Url } from '@/utils';
import { ImagePreview } from 'vant';
import InlineVideo from '@/components/inlineVideo/index.vue';
import { handlerQuasarShare } from '@/utils/share';
@Component({
  name: 'news-detail-doc',
  components: {
    InlineVideo,
  },
})
export default class extends Vue {
  $refs: any;
  @Watch('$route')
  onchange(to: any, from: any) {
    if (to.path === '/news_detail/doc') {
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
  async mounted() {
    await this.getNewsDetail(this.$route.query);
    this.pageLoaded = true;
    await this.$nextTick(() => {
      this.$refs['news-detail-doc-wrap'].style['height'] = window.innerHeight - 46 - 38 + 'px';
      this.$dom = this.$refs['news-detail-doc-wrap'];
    });
  }
  private $dom: any;
  private containerPositionY = 0;
  private activeShow = false;
  private pageLoaded = false;
  private imgViewsList: any[] = [];
  private news_details = {};
  private commentResult = {};
  // 评论排序，分页相关
  private commentsPaginationParams = {
    num: 1,
    orderby: 'integral',
    pagesize: '10',
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
  };
  private commentsChildrenMoreList: any[] = [];
  private commentsOwnerMap: any = {};
  private commentSorting = false;
  private load_more_loading_lock = false;
  private load_more_loading = false;
  private load_more_no_data = '';
  private showCommentsChildrenMore = false;
  private commentsChildrenMoreLoading = false;
  /**event */
  private previewImage(images: any, index: number) {
    ImagePreview({
      images: images,
      startPosition: index,
      closeable: true,
    });
  }
  private clickRichText(e: any) {
    this.openPreviewImage(e);
  }
  private openPreviewImage(e: any) {
    const children = e.target.children;
    if (children.length && children[0] && children[0].nodeName.toLocaleLowerCase() === 'img') {
      const index = this.imgViewsList.indexOf(children[0].src);
      this.previewImage(this.imgViewsList, index);
    }
    if (
      children.length &&
      children[0] &&
      children[0].children &&
      children[0].children[0] &&
      children[0].children[0].nodeName.toLocaleLowerCase() === 'img'
    ) {
      const index = this.imgViewsList.indexOf(children[0].children[0].src);
      this.previewImage(this.imgViewsList, index);
    }
  }
  private toShare() {
    handlerQuasarShare('app', {});
  }
  private handleClickNewsDetailTheme(item: any) {
    if (item.link.url && (item.type === 'topic3' || item.type === 'hotevent')) {
      const params = getUrlParams(item.link.url);
      const str = json2Url(params);
      this.$router.push(`/news_theme?${str}`);
    }
  }
  private handlerClickNewsItem(news: any) {
    if (news.type === 'doc') {
      const params = getUrlParams(news.link.url);
      const urlStr = json2Url(params);
      switch (news.type) {
        case 'doc':
          this.$router.push('/news_detail/doc?' + urlStr);
          break;
        default:
          break;
      }
    }
  }
  private async monitorScrollEvent() {
    const scrollTop = this.$dom.scrollTop;
    if (scrollTop >= this.$refs['news-title'].clientHeight + this.$refs['news-author'].clientHeight) {
      this.activeShow = true;
    } else {
      this.activeShow = false;
    }
    this.containerPositionY = scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - 46 - 38 >= this.$dom.scrollHeight) {
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
      doc_url: params.aid,
      p: this.commentsPaginationParams.num,
      orderby: this.commentsPaginationParams.orderby,
      pagesize: this.commentsPaginationParams.pagesize,
    };
    const { body, meta } = await NewsDetailsModule.getNewsDetails({ params });
    let commentResult = await CommentsModule.getComments({ params: commentParams });
    if (body.editRecommend && body.editRecommend.item && body.editRecommend.item.length) {
      body.editRecommend.item = body.editRecommend.item.slice(0, 4);
    }
    this.news_details = body;
    this.imgViewsList = findStrImgSrc(body.text);
    this.commentsMap = commentResult;
    return Promise.resolve();
  }
  private handlerClickComentsChildMore(news: any) {
    this.commentsOwnerMap = {};
    this.commentsChildrenMoreList = [];
    this.commentsChildrenMoreLoading = true;
    this.showCommentsChildrenMore = true;
    this.$nextTick(async () => {
      this.$refs['comment-children-more'].style['height'] = this.$refs['van-popup-for-comments-children'].$el.clientHeight - 46 + 'px';
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
      doc_url: this.$route.query.aid,
      p: this.commentsPaginationParams.num,
      orderby: this.commentsPaginationParams.orderby,
      pagesize: this.commentsPaginationParams.pagesize,
    };
    const commentResult = await CommentsModule.getComments({ params: commentParams });
    this.commentsMap = commentResult;
    this.commentSorting = false;
  }
  private async _getCommentsMore() {
    let commentParams: any = {
      doc_url: this.$route.query.aid,
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
      }
      return Promise.resolve(true);
    } catch (error) {
      console.log('err', error);
      return Promise.reject();
    }
  }
}
</script>

<style lang="scss">
@import './common.scss';
</style>
<style lang="scss" scoped>
@import './doc.scss';
</style>