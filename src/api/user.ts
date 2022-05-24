import request from '@/utils/request';
const api = {
  getUserPlatService: 'user_ifeng/event_protal/list_lite',
  sendMsgByClick: 'id_ifeng/api/sendMsgByClick',
  getCaptcha: 'id_ifeng/api/getCaptcha',
  checkMobile: 'id_ifeng/api/checkMobile',
  smsFastPass: 'user_ifeng/Api_User_Userbasic/smsFastPass',
  api_user_userbasic: 'user_ifeng/api_user_userbasic/login',
  getUserInfo: 'user_ifeng/api_user_exp/timeline',
  logout: 'user_ifeng/Api_User_Userbasic/quit',
};
export const getUserPlatService = (data: any) =>
  request({
    url: api.getUserPlatService,
    method: 'post',
    data,
  });
export const sendMsgByClick = (data: any): any =>
  request({
    url: api.sendMsgByClick,
    method: 'post',
    data,
  });
export const getCaptcha = (data: any) =>
  request({
    url: api.getCaptcha,
    method: 'post',
    data,
  });
export const checkMobile = (data: any) => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.checkMobile + str,
    method: 'post',
  });
};
export const smsFastPass = (data: any): any =>
  request({
    url: api.smsFastPass,
    method: 'post',
    data,
  });
export const api_user_userbasic = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.api_user_userbasic + str,
    method: 'post',
  });
};
export const getUserInfo = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getUserInfo + str,
    method: 'post',
  });
};
export const logout = (data: any): any => {
  return request({
    url: api.logout,
    method: 'post',
  });
};
