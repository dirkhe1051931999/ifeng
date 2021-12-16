import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getShortVideoList } from '@/api/home_tab/xiaoshipin';

export interface IXiaoShipinState {}

@Module({ dynamic: true, store, name: 'XiaoShipin' })
class User extends VuexModule implements IXiaoShipinState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getShortVideoList(data: any) {
    const result = await getShortVideoList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeXiaoShipinModule = getModule(User);
