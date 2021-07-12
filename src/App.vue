
<template>
  <div id="q-app">
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <router-view key="app" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class extends Vue {}
</script>

<style scoped lang='scss'>
</style>
