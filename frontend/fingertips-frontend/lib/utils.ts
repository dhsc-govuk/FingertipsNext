import isPropValid from '@emotion/is-prop-valid';

// See https://github.com/emotion-js/emotion/blob/3c19ce5997f73960679e546af47801205631dfde/packages/is-prop-valid/src/props.js
// for examples of valid props
export const shouldForwardProp = (
  propName: string,
  target: unknown
): boolean => {
  return typeof target === 'string' ? isPropValid(propName) : true;
};

export const isBrowser = () => typeof window !== 'undefined';
