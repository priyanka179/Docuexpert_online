import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
import { ModalService } from 'src/app/_helpers/services/modal.service';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements OnInit {

  @Input()
  largeView: boolean = false;

  listview: boolean = true;

  


  @Input()
  data: any;

  @Input()
  pathlist: any;

  @Input()
  showCheckbox: boolean = true;

  @Output()
  onSelectDirectory = new EventEmitter<string[]>();


  @Output()
  metadata = new EventEmitter<any>();

  @Output()
  onSelect = new EventEmitter<string>();

  nameMode: "full" | "short" = "short";

  showDetails: boolean = false;

  imageExtensionList: any[] = ['png', 'jpg', 'jpeg'];

  excelExtensionList: any[] = ['csv', 'xls', 'xlsx'];

  showVarifiedPDF:boolean=false

  @Input()
  showInfoBtn: boolean = false;

  @Input()
  showBibleDirDetails: boolean = false;
  updateUserList: any=[];

  constructor(public router: Router,private route: ActivatedRoute, public _ngxService: NgxUiLoaderService, private _modal: ModalService, private http: HttpClient, private _auth: AuthService, private _common: CommonnService) {
    this._common.$listView.subscribe(res => {
      // console.log("list view >>>>>>>>>>",res)
      this.listview = res
    })
    this._common.$largView.subscribe(res => {
      // console.log("list view >>>>>>>>>>",res)
      this.largeView = res
    })
  }

  ngOnInit(): void {
    this.router.url === '/viewDir/myfiles' || '/viewDir/output-folder' ? this.showInfoBtn = true : this.showInfoBtn = false;

    this._common.$nameMode.subscribe((res: any) => {
      this.nameMode = res;
    })

    this.route.params.subscribe(params => {
      let input_dir_path = JSON.parse(localStorage.getItem('input')) || [];
      let output_dir_path = JSON.parse(localStorage.getItem('output')) || [];
      let req_dir_path = JSON.parse(localStorage.getItem('req')) || [];
      let err_dir_path = JSON.parse(localStorage.getItem('err')) || [];

      if (params.type === 'output-folder') {
        if(input_dir_path.includes("Delivery Bible")){
          this.showCheckbox=true
        }
        this.showCheckbox=true
      }

    
    })

    if(this.pathlist&&this.pathlist.length>=0){
      let showBible=this.pathlist.join('/').includes('Delivery Bible')
      console.log("??????<<>>>>>><<<<>>>",this.pathlist.join('/'),showBible)
  
      if(showBible && (this.data.name.includes('.pdf')||this.data.name.includes('.PDF') ) && !this.data.is_directory){
        this.showVarifiedPDF=true
      }else{
        this.showVarifiedPDF=false
      }
    }

  }

  selectDirectory(event: any, dirType: string, dirName: string, dirPath: string) {
    // console.log(event.ctrlKey);
    if (event.ctrlKey === true) {
      this.onSelectDirectory.emit([dirType, dirName, dirPath]);
    }
  }

  showImageCount(data: any) {
    let pngCount = parseInt(data.png) || 0;
    let jpgCount = parseInt(data.jpg) || 0;
    let jpegCount = parseInt(data.jpeg) || 0;
    let totalCount = pngCount + jpgCount + jpegCount;

    return totalCount.toString();
  }

  showPdfCount(data: any) {
    // ---------------------for old api i.e folder_and_files-------------------------
    // let pdf = data.file_counts['pdf'] || 0;
    // let PDF = data.file_counts['PDF'] || 0;

    // return parseInt(pdf) + parseInt(PDF);

    // ------------------for fastloading api i.e fastloading----------------------
    let count = data.total_files || 0
    return parseInt(count)
  }

  showMetadata() {
    this.metadata.emit('');
  }

  emitSelectEvent(dirType: string, dirName: string, dirPath: string) {
    this.onSelect.emit('');
    // this.onSelectDirectory.emit([dirType, dirName, dirPath]);
  }

  getOcrStatus(data: any): string {
    if (data.directory === 'File' && data.type.toLowerCase() === 'pdf') {
      // return 'ocr-ribbon ocr-ribbon-green justify-content-center';
      return 'justify-content-center';
    }
    else if (data.directory === 'File') {
      return 'justify-content-center';
    }
    else if (data.directory === 'Folder') {
      // return 'ocr-ribbon ocr-ribbon-green justify-content-end';
      return 'justify-content-end';
    }
    else {
      return '';
    }
  }

  renameDir(dirType: string, dirName: string, dirExt: string) {
    let customDirType = dirName.split('.')
    if (dirType === 'File') {
      customDirType.pop();
    }
    this._modal.renameDirModal(dirType, customDirType.join(), dirExt);
  }

  // ------------------------- Context menue-------------------------------------------

  //  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent, item: any) {
    if (item.directory == "Folder") {
      // console.log("in mouse up event", event, item)
      event.preventDefault();
      const button = document.getElementById(item.name);
      console.log(button)
      document.getElementById(item.name).click()
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      // console.log(this.contextMenuPosition.x, this.contextMenuPosition.y)
      // this.contextMenu.menuData = { 'item': item };
      // this.contextMenu.menu.focusFirstItem('mouse');
      // this.contextMenu.openMenu();
    } else {
      return
    }
  }

  onContextMenuAction1(item: any) {
    alert(`Click on Action 1 for ${item}`);
  }

  onContextMenuAction2(item: any) {
    alert(`Click on Action 2 for ${item}`);
  }

  showBuildBible() {
    // console.log("build Bible data", this.data)
    let path = this.data.path + "/" + this.data.name
    this.getRootNodeData(path).subscribe((res: any) => {
      this._ngxService.stop();
      console.log("res is...", res)
      if (res.res_data.jsonData1.is_bible == "true") {
        let splitval = res.res_data.jsonData1.path.split('/')
        splitval.pop()
        let path = splitval.join('/')
        this._common.$selectedFolderData.next({});
        let rootDir = {}
        rootDir = {
          "name": res.res_data.jsonData1.name.slice(0, -18),
          "id": 0,
          "path": path,
          "total_count": res.res_data.jsonData1.total_count,
          "type": "directory",
          "expanded": false,
        }
        // console.log(">>>>>>>>>>>>>????????", rootDir)
        this.redirectUserToDir(path + "/")
        localStorage.removeItem('buildBibleSubDir')
        this._common.$selectedFolderData.next(rootDir);
        this._common.$showFolderTree.next(true);
        this._common.$showFeatureList.next(false);
        this._common.$showTree.next(false)
      }
      else {
        // console.log("Not Build Bible")
        Swal.fire("Build bible not done for " + this.data.name)
        // Swal.fire({
        //   title: 'Error!',
        //   text: "Build Bible Not Done",
        //   icon: 'error',
        //   confirmButtonText: 'OK'
        // })
      }
    });
  }

  getRootNodeData(path: string) {
    this._ngxService.start();
    let formData = new FormData;
    formData.append("user_id", this._auth.user_id);
    formData.append("dir_path", path);
    // formData.append("is_select", "true")

    // return this.http.post('/filestorage_features/recursiontree/', formData);
    return this.http.post('/filestorage_features/validation/', formData);
  }

  redirectUserToDir(path: string) {
    if (path.includes('Input')) {
      this._common.redirectToDir(path, 'input');
    } else if (path.includes('Req')) {
      this._common.redirectToDir(path, 'req');
    } else if (path.includes('Err_Info')) {
      this._common.redirectToDir(path, 'err');
    } else if (path.includes('Output')) {
      this._common.redirectToDir(path, 'output');
    }
  }

  addUser(data:any) {
    // this.setAddUserList()
    this._common.$addUserDetailsData.next(data)
    document.getElementById("addUserModalButton").click();
    // $('#myModal').modal({backdrop: 'static', keyboard: false})
  }


}
