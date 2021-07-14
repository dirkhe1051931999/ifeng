import { i18n } from './../../boot/i18n';
import { getLanguage } from './../../utils/cookies';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { getSidebarStatus, getSize, setSidebarStatus, setLanguage, setSize } from '@/utils/cookies';
import store from '@/store/index';
import { getBaseConfig } from 'src/api/app';
import { get_config_backreason_key, get_user_bak_categories, get_user_current_categories } from 'src/utils/db';
import { allCategories, bakCategories, defaultCategories } from 'src/utils/categories';
import { cloneDeep } from 'lodash';
import { copy } from 'iclipboard';

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
  public shareInfo: any = {};
  public shareOptions = [
    [
      { name: '微信', icon: 'wechat' },
      { name: '朋友圈', icon: 'wechat-moments' },
      { name: '微博', icon: 'weibo' },
      { name: 'QQ', icon: 'qq' },
    ],
    [
      { name: '复制链接', icon: 'link' },
      { name: '分享海报', icon: 'poster' },
      { name: '二维码', icon: 'qrcode' },
      { name: '小程序码', icon: 'weapp-qrcode' },
    ],
  ];
  @Mutation
  public SET_ShareInfo(data: any) {
    this.shareInfo = data;
  }
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
  // 点击分享item
  @Action({ rawError: true })
  public async handlerClickShareItem(data: any) {
    if (data.name === '复制链接') {
      await copy(this.shareInfo.weburl ? this.shareInfo.weburl : 'http://www.baidu.com');
    }
    return Promise.resolve();
  }
}

export const AppModule = getModule(App);
