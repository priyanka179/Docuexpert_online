import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrentOutputRoutingModule } from './current-output-routing.module';
import { CurrentOutputComponent } from './current-output.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CurrentOutputComponent
  ],
  imports: [
    CommonModule,
    CurrentOutputRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class CurrentOutputModule { }
