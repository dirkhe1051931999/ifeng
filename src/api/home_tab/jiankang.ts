import request from '@/utils/request';
const api = {
  getJiankangNewsList: 'nine_ifeng/recomlist',
};
export const getJiankangNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getJiankangNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
