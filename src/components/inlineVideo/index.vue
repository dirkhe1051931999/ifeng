
<template>
  <div class="inline-video-component">
    <div id="ifeng-dplayer"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DPlayer from 'dplayer';

@Component
export default class extends Vue {
  @Prop({ default: '' }) private src!: string;
  @Prop({ default: '' }) private poster!: string;
  mounted() {
    console.log(this.src);
    const dp = new DPlayer({
      container: document.getElementById('ifeng-dplayer'),
      video: {
        url: this.src,
        pic: this.poster,
      },
    });
  }
  /**event */
  /**http */
}
</script>

<style scoped lang='scss'>
</style>
