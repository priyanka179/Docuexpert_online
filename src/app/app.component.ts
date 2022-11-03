import { Component } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from './auth/auth.service';
import { CommonnService } from './_helpers/common/commonn.service';
import { UploadDirectoryService } from './_helpers/services/upload-directory.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DocuExpertNewUi';

  constructor(public _upload: UploadDirectoryService, public _common: CommonnService, private _auth:AuthService) { }

  ngOnInit() {
    this._auth.user_name = localStorage.getItem("user_name");
    this._auth.org_name = localStorage.getItem("org_name");
    this._auth.user_id = localStorage.getItem("user_id");

    console.log(this._auth.user_name, this._auth.org_name, this._auth.user_id);
    
  }
}
