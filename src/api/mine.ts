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
  getZhuiZongDetail: 'external_ifeng/timeline/front/api/timelines/',
  getZhuiZongDetailComment: 'external_ifeng/timeline/front/api/timelines/',
  getZhuiZongDetailPosition: 'external_ifeng/timeline/front/api/nodes/',
  getZhuiZongDetailComment2: 'commoncomment_ifeng/queryCommentForPage',
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
export const getZhuiZongDetail = (data: any): any =>
  request({
    url: api.getZhuiZongDetail + data.id,
    method: 'get',
    params: data,
  });
export const getZhuiZongDetailComment = (data: any): any =>
  request({
    url: api.getZhuiZongDetailComment + data.id + '/bullet-comments',
    method: 'get',
    params: data,
  });
export const getZhuiZongDetailPosition = (data: any): any =>{
  console.log(api.getZhuiZongDetailPosition + data.id + '/position')
  return request({
    url: api.getZhuiZongDetailPosition + data.id + '/position',
    method: 'get',
  });
}
  
export const getZhuiZongDetailComment2 = (data: any): any =>
  request({
    url: api.getZhuiZongDetailComment2,
    method: 'post',
    data,
  });
