<template>
  <div class="login-container">
    <q-icon name="close" class="close" @click="$router.back()"></q-icon>
    <!-- <div class="logo">
      <img src="~assets/logo.png" alt="" />
    </div> -->
    <q-form @submit="onSubmit" class="login-form" ref="login-form">
      <div class="telphone">
        <q-input v-model="loginForm.tel" label="手机号" lazy-rules :rules="loginFormRules.tel" clearable style="width: 60%" />
        <q-btn @click="getVerifyCode" style="width: 30%" v-show="!show_count_down" unelevated outline :loading="getCaptchaLoading">获取验证码</q-btn>
        <q-btn disable style="width: 30%" v-show="show_count_down" unelevated outline>{{ count_down }}</q-btn>
      </div>
      <q-input type="number" v-model="loginForm.code" label="短信验证码" lazy-rules :rules="loginFormRules.code" clearable />
      <div>
        <q-btn label="登 录" type="submit" color="primary" class="submit-button" :loading="loginLoading" />
      </div>
    </q-form>
    <q-dialog v-model="showCaptcha" persistent>
      <q-card class="captcha-dialog" v-if="captchaData.image">
        <q-card-section>
          <div class="text-h6">
            请依次输入 <span class="bold">{{ captchaData.words }}</span>
          </div>
        </q-card-section>
        <q-card-section style="padding-top: 0; padding-bottom: 0">
          <q-img :src="captchaData.image" alt="" @click="handleClickCaptchaImg" class="img">
            <span class="count" v-for="(item, index) in 4" :key="index" :ref="'img_count_' + item">{{ item }}</span>
          </q-img>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="取消" flat v-close-popup />
          <q-btn label="确认" color="primary" @click="handleClickCloseCaptcha" :loading="verifyCaptchaLoading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { isValid11Tel } from '@/utils/validate';
import { UserModule } from '@/store/modules/user';
@Component
export default class extends Vue {
  $refs: any;
  async mounted() {}
  private count = 30;
  private count_down = 0;
  private show_count_down = false;
  private showCaptcha = false;
  private captchaData: any = {};
  private getCaptchaLoading = false;
  private verifyCaptchaLoading = false;
  private clickImgCount = 0;
  private positions: any[] = [];
  private loginLoading = false;
  private loginForm = {
    tel: '',
    code: '',
  };
  private loginFormRules = {
    tel: [(val: any) => (val && val.length > 0) || '请输入手机号', (val: any) => isValid11Tel(val) || '请输入正确手机号'],
    code: [(val: any) => (val !== null && val !== '') || '请输入验证码'],
  };
  /**event */
  private async handleClickCloseCaptcha() {
    this.verifyCaptchaLoading = true;
    const form = new FormData();
    form.append('mobile', this.loginForm.tel);
    form.append('channel', '1');
    form.append('platform', 'c');
    form.append('systemid', '7');
    form.append('captcha_id', this.captchaData.id);
    form.append('positions', JSON.stringify(this.positions));
    const { data, message } = await UserModule.sendMsgByClick(form);
    this.verifyCaptchaLoading = false;
    if (data && !data.authcode && data.ccl) {
      this.$toast('发送验证码成功');
      this.showCaptcha = false;
      this.startCount();
    } else {
      this.$toast(message);
    }
  }
  private handleClickCaptchaImg(e: any) {
    if (this.clickImgCount === 4) return;
    this.clickImgCount++;
    if (this.$refs[`img_count_${this.clickImgCount}`]) {
      this.$refs[`img_count_${this.clickImgCount}`][0].style['left'] = `${e.offsetX}px`;
      this.$refs[`img_count_${this.clickImgCount}`][0].style['top'] = `${e.offsetY}px`;
    }
    this.positions.push({
      x: e.offsetX,
      y: e.offsetY,
    });
  }
  private startCount() {
    let start = +new Date();
    let count = this.count;
    const _count = this.count;
    this.count_down = _count;
    this.show_count_down = true;
    const timer = setInterval(() => {
      let cur = +new Date();
      count--;
      this.count_down = count;
      if (cur - start >= _count * 1000) {
        clearInterval(timer);
        this.show_count_down = false;
      }
    }, 1000);
  }
  /**http */
  private onSubmit() {
    this.$refs['login-form'].validate().then(async (success: boolean) => {
      if (success) {
        this.loginLoading = true;
        await UserModule.checkMobile({ params: { u: this.loginForm.tel, so: '7' } });
        const form = new FormData();
        form.append('u', this.loginForm.tel);
        form.append('cert', this.loginForm.code);
        // form.append(
        //   'ltoken',
        //   '$2kJyeiQHbwIiOiwiIuxGZiojIsICMjRmI6ISeuWuI4men4WeosIigwRmI6IicZmuIliel100vegfaISgcBnIsZ3byNmbpojIlmZ6iWK6Vy55/wiIBl2YiISe0WuI6menuWeo4Iig4RmIsR3cpNWayojI0ir5iur5tyY5o0nI6r340gf',
        // );
        const result = await UserModule.toSmsFastPass(form);
        if (result) {
          this.$toast('登录成功');
          this.$router.back();
        } else {
          this.$toast('登录失败');
        }
        this.loginLoading = false;
      }
    });
  }
  private async getVerifyCode() {
    if (isValid11Tel(this.loginForm.tel)) {
      this.getCaptchaLoading = true;
      const form = new FormData();
      form.append('mobile', this.loginForm.tel);
      form.append('channel', '1');
      form.append('platform', 'c');
      form.append('systemid', '7');
      const { data, message, code } = await UserModule.sendMsgByClick(form);
      if (data && data.authcode) {
        const form = new FormData();
        form.append('type', '1');
        form.append('platform', 'c');
        form.append('systemid', '7');
        const { data } = await UserModule.getCaptcha(form);
        this.captchaData = data;
        this.showCaptcha = true;
      } else if (data && !data.authcode && String(code) === '0') {
        this.$toast(message);
      } else if (data && !data.authcode && data.ccl) {
        this.startCount();
      }
      this.getCaptchaLoading = false;
    } else {
      this.$toast('请输入正确手机号');
    }
  }
}
</script>

<style lang="scss">
.captcha-dialog {
  width: 80vw;
  height: 30vh;
  position: relative;
  .img {
    width: 240px;
    height: 140px;
    position: relative;
    .count {
      left: -100px;
      top: 0;
      position: absolute;
      color: var(--q-color-primary);
      font-weight: bold;
      font-size: 14px;
    }
  }
}
</style>
<style lang="scss" scoped>
.login-container {
  padding: 10px 16px;
  background: #ffffff;
  position: relative;
  .close {
    position: absolute;
    right: 16px;
    top: 16px;
  }
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
    padding-top: 20px;
    .telphone {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>