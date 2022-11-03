import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private _auth: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (state.url.includes('/auth/login') || state.url === '/') {
      return this._auth.isLoggedIn() ? this.router.navigate(['/viewDir/myfiles']) : true;
    } else {
      return this._auth.isLoggedIn() ? true : this.router.navigate(['/auth/login'], { queryParams: { url: state.url } });
    }
  }
  
}
