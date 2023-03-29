import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { MailsComponent } from '../mails.component';

@Component({
  selector: 'rpl-mail-detail-layout',
  templateUrl: './mail-detail-layout.component.html',
  styleUrls: ['./mail-detail-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailDetailLayoutComponent implements OnInit, AfterViewInit {
  mailId$ = this.route.params.pipe(map((params) => params['mailId']));

  constructor(
    private route: ActivatedRoute,
    private mailsComponent: MailsComponent,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.mailsComponent.animateLayout(300);
  }
}
