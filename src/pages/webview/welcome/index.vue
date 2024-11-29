<template>
  <div class="welcome-container">
    <p class="text-left p-t-10 p-b-10">若您已安装<span class="text-red">凤凰新闻客户端</span></p>
    <div class="border">
      <p class="text">点击按钮，进入APP</p>
      <img src="~assets/welcome/open.png" alt="" />
    </div>
    <div class="open">
      <p class="text">点击按钮，进入APP</p>
      <div class="button" @click="onExperience">进入</div>
    </div>
    <footer>
      <div class="logo">
        <img src="~assets/welcome/fenghuang.png" alt="" />
      </div>
      <div class="copy">Copyright © {{ new Date().getFullYear() }} Phoenix New Media Limited All Rights Reserved</div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({
  name: 'welcome-index',
})
export default class extends Vue {
  public onExperience() {
    this.$router.replace('/app/0');
  }
}
</script>
<style lang="scss" scoped>
.welcome-container {
  padding: 16px;
  .border {
    border: solid 1px #eeeeee;
    height: 220px;
    width: 100%;
    margin: 0 auto;
    .text {
      padding: 10px 0 20px;
      text-align: center;
      font-weight: bold;
    }
    img {
      width: 314px;
      height: 88px;
      margin: 0 auto;
      display: block;
    }
  }
  .open {
    padding-top: 30px;
    .text {
      padding: 10px 0;
      text-align: center;
      font-weight: bold;
    }
    .button {
      display: block;
      height: 38px;
      line-height: 38px;
      font-size: 16px;
      text-align: center;
      background-color: var(--q-color-primary);
      width: 100%;
      margin: 0 auto;
      border-radius: 70px;
      color: #ffffff;
    }
  }
  footer {
    .logo {
      width: 175px;
      height: 40px;
      margin: 100px auto 0;
      img {
        width: 175px;
        height: 40px;
      }
    }
    .copy {
      padding-top: 10px;
      color: #999;
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>