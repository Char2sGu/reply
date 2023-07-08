import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
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
