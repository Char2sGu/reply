import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, SearchRoutingModule],
})
export class SearchModule {}
