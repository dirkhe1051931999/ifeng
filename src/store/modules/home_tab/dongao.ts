import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getDongaoNewsList } from '@/api/home_tab/dongao';

export interface IDongaoState {}

@Module({ dynamic: true, store, name: 'Dongao' })
class User extends VuexModule implements IDongaoState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getDongaoNewsList(data: any) {
    const result = await getDongaoNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeDongaoModule = getModule(User);
