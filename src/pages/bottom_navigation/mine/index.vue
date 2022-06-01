<template>
  <div class="mine-container">
    <div class="mine-wrap" ref="mine-wrap" @scroll="monitorScrollEvent">
      <div class="not-login" v-if="!token">
        <div class="login-button" @click="$router.push('/login')">登录</div>
      </div>
      <div class="have-login" v-if="token && loginInfo.userimg">
        <div class="left">
          <q-img :src="loginInfo.userimg" class="img"></q-img>
        </div>
        <div class="right">
          <div class="name">
            {{ loginInfo.nickname }}
          </div>
          <div class="title">
            <span class="label" @click="handleClickLabel">{{ loginInfo.credit.title_1 }}</span>
            <span class="medal" @click="handleClickMedal">勋章墙</span>
          </div>
          <div class="follow-fans">
            <div class="follow" @click="handleClickFollow">关注 {{ loginInfo.follow_num }}</div>
            <div class="fans" @click="handleClickFans">粉丝 {{ loginInfo.fans_num }}</div>
          </div>
        </div>
        <div class="profile" @click="$router.push('/mine_child_page/profile')">
          <span>个人主页</span>
          <q-icon name="chevron_right"></q-icon>
        </div>
      </div>
      <div class="common-feature">
        <div class="title">常用功能</div>
        <ul>
          <li v-for="(item, index) in platform_service" :key="index" @click="handleClickFeatureItem(item)">
            <q-icon :name="item.icon" class="icon"></q-icon>
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="service_customs">
        <div class="title">平台服务</div>
        <ul>
          <li v-for="(item, index) in service_customs" :key="index" @click="handleClickServiceItem(item)">
            <img :src="item.icon_img.day_icon" alt="" class="icon" />
            <span>{{ item.title }}</span>
          </li>
        </ul>
      </div>
      <div class="service_slides">
        <ul>
          <li v-for="(item, index) in service_slides" :key="index">
            <img :src="item.slide_image" alt="" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { UserModule } from '@/store/modules/user';
import { Dialog } from 'quasar';
import { Component, Vue } from 'vue-property-decorator';
import { platFormService } from './platform_service';
@Component({
  name: 'tab_mine',
})
export default class extends Vue {
  $refs: any;
  mounted() {
    this.getUserPlatService();
    this.$nextTick(() => {
      this.$refs['mine-wrap'].style['height'] = window.innerHeight - 60 + 'px';
    });
  }
  activated() {
    if (UserModule.token) {
      this.getUserInfo();
    }
  }
  get token() {
    return UserModule.token;
  }
  private service_customs: any[] = [];
  private service_slides: any[] = [];
  private service_medals: any[] = [];
  private platform_service: any[] = platFormService;
  private loginInfo: any = {};
  /**event */
  private monitorScrollEvent(e: any) {}
  private handleClickLabel() {
    this.$router.push('/mine_child_page/level');
  }
  private handleClickMedal() {
    this.$router.push('/mine_child_page/medal');
  }
  private handleClickFollow() {
    this.$router.push('/mine_child_page/follow');
  }
  private handleClickFans() {
    this.$router.push('/mine_child_page/fans');
  }
  private handleClickFeatureItem(item: any) {
    switch (item.id) {
      case 'xiaoxi':
        this.$router.push('/mine_child_page/messages');
        break;
      case 'guanzhu':
        this.handleClickFollow();
        break;
      case 'shoucang':
        this.$router.push('/mine_child_page/favorite');
        break;
      case 'lishi':
        this.$router.push('/mine_child_page/push_history');
        break;
      case 'shezhi':
        this.$q
          .dialog({
            title: '提示',
            message: '需要退出登录？',
            ok: true,
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            this.handleCLickLogout();
          });
        break;
      default:
        this.$toast('哦呦，还没有开发~');
        break;
    }
  }
  private handleClickServiceItem(item: any) {
    console.log(item);
    switch (item.name) {
      case 'quan':
        this.$router.push('/mine_child_page/quanzi');
        break;
      case 'hot_trail':
        this.$router.push('/mine_child_page/zhuizong');
        break;
      default:
        this.$toast('哦呦，还没有开发~');
        break;
    }
  }
  /**http */
  private async getUserPlatService() {
    const result = await UserModule.getUserPlatService({});
    const { customs, slides, medals } = result.data;
    this.service_customs = customs;
    this.service_slides = slides;
    this.service_medals = medals;
  }
  private async getUserInfo() {
    const { data } = await UserModule.getUserInfo({ params: {} });
    const { user_info } = data;
    this.loginInfo = user_info;
  }
  private async handleCLickLogout() {
    await UserModule.logout({});
    this.$toast('退出成功');
    this.loginInfo = {};
  }
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
