import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/app/auth/auth.service';
import { ModalService } from '../services/modal.service';
import { UploadDirectoryService } from '../services/upload-directory.service';
import { CommonnService } from '../common/commonn.service';
import { Router } from '@angular/router';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private _ngxService: NgxUiLoaderService, private _auth: AuthService, private _modal: ModalService, private _upload: UploadDirectoryService, private _common: CommonnService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let hideLoader = ['/document_upload/fill_upload_data/', '/web_feature/get_current_output/', '/link_upload/upload/', '/link_upload/statusprogress/', '/filestorage_features/recursiontree/', '/bookmarks/download/', '/filestorage_features/fetch_files_and_folders/', '/filestorage_features/folder_and_files/'];
    if (!hideLoader.includes(req.url)) {
      this._ngxService.start();
    } 
    let request: any;
    let isLoggedIn = this._auth.isLoggedIn();
    let token = this._auth.getToken();
    if (isLoggedIn && (req.url !== '/document_upload/fill_upload_data/')) {
      request = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    } else {
      request = req.clone();
    }

    return next.handle(request).pipe(
      tap(
        (event) => {
          if (event instanceof HttpResponse) {
            setTimeout(() => {
              this._common.loaderText = null;
            }, 500);
            this._ngxService.stop();
          }
        },
        (error: HttpErrorResponse) => {
          this._common.loaderText = null;
          this._ngxService.stop();
          
          if (error.status === 525) {
            return;
          }
          
          if (error.url.includes("user/register/")) {
            error.error.errors.hasOwnProperty('email') ? this._modal.showError(error.error.errors.email[0]) : this._modal.showError(error.error.errors.user_name[0]);
          }
          else if (error.url.includes("/user/login/")) {
            this._modal.showAuthError(error.error.detail);
          }
          else if (error.error.code && (error.error.code.includes("token_not_valid") || error.error.code.includes("user_not_found") || error.error.code.includes("User matching query does not exist."))) {
            this._auth.logout();
          }
          else if (error.error.res_data && error.error.res_data.is_valid === false) {
            this._upload.totalFilesToUpload = 0
            this._modal.showUsageError(error.error.res_str)
          }
          else {
            this._modal.showError(error.error.res_str);
          }
        }
      )
    )
  }
}
