import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PredictiveAnalysisComponent } from './predictive-analysis.component';

const routes: Routes = [
  {path:'',component:PredictiveAnalysisComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PredictiveAnalysisRoutingModule { }
