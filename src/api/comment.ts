import request from '@/utils/request';
const api = {
  getComments: 'comment_ifeng/v3/get/comments',
  getCommentsChildren: 'comment_ifeng/v3/get/children',
};
export const getComments = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getComments + str,
    method: 'post',
  });
};
export const getCommentsChildren = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getCommentsChildren + str,
    method: 'post',
  });
};
