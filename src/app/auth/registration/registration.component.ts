import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/_helpers/services/modal.service';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  //@ts-ignore
  userRegForm: FormGroup;

  privacyPolicyCheck: boolean = true;

  subscription: Subscription;

  constructor(private _fb: FormBuilder,private router:Router, private _auth: AuthService, private _modal: ModalService) {}

  ngOnInit(): void {
    this.userRegForm = this._fb.group({
      user_name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      org_name: ['', Validators.required],
      privacy_policy_check: [false]
    }, {
      validator: this.confirmPassword('password', 'confirm_password')
    })
  }

  confirmPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
  }

  validateFields(formcontrol:string) {
    return this.userRegForm.get(formcontrol)?.errors && this.userRegForm.get(formcontrol)?.touched
  }

  validateEmail() {
    // if (this.userRegForm.get('email').value.includes('statvalu')) {
    if (/statvalu/i.test(this.userRegForm.get('email').value)) {
      this.userRegForm.get('email')?.setErrors(null);
    } else {
      this.userRegForm.get('email')?.setErrors({ invalid: true });
    }
  }

  registerUser() {
    if (this.userRegForm.valid && (this.userRegForm.get('privacy_policy_check').value === true)) {
      delete this.userRegForm.value.confirm_password
      delete this.userRegForm.value.privacy_policy_check
      this.subscription = this._auth.register(this.userRegForm.value).subscribe((res:any) => {
        console.log(res);
        
        this._modal.showRegistrationSuccess(res.data.message);
      })
    } else {
      this.userRegForm.markAllAsTouched()
    }
  }

  redirectToPrivacyPolicy() {
    this._auth.getPrivacyPolicy().subscribe((res:any) => {
      console.log(res);
    })
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

}

