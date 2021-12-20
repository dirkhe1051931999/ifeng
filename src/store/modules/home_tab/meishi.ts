import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getMeishiNewsList } from '@/api/home_tab/meishi';

export interface IMeishiState {}

@Module({ dynamic: true, store, name: 'Meishi' })
class User extends VuexModule implements IMeishiState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getMeishiNewsList(data: any) {
    const result = await getMeishiNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeMeishiModule = getModule(User);
