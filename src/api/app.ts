import request from '@/utils/request';
const api = {
  getBaseConfig: 'config_nine_ifeng/news/base_config',
};
export const getBaseConfig = (data: any) =>
  request({
    url: api.getBaseConfig,
    method: 'get',
    params: data,
  });
