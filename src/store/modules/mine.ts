import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { myList, taskList } from '@/api/mine';

export interface IMineState {}

@Module({ dynamic: true, store, name: 'Mine' })
class User extends VuexModule implements IMineState {
  // 获取头条数据
  @Action({ rawError: true })
  public async myList(data: any) {
    const result = await myList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async taskList(data: any) {
    const result = await taskList(data);
    return Promise.resolve(result);
  }
}

export const MineModule = getModule(User);
