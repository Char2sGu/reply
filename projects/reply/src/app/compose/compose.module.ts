import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

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
