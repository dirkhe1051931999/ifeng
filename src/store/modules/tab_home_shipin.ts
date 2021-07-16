import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getRecomlist } from 'src/api/home_shipin';

export interface IShipinState {}

@Module({ dynamic: true, store, name: 'Shipin' })
class User extends VuexModule implements IShipinState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getRecomlist(data: any) {
    const result = await getRecomlist(data);
    return Promise.resolve(result);
  }
}

export const TabHomeShipinModule = getModule(User);
