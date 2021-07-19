import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getEditlistFeiyan } from 'src/api/home_kangyi';

export interface IKangyiState {}

@Module({ dynamic: true, store, name: 'Kangyi' })
class User extends VuexModule implements IKangyiState {
  @Action({ rawError: true })
  public async getEditlistFeiyan(data: any) {
    const result = await getEditlistFeiyan(data);
    return Promise.resolve(result);
  }
}

export const TabHomeKangyiModule = getModule(User);
