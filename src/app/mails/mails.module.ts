import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { AvatarComponent } from '../shared/avatar/avatar.component';
import { SearchButtonComponent } from '../shared/search-button/search-button.component';
import { MailCardComponent } from './mail-card/mail-card.component';
import { MailCardListComponent } from './mail-card-list/mail-card-list.component';
import { MailsComponent } from './mails.component';
import { MailsRoutingModule } from './mails-routing.module';

@NgModule({
  declarations: [MailsComponent, MailCardComponent, MailCardListComponent],
  imports: [
    CommonModule,
    MailsRoutingModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    AvatarComponent,
    SearchButtonComponent,
  ],
})
export class MailsModule {}
