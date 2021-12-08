import request from '@/utils/request';
const api = {
  getRecomlistForJunshi: 'nine_ifeng/recomlist',
};
export const getRecomlistForJunshi = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getRecomlistForJunshi + str,
    method: 'post',
    data: data.formData,
  });
};
