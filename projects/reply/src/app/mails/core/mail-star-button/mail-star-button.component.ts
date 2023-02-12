import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, filter, tap } from 'rxjs';

import { Mail } from '../../../data/mail.model';
import { MailRepository } from '../../../data/mail.repository';

@Component({
  selector: 'rpl-mail-star-button',
  templateUrl: './mail-star-button.component.html',
  styleUrls: ['./mail-star-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailStarButtonComponent implements OnInit {
  @Input() mail!: Mail;

  click$ = new EventEmitter();
  busy$ = new BehaviorSubject(false);

  constructor(private mailService: MailRepository) {}

  ngOnInit(): void {
    this.click$
      .pipe(
        filter(() => !this.busy$.value),
        tap(() => this.busy$.next(true)),
        tap(() => {
          if (this.mail.isStarred)
            this.mailService.updateMail(this.mail.id, { isStarred: false });
          else this.mailService.updateMail(this.mail.id, { isStarred: true });
        }),
        tap(() => this.busy$.next(false)),
      )
      .subscribe();
  }
}
