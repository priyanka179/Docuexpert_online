import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';

@Injectable({
  providedIn: 'root'
})
export class VisualizeService {

  constructor(private http: HttpClient, private _auth: AuthService, private _common: CommonnService) { }

  getVisualizeData(name:string) {
    let formData = new FormData();

    formData.append('id', localStorage.getItem('v_id'));
    formData.append('folder_name', localStorage.getItem('v_folderName'));
    formData.append('user_id', this._auth.user_id);
    formData.append('operation_requested', 'Hard time folder');
    formData.append('name', name);

    return this.http.post('/hard_folder_link/visulaize/', formData);
  }

  getPdf(driveLink:string) {
    let formData = new FormData();

    formData.append('user_id', this._auth.user_id);
    formData.append('drive_link', driveLink);

    return this.http.post('/hard_folder_link/drive_view/', formData, { reportProgress: true, observe: 'events' });
  }

}
