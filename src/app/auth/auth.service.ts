import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonnService } from '../_helpers/common/commonn.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user_name = localStorage.getItem("user_name")
  org_name = localStorage.getItem("org_name")
  user_id = localStorage.getItem("user_id")

  constructor(private http: HttpClient, private router: Router, private _common: CommonnService) { }

  login(loginData: any): Observable<any> {
    let formData = new FormData;
    formData.append("email",loginData.email)
    formData.append("password",loginData.password)

    return this.http.post('user/login/', formData);
  }

  register(registerData: any): Observable<any> {
    let formData = new FormData;
    formData.append("email",registerData.email)
    formData.append("password",registerData.password)
    formData.append("user_name",registerData.user_name)
    formData.append("org_name",registerData.org_name)

    return this.http.post('user/register/', formData);
  }

  isLoggedIn() {
    return !!localStorage.getItem("token");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getPrivacyPolicy() {
    return this.http.get('/link_upload/Terms_and_conditions/');
  }

  logout() {
    localStorage.clear();
    this._common.$removeAllModals.next('');
    this.router.navigate(['/auth/login']);
  }
}
