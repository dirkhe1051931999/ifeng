import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { hotSpotDetailListV2, hotSpotCrowdV2 } from 'src/api/news_theme';

export interface INewsThemeState {}

@Module({ dynamic: true, store, name: 'NewsTheme' })
class User extends VuexModule implements INewsThemeState {
  // 获取头条数据
  @Action({ rawError: true })
  public async hotSpotDetailListV2(data: any) {
    const result = await hotSpotDetailListV2(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async hotSpotCrowdV2(data: any) {
    const result = await hotSpotCrowdV2(data);
    return Promise.resolve(result);
  }
}

export const NewsThemeModule = getModule(User);
