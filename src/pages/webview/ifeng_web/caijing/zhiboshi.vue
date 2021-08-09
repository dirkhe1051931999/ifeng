<template>
  <div class="caijing-zhioboshi-container">
    <div class="header">
      <img src="~assets/caijing/banner.png" alt="">
    </div>
    <van-tabs v-model="activeTabIndex" class="tabs">
      <van-tab title="全部">
        <div class="all" ref="caijing-zhioboshi-all">
          <q-timeline color="primary">
            <q-timeline-entry v-for="(item, index) in allList" :key="index" avatar="~assets/caijing/caijing_logo.png" >
              <template v-slot:subtitle> 
                <span style="opacity:0.4">{{ item.ctime | parseTimeFromDateString2 }}</span>
                <span class="m-l-10 text-red bold" >{{ item.ctime | parseTimeFromDateString3 }}</span>
              </template>
              <div class="content">
                {{ item.brief }}
              </div>
            </q-timeline-entry>
          </q-timeline>
        </div>
      </van-tab>
      <van-tab title="财经精选">
        <div class="chosen" ref="caijing-zhioboshi-chosen">财经精选</div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { TabHomeCaijingModule } from 'src/store/modules/tab_home_caijing';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'caijing-zhioboshi',
})
export default class extends Vue {
  $refs: any;
  @Watch('activeTabIndex')
  onchange() {
    setTimeout(() => {
      if (!this.$refs['caijing-zhioboshi-chosen'].style['height']) this.$refs['caijing-zhioboshi-chosen'].style['height'] = window.innerHeight + 'px';
    }, 200);
  }
  mounted() {
    this._getCaijingZhiboshi();
    setTimeout(() => {
      this.$refs['caijing-zhioboshi-all'].style['height'] = window.innerHeight + 'px';
    }, 200);
  }
  private activeTabIndex = 0;
  private vanIndexBarIndex = [];
  private allList: any[] = [];
  /**event */
  /**http */
  private async _getCaijingZhiboshi() {
    const result1 = await TabHomeCaijingModule.getCaijingZhiboshi1({ params: { id: '' } });
    const result2 = await TabHomeCaijingModule.getCaijingZhiboshi2({ params: { count: 0 } });
    const obj = {};
    if (result1[0]) {
      console.log(result1[0]);
      this.allList = result1[0];
    }
    // console.log(result1);
    // console.log(result2);
  }
}
</script>
<style lang="scss">
.caijing-zhioboshi-container{
  .q-timeline__subtitle{
    opacity: 1;
  }
}
</style>
<style lang="scss" scoped>
@import '../style/caijing_zhiboshi.scss';
</style>