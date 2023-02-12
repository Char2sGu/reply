import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, tap } from 'rxjs';

import { Mail } from '../../../data/mail.model';
import { MailRepository } from '../../../data/mail.repository';
import { MailCardListComponent } from '../../mail-card-list/mail-card-list.component';

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

  constructor(
    private route: ActivatedRoute,
    private mailService: MailRepository,
    private listComponent: MailCardListComponent,
  ) {}

  ngOnInit(): void {
    this.click$
      .pipe(
        filter(() => !this.busy$.value),
        tap(() => this.busy$.next(true)),
        tap(() => {
          if (this.mail.isStarred)
            this.mailService.update(this.mail.id, { isStarred: false });
          else this.mailService.update(this.mail.id, { isStarred: true });
          if (this.route.snapshot.params['mailboxName'] === 'Starred')
            this.listComponent.refresh();
        }),
        tap(() => this.busy$.next(false)),
      )
      .subscribe();
  }
}
