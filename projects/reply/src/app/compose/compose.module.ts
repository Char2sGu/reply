import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { HeaderComponent } from '../standalone/header/header.component';
import { ComposeComponent } from './compose.component';
import { ComposeRoutingModule } from './compose-routing.module';

@NgModule({
  declarations: [ComposeComponent],
  imports: [
    CommonModule,
    ComposeRoutingModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    HeaderComponent,
  ],
})
export class ComposeModule {}
