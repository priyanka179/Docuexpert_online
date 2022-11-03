import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonnService } from '../_helpers/common/commonn.service';


@Component({
  selector: 'app-maincontainer',
  templateUrl: './maincontainer.component.html',
  styleUrls: ['./maincontainer.component.scss'],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0, transform: 'translateX(-100%)' })),
      state('*', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', animate(400)),
      transition('* => void', animate(400))
    ])
  ]
})
export class MaincontainerComponent implements OnInit {

  hideComponentUrlList: any[] = ['/viewDir/usageTable', '/viewDir/currentOutput', '/viewDir/advancedsearch', '/viewDir/subscriptions/verifypromocode'];

  hideSidebarUrlList: any[] = ['/viewDir/subscriptions', '/viewDir/flight-details', '/viewDir/statusTable'];

  showSidebar: boolean = true;
  changeContentView: boolean = true;
  treeView:boolean=false
  folderTreeview:boolean=false

  constructor(public router:Router, private _common: CommonnService) { 
    this._common.$showTree.subscribe((res) => {
      console.log(">>>>",res)
      this.treeView =res;
    });
    this._common.$showFolderTree.subscribe((res) => {
      console.log(">>>>",res)
      this.folderTreeview =res;
    });
  }

  ngOnInit(): void {
    if(this.router.url === '/viewDir'){
      this.router.navigate(['/viewDir/myfiles']);
    }

    this._common.$toggleSidebar.subscribe(res => {
      this.showSidebar = !this.showSidebar;
      this.changeView();
    })
  }

  hideAll() {
    // return (this.router.url !== '/viewDir/statusTable') && (this.router.url !== '/viewDir/usageTable');
    return !this.hideComponentUrlList.includes(this.router.url)
  }

  hideSidebar() {
    return !this.hideSidebarUrlList.includes(this.router.url)
  }

  changeView() {
    setTimeout(() => {
      this.changeContentView = !this.changeContentView;
    }, 400);
  }

  routeList: any[] = ['/viewDir/myfiles', '/viewDir/output-folder', '/viewDir/request-folder', '/viewDir/error-folder'];
  showScrollbar() {
    return !this.routeList.includes(this.router.url);
  }

}
