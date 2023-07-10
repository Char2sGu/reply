import { inject, Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { map, merge } from 'rxjs';

import {
  NotificationActionEvent,
  NotificationDismissEvent,
  NotificationDisplayEvent,
  NotificationRef,
  NotificationService,
} from './notification.service';

@Injectable()
export class SnackbarNotificationService implements NotificationService {
  private snackbarService = inject(MatSnackBar);

  notify(message: string, action?: string | undefined): NotificationRef {
    const snackbarRef = this.snackbarService.open(message, action, {
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
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
