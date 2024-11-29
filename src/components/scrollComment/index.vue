<template>
  <div class="comment">
    <div class="comment-wrap" ref="wrapper">
      <ul class="list" ref="list">
        <li v-for="item in list" :key="item.id">
          <span class="name">{{ item.name }}：</span>
          <span class="content">{{ item.content }}</span>
        </li>
      </ul>
    </div>
    <div class="rest-nums" v-show="restComment" @click="scrollBottom">{{ restComment }}条新消息</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import smoothscroll from 'smoothscroll-polyfill';
import { isScrollBottom } from '@/utils';
smoothscroll.polyfill(); // 移动端scrollTo behavior: "smooth"动画失效的polyfill

@Component
export default class extends Vue {
  public list: any = [];
  public restComment: any = 0;
  public restNums: any = 0;
  public wrapperDom: any = null;
  public listDom: any = null;
  public wrapperHeight: any = 0;
  public isBindScrolled = false;
  mounted() {
    this.initDom();
    // ajax...
    const data = new Array(20).fill('');
    this.queue(data);
    setTimeout(() => {
      const list = new Array(10).fill('');
      this.queue(list);
    }, 30000);
  }
  initDom() {
    this.wrapperDom = this.$refs.wrapper;
    this.listDom = this.$refs.list;
    this.wrapperHeight = this.wrapperDom.offsetHeight;
  }
  addTimeOut(opt: any) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.addComment(opt);
        resolve(true);
      }, 500);
    });
  }
  // 队列添加消息
  async queue(data: any) {
    for (let i = 0; i < data.length; i++) {
      const opt = {
        name: `${i}-用户名`,
        content: `${i}-评论内容`,
        id: Date.now(),
      };
      await this.addTimeOut(opt);
    }
  }
  addScroll() {
    this.listScroll, 200;
    this.isBindScrolled = true;
  }
  listScroll() {
    const ele = this.wrapperDom;
    const isBottom = isScrollBottom(ele, ele.clientHeight);
    if (isBottom) {
      this.restNums = 0;
      this.restComment = 0;
    }
  }
  // 添加评论 如果超过150条就将前50条删除
  addComment(data: any) {
    if (this.list.length >= 150) {
      this.list.splice(0, 50);
    }
    this.list.push(data);
    this.$nextTick(() => {
      this.renderComment();
    });
  }
  // 渲染评论
  renderComment() {
    const listHight = this.listDom.offsetHeight;
    const diff = listHight - this.wrapperHeight; // 列表高度与容器高度差值
    const top = this.wrapperDom.scrollTop; // 列表滚动高度
    if (diff - top < 50) {
      if (diff > 0) {
        if (this.isBindScrolled) {
          this.isBindScrolled = false;
          this.wrapperDom.removeEventListener('scroll', this.addScroll);
        }
        this.wrapperDom.scrollTo({
          top: diff + 10,
          left: 0,
          behavior: 'smooth',
        });
        this.restNums = 0;
      }
    } else {
      ++this.restNums;
      if (!this.isBindScrolled) {
        this.isBindScrolled = true;
        this.wrapperDom.addEventListener('scroll', this.addScroll);
      }
    }
    this.restComment = this.restNums >= 99 ? '99+' : this.restNums;
  }
  // 滚动到底部
  scrollBottom() {
    this.restNums = 0; // 清除剩余消息
    this.restComment = this.restNums;
    this.wrapperDom.scrollTo({
      top: this.listDom.offsetHeight,
      left: 0,
      behavior: 'smooth',
    });
  }
}
</script>

<style lang="scss" scoped>
.comment {
  width: 70%;
  height: 350px;
  position: relative;
  margin: 100px 0 0 20px;
}
.comment-wrap {
  height: 350px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.comment-wrap li {
  text-align: left;
  line-height: 30px;
  padding-left: 10px;
  background: rgba(0, 0, 0, 0.3);
  margin-top: 5px;
  border-radius: 15px;
  color: #fff;
}
.rest-nums {
  position: absolute;
  height: 24px;
  line-height: 24px;
  color: #f00;
  border-radius: 15px;
  padding: 0 15px;
  bottom: 10px;
  background: #fff;
  font-size: 14px;
  left: 10px;
}
</style>