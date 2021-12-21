import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getNuanxinwenNewsList } from '@/api/home_tab/nuanxinwen';

export interface INuanxinwenState {}

@Module({ dynamic: true, store, name: 'Nuanxinwen' })
class User extends VuexModule implements INuanxinwenState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getNuanxinwenNewsList(data: any) {
    const result = await getNuanxinwenNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeNuanxinwenModule = getModule(User);
