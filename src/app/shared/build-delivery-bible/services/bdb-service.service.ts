import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class BdbServiceService {

  constructor(private http: HttpClient, private _auth: AuthService) { }

  moveDirectories(destination_path: string, source_paths: string): Observable<any> {
    let formData = new FormData;

    formData.append("destination_path", destination_path);
    formData.append("source_paths", source_paths);
    formData.append("feature", "Delivery Bible");

    return this.http.post('/delivery_bible/drag_n_drop/', formData);
  }

  download(paths: any[], parent_dir: string): Observable<any> {
    let formData = new FormData;
    formData.append("input_paths", JSON.stringify(paths));
    formData.append("user_id", this._auth.user_id);
    formData.append("parent_dir", parent_dir.replace('/', '').toString());

    return this.http.post('/bookmarks/download/', formData, { responseType: "blob", reportProgress: true, observe: 'events' });
  }

  getUnclassifiedFiles(formData:any): Observable<any> {
    return this.http.post('/filestorage_features/folder_and_files/', formData);
  }

  delete(paths: any[], parent_dir: string): Observable<any> {
    let formData = new FormData;
    formData.append("input_paths", JSON.stringify(paths));
    formData.append("user_id", this._auth.user_id);
    // formData.append("parent_dir", parent_dir.replace('/','').toString());

    return this.http.post('/bookmarks/delete/', formData);
  }
}
