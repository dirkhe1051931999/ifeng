import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getDianshangyanjiuyuanNewsList } from '@/api/home_tab/dianshangyanjiuyuan';

export interface IDianshangyanjiuyuanState {}

@Module({ dynamic: true, store, name: 'Dianshangyanjiuyuan' })
class User extends VuexModule implements IDianshangyanjiuyuanState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getDianshangyanjiuyuanNewsList(data: any) {
    const result = await getDianshangyanjiuyuanNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeDianshangyanjiuyuanModule = getModule(User);
