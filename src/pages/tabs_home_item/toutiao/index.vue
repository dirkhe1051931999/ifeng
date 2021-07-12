<template>
  <div class="toutiao-container" @scroll="monitorScrollEvent" ref="toutiao-container">
    <van-pull-refresh v-model="isDownRefresh" :success-text="refreshSuccessText" @refresh="onRefresh" :success-duration="1000">
      <!-- 骨架屏 -->
      <div v-if="firstLoadData">
        <div class="ph-item" v-for="n in 10" :key="n" style="border: 0; padding: 10px 0 10px; margin: 0">
          <div>
            <div class="ph-row">
              <div class="ph-col-12" style="border-radius: 0"></div>
              <div class="ph-col-2" style="border-radius: 0"></div>
              <div class="ph-col-10 empty"></div>
              <div class="ph-col-8" style="border-radius: 0"></div>
              <div class="ph-col-4 empty"></div>
            </div>
          </div>
          <div class="ph-col-2">
            <div class="ph-avatar" style="border-radius: 0"></div>
          </div>
        </div>
      </div>
      <ul class="news-list">
        <!-- 置顶新闻 -->
        <div class="top-wrap p-l-16 p-r-16 bg-white m-b-10">
          <li v-for="news in toutiaoZhidingData" :key="news.id" class="top">
            <p class="title">{{ news.title }}</p>
            <div>
              <span class="zhiding">置顶</span>
              <span class="source" v-if="news.source">{{ news.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.comments"></i>
              <span class="count" v-if="news.comments">{{ news.comments }}</span>
            </div>
          </li>
        </div>
        <!-- 轮播图 -->
        <div
          class="swiper-container bg-white toutiaoHotSpot-container"
          style="margin-bottom: 10px; height: 240px; padding-top: 10px; padding-bottom: 40px"
          v-if="toutiaoHotSpot.relation"
        >
          <div class="swiper-wrapper p-r-16" style="margin-left: 10px">
            <div class="swiper-slide toutiaoHotSpot-slide" v-for="(item, index) in toutiaoHotSpot.relation" :key="index" style="width: 90%">
              <p class="title">{{ item.title }}</p>
              <p class="dateDiff">{{ item.updateTime | getDateDiff }}</p>
              <van-image class="thumbnail" :src="item.thumbnail" lazy-load radius="6" />
            </div>
          </div>
          <div class="more-hot">
            查看更多热点
            <span class="iconfont icon-more1 more"></span>
          </div>
        </div>
        <!-- 其他新闻 -->
        <li
          v-for="news in toutiaoData"
          :key="news.id + Math.random().toString()"
          class="list"
          :class="[['qualityReading', 'marquee', 'videoshortlist'].includes(news.type) ? 'swipe-more-bg' : '']"
        >
          <!-- mustseemarquee -->
          <div v-if="news.type === 'mustseemarquee'" class="mustseemarquee">
            <div class="top">
              <span class="bold">
                <q-icon name="whatshot" class="fs-20 text-red"></q-icon>
                {{ news.title }}</span
              >
              <div class="more">
                <span>{{ news.link.title }}</span>
                <span class="iconfont icon-youjiantou"></span>
              </div>
            </div>
            <div class="bottom">
              <ul>
                <li class="item" v-for="(i, index2) in news.relation" :key="index2">
                  <div class="left">
                    <van-image class="thumbnail" :src="i.thumbnail" lazy-load radius="6" />
                    <q-icon name="article" class="fs-20 icon" v-if="i.type === 'doc'"></q-icon>
                    <q-icon name="ondemand_video" class="fs-20 icon" v-if="i.type === 'phvideo'"></q-icon>
                  </div>
                  <div class="right">
                    <div class="t dotdotdot2">{{ i.title }}</div>
                    <div class="b">
                      <div class="intro">
                        <div class="icon">
                          <q-icon name="auto_awesome" class="text-white"></q-icon>
                          必刷
                        </div>
                        {{ i.intro }}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!-- qualityReading -->
          <div class="qualityReading" v-if="news.type === 'qualityReading'">
            <div class="top">
              <span class="bold">
                <q-icon name="thumb_up_alt" class="fs-20 text-red"></q-icon>
                {{ news.title }}</span
              >
              <span class="iconfont icon-youjiantou"></span>
            </div>
            <div class="swiper-container qualityReading-container" style="height: 230px; padding-bottom: 20px">
              <div class="swiper-wrapper">
                <div class="swiper-slide qualityReading-slide" style="width: 90%" v-for="(item, index) in news.relation" :key="index">
                  <p class="title">{{ item.title }}</p>
                  <van-image class="thumbnail" :src="item.thumbnail" lazy-load radius="4" />
                </div>
                <span class="text-_6b6a6a fs-12 p-t-80">查看更多</span>
              </div>
            </div>
          </div>
          <!-- marquee -->
          <div class="marquee" v-if="news.type === 'marquee'">
            <div class="top">
              <span class="bold">
                <q-icon name="explore" class="fs-20 text-red"></q-icon>
                {{ news.title }}</span
              >
              <span class="iconfont icon-youjiantou"></span>
            </div>
            <div class="swiper-container marquee-container" style="height: 230px; padding-bottom: 20px">
              <div class="swiper-wrapper">
                <div class="swiper-slide marquee-slide" style="width: 90%" v-for="(item, index) in news.relation" :key="index">
                  <p class="title">{{ item.title }}</p>
                  <div class="bottom">
                    <span class="source">{{ item.source }}</span>
                    <span class="count"> {{ item.pv }} 阅</span>
                    <span>{{ item.updateTime | getDateDiff }}</span>
                  </div>
                  <van-image class="thumbnail" :src="item.thumbnail" lazy-load radius="4" />
                </div>
                <span class="text-_6b6a6a fs-12 p-t-80">查看更多</span>
              </div>
            </div>
          </div>
          <!-- videoshortlist -->
          <div class="videoshortlist" v-if="news.type === 'videoshortlist'">
            <div class="top">
              <span class="bold">
                <q-icon name="play_circle" class="fs-20 text-red"></q-icon>
                {{ news.title }}</span
              >
              <span class="iconfont icon-youjiantou"></span>
            </div>
            <div class="swiper-container videoshortlist-container" style="height: 230px; padding-bottom: 20px">
              <div class="swiper-wrapper" v-if="news.marqueeList">
                <div class="swiper-slide videoshortlist-slide" style="width: 130px" v-for="(item, index) in news.marqueeList" :key="index">
                  <p class="title">{{ item.title }}</p>
                  <div class="bottom">
                    <span class="playTimeStr">{{ item.phvideo.playTimeStr }}</span>
                    <i class="iconfont icon-Group-"></i>
                    <span class="praise"> {{ item.phvideo.praise }}</span>
                  </div>
                  <van-image class="thumbnail" :src="item.thumbnail" lazy-load radius="4" />
                </div>
                <span class="text-_6b6a6a fs-12 p-t-80">查看更多</span>
              </div>
            </div>
          </div>
          <!-- userPreference -->
          <div class="userPreference" v-if="news.type === 'userPreference'">
            <div class="top">
              <div class="left">{{ news.title }}</div>
              <div class="right">
                其他设置
                <span class="iconfont icon-close1 close fs-12">
                  <q-popup-proxy>
                    <q-card class="w-full backreason">
                      <p class="p-t-10 p-b-10 p-l-16 p-r-16 fs-14 text-_6b6a6a">选择原因，为您优化</p>
                      <ul class="p-l-16 p-r-16">
                        <li v-for="(item, index) in news.style.feedbackreason" :key="index" :class="index === 0 ? 'text-red' : ''">
                          <q-icon name="mood_bad" v-if="index === 0" class="fs-20" />
                          {{ item.title }}
                        </li>
                      </ul>
                      <q-expansion-item expand-separator :label="defaultbackreason.title" header-class="fs-14 text-_6b6a6a">
                        <ul class="p-l-16 p-r-16">
                          <li v-for="(item, index) in defaultbackreason.backreason" :key="index">{{ item.title }}</li>
                        </ul>
                      </q-expansion-item>
                    </q-card>
                  </q-popup-proxy>
                </span>
              </div>
            </div>
            <ul class="bottom">
              <li v-for="(item, index) in news.preference.option" :key="index" :class="item.itemId === '2' ? 'man' : 'woman'">
                <img src="~assets/man.png" alt="" v-if="item.itemId === '2'" />
                <img src="~assets/woman.png" alt="" v-else />
                {{ item.title }}
              </li>
            </ul>
          </div>
          <!-- topic2 -->
          <div v-if="news.type === 'topic2' && news.newslist" class="have-newList-topic2">
            <van-image class="thumbnail w-full" :src="news.advertmsg.adverPic" lazy-load :height="news.advertmsg.height" />
            <ul>
              <li v-for="(item, index) in news.newslist" :key="index">
                <div class="top">
                  <div class="left">
                    <p class="title">
                      <span class="text-red title-label" v-if="item.style.recomTag && item.style.recomTag.text === '热点'">热点</span>
                      <span class="text-red title-label" v-if="item.style.recomTag && item.style.recomTag.text === '专题'">专题</span>
                      {{ item.title }}
                    </p>
                  </div>
                  <div class="right">
                    <van-image class="thumbnail" :src="item.thumbnail" lazy-load radius="6" />
                  </div>
                </div>
                <div class="bottom">
                  <span v-if="item.style.recomTag && item.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
                  <span class="source" v-if="item.source">{{ item.source }}</span>
                  <i class="iconfont icon-duanxin" v-if="item.comments"></i>
                  <span class="count" v-if="item.comments"> {{ item.comments }}</span>
                  <i class="iconfont icon-lishi" v-if="item.updateTime"></i>
                  <span class="count" v-if="item.updateTime">{{ item.updateTime | getDateDiff }}</span>
                </div>
                <div v-if="item.summary" class="hot-comment">
                  <span class="label">{{ item.summary.tag }}</span>
                  {{ item.summary.desp }}
                </div>
              </li>
            </ul>
          </div>
          <!-- doc -->
          <div v-if="news.type === 'doc' || (news.type === 'topic2' && !news.newslist)" class="doc">
            <div class="top">
              <div class="left">
                <p class="title">
                  <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.text === '热点'">热点</span>
                  <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.text === '专题'">专题</span>
                  {{ news.title }}
                </p>
              </div>
              <div class="right">
                <van-image class="thumbnail" :src="news.thumbnail" lazy-load radius="6" />
              </div>
            </div>
            <div class="text-red topLevel" v-if="news.topLevel">凤凰热榜第5名 <q-icon name="arrow_right" class="fs-16"></q-icon></div>
            <div class="bottom">
              <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
              <span class="source" v-if="news.source">{{ news.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.comments"></i>
              <span class="count" v-if="news.comments"> {{ news.comments }}</span>
              <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
              <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
              <span class="iconfont icon-close1 close">
                <q-popup-proxy>
                  <q-card class="w-full backreason">
                    <p class="p-t-10 p-b-10 p-l-16 p-r-16 fs-14 text-_6b6a6a">选择原因，为您优化</p>
                    <ul class="p-l-16 p-r-16">
                      <li v-for="(item, index) in news.style.feedbackreason" :key="index" :class="index === 0 ? 'text-red' : ''">
                        <q-icon name="mood_bad" v-if="index === 0" class="fs-20" />
                        {{ item.title }}
                      </li>
                    </ul>
                    <q-expansion-item expand-separator :label="defaultbackreason.title" header-class="fs-14 text-_6b6a6a">
                      <ul class="p-l-16 p-r-16">
                        <li v-for="(item, index) in defaultbackreason.backreason" :key="index">{{ item.title }}</li>
                      </ul>
                    </q-expansion-item>
                  </q-card>
                </q-popup-proxy>
              </span>
            </div>
            <div v-if="news.summary" class="hot-comment">
              <span class="label">{{ news.summary.tag }}</span>
              {{ news.summary.desp }}
            </div>
            <div class="vote" v-if="news.vote">
              <div v-for="(item, index) in news.vote.result" :key="index" class="question">
                <p class="title">{{ index + 1 }}. {{ item.resultArray.question }}</p>
                <ul>
                  <li v-for="(option, index) in item.resultArray.option" :key="index">
                    {{ option.title }}
                  </li>
                </ul>
              </div>
              <p class="joinCount">
                {{ news.vote.joinCount | numberFormat }}人参与投票，当前{{ news.vote.expire === '1' ? '投票进行中' : '投票已结束' }}
              </p>
            </div>
          </div>
          <!-- picture -->
          <div v-if="news.type === 'short'" class="short w-full">
            <div class="top flex j-between a-top">
              <div class="left flex j-between a-center">
                <div class="l" v-if="news.subscribe.logo && news.subscribe.honorImg">
                  <img class="w-32 h-32 relative avatar" :src="news.subscribe.logo" />
                  <img :src="news.subscribe.honorImg" alt="" class="honor" />
                </div>
                <div class="l" v-else>
                  <img class="w-32 h-32 relative avatar" src="~assets/default-blogger-avatar.png" />
                </div>
                <div class="r">
                  <div class="t">{{ news.subscribe.catename }}</div>
                  <div class="b">{{ news.updateTime | getDateDiff }}</div>
                </div>
              </div>
              <div class="right">
                <span class="follow">关注</span>
                <span class="iconfont icon-close1 close">
                  <q-popup-proxy>
                    <q-card class="w-full backreason">
                      <p class="p-t-10 p-b-10 p-l-16 p-r-16 fs-14 text-_6b6a6a">选择原因，为您优化</p>
                      <ul class="p-l-16 p-r-16">
                        <li v-for="(item, index) in news.style.feedbackreason" :key="index" :class="index === 0 ? 'text-red' : ''">
                          <q-icon name="mood_bad" v-if="index === 0" class="fs-20" />
                          {{ item.title }}
                        </li>
                      </ul>
                      <q-expansion-item expand-separator :label="defaultbackreason.title" header-class="fs-14 text-_6b6a6a">
                        <ul class="p-l-16 p-r-16">
                          <li v-for="(item, index) in defaultbackreason.backreason" :key="index">{{ item.title }}</li>
                        </ul>
                      </q-expansion-item>
                    </q-card>
                  </q-popup-proxy>
                </span>
              </div>
            </div>
            <div class="intro p-b-10 fs-18" v-if="news.intro">
              <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.text === '热点'">热点</span>
              <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.text === '专题'">专题</span>{{ news.intro }}
            </div>
            <ul class="images" v-if="news.imageList.length">
              <van-image
                class="thumbnail relative"
                :style="news.imageList.length === 1 ? 'width: 50%;' : 'width: 32.5%;'"
                :src="item.url"
                lazy-load
                v-for="(item, index) in news.imageList"
                :key="index"
                fit="cover"
                v-show="index < 10"
                @click="previewImage(news.imageList, index)"
              />
            </ul>
            <div class="no-action-bottom">
              <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
              <span class="source" v-if="news.source">{{ news.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.comments"></i>
              <span class="count" v-if="news.comments"> {{ news.comments }}</span>
              <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
              <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
              <span class="iconfont icon-close1 close">
                <q-popup-proxy>
                  <q-card class="w-full backreason">
                    <p class="p-t-10 p-b-10 p-l-16 p-r-16 fs-14 text-_6b6a6a">选择原因，为您优化</p>
                    <ul class="p-l-16 p-r-16">
                      <li v-for="(item, index) in news.style.feedbackreason" :key="index" :class="index === 0 ? 'text-red' : ''">
                        <q-icon name="mood_bad" v-if="index === 0" class="fs-20" />
                        {{ item.title }}
                      </li>
                    </ul>
                    <q-expansion-item expand-separator :label="defaultbackreason.title" header-class="fs-14 text-_6b6a6a">
                      <ul class="p-l-16 p-r-16">
                        <li v-for="(item, index) in defaultbackreason.backreason" :key="index">{{ item.title }}</li>
                      </ul>
                    </q-expansion-item>
                  </q-card>
                </q-popup-proxy>
              </span>
            </div>
            <div v-if="news.summary" class="hot-comment">
              <span class="label">{{ news.summary.tag }}</span>
              {{ news.summary.desp }}
            </div>
          </div>
          <!-- video -->
          <div v-if="news.type === 'phvideo'" class="phvideo w-full">
            <div class="top flex j-between a-top">
              <div class="left flex j-between a-center">
                <div class="l" v-if="news.subscribe.logo && news.subscribe.honorImg">
                  <img class="w-32 h-32 relative avatar" :src="news.subscribe.logo" />
                  <img :src="news.subscribe.honorImg" alt="" class="honor" />
                </div>
                <div class="l" v-else>
                  <img class="w-32 h-32 relative avatar" src="~assets/default-blogger-avatar.png" />
                </div>
                <div class="r">
                  <div class="t">{{ news.subscribe.catename }}</div>
                  <div class="b">{{ news.updateTime | getDateDiff }}</div>
                </div>
              </div>
              <div class="right">
                <span class="follow">关注</span>
                <span class="iconfont icon-close1 close">
                  <q-popup-proxy>
                    <q-card class="w-full backreason">
                      <p class="p-t-10 p-b-10 p-l-16 p-r-16 fs-14 text-_6b6a6a">选择原因，为您优化</p>
                      <ul class="p-l-16 p-r-16">
                        <li v-for="(item, index) in news.style.feedbackreason" :key="index" :class="index === 0 ? 'text-red' : ''">
                          <q-icon name="mood_bad" v-if="index === 0" class="fs-20" />
                          {{ item.title }}
                        </li>
                      </ul>
                      <q-expansion-item expand-separator :label="defaultbackreason.title" header-class="fs-14 text-_6b6a6a">
                        <ul class="p-l-16 p-r-16">
                          <li v-for="(item, index) in defaultbackreason.backreason" :key="index">{{ item.title }}</li>
                        </ul>
                      </q-expansion-item>
                    </q-card>
                  </q-popup-proxy>
                </span>
              </div>
            </div>
            <div class="intro p-b-10 fs-18">
              <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.text === '热点'">热点</span>
              <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.text === '专题'">专题</span
              >{{ news.intro ? news.intro : news.title }}
            </div>
            <div class="video-placeholder">
              <img v-if="news.seriesTag" src="https://x0.ifengimg.com/cmpp/2021/0401/ced142b6f5d6dc0size6_w144_h60.png" alt="" class="seriesTag" />
              <van-image :src="news.imageList[0].url" alt="" class="placeholder" radius="6" />
              <img src="~assets/play-video-button.png" alt="" class="play-video-button" />
              <p
                class="video-total-time"
                v-if="(news.phvideo.length - news.phvideo.preview - news.phvideo.previewlength === news.phvideo.length) <= 0"
              >
                {{ news.phvideo.length | getVideoTotalTime }}
              </p>
              <p class="video-total-time" v-else>
                {{ (news.phvideo.length - news.phvideo.preview - news.phvideo.previewlength === news.phvideo.length) | getVideoTotalTime }}
              </p>
            </div>
            <div class="text-red topLevel" v-if="news.topLevel">凤凰热榜第5名 <q-icon name="arrow_right" class="fs-16"></q-icon></div>
            <div v-if="!news.subscribe.logo || !news.subscribe.honorImg" class="no-action-bottom">
              <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
              <span class="source" v-if="news.source">{{ news.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.comments"></i>
              <span class="count" v-if="news.comments"> {{ news.comments }}</span>
              <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
              <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
            </div>
            <div v-if="news.subscribe.logo || news.subscribe.honorImg" class="action-bottom">
              <div class="like">
                <span class="iconfont icon-Group-"></span>
                <span class="count">赞</span>
              </div>
              <div class="comment">
                <span class="iconfont icon-duanxin"></span>
                <span class="count">{{ news.commentsall ? news.commentsall : '评论' }}</span>
              </div>
              <div class="share">
                <span class="iconfont icon-fenxiang3"></span>
                <span class="count">分享</span>
              </div>
            </div>
            <div v-if="news.summary" class="hot-comment">
              <span class="label">{{ news.summary.tag }}</span>
              {{ news.summary.desp }}
            </div>
          </div>
        </li>
      </ul>
      <div class="load-more-loading" v-show="load_more_loading">
        <q-spinner color="#969799" size="20px" :thickness="2" />
        加载中...
      </div>
    </van-pull-refresh>
  </div>
</template>
<script lang="ts">
import { AppModule } from '@/store/modules/app';
import { Notify } from 'quasar';
import { TabHomeToutiaoModule } from 'src/store/modules/tab_home_toutiao';
import { ImagePreview } from 'vant';
import { Component, Vue } from 'vue-property-decorator';
import { toutiaoUserPreference } from './static/userPreference';
const mustseemarquee = {
  type: 'mustseemarquee',
  id: '9a8d1b12-e398-4403-89e0-048854349e0c',
  thumbnail: '',
  title: '凤凰必刷',
  documentId: '9a8d1b12-e398-4403-89e0-048854349e0c',
  staticId: 'must_see',
  style: {
    view: 'mustseemarquee',
    feedbackreason: [
      {
        title: '不感兴趣',
        value: '0_不感兴趣',
      },
    ],
    defaultreason: '0_不感兴趣',
  },
  link: {
    type: 'hotNewsRank',
    url: 'https://nine.ifeng.com/hotnewsrank?tab=mustseelist',
    title: '一键查看必刷榜',
  },
  reftype: 'ai||||insertRecom%23mustSeeMarquee|||',
  intro: '',
  recomToken: '12d9310cbade478d-477e8ad695bb4c80a328d9bbdb895bf7',
  payload: 'eyJkb2NpZCI6IjlhOGQxYjEyLWUzOTgtNDQwMy04OWUwLTA0ODg1NDM0OWUwYyJ9',
  relation: [
    {
      type: 'phvideo',
      thumbnail:
        'https://d.ifengimg.com/w224_h150_q100_webp/x0.ifengimg.com/ucms/2021_26/7172D1AA169DD5AA779FB373B933874F01801FD2_size12_w322_h181.jpg.webp',
      imageList: [
        {
          url: 'https://x0.ifengimg.com/ucms/2021_26/7172D1AA169DD5AA779FB373B933874F01801FD2_size12_w322_h181.jpg',
        },
      ],
      title: '朱德曲折的入党经历：被陈独秀婉拒后在德国经周恩来介绍入党',
      source: '我们一起走过',
      subscribe: {
        cateid: 1593706,
        catename: '我们一起走过',
        followid: 'weMedia_1593706',
        type: 'vampire',
        description: '凤凰卫视资讯台十周年特别节目',
        originalName: '',
        cateSource: '',
        forbidFollow: '0',
        forbidJump: '0',
        link: {
          type: 'phtvmedia',
          url: '1593706',
        },
      },
      updateTime: '2021/06/25 17:48:50',
      documentId: '87L7MLF3B7k',
      staticId: 'video_87L7MLF3B7k',
      style: {
        view: 'mustsee',
        recomTag: {
          border: '1',
          borderColor: '#80F54343',
          borderNightColor: '#80D33939',
          fontColor: '#FFF54343',
          fontNightColor: '#FFD33939',
          text: '凤凰卫视',
        },
        feedbackreason: [
          {
            title: '不感兴趣',
            value: '0_不感兴趣',
          },
          {
            title: '我们一起走过',
            value: '0_来源：我们一起走过',
          },
        ],
        defaultreason: '0_不感兴趣',
      },
      commentsUrl: 'ucms_87L7MLF3B7k',
      link: {
        type: 'videoSeries',
        url: '87L7MLF3B7k',
        weburl: 'https://ishare.ifeng.com/c/s/v006FSwCqWWvzeqoxS6KxMdG--vVOpa3da--cWYMfzCJSnku05vqXenodn2Ukqd4JuZfYh?spss=np',
        previewurl: 'https://video19.ifeng.com/video09/2021/07/06/p6817988900305248567-102-094456.mp4',
        backendStaticId: 'video_87L7MLF3B7k',
        staticId: 'video_87L7MLF3B7k',
        ext: {
          crowdId: '6815470631153312188',
        },
      },
      seriesTag: {
        img: 'https://x0.ifengimg.com/cmpp/2021/0401/ced142b6f5d6dc0size6_w144_h60.png',
        text: '',
        width: 48,
        height: 20,
      },
      reftype: 'ai|video_87L7MLF3B7k|||insertRecom%23mustSeeMarquee||%E5%8E%86%E5%8F%B2-%E4%B8%AD%E5%9B%BD%E8%BF%91%E4%BB%A3%E5%8F%B2|',
      intro: '凤凰优质纪录片挖宝',
      statisticTag: '',
      phvideo: {
        channelName: '我们一起走过',
        columnid: '1593706',
        path: '27-95119-',
        filesize: '38299',
        aspect: '360:203',
        length: 200,
        previewlength: 26,
        preview: 1,
        currentPlay: 0,
        completePlay: '0',
        videoPlayUrl: 'https://video19.ifeng.com/video09/2021/06/24/p6813769395429450385-102-8-183832.mp4',
      },
      videofull: {
        tag: '完整版',
        desp: '凤凰独家｜勤工俭学运动影响了多少革命者？寻访中共先驱法德足迹',
        link: {
          type: 'phvideo',
          url: '87L8KF8hrJU',
          weburl: 'https://ishare.ifeng.com/c/s/v006bfWeLdvpcl95sI--zZSHLsqsfbROxfT22khJ8A6Q0xh9745yrJ1ZY76REYgE-_y8VM?spss=np',
          openType: '1',
          backendStaticId: 'video_87L8KF8hrJU',
          staticId: 'video_87L8KF8hrJU',
          queryString: 'secret=v006bfWeLdvpcl95sI--zZSHLsqsfbROxfT22khJ8A6Q0xh9745yrJ1ZY76REYgE-_y8VM',
        },
        staticId: 'video_87L8KF8hrJU',
        videoThumbnail:
          'https://d.ifengimg.com/w224_h150_q100_webp/x0.ifengimg.com/ucms/2021_26/E0D92823C621A1CFE157168810F4DEE9B54C444F_size43_w640_h360.jpg.webp',
        fullScreenLogo: 'https://x0.ifengimg.com/ucms/2020_42/1B6F0C08F28E7429BF050EC3BEB3284D1305011E_w48_h36.png',
        fullScreenText: '观看完整版',
      },
      shareInfo: {
        weburl: 'https://ishare.ifeng.com/c/s/v006FSwCqWWvzeqoxS6KxMdG--vVOpa3da--cWYMfzCJSnku05vqXenodn2Ukqd4JuZfYh?spss=np',
        wechatMiniProgram: 'pages/new/new?aid=87L7MLF3B7k&types=phvideo',
        qqMiniProgram: 'pages/new/new?aid=87L7MLF3B7k',
      },
    },
    {
      type: 'phvideo',
      thumbnail:
        'https://d.ifengimg.com/w224_h150_q100_webp/x0.ifengimg.com/ucms/2021_25/E18193EA3C23552B34163DDE27362027C871FBED_size46_w609_h342.jpg.webp',
      imageList: [
        {
          url: 'https://x0.ifengimg.com/ucms/2021_25/E18193EA3C23552B34163DDE27362027C871FBED_size46_w609_h342.jpg',
        },
      ],
      title: '皇牌大放送|金蝉之变——蒋经国在台的变政之路',
      source: '皇牌大放送｜纪录片',
      subscribe: {
        cateid: 92,
        catename: '皇牌大放送｜纪录片',
        followid: 'weMedia_92',
        type: 'vampire',
        description: '凤凰独家节目，社会文史类纪录片',
        originalName: '',
        cateSource: '',
        forbidFollow: '0',
        forbidJump: '0',
        link: {
          type: 'phtvmedia',
          url: '92',
        },
      },
      updateTime: '2015/07/25 21:40:00',
      documentId: '873rRqD0qDx',
      staticId: 'video_873rRqD0qDx',
      style: {
        view: 'mustsee',
        feedbackreason: [
          {
            title: '不感兴趣',
            value: '0_不感兴趣',
          },
          {
            title: '皇牌大放送｜纪录片',
            value: '0_来源：皇牌大放送｜纪录片',
          },
        ],
        defaultreason: '0_不感兴趣',
      },
      commentsUrl: 'ucms_873rRqD0qDx',
      link: {
        type: 'phvideo',
        url: '873rRqD0qDx',
        weburl: 'https://ishare.ifeng.com/c/s/v006QlAvqTj5rXFrw0yjaaNFOJorv95SRBPvWxwdMI5DDFpOthqs9cPz7JR46h4mH5c5?spss=np',
        openType: '1',
        backendStaticId: 'video_873rRqD0qDx',
        staticId: 'video_873rRqD0qDx',
        queryString: 'secret=v006QlAvqTj5rXFrw0yjaaNFOJorv95SRBPvWxwdMI5DDFpOthqs9cPz7JR46h4mH5c5',
      },
      reftype:
        'ai|video_873rRqD0qDx|||insertRecom%23mustSeeMarquee||%E7%BA%AA%E5%BD%95%E7%89%87-%E5%8E%86%E5%8F%B2|%7B%22flatResults%22%3A%5B%22%E7%9A%87%E7%89%8C%E5%A4%A7%E6%94%BE%E9%80%81%22%2C%22%E7%A4%BE%E4%BC%9A%E7%BA%AA%E5%AE%9E%E7%89%87%22%5D%7D',
      intro: '你所不知道的历史',
      statisticTag: '',
      phvideo: {
        channelName: '皇牌大放送｜纪录片',
        columnid: '92',
        path: '27-95119-95121-',
        filesize: '610733',
        aspect: '16:9',
        length: 4321,
        previewlength: 0,
        preview: 0,
        currentPlay: 0,
        completePlay: '0',
        videoPlayUrl: 'https://video19.ifeng.com/video09/2021/06/14/p6810010703907267378-102-8-094614.mp4',
      },
      shareInfo: {
        weburl: 'https://ishare.ifeng.com/c/s/v006QlAvqTj5rXFrw0yjaaNFOJorv95SRBPvWxwdMI5DDFpOthqs9cPz7JR46h4mH5c5?spss=np',
        wechatMiniProgram: 'pages/new/new?aid=873rRqD0qDx&types=phvideo',
        qqMiniProgram: 'pages/new/new?aid=873rRqD0qDx',
      },
    },
    {
      type: 'phvideo',
      thumbnail:
        'https://d.ifengimg.com/w224_h150_q100_webp/x0.ifengimg.com/ucms/2021_24/0737CB76C1613FFC31920723198F56B081CB220F_size38_w640_h360.jpg.webp',
      imageList: [
        {
          url: 'https://x0.ifengimg.com/ucms/2021_24/0737CB76C1613FFC31920723198F56B081CB220F_size38_w640_h360.jpg',
        },
      ],
      title: '凤凰大视野|向光而行-两岸密使往事',
      source: '凤凰大视野｜纪录片',
      subscribe: {
        cateid: 1551434,
        catename: '凤凰大视野｜纪录片',
        followid: 'weMedia_1551434',
        type: 'vampire',
        description: '聚焦一个主题，一连五天讲述历史',
        originalName: '',
        cateSource: '',
        forbidFollow: '0',
        forbidJump: '0',
        link: {
          type: 'phtvmedia',
          url: '1551434',
        },
      },
      updateTime: '2021/06/08 21:40:46',
      documentId: '86wAWhkT9mG',
      staticId: 'video_86wAWhkT9mG',
      style: {
        view: 'mustsee',
        feedbackreason: [
          {
            title: '不感兴趣',
            value: '0_不感兴趣',
          },
          {
            title: '凤凰大视野｜纪录片',
            value: '0_来源：凤凰大视野｜纪录片',
          },
        ],
        defaultreason: '0_不感兴趣',
      },
      commentsUrl: 'ucms_86wAWhkT9mG',
      comments: '2',
      commentsall: '10',
      link: {
        type: 'phvideo',
        url: '86wAWhkT9mG',
        weburl: 'https://ishare.ifeng.com/c/s/v0069C-_a-_vhtC93zJCVUhDIYWYpe3Ls3wkSbiQ0IxxScLDAjELoC--mV-_-_hohDtuU9s-_a?spss=np',
        openType: '1',
        backendStaticId: 'video_86wAWhkT9mG',
        staticId: 'video_86wAWhkT9mG',
        queryString: 'secret=v0069C-_a-_vhtC93zJCVUhDIYWYpe3Ls3wkSbiQ0IxxScLDAjELoC--mV-_-_hohDtuU9s-_a',
      },
      reftype:
        'ai|video_86wAWhkT9mG|||insertRecom%23mustSeeMarquee||%E7%BA%AA%E5%BD%95%E7%89%87-%E5%8E%86%E5%8F%B2|%7B%22flatResults%22%3A%5B%22%E5%87%A4%E5%87%B0%E5%A4%A7%E8%A7%86%E9%87%8E%22%2C%22%E7%BA%AA%E5%BD%95%E7%89%87%22%5D%7D',
      intro: '历史中真实存在的“叛逆者”',
      statisticTag: '',
      phvideo: {
        channelName: '凤凰大视野｜纪录片',
        columnid: '1551434',
        path: '27-95119-95121-',
        filesize: '336650',
        aspect: '360:203',
        length: 1755,
        previewlength: 0,
        preview: 0,
        currentPlay: 0,
        completePlay: '0',
        videoPlayUrl: 'https://video19.ifeng.com/video09/2021/06/09/p6808328165522412440-102-8-175636.mp4',
      },
      shareInfo: {
        weburl: 'https://ishare.ifeng.com/c/s/v0069C-_a-_vhtC93zJCVUhDIYWYpe3Ls3wkSbiQ0IxxScLDAjELoC--mV-_-_hohDtuU9s-_a?spss=np',
        wechatMiniProgram: 'pages/new/new?aid=86wAWhkT9mG&types=phvideo',
        qqMiniProgram: 'pages/new/new?aid=86wAWhkT9mG',
      },
    },
  ],
  statisticTag: '',
};
@Component({
  name: 'tabs_home_item_toutiao',
})
export default class extends Vue {
  $refs: any;
  get defaultbackreason() {
    const result: any = AppModule.config_backreason;
    if (result) return result['defaultbackreason'];
    else return [];
  }
  async created() {
    await this._downCallback();
    this.firstLoadData = false;
  }
  private firstLoadData = true;
  /*--数据--*/
  // doc,plvideo,short
  private toutiaoData: any[] = [];
  // 置顶
  private toutiaoZhidingData: any[] = [];
  // 热点轮播
  private toutiaoHotSpot = {};
  // 下拉刷新，上拉加载的数据
  private isDownRefresh = false;
  private refreshSuccessText = '';
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private pagination_params = {
    size: 10,
    num: 1,
  };
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
  async onRefresh() {
    await this._downCallback();
    this.refreshSuccessText = `已为您推荐 ${this.toutiaoData.length + this.toutiaoZhidingData.length} 条新内容`;
    this.isDownRefresh = false;
  }
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['toutiao-container'].scrollHeight;
    const scrollTop = this.$refs['toutiao-container'].scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight - AppModule.bottomNavigationAndHomeHeaderHeight >= scrollHeight) {
      if (!this.load_more_loading_lock) {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.pagination_params.num++;
        await this._upCallback();
        this.load_more_loading_lock = false;
      }
    }
  }
  private async _downCallback() {
    try {
      let params: any = {
        ch: 'sy',
        cache: 'no',
        action: 'down',
        pullNum: this.pagination_params.num,
        pullTotal: '1',
        dailyOpenNum: '1',
        autoPlay: '1',
      };
      if (this.firstLoadData) {
        console.log('loading');
        params.action = 'default';
        params = { ch: 'sy', cache: 'no', action: 'default', pullTotal: '1', dailyOpenNum: '1', autoPlay: '1' };
      }
      const result = await TabHomeToutiaoModule.getHeadline(params);
      // hotspot
      if (result[0].item[0].type === 'hotspot') {
        this.toutiaoHotSpot = result[0].item[0];
      } else {
        this.toutiaoHotSpot = {};
      }
      // 头条
      const noAdToutiaoData = [];
      for (let item of result[0].item) {
        if (item.type !== 'advert' && item.type !== 'hotspot') {
          noAdToutiaoData.push(item);
        }
      }
      this.toutiaoData = noAdToutiaoData;
      this.toutiaoData.unshift(toutiaoUserPreference);
      this.toutiaoData.unshift(mustseemarquee);
      // 置顶
      this.toutiaoZhidingData = result[1].item;
      this.$nextTick(() => {
        // init 轮播图
        if (this.firstLoadData) {
          new window['Swiper']('.toutiaoHotSpot-container', {
            slidesPerView: 'auto',
            spaceBetween: 10,
          });

          console.log('ok');
        }
        setTimeout(() => {
          new window['Swiper']('.qualityReading-container', {
            slidesPerView: 'auto',
            spaceBetween: 10,
            on: {
              touchEnd: function (swiper: any, event: any) {
                console.log('qualityReading');
              },
            },
          });
          new window['Swiper']('.marquee-container', {
            slidesPerView: 'auto',
            spaceBetween: 10,
            on: {
              touchEnd: function (swiper: any, event: any) {
                console.log('marquee');
              },
            },
          });
          new window['Swiper']('.videoshortlist-container', {
            slidesPerView: 'auto',
            spaceBetween: 10,
            on: {
              touchEnd: function (swiper: any, event: any) {
                console.log('videoshortlist');
              },
            },
          });
        }, 300);
        return Promise.resolve(true);
      });
    } catch (error) {
      console.log('err');
    }
  }
  private async _upCallback() {
    const result = await TabHomeToutiaoModule.getHeadline({
      ch: 'sy',
      cache: 'no',
      action: 'up',
      pullNum: this.pagination_params.num,
      dailyOpenNum: '1',
    });
    const arr = [];
    for (let item of result[0].item) {
      if (item.type !== 'advert') {
        arr.push(item);
      }
    }
    this.toutiaoData = this.toutiaoData.concat(arr);
    return Promise.resolve(true);
  }
}
</script>
<style lang="scss">
@import './style/_global.scss';
</style>
<style lang="scss" scoped>
@import './style/index.scss';
.toutiao-container {
  overflow: scroll;
  height: 100%;
  .news-list {
    .list {
      padding: 12px 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background: $white;
      border-bottom: solid 1px #eeeeee;
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .load-more-loading {
    width: 100%;
    height: 50px;
    color: #969799;
    font-size: 14px;
    line-height: 50px;
    text-align: center;
  }
}
</style>