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
              <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
              <span class="count" v-if="news.commentsall">{{ news.commentsall }}</span>
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
          <div class="more-hot" @click="handlerClickToutiaoHotSpotMore">
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
              <div class="bold">
                <q-icon name="grade" class="fs-20 text-red"></q-icon>
                {{ news.title }}
              </div>
              <div class="more" @click="handlerClickMustSeeMarqueeMore">
                <span>{{ news.link.title }}</span>
                <span class="iconfont icon-youjiantou"></span>
              </div>
            </div>
            <div class="bottom">
              <ul>
                <li class="item" v-for="(i, index2) in news.relation" :key="index2">
                  <div class="left">
                    <van-image class="thumbnail" :src="i.thumbnail" lazy-load radius="6" />
                    <div class="info">
                      <q-icon name="ondemand_video" class="fs-20 icon"></q-icon>
                      <p class="video-total-time" v-if="i.phvideo.length - i.phvideo.preview - i.phvideo.previewlength === i.phvideo.length">
                        {{ i.phvideo.length | getVideoTotalTime }}
                      </p>
                      <p class="video-total-time" v-else>
                        {{ (i.phvideo.length - i.phvideo.preview - i.phvideo.previewlength) | getVideoTotalTime }}
                      </p>
                    </div>
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
            <div class="top" @click="handlerClickQualityReadingMore">
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
                <div class="swiper-slide marquee-slide" style="width: 90%" v-for="(item, index) in news.marqueeList" :key="index">
                  <p class="title">{{ item.title }}</p>
                  <div class="bottom" v-if="item.source">
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
                <span @click="handlerClickUserPerferenceOtherSettings">其他设置</span>
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
                      <span class="text-red title-label" v-if="item.style.recomTag && news.style.recomTag.pos">{{ item.style.recomTag.text }}</span>
                      {{ item.title }}
                    </p>
                  </div>
                  <div class="right">
                    <van-image class="thumbnail" :src="item.thumbnail" lazy-load radius="6" />
                  </div>
                </div>
                <div class="bottom">
                  <span v-if="item.style.recomTag && item.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
                  <span v-if="item.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ item.style.recomTag.text }}</span>
                  <span class="source" v-if="item.source">{{ item.source }}</span>
                  <i class="iconfont icon-duanxin" v-if="item.commentsall"></i>
                  <span class="count" v-if="item.commentsall"> {{ item.commentsall }}</span>
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
            <div class="top" @click="handlerClickNews(news)">
              <div class="left">
                <p class="title">
                  <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.pos">{{ news.style.recomTag.text }}</span>
                  {{ news.title }}
                </p>
              </div>
              <div class="right">
                <van-image class="thumbnail" :src="news.thumbnail" lazy-load radius="6" />
              </div>
            </div>
            <div class="text-red topLabel" v-if="news.topLabel" @click="handlerClickToutiaoHotSpotMore">
              <span class="iconfont icon-hot text-red m-r-5"></span>{{ news.topLabel.desp }} <q-icon name="arrow_right" class="fs-16"></q-icon>
            </div>
            <div v-if="news.summary && news.summary.tag && news.summary.desp" class="hot-comment">
              <span class="label">{{ news.summary.tag }}</span>
              {{ news.summary.desp }}
            </div>
            <div class="vote" v-if="news.vote">
              <div v-for="(item, index) in news.vote.result" :key="index" class="question">
                <p class="title">{{ index + 1 }}. {{ item.resultArray.question }}</p>
                <ul>
                  <li v-for="(option, index) in item.resultArray.option" :key="index">
                    <div class="vote-result" v-if="news.vote.expire !== '1'" :style="`width:${option.nump}%`"></div>
                    <span class="text">{{ option.title }}</span>
                    <span class="vote-result-num">{{ `${option.nump}% (${option.num}人)` }}</span>
                  </li>
                </ul>
              </div>
              <p class="joinCount">
                {{ news.vote.joinCount | numberFormat }}人参与投票，当前{{ news.vote.expire === '1' ? '投票进行中' : '投票已结束' }}
              </p>
            </div>
            <div class="bottom">
              <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
              <span v-if="news.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ news.style.recomTag.text }}</span>
              <span class="source" v-if="news.source">{{ news.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
              <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
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
              <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.pos">{{ news.style.recomTag.text }}</span>
              {{ news.intro }}
            </div>
            <ul class="images" v-if="news.imageList && news.imageList.length">
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
            <div v-if="news.summary" class="hot-comment">
              <span class="label">{{ news.summary.tag }}</span>
              {{ news.summary.desp }}
            </div>
            <div class="no-action-bottom">
              <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
              <span v-if="news.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ news.style.recomTag.text }}</span>
              <span class="source" v-if="news.source">{{ news.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
              <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
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
              <span class="text-red title-label" v-if="news.style.recomTag && news.style.recomTag.pos">{{ news.style.recomTag.text }}</span>
              {{ news.intro ? news.intro : news.title }}
            </div>
            <div class="video-placeholder">
              <img v-if="news.seriesTag" src="https://x0.ifengimg.com/cmpp/2021/0401/ced142b6f5d6dc0size6_w144_h60.png" alt="" class="seriesTag" />
              <van-image :src="news.imageList[0].url" alt="" class="placeholder" radius="6" />
              <img src="~assets/play-video-button.png" alt="" class="play-video-button" />
              <p class="video-total-time">
                {{ news.phvideo.length | getVideoTotalTime }}
              </p>
            </div>
            <div class="text-red topLabel" v-if="news.topLabel" @click="handlerClickToutiaoHotSpotMore">
              <span class="iconfont icon-hot text-red"></span>
              {{ news.topLabel.desp }} <q-icon name="arrow_right" class="fs-16"></q-icon>
            </div>
            <div v-if="news.videoSeries" class="videoSeries">
              <q-icon name="video_library"></q-icon>
              {{ news.videoSeries.name }}
            </div>
            <div v-if="news.summary" class="hot-comment">
              <span class="label">{{ news.summary.tag }}</span>
              {{ news.summary.desp }}
            </div>
            <div v-if="!news.subscribe.logo || !news.subscribe.honorImg" class="no-action-bottom">
              <span v-if="news.style.recomTag && news.style.recomTag.text === '凤凰卫视'" class="label">凤凰卫视</span>
              <span v-if="news.style.recomTag && !news.style.recomTag.pos" class="label-blue">{{ news.style.recomTag.text }}</span>
              <span class="source" v-if="news.source">{{ news.source }}</span>
              <i class="iconfont icon-duanxin" v-if="news.commentsall"></i>
              <span class="count" v-if="news.commentsall"> {{ news.commentsall }}</span>
              <i class="iconfont icon-lishi" v-if="news.updateTime"></i>
              <span class="count" v-if="news.updateTime">{{ news.updateTime | getDateDiff }}</span>
            </div>
            <div v-if="news.subscribe.logo || news.subscribe.honorImg" class="action-bottom">
              <div class="like">
                <span class="iconfont icon-Group-"></span>
                <span class="count">{{ news.like ? news.like : '赞' }}</span>
              </div>
              <div class="comment">
                <span class="iconfont icon-duanxin"></span>
                <span class="count">{{ news.commentsall ? news.commentsall : '评论' }}</span>
              </div>
              <div class="share" @click="handlerClickPhvideoShare(news)">
                <span class="iconfont icon-fenxiang3"></span>
                <span class="count">{{ news.share ? news.share : '分享' }}</span>
              </div>
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
import { TabHomeModule } from 'src/store/modules/tab_home';
import { AppModule } from '@/store/modules/app';
import { TabHomeToutiaoModule } from 'src/store/modules/tab_home_toutiao';
import { ImagePreview } from 'vant';
import { Component, Vue } from 'vue-property-decorator';
import { toutiaoUserPreference } from './static/userPreference';
import { handlerQuasarShare } from 'src/utils/share';
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
    TabHomeModule.SET_activeTabIndex_single_loaded('toutiao');
  }
  public containerPositionY = 0;

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
  /*event*/
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
  private handlerClickMustSeeMarqueeMore() {
    this.$router.push('/tab_home_hot/1');
  }
  private handlerClickToutiaoHotSpotMore() {
    this.$router.push('/tab_home_hot/0');
  }
  private handlerClickQualityReadingMore() {
    this.$router.push('/tab_home_qualityReading');
  }
  private handlerClickPhvideoShare(news: any) {
    handlerQuasarShare('app', news);
  }
  private handlerClickUserPerferenceOtherSettings() {
    this.$router.push('/tab_home_user_perference?reload=true');
  }
  async onRefresh() {
    this.pagination_params.num = 1;
    await this._downCallback();
    this.refreshSuccessText =
      this.toutiaoData.length + this.toutiaoZhidingData.length
        ? `已为您推荐 ${this.toutiaoData.length + this.toutiaoZhidingData.length} 条新内容`
        : '已更新到最新';
    this.isDownRefresh = false;
  }
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['toutiao-container'].scrollHeight;
    let scrollTop = this.$refs['toutiao-container'].scrollTop;
    this.containerPositionY = scrollTop;
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
  private _initSwiper() {
    const that = this;
    setTimeout(() => {
      new window['Swiper']('.qualityReading-container', {
        slidesPerView: 'auto',
        spaceBetween: 10,
        on: {
          touchEnd: function (swiper: any, event: any) {
            if (swiper.changedTouches[0].pageX < 100 && this['realIndex'] === this['slides'].length - 1) {
              that.$router.push('/tab_home_qualityReading');
            }
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
  }
  private handlerClickNews(news: any) {
    // console.log(news)
    // this.$router.push(`/news_topic?topicid=${news.id}`);
  }
  // http
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
        this._initSwiper();
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
    this._initSwiper();
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