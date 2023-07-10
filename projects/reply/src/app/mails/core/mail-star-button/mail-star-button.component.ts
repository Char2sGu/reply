import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
} from '@angular/core';
import { catchError, EMPTY, Subscription } from 'rxjs';

import { NotificationService } from '@/app/core/notification.service';
import { MailRepository } from '@/app/data/mail.repository';
import { MailService } from '@/app/data/mail.service';

import { Mail } from '../../../data/mail.model';

@Component({
  selector: 'rpl-mail-star-button',
  templateUrl: './mail-star-button.component.html',
  styleUrls: ['./mail-star-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailStarButtonComponent {
  private mailRepo = inject(MailRepository);
  private mailService = inject(MailService);
  private changeDetector = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);

  @Input() mail!: Mail;

  actionSubscription = new Subscription();

  onClick(): void {
    this.actionSubscription.unsubscribe();

    const repoUpdate = this.mailRepo.patch(
      this.mail.id, //
      { isStarred: !this.mail.isStarred },
    );

    const action$ = this.mail.isStarred
      ? this.mailService.markMailAsNotStarred(this.mail.id)
      : this.mailService.markMailAsStarred(this.mail.id);

    this.actionSubscription = action$
      .pipe(
        catchError(() => {
          repoUpdate.undo();
          this.changeDetector.markForCheck();
          this.notificationService.notify('Something went wrong');
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
