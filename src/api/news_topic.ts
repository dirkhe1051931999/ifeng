import request from '@/utils/request';
const api = {
  getNewsTopic: 'nine_ifeng/newTopic',
};
export const getNewsTopic = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getNewsTopic + str,
    method: 'post',
  });
};
