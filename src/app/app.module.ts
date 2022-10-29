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

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavComponent } from './core/nav/nav.component';
import { NavAvatarComponent } from './core/nav-avatar/nav-avatar.component';
import { NavMenuComponent } from './core/nav-menu/nav-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NavMenuComponent,
    NavAvatarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    HttpClientModule,
    AppRoutingModule,
    OverlayModule,
    PortalModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
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
