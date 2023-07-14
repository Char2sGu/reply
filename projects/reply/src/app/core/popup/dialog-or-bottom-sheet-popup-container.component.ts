import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { POPUP_REF, PopupRef } from '../popup/popup.service';
import { DialogOrBottomSheetPopupContext } from './dialog-or-bottom-sheet-popup.service';
import { DialogOrBottomSheetPopupRefFactory } from './dialog-or-bottom-sheet-popup-ref-factory.service';

@Component({
  selector: 'rpl-dialog-or-bottom-sheet-popup-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngComponentOutlet="contentType; injector: contentInjector" />
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogOrBottomSheetPopupContainerComponent<Input, Output> {
  private viewContainer = inject(ViewContainerRef);
  private context: DialogOrBottomSheetPopupContext<Input, Output> =
    inject(MAT_DIALOG_DATA, { optional: true }) ??
    inject(MAT_BOTTOM_SHEET_DATA);
  private dialogOrBottomSheetRef =
    inject(MatDialogRef, { optional: true }) ?? //
    inject(MatBottomSheetRef);
  private popupRefFactory = inject(DialogOrBottomSheetPopupRefFactory);

  contentType = this.context.content;
  contentInjector = this.createContentInjector();

  private createContentInjector(): Injector {
    return Injector.create({
      parent: this.viewContainer.injector,
      providers: [{ provide: POPUP_REF, useValue: this.createPopupRef() }],
    });
  }

  private createPopupRef(): PopupRef<Input, Output> {
    return this.dialogOrBottomSheetRef instanceof MatDialogRef
      ? this.popupRefFactory.createFromDialogRef(
          this.context,
          this.dialogOrBottomSheetRef,
        )
      : this.popupRefFactory.createFromBottomSheetRef(
          this.context,
          this.dialogOrBottomSheetRef,
        );
  }
}
