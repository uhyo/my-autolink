
//autolink options
export type AutolinkTransforms = Array<string|CustomTransform>;
export interface CustomTransform{
    pattern(options:AutolinkOptions):RegExp;
    transform(options:AutolinkOptions,...args:Array<string>):TransformResult;
}

export interface TransformResult{
    url: string;
    text?: string;
}

export interface AutolinkOptions{
    http?: {
        requireSchemes?: boolean;
        schemes?: Array<string>|string;
    }
}
