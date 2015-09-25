///<reference path="./d/externals.d.ts" />
import extend=require('extend');
import escapeHtml=require('escape-html');
import {AutolinkTransforms, CustomTransform, AutolinkOptions} from './interfaces';
import * as builtins from './builtins';

export function autolink(text:string,transforms:AutolinkTransforms,options?:AutolinkOptions):string;
export function autolink(text:string,options?:AutolinkOptions):string;
export function autolink(text:string, arg1?:any, arg2?:any):string{
    var transforms:AutolinkTransforms, options:AutolinkOptions;
    if(Array.isArray(arg1)){
        transforms = arg1;
        options = arg2;
    }else{
        transforms = null;
        options = arg1;
    }

    options = extend(true, {}, defaultOptions, options);
    if(transforms==null){
        //default
        transforms=["url"];
    }
    //built-in transforms
    for(let i=0,l=transforms.length;i<l;i++){
        if("string"===typeof transforms[i]){
            transforms[i] = builtins[<string>transforms[i]];
        }
    }

    const matchings:Array<Matching> = [];
    //まず全てをmatchする
    for(let i=0,l=transforms.length;i<l;i++){
        let t=<CustomTransform>transforms[i], p=t.pattern(options);
        if(p.global!==true){
            throw new Error("Pattenrs must have its global flag set");
        }
        let o=p.exec(text);
        if(o){
            //matchした
            let j=0;
            for(;j<matchings.length;j++){
                if(o.index < matchings[j].position){
                    break;
                }
            }
            matchings.splice(j,0,{
                transform: t,
                pattern: p,
                result: o,
                position: o.index
            });
        }
    }

    let result="", idx=0;
    //matchをreplaceして解消していく
    while(matchings.length>0){
        const m=matchings[0], tr=m.transform.transform(options,...m.result);
        if(m.result[0]===""){
            throw new Error("Matching with the empty string is not allowed");
        }
        //HTMLを生成
        const html="<a href='"+escapeHtml(tr.url)+"'>"+escapeHtml(tr.text || m.result[0])+"</a>";
        //前の部分とマッチ部分を入れる
        result+=escapeHtml(text.slice(idx, m.position))+html;
        idx=m.position+m.result[0].length;
        //開始位置を通り過ぎたやつはもう使えないのでマッチし直す
        for(let i=0;i<matchings.length;i++){
            const m2=matchings[i];
            if(m2.position < idx){
                let o;
                do{
                    o=m2.pattern.exec(text);
                }while(o!=null && o.index<idx);
                if(o!=null){
                    //idxの先にマッチがあった（まだ使えるかも）
                    let j=0;
                    for(;j<matchings.length;j++){
                        if(matchings[j].position > o.index){
                            break;
                        }
                    }
                    matchings.splice(j,0,{
                        transform: m2.transform,
                        pattern: m2.pattern,
                        result: o,
                        position: o.index
                    });
                }
                //自身は消す
                matchings.splice(i,1);
                i--;
            }else{
                break;
            }
        }
    }
    //remaining text
    if(idx < text.length){
        result += escapeHtml(text.slice(idx));
    }
    return result;
}

var defaultOptions:AutolinkOptions = {
    url: {
        requireSchemes: true,
        schemes: ["http", "https"]
    }
};

interface Matching{
    transform: CustomTransform;
    pattern: RegExp;
    result: Array<string>;
    position: number;
}
