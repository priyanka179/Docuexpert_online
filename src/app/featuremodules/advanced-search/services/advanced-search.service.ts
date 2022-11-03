import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';


@Injectable()
export class AdvancedSearchService {

  constructor(private http: HttpClient, private _auth: AuthService, private _common: CommonnService) { }

  getContentSearchData(data: any): Observable<any> {
    let formdata = new FormData;

    formdata.append("user_id", this._auth.user_id)
    formdata.append("search_string", data.search_string)
    formdata.append("fixed_left", data.fixed_left)
    formdata.append("fixed_right", data.fixed_right)
    if (data.type === "Text") {
      formdata.append("is_text", "1")
      formdata.append("is_pattern", "0")
    } else {
      formdata.append("is_text", "0")
      formdata.append("is_pattern", "1")
    }
    return this.http.post("/web_feature/content_search/", formdata);
  }

  getFileFolderSearchData(data: any): Observable<any> {
    let formdata = new FormData;

    formdata.append("user_id", this._auth.user_id)
    formdata.append("file_search", data.file_search)
    
    if (data.type === "Pattern") {
      formdata.append("search_rule", data.search_string)
      formdata.append("fixed_left", data.fixed_left)
      formdata.append("fixed_right", data.fixed_right)
    } else {
      formdata.append("search_string", data.search_string)
      formdata.append("fixed_left", "0")
      formdata.append("fixed_right", "0")
    }

    return this.http.post("/web_feature/file_folder_search/", formdata);
  }

  getMetadataSearchData(data: any, combineOP: any[]): Observable<any> {
    let formdata = new FormData;

    formdata.append("user_id", this._auth.user_id)
    formdata.append("feature", "Advance Search")
    formdata.append("search_info", JSON.stringify(data))
    formdata.append("condition_combine_operators", JSON.stringify(combineOP))

    return this.http.post("/web_feature/metadata_search/", formdata);
  }

  getCombinedSearchData(data: any): Observable<any> {
    let formdata = new FormData;

    formdata.append("user_id", this._auth.user_id);

    return this.http.post("/web_feature/combined_search/", formdata);
  }
}
