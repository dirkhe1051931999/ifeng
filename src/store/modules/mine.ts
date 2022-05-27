import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getLikeMessages, getReplyMessages, getSystemReplyMessages, myList, taskList } from '@/api/mine';

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
  @Action({ rawError: true })
  public async getReplyMessages(data: any) {
    const result = await getReplyMessages(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getLikeMessages(data: any) {
    const result = await getLikeMessages(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getSystemReplyMessages(data: any) {
    const result = await getSystemReplyMessages(data);
    return Promise.resolve(result);
  }
}

export const MineModule = getModule(User);
