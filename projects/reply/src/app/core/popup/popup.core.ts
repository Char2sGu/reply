import { inject, InjectionToken, Type } from '@angular/core';
import { Observable } from 'rxjs';

export const POPUP_REF = new InjectionToken<PopupRef<void, void>>('POPUP_REF');

export interface PopupRef<Input, Output> {
  readonly input: Input;
  readonly event$: Observable<PopupEvent<Output>>;
  output(payload: Output): void;
  close(): void;
}

export type PopupEvent<Payload> =
  | PopupDisplayEvent
  | PopupOutputEvent<Payload>
  | PopupCloseEvent;

export interface PopupDisplayEvent {
  type: 'display';
}
export interface PopupOutputEvent<Payload> {
  type: 'output';
  payload: Payload;
}
export interface PopupCloseEvent {
  type: 'close';
}

export abstract class PopupComponent<Input, Output> {
  readonly popupRef = inject<PopupRef<Input, Output>>(POPUP_REF);
}

export interface PopupContext<Input, Output> {
  content: Type<PopupComponent<Input, Output>>;
  input: Input;
}
