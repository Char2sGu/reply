import 'hammerjs';

import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
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
import { LaunchScreenComponent } from './core/launch-screen/launch-screen.component';
import { LogoComponent } from './shared/logo/logo.component';

// TODO: attachment
// TODO: image
// TODO: schedule

@NgModule({
  declarations: [AppComponent, LaunchScreenComponent],
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
    LayoutProjectionModule.forRoot(),
    ScrollingModule.forRoot(),
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
