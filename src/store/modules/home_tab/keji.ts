import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import {
  getKejiNewsHuaixiaoxiList,
  getKejiNewsList,
  getKejiNewsPingceList,
  getKejiNewsRebangList,
  getKejiNewsShenduList,
  getKejiNewsXinshijieList,
  getKejiNewsYuanchuangList,
} from '@/api/home_tab/keji';

export interface IKejiState {}

@Module({ dynamic: true, store, name: 'Keji' })
class User extends VuexModule implements IKejiState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getKejiNewsList(data: any) {
    const result = await getKejiNewsList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getKejiNewsRebangList(data: any) {
    const result = await getKejiNewsRebangList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getKejiNewsXinshijieList(data: any) {
    const result = await getKejiNewsXinshijieList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getKejiNewsPingceList(data: any) {
    const result = await getKejiNewsPingceList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getKejiNewsHuaixiaoxiList(data: any) {
    const result = await getKejiNewsHuaixiaoxiList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getKejiNewsYuanchuangList(data: any) {
    const result = await getKejiNewsYuanchuangList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getKejiNewsShenduList(data: any) {
    const result = await getKejiNewsShenduList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeKejiModule = getModule(User);
