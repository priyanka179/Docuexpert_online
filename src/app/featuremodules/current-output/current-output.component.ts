import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonnService } from 'src/app/_helpers/common/commonn.service';
declare var Papa: any;

@Component({
  selector: 'app-current-output',
  templateUrl: './current-output.component.html',
  styleUrls: ['./current-output.component.scss']
})
export class CurrentOutputComponent implements OnInit {

  viewName: string = "Browsable View";
  switchViewValue: boolean = false;
  showTableView: boolean = false;
  hideCsv: boolean = false;
  hidePdf: boolean = false;

  showPdfCsvSwitch: boolean = true;
  show_C_NC_Switch: boolean = true;

  tableData: any = [];

  url: string = "https://research.google.com/pubs/archive/44678.pdf";

  browsableSize: number = 0;
  currIndex: number = 1;

  pdf_C_url: any = null;
  pdf_NC_url: any = null;

  highlight_pdf_C_url: any = null;
  highlight_pdf_NC_url: any = null;

  redact_pdf_C_url: any = null;
  redact_pdf_NC_url: any = null;

  cversion: boolean = true;

  csvData: any[] = [];

  csvMaxCols: number = 0;

  emptyData: boolean = false;
  error: boolean = false;

  browsable_list_size: number = 0;

  feature: string = "";

  tableViewFeatureList: any[] = [];

  redactInfoViewType: string = "Highlight";

  hideViewFeatureList: any[] = ['Bookmark Based Split', 'Document Classification', 'Extractive Summary'];

  matched_Color_Lang_List: string[] = [];
  colorLang_NC_Pdf: any = {};
  currentMatched_Color_lang: string = '';

  avionicsPdfCount: any = 0;

  bdbFolderList: any[] = [];

  bdbPath: string = "";

