import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getIndexTips, getRegionConfig, getRegionlist } from '@/api/home_tab/chengshi';
import { get_user_current_region } from 'src/utils/db';

export interface IChengshiState {}

@Module({ dynamic: true, store, name: 'Chengshi' })
class User extends VuexModule implements IChengshiState {
  public regionList = [];
  public currentRegion = get_user_current_region() ? get_user_current_region() : '西安';
  @Mutation
  public SET_regionList(data: any) {
    this.regionList = data;
  }
  @Mutation
  public SET_currentRegion(region: string) {
    this.currentRegion = region;
  }
  @Action({ rawError: true })
  public async getRegionConfig(data: any) {
    const result = await getRegionConfig(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getRegionlist(data: any) {
    const result = await getRegionlist(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getIndexTips(data: any) {
    const result = await getIndexTips(data);
    return Promise.resolve(result);
  }
}

export const TabHomeChengshiModule = getModule(User);
