import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import dayjs from 'dayjs/esm';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { ContactRepository } from '@/app/data/contact.repository';
import { Mail } from '@/app/data/mail.model';
import { MailboxRepository } from '@/app/data/mailbox.repository';

@Component({
  selector: 'rpl-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultListComponent implements OnInit {
  contactRepo = inject(ContactRepository);
  mailboxRepo = inject(MailboxRepository);

  @Input() set mails(v: Mail[]) {
    this.mails$.next(v);
  }

  mails$ = new BehaviorSubject<Mail[]>([]);
  mailsGroups$!: Observable<MailGroup[]>;

  constructor() {}

  ngOnInit(): void {
    this.mailsGroups$ = this.mails$.pipe(
      map((mails) => {
        const grouped: Record<string, Mail[]> = {
          ['Yesterday']: [],
          ['This Week']: [],
          ['Earlier']: [],
        };
        mails.forEach((mail) => {
          if (dayjs().subtract(1, 'day').isBefore(mail.sentAt))
            grouped['Yesterday'].push(mail);
          else if (dayjs().subtract(1, 'week').isBefore(mail.sentAt))
            grouped['This Week'].push(mail);
          else grouped['Earlier'].push(mail);
        });
        return [
          { name: 'Yesterday', items: grouped['Yesterday'] },
          { name: 'This Week', items: grouped['This Week'] },
          { name: 'Earlier', items: grouped['Earlier'] },
        ];
      }),
    );
  }
}

interface MailGroup {
  name: string;
  items: Mail[];
}
