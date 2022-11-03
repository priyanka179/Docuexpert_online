import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputFolderRoutingModule } from './input-folder-routing.module';
import { InputFolderComponent } from './input-folder.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FileSaverModule } from 'ngx-filesaver';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider
} from 'angularx-social-login';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxRippleModule } from 'ngx-ripple-effect';
import {MatChipsModule} from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AircraftMetadataComponent } from './aircraft-metadata/aircraft-metadata.component';
import {AutoCompleteModule} from 'primeng/autocomplete';



@NgModule({
  declarations: [
    InputFolderComponent,
    AircraftMetadataComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InputFolderRoutingModule,
    NgxPaginationModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    ReactiveFormsModule,
    FileSaverModule,
    SocialLoginModule,
    DragDropModule,
    NgxRippleModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    AutoCompleteModule
  ],
  exports:[
    AircraftMetadataComponent
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '25701613312-19gtueldo30pbmg4bpfh5ok90mlcb8tm.apps.googleusercontent.com',
              {
                scope: 'https://www.googleapis.com/auth/drive.readonly'
              }
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ]
})
export class InputFolderModule {}
