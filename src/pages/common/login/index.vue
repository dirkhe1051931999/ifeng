<template>
  <div class="login-container">
    <div class="logo">
      <img src="~assets/logo.png" alt="" />
    </div>
    <q-form @submit="onSubmit" class="login-form" ref="login-form">
      <div class="telphone">
        <q-input v-model="loginForm.tel" label="手机号" lazy-rules :rules="loginFormRules.tel" clearable style="width: 60%" />
        <q-btn @click="getVerifyCode" style="width: 30%" v-show="!show_count_down" unelevated outline>获取验证码</q-btn>
        <q-btn disable style="width: 30%" v-show="show_count_down" unelevated outline>{{ count_down }}</q-btn>
      </div>
      <q-input type="number" v-model="loginForm.code" label="短信验证码" lazy-rules :rules="loginFormRules.code" clearable />
      <div>
        <q-btn label="登 录" type="submit" color="primary" class="submit-button" />
      </div>
    </q-form>
    <q-dialog v-model="showCaptcha" >
      <q-card class="captcha-dialog">
        <q-card-section>
          <div class="text-h6">
            请依次输入 <span class="bold">{{ captchaData.words }}</span>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="img-wrap">
            <img :src="captchaData.image" alt="" />
            <div class="mask" @click="handleClickCaptchaImg"></div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="handleClickCloseCaptcha" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { isValid11Tel } from '@/utils/validate';
import { captchaData } from './capacha';
@Component
export default class extends Vue {
  $refs: any;
  private count = 30;
  private count_down = 0;
  private show_count_down = false;
  private showCaptcha = true;
  private captchaData = captchaData.data;
  private loginForm = {
    tel: '',
    code: '',
  };
  private loginFormRules = {
    tel: [(val: any) => (val && val.length > 0) || '请输入手机号', (val: any) => isValid11Tel(val) || '请输入正确手机号'],
    code: [(val: any) => (val !== null && val !== '') || '请输入验证码'],
  };
  /**event */
  private handleClickCloseCaptcha() {}
  private handleClickCaptchaImg(e: any) {
    console.log(e);
  }
  /**http */
  private onSubmit() {
    this.$refs['login-form'].validate().then(async (success: boolean) => {
      if (success) {
      }
    });
  }
  private getVerifyCode() {
    if (isValid11Tel(this.loginForm.tel)) {
      var start = +new Date();
      var count = this.count;
      const _count = this.count;
      this.count_down = _count;
      this.show_count_down = true;
      var timer = setInterval(() => {
        var cur = +new Date();
        count--;
        this.count_down = count;
        if (cur - start >= _count * 1000) {
          clearInterval(timer);
          this.show_count_down = false;
        }
      }, 1000);
    } else {
      this.$toast('请输入正确手机号');
    }
  }
}
</script>

<style lang="scss">
.captcha-dialog {
  .img-wrap {
    position: relative;
    img {
      width: 240px;
      height: 140px;
      position: absolute;
      left: 0;
      top: 0;
    }
    .mask {
      width: 240px;
      height: 140px;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1000;
    }
  }
}
</style>
<style lang="scss" scoped>
.login-container {
  padding: 10px 16px;
  background: #ffffff;
  .logo {
    text-align: center;
    padding-top: 20px;
    padding-bottom: 10px;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
  }
  .submit-button {
    width: 100%;
    height: 38px;
    border-radius: 4px;
    margin-top: 20px;
  }
  .login-form {
    .telphone {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>