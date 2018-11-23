import * as builtins from './builtins';
import {
  CustomTransform,
  FilledAutolinkOptions,
  BuildInTransforms,
  AutolinkOptions,
  AutolinkTransforms,
} from './interfaces';

const compiledSettingMarker = Symbol();
/**
 * Precompilation of autolink settings.
 */
export interface CompiledAutolinkSettings {
  [compiledSettingMarker]: true;
  options: FilledAutolinkOptions;
  transforms: CompiledTransform[];
}

export interface CompiledTransform {
  pattern: RegExp;
  transform: (options: FilledAutolinkOptions, ...args: string[]) => any;
}

const defaultOptions: FilledAutolinkOptions = {
  url: {
    requireSchemes: true,
    schemes: ['http', 'https'],
    attributes: {},
  },
};

/**
 * Compiled options.
 */
export function compile(
  transforms: AutolinkTransforms | undefined,
  options: AutolinkOptions | undefined,
): CompiledAutolinkSettings {
  const filledOptions = {
    url: {
      ...defaultOptions.url,
      ...(options ? options.url : {}),
    },
  };
  if (transforms == null) {
    //default
    transforms = ['url'];
  }
  const compiledTransforms = transforms.map(t =>
    compileTransform(t, filledOptions),
  );
  return {
    [compiledSettingMarker]: true,
    options: filledOptions,
    transforms: compiledTransforms,
  };
}

/**
 * Compile given setting.
 */
export function compileTransform(
  transform: BuildInTransforms | CustomTransform,
  options: FilledAutolinkOptions,
): CompiledTransform {
  const t = 'string' === typeof transform ? builtins[transform] : transform;
  const pattern = t.pattern(options);
  return {
    pattern,
    transform: t.transform,
  };
}

/**
 * Check whether given object is a compiled options.
 */
export function isCompiledOptions(
  options: unknown,
): options is CompiledAutolinkSettings {
  return options != null && (options as any)[compiledSettingMarker] === true;
}
