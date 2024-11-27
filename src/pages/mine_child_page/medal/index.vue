<template>
  <div class="medal-container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <div class="title">荣誉勋章墙</div>
    </div>
    <div class="honor p-t-50">
      <div class="title">
        <span class="left-icon"></span>
        <span class="text">{{ userName }}</span>
        <span class="right-icon"></span>
      </div>
      <ul>
        <li>
          <img src="~assets/mine/comment-none.png" alt="" />
          <p>高谈阔论</p>
        </li>
        <li>
          <img src="~assets/mine/like-none.png" alt="" />
          <p>有口皆碑</p>
        </li>
        <li>
          <img src="~assets/mine/reply-none.png" alt="" />
          <p>语惊四座</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { UserModule } from '@/store/modules/user';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'mine-medal',
})
export default class extends Vue {
  get userName() {
    return UserModule.smsFastPass.nickname;
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
