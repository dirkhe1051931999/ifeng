import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getFangchanNewsList } from '@/api/home_tab/fangchan';

export interface IFangchanState {}

@Module({ dynamic: true, store, name: 'Fangchan' })
class User extends VuexModule implements IFangchanState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getFangchanNewsList(data: any) {
    const result = await getFangchanNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeFangchanModule = getModule(User);
