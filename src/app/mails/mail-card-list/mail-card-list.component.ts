import { Component, OnInit, TrackByFunction } from '@angular/core';

import { Mail } from '../shared/mail.model';
import { MAILS } from '../shared/mails';

@Component({
  selector: 'rpl-mail-card-list',
  templateUrl: './mail-card-list.component.html',
  styleUrls: ['./mail-card-list.component.scss'],
})
export class MailCardListComponent implements OnInit {
  mails: Mail[] = MAILS;
  mailTracker: TrackByFunction<Mail> = (_, mail) => mail.id;

  constructor() {}

  ngOnInit(): void {}
}
