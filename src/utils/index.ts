export function defaultFill(val: any) {
  if (!!!val) return '--';
  else return val;
}
// loadBdScript
export function loadBdScript(scriptId: string, url: string, callback: () => void) {
  const script: any = document.createElement('script');
  script.type = 'text/javascript';
  if (script.readyState) {
    //IE
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    // Others
    script.onload = function () {
      callback();
    };
  }
  script.src = url;
  script.id = scriptId;
  document.getElementsByTagName('head')[0].appendChild(script);
}
export function getUrlParams(url: any) {
  try {
    var index = url.indexOf('?');
    url = url.match(/\?([^#]+)/)[1];
    var obj = {},
      arr = url.split('&');
    for (var i = 0; i < arr.length; i++) {
      var subArr = arr[i].split('=');
      var key = decodeURIComponent(subArr[0]);
      var value = decodeURIComponent(subArr[1]);
      obj[key] = value;
    }
    return obj;
  } catch (err) {
    console.log(err);
    return {};
  }
}
export function json2Url(data: any) {
  try {
    var tempArr = [];
    for (var i in data) {
      var key = encodeURIComponent(i);
      var value = encodeURIComponent(data[i]);
      tempArr.push(key + '=' + value);
    }
    var urlParamsStr = tempArr.join('&');
    return urlParamsStr;
  } catch (err) {
    console.log(err);
    return '';
  }
}
export function findStrImgSrc(str: any) {
  const imgReg = /<img.*?(?:>|\/>)/gi;
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  const arr = str.match(imgReg) || [];
  let result = [];
  for (var i = 0; i < arr.length; i++) {
    var src = arr[i].match(srcReg);
    result.push(src[1]);
  }
  return result;
}
