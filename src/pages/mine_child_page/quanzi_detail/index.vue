<template>
  <div class="quanzi_detail-container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <div class="title">圈子详情</div>
    </div>
    <div class="quanzi_detail-wrap" ref="quanzi_detail-wrap" @scroll="monitorScrollEvent">
      <div class="text-center p-t-10 p-b-10" v-show="getDataLoading">
        <van-loading size="12px" color="#969799">加载中...</van-loading>
      </div>
      <div class="bannerData" v-if="!getDataLoading && bannerData.org">
        <img :src="bannerData.org.descImage" alt="" class="img" />
        <div class="title">{{ bannerData.org.title }}</div>
        <div class="userGenuine">{{ bannerData.orgStatistics.userGenuine }}位凤友加入</div>
        <div class="to-quanzi" @click="handleClickOtherQuanzi">逛逛其他热门圈子 <q-icon name="chevron_right" class="icon"></q-icon></div>
      </div>
      <div class="owner-member" v-if="!getDataLoading && bannerData.org">
        <div class="top">
          <div class="left">
            <q-img :src="ownerData[0].userinfo.avatar" class="img"></q-img>
            <div class="nickName">{{ ownerData[0].userinfo.nickName }}</div>
            <div class="label">圈主</div>
          </div>
          <div class="right">
            <ul>
              <li v-for="(item, index) in memberData" :key="index">
                <q-img :src="item.userinfo.avatar" class="img" v-if="item.userinfo.avatar"></q-img>
              </li>
              <li class="more" @click="handleClickQuanyou">圈友列表 <q-icon name="chevron_right" class="icon"></q-icon></li>
            </ul>
          </div>
        </div>
        <div class="bottom">您正在收看的是{{ bannerData.org.title }}</div>
      </div>
      <div class="notice" v-if="!getDataLoading">
        <div class="wrap" @click="handleClickQuangui">
          <img src="~assets/mine/volume.png" alt="" />
          <p>【用户须知！凤凰卫视圈子圈规】</p>
        </div>
      </div>
      <div class="tag" v-if="!getDataLoading">
        <ul>
          <li v-for="(item, index) in tagData" :key="index" :class="{ active: item.tag === currentTag }" @click="handleClickTag(item)">
            <q-icon name="sunny" v-if="item.tag === '热点'" class="icon"></q-icon> {{ item.tag }}
          </li>
        </ul>
        <div class="more"></div>
      </div>
      <div class="content" v-if="!getDataLoading">
        <div class="load-more-loading" v-show="clickTagGetDataLoading">
          <q-spinner color="#969799" size="20px" :thickness="2" />
          加载中...
        </div>
        <ul>
          <li v-for="(item, index) in contentData" :key="index">
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
            <div v-if="JSON_PARSE(item.content.link, item.content.txt).img && typeof JSON_PARSE(item.content.link, item.content.txt).img === 'object'" class="slide-img-wrap">
              <q-img
                class="slide-img"
                v-for="(img, imgIndex) in JSON_PARSE(item.content.link, item.content.txt).img"
                :key="imgIndex"
                :src="img.link"
                @click.stop.prevent="previewImage(JSON_PARSE(item.content.link, item.content.txt).img, imgIndex)"
              >
              </q-img>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="!clickTagGetDataLoading">
        <div class="load-more-loading" v-show="load_more_no_data.length">暂无数据</div>
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
import { Component, Vue } from 'vue-property-decorator';
const ifengImgDomain = ['player-proxy.ifengidc.com'];

