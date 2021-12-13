import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getCate, getCateAlbums, getDirectory, getGuesslikeRefreshForYinpin, getRecomlistForYinpin } from '@/api/home_yinpin';

export interface IYinpinState {}

@Module({ dynamic: true, store, name: 'Yinpin' })
class User extends VuexModule implements IYinpinState {
  public playPageList = [];
  @Mutation
  public SET_PLAY_PAGE_LIST(data: any) {
    this.playPageList = data;
  }
  // 获取头条数据
  @Action({ rawError: true })
  public async getRecomlistForYinpin(data: any) {
    const result = await getRecomlistForYinpin(data);
    return Promise.resolve(result);
  }
  // 刷新猜你新欢
  @Action({ rawError: true })
  public async getGuesslikeRefreshForYinpin(data: any) {
    const result = await getGuesslikeRefreshForYinpin(data);
    return Promise.resolve(result);
  }
  // 获取音频目录
  @Action({ rawError: true })
  public async getDirectory(data: any) {
    const result = await getDirectory(data);
    return Promise.resolve(result);
  }
  // 获取音频分类
  @Action({ rawError: true })
  public async getCate(data: any) {
    const result = await getCate(data);
    return Promise.resolve(result);
  }
  // 获取音频分类专辑
  @Action({ rawError: true })
  public async getCateAlbums(data: any) {
    const result = await getCateAlbums(data);
    return Promise.resolve(result);
  }
}

export const TabHomeYinpinModule = getModule(User);
