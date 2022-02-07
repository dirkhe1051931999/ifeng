import request from '@/utils/request';
const api = {
  getDianshangyanjiuyuanNewsList: 'nine_ifeng/editmixlist',
};
export const getDianshangyanjiuyuanNewsList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getDianshangyanjiuyuanNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
