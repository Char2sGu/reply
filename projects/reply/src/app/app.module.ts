import 'hammerjs';

import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  BrowserModule,
  DomSanitizer,
  HammerModule,
  SafeValue,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ScrollingModule } from '@reply/scrolling';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FoundationComponent } from './core/foundation/foundation.component';
import { NavComponent } from './core/nav/nav.component';
import { NavAvatarButtonComponent } from './core/nav-avatar-button/nav-avatar-button.component';
import { NavBottomMenuComponent } from './core/nav-bottom-menu/nav-bottom-menu.component';
import { NavFloatingActionButtonComponent } from './core/nav-floating-action-button/nav-floating-action-button.component';
import { NavLogoButtonComponent } from './core/nav-logo-button/nav-logo-button.component';
import { NavMenuComponent } from './core/nav-menu/nav-menu.component';
import { ReattachOnChangeDirective } from './standalone/reattach-on-change.directive';
import { SearchButtonComponent } from './standalone/search-button/search-button.component';
import { SettingsButtonComponent } from './standalone/settings-button/settings-button.component';

// TODO: attachment
// TODO: image
// TODO: schedule

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NavLogoButtonComponent,
    NavMenuComponent,
    NavAvatarButtonComponent,
    NavFloatingActionButtonComponent,
    NavBottomMenuComponent,
    FoundationComponent,
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
    PortalModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    ScrollingModule.forRoot(),
    ReattachOnChangeDirective,
    SearchButtonComponent,
    SettingsButtonComponent,
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
