import request from '@/utils/request';
const api = {
  getLvyouNewsList: 'nine_ifeng/recomlist',
};
export const getLvyouNewsList = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getLvyouNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
