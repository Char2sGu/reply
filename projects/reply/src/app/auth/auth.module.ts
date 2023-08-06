import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { DateDistancePipe } from '../shared/date-distance.pipe';
import { LogoComponent } from '../shared/logo/logo.component';
import { ScrollableAreaComponent } from '../shared/scrollable-area/scrollable-area.component';
import { TextLogoComponent } from '../shared/text-logo/text-logo.component';
import { AuthComponent } from './auth.component';
import { AuthNoAccountComponent } from './auth-no-account/auth-no-account.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthSelectAccountComponent } from './auth-select-account/auth-select-account.component';

// TODO: token expiry page

@NgModule({
  declarations: [
    AuthComponent,
    AuthNoAccountComponent,
    AuthSelectAccountComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    LogoComponent,
    TextLogoComponent,
    ScrollableAreaComponent,
    DateDistancePipe,
  ],
})
export class AuthModule {}
