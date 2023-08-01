// interface TestingObj {
//   a: { aa?: 'aa' };
//   b: { bb?: 'bb' };
//   c: 'c';
//   d: 'd';
//   e?: { ee: 'ee' };
//   f: { ff: 'ff'; fff: 'fff' };
// }

import { Exception } from './exceptions';

export type PropertyPath<T extends object> = {
  [K in string & keyof T]: NonNullable<T[K]> extends infer O extends object
    ? K | `${K}.${PropertyPath<O>}`
    : K;
}[string & keyof T];

export function asserted<T extends object, P extends PropertyPath<T>>(
  obj: T,
  paths: P[],
): PropertyPathNonNullable<T, P> {
  for (const path of paths) {
    let current: object = obj;
    const segments = path.split('.');
    for (const [index, segment] of segments.entries()) {
      current = current[segment as keyof typeof current];
      if (current === undefined || current === null) {
        const currentPath = segments.slice(0, index + 1).join('.');
        throw new PropertyPathAssertionException(path, currentPath, current);
      }
    }
  }
  return obj as PropertyPathNonNullable<T, P>;
}

export type PropertyPathNonNullable<
  T extends object,
  P extends PropertyPath<T>,
> = {
  [K in string & keyof T as (K | `${K}.${string}`) & P extends never
    ? K
    : never]: T[K];
} & {
  [K in string & keyof T as (K | `${K}.${string}`) & P extends never
    ? never
    : K]-?: NonNullable<T[K]> extends infer V
    ? `${K}.${string}` & P extends never
      ? V
      : V extends object
      ? `${K}.${string}` & P extends `${K}.${infer PP extends PropertyPath<V>}`
        ? PropertyPathNonNullable<V, PP>
        : never
      : never
    : never;
};

// /* eslint-disable @typescript-eslint/no-unused-vars */
// declare const test1: PropertyPathNonNullable<TestingObj, 'a.aa'>;
// const assertion1: 'aa' = test1.a.aa;
// declare const test2: PropertyPathNonNullable<TestingObj, 'b' | 'b.bb'>;
// const assertion2: 'bb' = test2.b.bb;
// declare const test3: PropertyPathNonNullable<TestingObj, 'c'>;
// const assertion3: 'c' = test3.c;
// declare const test4: PropertyPathNonNullable<TestingObj, 'c'>;
// const assertion4: 'd' = test4.d;
// declare const test5: PropertyPathNonNullable<TestingObj, 'e.ee'>;
// const assertion5: 'ee' = test5.e.ee;
// declare const test6: PropertyPathNonNullable<TestingObj, 'f.ff' | 'f.fff'>;
// const assertion6: { ff: 'ff'; fff: 'fff' } = test6.f;
// /* eslint-enable @typescript-eslint/no-unused-vars */

export function access<T extends object, P extends PropertyPath<T>>(
  obj: T,
  path: P,
): NonNullable<PropertyPathValue<T, P>> {
  let current: object = obj;
  const segments = path.split('.');
  for (const [index, segment] of segments.entries()) {
    current = current[segment as keyof typeof current];
    if (current === undefined || current === null) {
      const currentPath = segments.slice(0, index + 1).join('.');
      throw new PropertyPathAssertionException(path, currentPath, current);
    }
  }
  return current as NonNullable<PropertyPathValue<T, P>>;
}

export type PropertyPathValue<
  T extends object,
  P extends PropertyPath<T>,
> = P extends string & keyof T
  ? T[P]
  : P extends `${infer K extends string & keyof T}.${infer PP}`
  ? PP extends PropertyPath<NonNullable<T[K]>>
    ? PropertyPathValue<NonNullable<T[K]>, PP>
    : never
  : never;

// /* eslint-disable @typescript-eslint/no-unused-vars */
// declare const test1: PropertyPathValue<TestingObj, 'a.aa'>;
// const assertion1: 'aa' | undefined = test1;
// declare const test2: PropertyPathValue<TestingObj, 'c'>;
// const assertion2: 'c' = test2;
// /* eslint-enable @typescript-eslint/no-unused-vars */

export class PropertyPathAssertionException extends Exception {
  constructor(path: string, currentPath: string, currentValue: unknown) {
    const msg = `When asserting path "${path}", "${currentPath}" is "${currentValue}"`;
    super(msg);
  }
}
