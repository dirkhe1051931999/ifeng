<template>
  <div class="tab_yinpin_child_categories">
    <div class="back">
      <q-icon name="arrow_back_ios_new" @click="$router.back()" class="arrow"></q-icon>
      <span>音频专辑</span>
    </div>
    <div class="categories-container">
      <div class="navs" ref="navs">
        <ul v-if="categoriesActiveNavList.length">
          <li
            v-for="(item, index) in categoriesActiveNavList"
            :key="index"
            :class="[categoriesActiveNavItemIndex === index ? 'active' : '', item.name.length < 5 ? 'fs-16' : 'fs-14']"
            @click="handleClickNavItem(item, index)"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="text-center p-t-10 p-b-10" v-show="getNavItemLoading">
          <van-loading size="12px" color="#969799">加载中...</van-loading>
        </div>
      </div>
      <div class="albums">
        <div class="tags">
          <ul>
            <li
              v-for="(item, index) in categoriesActiveNavAlbumTagList"
              :key="index"
              :class="[categoriesActiveTagIndex === index ? 'active' : '']"
              @click="handleClickTagItem(item, index)"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <ul class="list" ref="albums" @scroll="monitorScrollEvent">
          <div class="text-center p-t-50 p-b-10" v-show="getAlbumLoading">
            <van-loading size="12px" color="#969799">加载中...</van-loading>
          </div>
          <li v-for="(item, index) in categoriesAlbumList" :key="index" @click="handleClickAlbumItem(item, index)">
            <img :src="item.thumbnail" alt="" class="l" />
            <div class="r">
              <div class="t dotdotdot2">{{ item.title }}</div>
              <div class="m dotdotdot2">{{ item.intro }}</div>
              <div class="b">
                <div class="play">
                  <q-icon name="play_arrow" class="fs-16 m-r-5"></q-icon>
                  <span>{{ item.playTimeStr }}</span>
                </div>
                <div class="episodes">
                  <q-icon name="library_books" class="fs-16 m-r-5"></q-icon>
                  <span>{{ item.trackCountStr }}</span>
                </div>
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
    </div>
  </div>
</template>

