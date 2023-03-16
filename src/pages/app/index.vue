<template>
  <div class="app-container">
    <TabHomePage v-show="activeNavigateIndex === 0"></TabHomePage>
    <TabShortVideoPage v-show="activeNavigateIndex === 1"></TabShortVideoPage>
    <TabPlazaPage v-show="activeNavigateIndex === 2"></TabPlazaPage>
    <TabMinePage v-show="activeNavigateIndex === 3"></TabMinePage>
    <van-tabbar v-model="activeNavigateIndex" active-color="#cf2a2a" inactive-color="#252631" style="height: 60px">
      <van-tabbar-item v-for="(item, index) in navigationArr" :key="index" class="text-center">
        <span class="iconfont" :class="item.icon" style="font-size: 22px"></span>
        <p class="p-t-5">{{ item.name }}</p>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script lang="ts">
import { AppModule } from 'src/store/modules/app';
import { Component, Vue } from 'vue-property-decorator';
import { get_config_backreason_key, set_config_backreason_key } from 'src/utils/db';
import TabHomePage from 'src/pages/bottom_navigation/home/index.vue';
import TabShortVideoPage from 'src/pages/bottom_navigation/shortVideo/index.vue';
import TabPlazaPage from 'src/pages/bottom_navigation/plaza/index.vue';
import TabMinePage from 'src/pages/bottom_navigation/mine/index.vue';
@Component({
  name: 'App',
  components: {
    TabHomePage,
    TabShortVideoPage,
    TabPlazaPage,
    TabMinePage,
  },
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
    },
    {
      name: '视频',
      icon: 'icon-communityiconvideo4',
    },
    {
      name: '看见',
      icon: 'icon-pingtai_mokuai',
    },
    {
      name: '我',
      icon: 'icon-account',
    },
  ];
  private async _getBaseConfig() {
    if (!get_config_backreason_key()) {
      const result = await AppModule.getBaseConfig({ headLogoType: '3', province: '', city: '', statusHeight: '29' });
      set_config_backreason_key(result['backreason']);
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  width: 100%;
}
</style>

