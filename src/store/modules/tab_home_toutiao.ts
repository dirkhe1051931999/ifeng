import axios from '@/utils/request';
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getHeadline } from 'src/api/home_toutiao';

export interface IUserState {}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getHeadline(data: any) {
    const result = await getHeadline(data);
    return Promise.resolve(result);
  }
}

export const TabHomeToutiaoModule = getModule(User);
