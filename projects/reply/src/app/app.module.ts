import 'hammerjs';

import { HttpClientModule } from '@angular/common/http';
import { inject, NgModule } from '@angular/core';
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
import { catchError, of } from 'rxjs';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { INITIALIZER, Initializer } from './core/initialization';
import { LaunchScreenComponent } from './core/launch-screen/launch-screen.component';
import { NotificationService } from './core/notification.service';
import { SnackbarNotificationService } from './core/snackbar-notification.service';
import { LogoComponent } from './shared/logo/logo.component';

// TODO: attachment
// TODO: image
// TODO: schedule
// TODO: gestures on cards

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
    LayoutProjectionModule.forRoot(),
    ScrollingModule.forRoot(),
    environment.backend,
    AppRoutingModule,
    LogoComponent,
  ],
  providers: [
    {
      provide: NotificationService,
      useClass: SnackbarNotificationService,
    },
    {
      provide: INITIALIZER,
      useFactory: (): Initializer => {
        const iconRegistry = inject(MatIconRegistry);
        const domSanitizer = inject(DomSanitizer);
        const trusted = (v: string): SafeValue =>
          domSanitizer.bypassSecurityTrustResourceUrl(v);
        const loadAllSvgIconSets = () =>
          iconRegistry.getNamedSvgIcon('').pipe(catchError(() => of(null)));
        return () => {
          iconRegistry.setDefaultFontSetClass();
          iconRegistry.registerFontClassAlias(
            'filled',
            'material-icons mat-ligature-font',
          );
          iconRegistry.addSvgIconSet(trusted('assets/icons.svg'));
          return loadAllSvgIconSets();
        };
      },
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
