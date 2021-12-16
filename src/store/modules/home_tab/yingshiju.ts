import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getYingshijuDajureboList, getYingshijuList } from '@/api/home_tab/yingshiju';

export interface IYingshijuState {}

@Module({ dynamic: true, store, name: 'Yingshiju' })
class User extends VuexModule implements IYingshijuState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getYingshijuList(data: any) {
    const result = await getYingshijuList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getYingshijuDajureboList(data: any) {
    const result = await getYingshijuDajureboList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeYingshijuModule = getModule(User);
