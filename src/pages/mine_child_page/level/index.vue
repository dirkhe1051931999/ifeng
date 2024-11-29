<template>
  <div class="level-container">
    <div class="navbar-container">
      <q-icon name="arrow_back_ios" class="arrow" @click="$router.back()"></q-icon>
      <div class="title">我的等级</div>
    </div>
    <div class="p-t-50">
      <div class="text-center p-t-10 p-b-10" v-if="loading">
        <van-loading size="12px" color="#969799">加载中...</van-loading>
      </div>
      <div class="card" v-if="!loading">
        <div class="info">
          <div class="t">
            {{ username }} <span class="exp_level">LV.{{ userLevel.exp_level }}</span>
          </div>
          <div class="b">成长值 {{ userLevel.exp_now }}</div>
        </div>
        <div class="title">
          {{ userLevel.title }}
        </div>
        <div class="progress">
          <div class="text-center text-white">{{ userLevel.exp_now }}/ {{ userLevel.exp_now + userLevel.exp_next }}</div>
          <q-linear-progress :value="userLevel.exp_now / (userLevel.exp_now + userLevel.exp_next)" class="q-mt-md" color="yellow" />
          <div class="flex a-center j-between p-t-5 text-white">
            <div class="l">Lv. {{ userLevel.exp_level }}</div>
            <div class="r">Lv. {{ userLevel.exp_level + 1 }}</div>
          </div>
        </div>
        <img src="~assets/mine/level.png" alt="" class="madel" />
      </div>
      <div class="task1 task" v-if="!loading">
        <div class="title">每日等级任务</div>
        <ul>
          <li v-for="(item, index) in task1" :key="index">
            <div :class="item.desc ? 'flex flex-column' : ''">
              <div class="flex a-center">
                <div class="type_name m-r-10">{{ item.type_name }}</div>
                <div class="fs-12">
                  <span class="reward_point text-red">{{ item.num }}</span>
                  /
                  <span class="total_num">{{ item.total_num }}</span>
                </div>
              </div>
              <div class="desc" v-if="item.desc">
                {{ item.desc }}
              </div>
            </div>
            <div class="done button" v-if="item.done">已完成</div>
            <div class="not-done button" v-else>去完成</div>
          </li>
        </ul>
      </div>
      <div class="task2 task" v-if="!loading">
        <div class="title">每日任务</div>
        <ul>
          <li v-for="(item, index) in task2" :key="index">
            <div :class="item.desc ? 'flex flex-column' : ''" class="w-p-80">
              <div class="flex a-center">
                <div class="type_name m-r-10">{{ item.type_name }}</div>
                <div class="fs-12">
                  <span class="reward_point text-red">{{ item.num }}</span>
                  /
                  <span class="total_num">{{ item.total_num }}</span>
                </div>
              </div>
              <div class="desc" v-if="item.desc">
                {{ item.desc }}
              </div>
            </div>
            <div class="done button" v-if="item.done">已完成</div>
            <div class="not-done button" v-else>去完成</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MineModule } from '@/store/modules/mine';
import { UserModule } from '@/store/modules/user';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'mine-level',
})
export default class extends Vue {
  get username() {
    return UserModule.smsFastPass.nickname;
  }
  mounted() {
    this.getTaskList();
  }
  public loading = false;
  public progress = 0;
  public userLevel = {
    exp_next: 0,
    title: '',
    exp_now: 0,
    exp_level: 0,
  };
  public task1 = [];
  public task2 = [];
  /* event */
  /* http */
  public async getTaskList() {
    this.loading = true;
    const { data } = await MineModule.taskList({});
    const { OnceExpTask, DailyExpTask, exp_next, exp_now, level, title } = data;
    this.task1 = OnceExpTask;
    this.task2 = DailyExpTask;
    this.userLevel.exp_next = Number(exp_next);
    this.userLevel.exp_now = Number(exp_now);
    this.userLevel.exp_level = level;
    this.userLevel.title = title;
    this.loading = false;
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>