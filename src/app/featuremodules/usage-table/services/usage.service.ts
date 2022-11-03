import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsageService {

  constructor(private httpClient: HttpClient) { }

  getUsageInfo() {
    let user_id = localStorage.getItem('user_id')
    return this.httpClient.get('/web_feature/usage_info/?user_id=' + user_id);
  }
}
