import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getHotSpotDetailListV2 } from 'src/api/news_theme';

export interface INewsThemeState {}

@Module({ dynamic: true, store, name: 'NewsTheme' })
class User extends VuexModule implements INewsThemeState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getHotSpotDetailListV2(data: any) {
    const result = await getHotSpotDetailListV2(data);
    return Promise.resolve(result);
  }
}

export const NewsThemeModule = getModule(User);
