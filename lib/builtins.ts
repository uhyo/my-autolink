import ipRegex = require('ip-regex');
import { CustomTransform, FilledAutolinkOptions } from './interfaces';
//built-in transforms

//url transform
export const url: CustomTransform = {
  pattern: (options: FilledAutolinkOptions) => {
    return urlRegExp(options);
  },
  transform: (options: FilledAutolinkOptions, text: string, scheme: string) => {
    let url: string = text;
    if (scheme === '') {
      url = 'http://' + url;
    }
    if (options.url.text != null) {
      return {
        ... options.url.attributes,
        href: url,
        text: options.url.text(url),
      };
    }
    return {
      ... options.url.attributes, 
      href: url,
    };
  },
};

//generate url regexp
function urlRegExp(options: FilledAutolinkOptions): RegExp {
  //utility
  /// non-space printables (does NOT include ASCII chars)
  const nonspaces =
    '[\\u00a1-\\u167f\\u1681-\\u180d\\u180f-\\u1fff\\u200c-\\u202e\\u2030-\\u205e\\u2060-\\u2fff\\u3001-\\ufefe\\uff00-\\uffff]';
  const url = options.url;
  //schemeのRegExp
  let scheme: string,
    schemes = url.schemes;
  if (!url.requireSchemes) {
    scheme = '';
  } else if (Array.isArray(schemes)) {
    //some protocolsがallowされている
    scheme = '(?:' + schemes.join('|') + ')://';
  } else if (url.schemes === '*') {
    //any
    scheme = '[a-z]+://';
  } else {
    throw new Error('Unrecognized value for options.url.schemes');
  }
  scheme = '(' + scheme + ')';

  //auth RegExp
  const auth = '(?:\\S+(?::\\S*)?@)?';
  //hostname
  const hostpart =
    '(?:(?:(?:[0-9a-z]|' + nonspaces + ')-*)*(?:[0-9a-z]|' + nonspaces + ')+)';
  const hostname = '(?:' + hostpart + '(?:\\.' + hostpart + ')+\\.?)';
  const host =
    '(?:localhost|' +
    ipRegex.v4().source +
    '|\\[' +
    ipRegex.v6().source +
    '\\]|' +
    hostname +
    ')';
  //port
  const port = '(?:(?::\\d{1,5})?)';
  //path
  const path = '(?:(?:/\\S*)?)';

  return new RegExp(scheme + auth + host + port + path, 'ig');
}
