import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvancedSearchRoutingModule } from './advanced-search-routing.module';
import { AdvancedSearchComponent } from './advanced-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdvancedSearchService } from './services/advanced-search.service';


@NgModule({
  declarations: [
    AdvancedSearchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdvancedSearchRoutingModule
  ],
  providers: [AdvancedSearchService]
})
export class AdvancedSearchModule { }
