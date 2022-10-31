import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MailCardListComponent } from '../shared/mail-card-list/mail-card-list.component';
import { InboxComponent } from './inbox.component';
import { InboxRoutingModule } from './inbox-routing.module';

@NgModule({
  declarations: [InboxComponent],
  imports: [CommonModule, InboxRoutingModule, MailCardListComponent],
})
export class InboxModule {}
