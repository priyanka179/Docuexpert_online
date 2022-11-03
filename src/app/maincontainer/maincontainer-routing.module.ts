import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightDetailsComponent } from '../components/flight-details/flight-details.component';
import { MaincontainerComponent } from './maincontainer.component';

const routes: Routes = [
  {
    path: "", component: MaincontainerComponent, children: [
      {path: "statusTable",loadChildren: () => import('../featuremodules/status-table/status-table.module').then(m => m.StatusTableModule)},
      {path: "usageTable",loadChildren: () => import('../featuremodules/usage-table/usage-table.module').then(m => m.UsageTableModule)},
      {path: "currentOutput",loadChildren: () => import('../featuremodules/current-output/current-output.module').then(m => m.CurrentOutputModule)},
      {path: "advancedsearch",loadChildren: () => import('../featuremodules/advanced-search/advanced-search.module').then(m => m.AdvancedSearchModule)},
      {path: "subscriptions",loadChildren: () => import('../featuremodules/subscription-plan/subscription-plan.module').then(m => m.SubscriptionPlanModule)},
      {path: "predictive-analysis",loadChildren: () => import('../featuremodules/predictive-analysis/predictive-analysis.module').then(m => m.PredictiveAnalysisModule)},
      { path: "flight-details", component:FlightDetailsComponent},
      { path: "progress-report", loadChildren: () => import('../featuremodules/progress-report/progress-report.module').then(m => m.ProgressReportModule) },
      {path: ":type",loadChildren: () => import('../featuremodules/input-folder/input-folder.module').then(m => m.InputFolderModule)}
  ]}
];
// myfiles
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaincontainerRoutingModule { }
