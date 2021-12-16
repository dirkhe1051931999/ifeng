import request from '@/utils/request';
const api = {
  getRecomlistForJunpintan: 'nine_ifeng/editlist',
};
export const getRecomlistForJunpintan = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getRecomlistForJunpintan + str,
    method: 'post',
    data: data.formData,
  });
};
