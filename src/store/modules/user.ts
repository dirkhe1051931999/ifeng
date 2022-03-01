import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { getUserPlatService } from '@/api/user';
import { getGuid, getSmsFastPass, getToken, getUsername } from '@/utils/db';
export interface IUserState {}

@Module({ dynamic: true, store, name: 'User' })
class User extends VuexModule implements IUserState {
  // 用户的一些基本信息
  public token = getToken() || '';
  public guid = getGuid() || '';
  public smsFastPass = getSmsFastPass() || {};
  public auth = 'F4790512BDA06FA4';
  public username = getUsername() || '';
  @Mutation
  private SET_SMSFASTPASS(data: any) {
    this.smsFastPass = data;
  }
  @Mutation
  private SET_TOKEN(data: any) {
    this.token = data;
  }
  @Mutation
  private SET_GUID(data: any) {
    this.guid = data;
  }
  @Mutation
  private SET_USERNAME(data: any) {
    this.username = data;
  }
  @Action({ rawError: true })
  public async getUserPlatService(data: any) {
    const result = await getUserPlatService(data);
    return Promise.resolve(result);
  }
}

export const UserModule = getModule(User);