@Component({
  name: 'mine-quanzi_detail',
})
export default class extends Vue {
  $refs: any;
  async mounted() {
    this.getDataLoading = true;
    await this.getOrgBannerData();
    await this.getOrgUserList();
    await this.getOrgTag();
    await this.getOrgContent();
    this.$refs['quanzi_detail-wrap']['style']['height'] = `${window.innerHeight - 50}px`;
    this.getDataLoading = false;
  }
  private getDataLoading = false;
  private clickTagGetDataLoading = false;
  private bannerData = {};
  private ownerData = [];
  private memberData = [];
  private tagData = [];
  private contentData = [];
  private currentTag = '热点';
  public containerPositionY = 0;
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private load_more_no_data = '';
  private pagination_params = {
    size: 10,
    num: 1,
  };
  /* event */
  async monitorScrollEvent(e: any) {
    const scrollHeight = this.$refs['quanzi_detail-wrap'].scrollHeight;
    const scrollTop = this.$refs['quanzi_detail-wrap'].scrollTop;
    this.containerPositionY = scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
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
  private async handleClickTag(item: any) {
    this.pagination_params.num = 1;
    this.currentTag = item.tag;
    this.contentData = [];
    this.load_more_no_data = '';
    this.load_more_loading_lock = false;
    this.clickTagGetDataLoading = true;
    await this.getOrgContent();
    this.clickTagGetDataLoading = false;
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
  private handleClickQuanyou() {
    this.$router.push(`/mine_child_page/quanzi_quanyou?orgId=${this.$route.query.orgId}`);
  }
  private handleClickQuangui() {
    // this.$router.push('/news_detail/doc?aid=8BmVY6afyK0');
  }
  private handleClickOtherQuanzi() {
    this.$router.push('/mine_child_page/quanzi');
  }
  /* http */
  private async getOrgBannerData() {
    const { data } = await MineModule.getOrgBannerData({ id: this.$route.query.orgId });
    this.bannerData = data;
    return Promise.resolve();
  }
  private async getOrgUserList() {
    const owner = await MineModule.getOrgUserList({
      pages: {
        current: 1,
        hitCount: false,
        optimizeCountSql: true,
        records: [],
        searchCount: true,
        size: 3,
        orders: [{ column: 'ctime', asc: true }],
      },
      where: { orgId: this.$route.query.orgId, selectOwner: 1 },
    });
    const member = await MineModule.getOrgUserList({
      pages: {
        current: 1,
        hitCount: false,
        optimizeCountSql: true,
        records: [],
        searchCount: true,
        size: 4,
        orders: [{ column: 'ctime', asc: false }],
      },
      where: { orgId: this.$route.query.orgId, selectOwner: -1 },
    });
    this.ownerData = owner.data.records;
    this.memberData = member.data.records;
    return Promise.resolve();
  }
  private async getOrgTag() {
    const tag = await MineModule.getOrgTag({
      pages: {
        current: 1,
        hitCount: false,
        optimizeCountSql: true,
        records: [],
        searchCount: true,
        size: 30,
        orders: [{ column: 'sequence', asc: true }],
      },
      where: { orgId: this.$route.query.orgId },
    });
    this.tagData = tag.data.records;
    return Promise.resolve();
  }
  private async getOrgContent() {
    const data = {
      pages: {
        current: this.pagination_params.num,
        hitCount: false,
        optimizeCountSql: true,
        records: [],
        searchCount: true,
        size: this.pagination_params.size,
        orders: [{ column: 'utime', asc: false }],
      },
      where: { orgId: this.$route.query.orgId },
    };
    if (this.currentTag === '热点') {
      delete data.where['tag'];
      data.where['boutique'] = '1';
    } else if (this.currentTag === '动态') {
      delete data.where['tag'];
      delete data.where['boutique'];
    } else {
      data.where['tag'] = JSON.stringify([this.currentTag]);
    }
    const content = await MineModule.getOrgContent(data);
    this.contentData = content.data.records;
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
        orders: [{ column: 'utime', asc: false }],
      },
      where: { orgId: this.$route.query.orgId },
    };
    if (this.currentTag === '热点') {
      delete data.where['tag'];
      data.where['boutique'] = '1';
    } else if (this.currentTag === '动态') {
      delete data.where['tag'];
      delete data.where['boutique'];
    } else {
      data.where['tag'] = JSON.stringify([this.currentTag]);
    }
    const content = await MineModule.getOrgContent(data);
    if (content.data.records.length === 0) {
      this.load_more_no_data = '没有更多数据了';
      this.load_more_loading_lock = true;
      this.load_more_loading = false;
      return Promise.reject();
    } else {
      this.contentData = this.contentData.concat(content.data.records);
      return Promise.resolve();
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
