<template>
  <div class="tab-slide-page">
    <HomeSlidePageHot v-if="showSlidePageName === 'hot'"></HomeSlidePageHot>
    <HomeSlidePageQualityReading v-if="showSlidePageName === 'qualityReading'"></HomeSlidePageQualityReading>
    <HomeSlidePageSearch v-if="showSlidePageName === 'search'"></HomeSlidePageSearch>
  </div>
</template>
<script lang="ts">
import { TabHomeModule } from 'src/store/modules/tab_home';
import { Component, Vue } from 'vue-property-decorator';
import HomeSlidePageHot from '../hot/index.vue';
import HomeSlidePageQualityReading from '../qualityReading/index.vue';
import HomeSlidePageSearch from '../search/index.vue';
@Component({
  name: 'tabs_slide_page',
  components: {
    HomeSlidePageHot,
    HomeSlidePageQualityReading,
    HomeSlidePageSearch,
  },
})
export default class extends Vue {
  get showSlidePageName() {
    return TabHomeModule.showSlidePageName;
  }
  get showSlidePage() {
    return TabHomeModule.showSlidePage;
  }
  created() {}
}
</script>
<style lang="scss" scoped>
.tab-slide-page {
  background: #f7f7f7;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 6000;
  color: $black;
}
</style>