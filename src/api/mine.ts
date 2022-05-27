import request from '@/utils/request';
const api = {
  myList: 'user_ifeng/Social_Api_Feeds/myList',
  taskList: 'user_ifeng/api_user_expv2/taskslist',
  getReplyMessages: 'user_ifeng/Social_Api_Message/getReplyMessages',
  getLikeMessages: 'user_ifeng/Social_Api_Message/getLikeMessages',
  getSystemReplyMessages: 'user_ifeng/Social_Api_Message/getSystemReplyMessages',
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
