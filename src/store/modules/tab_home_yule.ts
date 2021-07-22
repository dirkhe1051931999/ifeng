import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getChasingHotSpot, getPublicScreeningCeremony, getRecomlistForYule, getUpConstellation, getVeryMuchDao } from 'src/api/home_yule';

export interface IYuleState {}

@Module({ dynamic: true, store, name: 'Yule' })
class User extends VuexModule implements IYuleState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getRecomlistForYule(data: any) {
    const result = await getRecomlistForYule(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getChasingHotSpot(data: any) {
    const result = await getChasingHotSpot(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getVeryMuchDao(data: any) {
    const result = await getVeryMuchDao(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getUpConstellation(data: any) {
    const result = await getUpConstellation(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getPublicScreeningCeremony(data: any) {
    const result = await getPublicScreeningCeremony(data);
    return Promise.resolve(result);
  }
}

export const TabHomeYuleModule = getModule(User);
