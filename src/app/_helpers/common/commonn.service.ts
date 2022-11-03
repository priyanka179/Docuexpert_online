import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
// import { DirectoryService } from './services/directory.service';

@Injectable({
  providedIn: 'root'
})
export class CommonnService {

  $updateDirectory = new Subject();

  $unselectFeatureCheckbox = new Subject();

  $featureName = new BehaviorSubject<any>('');

  $unselectPdfCsvDirectory = new Subject();

  $featureProgressStart = new Subject();

  $removeAllModals = new Subject();

  $tableViewData = new BehaviorSubject<any>([]);

  $updateCurrentOutput = new BehaviorSubject<any>('');

  $toggleSidebar = new Subject();

  $openDirectory = new Subject();

  $openFile = new Subject();

  $refreshDirectories = new Subject();

  $downloadBible = new Subject();
  $varifyFolder = new BehaviorSubject('');

  $showFileMov = new BehaviorSubject(false);



  $pushDirForBiblePageReordering = new Subject();

  $showTree = new BehaviorSubject(false);
  $showFolderTree = new BehaviorSubject(false)
  $showFeatureList = new BehaviorSubject(true)
  // $resetMyFile = new BehaviorSubject(false)
  $resetMyFile = new Subject()




  $hideExternalViewer = new Subject();

  $foldersTreeData = new BehaviorSubject({});
  $selectedFolderData = new BehaviorSubject({});
  $addUserDetailsData = new BehaviorSubject({});



  $deleteBible = new Subject();

  $listView = new BehaviorSubject<boolean>(true);
  $largView = new BehaviorSubject<boolean>(false);


  $nameMode = new BehaviorSubject('short');

  currSelectedFeature = '';

  loaderText: string = "";

  showDownloadModal: boolean = false;
  downloadedData: any = 0;
  totalDownloadFileSize: any = 0;
  downloadProgress: any = 0;
  downloadComplete: boolean = false;
  showBuildBibleDownload=new BehaviorSubject(false);

  showVUploadModal: boolean = false;
  vuploadComplete: boolean = false;
  vuploadProgress: any = 0;
  vdocumentProgress: any = 0;

  containerRef: any = null;

  constructor(private router: Router) { }

  getRandomString(): string {
    // return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 2);
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 2);
  }

  csvToText(encodedString: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const byteCharacters = atob(encodedString);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'text/csv' });

      let fileReader = new FileReader();

      let csvText: any = null;
      fileReader.onload = async (e) => {
        csvText = fileReader.result;
        resolve(csvText);
      }
      fileReader.readAsText(blob);
    });
  }

  xlsxtoText(encodedString: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let sliceSize = 512
      let byteCharacters = window.atob(encodedString); //data.file there
      let byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset++) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      let blob = new Blob(byteArrays, { type: 'text/xlsx' });

      let fileReader = new FileReader();

      let csvText: any = null;
      fileReader.onload = async (e) => {
        csvText = fileReader.result;
        resolve(csvText)
      }
      fileReader.readAsText(blob);

    });
  }



  redirectToDir(errorPath: string, folderName: string) {
    let redirect_path = errorPath.split('/').slice(3);
    console.log("redirect path is >>>>>>>>>>>>>>>>>>", redirect_path);
    
    if (!(folderName === 'ginput')) {
      redirect_path.pop();
    }
    if (folderName === 'output') {
      console.log("inside output")
      localStorage.setItem('output', JSON.stringify(redirect_path));
      this.router.navigate(['/viewDir/output-folder']);
    }
    else if (folderName === 'req') {
      localStorage.setItem('req', JSON.stringify(redirect_path));
      this.router.navigate(['/viewDir/request-folder']);
    }
    else if (folderName === 'err') {
      localStorage.setItem('err', JSON.stringify(redirect_path));
      this.router.navigate(['/viewDir/error-folder']);
    }
    else {
      localStorage.setItem('input', JSON.stringify(redirect_path));
      this.router.navigate(['/viewDir/myfiles']);
    }
  }

 

  redirectToNestedFolder(Path: string, folderName: string) {
    let redirect_path = Path.split('/').slice(3);
    console.log("redirect path is >>>>>>>>>>>>>>>>>>", redirect_path);
    if (!(folderName === 'ginput')) {
      redirect_path.pop();
    }
    if (folderName === 'output') {
      console.log("inside output")
      localStorage.setItem('output', JSON.stringify(redirect_path));
      let currentUrl = this.router.url;
      console.log("")
      this.router.navigateByUrl('/viewDir', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    }
    else if (folderName === 'req') {
      localStorage.setItem('req', JSON.stringify(redirect_path));
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/viewDir', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    }
    else if (folderName === 'err') {
      localStorage.setItem('err', JSON.stringify(redirect_path));
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/viewDir', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    }
    else {
      localStorage.setItem('input', JSON.stringify(redirect_path));
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/viewDir', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    }
  }

  dec2hex(dec: any) {
    return dec.toString(16).padStart(2, "0")
  }

  // generateId :: Integer -> String
  generateId(len = 10) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, this.dec2hex).join('')
  }
}

//break number into 5 parts javascript

