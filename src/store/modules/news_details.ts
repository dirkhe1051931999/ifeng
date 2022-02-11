import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { apiPhoenixtvDetails, getNewsDetails, relatedVideos } from 'src/api/news_details';

export interface INewsDetailsState {}

@Module({ dynamic: true, store, name: 'NewsDetails' })
class User extends VuexModule implements INewsDetailsState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getNewsDetails(data: any) {
    const result = await getNewsDetails(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async apiPhoenixtvDetails(data: any) {
    const result = await apiPhoenixtvDetails(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async relatedVideos(data: any) {
    const result = await relatedVideos(data);
    return Promise.resolve(result);
  }
}

export const NewsDetailsModule = getModule(User);
