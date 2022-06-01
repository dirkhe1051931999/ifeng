<template>
  <div class="quanzi-container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <div class="title">圈子</div>
    </div>
    <div class="quanzi-wrap" ref="quanzi-wrap" @scroll="monitorScrollEvent">
      <div class="text-center p-t-10 p-b-10" v-show="getDataLoading">
        <van-loading size="12px" color="#969799">加载中...</van-loading>
      </div>
      <div class="topData" v-if="!getDataLoading">
        <ul>
          <li v-for="(item, index) in topData.slice(0, 1)" :key="index" class="left" @click="handleClickQuanzi(item)">
            <img :src="item.org.thumbnailDescImage" alt="" class="img" />
            <div class="title">{{ item.org.title }}</div>
            <div class="userFake">{{ item.orgStatistics.userFake }} 位凤友加入</div>
          </li>
          <div class="right">
            <li v-for="(item, index) in topData.slice(1, 3)" :key="index" @click="handleClickQuanzi(item)">
              <img :src="item.org.thumbnailDescImage" alt="" class="img" />
              <div class="r">
                <div class="title">{{ item.org.title }}</div>
                <div class="userFake">{{ item.orgStatistics.userFake }} 位凤友加入</div>
              </div>
            </li>
          </div>
        </ul>
      </div>
      <div class="discoverData" v-if="!getDataLoading">
        <ul>
          <li v-for="(item, index) in discoverData" :key="index">
            <div class="userinfo">
              <img :src="item.userinfo.avatar" alt="" class="img" />
              <div>
                <div class="nickName">{{ item.userinfo.nickName }}</div>
                <div class="editTime">{{ item.content.editTime | getDateDiff }}</div>
              </div>
            </div>
            <div class="content">
              {{ JSON_PARSE(item.content.link, item.content.txt).title }}
            </div>
            <q-img
              :src="JSON_PARSE(item.content.link, item.content.txt).img"
              v-if="JSON_PARSE(item.content.link, item.content.txt).img && typeof JSON_PARSE(item.content.link, item.content.txt).img === 'string'"
              class="img"
            >
              <img src="~assets/play-video-button.png" alt="" class="play" v-if="JSON_PARSE(item.content.link, item.content.txt).type === 'video'" />
            </q-img>
            <div
              v-if="JSON_PARSE(item.content.link, item.content.txt).img && typeof JSON_PARSE(item.content.link, item.content.txt).img === 'object'"
              class="slide-img-wrap"
            >
              <q-img
                class="slide-img"
                v-for="(img, imgIndex) in JSON_PARSE(item.content.link, item.content.txt).img"
                :key="imgIndex"
                :src="img.link"
                @click.stop.prevent="previewImage(JSON_PARSE(item.content.link, item.content.txt).img, imgIndex)"
              >
              </q-img>
            </div>
            <div class="org" @click="handleClickQuanzi(item)">
              <img :src="item.org.thumbnailDescImage" alt="" class="img" />
              <div class="title">{{ item.org.title }}</div>
              <div class="join">加入</div>
            </div>
          </li>
        </ul>
        <div class="load-more-loading" v-show="load_more_no_data">暂无数据</div>
        <div class="load-more-loading" v-show="load_more_loading">
          <q-spinner color="#969799" size="20px" :thickness="2" />
          加载中...
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MineModule } from '@/store/modules/mine';
import { compact } from 'lodash';
import { ImagePreview } from 'vant';
import { Component, Vue, Watch } from 'vue-property-decorator';
const ifengImgDomain = ['player-proxy.ifengidc.com'];
@Component
export default class extends Vue {
  $refs: any;
  @Watch('$route')
  onchange(newVal: any) {
    if (newVal.path === '/mine_child_page/quanzi') {
      this.$refs['quanzi-wrap'].scrollTop = this.containerPositionY;
    }
  }
  async mounted() {
    this.getDataLoading = true;
    await this.getQuanziTopData();
    await this.getQuanziDiscover();
    this.getDataLoading = false;
    this.$nextTick(() => {
      this.$refs['quanzi-wrap'].style['height'] = window.innerHeight - 50 + 'px';
    });
  }
  private getDataLoading = false;
  public containerPositionY = 0;
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private load_more_no_data = '';
  private pagination_params = {
    size: 10,
    num: 1,
  };
  private topData = [];
  private discoverData = [];
  /* event */
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['quanzi-wrap'].scrollHeight;
    const scrollTop = this.$refs['quanzi-wrap'].scrollTop;
    this.containerPositionY = scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
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
  private JSON_PARSE(data: string, txt: string) {
    try {
      const arr = JSON.parse(data);
      for (let item of arr) {
        let urls = item.link.split('/');
        if (ifengImgDomain.includes(urls[2])) {
          urls[0] = '';
          urls[1] = '';
          urls[2] = '';
          urls[3] = '';
          urls = compact(urls);
          let url = urls.join('/');
          item.link = `https://d.ifengimg.com/w340_h340_q90/ugc-img.ifengimg.com/${url}`;
        }
      }
      const txtObject = JSON.parse(txt);
      if (arr && arr.length) {
        const img = arr.find((item: any) => {
          return item.type === 'IMG';
        });
        const video = arr.find((item: any) => {
          return item.type === 'VIDEO';
        });
        const text = arr.find((item: any) => {
          return item.type === 'link';
        });
        if (img && video && text) {
          return {
            img: img.link,
            type: 'video',
            title: text.title,
          };
        } else if (img && text) {
          return {
            img: img.link,
            type: 'img',
            title: text.title,
          };
        } else {
          return {
            type: 'imgs',
            title: txtObject.text,
            img: arr,
          };
        }
      } else if (txtObject) {
        const obj = {
          title: '',
          img: '',
        };
        if (txtObject.tag && txtObject.tag.length) {
          for (let item of txtObject.tag) {
            obj.title += item.name;
          }
        }
        if (txtObject.img && txtObject.img.length) {
          obj.img += txtObject.img[0];
        }
        obj.title += txtObject.text;
        return obj;
      }
    } catch (error) {
      console.log(error);
    }
  }
  private handleClickQuanzi(item: any) {
    this.$router.push('/mine_child_page/quanzi_detail?orgId=' + item.org.id);
  }
  private previewImage(images: any, index: number) {
    const arr = [];
    for (let item of images) {
      let urls = item.link.split('/');
      if (ifengImgDomain.includes(urls[2])) {
        urls[0] = '';
        urls[1] = '';
        urls[2] = '';
        urls[3] = '';
        urls = compact(urls);
        let url = urls.join('/');
        item.link = `https://d.ifengimg.com/w340_h340_q90/ugc-img.ifengimg.com/${url}`;
      }
    }
    for (let item of images) {
      arr.push(item.link);
    }
    ImagePreview({
      images: arr,
      startPosition: index,
      closeable: true,
    });
  }
  /* http */
  private async getQuanziTopData() {
    const data = {
      pages: {
        current: 1,
        hitCount: false,
        optimizeCountSql: true,
        records: [],
        searchCount: true,
        size: 3,
        orders: [{ column: 'ctime', asc: false }],
      },
    };
    const result = await MineModule.getQuanziTopData(data);
    const { records } = result.data;
    this.topData = records;
    return Promise.resolve();
  }
  private async getQuanziDiscover() {
    const data = {
      pages: {
        current: 1,
        hitCount: false,
        optimizeCountSql: true,
        records: [],
        searchCount: true,
        size: this.pagination_params.size,
        orders: [{ column: 'ctime', asc: false }],
      },
      where: { boutique: 1 },
    };
    const result = await MineModule.getQuanziDiscover(data);
    const { records } = result.data;
    this.discoverData = records;
    return Promise.resolve();
  }
  private async _upCallback() {
    const data = {
      pages: {
        current: this.pagination_params.num,
        hitCount: false,
        optimizeCountSql: true,
        records: [],
        searchCount: true,
        size: this.pagination_params.size,
        orders: [{ column: 'ctime', asc: false }],
      },
      where: { boutique: 1 },
    };
    const result = await MineModule.getQuanziDiscover(data);
    const { records } = result.data;
    if (records.length === 0) {
      this.load_more_no_data = '没有更多数据了';
      this.load_more_loading_lock = true;
      this.load_more_loading = false;
      return Promise.reject();
    }
    this.discoverData = this.discoverData.concat(records);
    return Promise.resolve();
  }
}
</script>


<style lang="scss" scoped>
@import './index.scss';
</style>