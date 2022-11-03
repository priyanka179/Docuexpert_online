import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionPlanRoutingModule } from './subscription-plan-routing.module';
import { SubscriptionPlanComponent } from './subscription-plan.component';
import { FormsModule } from '@angular/forms';
import { PromocodeVerifyComponent } from './promocode-verify/promocode-verify.component';


@NgModule({
  declarations: [
    SubscriptionPlanComponent,
    PromocodeVerifyComponent
  ],
  imports: [
    CommonModule,
    SubscriptionPlanRoutingModule,
    FormsModule
  ]
})
export class SubscriptionPlanModule { }
