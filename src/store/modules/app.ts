import { i18n } from './../../boot/i18n';
import { getLanguage } from './../../utils/cookies';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { getSidebarStatus, getSize, setSidebarStatus, setLanguage, setSize } from '@/utils/cookies';
import store from '@/store/index';
import { getBaseConfig } from 'src/api/app';
import { get_config_backreason_key } from 'src/utils/db';

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType;
  language: string;
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public device = DeviceType.Desktop;
  public refreshPage = true;
  public language = getLanguage() || 'en';
  public bottomNavigationAndHomeHeaderHeight = 145;
  public stickyNavigation = true;
  public config_backreason = get_config_backreason_key();
  @Mutation
  public SET_STICKY_NAVIGATION(status: boolean) {
    this.stickyNavigation = status;
  }
  @Mutation
  public SET_LANGUAGE(status: any) {
    i18n.locale = status;
    this.language = status;
    setLanguage(this.language);
  }
  @Mutation
  public SET_REFRESH_PAGE(status: any) {
    this.refreshPage = status;
  }
  @Action({ rawError: true })
  // 获取base config
  public async getBaseConfig(data: any) {
    const result = await getBaseConfig(data);
    return Promise.resolve(result);
  }
}

export const AppModule = getModule(App);
