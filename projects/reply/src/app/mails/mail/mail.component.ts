import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, Observable } from 'rxjs';

import { Mail } from '../shared/mail.model';
import { MailService } from '../shared/mail.service';

@Component({
  selector: 'rpl-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
})
export class MailComponent implements OnInit {
  mail$!: Observable<Mail>;

  constructor(
    private route: ActivatedRoute,
    private mailService: MailService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const mailId: string = params['mailId'];
      this.mail$ = this.mailService.getMailById(mailId);
      this.mail$.pipe(first()).subscribe((mail) => {
        this.mailService.markMailAsRead(mail);
      });
    });
  }
}
