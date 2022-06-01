import request from '@/utils/request';
const api = {
  myList: 'user_ifeng/Social_Api_Feeds/myList',
  taskList: 'user_ifeng/api_user_expv2/taskslist',
  getReplyMessages: 'user_ifeng/Social_Api_Message/getReplyMessages',
  getLikeMessages: 'user_ifeng/Social_Api_Message/getLikeMessages',
  getSystemReplyMessages: 'user_ifeng/Social_Api_Message/getSystemReplyMessages',
  getFollowList: 'user_ifeng//follow_pro/list',
  getFans: 'user_ifeng/Social_Api_Fans/list',
  getFavoriteList: 'user_ifeng/Api_User_FavoriteV2/getlist',
  getPushHistory: 'nine_ifeng/pushHistoryList',
  getQuanziTopData: 'group_ifeng/gateway/orgtop/top',
  getQuanziDiscover: 'group_ifeng/gateway/search/multiContentDiscover',
  getOrgBannerData: 'group_ifeng/gateway/org/multi/',
  getOrgUserList: 'group_ifeng/gateway/search/ifengUserList',
  getOrgTag: 'group_ifeng/gateway/orgtag/page',
  getOrgContent: 'group_ifeng/gateway/search/multiContent',
  getZhuiZongTop: 'external_ifeng/timeline/front/api/hot/timeline',
  getZhuiZongList: 'external_ifeng/timeline/front/api/nodes/updates',
};
export const myList = (data: any) =>
  request({
    url: api.myList + '?guid_feeds=' + data.guid_feeds,
    method: 'post',
  });
export const taskList = (data: any): any =>
  request({
    url: api.taskList,
    method: 'post',
  });
export const getReplyMessages = (data: any): any =>
  request({
    url: api.getReplyMessages + '?page=' + data.page,
    method: 'post',
  });

export const getLikeMessages = (data: any): any =>
  request({
    url: api.getLikeMessages + '?page=' + data.page,
    method: 'post',
  });
export const getSystemReplyMessages = (data: any): any =>
  request({
    url: api.getSystemReplyMessages + '?page=' + data.page,
    method: 'post',
  });
export const getFollowList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getFollowList + str,
    method: 'post',
  });
};
export const getFans = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getFans + str,
    method: 'post',
  });
};
export const getFavoriteList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getFavoriteList + str,
    method: 'post',
  });
};
export const getPushHistory = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getPushHistory + str,
    method: 'post',
  });
};
export const getQuanziTopData = (data: any): any =>
  request({
    url: api.getQuanziTopData,
    method: 'post',
    data,
  });
export const getQuanziDiscover = (data: any): any =>
  request({
    url: api.getQuanziDiscover,
    method: 'post',
    data,
  });
export const getOrgBannerData = (data: any): any =>
  request({
    url: api.getOrgBannerData + '/' + data.id,
    method: 'get',
  });
export const getOrgUserList = (data: any): any =>
  request({
    url: api.getOrgUserList,
    method: 'post',
    data,
  });
export const getOrgTag = (data: any): any =>
  request({
    url: api.getOrgTag,
    method: 'post',
    data,
  });
export const getOrgContent = (data: any): any =>
  request({
    url: api.getOrgContent,
    method: 'post',
    data,
  });
export const getZhuiZongTop = (data: any): any =>
  request({
    url: api.getZhuiZongTop,
    method: 'get',
    params: data,
  });
export const getZhuiZongList = (data: any): any =>
  request({
    url: api.getZhuiZongList,
    method: 'get',
    params: data,
  });
