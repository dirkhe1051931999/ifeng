// https://github.com/bevacqua/local-storage
import * as ls from 'local-storage';
import settings from '@/settings.json';

// backreason
const config_backreason_key = settings.title + '-' + 'config_backreason';
export const get_config_backreason_key = () => ls.get(config_backreason_key);
export const set_config_backreason_key = (data: string) => ls.set(config_backreason_key, data);
export const remove_config_backreason_key = () => ls.remove(config_backreason_key);
// current categories
const user_current_categories = settings.title + '-' + 'user_current_categories';
export const get_user_current_categories = () => ls.get(user_current_categories);
export const set_user_current_categories = (data: string) => ls.set(user_current_categories, data);
export const remove_user_current_categories = () => ls.remove(user_current_categories);
// bak categories
const user_bak_categories = settings.title + '-' + 'user_bak_categories';
export const get_user_bak_categories = () => ls.get(user_bak_categories);
export const set_user_bak_categories = (data: string) => ls.set(user_bak_categories, data);
export const remove_user_bak_categories = () => ls.remove(user_bak_categories);
// search-history
const user_search_history = settings.title + '-' + 'user_search_history';
export const get_user_search_history = () => ls.get(user_search_history);
export const set_user_search_history = (data: string) => ls.set(user_search_history, data);
export const remove_user_search_history = () => ls.remove(user_search_history);
// user_current_region
const user_current_region = settings.title + '-' + 'user_current_region';
export const get_user_current_region = () => ls.get(user_current_region);
export const set_user_current_region = (data: string) => ls.set(user_current_region, data);
export const remove_user_current_region = () => ls.remove(user_current_region);
// token
const tokenKey = settings.title + '-' + 'token';
export const getToken = () => ls.get(tokenKey);
export const setToken = (data: string) => ls.set(tokenKey, data);
export const removeToken = () => ls.remove(tokenKey);
// guid
const guidKey = settings.title + '-' + 'guid';
export const getGuid = (): any => ls.get(guidKey);
export const setGuid = (data: string) => ls.set(guidKey, data);
export const removeGuid = () => ls.remove(guidKey);
// username
const usernameKey = settings.title + '-' + 'username';
export const getUsername = (): any => ls.get(usernameKey);
export const setUsername = (data: string) => ls.set(usernameKey, data);
export const removeUsername = () => ls.remove(usernameKey);
// msmfastpass
const smsFastPassKey = settings.title + '-' + 'sms_fast_pass';
export const getSmsFastPass = (): any => ls.get(smsFastPassKey);
export const setSmsFastPass = (data: string) => ls.set(smsFastPassKey, data);
export const removeSmsFastPass = () => ls.remove(smsFastPassKey);
