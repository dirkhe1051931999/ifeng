import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getXiaoshuoList } from '@/api/home_tab/xiaoshuo';

export interface IXiaoshuoState {}

@Module({ dynamic: true, store, name: 'Xiaoshuo' })
class User extends VuexModule implements IXiaoshuoState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getXiaoshuoList(data: any) {
    const result = await getXiaoshuoList(data);
    return Promise.resolve(result);
  }
}
export const TabHomeXiaoshuoModule = getModule(User);
