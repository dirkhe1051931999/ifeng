<template>
  <div class="tab_yinpin_child_play" v-if="pageLoaded">
    <div class="back">
      <q-icon name="arrow_back_ios_new" @click="$router.back()" class="arrow"></q-icon>
      <span>听音频，来凤凰新闻</span>
    </div>
    <div class="top">
      <img :src="currentPlayItem.cover_url" alt="" />
      <p class="p-t-20 fs-22 bold" ref="title">{{ currentPlayItem.title }}</p>
      <p class="p-t-10 fs-14 text-gray">来源：喜马拉雅APP</p>
    </div>
    <div class="middle">
      <audio-player
        ref="audioPlayer"
        :audio-list="playPageList.map((elm) => elm.link.url)"
        :before-play="handleBeforePlay"
        theme-color="#F54343"
        :show-volume-button="false"
        :show-playback-rate="false"
      />
    </div>
    <div class="bottom">
      <span @click="showPlayPageList = true">播放列表</span>
      <q-icon name="reorder" class="icon" @click="showPlayPageList = true"></q-icon>
    </div>
    <van-popup v-model="showPlayPageList" position="bottom" :style="{ height: '80%' }">
      <div class="playPageList" style="height: 100%">
        <li v-for="(item, index) in playPageList" :key="index" @click="handleClickItem(item, index)">
          <div class="l">{{ index + 1 }}</div>
          <div class="r">
            <div class="t" :class="item.link.tid === currentPlayItem.link.tid ? 'text-red' : ''">
              {{ item.title }}
              <q-icon name="play_circle_filled" class="text-red" v-if="item.link.tid === currentPlayItem.link.tid"></q-icon>
            </div>
            <div class="b">
              <div class="play">
                <q-icon name="play_arrow" class="fs-16 m-r-5"></q-icon>
                <span>{{ item.playTimeStr }}</span>
              </div>
              <div class="episodes">
                <q-icon name="query_builder" class="fs-16 m-r-5"></q-icon>
                <span>{{ item.link.duration | getVideoTotalTime }}</span>
              </div>
            </div>
          </div>
        </li>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { TabHomeYinpinModule } from '@/store/modules/tab_home_yinpin';
import { Component, Vue } from 'vue-property-decorator';
import AudioPlayer from '@liripeng/vue-audio-player';
import '@liripeng/vue-audio-player/lib/vue-audio-player.css';
@Component({
  name: 'tab_yinpin_child_play',
  components: {
    AudioPlayer,
  },
})
export default class extends Vue {
  $refs: any;
  get playPageList() {
    // return TabHomeYinpinModule.playPageList;
    return TabHomeYinpinModule.playPageList.length
      ? TabHomeYinpinModule.playPageList
      : [
          {
            type: 'audio',
            id: '464918160',
            cover_url: 'http://imgopen.xmcdn.com/storages/da2c-audiofreehighqps/12/92/CKwRIJIFSO22AABdQwDvV5-L.jpg!op_type=3&columns=640&rows=640',
            title: '如斯说金瓶梅（第十五回）',
            order_num: 1,
            documentId: '464918160',
            staticId: 'audio_464918160',
            style: {
              view: 'audiolist',
            },
            link: {
              aid: '43714222',
              tid: '464918160',
              type: 'audioplay',
              duration: 2243,
              url: 'https://openaudio.ali.xmcdn.com/sv/1347e3ed-17cb8badea7/1347e3ed-17cb8badea7.mp3',
            },
            playTimeStr: '1016',
          },
        ];
  }
  created() {
    this.lastPage = this.$route.query.lastPage;
    const tid = this.$route.query.tid;
    // const index = this.playPageList.findIndex((item: any) => {
    //   return item.link.tid === tid || item.link.tid === '464918160';
    // });
    // this.currentPlayIndex = index;
    // this.currentPlayItem = this.playPageList[index];
    this.currentPlayIndex = 0;
    this.currentPlayItem = this.playPageList[0];
    this.pageLoaded = true;
  }
  private lastPage: any = 1;
  private currentPlayIndex: any = 0;
  private currentPlayItem: any;
  private pageLoaded = false;
  private showPlayPageList = false;
  /*event */
  private handleBeforePlay(next: Function) {
    this.$set(this, 'currentPlayIndex', this.$refs.audioPlayer.currentPlayIndex);
    this.$set(this, 'currentPlayItem', this.playPageList[this.$refs.audioPlayer.currentPlayIndex]);
    this.$refs.title.innerHTML = this.currentPlayItem.title;
    next();
  }
  private handleClickItem(item: any, index: number) {
    if (item.link.tid === this.currentPlayItem.link.tid) return;
    // this.$set(this, 'currentPlayIndex', index);
    // this.$set(this, 'currentPlayItem', this.playPageList[index]);
    // this.$refs.title.innerHTML = this.currentPlayItem.title;
    // this.showPlayPageList = false;
    // if (index > this.$refs.audioPlayer.currentPlayIndex) {
    //   for (var i = 0; i < index - this.$refs.audioPlayer.currentPlayIndex; i++) {
    //     this.$refs.audioPlayer.pause();
    //     setTimeout(() => {
    //       this.$refs.audioPlayer.playNext();
    //     });
    //   }
    // } else {
    //   for (var i = 0; i < this.$refs.audioPlayer.currentPlayIndex - index; i++) {
    //     this.$refs.audioPlayer.pause();
    //     setTimeout(() => {
    //       this.$refs.audioPlayer.playPrev();
    //     });
    //   }
    // }
  }
}
</script>

<style lang="scss">
.audio__progress-point {
  box-shadow: none !important;
}
.audio__time-wrap {
  margin-top: 15px !important;
}
.audio-player .audio__progress-wrap {
  background: #f3acac !important;
}
.audio__notice {
  display: none !important;
}
</style>
<style lang="scss" scoped>
@import './style/play.scss';
</style>