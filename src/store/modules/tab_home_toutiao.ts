import axios from '@/utils/request';
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getHeadline, getQualityReadingList } from 'src/api/home_toutiao';

export interface IToutiaoState {}

@Module({ dynamic: true, store, name: 'Toutiao' })
class User extends VuexModule implements IToutiaoState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getHeadline(data: any) {
    const result = await getHeadline(data);
    return Promise.resolve(result);
  }
  // 质量阅读
  @Action({ rawError: true })
  public async getQualityReadingList(data: any) {
    const result = await getQualityReadingList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeToutiaoModule = getModule(User);
