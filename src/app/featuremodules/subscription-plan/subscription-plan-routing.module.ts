import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromocodeVerifyComponent } from './promocode-verify/promocode-verify.component';
import { SubscriptionPlanComponent } from './subscription-plan.component';

const routes: Routes = [
  { path: "", component: SubscriptionPlanComponent },
  {path: "verifypromocode", component: PromocodeVerifyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionPlanRoutingModule { }
