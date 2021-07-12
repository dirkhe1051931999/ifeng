import axios from '@/utils/request';
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { searchHotwordSroll } from 'src/api/home';
import { defaultCategories } from 'src/utils/categories';
const INITIAL_TAB_INDEX = 1;
const CATEGORIES = defaultCategories;
const ACTIVE_TAB_INDEX = 0;
const ACTIVE_TAB_NAME = CATEGORIES[ACTIVE_TAB_INDEX].name;
export interface ITabHomeState {}

@Module({ dynamic: true, store, name: 'TabHome' })
class TabHome extends VuexModule implements ITabHomeState {
  public activeTabIndex = ACTIVE_TAB_INDEX;
  public activeTabName = ACTIVE_TAB_NAME;
  public categories = CATEGORIES;
  public INITIAL_TAB_INDEX = INITIAL_TAB_INDEX;
  // 设置当前tabname index
  @Mutation
  public SET_activeTabIndex(index: any) {
    this.activeTabIndex = index;
  }
  // 设置当前tabname
  @Mutation
  public SET_activeTabName(name: any) {
    this.activeTabName = name;
  }
  // 获取搜索热词
  @Action({ rawError: true })
  public async searchHotwordSroll(data: any) {
    const result = await searchHotwordSroll(data);
    return Promise.resolve(result);
  }
}

export const TabHomeModule = getModule(TabHome);
