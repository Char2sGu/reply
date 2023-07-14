import { ComponentType } from '@angular/cdk/portal';
import { forwardRef, inject, Injectable, TemplateRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { map, merge, Observable } from 'rxjs';

import { BREAKPOINTS } from './breakpoint.service';

@Injectable({
  providedIn: 'root',
  useClass: forwardRef(() => DialogOrBottomSheetPopupService),
})
export class PopupService {}

export interface PopupRef {
  event$: Observable<PopupEvent>;
  dismiss(): void;
}

export type PopupEvent = PopupDisplayEvent | PopupDismissEvent;

export interface PopupDisplayEvent {
  type: 'display';
}
export interface PopupDismissEvent {
  type: 'dismiss';
}

@Injectable()
export class DialogOrBottomSheetPopupService implements PopupService {
  private dialogService = inject(MatDialog);
  private bottomSheetService = inject(MatBottomSheet);
  private breakpoints = inject(BREAKPOINTS);

  popup(content: ComponentType<any> | TemplateRef<any>): PopupRef {
    if (this.breakpoints()['tablet-portrait']) return this.popupDialog(content);
    return this.popupBottomSheet(content);
  }

  popupDialog(content: ComponentType<any> | TemplateRef<any>): PopupRef {
    const dialogRef = this.dialogService.open(content);
    return {
      event$: merge(
        dialogRef
          .afterOpened()
          .pipe(map((): PopupDisplayEvent => ({ type: 'display' }))),
        dialogRef
          .afterClosed()
          .pipe(map((): PopupDismissEvent => ({ type: 'dismiss' }))),
      ),
      dismiss() {
        dialogRef.close();
      },
    };
  }

  popupBottomSheet(content: ComponentType<any> | TemplateRef<any>): PopupRef {
    const bottomSheetRef =
      content instanceof TemplateRef
        ? this.bottomSheetService.open(content)
        : this.bottomSheetService.open(content);
    return {
      event$: merge(
        bottomSheetRef
          .afterOpened()
          .pipe(map((): PopupDisplayEvent => ({ type: 'display' }))),
        bottomSheetRef
          .afterDismissed()
          .pipe(map((): PopupDismissEvent => ({ type: 'dismiss' }))),
      ),
      dismiss() {
        bottomSheetRef.dismiss();
      },
    };
  }
}
