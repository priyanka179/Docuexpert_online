import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaincontainerRoutingModule } from './maincontainer-routing.module';
import { MaincontainerComponent } from './maincontainer.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MaincontainerComponent
  ],
  imports: [
    CommonModule,
    MaincontainerRoutingModule,
    SharedModule
  ],
  providers: []
})
export class MaincontainerModule { }
