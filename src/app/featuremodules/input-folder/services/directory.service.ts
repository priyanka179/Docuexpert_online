import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';


@Injectable()
export class DirectoryService {

  constructor(private http: HttpClient, private _auth: AuthService, private _common: CommonnService) { }

  listDirectories(path: string,gpath:string): Observable<any> {
    let formData = new FormData;

    formData.append("dir_path", path);
    formData.append("user_id", this._auth.user_id);
    if(path.includes('External_Assigned')){
    formData.append("is_external", "true");
    return this.http.post('/filestorage_features/externaluser/', formData);
    }else  if (path.includes('Input_Folder')) {
      formData.append("dir_path_g", gpath);
      return this.http.post('/filestorage_features/fetch_files_and_folders/', formData);
    } else  {
      // formData.append("dir_path_g", "");
      return this.http.post('/filestorage_features/folder_and_files/', formData);
    }
  }

  download(paths: any[], parent_dir:string): Observable<any> {
    let formData = new FormData;
    formData.append("input_paths", JSON.stringify(paths));
    formData.append("user_id", this._auth.user_id);
    formData.append("parent_dir", parent_dir.replace('/','').toString());

    return this.http.post('/bookmarks/download/', formData, {responseType: "blob", reportProgress: true, observe: 'events'});
  }

  delete(paths: any[], parent_dir:string): Observable<any> {
    let formData = new FormData;
    formData.append("input_paths", JSON.stringify(paths));
    formData.append("user_id", this._auth.user_id);
    // formData.append("parent_dir", parent_dir.replace('/','').toString());

    return this.http.post('/bookmarks/delete/', formData);
  }

  getDirectoryMetadata(data:any): Observable<any> {
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    formData.append("file_path", data.path+'/')
    formData.append("file_name", data.name);

    return this.http.post('/web_feature/fetch_metadata/', formData);
  }

  combinedSearch(data: any, input_paths:any, parent_dir: string) {
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    
    if (input_paths.length === 0) {
      formData.append("input_paths", JSON.stringify([this._auth.org_name+'/'+this._auth.user_name]));
    } else {
      formData.append("input_paths", JSON.stringify(input_paths));
    }

    formData.append("request_id", this._common.getRandomString());
    formData.append("feature", "Advance File Search");
    formData.append("search_info", JSON.stringify(data));
    formData.append("parent_dir", parent_dir);

    return this.http.post('/web_feature/combined_search/', formData);
  }

  fileCombineSearch(data:any,inpupath:string){
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    formData.append("search_info", JSON.stringify(data));
    formData.append("input_paths", inpupath);
    return this.http.post('/adv_filelevel/combined_search/', formData);
  }

  

  folderSearch(data: any, input_paths: any, parent_dir: string) {

    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    
    if (input_paths.length === 0) {
      formData.append("input_paths", JSON.stringify([this._auth.org_name+'/'+this._auth.user_name]));
    } else {
      formData.append("input_paths", JSON.stringify(input_paths));
    }

    formData.append("request_id", this._common.getRandomString());
    formData.append("feature", "Advance Folder Search");
    formData.append("search_rule", data.search_rule);
    formData.append("fixed_left", data.fixed_left);
    formData.append("fixed_right", data.fixed_right);
    formData.append("is_pattern", data.is_pattern);
    formData.append("parent_dir", parent_dir.replace('/', '').trim().toString());

    return this.http.post('/web_feature/folder_search/', formData);
  }

  loginWithGoogle() {
    let formData = new FormData();
    formData.append('user_id', this._auth.user_id.toString());

    return this.http.post('/link_upload/authorize', formData);
    // return this.http.get('/link_upload/authorize');
    // return this.http.post('https://docuexpert.online/link_upload/authorize', formData);
    // return this.http.get('https://docuexpert.online/link_upload/authorize', {headers :{'Accept': 'text/html', 'responseType': 'text'},responseType: 'text'});
    // return this.http.get('https://docuexpert.online/link_upload/authorize', {responseType: 'text'});
  }

  uploadFromLink(linkForm:any) {
    let formData = new FormData;
    let reqTime = JSON.stringify(new Date());

    formData.append('user_id', this._auth.user_id.toString());
    formData.append('folder_name', linkForm.folderName);
    formData.append('project_name',linkForm.projectName)
    formData.append('input_paths', JSON.stringify(linkForm.links));
    formData.append('output_link', linkForm.outputLink);

    let reqId = this._common.getRandomString()
    localStorage.setItem('reqId', reqId);

    formData.append('request_id', localStorage.getItem('reqId'));
    formData.append('operation_request_time', reqTime.substring(1, reqTime.length - 1));
    formData.append('operation_requested', 'VirtualFolder');

    return this.http.post('/link_upload/fill_upload_data/', formData);
  }

  uploadLinkLogout() {
    let formData = new FormData;
    formData.append('user_id', this._auth.user_id.toString());

    return this.http.post('/link_upload/social_logout/', formData);
  }

  isLoggedIn() {
    let formData = new FormData;
    formData.append('user_id', this._auth.user_id.toString());

    return this.http.post('/link_upload/auth/', formData);
  }

  vuploadProgress() {
    let formData = new FormData;
    // formData.append('user_id', this._auth.user_id.toString());
    // formData.append('folder_name', localStorage.getItem('folder_name')); 
    formData.append('uid', localStorage.getItem('uidList'));
    formData.append('request_id', localStorage.getItem('reqId'));

    return this.http.post('/link_upload/upload/', formData);
  }

  vstatusProgress() {
    let formData = new FormData;
    
    formData.append('uid', localStorage.getItem('uidList'));
    formData.append('request_id', localStorage.getItem('reqId'));

    return this.http.post('/link_upload/statusprogress/', formData);
  }

  createFolder(path: string, folderName: string) {
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    if(path) {
      formData.append("dir_path", 'Input_Folder/' + this._auth.org_name + '/' + this._auth.user_name + '/' + path);
    } else {
      formData.append("dir_path", 'Input_Folder/' + this._auth.org_name + '/' + this._auth.user_name);
    }
    formData.append("folder_name", folderName);

    return this.http.post('/link_upload/create_dir/', formData);
  }

  getChildNodeData(path:string){
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    formData.append("dir_path", path);

    return this.http.post('/filestorage_features/recursiontree/', formData);
  }

  getFoldersTreeData() {
    // let formData = new FormData;
    // formData.append("user_id", this._auth.user_id);
    // let path = 'Output_Folder/' + this._auth.org_name + '/' + this._auth.user_name;
    // formData.append("dir_path", path);
    }

  // getChildNodeData(path:string){
  //   let formData = new FormData;
  //   formData.append("user_id", this._auth.user_id);
  //   formData.append("dir_path", path);

  //   return this.http.post('/filestorage_features/recursiontree/', formData);
  // }

  varifyFiles(){
    
  }

}
