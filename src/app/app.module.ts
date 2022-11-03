import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './_helpers/interceptors/request.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LinkedDataGraphicModule } from '@ngld/canvas';
import { FlightDetailsComponent } from './components/flight-details/flight-details.component';
import { RelationGraphComponent } from './components/relation-graph/relation-graph.component';
import { HardtimedashboardComponent } from './components/hardtimedashboard/hardtimedashboard.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {AutoCompleteModule} from 'primeng/autocomplete';


@NgModule({
  declarations: [
    AppComponent,
    FlightDetailsComponent,
    RelationGraphComponent,
    HardtimedashboardComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxUiLoaderModule,
    HttpClientModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AutoCompleteModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken'
    }),
    SharedModule,
    LinkedDataGraphicModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
