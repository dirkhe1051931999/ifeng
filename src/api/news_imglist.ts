import request from '@/utils/request';
const api = {
  getNewsImglist: 'nine_ifeng/shortList',
};
export const getNewsImglist = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getNewsImglist + str,
    method: 'post',
  });
};
