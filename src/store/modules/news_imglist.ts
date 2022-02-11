import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getNewsImglist } from 'src/api/news_imglist';

export interface INewsImglistState {}

@Module({ dynamic: true, store, name: 'NewsImglist' })
class User extends VuexModule implements INewsImglistState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getNewsImglist(data: any) {
    const result = await getNewsImglist(data);
    return Promise.resolve(result);
  }
}

export const NewsImglistModule = getModule(User);
