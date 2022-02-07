import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getXianggangNewsList } from '@/api/home_tab/xianggang';

export interface IXianggangState {}

@Module({ dynamic: true, store, name: 'Xianggang' })
class User extends VuexModule implements IXianggangState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getXianggangNewsList(data: any) {
    const result = await getXianggangNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeXianggangModule = getModule(User);
