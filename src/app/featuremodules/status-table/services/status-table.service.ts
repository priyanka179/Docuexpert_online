import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class StatusTableService {

  constructor(private http: HttpClient, private _auth: AuthService) { }

  filterUrl: string = '&filer_by={"document_name":"","operation_requested":"File Upload","operation_status":"COMPLETE","request_id":""}';

  getStatusTableData(url:string, filerObj:any): Observable<any> {
    return this.http.get(url + this._auth.user_id + '&filer_by=' + JSON.stringify(filerObj));
  }

  pageChange(url: string): Observable<any> {
    return this.http.get(url);
  }
}
