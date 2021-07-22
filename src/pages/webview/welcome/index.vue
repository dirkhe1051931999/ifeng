<template>
  <div class="welcome-container text-center">
    <p>welcome</p>
    <div @click="onExperience">go go go</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({
  name: 'Index',
})
export default class extends Vue {
  private onExperience() {
    this.$router.replace('/app/0');
  }
}
</script>
<style lang="scss" scoped>
</style>
