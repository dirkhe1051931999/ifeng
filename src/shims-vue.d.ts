// Mocks all files ending in `.vue` showing them as plain Vue instances

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'js-cookie';
declare module 'ts-md5';
declare module 'Swiper';
declare module 'jeft-vue-directive'
