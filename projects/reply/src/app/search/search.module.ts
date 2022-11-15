import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { ContactRefPipe } from '../standalone/contact-ref.pipe';
import { ContentComponent } from '../standalone/content/content.component';
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
    ContentComponent,
    ContactRefPipe,
  ],
})
export class SearchModule {}
