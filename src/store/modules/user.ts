import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { api_user_userbasic, checkMobile, getCaptcha, getUserPlatService, sendMsgByClick, smsFastPass } from '@/api/user';
import { getGuid, getSmsFastPass, getToken, getUsername, setGuid, setSmsFastPass, setToken, setUsername } from '@/utils/db';

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
  @Action({ rawError: true })
  public async sendMsgByClick(data: any) {
    const result = await sendMsgByClick(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async getCaptcha(data: any) {
    const result = await getCaptcha(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async checkMobile(data: any) {
    const result = await checkMobile(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async toSmsFastPass(_data: any) {
    const { code, data } = await smsFastPass(_data);
    if (code === 1 && data) {
      this.SET_SMSFASTPASS(data);
      setSmsFastPass(data);
      this.SET_TOKEN(data.token);
      setToken(data.token);
      this.SET_USERNAME(data.uname);
      setUsername(data.uname);
      this.SET_GUID(data.guid);
      setGuid(data.guid);
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }
  @Action({ rawError: true })
  public async api_user_userbasic(data: any) {
    const result = await api_user_userbasic(data);
    return Promise.resolve(result);
  }
}

export const UserModule = getModule(User);
