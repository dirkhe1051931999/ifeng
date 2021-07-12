<template>
  <div class="guanzhu-container">
    <p v-for="n in 100" :key="n">tabs_home_item_guanzhu</p>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'tabs_home_item_guanzhu',
})
export default class extends Vue {
  created() {}
}
</script>
<style lang="scss" scoped>
.guanzhu-container {
  overflow: scroll;
  height: 100%;
}
</style>
