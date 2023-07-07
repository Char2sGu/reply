export function assertPropertyPaths<
  T extends object,
  P extends PropertyPath<T>,
>(obj: T, paths: P[]): PropertyPathNonNullable<T, P> {
  for (const path of paths) {
    let current = obj;
    for (const key of path.split('.')) {
      current = current[key as keyof typeof current];
      if (current === undefined || current === null)
        throw new Error(`Property path "${path}" is ${current}.`);
    }
  }
  return obj as PropertyPathNonNullable<T, P>;
}

export type PropertyPath<T extends object> = {
  [K in string & keyof T]: NonNullable<T[K]> extends infer O extends object
    ? K | `${K}.${PropertyPath<O>}`
    : K;
}[string & keyof T];

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

/* eslint-disable @typescript-eslint/no-unused-vars */
// interface TestObj {
//   a: { aa?: 'aa' };
//   b: { bb?: 'bb' };
//   c: 'c';
//   d: 'd';
//   e?: { ee: 'ee' };
//   f: { ff: 'ff'; fff: 'fff' };
// }

// type TestResult = PropertyPathNonNullable<
//   TestObj,
//   'a.aa' | 'b' | 'b.bb' | 'c' | 'e.ee' | 'f.ff' | 'f.fff'
// >;

// declare const test1: PropertyPathNonNullable<TestObj, 'a.aa'>;
// const assertion1: 'aa' = test1.a.aa;
// declare const test2: PropertyPathNonNullable<TestObj, 'b' | 'b.bb'>;
// const assertion2: 'bb' = test2.b.bb;
// declare const test3: PropertyPathNonNullable<TestObj, 'c'>;
// const assertion3: 'c' = test3.c;
// declare const test4: PropertyPathNonNullable<TestObj, 'c'>;
// const assertion4: 'd' = test4.d;
// declare const test5: PropertyPathNonNullable<TestObj, 'e.ee'>;
// const assertion5: 'ee' = test5.e.ee;
// declare const test6: PropertyPathNonNullable<TestObj, 'f.ff' | 'f.fff'>;
// const assertion6: { ff: 'ff'; fff: 'fff' } = test6.f;
/* eslint-enable @typescript-eslint/no-unused-vars */
