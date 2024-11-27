import request from '@/utils/request';
const api = {
  getXiaoshuoList: 'default/ifeng_web/home_tab_xiaoshuo/index',
};
export const getXiaoshuoList = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getXiaoshuoList + str,
    method: 'get',
  });
};
