import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getShishangNewsList } from '@/api/home_tab/shishang';

export interface IShishangState {}

@Module({ dynamic: true, store, name: 'Shishang' })
class User extends VuexModule implements IShishangState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getShishangNewsList(data: any) {
    const result = await getShishangNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeShishangModule = getModule(User);
