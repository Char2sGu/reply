import { inject, Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Store } from '@ngrx/store';
import { map, merge } from 'rxjs';

import { CORE_STATE } from '@/app/state/core.state-entry';

import {
  NotificationActionEvent,
  NotificationDismissEvent,
  NotificationDisplayEvent,
  NotificationRef,
  NotificationService,
} from './notification.service';
import {
  SnackbarContentComponent,
  SnackbarContentContext,
} from './snackbar-content.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarNotificationService implements NotificationService {
  private store = inject(Store);
  private snackbarService = inject(MatSnackBar);

  private breakpoints = this.store.selectSignal(CORE_STATE.selectBreakpoints);

  notify(message: string, action?: string | undefined): NotificationRef {
    const snackbarRef = this.snackbarService.openFromComponent(
      SnackbarContentComponent,
      {
        data: { message, action } satisfies SnackbarContentContext,
        duration: 30 * 1000,
        ...(this.breakpoints()['tablet-portrait']
          ? {
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              panelClass: ['snackbar-notification-panel'],
            }
          : {
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              panelClass: ['snackbar-notification-panel', 'centered'],
            }),
      },
    );
    return {
      event$: merge(
        snackbarRef
          .afterOpened()
          .pipe(map((): NotificationDisplayEvent => ({ type: 'display' }))),
        snackbarRef
          .afterDismissed()
          .pipe(map((): NotificationDismissEvent => ({ type: 'dismiss' }))),
        snackbarRef
          .onAction()
          .pipe(map((): NotificationActionEvent => ({ type: 'action' }))),
      ),
      dismiss() {
        snackbarRef.dismiss();
      },
    };
  }
}
