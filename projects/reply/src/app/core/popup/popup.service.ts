import { inject, Injectable, Type } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { useBreakpoints } from '../breakpoint.utils';
import { POPUP_REF, PopupComponent, PopupRef } from './popup.core';
import { PopupContainerComponent } from './popup-container.component';

@Injectable({
  providedIn: 'root',
})
export abstract class PopupService {
  private dialogService = inject(MatDialog);
  private bottomSheetService = inject(MatBottomSheet);

  private breakpoints = useBreakpoints();

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
    const dialogRef = this.dialogService.open(PopupContainerComponent, {
      data: { content, input },
    });
    return dialogRef.componentInstance.contentInjector.get<
      PopupRef<Input, Output>
    >(POPUP_REF);
  }

  popupBottomSheet<Input, Output>(
    content: Type<PopupComponent<Input, Output>>,
    input: Input,
  ): PopupRef<Input, Output> {
    const bottomSheetRef = this.bottomSheetService.open(
      PopupContainerComponent,
      { data: { content, input } },
    );
    return bottomSheetRef.instance.contentInjector.get<PopupRef<Input, Output>>(
      POPUP_REF,
    );
  }
}
