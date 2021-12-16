import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getWenchuangNewsJingxuanList, getWenchuangNewsList } from '@/api/home_tab/wenchuang';

export interface IWenchuangState {}

@Module({ dynamic: true, store, name: 'Wenchuang' })
class User extends VuexModule implements IWenchuangState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getWenchuangNewsList(data: any) {
    const result = await getWenchuangNewsList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getWenchuangNewsJingxuanList(data: any) {
    const result = await getWenchuangNewsJingxuanList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeWenchuangModule = getModule(User);
