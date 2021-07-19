import request from '@/utils/request';
const api = {
  getRecomlistForCaijing: 'nine_ifeng/recomlist',
  getFinance_a_and_hk_stock_market: 'api_iclient_ifeng/finance_a_and_hk_stock_market',
};
export const getRecomlistForCaijing = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getRecomlistForCaijing + str,
    method: 'post',
    data: data.formData,
  });
};
export const getFinance_a_and_hk_stock_market = (data: any): any => {
  let str = '?';
  for (let key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getFinance_a_and_hk_stock_market + str,
    method: 'post',
    data: data.formData,
  });
};
