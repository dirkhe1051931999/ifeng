import request from '@/utils/request';
const api = {
  getTiyuNewsList: 'nine_ifeng/recomlist',
};
export const getTiyuNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getTiyuNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
