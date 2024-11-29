<template>
  <div class="news-topic-container">
    <ul class="tabs">
      <q-icon class="back" name="arrow_back_ios" @click="hanlderClickTabBack"></q-icon>
      <li v-for="(item, index) in tabs" :key="index" :class="index === activeTabIndex ? 'active' : ''" @click="handlerClickTabItem(index)">
        {{ item.name }}
      </li>
    </ul>
    <div ref="news-topic-wrap" class="news-topic-wrap" @scroll="monitorScrollEvent">
      <div class="tabs-item-wrap" v-for="(item, index) in tabs" :key="index" :class="item.id" :ref="item.id">
        <div v-if="item.id === 'news-topic-zuixin'" class="tabs-item">
          <h3 class="fs-18">{{ item.id }}</h3>
          <p v-for="(item, index) in 50" :key="index">zuixin</p>
        </div>
        <div v-if="item.id === 'news-topic-pinglun'" class="tabs-item">
          <h3 class="fs-18">{{ item.id }}</h3>
          <p v-for="(item, index) in 50" :key="index">pinglun</p>
        </div>
        <div v-if="item.id === 'news-topic-jiedu'" class="tabs-item">
          <h3 class="fs-18">{{ item.id }}</h3>
          <p v-for="(item, index) in 50" :key="index">jiedu</p>
        </div>
        <div v-if="item.id === 'news-topic-remenpinglun'" class="tabs-item">
          <h3 class="fs-18">{{ item.id }}</h3>
          <p v-for="(item, index) in 50" :key="index">remenpinglun</p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="input"></div>
      <div class="comment">
        <i class="iconfont icon-duanxin"></i>
      </div>
      <div class="share">
        <i class="iconfont icon-fenxiang3"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
  $refs: any;
  mounted() {
    this.$refs['news-topic-wrap'].style['height'] = `${window.innerHeight - 38 - 46}px`;
    for (let item of this.tabs) {
      const $dom: any = this.$refs[item.id][0];
      this.tabsOffsetTopInterregional.push($dom.offsetTop);
    }
  }
  public activeTabIndex = 0;
  public tabsOffsetTopInterregional: number[] = [];
  public tabs = [
    { name: '最新', id: 'news-topic-zuixin' },
    { name: '评论', id: 'news-topic-pinglun' },
    { name: '解读', id: 'news-topic-jiedu' },
    { name: '热门评论', id: 'news-topic-remenpinglun' },
  ];
  /*event */
  public monitorScrollEvent() {
    const $dom = this.$refs['news-topic-wrap'];
    const scrollTop = $dom.scrollTop;
    if (scrollTop >= this.tabsOffsetTopInterregional[0] && scrollTop < this.tabsOffsetTopInterregional[1]) {
      this.activeTabIndex = 0;
    } else if (scrollTop >= this.tabsOffsetTopInterregional[1] && scrollTop < this.tabsOffsetTopInterregional[2]) {
      this.activeTabIndex = 1;
    } else if (scrollTop >= this.tabsOffsetTopInterregional[2] && scrollTop < this.tabsOffsetTopInterregional[3]) {
      this.activeTabIndex = 2;
    } else if (scrollTop >= this.tabsOffsetTopInterregional[3] && scrollTop < this.tabsOffsetTopInterregional[4]) {
      this.activeTabIndex = 3;
    } else {
      this.activeTabIndex = 3;
    }
  }
  public handlerClickTabItem(index: number) {
    this.$refs['news-topic-wrap'].scrollTop = this.tabsOffsetTopInterregional[index];
  }
  public hanlderClickTabBack() {
    this.$router.back();
  }
}
</script>

<style lang="scss" scoped>
.news-topic-container {
  .tabs {
    display: flex;
    height: 38px;
    width: 100%;
    background: $white;
    position: fixed;
    top: 0;
    left: 0;
    padding-left: 48px;
    padding-right: 16px;
    .back {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 24px;
      color: #7b7b7b;
    }
    li {
      height: 100%;
      padding: 0 10px;
      line-height: 38px;
      text-align: center;
      font-size: 16px;
      padding-bottom: 6px;
      &.active {
        color: $red;
        position: relative;
        font-size: 18px;
        font-weight: bold;
        &::after {
          content: '';
          height: 4px;
          background: $red;
          width: 10px;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .news-topic-wrap {
    background: #f7f7f7;
    overflow: scroll;
    position: fixed;
    top: 38px;
    left: 0;
    bottom: 46px;
    width: 100%;
    box-sizing: border-box;
  }
  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 46px;
    border-top: solid 1px #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: $white;
    .input {
      width: 80%;
      height: 32px;
      box-sizing: border-box;
      margin: 0 16px;
      margin-right: 0;
      background: #f7f7f7;
      border-radius: 16px;
    }
    .comment {
      width: 10%;
      height: 100%;
      line-height: 46px;
      text-align: center;
      i {
        font-size: 22px;
      }
    }
    .share {
      width: 10%;
      line-height: 46px;
      height: 100%;
      text-align: center;
      i {
        font-size: 18px;
      }
    }
  }
}
</style>