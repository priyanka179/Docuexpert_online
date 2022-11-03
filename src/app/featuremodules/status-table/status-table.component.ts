import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
import { StatusTableService } from './services/status-table.service';
// import { DirectoryService } from './services/directory.service';
import { DirectoryService } from '../input-folder/services/directory.service';
import { AuthService } from 'src/app/auth/auth.service';




@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.scss'],
  providers: [StatusTableService,DirectoryService]
})
export class StatusTableComponent implements OnInit {

  hideScrollbar: boolean = true;
  showRightCanvas: boolean = true;

  isHighlight: boolean = false;

  selectedStatus: string = "";

  totalCount: any = "";

  nextPageUrl: string = "";
  prevPageUrl: string = "";

  currPage: number = 1;
  totalPage: number = 0;

  currTableName: string = "Activity Log";

  prevLinks: any[] = [{ label: "my files", link: "/viewDir/myfiles" }, { label: "usage details" }, { label: "request table" }, { label: "output folder" }, { label: "request folder" }, { label: "error folder" }];

  displayedColumns = ['s.no.', 'request id', 'document name', 'feature requested', 'operation request date & time', 'operation completion date & time', 'document path', 'output path', 'Indexing', 'operation status'];

  vfolderDisplayedColumns = ['s.no.', 'request id', 'folder name', 'feature requested', 'operation request date & time', 'operation time taken', 'status name', 'visualize', 'google drive input folder', 'google drive output folder', 'input folder', 'output folder', 'operation status', 'progress', 'project name','error path', 'HT', 'OCCM', 'AD', 'SB', 'LDND'];

  tableData: any[] = [];

  // filerObj: any = { document_name: "", operation_requested: "", operation_status: "", request_id: "",operation_request_time:["",""] };
  filerObj: any = { document_name: "", operation_requested: "", operation_status: "", request_id: "" };

  // featureList: any[] = ['File Upload','Affirmative Sentences','Sentiment Detection','Quantitative Sentences','Add Bookmarks','Bookmark Based Split','Anchor Based Document Ordering','Attribute Retrieval','DB Based Redact','DB Based Highlight','Image Augmentation','Watermarking','Color Detection','Document Classification','Encryption','Decryption','Document Comparison','Metadata Extraction','Metadata Updation','Metadata Deletion','Internal Linking','Content Based Grouping','Layout Based Grouping','Page Similarity','Highlight Handwritten','Redact Handwritten','Heading Detection','Highlight People Sentences','Highlight Place Sentences','Highlight Numeric Sentences','Highlight Date Sentences','Highlight People Terms','Highlight Place Terms','Highlight Numeric Terms','Highlight Date Terms','Redact People Sentences','Redact Place Sentences','Redact Numeric Sentences','Redact Date Sentences','Redact People Terms','Redact Place Terms','Redact Numeric Terms','Redact Date Terms','Highlight Infographic','Redact Infographic','Language Detection','Questionary Detection','Questionary Summary','Extractive Summary','Quantitative Summary','Advance File Search','Advance Folder Search'];

  featureList: any[] = ['File Upload', 'Hard time folder', 'Hard time dashboard', 'Document Classification', 'Image Augmentation', 'Watermarking', 'Page Reordering', 'Document merge', 'Delivery Bible', 'VirtualFolder', 'AMP Build'];

  vfolder: boolean = false;

  constructor(private router: Router, private _auth: AuthService,private _statustableservice: StatusTableService, private http: HttpClient, public _common: CommonnService, private sanitizer: DomSanitizer, private _directory: DirectoryService) { }

  ngOnInit(): void {
    this.getStatusTableData();
  }

  getStatusTableData() {
    this.currPage = 1;
    this.currTableName = "Activity Log";
    this.displayedColumns = ['s.no.', 'request id', 'document name', 'feature requested', 'operation request date & time', 'operation completion date & time', 'document path', 'output path', 'Indexing', 'operation status'];
    this._statustableservice.getStatusTableData('/document_upload/documents/all/?p=' + this.currPage + '&user_id=', this.filerObj).subscribe((res: any) => {
      console.log(res);
      this.vfolder = false;
      this.setPaginationData(res);
    })
  }

  getRequestTableData() {
    this.filerObj.document_name = "";
    this.currPage = 1;
    this.currTableName = "Request Table";
    this.displayedColumns = ['s.no.', 'request id', 'feature requested', 'operation request date & time', 'operation completion date & time', 'input path', 'output path', 'operation status']
    this._statustableservice.getStatusTableData('/web_feature/fetch_status_table/all/?p=' + this.currPage + '&user_id=', this.filerObj).subscribe((res: any) => {
      this.vfolder = false;
      this.setPaginationData(res);
    })
  }

  getVFolderTableData() {
    this.currTableName = "Virtual Folder";
    this._statustableservice.getStatusTableData('/link_upload/documentslink/all/?p=' + this.currPage + '&user_id=', this.filerObj).subscribe((res: any) => {
      console.log(res);
      this.vfolder = true;

      this.setPaginationData(res);
    })
  }

