import request from '@/utils/request';
const api = {
  getData: 'proxy/1/7.3.23/buffer/getMatchs?crt=1624012178001&night=0&channel=myapp&sign=d908b82e4c60d09e5adf60929159ca71&client=d55e68a16fb20c1b',
};
export const getData = (data: any) =>
  request({
    url: api.getData,
    method: 'get',
  });
