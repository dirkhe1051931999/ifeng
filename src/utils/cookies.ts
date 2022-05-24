/***
 * @Author:hejian
 * @Date:2020-07-03 16:28:45
 * @LastModifiedBy:hejian
 * @Last Modified time:2020-07-11 17:18:00
 */

import Cookies from 'js-cookie';
import settings from '@/settings.json';
// https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#expire-cookies-in-less-than-a-day
const in30Minutes = 1 / 48;
// const inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
const config = {
  path: '/',
  expires: in30Minutes,
};
// App
const sidebarStatusKey = settings.title + '-' + 'sidebar-status';
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey);
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus, config);

const languageKey = settings.title + '-' + 'quasar-language';
export const getLanguage = () => Cookies.get(languageKey);
export const setLanguage = (language: string) => Cookies.set(languageKey, language, config);

const sizeKey = 'size';
export const getSize = () => Cookies.get(sizeKey);
export const setSize = (size: string) => Cookies.set(sizeKey, size, config);

// token
const tokenKey = settings.title + '-' + 'token';
export const getToken = () => Cookies.get(tokenKey);
export const setToken = (data: string) => Cookies.set(tokenKey, data);
export const removeToken = () => Cookies.remove(tokenKey);
// guid
const guidKey = settings.title + '-' + 'guid';
export const getGuid = (): any => Cookies.get(guidKey);
export const setGuid = (data: string) => Cookies.set(guidKey, data);
export const removeGuid = () => Cookies.remove(guidKey);
// username
const usernameKey = settings.title + '-' + 'username';
export const getUsername = (): any => Cookies.get(usernameKey);
export const setUsername = (data: string) => Cookies.set(usernameKey, data);
export const removeUsername = () => Cookies.remove(usernameKey);
// msmfastpass
const smsFastPassKey = settings.title + '-' + 'sms_fast_pass';
export const getSmsFastPass = (): any => (Cookies.get(smsFastPassKey) ? JSON.parse(Cookies.get(smsFastPassKey)) : {});
export const setSmsFastPass = (data: any) => Cookies.set(smsFastPassKey, JSON.stringify(data));
export const removeSmsFastPass = () => Cookies.remove(smsFastPassKey);
