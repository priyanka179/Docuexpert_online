import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PredictiveAnalysisRoutingModule } from './predictive-analysis-routing.module';
import { PredictiveAnalysisComponent } from './predictive-analysis.component';


@NgModule({
  declarations: [
    PredictiveAnalysisComponent
  ],
  imports: [
    CommonModule,
    PredictiveAnalysisRoutingModule
  ]
})
export class PredictiveAnalysisModule { }
