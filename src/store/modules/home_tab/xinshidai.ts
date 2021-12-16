import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getXinshidaiNewsList } from '@/api/home_tab/xinshidai';

export interface IXinshidaiState {}

@Module({ dynamic: true, store, name: 'Xinshidai' })
class User extends VuexModule implements IXinshidaiState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getXinshidaiNewsList(data: any) {
    const result = await getXinshidaiNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeXinshidaiModule = getModule(User);
