import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataLakeFileClient, DataLakeFileSystemClient, DataLakeServiceClient, RestError } from '@azure/storage-file-datalake';
import { log } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonnService } from '../common/commonn.service';
import { ModalService } from './modal.service';


@Injectable({
  providedIn: 'root'
})
export class UploadDirectoryService {

  totalFilesToUpload: number = 0;
  filesUploaded: number = 0;

  totalFileSize: number = 0;
  totalUploadedFilesSize: number = 0;

  totalPdfFiles: number = 0;
  totalPdfPages: number = 0;
  totalPdfFilesChecked: number = 0;

  currentPath: string = "";
  operationReqTime: Date = null;
  requestId: string = null;

  showUploadProgress: boolean = false;

  fileSystemClient: DataLakeFileSystemClient;

  errorUploadFileCount: number = 0;

  successTotalFileSize: number = 0;
  successFilesUploaded: number = 0;

  isUploadProcessing: boolean = false;

  parallelApiCall: any[] = [];
  fillStatusTableData: any[] = [];


  constructor(private httpClient: HttpClient, private ngxService: NgxUiLoaderService, private _modal: ModalService, private _auth: AuthService, private _common: CommonnService) {
  }

  // docuexpertuat
  getFileSystemClient(currentPath: string = "", fileSys: string = "docuexpertuat2/Input_Folder/"): DataLakeFileSystemClient {
    const account = "docuexpertstorage";
    // const sas = "?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupx&se=2030-10-07T15:47:12Z&st=2021-10-07T07:47:12Z&spr=https,http&sig=PUGBfjV2gCQL9sNtSugw67C37SSup0ZKOOsWWTX%2Bt6M%3D";
    const sas = "?sp=racwdlmeop&st=2022-08-12T06:43:38Z&se=2023-02-01T14:43:38Z&sv=2021-06-08&sr=c&sig=%2Byerj9lHmH5P5tJBbWVQrbjCs9ICKIc74uuOuetggrs%3D";

    const datalakeServiceClient = new DataLakeServiceClient(
      `https://${account}.dfs.core.windows.net${sas}`
    );

    let fileSystemName = fileSys + this._auth.org_name + '/' + this._auth.user_name;

    if (currentPath) {
      this.currentPath = this._auth.org_name + '/' + this._auth.user_name + '/' + currentPath;
      fileSystemName = fileSys + this._auth.org_name + '/' + this._auth.user_name + '/' + currentPath;
    } else {
      this.currentPath = this._auth.org_name + '/' + this._auth.user_name;
    }

    try {
      this.fileSystemClient = datalakeServiceClient.getFileSystemClient(fileSystemName);
    } catch (error) {
      console.log(error);
    }
    this.operationReqTime = new Date();
    this.requestId = this._common.getRandomString();

    console.log(fileSystemName);
    
    return this.fileSystemClient;
  }

  async uploadFiles(selectedFiles: any[]) {
    console.log("process", selectedFiles, selectedFiles.length);

    let files = selectedFiles;

    this.totalFilesToUpload += files.length;
    let totalFilesToUploadLen = files.length;

    this.errorUploadFileCount = 0;
    this.fillStatusTableData = [];

    // this.uploadFilesToAzure(files);

    this.ngxService.start();

    let totalPdfPages = await this.checkPdfPageNumbers(files);
    if ((totalPdfPages === 0) && (this.totalPdfFiles > 0)) {
      this._modal.showError("Error Reading Pdf File!!!");
      this.ngxService.stop();
      return;
    } else if (totalPdfPages > 0) {
      this._common.loaderText = "Validating Upload Request";
      console.log('totalPdfPages', totalPdfPages);
      // this.ngxService.stop();
      this.validateUploadRequest(totalPdfPages, totalFilesToUploadLen, files);
      // this.uploadFilesToAzure(files);
    } else {
      console.log("csv detected!!!");
      this.uploadFilesToAzure(files);
    }
  }

