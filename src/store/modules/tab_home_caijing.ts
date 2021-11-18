import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import {
  getCaijingHangqing,
  getCaijingStockDetail,
  getCaijingStockDetailGangGu,
  getCaijingStockKCB,
  getCaijingStockSearch,
  getCaijingStockUpOrDown,
  getCaijingZhiboshi1,
  getCaijingZhiboshi2,
  getFinance_a_and_hk_stock_market,
  getRecomlistForCaijing,
} from 'src/api/home_caijing';

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
  @Action({ rawError: true })
  public async getCaijingZhiboshi1(data: any) {
    const result = await getCaijingZhiboshi1(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getCaijingZhiboshi2(data: any) {
    const result = await getCaijingZhiboshi2(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getCaijingHangqing(data: any) {
    const result = await getCaijingHangqing(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getCaijingStockUpOrDown(data: any) {
    const result = await getCaijingStockUpOrDown(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getCaijingStockKCB(data: any) {
    const result = await getCaijingStockKCB(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getCaijingStockSearch(data: any) {
    const result = await getCaijingStockSearch(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getCaijingStockDetail(data: any) {
    const result = await getCaijingStockDetail(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getCaijingStockDetailGangGu(data: any) {
    const result = await getCaijingStockDetailGangGu(data);
    return Promise.resolve(result);
  }
}

export const TabHomeCaijingModule = getModule(User);
