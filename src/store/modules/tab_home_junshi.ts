import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getRecomlistForJunshi } from '@/api/home_junshi';

export interface IJunshiState {}

@Module({ dynamic: true, store, name: 'Junshi' })
class User extends VuexModule implements IJunshiState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getRecomlistForJunshi(data: any) {
    const result = await getRecomlistForJunshi(data);
    return Promise.resolve(result);
  }
}

export const TabHomeJunshiModule = getModule(User);
