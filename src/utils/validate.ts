/***
 * @Author:hejian
 * @Date:2020-07-03 16:29:34
 * @LastModifiedBy:hejian
 * @Last Modified time:2020-07-11 17:18:23
 */

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path);

export const isArray = (arg: any) => {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
};

export const isValidURL = (url: string) => {
  const reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
  return reg.test(url);
};

export const isValid11Tel = (number: any) => {
  const reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
  return reg.test(number);
};
