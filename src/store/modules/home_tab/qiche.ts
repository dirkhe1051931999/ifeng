import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getQicheNewsList } from '@/api/home_tab/qiche';

export interface IQicheState {}

@Module({ dynamic: true, store, name: 'Qiche' })
class User extends VuexModule implements IQicheState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getQicheNewsList(data: any) {
    const result = await getQicheNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeQicheModule = getModule(User);
