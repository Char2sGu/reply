import 'hammerjs';

import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, inject, NgModule } from '@angular/core';
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
import { NavigationStart, Router } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LayoutProjectionModule } from '@layout-projection/angular';
import { ScrollingModule } from '@reply/scrolling';
import { filter } from 'rxjs';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BaseFoundationComponent } from './core/base-foundation/base-foundation.component';
import { BottomNavComponent } from './core/bottom-nav/bottom-nav.component';
import { LAYOUT_CONTEXT } from './core/layout-context.token';
import { NavAvatarButtonComponent } from './core/nav-avatar-button/nav-avatar-button.component';
import { NavBottomMenuComponent } from './core/nav-bottom-menu/nav-bottom-menu.component';
import { NavFloatingActionButtonComponent } from './core/nav-floating-action-button/nav-floating-action-button.component';
import { NavLogoButtonComponent } from './core/nav-logo-button/nav-logo-button.component';
import { NavMenuComponent } from './core/nav-menu/nav-menu.component';
import { SideNavComponent } from './core/side-nav/side-nav.component';
import { UpperFoundationComponent } from './core/upper-foundation/upper-foundation.component';
import { ReattachOnChangeDirective } from './standalone/reattach-on-change.directive';
import { SearchButtonComponent } from './standalone/search-button/search-button.component';
import { SettingsButtonComponent } from './standalone/settings-button/settings-button.component';

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
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const layoutContext = inject(LAYOUT_CONTEXT);
        const router = inject(Router);
        return () =>
          router.events
            .pipe(filter((event) => event instanceof NavigationStart))
            .subscribe(() =>
              layoutContext.mutate((c) => (c.contentFavored = false)),
            );
      },
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
