import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getG5NewsList } from '@/api/home_tab/g5';

export interface IG5State {}

@Module({ dynamic: true, store, name: 'G5' })
class User extends VuexModule implements IG5State {
  // 获取头条数据
  @Action({ rawError: true })
  public async getG5NewsList(data: any) {
    const result = await getG5NewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeG5Module = getModule(User);
