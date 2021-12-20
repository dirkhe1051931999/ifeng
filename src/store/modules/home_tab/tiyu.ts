import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getTiyuNewsList } from '@/api/home_tab/tiyu';

export interface ITiyuState {}

@Module({ dynamic: true, store, name: 'Tiyu' })
class User extends VuexModule implements ITiyuState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getTiyuNewsList(data: any) {
    const result = await getTiyuNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeTiyuModule = getModule(User);
