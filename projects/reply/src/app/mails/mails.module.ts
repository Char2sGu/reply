import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { LayoutProjectionModule } from '@layout-projection/angular';
import { ScrollingModule } from '@reply/scrolling';

import { ContentComponent } from '../shared/content/content.component';
import { ReadableDatePipe } from '../shared/readable-date.pipe';
import { ReadableStringsPipe } from '../shared/readable-strings.pipe';
import { ReattachOnChangeDirective } from '../shared/reattach-on-change.directive';
import { SearchButtonComponent } from '../shared/search-button/search-button.component';
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
    LayoutProjectionModule,
    ScrollingModule,
    SearchButtonComponent,
    ContentComponent,
    ReadableDatePipe,
    ReadableStringsPipe,
    ReattachOnChangeDirective,
  ],
})
export class MailsModule {}
