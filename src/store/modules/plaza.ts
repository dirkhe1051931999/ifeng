import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getnNwsSquareColumn, getSquarerecommend } from '@/api/plaza';

export interface IPlazaState {}

@Module({ dynamic: true, store, name: 'Plaza' })
class User extends VuexModule implements IPlazaState {
  @Action({ rawError: true })
  public async getSquarerecommend(data: any) {
    const result = await getSquarerecommend(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getnNwsSquareColumn(data: any) {
    const result = await getnNwsSquareColumn(data);
    return Promise.resolve(result);
  }
}

export const PlazaModule = getModule(User);
