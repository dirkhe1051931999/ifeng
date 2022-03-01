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
