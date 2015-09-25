///<reference path="./d/externals.d.ts" />
import ipRegex=require('ip-regex');
import {AutolinkOptions, CustomTransform} from './interfaces';
//built-in transforms

//url transform
export var url:CustomTransform = {
    pattern: (options:AutolinkOptions)=>{
        return urlRegExp(options);
    },
    transform: (options:AutolinkOptions,...result:Array<string>)=>{
        return {
            url: result[0]
        };
    },
};



//generate url regexp
function urlRegExp(options:AutolinkOptions):RegExp{
    //utility
    /// non-space printables (does NOT include ASCII chars)
    const nonspaces="[\\u00a1-\\u167f\\u1681-\\u180d\\u180f-\\u1fff\\u200c-\\u202e\\u2030-\\u205e\\u2060-\\u2fff\\u3001-\\ufefe\\uff00-\\uffff]";
    const url=options.url;
    //schemeのRegExp
    let scheme:string, schemes = url.schemes;
    if(!url.requireSchemes){
        scheme="";
    }else if(Array.isArray(schemes)){
        //some protocolsがallowされている
        scheme="(?:" + schemes.join("|") + ")://";
    }else if(url.schemes==="*"){
        //any
        scheme="[a-z]+://";
    }else{
        throw new Error("Unrecognized value for options.url.schemes");
    }

    //auth RegExp
    const auth = "(?:\\S+(?::\\S*)?@)?";
    //hostname
    const hostpart = "(?:(?:(?:[0-9a-z]|"+nonspaces+")-*)*(?:[0-9a-z]|"+nonspaces+")+)";
    const hostname = "(?:"+hostpart+"(?:\\."+hostpart+")+\\.?)";
    const host = "(?:localhost|"+ipRegex.v4().source+"|\\["+ipRegex.v6().source+"\\]|"+hostname+")";
    //port
    const port = "(?:(?::\\d{1,5})?)";
    //path
    const path = "(?:(?:/\\S*)?)";
    
    return new RegExp(scheme + auth + host + port + path,"ig");
}
