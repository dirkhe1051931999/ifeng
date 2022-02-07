import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getLvyouNewsList } from '@/api/home_tab/lvyou';

export interface ILvyouState {}

@Module({ dynamic: true, store, name: 'Lvyou' })
class User extends VuexModule implements ILvyouState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getLvyouNewsList(data: any) {
    const result = await getLvyouNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeLvyouModule = getModule(User);
