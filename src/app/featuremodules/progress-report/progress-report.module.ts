import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressReportRoutingModule } from './progress-report-routing.module';
import { ProgressReportComponent } from './progress-report.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProgressReportComponent
  ],
  imports: [
    CommonModule,
    ProgressReportRoutingModule,
    NgxChartsModule,
    FormsModule
  ]
})
export class ProgressReportModule { }
