import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import {
  getAreaYiqing,
  getEditlistFeiyan,
  getKangyiJingwai,
  getKangyiOtherGuojia,
  getKangyiQuanqiu,
  getKangyiSummary,
  getVaccinationProgress,
  loadProvinceJson,
} from 'src/api/home_tab/kangyi';

export interface IKangyiState {}

@Module({ dynamic: true, store, name: 'Kangyi' })
class User extends VuexModule implements IKangyiState {
  @Action({ rawError: true })
  public async getEditlistFeiyan(data: any) {
    const result = await getEditlistFeiyan(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getVaccinationProgress(data: any) {
    const result = await getVaccinationProgress(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getAreaYiqing(data: any) {
    const result = await getAreaYiqing(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async loadProvinceJson(data: any) {
    const result = await loadProvinceJson(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getKangyiSummary(data: any) {
    const result = await getKangyiSummary(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getKangyiJingwai(data: any) {
    const result = await getKangyiJingwai(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getKangyiQuanqiu(data: any) {
    const result = await getKangyiQuanqiu(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getKangyiOtherGuojia(data: any) {
    const result = await getKangyiOtherGuojia(data);
    return Promise.resolve(result);
  }
}

export const TabHomeKangyiModule = getModule(User);