  constructor(public _common: CommonnService, private _auth: AuthService, private http: HttpClient, private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit(): void {
    this.feature = localStorage.getItem('feature');
    if (this.feature === 'NIS calculation' || this.feature === 'Back2birth calculation') {
      this.hideCsv = false;
      this.hidePdf = true;
      this.showPdfCsvSwitch = false;
      this.show_C_NC_Switch = false;

      this.emptyData = false;
      this.error = false;

      this.browsable_list_size = parseInt(localStorage.getItem('browsable_list_size') || '0');

      this.csvData = [
        ['01-01-2000', '01-01-2005', '0'],
        ['01-01-2005', '03-08-2008', '1'],
        ['04-08-2008', '15-08-2009', '1'],
      ]

      return;
    }
    else if (this.feature === 'Avionics listing') {
      this.showPdfCsvSwitch = false;
      this.show_C_NC_Switch = false;

      this.emptyData = false;
      this.error = false;

      this.browsable_list_size = parseInt(localStorage.getItem('browsable_list_size') || '0');
      this.avionicsPdfCount = parseInt(localStorage.getItem('Avionics Pdf count') || '0');
      this.pdf_C_url = this.sanitizer.bypassSecurityTrustResourceUrl('http://www.africau.edu/images/default/sample.pdf');

      if (this.avionicsPdfCount === 2) {
        this.hideCsv = false;
        this.hidePdf = true;
      }

      this.csvData = [
        ['', 'occm', '', '', '', , '', '', '', 'avionics file', '', ''],
        ['File type', 'Part Number1', 'PN Count', 'Serial Number1', 'Found in Input', '', '', '', 'File type', 'Part Number2', 'Serial Number2', 'Found in Avionics'],
        ['OCCM', '1803B0000+AC0-02', '2', '1803B00LI002473', '1', '', '', '', 'Avionics', '1803B0000+AC0-02', '1803B00LI002473', '1'],
        ['OCCM', '87292325V07', '1', 'VL2062007824', '1', '', '', '', 'Avionics', '87292325V07', 'VL2062007824', '0'],
        ['OCCM', '767584J', '2', 'AAAY005229', '0', '', '', '', 'Avionics', '767584J', 'AAAY005229', '1'],
        ['OCCM', 'B372BAM0515', '2', '5849', '0', '', '', '', 'Avionics', 'B372BAM0515', '5849', '1'],
        ['OCCM', '664700500A4D', '2', '11718', '1', '', '', '', 'Avionics', '664700500A4D', '11718', '0']
      ];

      this.prevCsvData = this.csvData;

      console.log(this.avionicsPdfCount);

      return;
    }
    // else if (this.feature === 'Delivery Bible') {
    //   this.hideCsv = false;
    //   this.hidePdf = true;
    //   this.showPdfCsvSwitch = false;
    //   this.show_C_NC_Switch = false;

    //   this.emptyData = false;
    //   this.error = false;

    //   this.browsable_list_size = parseInt(localStorage.getItem('browsable_list_size') || '0');

    //   this.csvData = [
    //     ['SVA001'],
    //     ['SVA002'],
    //     ['SVA003'],
    //     ['SVA004'],
    //     ['SVA005'],
    //     ['SVA006'],
    //     ['SVA007 A'],
    //     ['SVA007 B'],
    //     ['SVA007 C'],
    //     ['SVA007 D'],
    //     ['SVA007 E'],
    //     ['SVA007 F'],
    //     ['SVA007 G'],
    //     ['SVA007 H'],
    //     ['SVA007 I'],
    //     ['SVA007 J'],
    //     ['SVA008'],
    //     ['SVA009'],
    //     ['A010'],
    //     ['A011'],
    //     ['SVB001'],
    //     ['SVB002'],
    //     ['SVB003'],
    //     ['SVB004'],
    //     ['SVB005'],
    //     ['SVB006'],
    //     ['SVB007'],
    //     ['SVB008'],
    //     ['SVB009'],
    //   ]

    //   this.bdbFolderList = [
    //     {
    //       file_counts: { pdf: 1 },
    //       help_str: "/home/statvalu-local/mycontainer/Input_Folder/AR@online/Anshu/newtest",
    //       isSelected: false,
    //       is_directory: true,
    //       name: "SVA001",
    //       path: "Input_Folder/AR@online/Anshu",
    //       total_dirs: 0,
    //       total_files: 1,
    //       type: "pdf",
    //       directory: 'Folder'
    //     },
    //     {
    //       file_counts: { pdf: 1 },
    //       help_str: "/home/statvalu-local/mycontainer/Input_Folder/AR@online/Anshu/newtest",
    //       isSelected: false,
    //       is_directory: true,
    //       name: "SVA002",
    //       path: "Input_Folder/AR@online/Anshu",
    //       total_dirs: 0,
    //       total_files: 1,
    //       type: "pdf",
    //       directory: 'Folder'
    //     },
    //     {
    //       file_counts: { pdf: 1 },
    //       help_str: "/home/statvalu-local/mycontainer/Input_Folder/AR@online/Anshu/newtest",
    //       isSelected: false,
    //       is_directory: true,
    //       name: "SVA003",
    //       path: "Input_Folder/AR@online/Anshu",
    //       total_dirs: 0,
    //       total_files: 1,
    //       type: "pdf",
    //       directory: 'Folder'
    //     },
    //     {
    //       file_counts: { pdf: 1 },
    //       help_str: "/home/statvalu-local/mycontainer/Input_Folder/AR@online/Anshu/newtest",
    //       isSelected: false,
    //       is_directory: true,
    //       name: "SVA004",
    //       path: "Input_Folder/AR@online/Anshu",
    //       total_dirs: 0,
    //       total_files: 1,
    //       type: "pdf",
    //       directory: 'Folder'
    //     },
    //     {
    //       file_counts: { pdf: 1 },
    //       help_str: "/home/statvalu-local/mycontainer/Input_Folder/AR@online/Anshu/newtest",
    //       isSelected: false,
    //       is_directory: true,
    //       name: "SVA005",
    //       path: "Input_Folder/AR@online/Anshu",
    //       total_dirs: 0,
    //       total_files: 1,
    //       type: "pdf",
    //       directory: 'Folder'
    //     },
    //     {
    //       file_counts: { pdf: 1 },
    //       help_str: "/home/statvalu-local/mycontainer/Input_Folder/AR@online/Anshu/newtest",
    //       isSelected: false,
    //       is_directory: true,
    //       name: "SVS005",
    //       path: "Input_Folder/AR@online/Anshu",
    //       total_dirs: 0,
    //       total_files: 1,
    //       type: "pdf",
    //       directory: 'Folder'
    //     },
    //   ];

    //   let bdbFolderListAlphabatically:any[] = [];
    //   this.bdbFolderList.forEach(element => {
    //     let firstLetter = element.name.charAt(0).toUpperCase();
    //     if (!bdbFolderListAlphabatically[firstLetter]) {
    //       bdbFolderListAlphabatically[firstLetter] = [];
    //     }
    //     bdbFolderListAlphabatically[firstLetter].push(element);
    //   })

    //   console.log(bdbFolderListAlphabatically);

    //   this.bdbFolderList = bdbFolderListAlphabatically;
      
    //   return;
    // }

    this._common.$tableViewData.subscribe(data => {
      console.log(data);

      this.tableData = data;
    });
    this._common.$updateCurrentOutput.subscribe(data => {
      this.feature = localStorage.getItem('feature');
      let req_id = localStorage.getItem('request_id');
      this.browsable_list_size = parseInt(localStorage.getItem('browsable_list_size') || '0');
      if (this.feature && req_id && this.browsable_list_size >= 0) {
        this.browsable_list_size > 0 ? this.getCurrentOutputData() : this.showError();
        console.log(this.error, this.emptyData);
      } else {
        this.emptyData = true;
        this.error = false;
      }
    });
  }

  prevCsvData: any[] = [];
  showAvionics(isOccmChecked: boolean, isAvionicsChecked: boolean) {
    this.csvData = this.prevCsvData;
    console.log(isOccmChecked, isAvionicsChecked);

    if (isOccmChecked && !isAvionicsChecked) {
      let csvArr: any[] = [
        ['', 'occm', '', '', '', , '', '', '', 'avionics file', '', ''],
        ['File type', 'Part Number1', 'PN Count', 'Serial Number1', 'Found in Input', '', '', '', 'File type', 'Part Number2', 'Serial Number2', 'Found in Avionics']
      ];
      this.csvData.forEach((data, index) => {
        if (index > 0 && data[4] === '1') {
          csvArr.push(data);
        }
      });
      this.csvData = csvArr;
    }
    else if (!isOccmChecked && isAvionicsChecked) {
      let csvArr: any[] = [
        ['', 'occm', '', '', '', , '', '', '', 'avionics file', '', ''],
        ['File type', 'Part Number1', 'PN Count', 'Serial Number1', 'Found in Input', '', '', '', 'File type', 'Part Number2', 'Serial Number2', 'Found in Avionics']
      ];
      this.csvData.forEach((data, index) => {
        if (index > 0 && data[11] === '1') {
          csvArr.push(data);
        }
      });
      this.csvData = csvArr;
    }
    else if (isOccmChecked && isAvionicsChecked) {
      this.showMatchedOccmAvionics();
    }
    else {
      this.csvData = this.prevCsvData;
    }
  }

  showMatchedOccmAvionics() {
    let csvArr: any[] = [
      ['', 'occm', '', '', '', , '', '', '', 'avionics file', '', ''],
      ['File type', 'Part Number1', 'PN Count', 'Serial Number1', 'Found in Input', '', '', '', 'File type', 'Part Number2', 'Serial Number2', 'Found in Avionics']
    ];
    this.csvData.forEach((data, index) => {
      if (index > 1) {
        if (data[4] === '1' && data[11] === '1') {
          csvArr.push(data);
        }
      }
    });
    this.csvData = csvArr;
  }

  // showAvionicsFile(isOccmChecked: boolean,isAvionicsChecked: boolean) {
  //   this.csvData = this.prevCsvData;
  //   if (!isOccmChecked && isAvionicsChecked) {
  //     let csvArr: any[] = [];
  //     this.csvData.forEach((data, index) => {
  //       if (index > 0) {
  //         csvArr.push(data.slice(4, 7));
  //       }
  //     });
  //     this.csvData = csvArr;
  //   }
  //   else if (isOccmChecked && !isAvionicsChecked) {
  //     let csvArr: any[] = [];
  //     this.csvData.forEach((data, index) => {
  //       if (index > 0) {
  //         csvArr.push(data.slice(0, 4));
  //       }
  //     });
  //     this.csvData = csvArr;
  //   } 
  //   else if (isOccmChecked && isAvionicsChecked) {
  //     this.showMatchedOccmAvionics();
  //   }
  //   else {
  //     this.csvData = this.prevCsvData;
  //   }
  // }

  showFilteredRecords() {
    let csvArr: any[] = [];
    this.csvData.map(data => {
      csvArr.push(data.slice(0, 3));
    });
    // this.csvData = csvArr;
  }

  showError() {
    this.currIndex = 0;
    this.error = true;
    this.getCurrentOutputData();
  }

  setView() {
    console.log(this.switchViewValue);
    if (this.switchViewValue === true) {
      this.showTableView = true;
      this.viewName = "Table View";
    } else {
      this.showTableView = false;
      this.viewName = "Browsable View";
    }
  }

  bdbResult: boolean = false;
  getCurrentOutputData(index: string = this.currIndex.toString()) {
    let formdata = new FormData;

    formdata.append('user_id', this._auth.user_id.toString());
    formdata.append('feature', localStorage.getItem('feature'));
    formdata.append('request_id', localStorage.getItem('request_id'));
    formdata.append('index', index);

    this.pdf_C_url = null;
    this.pdf_NC_url = null;

    this.hideCsv = false;
    this.hidePdf = false;
    this.showPdfCsvSwitch = true;
    this.show_C_NC_Switch = true;

    this.matched_Color_Lang_List = [];
    this.colorLang_NC_Pdf = {};
    this.currentMatched_Color_lang = '';

    this.http.post('/web_feature/get_browsable_output/', formdata, { reportProgress: true, observe: 'events' }).subscribe((res: any) => {
      if (res.type === HttpEventType.DownloadProgress) {
        const percentDone = Math.round(100 * res.loaded / res.total);
        this._common.loaderText = `Fetching Output ${percentDone}%`;
      }
      if (this.feature === 'Delivery Bible') {
        this.hideCsv = false;
        this.hidePdf = true;
        this.showPdfCsvSwitch = false;
        this.show_C_NC_Switch = false;

        this.emptyData = false;
        this.error = false;

        this.bdbPath = res.body && res.body.res_data.browsable_view[0].Input.split('/').slice(0, -1).join('/');
        if(this.bdbPath) 
          this.bdbResult = true;
        console.log(res.body && res.body.res_data.browsable_view[0].Input);
      }
      this.browsableSize = parseInt(localStorage.getItem('browsable_list_size'));
      if (res.body) {
        this.tableData = res.body.res_data.table_view;
      }
      if (res.body && (res.body.res_data.is_browsable_view_available === true)) {
        console.log(res);

        this.emptyData = false;
        this.error = false;

        if (this.feature === 'Redact Personal Information') {
          this.showPdfCsvSwitch = false;
          this.redactPersonalInfo(res.body.res_data.browsable_view[0].Output);
          return;
        }

        if (res.body.res_data.browsable_view[0].view_type === 'pdf') {
          this.hideCsv = true;
          this.hidePdf = false;
          this.showPdfCsvSwitch = false;
          this.show_C_NC_Switch = true;
        }
        else if (res.body.res_data.browsable_view[0].view_type === 'csv') {
          this.hideCsv = false;
          this.hidePdf = true;
          this.showPdfCsvSwitch = false;
          this.show_C_NC_Switch = false;
        } else {
          this.hideCsv = false;
          this.hidePdf = false;
          this.showPdfCsvSwitch = true;
          this.show_C_NC_Switch = true;
        }

        if (this.hideViewFeatureList.includes(this.feature)) {
          this.showPdfCsvSwitch = false;
          this.show_C_NC_Switch = false;
        }

        let keys = Object.keys(res.body.res_data.browsable_view[0].Output);

        for (let i = 0; i < keys.length; i++) {
          let fileExt = keys[i].length >= 6 ? keys[i].trim().slice(keys[i].length - 6) : keys[i].trim().slice(keys[i].length - 4);
          console.log(fileExt);
          if (fileExt.includes('_C')) {
            this.readPdf(res.body.res_data.browsable_view[0].Output[keys[i]], '_C');
          }
          else if (fileExt.includes('NC')) {
            if (this.feature === 'Color Detection' || this.feature === 'Language Detection') {
              this.getMatchedColorsLang(keys[i], res.body.res_data.browsable_view[0].Output[keys[i]]);
            } else {
              this.readPdf(res.body.res_data.browsable_view[0].Output[keys[i]], 'NC');
            }
          }
          else if (fileExt.toLowerCase().includes('.csv')) {
            console.log("csv");

            this.readCsv(res.body.res_data.browsable_view[0].Output[keys[i]]);
          } else {
            this.readPdf(res.body.res_data.browsable_view[0].Output[keys[i]], '_C');
            this.show_C_NC_Switch = false;
          }
        }
      } else {
        // console.log(res);
        this.emptyData = false;
        this.error = true;
      }
    });
  }

  redactPersonalInfo(data: any) {
    let highlightKeys = Object.keys(data.Highlight);
    let redactKeys = Object.keys(data.Redact);

    console.log(highlightKeys, redactKeys);

    highlightKeys.forEach(key => {
      let fileExt = key.slice(key.length - 6);

      if (fileExt.includes('_C')) {
        this.highlight_pdf_C_url = this.readPdf(data['Highlight'][key], '_C');
      }
      else if (fileExt.includes('NC')) {
        this.highlight_pdf_NC_url = this.readPdf(data['Highlight'][key], 'NC');
      }
    });

    redactKeys.forEach(key => {
      let fileExt = key.slice(key.length - 6);

      if (fileExt.includes('_C')) {
        this.redact_pdf_C_url = this.readPdf(data['Redact'][key], '_C');
      }
      else if (fileExt.includes('NC')) {
        this.redact_pdf_NC_url = this.readPdf(data['Redact'][key], 'NC');
      }
    });

  }

  getMatchedColorsLang(filename: string, pdfString: any) {
    let filenameArr = filename.split('_');
    let matched_color_lang = filenameArr[filenameArr.length - 2];
    this.matched_Color_Lang_List.push(matched_color_lang);

    this.colorLang_NC_Pdf[matched_color_lang] = this.readPdf(pdfString, 'NC');
    console.log(matched_color_lang, this.colorLang_NC_Pdf);
  }

  setNCMatchedUrl(matchedResult: string = this.matched_Color_Lang_List[0]) {
    if ((this.feature === 'Color Detection' || this.feature === 'Language Detection') && !this.cversion) {
      this.currentMatched_Color_lang = matchedResult;
      this.pdf_NC_url = this.colorLang_NC_Pdf[matchedResult];
    }
  }

  readPdf(res: any, type: string) {
    const byteCharacters = atob(res);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    let objectUrl = URL.createObjectURL(new Blob([byteArray], { type: "application/pdf" }));

    if (type === "_C") {
      this.pdf_C_url = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
    }
    else if (type === "NC") {
      this.pdf_NC_url = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
  }

  readCsv(csvString: string) {
    let csvDataParse = Papa.parse(atob(csvString));
    this.csvData = csvDataParse.data;
    this.csvMaxCols = this.csvData[0].length;
    console.log(this.csvData);
  }

  checkCsvEmptyData(data: any[], cellData: string): boolean {
    if (data.length === 1) {
      return cellData ? true : false;
    } else {
      return true;
    }
  }

  redirectUser(path: string) {
    if (path.includes('Err_Info')) {
      this._common.redirectToDir(path, 'err')
    } else {
      this._common.redirectToDir(path, 'req')
    }
  }

  nextPage() {
    if (this.currIndex < this.browsable_list_size) {
      this.currIndex++;
      this.getCurrentOutputData(this.currIndex.toString());
    }
  }

  prevPage() {
    if (this.currIndex > 1) {
      this.currIndex--;
      this.getCurrentOutputData(this.currIndex.toString());
    }
  }

  isUrl(str: string) {
    let basePathList = ['Input', 'Req', 'Err_Info', 'Output','G_input'];

    let isUrl = basePathList.some(basePath => {
      if (str.includes(basePath)) {
        return true;
      } else {
        return false;
      }
    });

    return isUrl;
  }

  redirectToDir(path: string) {
    this._common.$hideExternalViewer.next('');
    console.log(path);

    if (path.includes('Input')) {
      this._common.redirectToDir(path, 'input');
    } else if (path.includes('Req')) {
      this._common.redirectToDir(path, 'req');
    } else if (path.includes('Err_Info')) {
      this._common.redirectToDir(path, 'err');
    } else if (path.includes('Output')) {
      this._common.redirectToDir(path, 'output');
    }else if (path.includes('G_input')) {
      path=path+"/"
      this._common.redirectToDir(path, 'input');
    }

    // window.location.reload();
  }

}

