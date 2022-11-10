import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FlipModule } from '@reply/flip';
import { ScrollingModule } from '@reply/scrolling';

import { ContentComponent } from '../standalone/content/content.component';
import { DateDistancePipe } from '../standalone/date-distance.pipe';
import { ReadableStringsPipe } from '../standalone/readable-strings.pipe';
import { ReattachOnChangeDirective } from '../standalone/reattach-on-change.directive';
import { SearchButtonComponent } from '../standalone/search-button/search-button.component';
import { MailAvatarComponent } from './core/mail-avatar/mail-avatar.component';
import { MailDeleteButtonComponent } from './core/mail-delete-button/mail-delete-button.component';
import { MailStarButtonComponent } from './core/mail-star-button/mail-star-button.component';
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
    MailAvatarComponent,
    MailStarButtonComponent,
    MailDeleteButtonComponent,
  ],
  imports: [
    CommonModule,
    MailsRoutingModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    FlipModule,
    ScrollingModule,
    DateDistancePipe,
    SearchButtonComponent,
    ContentComponent,
    ReadableStringsPipe,
    ReattachOnChangeDirective,
  ],
})
export class MailsModule {}
