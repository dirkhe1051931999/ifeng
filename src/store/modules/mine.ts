import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import {
  getFans,
  getFavoriteList,
  getFollowList,
  getLikeMessages,
  getOrgBannerData,
  getOrgContent,
  getOrgTag,
  getOrgUserList,
  getPushHistory,
  getQuanziDiscover,
  getQuanziTopData,
  getReplyMessages,
  getSystemReplyMessages,
  getZhuiZongDetail,
  getZhuiZongDetailComment,
  getZhuiZongDetailComment2,
  getZhuiZongDetailPosition,
  getZhuiZongList,
  getZhuiZongTop,
  myList,
  taskList,
} from '@/api/mine';

export interface IMineState {}

@Module({ dynamic: true, store, name: 'Mine' })
class User extends VuexModule implements IMineState {
  // 获取头条数据
  @Action({ rawError: true })
  public async myList(data: any) {
    const result = await myList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async taskList(data: any) {
    const result = await taskList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getReplyMessages(data: any) {
    const result = await getReplyMessages(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getLikeMessages(data: any) {
    const result = await getLikeMessages(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getSystemReplyMessages(data: any) {
    const result = await getSystemReplyMessages(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getFollowList(data: any) {
    const result = await getFollowList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getFans(data: any) {
    const result = await getFans(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getFavoriteList(data: any) {
    const result = await getFavoriteList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getPushHistory(data: any) {
    const result = await getPushHistory(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getQuanziTopData(data: any) {
    const result = await getQuanziTopData(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getQuanziDiscover(data: any) {
    const result = await getQuanziDiscover(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getOrgBannerData(data: any) {
    const result = await getOrgBannerData(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getOrgUserList(data: any) {
    const result = await getOrgUserList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getOrgTag(data: any) {
    const result = await getOrgTag(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getOrgContent(data: any) {
    const result = await getOrgContent(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getZhuiZongList(data: any) {
    const result = await getZhuiZongList(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getZhuiZongTop(data: any) {
    const result = await getZhuiZongTop(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getZhuiZongDetail(data: any) {
    const result = await getZhuiZongDetail(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getZhuiZongDetailComment(data: any) {
    const result = await getZhuiZongDetailComment(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getZhuiZongDetailPosition(data: any) {
    const result = await getZhuiZongDetailPosition(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getZhuiZongDetailComment2(data: any) {
    const result = await getZhuiZongDetailComment2(data);
    return Promise.resolve(result);
  }
}

export const MineModule = getModule(User);
