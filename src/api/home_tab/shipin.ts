import request from '@/utils/request';
const api = {
  getRecomlist: 'nine_ifeng/recomlist',
};
export const getRecomlist = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getRecomlist + str,
    method: 'post',
    data: data.formData,
  });
};
