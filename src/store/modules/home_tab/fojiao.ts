import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getFojiaoNewsList } from '@/api/home_tab/fojiao';

export interface IFojiaoState {}

@Module({ dynamic: true, store, name: 'Fojiao' })
class User extends VuexModule implements IFojiaoState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getFojiaoNewsList(data: any) {
    const result = await getFojiaoNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeFojiaoModule = getModule(User);
