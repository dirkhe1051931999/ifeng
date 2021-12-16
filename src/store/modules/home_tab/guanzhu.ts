import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getFollowList } from '@/api/home_tab/guanzhu';

export interface IGuanzhuState {}

@Module({ dynamic: true, store, name: 'Guanzhu' })
class User extends VuexModule implements IGuanzhuState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getGuanzhuList(data: any) {
    const result = await getFollowList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeGuanzhuModule = getModule(User);
