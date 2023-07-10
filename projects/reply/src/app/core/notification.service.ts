import { forwardRef, inject, Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { map, merge, Observable } from 'rxjs';

import { BREAKPOINTS } from './breakpoint.service';

@Injectable({
  providedIn: 'root',
  useClass: forwardRef(() => SnackbarNotificationService),
})
export abstract class NotificationService {
  abstract notify(message: string, action?: string): NotificationRef;
}

export interface NotificationRef {
  event$: Observable<NotificationEvent>;
  dismiss(): void;
}

export type NotificationEvent =
  | NotificationDisplayEvent
  | NotificationDismissEvent
  | NotificationActionEvent;

export interface NotificationDisplayEvent {
  type: 'display';
}
export interface NotificationDismissEvent {
  type: 'dismiss';
}
export interface NotificationActionEvent {
  type: 'action';
}

@Injectable()
export class SnackbarNotificationService implements NotificationService {
  private breakpoints = inject(BREAKPOINTS);
  private snackbarService = inject(MatSnackBar);

  notify(message: string, action?: string | undefined): NotificationRef {
    const snackbarRef = this.snackbarService.open(message, action, {
      duration: 15 * 1000,
      ...(this.breakpoints()['tablet-portrait']
        ? { verticalPosition: 'bottom', horizontalPosition: 'right' }
        : { verticalPosition: 'top', horizontalPosition: 'center' }),
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
