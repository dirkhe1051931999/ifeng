import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getRecomlistForJunpintan } from '@/api/home_tab/junpintan';

export interface IJunpintanState {}

@Module({ dynamic: true, store, name: 'Junpintan' })
class User extends VuexModule implements IJunpintanState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getRecomlistForJunpintan(data: any) {
    const result = await getRecomlistForJunpintan(data);
    return Promise.resolve(result);
  }
}

export const TabHomeJunpintanModule = getModule(User);
