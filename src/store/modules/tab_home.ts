import axios from '@/utils/request';
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import {
  searchHotwordSroll,
  getCommentlist,
  getHotNewsRank,
  getHotspotlistv2,
  getMustseelist,
  getThemeranklist,
  getSearchHotwordsReact,
  getSearchRecWord,
  getSearchList,
  getDeviceSurveyMyList,
  getSearchsubscribe,
  getSearchTagList,
} from 'src/api/home';

import { defaultCategories } from 'src/utils/categories';
const INITIAL_TAB_INDEX = 1;
const CATEGORIES = defaultCategories;
const ACTIVE_TAB_INDEX = 0;
const ACTIVE_TAB_NAME = CATEGORIES[ACTIVE_TAB_INDEX].name;
export interface ITabHomeState {}
interface TShowSlidePage {
  status: boolean;
  name: string;
  index?: number;
}
@Module({ dynamic: true, store, name: 'TabHome' })
class TabHome extends VuexModule implements ITabHomeState {
  public activeTabIndex = ACTIVE_TAB_INDEX;
  public activeTabName = ACTIVE_TAB_NAME;
  public categories = CATEGORIES;
  public INITIAL_TAB_INDEX = INITIAL_TAB_INDEX;
  public loadedCurrentCategoriesData = [];
  public showSlidePage = false;
  public showSlidePageName = '';
  public showSlidePageHotActiveIndex?: number = 0;
  @Mutation
  public SET_activeTabIndex_loaded(data: any) {
    this.loadedCurrentCategoriesData = data;
  }
  @Mutation
  public SET_activeTabIndex_single_loaded(id: string) {
    const index: any = this.loadedCurrentCategoriesData.findIndex((item: any) => {
      return item.id === id;
    });
    if (index === -1 || index === null) {
      throw Error('id错了');
    }
    const cur: any = this.loadedCurrentCategoriesData[index];
    cur['loaded'] = true;
  }
  @Mutation
  public SET_showSlidePage(data: TShowSlidePage) {
    this.showSlidePage = data.status;
    this.showSlidePageName = data.name;
    this.showSlidePageHotActiveIndex = data.index;
  }
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
  //  排行数据
  @Action({ rawError: true })
  public async getHotNewsRank(data: any) {
    const result = await getHotNewsRank(data);
    return Promise.resolve(result);
  }
  // 获取hot 热点
  @Action({ rawError: true })
  public async getHotspotlistv2(data: any) {
    const result = await getHotspotlistv2(data);
    return Promise.resolve(result);
  }
  // 获取hot 话题
  @Action({ rawError: true })
  public async getThemeranklist(data: any) {
    const result = await getThemeranklist(data);
    return Promise.resolve(result);
  }
  // 获取hot 必刷
  @Action({ rawError: true })
  public async getMustseelist(data: any) {
    const result = await getMustseelist(data);
    return Promise.resolve(result);
  }
  // 获取hot 评论
  @Action({ rawError: true })
  public async getCommentlist(data: any) {
    const result = await getCommentlist(data);
    return Promise.resolve(result);
  }
  // 获取搜索页数据
  @Action({ rawError: true })
  public async getSearchHotwordsReact(data: any) {
    const result = await getSearchHotwordsReact(data);
    return Promise.resolve(result);
  }
  // 搜索关键字
  @Action({ rawError: true })
  public async getSearchRecWord(data: any) {
    const result = await getSearchRecWord(data);
    return Promise.resolve(result);
  }
  // 搜索落地页 -综合
  @Action({ rawError: true })
  public async getSearchList(data: any) {
    const result = await getSearchList(data);
    return Promise.resolve(result);
  }
  // 搜索落地页 -视频、图片
  @Action({ rawError: true })
  public async getSearchTagList(data: any) {
    const result = await getSearchTagList(data);
    return Promise.resolve(result);
  }
  // 搜索落地页 -用户
  @Action({ rawError: true })
  public async getSearchsubscribe(data: any) {
    const result = await getSearchsubscribe(data);
    return Promise.resolve(result);
  }
  // 用户画像
  @Action({ rawError: true })
  public async getDeviceSurveyMyList(data: any) {
    const result = await getDeviceSurveyMyList(data);
    return Promise.resolve(result);
  }
}

export const TabHomeModule = getModule(TabHome);
