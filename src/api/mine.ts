import request from '@/utils/request';
const api = {
  myList: 'user_ifeng/Social_Api_Feeds/myList',
  taskList: 'user_ifeng/api_user_expv2/taskslist',
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
