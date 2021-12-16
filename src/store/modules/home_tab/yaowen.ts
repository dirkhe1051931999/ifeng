import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getYaowenNewsList } from '@/api/home_tab/yaowen';

export interface IYaowenState {}

@Module({ dynamic: true, store, name: 'Yaowen' })
class User extends VuexModule implements IYaowenState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getYaowenNewsList(data: any) {
    const result = await getYaowenNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeYaowenModule = getModule(User);
