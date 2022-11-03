import { HttpClient, HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
import { Chart, registerables } from 'chart.js';
import { BdbServiceService } from './services/bdb-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FileSaverService } from 'ngx-filesaver';
import { ModalService } from 'src/app/_helpers/services/modal.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-build-delivery-bible',
  templateUrl: './build-delivery-bible.component.html',
  styleUrls: ['./build-delivery-bible.component.scss'],
  providers: [BdbServiceService]
})
export class BuildDeliveryBibleComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input()
  path: string = '';

  bdbFolderList: any[] = [];

  folderPath: any = '';

  selectedFolderLatter: number

  largeView: boolean = false;

  listview: boolean = true;

  fullView: boolean = true;

  showOnDragOver: boolean = false;
  onDragOverFolderName: string = '';

  unclassifiedDrag: boolean = false;
  ispdfClicked: boolean = false

  isDownloadAllProcessing: boolean = false;
  pdfFilePath: any;
  totalFolders: number;
  showPdfViewer: boolean = false
  fullViewPath: string;

  constructor(private http: HttpClient, private _auth: AuthService, private _common: CommonnService, public router: Router, private _bdbService: BdbServiceService, private _ngxService: NgxUiLoaderService, private _FileSaverService: FileSaverService, private _modal: ModalService, private sanitizer: DomSanitizer, private httpClient: HttpClient) {
    Chart.register(...registerables);
    this._common.$listView.subscribe(res => {
      this.listview = res
    })
    this._common.$largView.subscribe(res => {
      // console.log("list view >>>>>>>>>>",res)
      this.largeView = res
    })
    // this._common.$showFileMov.subscribe(res=>{
    //   this.fullView=res
    // console.log(">>>>>?????????????2",this.fullView)
    // })
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.focusAlphabet();
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this._common.currSelectedFeature === 'Page Reordering' || this._common.currSelectedFeature === 'Document merge' || this._common.currSelectedFeature === 'Image Augmentation' || this._common.currSelectedFeature === 'Watermarking') {
      console.log("destroy");

      this.pushDirToMyfiles();
    }
  }

  base_path = 'Output_Folder/';
  ngOnInit(): void {
    console.log("In Buid Bible")
    if (localStorage.getItem('buildBibleSubDir')) {
      let val = localStorage.getItem('buildBibleSubDir')
      this.selectedFolderLatter = Number(val)
      console.log("selected folder is", val, this.selectedFolderLatter)
      this.fullView = false
    }
    console.log(this.router.url, this.router.url.split('/')[2]);
    // this.listDirectories();

    this._common.$downloadBible.subscribe((res: any) => {
      this.download();
    });

    this._common.$varifyFolder.subscribe((res: any) => {
      // this.download();
      console.log(".......///varifyFolder", res)
      if (res != "") {
        this.verifyFunc(res)
      }
    });

    this._common.$deleteBible.subscribe((res: any) => {
      this.delete();
    });

    // if (this.router.url.split('/')[2] === 'output-folder') {
    //   this.base_path = 'Output_Folder/';
    // } 
    // else if (this.router.url.split('/')[2] === 'request-folder') {
    //   this.base_path = 'Req_Output_Folder/';
    // }
    // else {
    //   this.base_path = 'Output_Folder/';
    // }

    let letter = JSON.parse(localStorage.getItem('output')).pop()[2];

    localStorage.setItem('letter', letter);
  }

  pushDirToMyfiles() {
    console.log(this.bdbFolderList);
    let pageReorderFolderList: any[] = [];
    this.getNumbers().forEach((c) => {
      this.bdbFolderList[this.getLetters(c)] && this.bdbFolderList[this.getLetters(c)].forEach((data: any) => {
        if (data.name.includes('.')) {
          pageReorderFolderList.push(data);
        }
      })
    });

    // this.unclassified.forEach((data: any) => {
    //   if (data.name.includes('.')) {
    //     pageReorderFolderList.push(data);
    //   }
    // });

    this._common.$pushDirForBiblePageReordering.next(pageReorderFolderList);
  }

  ngOnChanges(): void {
    this.listDirectories();
  }

  focusAlphabet(): void {
    if (true) {
      let firstLetter = localStorage.getItem('letter');
      let elem: HTMLElement = document.getElementById(firstLetter);
      console.log("test", firstLetter);

      // if (this._common.containerRef) return;
      this._common.containerRef.scrollTop = elem && elem.offsetTop - 250;
    }
  }

  goToMyfiles() {
    localStorage.removeItem('output');
    localStorage.removeItem('input');
    this.router.navigate(['/viewDir/myfiles']);
  }

  showFetchDirSpinner: boolean = false;
  listDirectories() {
    this.showFetchDirSpinner = true;
    this.folderPath = JSON.parse(localStorage.getItem('output'));

    let formData = new FormData;

    let path = this.path;
    let gpath = this.path;

    if (!path) {
      return;
    }

    formData.append("dir_path", path);
    // formData.append("dir_path_g", gpath);
    formData.append("user_id", this._auth.user_id);

    console.log("working",path);
    let path2=path.split('/')
    let api
    if(path2[path2.length - 1].includes("Delivery Bible")){
    api='/filestorage_features/fastloading/'
    }else{
      api='/filestorage_features/folder_and_files/'
    }

    // this.http.post('/filestorage_features/folder_and_files/', formData).subscribe((res: any) => {
    this.http.post(api, formData).subscribe((res: any) => {
      this.bdbFolderList = res.res_data && res.res_data.file_folder_info;
      // let ind=this.bdbFolderList.findIndex((ind:any)=>ind.name="myfile.txt")
      // if(ind>=0){
      //   this.bdbFolderLis
      // }
      let folderlist: any = []
      this.bdbFolderList.forEach((res: any) => {
        console.log("??????",res)
        if (res.name != "Unclassified")
          folderlist.push(res.name)
      })

      console.log("?????????>>>>>", this.bdbFolderList)
      console.log("?????????>>>>>", folderlist)

      this.totalFolders = this.bdbFolderList.length - 1
      this.buildDeliveryBible();
      this.getUnclassifiedFiles();
      this.showFetchDirSpinner = false;
    });
  }



  getUnclassifiedFiles() {
    let ouputPath = null;
    if (this.router.url !== '/viewDir/currentOutput') {
      ouputPath = JSON.parse(localStorage.getItem('output'));
    }
    if (!ouputPath) return;
    if (this.checkPath()) {
      ouputPath.pop();
    }
    let path = this.base_path + this._auth.org_name + '/' + this._auth.user_name + "/" + ouputPath.join('/');
    let unclassifiedFormData = new FormData();
    unclassifiedFormData.append("dir_path", path + '/Unclassified');
    // unclassifiedFormData.append("dir_path_g", path);
    unclassifiedFormData.append("user_id", this._auth.user_id);

    this._bdbService.getUnclassifiedFiles(unclassifiedFormData).subscribe((res: any) => {
      this.unclassified = res.res_data && res.res_data.file_folder_info;
      let index = this.unclassified.findIndex((val: any) => val.name == 'myfile.text')
      this.unclassified.splice(index, 1)
      this.unclassified.forEach((data: any) => {
        if (data.is_directory === true) {
          data['directory'] = 'Folder';
        } else {
          data['directory'] = 'File';
        }
      })
    });
  }

  getNumbers() {
    return Array.from(Array(11).keys());
  }

  getLetters(n: number): any {
    return String.fromCharCode(65 + n);
  }

  getCategoryName(n: number): any {
    let arr = ['Certificates', 'Aircraft Maintenance Status  Summaries', 'Aircraft Maintenance Records', 'Configuration Status', 'Aircraft Manufacturer Records', 'Engine Records', 'APU', 'Component Records', 'Landing Gears', 'Manuals', 'Propellers (for each propellor)']
    return arr[n]
  }

  showActive(dirName: string) {
    let pathList = JSON.parse(localStorage.getItem('output'));
    return pathList[pathList.length - 1] === dirName;
  }

  getFolderList(n: number) {
    let letter: string = String.fromCharCode(65 + n);

    // console.log(this.bdbFolderList);

    //@ts-ignore
    return this.bdbFolderList[letter] || [];
  }

  checkPath() {
    let path = JSON.parse(localStorage.getItem('output'));

    let index = path && path.findIndex((path: string) => {
      return path.includes('Delivery Bible');
    });

    // console.log(path && ((path.length - 1) > index), index, path.length - 1,path);

    return path && ((path.length - 1) > index);
  }

  backToDirectory() {
    let path = JSON.parse(localStorage.getItem('output'));
    path.pop();
    localStorage.setItem("output", JSON.stringify(path));

    this._common.$refreshDirectories.next('');
    // this.listDirectories();
  }

  openFolder(dirName: string, letter: string) {
    localStorage.setItem('letter', letter);
    let path = JSON.parse(localStorage.getItem('output'));
    path.pop();
    path.push(dirName);
    localStorage.setItem("output", JSON.stringify(path));

    console.log(path, dirName);


    this._common.$refreshDirectories.next('');
  }

  updateFolderInfo() {
    let folderList: any[] = [];

    this.getNumbers().forEach((c) => {
      //@ts-ignore
      folderList.push({ [this.getLetters(c)]: this.bdbFolderList[this.getLetters(c)] });
    });

    console.log(folderList);

    localStorage.setItem('bible_folder_list', JSON.stringify(folderList));
  }

  openDirectory(directoryData: any, letter: string) {
    if (directoryData['directory'] === 'Folder') {
      let latterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
      // let path = JSON.parse(localStorage.getItem('output')) || [];
      // if (path.length < 4 || this.router.url === '/viewDir/currentOutput') {
      //   this.updateFolderInfo();
      // }
      let index = latterArr.indexOf(letter)
      if (index >= 0) {
        localStorage.setItem("buildBibleSubDir", index.toString())
      }

      this.updateFolderInfo();
      localStorage.setItem('letter', letter);

      this.path = directoryData.path + '/' + directoryData.name;

      directoryData.path = this.path;
      this._common.$openDirectory.next(directoryData);

      if (this.router.url.includes('/viewDir/currentOutput')) {
        console.log(this.path.split('/').slice(3));
        localStorage.setItem('output', JSON.stringify(this.path.split('/').slice(3)));

        this.router.navigate(['/viewDir/output-folder']);
      }
    } else {
      if (letter == 'unclassified') {
        this.showPdfViewer = true
        this.ispdfClicked = false
        this.fullViewPath = directoryData.path + "/" + directoryData.name
      } else {
        console.log(">>>>>>>>>>>>>>>dirdata", directoryData)
        let path = directoryData.path + "/" + directoryData.name
        this.showPdfAtRight(path)
      }
      // this._common.$openFile.next(directoryData);

    }

    console.log(this.bdbFolderList);

    this.focusAlphabet();
  }
  showPdfAtRight(path: string) {
    // this.pdfFilePath=path

    if (path.includes("/home/statvalu-local/mycontainer")) {
      path = path.replace("/home/statvalu-local/mycontainer/", "")
    }

    console.log(path)
    let formdata = new FormData;

    formdata.append('dir_path', path);

    this.httpClient.post(
      '/document_upload/download_output_files/',
      formdata, { reportProgress: true, observe: 'events' })
      .subscribe((res: any) => {
        if (res.type === HttpEventType.DownloadProgress) {
          const percentDone = Math.round(100 * res.loaded / res.total);
          this._common.loaderText = `Downloading PDF ${percentDone}%`;
        }
        if (res.type === HttpEventType.Response) {
          res['body']['res_data'] && this.readPdf(res['body']['res_data']['encoded_string']);
        }
      });
  }

  readPdf(res: any) {
    const byteCharacters = atob(res);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    let objectUrl = URL.createObjectURL(new Blob([byteArray], { type: "application/pdf" }));
    this.pdfFilePath = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
    if (this.pdfFilePath) {
      this.ispdfClicked = true
    }

    console.log(this.pdfFilePath, this.ispdfClicked)

  }

  unclassified: any[] = [];
  bibleFolderList: any[] = [];
  buildDeliveryBible() {
    let bdbFolderListAlphabatically: any[] = [];
    this.unclassified = [];
    console.log("bdbFolderListbdbFolderListbdbFolderList", this.bdbFolderList)
    this.bdbFolderList.sort((a, b) => {
      let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    this.bdbFolderList.forEach(element => {
      let firstLetter: any = "";
      element['drag'] = false;
      if (element.is_directory === true) {
        element['directory'] = 'Folder';
        if (this.checkPath() && !this.router.url.includes('/viewDir/currentOutput')) {
          firstLetter = localStorage.getItem('letter');
        } else {
          firstLetter = element.name.charAt(0).toUpperCase();
        }
      } else {
        element['directory'] = 'File';
        firstLetter = localStorage.getItem('letter');
        this.bibleFolderList = JSON.parse(localStorage.getItem('bible_folder_list'));
        console.log(firstLetter);
      }

      if (!bdbFolderListAlphabatically[firstLetter]) {
        bdbFolderListAlphabatically[firstLetter] = [];
      }

      if (element.name !== 'Unclassified' && firstLetter !== 'unclassified') {
        bdbFolderListAlphabatically[firstLetter].push(element);
      }
      else {
        this.unclassified.push(element);
      }
    })

    this.bdbFolderList = bdbFolderListAlphabatically;
  }

  @ViewChild('myChart') myChart: ElementRef;
  @ViewChild('graphcontainer') graphcontainer: ElementRef;

  myChartObj: any;
  graphType: string = '';
  showGraph() {
    this.calculateNumberOfSuccess();
    this.myChartObj && this.myChartObj.destroy();
    const ctx = this.myChart.nativeElement;
    this.myChartObj = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
        datasets: [
          {
            label: 'Success',
            data: this.graphList[0],
            backgroundColor: '#198754',
            // borderColor: '#198754',
            borderWidth: 0
          },
          {
            label: 'Failure',
            data: this.graphList[1],
            backgroundColor: '#DC3545',
            // borderColor: '#DC3545',
            borderWidth: 0
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Records',
              font: { size: 18, weight: '500' }
            },
            ticks: {
              font: { weight: '600' }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Aspects',
              font: { size: 18, weight: '500' }
            },
            ticks: {
              font: { weight: '600' }
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: 15
              }
            }
          }
        }
      }
    });
  }

  graphList: any[][] = [[], []];
  calculateNumberOfSuccess() {
    this.graphList = [[], []];
    this.getNumbers().forEach((c: any) => {
      let completed = 0;
      let failed = 0;
      this.bdbFolderList[this.getLetters(c)] && this.bdbFolderList[this.getLetters(c)].forEach((data: any) => {
        if (data.total_files > 0) {
          completed += data.total_files;
        } else {
          failed += 1;
        }
      });
      this.graphList[0].push(completed);
      this.graphList[1].push(failed);
    })
  }

  calculateNumberOfRecords() {
    let total = 0;
    this.getNumbers().forEach((c: any) => {
      this.bdbFolderList[this.getLetters(c)] && this.bdbFolderList[this.getLetters(c)].forEach((data: any) => {
        total += data.total_files;
      });
    });
    return total
    // if(total==this.totalFolders){
    //   return 0
    // }else{
    // return total-this.totalFolders;
    // }
  }

  completedFileSeggregationNum() {
    let totalRecords = this.calculateNumberOfRecords();
    console.log("this output is", totalRecords)
    return totalRecords;
  }

  openUnclassified() {
    localStorage.setItem('letter', 'unclassified');

    let path = JSON.parse(localStorage.getItem('output'));
    path.pop();
    path.push('Unclassified');

    localStorage.setItem("output", JSON.stringify(path));

    this._common.$refreshDirectories.next('');
  }

  drag(event: any) {
    if (event.screenY < 200) {
      this._common.containerRef.scrollTop -= 15;
    }
    if (event.screenY > 744) {
      this._common.containerRef.scrollTop += 15;
    }
  }

  prevFolderList: any[] = [];
  dropUnclassifiedFile(event: any, folderPath: string, letterNum: number) {
    event.preventDefault();
    console.log(event.dataTransfer.getData("filepath"), folderPath);

    this._bdbService.moveDirectories(folderPath, event.dataTransfer.getData("filepath")).subscribe(res => {
      console.log(res);

      let folderName = folderPath.split('/').pop();

      this.prevFolderList = JSON.parse(localStorage.getItem('bible_folder_list'));

      let folderIndex = this.prevFolderList[letterNum][this.getLetters(letterNum)].findIndex((res: any) => {
        return res.name === folderName;
      });

      this.prevFolderList[letterNum][this.getLetters(letterNum)][folderIndex].total_files += 1;

      this.substractRecordCount(letterNum);

      localStorage.setItem('bible_folder_list', JSON.stringify(this.prevFolderList));
      this.listDirectories();
    })
  }

  substractRecordCount(letterNum: any) {
    console.log(this.getLetters(letterNum), this.currFolderName);
    if (!this.currFolderName || !letterNum) return;
    let folderIndex = this.prevFolderList[letterNum][this.getLetters(letterNum)].findIndex((res: any) => {
      return res.name === this.currFolderName;
    });

    this.prevFolderList[letterNum][this.getLetters(letterNum)][folderIndex].total_files -= 1;
  }

  currFolderName: string = '';
  dragStart(event: any, filePath: string, unclassified: boolean = false) {

    if (unclassified) {
      this.currFolderName = '';
    } else {
      this.currFolderName = JSON.parse(localStorage.getItem('output')).pop();
    }

    event.dataTransfer.setData('filepath', filePath);
  }

  unselectAllDir() {
    this.getNumbers().forEach((c) => {
      this.bdbFolderList[this.getLetters(c)] && this.bdbFolderList[this.getLetters(c)].forEach((c: any) => {
        c.isSelected = false;
      })
    });

    this.unclassified.forEach((c: any) => {
      c.isSelected = false;
    });
  }

  download() {
    let foldersToDownload: any[] = [];
    this.getNumbers().forEach((c) => {
      this.bdbFolderList[this.getLetters(c)] && this.bdbFolderList[this.getLetters(c)].forEach((c: any) => {
        if (c.isSelected) {
          foldersToDownload.push(c.path.slice(14) + '/' + c.name);
        }
      })
    });

    this.unclassified.forEach((c: any) => {
      if (c.isSelected) {
        foldersToDownload.push(c.path.slice(14) + '/' + c.name);
      }
    });
    console.log(foldersToDownload);

    if (foldersToDownload.length === 0) {
      return;
    }

    this.processDownload(foldersToDownload, this.base_path);
  }

  processDownload(foldersToDownload: any[], base_path: string) {
    this._bdbService.download(foldersToDownload, base_path).subscribe(res => {
      if (res.type === HttpEventType.DownloadProgress) {
        this._common.showDownloadModal = true;
        this._ngxService.stop();
        const percentDone = Math.round(100 * res.loaded / res.total);
        this._common.downloadedData = res.loaded;
        this._common.totalDownloadFileSize = res.total;
        this._common.downloadProgress = percentDone;
      }
      if (res.type === HttpEventType.Response) {
        this.unselectAllDir();
        this._common.downloadComplete = true;
        this.isDownloadAllProcessing = false;
        this._common.showBuildBibleDownload.next(false)


        let dateTime = foldersToDownload[0].split('/').pop().split(".")[0] + "_" + new Date().toLocaleTimeString() + "_" + new Date().toLocaleDateString('en-IN').toString();

        console.log(dateTime);

        this._FileSaverService.save((<any>res).body, dateTime);
      }
    });
  }

  getPrevFolders(letter: any) {
    this.bibleFolderList = JSON.parse(localStorage.getItem('bible_folder_list'));

    return this.bibleFolderList && this.bibleFolderList[letter][this.getLetters(letter)] || [];
  }

  downloadAll() {
    console.log(this.router.url.split('/')[2], JSON.parse(localStorage.getItem('output')));

    this.isDownloadAllProcessing = true;
    this._common.showBuildBibleDownload.next(true)
    this.processDownload([this._auth.org_name + '/' + this._auth.user_name + '/' + JSON.parse(localStorage.getItem('output')).join('/')], this.base_path);
  }

  delete() {
    let foldersToDelete: any[] = [];
    this.getNumbers().forEach((c) => {
      this.bdbFolderList[this.getLetters(c)] && this.bdbFolderList[this.getLetters(c)].forEach((c: any) => {
        if (c.isSelected) {
          foldersToDelete.push(c.path + '/' + c.name);
        }
      })
    });

    this._bdbService.delete(foldersToDelete, this.base_path).subscribe(res => {
      this.unselectAllDir();
      this.listDirectories();
      this._modal.showMsg(res.res_str, "Deleted!", "success");
      console.log(res);
    })
  }

  showAllFile() {
    this.fullView = !this.fullView
  }

  selectAlphabate(event: any, letter: number) {
    let alphabate = this.getLetters(letter)
    console.log("selected alphabate is", this.getLetters(letter), event.target.checked)
    if (event.target.checked) {
      this.bdbFolderList[alphabate].forEach((ele: any) => {
        ele.isSelected = true
      })
    } else {
      this.bdbFolderList[alphabate].forEach((ele: any) => {
        ele.isSelected = false
      })
    }
  }
  // -------------varify---------------------------
  verifyFunc(res: string) {
    let operation: any
    if (res == "verify") {
      operation = 1
    } else if (res == "not-verify") {
      operation = 0
    } else if (res == "tbd") {
      operation = 2
    }
    let foldersToDownload: any[] = [];
    this.getNumbers().forEach((c) => {
      this.bdbFolderList[this.getLetters(c)] && this.bdbFolderList[this.getLetters(c)].forEach((c: any) => {
        if (c.isSelected) {
          console.log(c.path)
          foldersToDownload.push(c.name);
        }
      })
    });

    if (this.bdbFolderList.length <= 0 && foldersToDownload.length <= 0) {
      this._modal.showMsg("No folder is selected", "Error!", "error");
      return;
    }

    console.log(foldersToDownload);
    let path = this.path
    let sub = path.substring(0, path.indexOf('/output'));
    console.log("path is>>", sub, operation)
    // formData.append("dir_path", path);
    this.verifyFuncAPI(sub, operation, foldersToDownload)
  }
  verifyFuncAPI(projPath: string, operation: any, folderlist: any) {

    // let ind= x.indexOf('output');
    // var result =  x.substring(0, remove_after);
    let formData = new FormData;

    // formData.append("dir_path", path);
    // formData.append("dir_path_g", gpath);
    formData.append("user_id", this._auth.user_id);
    formData.append("proj_folder", JSON.stringify(folderlist));
    formData.append("projectpath", projPath);
    formData.append("is_operation", operation);
    formData.append("full_path", this.path)


    this.http.post('/delivery_bible/proj_approve/', formData).subscribe((res: any) => {
      console.log("varify res is ", res)
      this._common.$varifyFolder.next('')
      setTimeout(() => {
        this._modal.showVarifyPopup(res.res_str);
      }, 1000);
      // this.ngOnInit()
      this.listDirectories()
    });
  }
}

