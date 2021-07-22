import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getNewsTopic } from 'src/api/news_topic';

export interface INewsTopicState {}

@Module({ dynamic: true, store, name: 'NewsTopic' })
class User extends VuexModule implements INewsTopicState {
  // 获取头条数据
  @Action({ rawError: true })
  public async getNewsTopic(data: any) {
    const result = await getNewsTopic(data);
    return Promise.resolve(result);
  }
}

export const NewsTopicModule = getModule(User);
