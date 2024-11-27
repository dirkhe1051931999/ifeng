import request from '@/utils/request';
const api = {
  getRecomlistForCaijing: 'nine_ifeng/recomlist',
  getFinance_a_and_hk_stock_market: 'api_iclient_ifeng/finance_a_and_hk_stock_market',
  getCaijingZhiboshi1: 'default/ifeng_web/caijing/zhiboshi1',
  getCaijingZhiboshi2: 'default/ifeng_web/caijing/zhiboshi2',
  getCaijingHangqing: 'default/ifeng_web/caijing/pindao',
  getCaijingStockUpOrDown: 'default/ifeng_web/caijing/stock_desc_asc',
  getCaijingStockKCB: 'default/ifeng_web/caijing/kcb',
  getCaijingStockSearch: 'default/ifeng_web/caijing/search',
  getCaijingStockDetail: 'default/ifeng_web/caijing/detail',
  getCaijingStockDetailGangGu: 'default/ifeng_web/caijing/detail_ganggu',
  getCaijingStockDetailKc50: 'default/ifeng_web/caijing/detail_kc50',
};
export const getRecomlistForCaijing = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
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
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getFinance_a_and_hk_stock_market + str,
    method: 'post',
    data: data.formData,
  });
};
export const getCaijingZhiboshi1 = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getCaijingZhiboshi1 + str,
    method: 'get',
  });
};
export const getCaijingZhiboshi2 = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getCaijingZhiboshi2 + str,
    method: 'get',
  });
};
export const getCaijingHangqing = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getCaijingHangqing + str,
    method: 'get',
  });
};
export const getCaijingStockUpOrDown = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getCaijingStockUpOrDown + str,
    method: 'get',
  });
};
export const getCaijingStockKCB = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getCaijingStockKCB + str,
    method: 'get',
  });
};
export const getCaijingStockSearch = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getCaijingStockSearch + str,
    method: 'get',
  });
};
export const getCaijingStockDetail = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getCaijingStockDetail + str,
    method: 'get',
  });
};
export const getCaijingStockDetailGangGu = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getCaijingStockDetailGangGu + str,
    method: 'get',
  });
};
export const getCaijingStockDetailKc50 = (data: any): any => {
  let str = '?';
  for (const key in data.params) {
    str += `${key}=${data.params[key]}&`;
  }
  str = str.slice(0, -1);
  return request({
    url: api.getCaijingStockDetailKc50 + str,
    method: 'get',
  });
};
