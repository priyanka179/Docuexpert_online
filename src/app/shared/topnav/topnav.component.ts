import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {

  showBuildBibleDownload:boolean=false

  
  constructor(private router: Router, private _common: CommonnService) { 
    this._common.showBuildBibleDownload.subscribe((res:any)=>{
      this.showBuildBibleDownload=res
    }
    )
  }

  

  ngOnInit(): void {
  }

  

  getUsername():string {
    return localStorage.getItem("user_name");
  }

  getEmailId():string {
    return localStorage.getItem("email");
  }

  logout():void {
    localStorage.clear();
    this._common.$removeAllModals.next('');
    this._common.$showFolderTree.next(false)
    this._common.$showTree.next(false)
    this._common.$showFeatureList.next(true)
    this.router.navigate(['/auth/login']);
  }

  myFilesClearPath() {
    // localStorage.removeItem('input');
    this._common.$resetMyFile.next('');
  }

  outputFolderClearPath() {
    localStorage.removeItem('output');
  }

  requestFolderClearPath() {
    localStorage.removeItem('req');
  }

  errorFolderClearPath() {
    localStorage.removeItem('err');
  }
  
}
