declare module 'ip-regex' {
    interface IpRegexOptions {
        exact?: boolean;
    }
    /**
     * Returns a regular expression for matching IP addresses (both IPv4 and IPv6).
     */
    function ipRegex(options?: IpRegexOptions): RegExp;
    namespace ipRegex {
        export function v4(options?: IpRegexOptions): RegExp;
        export function v6(options?: IpRegexOptions): RegExp;
    }

    export = ipRegex;
}