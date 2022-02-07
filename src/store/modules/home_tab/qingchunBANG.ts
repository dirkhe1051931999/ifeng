import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getQingchunBANGNewsList } from '@/api/home_tab/qingchunBANG';

export interface IQingchunBANGState {}

@Module({ dynamic: true, store, name: 'QingchunBANG' })
class User extends VuexModule implements IQingchunBANGState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getQingchunBANGNewsList(data: any) {
    const result = await getQingchunBANGNewsList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeQingchunBANGModule = getModule(User);
