import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getComments, getCommentsChildren } from 'src/api/comment';

export interface ICommentsState {}

@Module({ dynamic: true, store, name: 'Comments' })
class User extends VuexModule implements ICommentsState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getComments(data: any) {
    const result = await getComments(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getCommentsChildren(data: any) {
    const result = await getCommentsChildren(data);
    return Promise.resolve(result);
  }
}

export const CommentsModule = getModule(User);
