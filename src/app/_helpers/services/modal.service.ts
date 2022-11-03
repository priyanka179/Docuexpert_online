import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private router: Router) { }

  showError(msg: string) {
    Swal.fire({
      title: 'Error!',
      text: msg,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }

  showMsg(msg: string, title: string, icon: SweetAlertIcon) {
    Swal.fire({
      title: title,
      text: msg,
      icon: icon,
      confirmButtonText: 'OK'
    })
  }

  showAuthError(msg: string) {
    localStorage.removeItem("token");
    this.router.navigate(['/auth/login']);
    Swal.fire({
      title: 'Auth Error!',
      text: msg,
      icon: 'error',
      confirmButtonText: 'Retry',
      backdrop: true,
      allowOutsideClick: () => false
    })
  }

  showUsageError(msg: string) {
    Swal.fire({
      title: 'Usage Error!',
      text: msg,
      icon: 'error',
      confirmButtonText: 'Buy Subscription',
      cancelButtonText: 'Retry',
      showCancelButton: true,
      backdrop: true,
      allowOutsideClick: () => false
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Buy Subscription');
        this.router.navigate(['/viewDir/subscriptions']);
      }
    })
  }

  showRegistrationSuccess(msg: string) {
    Swal.fire({
      title: 'Registration Successful',
      text: msg,
      icon: 'success',
      showCancelButton: false,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Ok',
      allowOutsideClick: () => false
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'top-start',
          icon: 'success',
          title: 'Redirecting To Login Screen',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/auth/login'])
      }
    })
  }

  renameDirModal(dirType: string, dirName: string, dirExt: string) {
    Swal.fire({
      title: `Please Enter your ${dirType} Name`,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        maxlength: '255'
      },
      inputValue: dirName,
      backdrop: true,
      showCancelButton: true,
      confirmButtonText: 'Rename ' + dirType,
      showLoaderOnConfirm: true,
      preConfirm: async (directoryName) => {
        if (!directoryName) {
          Swal.showValidationMessage("please give proper value");
        }
        else if (directoryName && directoryName.includes('.')) {
          Swal.showValidationMessage("should not contain dot(.)");
        }
        // else if (directoryName && directoryName.includes(' ')) {
        //   Swal.showValidationMessage("should not contain any space");
        // }
        else {
          if (dirType === 'File') {
            directoryName = directoryName + '.' + dirExt
          }

          console.log(directoryName);
        }
      },
      allowOutsideClick: () => false
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: `${result.value} ${dirType} Renamed Successfully`,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  async uploadFromLink() {
    const { value: formValues } = await Swal.fire({
      title: 'Upload From Drive Link',
      html:
        `<p class="mb-0">Input Link 1</p><input id="swal-input1" class="swal2-input mt-3">` +
        '<p class="mb-0 mt-3">Project Name</p><input id="swal-input4" class="swal2-input mt-3">' +
        '<p class="mb-0 mt-3">Input Link 2</p><input id="swal-input2" class="swal2-input mt-3">' +
        '<p class="mb-0 mt-3">Output Link</p><input id="swal-input3" class="swal2-input mt-3">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          //@ts-ignore
          document.getElementById('swal-input1').value,
           //@ts-ignore
           document.getElementById('swal-input2').value,
          //@ts-ignore
          document.getElementById('swal-input3').value,
          //@ts-ignore
          document.getElementById('swal-input4').value
        ]
      }
    })

    if (formValues) {
      Swal.fire(JSON.stringify(formValues))
    }
  }


  showFeatureProcessSuccess(msg: string) {
    Swal.fire({
      icon: 'success',
      title: msg,
      showConfirmButton: false,
      timer: 1500
    })
  }

  showVarifyPopup(msg: string) {
    Swal.fire({
      title: msg,
      showConfirmButton: false,
      timer: 1500
    })
  }

}
