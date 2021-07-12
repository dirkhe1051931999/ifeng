<template>
  <div>
    <router-view></router-view>
    <div id="app-navigation" class="app-navigation">
      <ul>
        <li
          v-for="(item, index) in navigationArr"
          :key="index"
          :class="activeNavigateIndex === index ? 'text-red' : ''"
          @click="handlerClickNavigation(item, index)"
        >
          <span class="iconfont" :class="item.icon"></span>
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { AppModule } from 'src/store/modules/app';
import { Component, Vue } from 'vue-property-decorator';
import { get_config_backreason_key, set_config_backreason_key } from 'src/utils/db';
@Component({
  name: 'App',
})
export default class extends Vue {
  created() {
    this._getBaseConfig();
  }
  private activeNavigateIndex = 0;
  private navigationArr = [
    {
      name: '新闻',
      icon: 'icon-news',
      path: '/app/home',
    },
    {
      name: '视频',
      icon: 'icon-communityiconvideo4',
      path: '/app/shortVideo',
    },
    {
      name: '平台',
      icon: 'icon-pingtai_mokuai',
      path: '/app/plaza',
    },
    {
      name: '我',
      icon: 'icon-account',
      path: '/app/mine',
    },
  ];
  private handlerClickNavigation(item: any, index: number) {
    this.activeNavigateIndex = index;
    this.$router.push(item.path);
  }
  private async _getBaseConfig() {
    if (!get_config_backreason_key()) {
      const result = await AppModule.getBaseConfig({ headLogoType: '3', province: '', city: '', statusHeight: '29' });
      set_config_backreason_key(result['backreason']);
    }
  }
}
</script>

<style scoped lang='scss'>
.app-navigation {
  position: fixed;
  box-sizing: border-box;
  padding: 2px 0;
  box-sizing: border-box;
  width: 100%;
  background: $white;
  height: 55px;
  bottom: 0;
  color: $black;
  border-top: 1px solid #eee;
  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    li {
      text-align: center;
      width: 22%;
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        font-size: 22px;
      }
      p {
        font-size: 16px;
      }
    }
  }
}
</style>
