import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getTuijianNewsList } from '@/api/home_tab/tuijian';

export interface ITuijianState {}

@Module({ dynamic: true, store, name: 'Tuijian' })
class User extends VuexModule implements ITuijianState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getTuijianNewsList(data: any) {
    const result = await getTuijianNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeTuijianModule = getModule(User);
