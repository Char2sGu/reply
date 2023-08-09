import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { ContactFromMailParticipantPipe } from '../entity/shared/contact-from-mail-participant.pipe';
import { ResolveRefPipe } from '../entity/shared/resolve-ref.pipe';
import { HeaderComponent } from '../shared/header/header.component';
import { LayoutContentDirective } from '../shared/layout-content.directive';
import { ReadableDatePipe } from '../shared/readable-date.pipe';
import { ScrollableAreaComponent } from '../shared/scrollable-area/scrollable-area.component';
import { SearchComponent } from './search.component';
import { SearchResultListComponent } from './search-result-list/search-result-list.component';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
  declarations: [SearchComponent, SearchResultListComponent],
  imports: [
    CommonModule,
    FormsModule,
    SearchRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatTooltipModule,
    ScrollableAreaComponent,
    LayoutContentDirective,
    ResolveRefPipe,
    ContactFromMailParticipantPipe,
    HeaderComponent,
    ReadableDatePipe,
  ],
})
export class SearchModule {}
