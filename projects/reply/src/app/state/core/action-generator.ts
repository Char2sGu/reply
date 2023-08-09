import { ActionCreatorProps, props } from '@ngrx/store';

export function generateActionGroupEvents<
  Name extends string,
  Params,
  Events extends Record<string, ActionCreatorProps<unknown>>,
>(config: {
  name: Name;
  params: ActionCreatorProps<Params>;
  events: Events;
}): {
  [K in Name]: ActionCreatorProps<Params>;
} & {
  [EventName in string &
    keyof Events as `${Name}${Capitalize<EventName>}`]: ActionCreatorProps<
    Events[EventName] extends ActionCreatorProps<infer P>
      ? P extends void
        ? void
        : Params extends void
        ? P
        : P & { params: Params }
      : never
  >;
} {
  const result: Record<string, ActionCreatorProps<unknown>> = {};
  result[config.name] = config.params;
  for (const name in config.events) {
    const key = `${config.name}${name[0].toUpperCase()}${name.slice(1)}`;
    result[key] = props();
  }
  return result as any;
}
