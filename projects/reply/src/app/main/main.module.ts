import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { LayoutProjectionModule } from '@layout-projection/angular';

import { AvatarComponent } from '../shared/avatar/avatar.component';
import { LogoComponent } from '../shared/logo/logo.component';
import { ReattachOnChangeDirective } from '../shared/reattach-on-change.directive';
import { SearchButtonComponent } from '../shared/search-button/search-button.component';
import { SettingsButtonComponent } from '../shared/settings-button/settings-button.component';
import { BaseFoundationComponent } from './base-foundation/base-foundation.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { NavAvatarButtonComponent } from './nav-avatar-button/nav-avatar-button.component';
import { NavBottomMenuComponent } from './nav-bottom-menu/nav-bottom-menu.component';
import { NavFloatingActionButtonComponent } from './nav-floating-action-button/nav-floating-action-button.component';
import { NavLogoButtonComponent } from './nav-logo-button/nav-logo-button.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { UpperFoundationComponent } from './upper-foundation/upper-foundation.component';
@NgModule({
  declarations: [
    MainComponent,
    SideNavComponent,
    BottomNavComponent,
    NavLogoButtonComponent,
    NavMenuComponent,
    NavAvatarButtonComponent,
    NavFloatingActionButtonComponent,
    NavBottomMenuComponent,
    BaseFoundationComponent,
    UpperFoundationComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    OverlayModule,
    LayoutProjectionModule,
    ScrollingModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    ReattachOnChangeDirective,
    SearchButtonComponent,
    SettingsButtonComponent,
    LogoComponent,
    AvatarComponent,
  ],
})
export class MainModule {}
