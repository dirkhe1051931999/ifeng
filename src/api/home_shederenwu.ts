import request from '@/utils/request';
const api = {
  getShederenwuNewsList: 'nine_ifeng/editlist',
};
export const getShederenwuNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getShederenwuNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
