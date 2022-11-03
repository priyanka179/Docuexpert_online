import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsageTableRoutingModule } from './usage-table-routing.module';
import { UsageTableComponent } from './usage-table.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsageTableComponent
  ],
  imports: [
    CommonModule,
    UsageTableRoutingModule,
    FormsModule
  ]
})
export class UsageTableModule { }
