import request from '@/utils/request';
const api = {
  getEditlistFeiyan: 'nine_ifeng/editlist',
};
export const getEditlistFeiyan = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getEditlistFeiyan + str,
    method: 'post',
    data: data.formData,
  });
};
