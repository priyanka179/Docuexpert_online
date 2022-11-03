import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusTableRoutingModule } from './status-table-routing.module';
import { StatusTableComponent } from './status-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NgxRippleModule } from 'ngx-ripple-effect';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    StatusTableComponent
  ],
  imports: [
    CommonModule,
    StatusTableRoutingModule,
    SharedModule,
    FormsModule,
    NgxPaginationModule,
    RoundProgressModule,
    NgxRippleModule,
    MatTabsModule
  ]
})
export class StatusTableModule { }
