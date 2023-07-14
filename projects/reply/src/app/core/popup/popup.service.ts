import { inject, Injectable, InjectionToken, Type } from '@angular/core';
import { Observable } from 'rxjs';

import { DialogOrBottomSheetPopupService } from './dialog-or-bottom-sheet-popup.service';

@Injectable({
  providedIn: 'root',
  useExisting: DialogOrBottomSheetPopupService,
})
export abstract class PopupService {
  abstract popup<Input, Output>(
    content: Type<PopupComponent<Input, Output>>,
    input: Input,
  ): PopupRef<Input, Output>;
}

export const POPUP_REF = new InjectionToken<PopupRef<void, void>>('POPUP_REF');

export abstract class PopupComponent<Input, Output> {
  readonly popupRef = inject<PopupRef<Input, Output>>(POPUP_REF);
}

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
