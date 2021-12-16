<template>
  <div class="user-perference-container">
    <div class="header">
      <div class="left">
        <q-icon name="arrow_back_ios_new" @click="handlerClickBack"></q-icon>
      </div>
      <div class="center">阅读偏好设置</div>
    </div>
    <div class="user-perference-wrapper" ref="user-perference-wrapper">
      <div class="userPreference">
        <div class="top">
          <div class="left">{{ selectManOrWoman.question }}</div>
        </div>
        <ul class="bottom">
          <li v-for="(item, index) in selectManOrWoman.option" :key="index" :class="item.itemId === '2' ? 'man' : 'woman'">
            <img src="~assets/man.png" alt="" v-if="item.itemId === '2'" />
            <img src="~assets/woman.png" alt="" v-else />
            {{ item.title }}
          </li>
        </ul>
      </div>
      <div class="select-tag" v-for="(item, index) in questionDataList" :key="index">
        <p class="title">{{ item.question }}</p>
        <ul>
          <li
            v-for="q in item.option"
            :key="q.itemId"
            :class="[q.title.length < 3 ? 'fs-16' : 'fs-12', q.selected === '0' ? '' : 'selected']"
            @click="handlerClickSlectTag(item, q, index)"
          >
            {{ q.title }}
            <q-icon class="check" name="check_circle" :class="q.selected === '0' ? 'hide' : ''"></q-icon>
          </li>
        </ul>
      </div>
      <div class="action-button">
        <div class="save button" @click="handlerClickSave">保存</div>
        <div class="reset button" @click="handlerClickReset">清空</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TabHomeModule } from 'src/store/modules/home';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'user-perference',
})
export default class extends Vue {
  $refs: any;
  created() {
    this._getDeviceSurveyMyList();
  }
  mounted() {
    const $wrapper = this.$refs['user-perference-wrapper'];
    $wrapper.style['height'] = window.innerHeight - 56 + 'px';
  }
  private questionDataList: any = [];
  private selectManOrWoman = {};
  /*event*/
  private handlerClickBack() {
    this.$router.back();
  }
  private handlerClickSlectTag(item: any, q: any, index: number) {
    if (item.isMulti) {
      q.selected = q.selected === '1' ? '0' : '1';
    } else {
      const cur = this.questionDataList[index];
      for (let j of cur.option) {
        if (q.title === j.title) {
          j.selected = j.selected === '1' ? '0' : '1';
        } else {
          j.selected = '0';
        }
      }
    }
  }
  private handlerClickSave() {}
  private handlerClickReset() {
    for (let cur of this.questionDataList) {
      for (let j of cur.option) {
        j.selected = '0';
      }
    }
  }
  /*http */
  private async _getDeviceSurveyMyList() {
    const formdata = new FormData();
    const data = {
      ltoken: '',
      encrypt_key:
        'nsTE81Fk5ib1eqYdBCtIXlPSF5KQ+aqsix4sRhvbPK4Oxt2lVKSXih6Obj88OY1o9sJYgOwln49kjAlKpqkeS2TXzls6CuLYYnT9ZB+Q/dIDpiKMQKS76lYtjsPZZFqAgT2svC4Xn6OFjQCcKfaLq02taL3EB+DJe9PLqUpGt5JARtd+Iv4Td1AQ8YA3box56TV+lNXMKs5aQtGe7M1DqVqupy2mOhbn/P8+OwDi8KfL87ZrUFpPMeKuDqAdjer+S5FEMTRjx5TYpLC5PF7UQNXPFjZXgz37lckey4w6kt4WfHO3AqQ5IXKkLi754ddLht5wYlg88vApt1t607Y1qA==',
      secure_params: 'TfeoW7JHT5JYf7c4tq5vVauc9BqINpZTPednlVrLvyIIONTNbnMzTtrlHeTDu/oMHfS7S5KuvkWKJ6bVzyySfRjqIMt0wUAR',
    };
    for (let key in data) {
      formdata.append(key, data[key]);
    }
    const result = await TabHomeModule.getDeviceSurveyMyList(formdata);
    this.questionDataList = result.data.slice(1);
    this.selectManOrWoman = result.data[0];
  }
}
</script>


<style lang="scss" scoped>
.user-perference-container {
  .header {
    background: $white;
    position: fixed;
    width: 100%;
    padding: 10px 16px;
    box-sizing: border-box;
    left: 0;
    top: 0;
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .user-perference-wrapper {
    position: fixed;
    left: 0;
    top: 56px;
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
    background: $white;
    overflow: scroll;
    .userPreference {
      width: 100%;
      margin-bottom: 20px;
      .top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        li {
          width: 45%;
          height: 45px;
          line-height: 45px;
          border-radius: 12px;
          margin-top: 10px;
          position: relative;
          img {
            width: 50px;
            height: 50px;
            position: absolute;
          }
          &.man {
            text-align: right;
            padding-right: 20px;
            background: #f0f4ff;
            color: #6aaff8;
            img {
              left: 10px;
              bottom: 0px;
            }
          }
          &.woman {
            text-align: left;
            padding-left: 20px;
            background: #fff0f0;
            color: #f75f5f;
            img {
              right: 10px;
              bottom: 0px;
            }
          }
        }
      }
    }
    .select-tag {
      margin-bottom: 20px;
      width: 100%;
      .title {
        padding-bottom: 10px;
      }
      ul {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        align-items: center;
        li {
          width: 31%;
          margin-right: 3%;
          height: 32px;
          text-align: center;
          border: solid 1px #eeeeee;
          margin-bottom: 10px;
          line-height: 32px;
          border-radius: 16px;
          &:nth-of-type(3n + 3) {
            margin-right: 0;
          }
          &.selected {
            position: relative;
            border: solid 1px #ff5944;
            color: $red;
            .check {
              position: absolute;
              right: 4px;
              top: 50%;
              transform: translateY(-50%);
              color: #ff5944;
            }
          }
        }
      }
    }
    .action-button {
      .button {
        width: 100%;
        height: 38px;
        line-height: 38px;
        text-align: center;
        border-radius: 38px;
      }
      .save {
        background: #f54343;
        color: $white;
      }
      .reset {
        margin-top: 10px;
      }
    }
  }
}
</style>