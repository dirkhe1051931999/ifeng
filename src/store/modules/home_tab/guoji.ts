import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getGuojiNewsList } from '@/api/home_tab/guoji';

export interface IGuojiState {}

@Module({ dynamic: true, store, name: 'Guoji' })
class User extends VuexModule implements IGuojiState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getGuojiNewsList(data: any) {
    const result = await getGuojiNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeGuojiModule = getModule(User);