<script lang="ts">
import { TabHomeYinpinModule } from '@/store/modules/tab_home_yinpin';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'tab_yinpin_child_categories',
})
export default class extends Vue {
  $refs: any;
  mounted() {
    this.getCate(this.$route.query.cateid);
    this.$refs.navs.style.height = window.innerHeight - 40 + 'px';
    this.$refs.albums.style.height = window.innerHeight - 80 + 'px';
  }
  activated() {
    this.$nextTick(() => {
      if (this.containerPositionY > window.innerHeight) {
        this.$refs['albums'].scrollTop = this.containerPositionY;
        this.containerPositionY = 0;
      }
    });
  }
  private getNavItemLoading = false;
  private getAlbumLoading = false;
  private categoriesActiveNavItemIndex = 0;
  private categoriesActiveNavItemId = '';
  private categoriesActiveNavItemName = '';
  private categoriesActiveTagIndex = 0;
  private categoriesActiveNavList: any[] = [];
  private categoriesActiveNavAlbumTagList: any[] = [];
  private categoriesAlbumList: any[] = [];
  private doSelect = false;
  private load_more_loading = false;
  private load_more_loading_lock = false;
  private load_more_no_data = '';
  private load_more_pagination_page = 1;
  private containerPositionY = 0;
  /*event*/
  private async handleClickNavItem(item: any, index: number) {
    if (this.getAlbumLoading) return;
    this.categoriesActiveNavAlbumTagList = item.taglist;
    this.categoriesActiveNavItemId = item.id;
    this.categoriesActiveNavItemIndex = index;
    this.load_more_pagination_page = 1;
    this.load_more_loading_lock = false;
    this.load_more_loading = false;
    this.load_more_no_data = '';
    this.doSelect = true;
    this.getAlbumLoading = true;
    await this.getCate(this.categoriesActiveNavItemId);
  }
  private handleClickTagItem(item: any, index: number) {
    if (this.getAlbumLoading) return;
    this.categoriesActiveTagIndex = index;
    this.categoriesActiveNavItemName = item;
    this.load_more_pagination_page = 1;
    this.load_more_loading_lock = false;
    this.load_more_loading = false;
    this.load_more_no_data = '';
    this.doSelect = true;
    this.getCateAlbums(this.categoriesActiveNavItemId, item);
  }
  private handleClickAlbumItem(item: any, index: number) {
    if (this.getAlbumLoading) return;
    this.$router.push('/tab_yinpin_child/directory?aid=' + item.link.aid);
  }
  private async monitorScrollEvent(e: any) {
    if (this.doSelect) return;
    const scrollHeight = this.$refs['albums'].scrollHeight;
    const scrollTop = this.$refs['albums'].scrollTop;
    this.containerPositionY = scrollTop;
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop + windowHeight >= scrollHeight) {
      if (!this.load_more_loading_lock) {
        this.load_more_loading = true;
        this.load_more_loading_lock = true;
        this.load_more_pagination_page++;
        await this.getMoreCateAlbums(this.categoriesActiveNavItemId, this.categoriesActiveNavItemName);
        this.load_more_loading_lock = false;
      }
    }
  }
  /*http*/
  private async getCate(cateid: any) {
    try {
      this.categoriesAlbumList = [];
      this.getNavItemLoading = true;
      const formData = new FormData();
      const { data } = await TabHomeYinpinModule.getCate({ params: { cateid }, formData });
      const { item } = data;
      this.categoriesActiveNavList = item;
      if (!cateid) {
        this.categoriesActiveNavAlbumTagList = item[0].taglist;
        this.categoriesActiveNavItemIndex = 0;
        this.categoriesActiveTagIndex = 0;
        this.getCateAlbums('', this.categoriesActiveNavAlbumTagList[0]);
      } else {
        const curIndex = this.categoriesActiveNavList.findIndex((d) => d.id === cateid);
        this.categoriesActiveNavItemId = this.categoriesActiveNavList[curIndex].id;
        this.categoriesActiveNavAlbumTagList = this.categoriesActiveNavList[curIndex].taglist;
        this.categoriesActiveNavItemIndex = curIndex;
        this.categoriesActiveTagIndex = 0;
        this.$nextTick(() => {
          const curDom = this.$refs.navs.children[0].children[this.categoriesActiveNavItemIndex];
          if (window.innerHeight < curDom.offsetTop) {
            this.$refs.navs.scrollTop = curDom.offsetTop;
          }
          this.getCateAlbums(this.categoriesActiveNavItemId, this.categoriesActiveNavAlbumTagList[0]);
        });
        return Promise.resolve(true);
      }
      this.getNavItemLoading = false;
    } catch (error) {
      console.log(error);
    }
  }
  private async getCateAlbums(cateid: any, tagname: string) {
    try {
      this.categoriesAlbumList = [];
      this.getAlbumLoading = true;
      const formData = new FormData();
      const { data } = await TabHomeYinpinModule.getCateAlbums({ params: { cateid, tagname, page: this.load_more_pagination_page }, formData });
      const { item } = data;
      this.categoriesAlbumList = item;
      this.getAlbumLoading = false;
      this.doSelect = false;
    } catch (error) {
      console.log(error);
    }
  }
  private async getMoreCateAlbums(cateid: any, tagname: string) {
    try {
      const formData = new FormData();
      const { data } = await TabHomeYinpinModule.getCateAlbums({ params: { cateid, tagname, page: this.load_more_pagination_page }, formData });
      const { item } = data;
      this.categoriesAlbumList = this.categoriesAlbumList.concat(item);
      return Promise.resolve(true);
    } catch (error) {
      console.log(error);
    }
  }
}
</script>


<style lang="scss" scoped>
@import './style/categories.scss';
</style>