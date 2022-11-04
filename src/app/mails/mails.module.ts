import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { DateDistancePipe } from '../shared/date-distance.pipe';
import { DirectionalScrollEventsDirective } from '../shared/directional-scroll-events.directive';
import { SearchButtonComponent } from '../shared/search-button/search-button.component';
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
  ],
  imports: [
    CommonModule,
    MailsRoutingModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    DateDistancePipe,
    DirectionalScrollEventsDirective,
    SearchButtonComponent,
  ],
})
export class MailsModule {}
