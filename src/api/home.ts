import request from '@/utils/request';
const api = {
  searchHotwordSroll: 'nine_ifeng/searchHotwordSroll',
  getHotNewsRank: 'nine_ifeng/hotNewsRank',
  getHotspotlistv2: 'nine_ifeng/hotspotlistv2',
  getThemeranklist: 'nine_ifeng/themeranklist',
  getMustseelist: 'nine_ifeng/mustseelist',
  getCommentlist: 'nine_ifeng/commentlist',
  getSearchHotwordsReact: 'nine_ifeng/searchHotwordsReact',
  getSearchRecWord: 'nine_ifeng/searchRecWord',
  getSearchList: 'nine_ifeng/searchList',
  getSearchTagList: 'nine_ifeng/searchTagList',
  getSearchsubscribe: 'nine_ifeng/searchsubscribe',
  getDeviceSurveyMyList: 'uc_ifeng/Device_Survey/MyList',
};
export const searchHotwordSroll = (data: any) =>
  request({
    url: api.searchHotwordSroll,
    method: 'get',
    params: data,
  });
export const getHotNewsRank = (data: any): any =>
  request({
    url: api.getHotNewsRank,
    method: 'post',
    data: {
      ltoken: '',
    },
  });
export const getHotspotlistv2 = (data: any): any =>
  request({
    url: `${api.getHotspotlistv2}?page=1`,
    method: 'post',
    data: {
      ltoken: '',
    },
  });
export const getMustseelist = (data: any): any =>
  request({
    url: `${api.getMustseelist}?page=1`,
    method: 'post',
    data: {
      ltoken: '',
    },
  });
export const getCommentlist = (data: any): any =>
  request({
    url: `${api.getCommentlist}?page=1&token=`,
    method: 'post',
    data: {
      ltoken: '',
    },
  });
export const getSearchHotwordsReact = (data: any): any =>
  request({
    url: api.getSearchHotwordsReact,
    method: 'post',
    data,
  });
export const getSearchRecWord = (data: any): any =>
  request({
    url: `${api.getSearchRecWord}?key${data.key}`,
    method: 'post',
    data,
  });
export const getSearchList = (data: any): any =>
  request({
    url: `${api.getSearchList}?k=${data.key}&page=${data.page}`,
    method: 'post',
    data,
  });
export const getSearchTagList = (data: any): any =>
  request({
    url: `${api.getSearchTagList}?k=${data.key}&type=${data.type}&page=${data.page}`,
    method: 'post',
    data,
  });
export const getSearchsubscribe = (data: any): any =>
  request({
    url: `${api.getSearchsubscribe}?k=${data.key}&n=20&page=${data.page}`,
    method: 'post',
    data,
  });
export const getDeviceSurveyMyList = (data: any): any =>
  request({
    url: api.getDeviceSurveyMyList,
    method: 'post',
    data,
  });
