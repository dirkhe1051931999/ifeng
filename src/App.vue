
<template>
  <div id="q-app">
    <vue-page-stack>
      <router-view :key="$route.fullPath" v-transition style="min-height: 100vh;" />
    </vue-page-stack>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
@Component
export default class extends Vue {}
</script>

<style scoped lang='scss'>
</style>
