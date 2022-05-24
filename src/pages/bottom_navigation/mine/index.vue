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
          <div class="top">
            {{ loginInfo.nickname }}
          </div>
          <div class="bottom">
            {{ loginInfo.credit.title_1 }}
          </div>
        </div>
        <div class="logout" @click="handleCLickLogout">退出登录</div>
      </div>
      <div class="common-feature">
        <div class="title">常用功能</div>
        <ul>
          <li v-for="(item, index) in platform_service" :key="index">
            <q-icon :name="item.icon" class="icon"></q-icon>
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="service_customs">
        <div class="title">平台服务</div>
        <ul>
          <li v-for="(item, index) in service_customs" :key="index">
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