  async checkPdfPageNumbers(files: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (let i = 0; i < files.length; i++) {
          let file = files[i];

          this.totalFileSize += file.size;

          if (file.name.toLowerCase().includes('.pdf')) {
            this.totalPdfFiles++;

            let reader = new FileReader();
            reader.readAsBinaryString(file);

            reader.onload = () => {
              let raw: any = reader.result;

              reader = null;
              let matchedString = raw.match(/\/Type[\s]*\/Page[^s]/g);
              raw = null;
              if (matchedString) {
                const count = matchedString.length;
                this.totalPdfPages += count;
              }
              this.totalPdfFilesChecked += 1;
              this._common.loaderText = 'Checking PDF Pages ' + this.totalPdfFilesChecked + '/' + this.totalPdfFiles;
              // console.log(this.totalPdfFiles,this.totalPdfFilesChecked);

              if (this.totalPdfFilesChecked === this.totalPdfFiles) {
                this.totalPdfFilesChecked = 0;
                this.totalPdfFiles = 0;
                resolve(this.totalPdfPages);
                this._common.loaderText = this.totalPdfPages + " PDF Pages Found"
                this.totalPdfPages = 0;
                setTimeout(() => {
                  this._common.loaderText = null;
                }, 100);
              }
            }
          }
          if ((i === (files.length - 1)) && (this.totalPdfFiles === 0)) {
            resolve(0);
          }
        }
      }, 500);
    });
  }

  async validateUploadRequest(pdfPageCount: number, totalFilesToUpload: number, files: any[]) {
    this.httpClient.get('/web_feature/validate_usage/?user_id=' + this._auth.user_id + '&feature=File Upload&request_page_count=' + pdfPageCount + '&request_document_count=' + totalFilesToUpload).subscribe(res => {
      this._common.loaderText = "Completed";
      // this.fillRequestTableBeforeUpload("True");
      console.log(res);
      // this.ngxService.stop();
      this.uploadFilesToAzure(files);
    });
  }

  async uploadFilesToAzure(files: any[]) {
    this.isUploadProcessing = true;
    this.showUploadProgress = true;
    for (let i = 0; i < files.length; i++) {

      let fileName = files[i].name;
      fileName = fileName.split(".");
      fileName[fileName.length - 1] = fileName[fileName.length - 1].toLowerCase();
      fileName = fileName.join(".");

      const fileClient: DataLakeFileClient = this.fileSystemClient.getFileClient(fileName);
      console.log(fileClient.getProperties(),fileClient);
      
      let exists: any = null;
      try {
        exists = await fileClient.getProperties();
      } catch (error: any) {
        exists = null;
      }

      if (exists) {
        console.log("File Already Exists", exists);
        this.totalFileSize -= files[i].size;
        this.errorUploadFileCount += 1;

        let reqTime = JSON.stringify(this.operationReqTime);
        this.uploadFailed(fileName, reqTime, 'File Already Exists');
        this.resetAll();
      } else {
        this.processUploadAsync(fileClient, files[i], fileName);
      }
    }
  }

  async processUploadAsync(fileClient: DataLakeFileClient, file: any, fileName: string) {
    let uploadedBytes: number = 0;
    let reqTime = JSON.stringify(this.operationReqTime);

    try {
      let res = await fileClient.upload(file, {
        onProgress: ((res: any) => {

          this.totalUploadedFilesSize += res.loadedBytes - uploadedBytes;
          uploadedBytes = res.loadedBytes;

          if (res.loadedBytes === file.size) {

            this.filesUploaded += 1;

            this.uploadSuccess(fileName, reqTime);
          }
          this.resetAll();
        }), maxConcurrency: 5
      });
    } catch (error: any) {
      this.uploadFailed(fileName, reqTime, 'File Upload Failed');
      this.totalFileSize -= file.size;
      this.errorUploadFileCount += 1;
      this.resetAll();
    }

  }

  async resetAll() {
    if (this.filesUploaded === (this.totalFilesToUpload - this.errorUploadFileCount)) {

      // this.fillRequestTableBeforeUpload("False");
      this._common.$updateDirectory.next('');
      this.successFilesUploaded = this.filesUploaded;
      this.successTotalFileSize = this.totalUploadedFilesSize;

      this.currentPath = "";
      this.isUploadProcessing = false;
      this.filesUploaded = 0;
      this.totalFilesToUpload = 0;
      this.totalFileSize = 0;
      this.totalUploadedFilesSize = 0;
      // let statusTableData = this.fillStatusTableData.slice();
      // this.fillStatusTable(statusTableData);
      this.fillStatusTableData = [];
    }
  }

  // async addStatusTableData(fileName: string, status: string, errmsg: string) {
  //   let reqTime = JSON.stringify(this.operationReqTime);

  //   if (this.fillStatusTableData.length === 1000) {
  //     let statusTableData = this.fillStatusTableData.slice();

  //     if (this.filesUploaded !== (this.totalFilesToUpload - this.errorUploadFileCount)) {
  //       this.fillStatusTable(statusTableData);
  //       this.fillStatusTableData = [];
  //     }

  //   }

  //   let compTime = JSON.stringify(new Date());
  //   this.fillStatusTableData.push({
  //     file_name: fileName,
  //     upload_status: status,
  //     error_msg: errmsg,
  //     folder_path: this.currentPath,
  //     operation_request_time: reqTime.substring(1, reqTime.length - 1),
  //     operation_completion_time: compTime.substring(1, compTime.length - 1)
  //   });
  // }

  uploadSuccess(fileName: any, reqTime: any) {
    let compTime = JSON.stringify(new Date());
    this.fillStatusTable({
      file_name: fileName,
      upload_status: "COMPLETE",
      error_msg: "null",
      folder_path: this.currentPath,
      operation_request_time: reqTime.substring(1, reqTime.length - 1),
      operation_completion_time: compTime.substring(1, compTime.length - 1)
    });
  }

  uploadFailed(fileName: any, reqTime: any, msg: string) {
    let compTime = JSON.stringify(new Date());
    this.fillStatusTable({
      file_name: fileName,
      upload_status: "FAILED",
      error_msg: msg,
      folder_path: this.currentPath,
      operation_request_time: reqTime.substring(1, reqTime.length - 1),
      operation_completion_time: compTime.substring(1, compTime.length - 1)
    });
  }

  async fillStatusTable(statusTableData: any) {
    console.log("statusTableData", statusTableData);
    let formdata = new FormData();

    formdata.append('user_id', this._auth.user_id);
    formdata.append('request_id', this.requestId);
    formdata.append('upload_info', JSON.stringify([statusTableData]));
    formdata.append('operation_requested', "File Upload");

    this.httpClient.post("/document_upload/fill_upload_data/", formdata).subscribe(res => { console.log(res) }, err => { console.log("error", statusTableData) });
  }

  async fillRequestTableBeforeUpload(update_before_execution: string) {
    let formdata = new FormData();

    formdata.append('user_id', this._auth.user_id);
    formdata.append('request_id', this.requestId);
    formdata.append('folder_path', this.currentPath);
    formdata.append('operation_requested', "File Upload");
    formdata.append('total_count', this.totalFilesToUpload.toString());
    formdata.append('success_count', this.filesUploaded.toString());
    formdata.append('failed_count', this.errorUploadFileCount.toString());
    formdata.append('update_before_execution', update_before_execution);

    this.httpClient.post("/document_upload/fill_upload_request/", formdata).subscribe(res => { console.log(res) });
  }

  getTimetoCompleteUpload() {
    let bytesToupload = this.totalFileSize - this.totalUploadedFilesSize;
  }

}

// To do multiple upload at a same time create global variable files:any[] = []; like this and push file to this array if upload in progress or assaign file array to this.files.

// .subscribe(res => {
//   console.log(res);
// });

//if length > 1000 then send array and then flush array



// count: number = 5;
//   updateDirectory() {
//     if (Math.floor(this.totalFilesToUpload / this.count) === this.filesUploaded) {
//       this._common.$updateDirectory.next('');
//       if (this.count > 0) {
//         this.count--;
//       }
//     }
//   }

