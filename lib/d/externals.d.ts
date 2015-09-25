declare module "extend"{
    function _m(deep:boolean,...args:Array<any>):any;
    function _m(...args:Array<any>):any;
    export = _m;
}
declare module "ip-regex"{
    interface O{
        exact?: boolean;
    }
    function _m(options?:O):RegExp;
    namespace _m{
        export function v4(options?:O):RegExp;
        export function v6(options?:O):RegExp;
    }
    export = _m;
}
declare module "escape-html"{
    function _m(text:string):string;
    export = _m;
}
