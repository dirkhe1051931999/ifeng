import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getTaiwanNewsList } from '@/api/home_tab/taiwan';

export interface ITaiwanState {}

@Module({ dynamic: true, store, name: 'Taiwan' })
class User extends VuexModule implements ITaiwanState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getTaiwanNewsList(data: any) {
    const result = await getTaiwanNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeTaiwanModule = getModule(User);
