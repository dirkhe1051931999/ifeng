import request from '@/utils/request';
const api = {
  getXinshidaiNewsList: 'nine_ifeng/editlist',
};
export const getXinshidaiNewsList = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getXinshidaiNewsList + str,
    method: 'post',
    data: data.formData,
  });
};
