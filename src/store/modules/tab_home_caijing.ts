import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getFinance_a_and_hk_stock_market, getRecomlistForCaijing } from 'src/api/home_caijing';

export interface ICaijingState {}

@Module({ dynamic: true, store, name: 'Caijing' })
class User extends VuexModule implements ICaijingState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getRecomlistForCaijing(data: any) {
    const result = await getRecomlistForCaijing(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getFinance_a_and_hk_stock_market(data: any) {
    const result = await getFinance_a_and_hk_stock_market(data);
    return Promise.resolve(result);
  }
}

export const TabHomeCaijingModule = getModule(User);
