import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getJiankangNewsList } from '@/api/home_tab/jiankang';

export interface IJiankangState {}

@Module({ dynamic: true, store, name: 'Jiankang' })
class User extends VuexModule implements IJiankangState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getJiankangNewsList(data: any) {
    const result = await getJiankangNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeJiankangModule = getModule(User);
