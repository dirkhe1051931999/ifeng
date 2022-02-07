import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getYuanchuangNewsList } from '@/api/home_tab/yuanchuang';

export interface IYuanchuangState {}

@Module({ dynamic: true, store, name: 'Yuanchuang' })
class User extends VuexModule implements IYuanchuangState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getYuanchuangNewsList(data: any) {
    const result = await getYuanchuangNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeYuanchuangModule = getModule(User);
