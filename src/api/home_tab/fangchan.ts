import request from '@/utils/request';
const api = {
  getFangchanNewsList: 'nine_ifeng/regionlist',
};
export const getFangchanNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getFangchanNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
