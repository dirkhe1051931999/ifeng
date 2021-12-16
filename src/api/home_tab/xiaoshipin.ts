import request from '@/utils/request';
const api = {
  getShortVideoList: 'nine_ifeng/videoshortlist',
};
export const getShortVideoList = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getShortVideoList + str,
    method: 'post',
    data: data.formData,
  });
};
