import { inject, Type } from '@angular/core';

export interface DemoEntityFactory {
  create(payload: object): object;
}

export function useDemoEntityFactory<Factory extends DemoEntityFactory>(
  type: Type<Factory>,
): Factory['create'] {
  const instance = inject(type);
  return instance.create.bind(instance);
}
