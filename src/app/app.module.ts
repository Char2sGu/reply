import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavComponent } from './core/nav/nav.component';

@NgModule({
  declarations: [AppComponent, NavComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatIconModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (iconRegistry: MatIconRegistry) => () =>
        iconRegistry.setDefaultFontSetClass(
          'material-icons-two-tone',
          'mat-ligature-font',
        ),
      deps: [MatIconRegistry],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
