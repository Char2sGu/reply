import 'hammerjs';

import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import {
  BrowserModule,
  DomSanitizer,
  HammerModule,
  SafeValue,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LayoutProjectionModule } from '@layout-projection/angular';
import { ScrollingModule } from '@reply/scrolling';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BaseFoundationComponent } from './core/base-foundation/base-foundation.component';
import { BottomNavComponent } from './core/bottom-nav/bottom-nav.component';
import { FoundationComponent } from './core/foundation/foundation.component';
import { LaunchScreenComponent } from './core/launch-screen/launch-screen.component';
import { NavAvatarButtonComponent } from './core/nav-avatar-button/nav-avatar-button.component';
import { NavBottomMenuComponent } from './core/nav-bottom-menu/nav-bottom-menu.component';
import { NavFloatingActionButtonComponent } from './core/nav-floating-action-button/nav-floating-action-button.component';
import { NavLogoButtonComponent } from './core/nav-logo-button/nav-logo-button.component';
import { NavMenuComponent } from './core/nav-menu/nav-menu.component';
import { SideNavComponent } from './core/side-nav/side-nav.component';
import { UpperFoundationComponent } from './core/upper-foundation/upper-foundation.component';
import { LogoComponent } from './shared/logo/logo.component';
import { ReattachOnChangeDirective } from './shared/reattach-on-change.directive';
import { SearchButtonComponent } from './shared/search-button/search-button.component';
import { SettingsButtonComponent } from './shared/settings-button/settings-button.component';

// TODO: attachment
// TODO: image
// TODO: schedule

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    BottomNavComponent,
    NavLogoButtonComponent,
    NavMenuComponent,
    NavAvatarButtonComponent,
    NavFloatingActionButtonComponent,
    NavBottomMenuComponent,
    BaseFoundationComponent,
    UpperFoundationComponent,
    FoundationComponent,
    LaunchScreenComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    HammerModule,
    HttpClientModule,
    AppRoutingModule,
    OverlayModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    LayoutProjectionModule.forRoot(),
    ScrollingModule.forRoot(),
    ReattachOnChangeDirective,
    SearchButtonComponent,
    SettingsButtonComponent,
    LogoComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory:
        (iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) => () => {
          iconRegistry.setDefaultFontSetClass();
          iconRegistry.registerFontClassAlias(
            'filled',
            'material-icons mat-ligature-font',
          );

          const trusted = (v: string): SafeValue =>
            domSanitizer.bypassSecurityTrustResourceUrl(v);

          iconRegistry.addSvgIcon('logo', trusted('assets/logo.svg'));
          iconRegistry.addSvgIconSet(trusted('assets/icons.svg'));
        },
      deps: [MatIconRegistry, DomSanitizer],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