  getTableData() {
    if (this.currTableName === "Activity Log") {
      this.filerObj.document_name = "";
      this.currPage = 1;
      this.getRequestTableData();
    }
    else {
      this.currPage = 1;
      this.getStatusTableData();
    }
  }

  showRequestTable() {

  }

  filterTable() {
    if (this.currTableName === "Activity Log") {
      this.getStatusTableData();
    }
    else if (this.currTableName === "Virtual Folder") {
      this.getVFolderTableData();
    }
    else {
      this.filerObj.document_name = "";
      this.getRequestTableData();
    }
  }

  getDataOnSpecificIndex() {
    if (this.currPage > this.totalPage) {
      this.currPage = this.totalPage;
    } else if (this.currPage < 1) {
      this.currPage = 1;
    }
    console.log(this.currPage);

    this.filterTable();
  }

  nextPage() {
    this._statustableservice.pageChange(this.nextPageUrl).subscribe((res: any) => {
      this.setPaginationData(res);
    })
  }

  prevPage() {
    this._statustableservice.pageChange(this.prevPageUrl).subscribe((res: any) => {
      this.setPaginationData(res);
    })
  }

  setPaginationData(res: any) {
    this.totalCount = res.pagination_info.total_records;
    this.currPage = res.pagination_info.current_page_number;
    this.totalPage = res.pagination_info.total_pages;
    this.nextPageUrl = res.pagination_info.next;
    this.prevPageUrl = res.pagination_info.previous;

    this.tableData = res.res_data;
    console.log(res);
  }

  showCanvas() {
    console.log("fired");
    this.showRightCanvas = true;
    console.log(this.showRightCanvas);

  }

  setSelectedStatus(status: string) {
    if (this.selectedStatus !== status) {
      this.selectedStatus = status;
    } else {
      this.selectedStatus = '';
    }
  }

  addHighlightClass(ocr_status: any = null, op_status: any) {
    // return status === 'COMPLETE' ? 'green white' : status === 'PENDING' ? 'yellow white' : 'red white';
    if (ocr_status === null && op_status === 'COMPLETE') {
      return 'green white';
    }
    else if (ocr_status === null && op_status === 'PENDING') {
      return 'yellow white';
    }
    else if (ocr_status === null && op_status === 'FAILED') {
      return 'red white';
    } else {
      return ocr_status === 1 ? 'green white' : ocr_status === 0 ? 'red white' : '-NA-';
    }
  }

  redirectUserToDir(path: string) {
    if(path.includes('Delivery Bible')){
    console.log("in redirect sec... include Buils ", path)
      this.setBuildBibleTree(path)
    }
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

  setBuildBibleTree(path:string){
    localStorage.removeItem('buildBibleSubDir')
    let formData = new FormData;
    formData.append("dir_path", path);
    // formData.append("dir_path_g", gpath);
    formData.append("user_id", this._auth.user_id);
    this.http.post('/filestorage_features/fastloading/', formData).subscribe((res: any) => {
      this.setBuildBibleTreeNode(path,res.res_data.file_folder_info.length)
    });
  }

  setBuildBibleTreeNode(path:string ,total_count:Number) {
    let _path = path.split('/')
    _path.pop()
    let rootpath=_path.join('/')
    let name = _path[_path.length-1].slice(0, -18);
    // let name="Delivery Bible"
    this._common.$selectedFolderData.next({});
    let rootDir = {}
    rootDir = {
      "name": name,
      "id": 0,
      "path": rootpath,
      "total_count": total_count,
      "type": "directory",
      "expanded": false,
    }
    localStorage.removeItem('buildBibleSubDir')
    console.log("parant node created from status table", rootDir)
    this._common.$selectedFolderData.next(rootDir);
    this._common.$showFeatureList.next(false)
    this._common.$showTree.next(false)
    this._common.$showFolderTree.next(true)
    // localStorage.setItem('foldertree',JSON.stringify(rootDir))
  }


  redirectUserToGdrive(path: any) {
    // window.location = path.substr(1,path.length-1);
    window.open(path.substr(0, path.length - 1), '_blank');
  }

  getLinkArr(arr: any) {
    if (!arr) {
      return ['NAAA'];
    }
    arr = arr.split(",");
    arr[0] = arr[0].substring(0);
    arr[arr.length - 1] = arr[arr.length - 1].substring(
      0,
      arr[arr.length - 1].length - 1
    );

    // console.log(arr);
    return arr;
  }

  showResult(id: any, folderName: string, feature: string) {
    localStorage.setItem('v_id', id);
    localStorage.setItem('v_folderName', folderName);
    localStorage.setItem('v_feature', feature);
    this.router.navigate(['/viewDir/flight-details'])
  }

  redirectToFolders(dir: string) {
    if (dir.includes('G_input')) {
      this._common.redirectToDir(dir, 'ginput');
    }
    else if (dir.includes('Err')) {
      this._common.redirectToDir(dir, 'err');
    }
    else {
      console.log("path is ",dir)
    if(dir.includes('Delivery Bible')){
    console.log("in redirect sec... include Buils ", dir)
      this.setBuildBibleTree(dir)
    }
      this._common.redirectToDir(dir, 'output');
    }
  }

}
