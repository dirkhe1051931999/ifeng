<template>
  <div class="inline-video-component">
    <div id="ifeng-dplayer" style="width: 100%; height: 220px"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop({ default: '' }) public src!: string;
  @Prop({ default: '' }) public poster!: string;
  mounted() {
    const dp = new window['DPlayer']({
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

<style scoped lang="scss"></style>