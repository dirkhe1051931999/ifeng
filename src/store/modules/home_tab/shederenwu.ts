import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getShederenwuNewsList } from '@/api/home_tab/shederenwu';

export interface IShederenwuState {}

@Module({ dynamic: true, store, name: 'Shederenwu' })
class User extends VuexModule implements IShederenwuState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getShederenwuNewsList(data: any) {
    const result = await getShederenwuNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeShederenwuModule = getModule(User);
