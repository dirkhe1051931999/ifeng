import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getFUNlaileNewsList } from '@/api/home_tab/FUNlaile';

export interface IFUNlaileState {}

@Module({ dynamic: true, store, name: 'FUNlaile' })
class User extends VuexModule implements IFUNlaileState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getFUNlaileNewsList(data: any) {
    const result = await getFUNlaileNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeFUNlaileModule = getModule(User);
