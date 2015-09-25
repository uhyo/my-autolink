
//autolink options
export type AutolinkTransforms = Array<string|CustomTransform>;
export interface CustomTransform{
    pattern(options:AutolinkOptions):RegExp;
    transform(options:AutolinkOptions,...args:Array<string>):any;
}

export interface AutolinkOptions{
    url?: {
        requireSchemes?: boolean;
        schemes?: Array<string>|string;
    }
}
