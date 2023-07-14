import { inject, Injectable, Type } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { BREAKPOINTS } from '../breakpoint.service';
import { DialogOrBottomSheetPopupContainerComponent } from './dialog-or-bottom-sheet-popup-container.component';
import {
  POPUP_REF,
  PopupComponent,
  PopupRef,
  PopupService,
} from './popup.service';

@Injectable({
  providedIn: 'root',
})
export class DialogOrBottomSheetPopupService implements PopupService {
  private dialogService = inject(MatDialog);
  private bottomSheetService = inject(MatBottomSheet);
  private breakpoints = inject(BREAKPOINTS);

  popup<Input, Output>(
    content: Type<PopupComponent<Input, Output>>,
    input: Input,
  ): PopupRef<Input, Output> {
    if (this.breakpoints()['tablet-portrait'])
      return this.popupDialog(content, input);
    return this.popupBottomSheet(content, input);
  }

  popupDialog<Input, Output>(
    content: Type<PopupComponent<Input, Output>>,
    input: Input,
  ): PopupRef<Input, Output> {
    const dialogRef = this.dialogService.open(
      DialogOrBottomSheetPopupContainerComponent,
      { data: { content, input } },
    );
    return dialogRef.componentInstance.contentInjector.get<
      PopupRef<Input, Output>
    >(POPUP_REF);
  }

  popupBottomSheet<Input, Output>(
    content: Type<PopupComponent<Input, Output>>,
    input: Input,
  ): PopupRef<Input, Output> {
    const bottomSheetRef = this.bottomSheetService.open(
      DialogOrBottomSheetPopupContainerComponent,
      { data: { content, input } },
    );
    return bottomSheetRef.instance.contentInjector.get<PopupRef<Input, Output>>(
      POPUP_REF,
    );
  }
}

export interface DialogOrBottomSheetPopupContext<Input, Output> {
  content: Type<PopupComponent<Input, Output>>;
  input: Input;
}
