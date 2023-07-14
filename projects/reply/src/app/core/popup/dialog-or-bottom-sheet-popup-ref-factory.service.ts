import { Injectable } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { map, merge, Subject } from 'rxjs';

import {
  PopupCloseEvent,
  PopupDisplayEvent,
  PopupOutputEvent,
  PopupRef,
} from '../popup/popup.service';
import { DialogOrBottomSheetPopupContext } from './dialog-or-bottom-sheet-popup.service';
import { DialogOrBottomSheetPopupContainerComponent } from './dialog-or-bottom-sheet-popup-container.component';

@Injectable({
  providedIn: 'root',
})
export class DialogOrBottomSheetPopupRefFactory {
  createFromDialogRef<Input, Output>(
    context: DialogOrBottomSheetPopupContext<Input, Output>,
    dialogRef: MatDialogRef<
      DialogOrBottomSheetPopupContainerComponent<Input, Output>
    >,
  ): PopupRef<Input, Output> {
    const output$ = new Subject<Output>();
    return {
      input: context.input,
      event$: merge(
        dialogRef
          .afterClosed()
          .pipe(map((): PopupCloseEvent => ({ type: 'close' }))),
        dialogRef
          .afterOpened()
          .pipe(map((): PopupDisplayEvent => ({ type: 'display' }))),
        output$.pipe(
          map(
            (p): PopupOutputEvent<Output> => ({ type: 'output', payload: p }),
          ),
        ),
      ),
      output: (payload) => {
        output$.next(payload);
      },
      close: () => {
        output$.complete();
        dialogRef.close();
      },
    };
  }

  createFromBottomSheetRef<Input, Output>(
    context: DialogOrBottomSheetPopupContext<Input, Output>,
    bottomSheetRef: MatBottomSheetRef<
      DialogOrBottomSheetPopupContainerComponent<Input, Output>
    >,
  ): PopupRef<Input, Output> {
    const output$ = new Subject<Output>();
    return {
      input: context.input,
      event$: merge(
        bottomSheetRef
          .afterDismissed()
          .pipe(map((): PopupCloseEvent => ({ type: 'close' }))),
        bottomSheetRef
          .afterOpened()
          .pipe(map((): PopupDisplayEvent => ({ type: 'display' }))),
        output$.pipe(
          map(
            (p): PopupOutputEvent<Output> => ({ type: 'output', payload: p }),
          ),
        ),
      ),
      output: (payload) => {
        output$.next(payload);
      },
      close: () => {
        output$.complete();
        bottomSheetRef.dismiss();
      },
    };
  }
}
