import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InboxComponent } from './inbox.component';
import { InboxRoutingModule } from './inbox-routing.module';

@NgModule({
  declarations: [InboxComponent],
  imports: [CommonModule, InboxRoutingModule],
})
export class InboxModule {}
