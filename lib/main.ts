import escapeHtml = require('escape-html');
import {
  AutolinkTransforms,
  AutolinkOptions,
} from './interfaces';
import { compile, CompiledTransform } from './compile';

export function autolink(
  text: string,
  transforms: AutolinkTransforms,
  options?: AutolinkOptions,
): string;
export function autolink(text: string, options?: AutolinkOptions): string;
export function autolink(text: string, arg1?: any, arg2?: any): string {
  let transforms: AutolinkTransforms | undefined;
  let options: AutolinkOptions | undefined;
  if (Array.isArray(arg1)) {
    transforms = arg1;
    options = arg2;
  } else {
    transforms = undefined;
    options = arg1;
  }

  const compiled = compile(transforms, options);

  const matchings: Array<Matching> = [];
  //まず全てをmatchする
  for (const t of compiled.transforms) {
    const { pattern } = t;
    if (pattern.global !== true) {
      throw new Error('Pattenrs must have its global flag set');
    }
    const o = pattern.exec(text);
    if (o) {
      //matchした
      let j = 0;
      for (; j < matchings.length; j++) {
        if (o.index < matchings[j].position) {
          break;
        }
      }
      matchings.splice(j, 0, {
        transform: t,
        pattern,
        result: o,
        position: o.index,
      });
    }
  }

  let result = '',
    idx = 0;
  //matchをreplaceして解消していく
  while (matchings.length > 0) {
    const m = matchings[0],
      tr = m.transform.transform(compiled.options, ...m.result);
    if (m.result[0] === '') {
      throw new Error('Matching with the empty string is not allowed');
    }
    //HTMLを生成
    const html = generateA(tr, m.result[0]);
    //前の部分とマッチ部分を入れる
    result += escapeHtml(text.slice(idx, m.position)) + html;
    idx = m.position + m.result[0].length;
    //開始位置を通り過ぎたやつはもう使えないのでマッチし直す
    for (let i = 0; i < matchings.length; i++) {
      const m2 = matchings[i];
      if (m2.position < idx) {
        let o;
        do {
          o = m2.pattern.exec(text);
        } while (o != null && o.index < idx);
        if (o != null) {
          //idxの先にマッチがあった（まだ使えるかも）
          let j = 0;
          for (; j < matchings.length; j++) {
            if (matchings[j].position > o.index) {
              break;
            }
          }
          matchings.splice(j, 0, {
            transform: m2.transform,
            pattern: m2.pattern,
            result: o,
            position: o.index,
          });
        }
        //自身は消す
        matchings.splice(i, 1);
        i--;
      } else {
        break;
      }
    }
  }
  //remaining text
  if (idx < text.length) {
    result += escapeHtml(text.slice(idx));
  }
  return result;
}

interface Matching {
  transform: CompiledTransform;
  pattern: RegExp;
  result: Array<string>;
  position: number;
}

function generateA(obj: any, defaultText: string): string {
  let result = '<a';
  for (let key in obj) {
    //属性
    if (key !== 'text' && obj[key] != null) {
      result += ' ' + escapeHtml(key) + "='" + escapeHtml(obj[key]) + "'";
    }
  }
  result += '>' + escapeHtml(obj.text || defaultText) + '</a>';
  return result;
}
