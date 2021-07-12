<template>
  <div>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide bg-red">Slide 1</div>
        <div class="swiper-slide bg-yellow">Slide 2</div>
        <div class="swiper-slide bg-green">Slide 3</div>
        <span style="padding-left: 20px; padding-top: 30px">查看更多文章</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'test',
})
export default class extends Vue {
  mounted() {
    // var swiper = new window['Swiper']('.swiper-container', {
    //   on: {
    //     touchEnd: function (swiper: any, event: any) {
    //       console.log(123)
    //     },
    //   },
    // });
  }
}
</script>
<style lang="scss" scoped>
.swiper-container {
  width: 300px;
  height: 300px;
}
</style>
