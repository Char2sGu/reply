import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { LayoutProjectionModule } from '@layout-projection/angular';
import { ScrollingModule } from '@reply/scrolling';

import { ContactSortPipe } from '../data/contact-sort.pipe';
import { ContactStringifyPipe } from '../data/contact-stringify.pipe';
import { ResolveRefPipe } from '../data/resolve-ref.pipe';
import { AvatarComponent } from '../shared/avatar/avatar.component';
import { LayoutContentDirective } from '../shared/layout-content.directive';
import { ReadableDatePipe } from '../shared/readable-date.pipe';
import { ReattachOnChangeDirective } from '../shared/reattach-on-change.directive';
import { ScrollableAreaComponent } from '../shared/scrollable-area/scrollable-area.component';
import { SearchButtonComponent } from '../shared/search-button/search-button.component';
import { MailComponent } from './core/mail/mail.component';
import { MailActionMenuButtonComponent } from './core/mail-action-menu-button/mail-action-menu-button.component';
import { MailCardComponent } from './core/mail-card/mail-card.component';
import { MailCardAnimationPresenceComponent } from './core/mail-card-animation-presence/mail-card-animation-presence.component';
import { MailCardListComponent } from './core/mail-card-list/mail-card-list.component';
import { MailDeleteButtonComponent } from './core/mail-delete-button/mail-delete-button.component';
import { MailStarButtonComponent } from './core/mail-star-button/mail-star-button.component';
import { MailDetailLayoutComponent } from './mail-detail-layout/mail-detail-layout.component';
import { MailListLayoutComponent } from './mail-list-layout/mail-list-layout.component';
import { MailsComponent } from './mails.component';
import { MailsRoutingModule } from './mails-routing.module';

// TODO: move actions to actions menu when screen is becoming smaller

@NgModule({
  declarations: [
    MailsComponent,
    MailListLayoutComponent,
    MailDetailLayoutComponent,
    MailCardComponent,
    MailCardListComponent,
    MailComponent,
    MailStarButtonComponent,
    MailDeleteButtonComponent,
    MailCardAnimationPresenceComponent,
    MailActionMenuButtonComponent,
  ],
  imports: [
    CommonModule,
    MailsRoutingModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatRippleModule,
    MatIconModule,
    LayoutProjectionModule,
    ScrollingModule,
    SearchButtonComponent,
    ScrollableAreaComponent,
    LayoutContentDirective,
    ReadableDatePipe,
    ResolveRefPipe,
    ContactSortPipe,
    ContactStringifyPipe,
    ReattachOnChangeDirective,
    AvatarComponent,
  ],
})
export class MailsModule {}
