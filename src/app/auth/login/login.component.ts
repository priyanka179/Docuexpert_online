import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  subscription: Subscription;

  showPassword: boolean = false;

  @ViewChild('inputelem') emailInputElement: ElementRef;

  constructor(private _fb: FormBuilder,private router: Router,private _auth: AuthService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email:['',Validators.required],
      password: ['', Validators.required]
    })
    this.route.queryParams.subscribe(res => {
      if (res.url) {
        this.login(res.url,false);
      }
    });
  }

  test() {
    this.emailInputElement.nativeElement.popover({ title: 'Name tooltip', placement: 'left' });
  }

  login(urlToRoute:string = "/viewDir/myfiles", showError = true) {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.subscription = this._auth.login(this.loginForm.value).subscribe((res:any) => {
        console.log(res);
        localStorage.setItem("user_name",res.user_name)
        localStorage.setItem("email",res.email)
        localStorage.setItem("org_name",res.org_name)
        localStorage.setItem("user_id", res.id)
        localStorage.setItem("token", res.tokens.access)
        localStorage.setItem("refresh", res.tokens.refresh)
        this._auth.user_name = localStorage.getItem("user_name")
        this._auth.org_name = localStorage.getItem("org_name")
        this._auth.user_id = localStorage.getItem("user_id")
        this.router.navigate([urlToRoute])
      })
    } else {
      showError && this.loginForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

}
