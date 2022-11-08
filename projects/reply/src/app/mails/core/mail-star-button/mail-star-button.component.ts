import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, filter, Observable, tap } from 'rxjs';

import { Mail } from '../mail.model';
import { MailService } from '../mail.service';

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
  active$!: Observable<boolean>;

  constructor(private mailService: MailService) {}

  ngOnInit(): void {
    this.active$ = this.mailService.isMailStarred$(this.mail);
    this.click$
      .pipe(
        filter(() => !this.busy$.value),
        tap(() => this.busy$.next(true)),
        tap(() => {
          if (this.mailService.isMailStarred(this.mail))
            this.mailService.markMailAsNotStarred(this.mail);
          else this.mailService.markMailAsStarred(this.mail);
        }),
        tap(() => this.busy$.next(false)),
      )
      .subscribe();
  }
}
