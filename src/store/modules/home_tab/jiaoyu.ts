import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getJiaoyuNewsList } from '@/api/home_tab/jiaoyu';

export interface IJiaoyuState {}

@Module({ dynamic: true, store, name: 'Jiaoyu' })
class User extends VuexModule implements IJiaoyuState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getJiaoyuNewsList(data: any) {
    const result = await getJiaoyuNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeJiaoyuModule = getModule(User);
