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
  [K in Exclude<keyof T, P>]: T[K];
} & {
  [K in P as `${K}.${string}` & P extends never
    ? K extends `${infer A}.${string}`
      ? A
      : K
    : never]-?: K extends string & keyof T
    ? NonNullable<T[K]>
    : K extends `${infer A extends string & keyof T}.${infer B}`
    ? NonNullable<T[A]> extends infer O extends object
      ? B extends PropertyPath<O>
        ? PropertyPathNonNullable<O, B>
        : never
      : never
    : never;
};

// type Test = PropertyPathNonNullable<
//   {
//     a: { aa?: 'aa' };
//     b: { bb?: 'bb' };
//     c: 'c';
//     d: 'd';
//     e?: { ee: 'ee' };
//     f: { ff: 'ff'; fff: 'fff' };
//   },
//   'a.aa' | 'b' | 'b.bb' | 'c' | 'e.ee' | 'f.ff' | 'f.fff'
// >;
