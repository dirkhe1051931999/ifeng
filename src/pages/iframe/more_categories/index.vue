<template>
  <div class="tabs-slide-page-more-categories-container">
    <div class="header">
      <span>频道管理</span>
      <q-icon name="close" @click="handlerClickClose" class="close"></q-icon>
    </div>
    <div class="tabs-slide-page-more-categories-wrapper" ref="tabs-slide-page-more-categories-wrapper">
      <div class="scroll-content">
        <div class="edit">
          <div class="l">
            <span class="text">我的频道</span>
            <span class="tip">{{ enableDraggle ? '拖动频道进行排序' : '点击进入频道' }}</span>
          </div>
          <button class="r" @click="handlerClickEdit">{{ enableDraggle ? '完成' : '编辑' }}</button>
        </div>
        <draggable
          v-if="currentUserCategories.length"
          :list="currentUserCategories"
          :disabled="!enableDraggle"
          @change="handlerDragend"
          class="list-group"
          ghost-class="ghost"
          draggable=".drag-item"
        >
          <button
            class="list-group-item"
            v-for="(element, index) in currentUserCategories"
            :key="element.id"
            :class="[element.name.length > 2 ? 'fs-12' : 'fs-16', element.name === '关注' || element.name === '头条' ? 'fixed-item' : 'drag-item']"
          >
            {{ element.name }}
            <span
              class="iconfont icon-close2 remove"
              v-show="enableDraggle && element.name !== '关注' && element.name !== '头条'"
              @click.prevent="handlerClickRemoveItem(element, index)"
            ></span>
          </button>
        </draggable>
        <div class="more">
          <div class="l">
            <span class="text">更多频道</span>
            <span class="tip">{{ enableDraggle ? '点击增加频道' : '' }}</span>
          </div>
        </div>
        <ul class="list-group">
          <button
            class="list-group-item"
            v-for="(element, index) in bakUserCategories"
            :key="element.id"
            :class="[element.name.length > 2 ? 'fs-12' : 'fs-16']"
            @click="handlerClickBakItem(element, index)"
          >
            {{ element.name }}
          </button>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import { get_user_bak_categories, get_user_current_categories, set_user_bak_categories, set_user_current_categories } from 'src/utils/db';
import { cloneDeep } from 'lodash';
import { bakCategories, defaultCategories } from 'src/utils/categories';

@Component({
  name: 'tabs_slide_page_more_categories',
  components: {
    draggable,
  },
})
export default class extends Vue {
  $refs: any;
  public currentUserCategories: any = get_user_current_categories() ? cloneDeep(get_user_current_categories()) : cloneDeep(defaultCategories);
  public bakUserCategories: any = get_user_bak_categories() ? cloneDeep(get_user_bak_categories()) : cloneDeep(bakCategories);
  created() {}
  mounted() {
    const $scroll: any = this.$refs['tabs-slide-page-more-categories-wrapper'];
    $scroll.style['height'] = window.innerHeight - 32 + 'px';
  }
  beforeDestroy() {
    this.enableDraggle = false;
  }
  private allCategories = [1, 2, 3, 4, 56, 7];
  private enableDraggle = false;
  /*event */
  private handlerClickClose() {
    this.$router.back();
  }
  private handlerClickEdit() {
    this.enableDraggle = !this.enableDraggle;
    if (!this.enableDraggle) {
      set_user_current_categories(this.currentUserCategories);
      set_user_bak_categories(this.bakUserCategories);
    }
  }
  private handlerClickRemoveItem(item: any, index: number) {
    this.bakUserCategories.unshift(item);
    this.currentUserCategories.splice(index, 1);
  }
  private handlerClickBakItem(item: any, index: number) {
    if (!this.enableDraggle) return;
    this.currentUserCategories.push(item);
    this.bakUserCategories.splice(index, 1);
  }
  private handlerDragend(data: any) {
    for (let i = 0; i < this.currentUserCategories.length; i++) {
      this.currentUserCategories[i].index = String(i);
    }
  }
  /*http */
}
</script>

<style lang="scss" scoped>
.tabs-slide-page-more-categories-container {
  .ghost {
    color: $yellow;
    background: #fee3e3 !important;
    color: #f54c4c;
  }
  .header {
    height: 32px;
    line-height: 32px;
    background: #ffffff;
    text-align: center;
    position: relative;
    z-index: 100;
    .close {
      position: absolute;
      top: 50%;
      right: 0;
      right: 16px;
      transform: translateY(-50%);
    }
  }
  .tabs-slide-page-more-categories-wrapper {
    background: #ffffff;
    width: 100%;
    box-sizing: border-box;
    z-index: 9999;
    position: fixed;
    left: 0;
    top: 32px;
    overflow: scroll;
    .scroll-content {
      .edit {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 16px 0;
        width: 100%;
        box-sizing: border-box;
        .l {
          .text {
            margin-right: 10px;
          }
          .tip {
            color: #adadad;
            font-size: 12px;
          }
        }
        .r {
          background: #fee3e3;
          color: #f54c4c;
          font-size: 12px;
          width: 48px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          border-radius: 16px;
          border: 0;
          outline: 0;
        }
      }
      .more {
        padding: 0 16px 0;
        width: 100%;
        box-sizing: border-box;
        .l {
          .text {
            margin-right: 10px;
          }
          .tip {
            color: #adadad;
            font-size: 12px;
          }
        }
      }
      .list-group {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 16px 16px;
        .list-group-item {
          border: 0;
          outline: 0;
          width: 22%;
          height: 32px;
          line-height: 32px;
          border-radius: 18px;
          text-align: center;
          margin-right: 3.6%;
          margin-bottom: 10px;
          background: #f7f7f7;
          position: relative;
          &:nth-of-type(4n + 4) {
            margin-right: 0;
          }
          &.fixed-item {
            color: $red;
          }
          .remove {
            position: absolute;
            top: -12px;
            color: #adadad;
            font-size: 12px;
            left: -4px;
          }
        }
      }
    }
  }
}
</style>