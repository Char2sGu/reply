import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, Observable, switchMap } from 'rxjs';

import { NotificationService } from '@/app/core/notification.service';
import { MailService } from '@/app/data/mail.service';

import { Mail } from '../../../data/mail.model';

@Component({
  selector: 'rpl-mail-star-button',
  templateUrl: './mail-star-button.component.html',
  styleUrls: ['./mail-star-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailStarButtonComponent {
  private mailService = inject(MailService);
  private notificationService = inject(NotificationService);

  @Input() mail!: Mail;

  click = new EventEmitter();

  constructor() {
    this.click
      .pipe(
        switchMap(() => this.toggleStarred()),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  toggleStarred(): Observable<void> {
    const action$ = this.mail.isStarred
      ? this.mailService.markMailAsNotStarred(this.mail)
      : this.mailService.markMailAsStarred(this.mail);
    return action$.pipe(
      catchError(() => {
        this.notificationService.notify('Something went wrong');
        return EMPTY;
      }),
    );
  }
}
