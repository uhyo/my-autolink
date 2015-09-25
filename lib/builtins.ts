///<reference path="./externals.d.ts" />
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
    const http=options.http;
    //schemeのRegExp
    let scheme:string, schemes = options.http.schemes;
    if(!options.http.requireSchemes){
        scheme="";
    }else if(Array.isArray(schemes)){
        //some protocolsがallowされている
        scheme="(?:" + schemes.join("|") + ")://";
    }else if(options.http.schemes==="*"){
        //any
        scheme="[a-z]+://";
    }else{
        throw new Error("Unrecognized value for options.http.schemes");
    }

    //auth RegExp
    const auth = "(?:\\S+(?::\\S*)?@)?";
    //hostname
    const hostpart = "(?:(?:(?:[0-9a-z]|"+nonspaces+")-*)*(?:[0-9a-z]|"+nonspaces+")+)";
    const hostname = "(?:"+hostpart+"(?:\\."+hostpart+")+\\.?)";
    const host = "(?:localhost|"+ipRegex.v4().source+"|"+hostname+")";
    //port
    const port = "(?:(?::\\d{1,5})?)";
    //path
    const path = "(?:(?:/\\S*)?)";
    
    return new RegExp(scheme + auth + host + port + path,"i");
}
