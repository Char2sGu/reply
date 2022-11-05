import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@reply/scrolling';

import { DateDistancePipe } from '../standalone/date-distance.pipe';
import { SearchButtonComponent } from '../standalone/search-button/search-button.component';
import { MailComponent } from './mail/mail.component';
import { MailCardComponent } from './mail-card/mail-card.component';
import { MailCardListComponent } from './mail-card-list/mail-card-list.component';
import { MailDetailLayoutComponent } from './mail-detail-layout/mail-detail-layout.component';
import { MailListLayoutComponent } from './mail-list-layout/mail-list-layout.component';
import { MailsComponent } from './mails.component';
import { MailsRoutingModule } from './mails-routing.module';

@NgModule({
  declarations: [
    MailsComponent,
    MailListLayoutComponent,
    MailDetailLayoutComponent,
    MailCardComponent,
    MailCardListComponent,
    MailComponent,
  ],
  imports: [
    CommonModule,
    MailsRoutingModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    ScrollingModule,
    DateDistancePipe,
    SearchButtonComponent,
  ],
})
export class MailsModule {}