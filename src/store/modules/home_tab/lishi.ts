import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getLishiNewsList } from '@/api/home_tab/lishi';

export interface ILishiState {}

@Module({ dynamic: true, store, name: 'Lishi' })
class User extends VuexModule implements ILishiState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getLishiNewsList(data: any) {
    const result = await getLishiNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeLishiModule = getModule(User);
