/**
 * Name of builtin transforms.
 */
export type BuildInTransforms = 'url';

//autolink options
export type AutolinkTransforms = Array<BuildInTransforms | CustomTransform>;
export interface CustomTransform {
  pattern(options: FilledAutolinkOptions): RegExp;
  transform(options: FilledAutolinkOptions, ...args: Array<string>): any;
}

export interface FilledAutolinkOptions {
  url: {
    requireSchemes: boolean;
    schemes: Array<string> | string;
    attributes: any;
    text?: (url: string) => string;
  };
}

export type AutolinkOptions = DeepOptional<FilledAutolinkOptions>;

/**
 * Deeply optionalize all properties.
 */
export type DeepOptional<T> =
  T extends any[] ? T :
  T extends Function ? T :
  T extends object ? {[K in keyof T]-?: DeepOptionalObject<T[K]>} : T;
type DeepOptionalObject<T> = {
    [P in keyof T]?: DeepOptional<T[P]>;
};
